import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import prisma from './database';
import { UserPayload } from '../types';

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'default-secret-key',
};

// JWT Strategy
passport.use(
  new JwtStrategy(jwtOptions, async (payload: UserPayload, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: payload.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      });

      if (user) {
        return done(null, {
          id: user.id,
          email: user.email,
          role: user.role,
        });
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

// Local Strategy (Email/Password)
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email: string, password: string, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        });

        if (!user) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        if (!user.password) {
          return done(null, false, { message: 'Please use social login for this account' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        return done(null, {
          id: user.id,
          email: user.email,
          role: user.role,
        });
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

export default passport;


