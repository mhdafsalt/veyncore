'use client';

import { useState, useEffect, useCallback } from 'react';
import { getHealthStatus } from '@/services/healthService';

/**
 * Custom hook to verify and monitor backend connectivity
 */
export function useHealthCheck(autoCheck = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);

  const checkHealth = useCallback(async (detailed = true) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getHealthStatus(detailed);
      setData(result);
      setLastChecked(new Date());
    } catch (err) {
      setError(err.message || 'Unable to connect to backend server');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoCheck) {
      checkHealth();
    }
  }, [autoCheck, checkHealth]);

  return {
    data,
    loading,
    error,
    lastChecked,
    refetch: checkHealth,
  };
}

export default useHealthCheck;
