import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import prisma from '../config/database';
import { AuthenticatedRequest } from '../types';

const router = Router();

// Get user profile
router.get(
  '/profile',
  authenticate,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        phone: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      user,
    });
  })
);

// Update user profile
router.put(
  '/profile',
  authenticate,
  validate([
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('phone').optional().trim(),
    body('bio').optional().trim(),
    body('avatar').optional().isURL().withMessage('Avatar must be a valid URL'),
  ]),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { name, phone, bio, avatar } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        ...(name && { name }),
        ...(phone !== undefined && { phone }),
        ...(bio !== undefined && { bio }),
        ...(avatar !== undefined && { avatar }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        phone: true,
        bio: true,
        updatedAt: true,
      },
    });

    res.json({
      success: true,
      user,
    });
  })
);

export default router;


