import { Router } from 'express';
import { getAdminOverview, getAllUsers } from '../controllers/admin.controller.js';
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// Protect all admin routes with authentication AND requireAdmin middleware
router.use(authenticate, requireAdmin);

router.get('/overview', getAdminOverview);
router.get('/users', getAllUsers);

export default router;
