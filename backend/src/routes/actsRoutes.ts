import { Router } from 'express';
import {
  listActs,
  getAct,
  createAct,
  updateAct,
  deleteAct,
  reactToAct,
  commentOnAct,
  listComments,
} from '../controllers/actsController.js';
import { authenticate } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.get('/', authenticate, listActs);
router.get('/:id', authenticate, getAct);
router.post('/', authenticate, upload.single('media'), createAct);
router.patch('/:id', authenticate, upload.single('media'), updateAct);
router.delete('/:id', authenticate, deleteAct);
router.post('/:id/react', authenticate, reactToAct);
router.post('/:id/comments', authenticate, commentOnAct);
router.get('/:id/comments', authenticate, listComments);

export default router;
