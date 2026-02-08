import { useRun } from '@/hooks/useRuns';
import { useParams, Link } from 'react-router-dom';
import { formatDate, formatDuration } from '@/utils/formatting';
import { RUN_STATUS_COLORS, RUN_STATUS_ICONS } from '@/utils/constants';
import { GeoMap } from '@/components/GeoMap';
import { OutputRenderer } from '@/components/visualization';

export function ResultsPage() {
  const { runId } = useParams<{ runId: string }>();
  const { run, loading, error } = useRun(runId || null);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        <p className="font-semibold">Error loading run details</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  if (loading || !run) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600">Loading run details...</p>
        </div>
      </div>
    );
  }

  const statusBadge = RUN_STATUS_COLORS[run.status] || 'bg-gray-100 text-gray-800';
  const statusIcon = RUN_STATUS_ICONS[run.status] || '❓';

  return (
    <div>
      <Link
        to="/runs"
        className="text-primary-600 hover:text-primary-700 font-medium mb-4 inline-block"
      >
        ← Back to Runs
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{run.name}</h1>
        <div className="flex items-center gap-4">
          <span
            className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${statusBadge}`}
          >
            {statusIcon} {run.status}
          </span>
          <p className="text-gray-600">Run ID: {run.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-1">Workflow</p>
          <p className="text-lg font-semibold text-gray-900">{run.workflow}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-1">Started</p>
          <p className="text-lg font-semibold text-gray-900">{formatDate(run.start_time)}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-1">Duration</p>
          <p className="text-lg font-semibold text-gray-900">
            {formatDuration(run.start_time, run.end_time)}
          </p>
        </div>
      </div>

      {run.output && run.output.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Results & Outputs</h2>
          
          <div className="space-y-8">
            {run.output.map((output, index) => (
              <div
                key={output.name}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <div className="border-b border-gray-200 p-6 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {output.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Type: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{output.type}</code>
                        {output.mime_type && (
                          <>
                            {' '} | MIME:{' '}
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                              {output.mime_type}
                            </code>
                          </>
                        )}
                      </p>
                    </div>
                    <a
                      href={output.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition text-sm font-medium flex items-center gap-2"
                    >
                      <span>📥</span>
                      Download
                    </a>
                  </div>
                </div>

                <div className="p-6">
                  <OutputRenderer output={output} height={500} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {run.parameters && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Parameters</h2>
          <div className="bg-gray-50 p-4 rounded font-mono text-sm overflow-auto max-h-64">
            <pre>{JSON.stringify(run.parameters, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
