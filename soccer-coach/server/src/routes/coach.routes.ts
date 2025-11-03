import { Router } from 'express';
import { query } from 'express-validator';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import prisma from '../config/database';
import { AuthenticatedRequest, UserRole } from '../types';

const router = Router();

// All routes require coach role
router.use(authenticate);
router.use(requireRole(UserRole.COACH));

// Get coach dashboard
router.get(
  '/dashboard',
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const coachId = req.user!.id;

    // Get statistics
    const [
      totalStudents,
      totalSessions,
      pendingVideos,
      upcomingSessions,
      recentSessions,
    ] = await Promise.all([
      // Total unique students
      prisma.session.groupBy({
        by: ['studentId'],
        where: {
          mentorId: coachId,
          studentId: { not: null },
        },
      }),

      // Total sessions
      prisma.session.count({
        where: {
          mentorId: coachId,
        },
      }),

      // Pending videos (videos without feedback)
      prisma.video.count({
        where: {
          session: {
            mentorId: coachId,
          },
          feedback: null,
        },
      }),

      // Upcoming sessions
      prisma.session.count({
        where: {
          mentorId: coachId,
          status: 'confirmed',
          date: {
            gte: new Date().toISOString().split('T')[0],
          },
        },
      }),

      // Recent sessions
      prisma.session.findMany({
        where: {
          mentorId: coachId,
        },
        take: 10,
        orderBy: {
          date: 'desc',
        },
        include: {
          student: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      }),
    ]);

    res.json({
      success: true,
      dashboard: {
        totalStudents: totalStudents.length,
        totalSessions,
        pendingVideos,
        upcomingSessions,
        recentSessions: recentSessions.map((session) => ({
          id: session.id,
          type: session.type,
          date: session.date,
          time: session.time,
          status: session.status,
          student: session.student,
        })),
      },
    });
  })
);

// Get coach users (students)
router.get(
  '/users',
  validate([
    query('search').optional().trim(),
    query('role').optional().isIn(['student', 'coach']),
  ]),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { search, role } = req.query;
    const coachId = req.user!.id;

    // Get students who have sessions with this coach
    const sessions = await prisma.session.findMany({
      where: {
        mentorId: coachId,
        studentId: { not: null },
      },
      select: {
        studentId: true,
      },
      distinct: ['studentId'],
    });

    const studentIds = sessions.map((s) => s.studentId).filter(Boolean) as string[];

    if (studentIds.length === 0) {
      return res.json({
        success: true,
        users: [],
      });
    }

    const where: any = {
      id: { in: studentIds },
      ...(role && { role }),
    };

    if (search) {
      where.OR = [
        { name: { contains: search as string } },
        { email: { contains: search as string } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        phone: true,
        createdAt: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    res.json({
      success: true,
      users,
    });
  })
);

// Update coach profile
router.put(
  '/profile',
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { name, bio, specialties, price, phone } = req.body;
    const coachId = req.user!.id;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (specialties) updateData.specialties = JSON.stringify(specialties);
    if (price !== undefined) updateData.price = price;
    if (phone !== undefined) updateData.phone = phone;

    const coach = await prisma.user.update({
      where: { id: coachId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        specialties: true,
        rating: true,
        price: true,
        phone: true,
      },
    });

    res.json({
      success: true,
      user: {
        ...coach,
        specialties: coach.specialties ? JSON.parse(coach.specialties) : [],
      },
    });
  })
);

export default router;


