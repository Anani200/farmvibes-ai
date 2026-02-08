import { useState, useEffect, useCallback } from 'react';
import { getClient } from '@/services/api';
import type { SystemMetrics } from '@/types/api';
import { POLL_INTERVAL_METRICS } from '@/utils/constants';

interface UseSystemMetricsResult {
  metrics: SystemMetrics | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useSystemMetrics(pollInterval = POLL_INTERVAL_METRICS): UseSystemMetricsResult {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const client = getClient();
      const data = await client.getSystemMetrics();
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch system metrics'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, pollInterval);
    return () => clearInterval(interval);
  }, [fetchMetrics, pollInterval]);

  return { metrics, loading, error, refetch: fetchMetrics };
}
