import { Router } from 'express';
import {
  signup,
  signupValidation,
  login,
  loginValidation,
  refreshToken,
  getMe,
} from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);
router.post('/refresh', refreshToken);
router.get('/me', authenticateToken, getMe);

export default router;
