import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkflows } from '@/hooks/useWorkflows';
import type { Workflow } from '@/types/api';

interface WorkflowCardProps {
  workflow: Workflow;
  onSelect: (workflow: Workflow) => void;
}

function WorkflowCard({ workflow, onSelect }: WorkflowCardProps) {
  const navigate = useNavigate();

  const handleRunWorkflow = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/workflows/run', { state: { workflowName: workflow.name } });
  };

  return (
    <div
      onClick={() => onSelect(workflow)}
      className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer p-6 border border-gray-200 hover:border-primary-500"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{workflow.name}</h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{workflow.description}</p>

      {workflow.inputs && workflow.inputs.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Inputs</p>
          <div className="flex flex-wrap gap-1">
            {workflow.inputs.map((input) => (
              <span
                key={input.name}
                className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
              >
                {input.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleRunWorkflow}
        className="mt-4 w-full bg-primary-600 text-white py-2 px-4 rounded hover:bg-primary-700 transition text-sm font-medium"
      >
        Run Workflow
      </button>
    </div>
  );
}

interface WorkflowDetailsProps {
  workflow: Workflow;
  onClose: () => void;
}

function WorkflowDetails({ workflow, onClose }: WorkflowDetailsProps) {
  const navigate = useNavigate();

  const handleRunThisWorkflow = () => {
    navigate('/workflows/run', { state: { workflowName: workflow.name } });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{workflow.name}</h2>
            <p className="text-gray-600 mt-1">{workflow.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {workflow.inputs && workflow.inputs.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Inputs</h3>
              <div className="space-y-2">
                {workflow.inputs.map((input) => (
                  <div key={input.name} className="border-l-4 border-blue-500 pl-4">
                    <p className="font-medium text-gray-900">{input.name}</p>
                    <p className="text-sm text-gray-600">{input.type}</p>
                    {input.description && (
                      <p className="text-sm text-gray-500 mt-1">{input.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {workflow.outputs && workflow.outputs.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Outputs</h3>
              <div className="space-y-2">
                {workflow.outputs.map((output) => (
                  <div key={output.name} className="border-l-4 border-green-500 pl-4">
                    <p className="font-medium text-gray-900">{output.name}</p>
                    <p className="text-sm text-gray-600">{output.type}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition"
          >
            Close
          </button>
          <button
            onClick={handleRunThisWorkflow}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition"
          >
            Run This Workflow
          </button>
        </div>
      </div>
    </div>
  );
}

export function WorkflowsPage() {
  const { workflows, loading, error } = useWorkflows();
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredWorkflows = workflows.filter(
    (w) =>
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        <p className="font-semibold">Error loading workflows</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Workflows</h1>
        <p className="text-gray-600">
          Discover and run available FarmVibes.AI workflows for your agricultural analysis.
        </p>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search workflows..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
            <p className="text-gray-600">Loading workflows...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkflows.map((workflow) => (
            <WorkflowCard
              key={workflow.name}
              workflow={workflow}
              onSelect={setSelectedWorkflow}
            />
          ))}
        </div>
      )}

      {selectedWorkflow && (
        <WorkflowDetails
          workflow={selectedWorkflow}
          onClose={() => setSelectedWorkflow(null)}
        />
      )}

      {!loading && filteredWorkflows.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchTerm ? 'No workflows match your search.' : 'No workflows available.'}
          </p>
        </div>
      )}
    </div>
  );
}
