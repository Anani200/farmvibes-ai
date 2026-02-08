export function createPollingHook<T>(
  fetchFn: () => Promise<T>,
  interval: number
): { data: T | null; loading: boolean; error: Error | null; refetch: () => Promise<void> } {
  // This is a placeholder - will be implemented as a React hook in hooks/
  return { data: null, loading: true, error: null, refetch: async () => {} };
}
