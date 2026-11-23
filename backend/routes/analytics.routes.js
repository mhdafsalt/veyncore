import { Router } from 'express';
import {
  trackWhatsAppClick,
  getWhatsAppClicks,
} from '../controllers/analytics.controller.js';
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// Public route: track WhatsApp order button clicks
router.post('/whatsapp-click', trackWhatsAppClick);

// Protected admin route: view WhatsApp click interactions
router.get('/whatsapp-clicks', authenticate, requireAdmin, getWhatsAppClicks);

export default router;
