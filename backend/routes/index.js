import { Router } from 'express';
import authRoutes from './auth.routes.js';
import adminRoutes from './admin.routes.js';
import productRoutes from './product.routes.js';
import contentRoutes from './content.routes.js';
import uploadRoutes from './upload.routes.js';
import healthRoutes from './health.routes.js';

const router = Router();

// Mount sub-routes
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/products', productRoutes);
router.use('/content', contentRoutes);
router.use('/upload', uploadRoutes);
router.use('/health', healthRoutes);

export default router;
