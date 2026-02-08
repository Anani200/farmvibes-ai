import { Link } from 'react-router-dom';
import { useSystemMetrics } from '@/hooks/useSystemMetrics';
import { formatPercent } from '@/utils/formatting';

export function Navbar() {
  const { metrics } = useSystemMetrics();

  return (
    <nav className="bg-gradient-to-r from-primary-700 to-primary-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold">🌾</div>
            <span className="text-xl font-bold">FarmVibes.AI</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link
              to="/workflows"
              className="hover:bg-primary-600 px-3 py-2 rounded-md text-sm font-medium transition"
            >
              Workflows
            </Link>
            <Link
              to="/workflows/run"
              className="hover:bg-primary-600 px-3 py-2 rounded-md text-sm font-medium transition"
            >
              Run Workflow
            </Link>
            <Link
              to="/runs"
              className="hover:bg-primary-600 px-3 py-2 rounded-md text-sm font-medium transition"
            >
              Runs
            </Link>
            <Link
              to="/compare"
              className="hover:bg-primary-600 px-3 py-2 rounded-md text-sm font-medium transition"
            >
              Compare
            </Link>
            <Link
              to="/settings"
              className="hover:bg-primary-600 px-3 py-2 rounded-md text-sm font-medium transition"
            >
              Settings
            </Link>

            {metrics && (
              <div className="text-sm text-primary-100">
                <span className="ml-4">CPU: {formatPercent(metrics.cpu_percent)}</span>
                <span className="ml-2">Memory: {formatPercent(metrics.memory_percent)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
