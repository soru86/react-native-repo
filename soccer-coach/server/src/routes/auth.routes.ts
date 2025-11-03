import { Router } from 'express';
import { body } from 'express-validator';
import passport from 'passport';
import { validate } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticate } from '../middleware/auth';
import { AuthenticatedRequest } from '../types';
import {
  registerUser,
  loginUser,
  socialLogin,
  refreshTokenService,
  logoutUser,
} from '../services/auth.service';
import { generateTokens } from '../utils/jwt';

const router = Router();

// Register
router.post(
  '/register',
  validate([
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['student', 'coach']).withMessage('Role must be student or coach'),
  ]),
  asyncHandler(async (req, res) => {
    const result = await registerUser(req.body);
    res.status(201).json({
      success: true,
      ...result,
    });
  })
);

// Login
router.post(
  '/login',
  validate([
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ]),
  asyncHandler(async (req, res) => {
    const result = await loginUser(req.body.email, req.body.password);
    res.json({
      success: true,
      ...result,
    });
  })
);

// Social Login
router.post(
  '/social',
  validate([
    body('provider').isIn(['google', 'facebook', 'apple']).withMessage('Invalid provider'),
    body('token').notEmpty().withMessage('Token is required'),
    body('userInfo').optional().isObject(),
  ]),
  asyncHandler(async (req, res) => {
    const result = await socialLogin(req.body);
    res.json({
      success: true,
      ...result,
    });
  })
);

// Refresh Token
router.post(
  '/refresh',
  validate([body('refreshToken').notEmpty().withMessage('Refresh token is required')]),
  asyncHandler(async (req, res) => {
    const result = await refreshTokenService(req.body.refreshToken);
    res.json({
      success: true,
      ...result,
    });
  })
);

// Logout
router.post(
  '/logout',
  authenticate, // Require authentication
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    // Get refresh token from body if provided, otherwise try to get from stored tokens
    const refreshToken = req.body.refreshToken;
    if (refreshToken) {
      await logoutUser(refreshToken);
    }
    // Even if no refresh token, logout is successful (client-side token clearing)
    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  })
);

export default router;

