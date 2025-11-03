import { Router } from 'express';
import path from 'path';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { uploadVideo } from '../middleware/upload';
import prisma from '../config/database';
import { AuthenticatedRequest, UserRole } from '../types';
import { NotFoundError } from '../utils/errors';

const router = Router();

// Upload video
router.post(
  '/upload',
  authenticate,
  uploadVideo.single('video'),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No video file uploaded',
      });
    }

    const { sessionId } = req.body;
    const user = req.user!;

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const videoUrl = `${baseUrl}/uploads/${req.file.filename}`;

    const video = await prisma.video.create({
      data: {
        url: videoUrl,
        filename: req.file.filename,
        size: req.file.size,
        userId: user.id,
        sessionId: sessionId || null,
      },
    });

    res.status(201).json({
      success: true,
      video: {
        id: video.id,
        url: video.url,
        createdAt: video.createdAt,
      },
      videoId: video.id,
    });
  })
);

// Get videos
router.get(
  '/',
  authenticate,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { sessionId } = req.query;
    const user = req.user!;

    const where: any = {};

    if (user.role === 'student') {
      where.userId = user.id;
    } else if (user.role === 'coach') {
      // Coaches can see videos from their sessions
      where.session = {
        mentorId: user.id,
      };
    }

    if (sessionId) {
      where.sessionId = sessionId as string;
    }

    const videos = await prisma.video.findMany({
      where,
      include: {
        feedback: {
          select: {
            id: true,
            rating: true,
            comments: true,
            improvements: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedVideos = videos.map((video) => ({
      id: video.id,
      url: video.url,
      filename: video.filename,
      size: video.size,
      duration: video.duration,
      sessionId: video.sessionId,
      createdAt: video.createdAt,
      feedback: video.feedback
        ? {
            ...video.feedback,
            improvements: video.feedback.improvements
              ? JSON.parse(video.feedback.improvements)
              : [],
          }
        : null,
    }));

    res.json({
      success: true,
      videos: formattedVideos,
    });
  })
);

// Get video feedback
router.get(
  '/:id/feedback',
  authenticate,
  asyncHandler(async (req, res) => {
    const video = await prisma.video.findUnique({
      where: { id: req.params.id },
      include: {
        feedback: true,
      },
    });

    if (!video) {
      throw new NotFoundError('Video');
    }

    if (!video.feedback) {
      return res.json({
        success: true,
        feedback: null,
        message: 'Feedback not available yet',
      });
    }

    res.json({
      success: true,
      feedback: {
        ...video.feedback,
        improvements: video.feedback.improvements
          ? JSON.parse(video.feedback.improvements)
          : [],
      },
    });
  })
);

// Provide feedback (Coach only)
router.post(
  '/:id/feedback',
  authenticate,
  requireRole(UserRole.COACH),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { rating, comments, improvements } = req.body;

    const video = await prisma.video.findUnique({
      where: { id: req.params.id },
      include: {
        session: true,
      },
    });

    if (!video) {
      throw new NotFoundError('Video');
    }

    // Verify coach owns the session
    if (video.session && video.session.mentorId !== req.user!.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to provide feedback for this video',
      });
    }

    const feedback = await prisma.videoFeedback.upsert({
      where: { videoId: video.id },
      update: {
        rating: rating || undefined,
        comments,
        improvements: improvements ? JSON.stringify(improvements) : undefined,
      },
      create: {
        videoId: video.id,
        coachId: req.user!.id,
        rating: rating || undefined,
        comments,
        improvements: improvements ? JSON.stringify(improvements) : undefined,
      },
    });

    res.json({
      success: true,
      feedback: {
        ...feedback,
        improvements: feedback.improvements ? JSON.parse(feedback.improvements) : [],
      },
    });
  })
);

export default router;

