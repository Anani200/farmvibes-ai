import { formatDate, formatDuration } from '@/utils/formatting';
import { useRuns } from '@/hooks/useRuns';
import { RUN_STATUS_COLORS, RUN_STATUS_ICONS } from '@/utils/constants';
import { useState } from 'react';
import type { VibeWorkflowRun } from '@/types/api';
import { getClient } from '@/services/api';

interface RunRowProps {
  run: VibeWorkflowRun;
  onRefresh: () => void;
}

function RunRow({ run, onRefresh }: RunRowProps) {
  const [cancelling, setCancelling] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this run?')) return;
    try {
      setCancelling(true);
      const client = getClient();
      await client.cancelRun(run.id);
      onRefresh();
    } catch (error) {
      console.error('Failed to cancel run:', error);
    } finally {
      setCancelling(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this run?')) return;
    try {
      setDeleting(true);
      const client = getClient();
      await client.deleteRun(run.id);
      onRefresh();
    } catch (error) {
      console.error('Failed to delete run:', error);
    } finally {
      setDeleting(false);
    }
  };

  const statusBadge = RUN_STATUS_COLORS[run.status] || 'bg-gray-100 text-gray-800';
  const statusIcon = RUN_STATUS_ICONS[run.status] || '❓';

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{run.id.slice(0, 8)}...</td>
      <td className="px-6 py-4 text-sm text-gray-600">{run.workflow}</td>
      <td className="px-6 py-4 text-sm text-gray-600">{run.name}</td>
      <td className="px-6 py-4 text-sm">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusBadge}`}>
          {statusIcon} {run.status}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">{formatDate(run.start_time)}</td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {formatDuration(run.start_time, run.end_time)}
      </td>
      <td className="px-6 py-4 text-sm">
        <div className="flex gap-2">
          {run.status === 'running' && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 disabled:opacity-50 text-xs font-medium transition"
            >
              {cancelling ? 'Cancelling...' : 'Cancel'}
            </button>
          )}
          {run.status === 'completed' && (
            <a
              href={`/runs/${run.id}`}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-xs font-medium transition"
            >
              View Results
            </a>
          )}
          {run.status !== 'running' && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 disabled:opacity-50 text-xs font-medium transition"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

export function RunsPage() {
  const [skip, setSkip] = useState(0);
  const { runs, loading, error, total, refetch } = useRuns(skip, 50);
  const pageSize = 50;

  const totalPages = Math.ceil(total / pageSize);
  const currentPage = Math.floor(skip / pageSize) + 1;

  const handlePrevious = () => {
    if (skip > 0) {
      setSkip(skip - pageSize);
    }
  };

  const handleNext = () => {
    if (skip + pageSize < total) {
      setSkip(skip + pageSize);
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        <p className="font-semibold">Error loading runs</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Workflow Runs</h1>
          <p className="text-gray-600">Monitor and manage your workflow executions.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition font-medium"
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {loading && total === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
            <p className="text-gray-600">Loading runs...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Run ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Workflow
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Started
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {runs.map((run) => (
                  <RunRow key={run.id} run={run} onRefresh={refetch} />
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {skip + 1} to {Math.min(skip + pageSize, total)} of {total} runs
            </p>
            <div className="flex gap-2">
              <button
                onClick={handlePrevious}
                disabled={skip === 0}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 font-medium transition"
              >
                Previous
              </button>
              <p className="px-4 py-2 text-gray-600">
                Page {currentPage} of {totalPages || 1}
              </p>
              <button
                onClick={handleNext}
                disabled={skip + pageSize >= total}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 font-medium transition"
              >
                Next
              </button>
            </div>
          </div>

          {runs.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500">No workflow runs yet. Start by running a workflow!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
