import { getHealthStatus } from '../services/health.service.js';

/**
 * Health check controller
 * Endpoint: GET /api/health
 */
export const getHealth = (req, res) => {
  // If ?detailed=true query is provided, return extended system diagnostics
  if (req.query.detailed === 'true') {
    const detailedStatus = getHealthStatus();
    return res.status(200).json(detailedStatus);
  }

  // Standard health response matching project specification
  return res.status(200).json({
    success: true,
    message: 'Backend API is running',
  });
};

export default {
  getHealth,
};
