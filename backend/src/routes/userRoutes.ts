import { Router } from 'express';
import {
  getUserProfile,
  getLeaderboard,
  updateProfile,
} from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.get('/leaderboard', getLeaderboard);
router.get('/:username', getUserProfile);

// Authenticated routes
router.patch('/profile', authenticateToken, upload.single('avatar'), updateProfile);

export default router;
