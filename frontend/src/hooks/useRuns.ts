import { useState, useEffect, useCallback } from 'react';
import { getClient } from '@/services/api';
import type { VibeWorkflowRun } from '@/types/api';
import { POLL_INTERVAL_RUNS } from '@/utils/constants';

interface UseRunsResult {
  runs: VibeWorkflowRun[];
  loading: boolean;
  error: Error | null;
  total: number;
  refetch: () => Promise<void>;
}

export function useRuns(skip = 0, take = 50, pollInterval = POLL_INTERVAL_RUNS): UseRunsResult {
  const [runs, setRuns] = useState<VibeWorkflowRun[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRuns = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const client = getClient();
      const response = await client.listRuns(undefined, undefined, skip, take);
      setRuns(response.items);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch runs'));
    } finally {
      setLoading(false);
    }
  }, [skip, take]);

  useEffect(() => {
    fetchRuns();
    const interval = setInterval(fetchRuns, pollInterval);
    return () => clearInterval(interval);
  }, [fetchRuns, pollInterval]);

  return { runs, loading, error, total, refetch: fetchRuns };
}

interface UseRunResult {
  run: VibeWorkflowRun | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useRun(runId: string | null, pollInterval = POLL_INTERVAL_RUNS): UseRunResult {
  const [run, setRun] = useState<VibeWorkflowRun | null>(null);
  const [loading, setLoading] = useState(!runId);
  const [error, setError] = useState<Error | null>(null);

  const fetchRun = useCallback(async () => {
    if (!runId) {
      setRun(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const client = getClient();
      const data = await client.getRun(runId);
      setRun(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch run'));
    } finally {
      setLoading(false);
    }
  }, [runId]);

  useEffect(() => {
    fetchRun();
    const interval = setInterval(fetchRun, pollInterval);
    return () => clearInterval(interval);
  }, [fetchRun, pollInterval]);

  return { run, loading, error, refetch: fetchRun };
}
