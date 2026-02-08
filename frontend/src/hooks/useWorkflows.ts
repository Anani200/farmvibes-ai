import { useState, useEffect, useCallback } from 'react';
import { getClient } from '@/services/api';
import type { Workflow } from '@/types/api';

interface UseWorkflowsResult {
  workflows: Workflow[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useWorkflows(): UseWorkflowsResult {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchWorkflows = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const client = getClient();
      const data = await client.listWorkflows();
      setWorkflows(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch workflows'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkflows();
  }, [fetchWorkflows]);

  return { workflows, loading, error, refetch: fetchWorkflows };
}

interface UseWorkflowDetailsResult {
  workflow: Workflow | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useWorkflowDetails(workflowName: string): UseWorkflowDetailsResult {
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchWorkflow = useCallback(async () => {
    if (!workflowName) {
      setWorkflow(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const client = getClient();
      const data = await client.describeWorkflow(workflowName);
      setWorkflow(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch workflow details'));
    } finally {
      setLoading(false);
    }
  }, [workflowName]);

  useEffect(() => {
    fetchWorkflow();
  }, [fetchWorkflow]);

  return { workflow, loading, error, refetch: fetchWorkflow };
}
