import { Router } from 'express';
import { body, query } from 'express-validator';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import prisma from '../config/database';
import { AuthenticatedRequest, UserRole, SessionStatus } from '../types';
import { NotFoundError, ConflictError } from '../utils/errors';

const router = Router();

// Get sessions
router.get(
  '/',
  authenticate,
  validate([
    query('type').optional().isIn(['individual', 'group']),
    query('status').optional().isIn(['pending', 'confirmed', 'completed', 'cancelled']),
  ]),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { type, status } = req.query;
    const user = req.user!;

    const where: any = {};

    if (user.role === 'student') {
      where.studentId = user.id;
    } else if (user.role === 'coach') {
      where.mentorId = user.id;
    }

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    const sessions = await prisma.session.findMany({
      where,
      include: {
        coach: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        student: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    const formattedSessions = sessions.map((session) => ({
      id: session.id,
      mentorId: session.mentorId,
      mentorName: session.coach.name,
      mentorAvatar: session.coach.avatar,
      studentId: session.studentId,
      studentName: session.student?.name,
      studentAvatar: session.student?.avatar,
      type: session.type,
      date: session.date,
      time: session.time,
      duration: session.duration,
      status: session.status,
      maxParticipants: session.maxParticipants,
      currentParticipants: session.currentParticipants,
      price: session.price,
      location: session.location,
      notes: session.notes,
      createdAt: session.createdAt,
    }));

    res.json({
      success: true,
      sessions: formattedSessions,
    });
  })
);

// Get session by ID
router.get(
  '/:id',
  authenticate,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = await prisma.session.findUnique({
      where: { id: req.params.id },
      include: {
        coach: {
          select: {
            id: true,
            name: true,
            avatar: true,
            email: true,
          },
        },
        student: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    if (!session) {
      throw new NotFoundError('Session');
    }

    res.json({
      success: true,
      ...session,
      mentorName: session.coach.name,
      mentorAvatar: session.coach.avatar,
    });
  })
);

// Create session
router.post(
  '/',
  authenticate,
  requireRole(UserRole.STUDENT),
  validate([
    body('mentorId').notEmpty().withMessage('Mentor ID is required'),
    body('type').isIn(['individual', 'group']).withMessage('Type must be individual or group'),
    body('date').notEmpty().withMessage('Date is required'),
    body('time').notEmpty().withMessage('Time is required'),
    body('duration').optional().isInt({ min: 15 }).withMessage('Duration must be at least 15 minutes'),
    body('maxParticipants').optional().isInt({ min: 2 }).withMessage('Max participants must be at least 2'),
  ]),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { mentorId, type, date, time, duration, maxParticipants } = req.body;
    const user = req.user!;

    // Verify mentor exists and is a coach
    const mentor = await prisma.user.findFirst({
      where: {
        id: mentorId,
        role: 'coach',
      },
    });

    if (!mentor) {
      throw new NotFoundError('Mentor');
    }

    const session = await prisma.session.create({
      data: {
        mentorId,
        studentId: user.id,
        type,
        date,
        time,
        duration: duration || 60,
        maxParticipants: type === 'group' ? maxParticipants : undefined,
        status: SessionStatus.PENDING,
        price: mentor.price || 50,
      },
      include: {
        coach: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      ...session,
      mentorName: session.coach.name,
      mentorAvatar: session.coach.avatar,
    });
  })
);

// Join session (for group sessions)
router.post(
  '/:id/join',
  authenticate,
  requireRole(UserRole.STUDENT),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = await prisma.session.findUnique({
      where: { id: req.params.id },
    });

    if (!session) {
      throw new NotFoundError('Session');
    }

    if (session.type !== 'group') {
      throw new ConflictError('Only group sessions can be joined');
    }

    if (session.status !== SessionStatus.CONFIRMED) {
      throw new ConflictError('Session is not available for joining');
    }

    if (session.currentParticipants >= (session.maxParticipants || 0)) {
      throw new ConflictError('Session is full');
    }

    // Update session
    const updatedSession = await prisma.session.update({
      where: { id: session.id },
      data: {
        currentParticipants: {
          increment: 1,
        },
        studentId: req.user!.id,
      },
      include: {
        coach: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: 'Successfully joined session',
      ...updatedSession,
      mentorName: updatedSession.coach.name,
      mentorAvatar: updatedSession.coach.avatar,
    });
  })
);

// Cancel session
router.post(
  '/:id/cancel',
  authenticate,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = await prisma.session.findUnique({
      where: { id: req.params.id },
    });

    if (!session) {
      throw new NotFoundError('Session');
    }

    // Check authorization
    if (session.mentorId !== req.user!.id && session.studentId !== req.user!.id) {
      throw new ConflictError('You do not have permission to cancel this session');
    }

    const updatedSession = await prisma.session.update({
      where: { id: session.id },
      data: {
        status: SessionStatus.CANCELLED,
      },
    });

    res.json({
      success: true,
      message: 'Session cancelled successfully',
      ...updatedSession,
    });
  })
);

export default router;


