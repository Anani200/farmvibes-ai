import { Layout } from '@/components/Layout';
import { SystemStatus } from '@/components/SystemStatus';

export function HomePage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to FarmVibes.AI</h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Multi-modal geospatial ML models for agriculture and sustainability. Run workflows,
          monitor execution, and visualize results.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <a
          href="/workflows"
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-8 hover:shadow-xl transition"
        >
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold mb-2">Workflows</h2>
          <p className="text-blue-100">Discover and explore available workflows</p>
        </a>

        <a
          href="/workflows/run"
          className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-lg shadow-lg p-8 hover:shadow-xl transition"
        >
          <div className="text-4xl mb-4">🚀</div>
          <h2 className="text-2xl font-bold mb-2">Run Workflow</h2>
          <p className="text-indigo-100">Submit a new workflow with your parameters</p>
        </a>

        <a
          href="/runs"
          className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-8 hover:shadow-xl transition"
        >
          <div className="text-4xl mb-4">▶️</div>
          <h2 className="text-2xl font-bold mb-2">Runs</h2>
          <p className="text-green-100">Monitor and manage your workflow runs</p>
        </a>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">System Status</h2>
        <SystemStatus />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Quick Start</h3>
          <ol className="space-y-2 text-sm text-gray-600">
            <li>
              1. <span className="font-medium">Browse Workflows</span> - Explore available
              agricultural analysis workflows
            </li>
            <li>
              2. <span className="font-medium">Run a Workflow</span> - Select your area of
              interest and time range
            </li>
            <li>
              3. <span className="font-medium">Monitor Execution</span> - Track progress in
              real-time
            </li>
            <li>
              4. <span className="font-medium">View Results</span> - Visualize and download
              outputs
            </li>
          </ol>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Use Cases</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>🌾 Harvest period detection using NDVI analysis</li>
            <li>🌱 Crop segmentation and classification</li>
            <li>💧 Irrigation pattern monitoring</li>
            <li>🌍 Carbon footprint and GHG emissions estimation</li>
            <li>🌲 Forest change detection and monitoring</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
