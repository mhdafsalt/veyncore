import { Router } from 'express';
import {
  getProducts,
  getProductByHandleOrId,
  createProduct,
  updateProduct,
  deleteProduct,
  seedProducts,
} from '../controllers/product.controller.js';
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// Public routes (used by storefront & catalog)
router.get('/', getProducts);
router.get('/:handleOrId', getProductByHandleOrId);

// Admin-protected routes
router.post('/', authenticate, requireAdmin, createProduct);
router.put('/:id', authenticate, requireAdmin, updateProduct);
router.delete('/:id', authenticate, requireAdmin, deleteProduct);
router.post('/admin/seed', authenticate, requireAdmin, seedProducts);

export default router;
