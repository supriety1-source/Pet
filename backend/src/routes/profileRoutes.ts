import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { getProfile, updateProfile } from '../controllers/profileController.js';

const router = Router();

router.get('/:username', authenticate, getProfile);
router.patch('/', authenticate, updateProfile);

export default router;
