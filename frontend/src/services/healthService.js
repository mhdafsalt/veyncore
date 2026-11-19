import { apiClient } from './api';

/**
 * Health check API service
 */
export async function getHealthStatus(detailed = false) {
  const query = detailed ? '?detailed=true' : '';
  return apiClient(`/health${query}`, {
    method: 'GET',
    cache: 'no-store',
  });
}

export default {
  getHealthStatus,
};
