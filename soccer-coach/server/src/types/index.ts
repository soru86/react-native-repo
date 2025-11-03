import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface UserPayload extends JwtPayload {
  id: string;
  email: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

export enum UserRole {
  STUDENT = 'student',
  COACH = 'coach',
}

export enum SessionType {
  INDIVIDUAL = 'individual',
  GROUP = 'group',
}

export enum SessionStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export interface SocialLoginPayload {
  provider: 'google' | 'facebook' | 'apple';
  token: string;
  userInfo?: {
    id?: string;
    email?: string;
    name?: string;
    picture?: string;
  };
}


