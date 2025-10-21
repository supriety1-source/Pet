import { Router } from 'express';
import {
  getPendingActs,
  verifyAct,
  rejectAct,
  getAdminStats,
  getAllUsers,
} from '../controllers/adminController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// All admin routes require authentication and admin privileges
router.use(authenticateToken);
router.use(requireAdmin);

router.get('/stats', getAdminStats);
router.get('/pending-acts', getPendingActs);
router.post('/acts/:actId/verify', verifyAct);
router.post('/acts/:actId/reject', rejectAct);
router.get('/users', getAllUsers);

export default router;
