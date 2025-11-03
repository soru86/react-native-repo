import { Router } from 'express';
import { query } from 'express-validator';
import { optionalAuth } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import prisma from '../config/database';
import { AuthenticatedRequest } from '../types';

const router = Router();

// Get all mentors (coaches)
router.get(
  '/',
  optionalAuth,
  validate([
    query('search').optional().trim(),
    query('specialty').optional().trim(),
  ]),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { search, specialty } = req.query;

    const where: any = {
      role: 'coach',
    };

    if (search) {
      where.OR = [
        { name: { contains: search as string } },
        { email: { contains: search as string } },
        { bio: { contains: search as string } },
      ];
    }

    if (specialty) {
      where.specialties = { contains: specialty as string };
    }

    const mentors = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        specialties: true,
        rating: true,
        totalSessions: true,
        price: true,
      },
      orderBy: {
        rating: 'desc',
      },
    });

    // Parse specialties from JSON string
    const formattedMentors = mentors.map((mentor) => ({
      ...mentor,
      specialties: mentor.specialties ? JSON.parse(mentor.specialties) : [],
    }));

    res.json({
      success: true,
      mentors: formattedMentors,
    });
  })
);

// Get mentor by ID
router.get(
  '/:id',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const mentor = await prisma.user.findFirst({
      where: {
        id: req.params.id,
        role: 'coach',
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        specialties: true,
        rating: true,
        totalSessions: true,
        price: true,
        createdAt: true,
      },
    });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found',
      });
    }

    res.json({
      success: true,
      ...mentor,
      specialties: mentor.specialties ? JSON.parse(mentor.specialties) : [],
    });
  })
);

export default router;


