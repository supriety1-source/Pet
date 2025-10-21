import { Router } from 'express';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';
import {
  listPendingActs,
  verifyAct,
  rejectAct,
  listUsers,
  getStatsOverview,
} from '../controllers/adminController.js';

const router = Router();

router.use(authenticate, authorizeAdmin);

router.get('/acts/pending', listPendingActs);
router.post('/acts/:id/verify', verifyAct);
router.post('/acts/:id/reject', rejectAct);
router.get('/users', listUsers);
router.get('/stats', getStatsOverview);

export default router;
