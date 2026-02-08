import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { HomePage } from '@/pages/HomePage';
import { WorkflowsPage } from '@/pages/WorkflowsPage';
import { RunWorkflowPage } from '@/pages/RunWorkflowPage';
import { RunsPage } from '@/pages/RunsPage';
import { ResultsPage } from '@/pages/ResultsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { CompareRunsPage } from '@/pages/CompareRunsPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/workflows" element={<WorkflowsPage />} />
          <Route path="/workflows/run" element={<RunWorkflowPage />} />
          <Route path="/runs" element={<RunsPage />} />
          <Route path="/runs/:runId" element={<ResultsPage />} />
          <Route path="/compare" element={<CompareRunsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

function NotFound() {
  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
      <p className="text-gray-600 mb-4">Page not found</p>
      <a href="/" className="text-primary-600 hover:text-primary-700 font-medium">
        ← Back to Home
      </a>
    </div>
  );
}

export default App;
