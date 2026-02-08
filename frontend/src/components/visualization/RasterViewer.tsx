import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import type { ContinuousVisualization, CategoricalVisualization } from '@/types/visualization';

interface RasterViewerProps {
  data: ContinuousVisualization | CategoricalVisualization;
  height?: number;
}

/**
 * RasterViewer Component
 * Displays raster data (GeoTIFF, categorical maps, continuous heatmaps)
 * Currently uses Leaflet with mock data layer rendering
 * GeoTIFF rendering can be enhanced with GeoTIFF.js library
 */
export const RasterViewer: React.FC<RasterViewerProps> = ({ data, height = 400 }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    if (!map.current) {
      map.current = L.map(mapContainer.current).setView([40, -95], 4);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map.current);

      setMapReady(true);
    }

    return () => {
      // Cleanup on unmount
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  if (!mapReady) {
    return <div className="bg-gray-100 animate-pulse" style={{ height: `${height}px` }} />;
  }

  return (
    <div className="space-y-4">
      <div
        ref={mapContainer}
        className="rounded-lg border border-gray-200 overflow-hidden"
        style={{ height: `${height}px` }}
      />

      <div className="grid grid-cols-2 gap-4">
        {/* Statistics Panel */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
            <span className="text-lg mr-2">📊</span>
            Raster Statistics
          </h4>
          {data.type === 'continuous' && 'statistics' in data && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Mean:</span>
                <span className="font-mono text-gray-900">{data.statistics?.mean?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Std Dev:</span>
                <span className="font-mono text-gray-900">{data.statistics?.std?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Min:</span>
                <span className="font-mono text-gray-900">{data.statistics?.min?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Max:</span>
                <span className="font-mono text-gray-900">{data.statistics?.max?.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Legend/Colormap Panel */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
            <span className="text-lg mr-2">🎨</span>
            Colormap
          </h4>
          {data.type === 'continuous' && (
            <div className="flex flex-col space-y-2">
              <div className="text-sm text-gray-600">
                Colormap: <span className="font-semibold">{data.colormap || 'viridis'}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-600 gap-2 mt-2">
                <span>Low</span>
                <div className="flex-1 h-6 bg-gradient-to-r from-blue-500 via-green-500 to-red-500 rounded"></div>
                <span>High</span>
              </div>
              <div className="flex justify-between text-xs font-mono text-gray-700 mt-1">
                <span>{data.min?.toFixed(1)}</span>
                <span>{((data.min ?? 0 + data.max ?? 100) / 2).toFixed(1)}</span>
                <span>{data.max?.toFixed(1)}</span>
              </div>
            </div>
          )}
          {data.type === 'categorical' && 'classes' in data && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {data.classes?.map((cls) => (
                <div key={cls.value} className="flex items-center gap-2 text-sm">
                  <div
                    className="w-4 h-4 rounded border border-gray-300"
                    style={{ backgroundColor: cls.color }}
                  />
                  <span className="text-gray-700 flex-1">{cls.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Info Footer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
        <p className="flex items-center">
          <span className="mr-2">ℹ️</span>
          <span>
            {data.description}
            {data.type === 'continuous' && data.unit && ` (${data.unit})`}
          </span>
        </p>
      </div>
    </div>
  );
};

export default RasterViewer;
