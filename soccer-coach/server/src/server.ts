import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import './config/passport';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import mentorRoutes from './routes/mentor.routes';
import sessionRoutes from './routes/session.routes';
import videoRoutes from './routes/video.routes';
import paymentRoutes from './routes/payment.routes';
import coachRoutes from './routes/coach.routes';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport Middleware
app.use(passport.initialize());

// Static files for uploads
const uploadDir = process.env.UPLOAD_DIR || './uploads';
app.use('/uploads', express.static(path.resolve(uploadDir)));

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/coach', coachRoutes);

// 404 Handler
app.use(notFoundHandler);

// Error Handler
app.use(errorHandler);

// Listen on all network interfaces (0.0.0.0) to allow connections from physical devices
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Accessible from network devices on port ${PORT}`);
  console.log(`📱 For mobile testing, use: http://<YOUR_LOCAL_IP>:${PORT}/api`);
  
  // Log local IP addresses for convenience
  if (process.env.NODE_ENV !== 'production') {
    const os = require('os');
    const networkInterfaces = os.networkInterfaces();
    console.log('\n📍 Local network IP addresses:');
    Object.keys(networkInterfaces).forEach((interfaceName) => {
      networkInterfaces[interfaceName]?.forEach((iface) => {
        if (iface.family === 'IPv4' && !iface.internal) {
          console.log(`   - http://${iface.address}:${PORT}/api`);
        }
      });
    });
    console.log('');
  }
});

export default app;

