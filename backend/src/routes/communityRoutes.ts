import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { getCommunityFeed } from '../controllers/communityController.js';

const router = Router();

router.get('/', authenticate, getCommunityFeed);

export default router;
