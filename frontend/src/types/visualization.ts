// Type definitions for visualization data

// Raster data types
export interface RasterBand {
  name: string;
  data: number[][];
  min: number;
  max: number;
  nodata?: number;
}

export interface RasterData {
  type: 'timeseries' | 'categorical' | 'continuous' | 'multispectral';
  title: string;
  description?: string;
  unit?: string;
  crs?: string; // EPSG code
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

// Time series data
export interface TimeSeriesDataPoint {
  date: string | number;
  [key: string]: number | string;
}

export interface TimeSeriesVisualization extends RasterData {
  type: 'timeseries';
  data: TimeSeriesDataPoint[];
  series: Array<{
    key: string;
    name: string;
    color?: string;
    unit?: string;
  }>;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

// Categorical/Classification data
export interface CategoricalClass {
  value: number;
  label: string;
  color: string;
  count?: number;
}

export interface CategoricalVisualization extends RasterData {
  type: 'categorical';
  data: string; // base64 encoded raster or JSON
  colormap: { [key: number]: string };
  classes: CategoricalClass[];
  statistics?: {
    total_pixels: number;
    class_distribution: { [key: number]: number };
  };
}

// Continuous data (heatmap)
export interface ContinuousVisualization extends RasterData {
  type: 'continuous';
  data: string; // base64 encoded raster
  min: number;
  max: number;
  colormap?: 'viridis' | 'plasma' | 'magma' | 'cool' | 'warm' | 'custom';
  customColormap?: { [key: number]: string };
  statistics?: {
    mean: number;
    median: number;
    std: number;
    min: number;
    max: number;
  };
}

// Multispectral data
export interface MultispectralVisualization extends RasterData {
  type: 'multispectral';
  bands: RasterBand[];
  defaultComposite?: {
    red: number;
    green: number;
    blue: number;
  };
}

// Union type for all visualizations
export type Visualization =
  | TimeSeriesVisualization
  | CategoricalVisualization
  | ContinuousVisualization
  | MultispectralVisualization;

// Output metadata from API
export interface OutputMetadata {
  name: string;
  type: string;
  mime_type: string;
  url: string;
  visualization?: Visualization;
  stats?: {
    size_bytes?: number;
    format?: string;
    [key: string]: any;
  };
}

// Chart configuration
export interface ChartConfig {
  title: string;
  showLegend?: boolean;
  showGrid?: boolean;
  responsive?: boolean;
  height?: number;
  width?: number;
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
}

// Color palette
export interface ColorPalette {
  name: string;
  colors: string[];
  description?: string;
  type: 'sequential' | 'diverging' | 'categorical';
}
