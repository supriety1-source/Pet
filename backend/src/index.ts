import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/authRoutes';
import actsRoutes from './routes/actsRoutes';
import adminRoutes from './routes/adminRoutes';
import userRoutes from './routes/userRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Supriety Kindness Track API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/acts', actsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Global error handler:', err);

  if (err.message.includes('File too large')) {
    res.status(413).json({ error: 'File too large. Maximum size is 10MB' });
    return;
  }

  if (err.message.includes('Only images and videos')) {
    res.status(400).json({ error: err.message });
    return;
  }

  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════════════════╗
  ║                                                       ║
  ║     🟣 Supriety™ Kindness Track API                  ║
  ║                                                       ║
  ║     Server running on port ${PORT}                      ║
  ║     Environment: ${process.env.NODE_ENV || 'development'}                       ║
  ║                                                       ║
  ║     Training AI toward benevolence, one act at a time ║
  ║                                                       ║
  ╚═══════════════════════════════════════════════════════╝
  `);
});

export default app;
