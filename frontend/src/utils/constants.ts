export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:31108/v0';
export const POLL_INTERVAL_RUNS = 2000; // 2 seconds for run status
export const POLL_INTERVAL_METRICS = 10000; // 10 seconds for system metrics

export const RUN_STATUS_COLORS: Record<string, string> = {
  submitted: 'bg-yellow-100 text-yellow-800',
  running: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800',
};

export const RUN_STATUS_ICONS: Record<string, string> = {
  submitted: '📋',
  running: '⏳',
  completed: '✅',
  failed: '❌',
  cancelled: '🛑',
};
