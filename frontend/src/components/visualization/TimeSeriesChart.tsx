import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
  AreaChart,
} from 'recharts';
import type { TimeSeriesVisualization } from '@/types/visualization';

interface TimeSeriesChartProps {
  data: TimeSeriesVisualization;
  height?: number;
  showLegend?: boolean;
  chartType?: 'line' | 'area' | 'composed';
  showGrid?: boolean;
}

/**
 * TimeSeriesChart component for displaying time-based data
 * Supports multi-series line/area charts with interactive legend
 */
export function TimeSeriesChart({
  data,
  height = 400,
  showLegend = true,
  chartType = 'line',
  showGrid = true,
}: TimeSeriesChartProps) {
  // Process data - ensure dates are strings and sortable
  const chartData = useMemo(() => {
    return data.data
      .map((point) => ({
        ...point,
        // Convert date to ISO string if it's a timestamp
        date:
          typeof point.date === 'number'
            ? new Date(point.date).toISOString().split('T')[0]
            : String(point.date),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [data.data]);

  // Get color for each series
  const seriesConfig = useMemo(
    () =>
      data.series.map((series, index) => ({
        ...series,
        color:
          series.color || SERIES_COLORS[index % SERIES_COLORS.length],
      })),
    [data.series]
  );

  // Custom tooltip
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: any[];
    label?: string;
  }) => {
    if (!active || !payload) return null;

    return (
      <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
        <p className="font-semibold text-gray-900 text-sm">{label}</p>
        {payload.map((entry, index) => (
          <p
            key={index}
            className="text-sm"
            style={{ color: entry.color }}
          >
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
            {data.series[index]?.unit && ` ${data.series[index].unit}`}
          </p>
        ))}
      </div>
    );
  };

  // Render based on chart type
  const renderChart = () => {
    const commonProps = {
      data: chartData,
      height,
      margin: { top: 5, right: 30, left: 0, bottom: 5 },
    };

    if (chartType === 'area') {
      return (
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              label={{
                value: data.yAxisLabel || data.unit || 'Value',
                angle: -90,
                position: 'insideLeft',
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend />}
            {seriesConfig.map((series) => (
              <Area
                key={series.key}
                type="monotone"
                dataKey={series.key}
                name={series.name}
                stroke={series.color}
                fill={series.color}
                fillOpacity={0.3}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === 'composed') {
      return (
        <ResponsiveContainer width="100%" height={height}>
          <ComposedChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              label={{
                value: data.yAxisLabel || data.unit || 'Value',
                angle: -90,
                position: 'insideLeft',
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend />}
            {seriesConfig.slice(0, 1).map((series) => (
              <Area
                key={series.key}
                type="monotone"
                dataKey={series.key}
                name={series.name}
                stroke={series.color}
                fill={series.color}
                fillOpacity={0.2}
              />
            ))}
            {seriesConfig.slice(1).map((series) => (
              <Line
                key={series.key}
                type="monotone"
                dataKey={series.key}
                name={series.name}
                stroke={series.color}
                dot={false}
                strokeWidth={2}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      );
    }

    // Default: line chart
    return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart {...commonProps}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" />}
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            label={{
              value: data.yAxisLabel || data.unit || 'Value',
              angle: -90,
              position: 'insideLeft',
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend />}
          {seriesConfig.map((series) => (
            <Line
              key={series.key}
              type="monotone"
              dataKey={series.key}
              name={series.name}
              stroke={series.color}
              dot={false}
              strokeWidth={2}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{data.title}</h3>
      {data.description && (
        <p className="text-sm text-gray-600 mb-4">{data.description}</p>
      )}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        {renderChart()}
      </div>
      {data.unit && (
        <p className="text-xs text-gray-500 mt-2">Unit: {data.unit}</p>
      )}
    </div>
  );
}

// Default series colors
const SERIES_COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
];
