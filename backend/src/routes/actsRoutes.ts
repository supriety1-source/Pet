import { Router } from 'express';
import {
  createAct,
  createActValidation,
  getMyActs,
  getCommunityFeed,
  getActById,
  reactToAct,
  unreactToAct,
  commentOnAct,
} from '../controllers/actsController';
import { authenticateToken } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.post('/', upload.single('media'), createActValidation, createAct);
router.get('/my-acts', getMyActs);
router.get('/feed', getCommunityFeed);
router.get('/:id', getActById);
router.post('/:actId/react', reactToAct);
router.delete('/:actId/react', unreactToAct);
router.post('/:actId/comment', commentOnAct);

export default router;
