// Workflow types
export interface WorkflowInput {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
  default?: unknown;
}

export interface WorkflowOutput {
  name: string;
  type: string;
  description?: string;
}

export interface Workflow {
  name: string;
  description: string;
  inputs?: WorkflowInput[];
  outputs?: WorkflowOutput[];
}

// Run types
export type RunStatus = 'submitted' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface RunOutput {
  name: string;
  mime_type: string;
  type: string;
  url: string;
  visualization?: Record<string, unknown>; // Optional visualization data from API
}

export interface VibeWorkflowRun {
  id: string;
  workflow: string;
  name: string;
  start_time: string;
  end_time?: string;
  status: RunStatus;
  output: RunOutput[];
  parameters?: Record<string, unknown>;
  description?: string;
}

// Run submission
export interface RunSubmission {
  workflow: string;
  name: string;
  geometry: GeoJSON;
  time_range: {
    start: string;
    end: string;
  };
  parameters?: Record<string, unknown>;
}

// System metrics
export interface SystemMetrics {
  cpu_percent: number;
  memory_percent: number;
  disk_percent: number;
  available_memory_gb: number;
  total_memory_gb: number;
}

// GeoJSON types
export interface GeoJSON {
  type: 'FeatureCollection' | 'Feature' | 'Polygon' | 'MultiPolygon' | 'Point' | 'LineString';
  coordinates?: unknown;
  geometry?: unknown;
  features?: Feature[];
  properties?: Record<string, unknown>;
}

export interface Feature {
  type: 'Feature';
  geometry: Geometry;
  properties: Record<string, unknown>;
}

export interface Geometry {
  type: 'Polygon' | 'MultiPolygon' | 'Point' | 'LineString';
  coordinates: unknown;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  take: number;
}
