import { Router } from 'express';
import {
  getAllLaunchSales,
  getActiveLaunchSales,
  getLaunchSaleByProductId,
  createLaunchSale,
  updateLaunchSale,
  toggleLaunchSaleStatus,
  deleteLaunchSale,
} from '../controllers/launchSale.controller.js';
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// Public routes (storefront countdown & dynamic pricing)
router.get('/active', getActiveLaunchSales);
router.get('/product/:productIdOrHandle', getLaunchSaleByProductId);

// Protected admin routes
router.get('/', authenticate, requireAdmin, getAllLaunchSales);
router.post('/', authenticate, requireAdmin, createLaunchSale);
router.put('/:id', authenticate, requireAdmin, updateLaunchSale);
router.patch('/:id/status', authenticate, requireAdmin, toggleLaunchSaleStatus);
router.delete('/:id', authenticate, requireAdmin, deleteLaunchSale);

export default router;
