import React, { useMemo } from 'react';
import { TimeSeriesChart } from './TimeSeriesChart';
import { HeatmapViewer } from './HeatmapViewer';
import { RasterViewer } from './RasterViewer';
import type { RunOutput } from '@/types/api';
import type { Visualization } from '@/types/visualization';

interface OutputRendererProps {
  output: RunOutput;
  height?: number;
}

/**
 * Smart output renderer that auto-detects output type and renders appropriate visualization
 * Handles:
 * - Time series data (NDVI, yield, etc.)
 * - Categorical maps (crop types, practices)
 * - Continuous rasters (temperature, precipitation)
 * - Generic outputs (download links)
 */
export function OutputRenderer({ output, height = 400 }: OutputRendererProps) {
  // Detect output type from mime_type and name
  const detectedType = useMemo(() => {
    const name = output.name.toLowerCase();
    const mimeType = output.mime_type.toLowerCase();

    // Time series
    if (
      name.includes('time') ||
      name.includes('series') ||
      name.includes('ndvi') ||
      name.includes('trend') ||
      mimeType.includes('json') && (
        name.includes('harvest') ||
        name.includes('carbon') ||
        name.includes('yield') ||
        name.includes('growth')
      )
    ) {
      return 'timeseries' as const;
    }

    // Categorical/classification
    if (
      name.includes('class') ||
      name.includes('segment') ||
      name.includes('map') && (
        name.includes('crop') ||
        name.includes('practice') ||
        name.includes('weed') ||
        name.includes('land')
      ) ||
      name.includes('detection')
    ) {
      return 'categorical' as const;
    }

    // Continuous/heatmap
    if (
      name.includes('temp') ||
      name.includes('heat') ||
      name.includes('precipit') ||
      name.includes('soil') ||
      name.includes('moisture') ||
      mimeType.includes('tiff') ||
      mimeType.includes('geotiff')
    ) {
      return 'continuous' as const;
    }

    // CSV files - likely time series
    if (mimeType.includes('csv')) {
      return 'timeseries' as const;
    }

    // Default to generic
    return 'generic' as const;
  }, [output.name, output.mime_type]);

  // Parse JSON output if available
  const parsedData = useMemo(() => {
    if (output.mime_type.includes('json')) {
      try {
        // In a real app, this would be fetched from output.url
        // For now, return null - the data would come from the API
        return null;
      } catch {
        return null;
      }
    }
    return null;
  }, [output.mime_type]);

  // Render based on detected type
  if (output.visualization) {
    // If visualization data is available from API, use it
    const viz = output.visualization;
    
    if (viz.type === 'timeseries') {
      return <TimeSeriesChart data={viz as any} height={height} />;
    }
    
    if (viz.type === 'categorical') {
      return <HeatmapViewer data={viz as any} height={height} />;
    }
    
    if (viz.type === 'continuous' || viz.type === 'multispectral') {
      return <RasterViewer data={viz as any} height={height} />;
    }
  }

  // Fallback: try to parse JSON data
  if (detectedType === 'timeseries' && parsedData) {
    return (
      <TimeSeriesChart
        data={parsedData as any}
        height={height}
      />
    );
  }

  if (detectedType === 'categorical' && parsedData) {
    return (
      <HeatmapViewer
        data={parsedData as any}
        height={height}
      />
    );
  }

  if (detectedType === 'continuous' && parsedData) {
    return (
      <RasterViewer
        data={parsedData as any}
        height={height}
      />
    );
  }

  // Default: generic output with download link
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-4">
        <div className="text-4xl">
          {getOutputIconForType(output.type, output.mime_type)}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{output.name}</h3>
          <p className="text-sm text-gray-600 mb-3">
            Type: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{output.type}</code>
          </p>
          <a
            href={output.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition text-sm font-medium"
          >
            Download File
          </a>
        </div>
      </div>

      {/* Detected type info */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">Detected as:</span> {detectedType}
          <br />
          <span className="text-xs text-blue-800">
            This output type might have data visualization support in a future update.
          </span>
        </p>
      </div>
    </div>
  );
}

/**
 * Get an appropriate emoji icon for output type
 */
function getOutputIconForType(type: string, mimeType: string): string {
  if (type.includes('raster') || mimeType.includes('tiff')) return '🖼️';
  if (type.includes('vector') || mimeType.includes('geojson')) return '📍';
  if (type.includes('csv') || mimeType.includes('csv')) return '📊';
  if (type.includes('json') || mimeType.includes('json')) return '📄';
  if (type.includes('text') || mimeType.includes('text')) return '📝';
  if (type.includes('image') || mimeType.includes('image')) return '🖼️';
  return '📦';
}
