import { getDBStatus } from '../config/db.js';

/**
 * Health service - provides status information for health check endpoints
 */
export const getHealthStatus = () => {
  return {
    success: true,
    message: 'Backend API is running',
    timestamp: new Date().toISOString(),
    database: getDBStatus(),
    environment: process.env.NODE_ENV || 'development',
  };
};

export default {
  getHealthStatus,
};
