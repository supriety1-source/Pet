import { Router } from 'express';
import { body } from 'express-validator';
import { signup, login, refresh, logout, forgotPassword } from '../controllers/authController.js';

const router = Router();

router.post(
  '/signup',
  [
    body('email').isEmail(),
    body('username').isLength({ min: 3 }),
    body('password').isLength({ min: 8 }),
  ],
  signup
);

router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);

export default router;
