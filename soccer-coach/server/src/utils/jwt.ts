import jwt from 'jsonwebtoken';
import { UserPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export const generateAccessToken = (payload: UserPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const generateRefreshToken = (payload: UserPayload): string => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  });
};

export const verifyAccessToken = (token: string): UserPayload => {
  return jwt.verify(token, JWT_SECRET) as UserPayload;
};

export const verifyRefreshToken = (token: string): UserPayload => {
  return jwt.verify(token, JWT_REFRESH_SECRET) as UserPayload;
};

export const generateTokens = (payload: UserPayload): { token: string; refreshToken: string } => {
  return {
    token: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};


