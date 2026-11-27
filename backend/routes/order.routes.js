import { Router } from 'express';
import {
  createOrder,
  getOrderByNumber,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/order.controller.js';
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// Public routes: create order before WhatsApp handoff, or check order status
router.post('/', createOrder);
router.get('/:orderNumber', getOrderByNumber);

// Protected admin routes: order management
router.get('/', authenticate, requireAdmin, getAllOrders);
router.patch('/:id/status', authenticate, requireAdmin, updateOrderStatus);

export default router;
