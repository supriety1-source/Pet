import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { updateAccount, updatePreferences, deleteAccount } from '../controllers/settingsController.js';

const router = Router();

router.patch('/account', authenticate, updateAccount);
router.patch('/preferences', authenticate, updatePreferences);
router.delete('/account', authenticate, deleteAccount);

export default router;
