import { useSystemMetrics } from '@/hooks/useSystemMetrics';
import { formatPercent } from '@/utils/formatting';

interface MetricCardProps {
  label: string;
  value: number;
  unit?: string;
  warning?: boolean;
}

function MetricCard({ label, value, unit = '%', warning = false }: MetricCardProps) {
  const bgColor = warning && value > 80 ? 'bg-red-50' : 'bg-blue-50';
  const textColor = warning && value > 80 ? 'text-red-600' : 'text-blue-600';

  return (
    <div className={`rounded-lg p-4 ${bgColor}`}>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <div className="flex items-end">
        <span className={`text-2xl font-bold ${textColor}`}>
          {formatPercent(value, 1)}
        </span>
      </div>
      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${
            value > 80 ? 'bg-red-500' : value > 50 ? 'bg-yellow-500' : 'bg-green-500'
          }`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  );
}

export function SystemStatus() {
  const { metrics, loading, error } = useSystemMetrics();

  if (loading) {
    return <div className="text-gray-500">Loading system status...</div>;
  }

  if (error) {
    return <div className="text-red-500">Failed to load system metrics</div>;
  }

  if (!metrics) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MetricCard label="CPU Usage" value={metrics.cpu_percent} warning />
      <MetricCard label="Memory Usage" value={metrics.memory_percent} warning />
      <MetricCard label="Disk Usage" value={metrics.disk_percent} warning />
    </div>
  );
}
