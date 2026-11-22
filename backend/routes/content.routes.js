import { Router } from 'express';
import {
  getContent,
  getSectionContent,
  updateSectionContent,
  seedContent,
} from '../controllers/content.controller.js';
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// Public routes (used by storefront: AnnouncementBar, HeroSection, SubCategories, etc.)
router.get('/', getContent);
router.get('/:section', getSectionContent);

// Admin-protected routes
router.put('/:section', authenticate, requireAdmin, updateSectionContent);
router.post('/admin/seed', authenticate, requireAdmin, seedContent);

export default router;
