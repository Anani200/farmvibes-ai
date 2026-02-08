# Phase 2: Visualization Enhancement

## Overview
Building advanced visualization components for agricultural data - rasters, time series, heatmaps, and categorical maps.

## Components to Build

### 1. TimeSeriesChart Component
**Purpose**: Display NDVI trends, carbon estimates, yield patterns
**Features**:
- Multi-line series support
- Interactive zoom/pan
- Tooltips with values
- Legend with toggle visibility
- Export to CSV/PNG
**Use Cases**:
- Harvest period detection (NDVI over time)
- Carbon footprint trends
- Irrigation monitoring
- Yield predictions

**Props**:
```typescript
interface TimeSeriesChartProps {
  data: Array<{ date: string; value: number; [key: string]: any }>;
  title: string;
  yAxisLabel: string;
  xAxisLabel?: string;
  series: Array<{ key: string; name: string; color: string }>;
  height?: number;
  showLegend?: boolean;
}
```

### 2. CategoricalMap Component
**Purpose**: Display classified raster data (crop types, practices, etc.)
**Features**:
- Custom colormap
- Legend with class counts
- Click-to-inspect pixel values
- Opacity slider
- Export legend
**Use Cases**:
- Crop classification maps
- Conservation practice detection
- Land use classification
- Weed detection maps

**Props**:
```typescript
interface CategoricalMapProps {
  data: RasterData;
  colormap: { [key: number]: string };
  title: string;
  legend: Array<{ value: number; label: string; color: string }>;
  height?: number;
}
```

### 3. HeatmapViewer Component
**Purpose**: Display continuous raster data as heatmaps
**Features**:
- Multiple colormaps (viridis, plasma, magma, etc.)
- Min/max value controls
- Color scale legend
- Interactive tooltips
- Statistics display (mean, min, max, std)
**Use Cases**:
- Temperature maps
- Precipitation maps
- Yield potential maps
- Soil moisture maps

**Props**:
```typescript
interface HeatmapViewerProps {
  data: RasterData;
  colormap?: 'viridis' | 'plasma' | 'magma' | 'cool' | 'warm';
  title: string;
  unit?: string;
  height?: number;
}
```

### 4. RasterViewer Enhancement
**Purpose**: Display GeoTIFF and multi-band imagery
**Features**:
- GeoTIFF.js integration
- Band selection for multi-band imagery
- RGB composite creation
- False color combinations (e.g., NIR-Red-Green)
- Histogram display
- Reproject on map
**Use Cases**:
- Sentinel 2 multispectral imagery
- SAR data
- NDVI calculations
- Cloud detection

### 5. ResultsPage Enhancements
**Updates**:
- Intelligent output type detection
- Automatic visualization selection
- Side-by-side map and chart display
- Export results as ZIP
- Share results link

## Implementation Priority

### Week 1 (High Impact)
1. ✅ Update package.json with chart/viz libraries
2. TimeSeriesChart (Recharts) - NDVI trends, key use case
3. Enhance ResultsPage to auto-detect and display results
4. Create mock visualization data generator

### Week 2
5. CategoricalMap - For crop/practice classification
6. HeatmapViewer - Temperature, precipitation, yield
7. Improve GeoMap with layers and legends

### Week 3
8. GeoTIFF support (if time permits)
9. Comparison tools
10. Export/sharing features

## Data Format Handling

### Time Series Data
```json
{
  "type": "timeseries",
  "data": [
    { "date": "2023-01-01", "ndvi": 0.2, "confidence": 0.8 },
    { "date": "2023-01-15", "ndvi": 0.35, "confidence": 0.85 }
  ],
  "unit": "ndvi",
  "title": "NDVI Over Growing Season"
}
```

### Categorical Raster
```json
{
  "type": "categorical",
  "data": "base64_encoded_geotiff",
  "colormap": { "1": "#FF5733", "2": "#33FF57" },
  "classes": [
    { "value": 1, "label": "Corn", "color": "#FFD700" },
    { "value": 2, "label": "Wheat", "color": "#8B4513" }
  ]
}
```

### Continuous Raster
```json
{
  "type": "continuous",
  "data": "base64_encoded_geotiff",
  "min": 0,
  "max": 100,
  "unit": "°C",
  "title": "Temperature Map"
}
```

## Integration with Backend

Mock data endpoints to add:
- `/v0/runs/<id>/outputs/<name>/preview` - Get preview image
- `/v0/runs/<id>/outputs/<name>/stats` - Get statistics
- `/v0/runs/<id>/outputs/<name>/data` - Get raster data

## Testing Strategy

1. Create mock visualization data for each output type
2. Test with various data sizes (small, medium, large)
3. Performance testing (large raster rendering)
4. Responsive design on mobile/tablet

## Success Metrics
- ✅ Display time series data for harvest detection
- ✅ Show categorical maps for crop classification
- ✅ Display heatmaps for temperature/yield
- ✅ Auto-detect output type and select visualization
- ✅ Responsive visualization on all devices
- ⚠️ GeoTIFF rendering (optional for Phase 2)

## Dependencies to Add
```json
{
  "recharts": "^2.10.0",
  "plotly.js": "^2.28.0",
  "canvas-based-viz": "optional"
}
```

## Files to Create
- `src/components/visualization/TimeSeriesChart.tsx`
- `src/components/visualization/CategoricalMap.tsx`
- `src/components/visualization/HeatmapViewer.tsx`
- `src/components/visualization/RasterViewer.tsx` (enhance)
- `src/components/visualization/OutputRenderer.tsx` (smart component)
- `src/utils/colormaps.ts` (predefined colormaps)
- `src/utils/visualization.ts` (utilities)
- `src/types/visualization.ts` (type definitions)

## Notes
- Keep visualizations lightweight - use Recharts for charts (already in package.json)
- GeoTIFF rendering can be deferred to Phase 3 if complexity is high
- Use Leaflet raster layer support where possible
- Include zoom/pan controls for all visualizations
- Ensure mobile responsiveness
