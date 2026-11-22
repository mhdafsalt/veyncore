import { Router } from 'express';
import {
  getAdminOverview,
  getAllUsers,
  updateUserRole,
  updateUserVip,
  deleteUser,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  seedProducts,
  getAllOrders,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  getStoreSettings,
  updateStoreSettings,
} from '../controllers/admin.controller.js';
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// Protect ALL admin routes with authenticate & requireAdmin
router.use(authenticate, requireAdmin);

// 1. Dashboard Overview
router.get('/overview', getAdminOverview);

// 2. Users
router.get('/users', getAllUsers);
router.patch('/users/:id/role', updateUserRole);
router.patch('/users/:id/vip', updateUserVip);
router.delete('/users/:id', deleteUser);

// 3. Products
router.get('/products', getAllProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.post('/products/seed', seedProducts);

// 4. Orders
router.get('/orders', getAllOrders);
router.post('/orders', createOrder);
router.patch('/orders/:id/status', updateOrderStatus);
router.delete('/orders/:id', deleteOrder);

// 5. Settings
router.get('/settings', getStoreSettings);
router.put('/settings', updateStoreSettings);

export default router;
