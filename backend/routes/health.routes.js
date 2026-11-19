import { Router } from 'express';
import { getHealth } from '../controllers/health.controller.js';

const router = Router();

/**
 * @route   GET /api/health
 * @desc    Check health status of the backend API
 * @access  Public
 */
router.get('/', getHealth);

export default router;
