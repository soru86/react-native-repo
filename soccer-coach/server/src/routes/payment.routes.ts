import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import prisma from '../config/database';
import { AuthenticatedRequest, PaymentStatus } from '../types';
import { NotFoundError } from '../utils/errors';

const router = Router();

// Create payment
router.post(
  '/',
  authenticate,
  validate([
    body('sessionId').notEmpty().withMessage('Session ID is required'),
    body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
    body('currency').optional().isIn(['USD', 'EUR', 'GBP']).withMessage('Invalid currency'),
  ]),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { sessionId, amount, currency = 'USD' } = req.body;
    const user = req.user!;

    // Verify session exists
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundError('Session');
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        sessionId,
        amount,
        currency,
        status: PaymentStatus.COMPLETED, // In production, integrate with payment gateway
      },
    });

    res.status(201).json({
      success: true,
      payment: {
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        createdAt: payment.createdAt,
      },
    });
  })
);

// Get payment status
router.get(
  '/:id',
  authenticate,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const payment = await prisma.payment.findUnique({
      where: { id: req.params.id },
      include: {
        session: {
          select: {
            id: true,
            type: true,
            date: true,
            time: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundError('Payment');
    }

    // Verify user owns the payment
    if (payment.userId !== req.user!.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    res.json({
      success: true,
      payment: {
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        sessionId: payment.sessionId,
        createdAt: payment.createdAt,
        session: payment.session,
      },
    });
  })
);

export default router;


