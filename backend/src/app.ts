import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import authRoutes from './routes/authRoutes.js';
import actsRoutes from './routes/actsRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import { getDashboard } from './controllers/dashboardController.js';
import { authenticate } from './middleware/auth.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { ensureUploadsDir } from './services/uploadService.js';

export const createApp = () => {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  const uploadsPath = path.join(process.cwd(), 'backend', 'uploads');
  ensureUploadsDir();
  app.use('/uploads', express.static(uploadsPath));

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  app.use('/api/auth', authRoutes);
  app.get('/api/dashboard', authenticate, getDashboard);
  app.use('/api/acts', actsRoutes);
  app.use('/api/community', communityRoutes);
  app.use('/api/leaderboard', leaderboardRoutes);
  app.use('/api/profile', profileRoutes);
  app.use('/api/settings', settingsRoutes);
  app.use('/api/admin', adminRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
