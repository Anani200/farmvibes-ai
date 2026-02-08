import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWorkflows } from '@/hooks/useWorkflows';
import { useWorkflowDetails } from '@/hooks/useWorkflows';
import { GeometryInput, DateRangePicker } from '@/components/forms';
import { WorkflowParamsForm } from '@/components/forms';
import { getClient } from '@/services/api';
import type { Workflow, GeoJSON, RunSubmission } from '@/types/api';

export function RunWorkflowPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { workflows } = useWorkflows();
  
  // Try to get workflow from navigation state or URL query param
  const workflowFromState = (location.state as any)?.workflowName;
  const [selectedWorkflowName, setSelectedWorkflowName] = useState<string | null>(
    workflowFromState || null
  );
  const { workflow: selectedWorkflow } = useWorkflowDetails(
    selectedWorkflowName || ''
  );

  const [runName, setRunName] = useState('');
  const [geometry, setGeometry] = useState<GeoJSON | undefined>();
  const [timeRange, setTimeRange] = useState<{ start: string; end: string } | undefined>();
  const [parameters, setParameters] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitRun = async () => {
    if (!selectedWorkflowName || !runName || !geometry || !timeRange) {
      setError('Please fill in all required fields: workflow, run name, geometry, and time range');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const client = getClient();
      const submission: RunSubmission = {
        workflow: selectedWorkflowName,
        name: runName,
        geometry,
        time_range: timeRange as { start: string; end: string },
        parameters: Object.keys(parameters).length > 0 ? parameters : undefined,
      };

      const result = await client.submitRun(submission);
      
      // Navigate to the run details page
      navigate(`/runs/${result.id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit workflow run';
      setError(message);
      console.error('Error submitting run:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Run Workflow</h1>
      <p className="text-gray-600 mb-8">Submit a new workflow run with your parameters.</p>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-red-800">
          <p className="font-semibold">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left side: Workflow selection */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Select Workflow</h2>
            
            {workflows.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No workflows available</p>
            ) : (
              <div className="space-y-2">
                {workflows.map((wf) => (
                  <button
                    key={wf.name}
                    onClick={() => setSelectedWorkflowName(wf.name)}
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition ${
                      selectedWorkflowName === wf.name
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <p className="font-semibold text-gray-900">{wf.name}</p>
                    <p className="text-xs text-gray-600 line-clamp-1">
                      {wf.description}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right side: Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {!selectedWorkflow ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-900">👈 Select a workflow to continue</p>
            </div>
          ) : (
            <>
              {/* Workflow info */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {selectedWorkflow.name}
                </h3>
                <p className="text-gray-600">{selectedWorkflow.description}</p>
              </div>

              {/* Run name */}
              <div className="bg-white rounded-lg shadow p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Run Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={runName}
                  onChange={(e) => setRunName(e.target.value)}
                  placeholder="Give your run a descriptive name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Geometry input */}
              <div className="bg-white rounded-lg shadow p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-4">
                  Geometry <span className="text-red-600">*</span>
                </label>
                <GeometryInput onChange={setGeometry} value={geometry} />
              </div>

              {/* Date range */}
              <div className="bg-white rounded-lg shadow p-6">
                <DateRangePicker
                  onChange={setTimeRange}
                  value={timeRange}
                  label="Time Range *"
                />
              </div>

              {/* Workflow parameters */}
              {selectedWorkflow.inputs && selectedWorkflow.inputs.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Workflow Parameters
                  </h3>
                  <WorkflowParamsForm
                    workflow={selectedWorkflow}
                    onSubmit={setParameters}
                    loading={loading}
                  />
                </div>
              )}

              {/* Submit button */}
              <button
                onClick={handleSubmitRun}
                disabled={loading || !runName || !geometry || !timeRange}
                className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Workflow Run'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
