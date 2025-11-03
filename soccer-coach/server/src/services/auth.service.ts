import bcrypt from 'bcryptjs';
import prisma from '../config/database';
import { generateTokens } from '../utils/jwt';
import { ConflictError, AuthenticationError, NotFoundError } from '../utils/errors';
import { SocialLoginPayload, UserPayload } from '../types';

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  role?: string;
}) => {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email.toLowerCase() },
  });

  if (existingUser) {
    throw new ConflictError('User with this email already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email.toLowerCase(),
      password: hashedPassword,
      role: data.role || 'student',
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      phone: true,
      bio: true,
      createdAt: true,
    },
  });

  const payload: UserPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const tokens = generateTokens(payload);

  // Save refresh token
  await prisma.refreshToken.create({
    data: {
      token: tokens.refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  return {
    token: tokens.token,
    refreshToken: tokens.refreshToken,
    user,
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user || !user.password) {
    throw new AuthenticationError('Invalid email or password');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw new AuthenticationError('Invalid email or password');
  }

  const payload: UserPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const tokens = generateTokens(payload);

  // Save refresh token
  await prisma.refreshToken.create({
    data: {
      token: tokens.refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    token: tokens.token,
    refreshToken: tokens.refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
    },
  };
};

export const socialLogin = async (payload: SocialLoginPayload) => {
  const { provider, userInfo } = payload;

  if (!userInfo?.email) {
    throw new AuthenticationError('Email is required for social login');
  }

  // Find or create user
  let user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: userInfo.email.toLowerCase() },
        ...(provider === 'google' && userInfo.id ? [{ googleId: userInfo.id }] : []),
        ...(provider === 'facebook' && userInfo.id ? [{ facebookId: userInfo.id }] : []),
        ...(provider === 'apple' && userInfo.id ? [{ appleId: userInfo.id }] : []),
      ],
    },
  });

  if (!user) {
    // Create new user
    user = await prisma.user.create({
      data: {
        name: userInfo.name || 'User',
        email: userInfo.email.toLowerCase(),
        avatar: userInfo.picture,
        ...(provider === 'google' && userInfo.id ? { googleId: userInfo.id } : {}),
        ...(provider === 'facebook' && userInfo.id ? { facebookId: userInfo.id } : {}),
        ...(provider === 'apple' && userInfo.id ? { appleId: userInfo.id } : {}),
        role: 'student',
      },
    });
  } else {
    // Update OAuth ID if not set
    const updateData: any = {};
    if (provider === 'google' && userInfo.id && !user.googleId) {
      updateData.googleId = userInfo.id;
    }
    if (provider === 'facebook' && userInfo.id && !user.facebookId) {
      updateData.facebookId = userInfo.id;
    }
    if (provider === 'apple' && userInfo.id && !user.appleId) {
      updateData.appleId = userInfo.id;
    }
    if (Object.keys(updateData).length > 0) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: updateData,
      });
    }
  }

  const tokenPayload: UserPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const tokens = generateTokens(tokenPayload);

  // Save refresh token
  await prisma.refreshToken.create({
    data: {
      token: tokens.refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    token: tokens.token,
    refreshToken: tokens.refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  };
};

export const refreshTokenService = async (refreshToken: string) => {
  const tokenRecord = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });

  if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
    throw new AuthenticationError('Invalid or expired refresh token');
  }

  // Delete old refresh token
  await prisma.refreshToken.delete({
    where: { id: tokenRecord.id },
  });

  const payload: UserPayload = {
    id: tokenRecord.user.id,
    email: tokenRecord.user.email,
    role: tokenRecord.user.role,
  };

  const tokens = generateTokens(payload);

  // Save new refresh token
  await prisma.refreshToken.create({
    data: {
      token: tokens.refreshToken,
      userId: tokenRecord.user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    token: tokens.token,
    refreshToken: tokens.refreshToken,
  };
};

export const logoutUser = async (refreshToken: string) => {
  await prisma.refreshToken.deleteMany({
    where: { token: refreshToken },
  });
};


