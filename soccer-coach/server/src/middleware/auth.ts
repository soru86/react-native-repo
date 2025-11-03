import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { AuthenticatedRequest, UserRole } from '../types';
import { AuthorizationError } from '../utils/errors';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: any, user: any, info: any) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'AUTHENTICATION_ERROR',
      });
    }
    (req as AuthenticatedRequest).user = user;
    next();
  })(req, res, next);
};

export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthenticatedRequest).user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'AUTHENTICATION_ERROR',
      });
    }

    if (!allowedRoles.includes(user.role as UserRole)) {
      throw new AuthorizationError('Insufficient permissions');
    }

    next();
  };
};

export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: any, user: any) => {
    if (user && !err) {
      (req as AuthenticatedRequest).user = user;
    }
    next();
  })(req, res, next);
};


