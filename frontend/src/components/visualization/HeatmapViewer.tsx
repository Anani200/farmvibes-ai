import React, { useMemo } from 'react';
import type { CategoricalVisualization } from '@/types/visualization';

interface HeatmapViewerProps {
  data: CategoricalVisualization;
  height?: number;
  showLegend?: boolean;
}

/**
 * HeatmapViewer component for displaying classified raster data
 * Shows categorical data with a legend and statistics
 */
export function HeatmapViewer({
  data,
  height = 400,
  showLegend = true,
}: HeatmapViewerProps) {
  // Calculate class statistics
  const classStats = useMemo(() => {
    if (!data.statistics?.class_distribution) {
      return data.classes.map((cls) => ({
        ...cls,
        percentage: 0,
        pixelCount: 0,
      }));
    }

    const total = data.statistics.total_pixels || 1;
    return data.classes.map((cls) => {
      const pixelCount = data.statistics?.class_distribution[cls.value] || 0;
      return {
        ...cls,
        percentage: (pixelCount / total) * 100,
        pixelCount,
      };
    });
  }, [data.classes, data.statistics]);

  // Sort by pixel count (descending)
  const sortedClasses = useMemo(
    () => [...classStats].sort((a, b) => b.pixelCount - a.pixelCount),
    [classStats]
  );

  return (
    <div className="w-full">
      <h3 className="text-lg font-bold text-gray-900 mb-2">{data.title}</h3>
      {data.description && (
        <p className="text-sm text-gray-600 mb-4">{data.description}</p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map placeholder */}
        <div className="lg:col-span-2">
          <div
            className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border border-gray-300 flex items-center justify-center"
            style={{ height }}
          >
            <div className="text-center text-gray-600">
              <div className="text-4xl mb-2">🗺️</div>
              <p className="text-sm">
                {data.type === 'categorical' ? 'Classification Map' : 'Map Viewer'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {data.classes.length} classes
              </p>
            </div>
          </div>
        </div>

        {/* Legend */}
        {showLegend && (
          <div className="bg-white rounded-lg border border-gray-200 p-4 h-fit">
            <h4 className="font-semibold text-gray-900 mb-3 text-sm">Legend</h4>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {sortedClasses.map((cls) => (
                <div
                  key={cls.value}
                  className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 transition"
                >
                  <div
                    className="w-6 h-6 rounded border border-gray-300 flex-shrink-0"
                    style={{ backgroundColor: cls.color }}
                    title={`${cls.label} (${cls.pixelCount} pixels)`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {cls.label}
                    </p>
                    <p className="text-xs text-gray-500">
                      {cls.percentage.toFixed(1)}%
                      {cls.pixelCount > 0 && ` (${cls.pixelCount.toLocaleString()})`}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Statistics */}
            {data.statistics && (
              <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-600">
                <p>
                  <strong>Total Pixels:</strong>{' '}
                  {data.statistics.total_pixels?.toLocaleString()}
                </p>
                <p>
                  <strong>Classes:</strong> {data.classes.length}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Class breakdown */}
      <div className="mt-6 bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="font-semibold text-gray-900 mb-3 text-sm">
          Class Breakdown
        </h4>

        <div className="space-y-2">
          {sortedClasses.map((cls) => (
            <div key={cls.value} className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: cls.color }}
              />
              <span className="text-sm text-gray-700 flex-1">{cls.label}</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${cls.percentage}%`,
                      backgroundColor: cls.color,
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 w-12 text-right">
                  {cls.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
