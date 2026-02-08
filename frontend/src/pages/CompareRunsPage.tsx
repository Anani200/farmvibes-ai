import React, { useState, useMemo } from 'react';
import { useRuns } from '@/hooks/useRuns';
import { formatDate, formatDuration } from '@/utils/formatting';
import type { VibeWorkflowRun } from '@/types/api';

/**
 * CompareRunsPage Component
 * Allows users to compare results from multiple workflow runs
 * Shows side-by-side comparison of outputs, statistics, and execution details
 */
export const CompareRunsPage: React.FC = () => {
  const { runs, loading, error } = useRuns();
  const [selectedRunIds, setSelectedRunIds] = useState<string[]>([]);
  const [compareMetric, setCompareMetric] = useState<'execution_time' | 'output_count' | 'status'>('execution_time');

  // Filter completed runs with outputs
  const comparableRuns = useMemo(
    () => runs.filter((run) => run.status === 'completed' && run.output && run.output.length > 0),
    [runs]
  );

  // Get selected runs data
  const selectedRuns = useMemo(
    () => comparableRuns.filter((run) => selectedRunIds.includes(run.id)),
    [comparableRuns, selectedRunIds]
  );

  // Calculate comparison metrics
  const metrics = useMemo(() => {
    if (selectedRuns.length === 0) return null;

    const times = selectedRuns
      .map((run) => {
        if (!run.end_time || !run.start_time) return 0;
        return new Date(run.end_time).getTime() - new Date(run.start_time).getTime();
      })
      .filter((t) => t > 0);

    const avgTime = times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
    const maxTime = times.length > 0 ? Math.max(...times) : 0;
    const minTime = times.length > 0 ? Math.min(...times) : 0;

    const outputCounts = selectedRuns.map((run) => run.output?.length ?? 0);
    const totalOutputs = outputCounts.reduce((a, b) => a + b, 0);

    return {
      avgTime,
      maxTime,
      minTime,
      totalOutputs,
      outputCounts,
    };
  }, [selectedRuns]);

  const toggleRunSelection = (runId: string) => {
    setSelectedRunIds((prev) =>
      prev.includes(runId) ? prev.filter((id) => id !== runId) : [...prev, runId]
    );
  };

  const clearSelection = () => {
    setSelectedRunIds([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded-lg w-1/3"></div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <span className="text-4xl mr-3">📊</span>
            Compare Runs
          </h1>
          <p className="text-gray-600 mt-2">
            Compare results and performance metrics across multiple workflow executions
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            <p className="font-semibold">Error loading runs: {error.message}</p>
          </div>
        )}

        {comparableRuns.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-600 text-lg mb-2">No completed runs available for comparison</p>
            <p className="text-gray-500">
              Run some workflows first, then return here to compare their results.
            </p>
          </div>
        ) : (
          <>
            {/* Selection Controls */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Available Runs ({comparableRuns.length})
                </h2>
                <div className="flex gap-3">
                  {selectedRunIds.length > 0 && (
                    <button
                      onClick={clearSelection}
                      className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                    >
                      Clear Selection
                    </button>
                  )}
                  <select
                    value={compareMetric}
                    onChange={(e) =>
                      setCompareMetric(e.target.value as 'execution_time' | 'output_count' | 'status')
                    }
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="execution_time">Sort by: Execution Time</option>
                    <option value="output_count">Sort by: Output Count</option>
                    <option value="status">Sort by: Status</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {comparableRuns.map((run) => (
                  <label
                    key={run.id}
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition"
                  >
                    <input
                      type="checkbox"
                      checked={selectedRunIds.includes(run.id)}
                      onChange={() => toggleRunSelection(run.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="ml-3 flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{run.name}</p>
                      <p className="text-sm text-gray-600">
                        {run.workflow} • {formatDate(run.start_time)}
                      </p>
                    </div>
                    <div className="ml-3 text-right">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                        {run.output?.length ?? 0} outputs
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Comparison View */}
            {selectedRuns.length > 0 && metrics && (
              <>
                {/* Summary Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                      <span className="text-2xl mr-2">⏱️</span>
                      Execution Time
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-gray-600">Average</p>
                        <p className="text-lg font-mono font-bold text-gray-900">
                          {formatDuration(metrics.avgTime / 1000)}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-blue-200">
                        <p className="text-xs text-gray-600">
                          Range: {formatDuration(metrics.minTime / 1000)} - {formatDuration(metrics.maxTime / 1000)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                      <span className="text-2xl mr-2">📦</span>
                      Total Outputs
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-gray-600">Combined</p>
                        <p className="text-lg font-mono font-bold text-gray-900">{metrics.totalOutputs}</p>
                      </div>
                      <div className="pt-2 border-t border-green-200">
                        <p className="text-xs text-gray-600">
                          Avg per run: {(metrics.totalOutputs / selectedRuns.length).toFixed(1)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                      <span className="text-2xl mr-2">✓</span>
                      Runs Selected
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-gray-600">Count</p>
                        <p className="text-lg font-mono font-bold text-gray-900">{selectedRuns.length}</p>
                      </div>
                      <div className="pt-2 border-t border-purple-200">
                        <p className="text-xs text-gray-600">Ready for comparison</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Side-by-Side Comparison Grid */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-4 text-left font-semibold text-gray-900">Metric</th>
                          {selectedRuns.map((run) => (
                            <th
                              key={run.id}
                              className="px-6 py-4 text-left font-semibold text-gray-900 bg-gradient-to-b from-blue-50 to-transparent"
                            >
                              <div className="font-medium text-gray-900">{run.name}</div>
                              <div className="text-xs text-gray-500 font-normal">{run.workflow}</div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 font-medium text-gray-700">Duration</td>
                          {selectedRuns.map((run) => (
                            <td key={run.id} className="px-6 py-4 text-gray-900">
                              {run.end_time && run.start_time
                                ? formatDuration(
                                    (new Date(run.end_time).getTime() - new Date(run.start_time).getTime()) / 1000
                                  )
                                : '-'}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="px-6 py-4 font-medium text-gray-700">Start Time</td>
                          {selectedRuns.map((run) => (
                            <td key={run.id} className="px-6 py-4 text-gray-900">
                              {formatDate(run.start_time)}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="px-6 py-4 font-medium text-gray-700">Output Count</td>
                          {selectedRuns.map((run) => (
                            <td key={run.id} className="px-6 py-4 text-gray-900">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {run.output?.length ?? 0}
                              </span>
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="px-6 py-4 font-medium text-gray-700">Parameters</td>
                          {selectedRuns.map((run) => (
                            <td key={run.id} className="px-6 py-4 text-gray-900">
                              <details className="text-xs">
                                <summary className="cursor-pointer font-mono text-blue-600 hover:text-blue-700">
                                  View
                                </summary>
                                <pre className="mt-2 bg-gray-50 p-2 rounded text-xs overflow-auto max-h-40 border border-gray-200">
                                  {JSON.stringify(run.parameters, null, 2)}
                                </pre>
                              </details>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Output Comparison */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="text-2xl mr-2">📁</span>
                    Output Files
                  </h3>
                  <div className="space-y-4">
                    {selectedRuns.map((run) => (
                      <div
                        key={run.id}
                        className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-gray-50 to-transparent"
                      >
                        <h4 className="font-semibold text-gray-900 mb-3">{run.name}</h4>
                        <div className="space-y-2">
                          {run.output?.map((output, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-2 bg-white rounded border border-gray-100"
                            >
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{output.name}</p>
                                <p className="text-xs text-gray-500">{output.mime_type}</p>
                              </div>
                              <a
                                href={output.url}
                                className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition"
                              >
                                Download ↓
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CompareRunsPage;
