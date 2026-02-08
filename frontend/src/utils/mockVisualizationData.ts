import type {
  TimeSeriesVisualization,
  CategoricalVisualization,
  ContinuousVisualization,
} from '@/types/visualization';

/**
 * Generate mock time series data for demonstration
 * Simulates NDVI data from growing season
 */
export function generateMockTimeSeriesData(): TimeSeriesVisualization {
  const startDate = new Date('2023-04-01');
  const data = [];

  // Generate daily NDVI data for 150 days (growing season)
  for (let i = 0; i < 150; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    // Simulate S-curve growth pattern with some noise
    const progress = i / 150;
    const ndvi =
      0.2 +
      0.5 * (1 / (1 + Math.exp(-10 * (progress - 0.5)))) +
      Math.random() * 0.05 - 0.025;
    const confidence = 0.85 + Math.random() * 0.1;

    data.push({
      date: date.toISOString().split('T')[0],
      ndvi: Math.max(0, Math.min(1, ndvi)),
      confidence: Math.max(0, Math.min(1, confidence)),
      evi: ndvi * 0.85 + Math.random() * 0.05,
    });
  }

  return {
    type: 'timeseries',
    title: 'NDVI Growth Pattern',
    description: 'Vegetation Index over growing season',
    unit: 'NDVI',
    data,
    series: [
      {
        key: 'ndvi',
        name: 'NDVI (Normalized Difference Vegetation Index)',
        color: '#10b981',
        unit: 'Index',
      },
      {
        key: 'evi',
        name: 'EVI (Enhanced Vegetation Index)',
        color: '#3b82f6',
        unit: 'Index',
      },
    ],
    xAxisLabel: 'Date',
    yAxisLabel: 'Index Value',
  };
}

/**
 * Generate mock categorical map data
 * Simulates crop classification
 */
export function generateMockCategoricalData(): CategoricalVisualization {
  const classes = [
    { value: 1, label: 'Corn', color: '#fcd34d' },
    { value: 2, label: 'Wheat', color: '#d4a373' },
    { value: 3, label: 'Soybean', color: '#86efac' },
    { value: 4, label: 'Water', color: '#38bdf8' },
    { value: 5, label: 'Forest', color: '#15803d' },
    { value: 6, label: 'Urban', color: '#808080' },
    { value: 0, label: 'Unclassified', color: '#d1d5db' },
  ];

  const totalPixels = 1000000;

  return {
    type: 'categorical',
    title: 'Crop Classification Map',
    description: 'Machine learning based crop type classification',
    data: '', // Would be base64 encoded raster
    colormap: Object.fromEntries(
      classes.map((c) => [c.value.toString(), c.color])
    ),
    classes,
    statistics: {
      total_pixels: totalPixels,
      class_distribution: {
        0: totalPixels * 0.05,
        1: totalPixels * 0.35,
        2: totalPixels * 0.3,
        3: totalPixels * 0.15,
        4: totalPixels * 0.1,
        5: totalPixels * 0.04,
        6: totalPixels * 0.01,
      },
    },
  };
}

/**
 * Generate mock continuous raster data
 * Simulates temperature map
 */
export function generateMockContinuousData(): ContinuousVisualization {
  return {
    type: 'continuous',
    title: 'Temperature Map',
    description: 'Land surface temperature estimate',
    unit: '°C',
    data: '', // Would be base64 encoded raster
    min: 10,
    max: 35,
    colormap: 'viridis',
    statistics: {
      mean: 22.5,
      median: 22.1,
      std: 4.2,
      min: 10.5,
      max: 34.8,
    },
  };
}

/**
 * Generate mock carbon estimate time series
 */
export function generateMockCarbonData(): TimeSeriesVisualization {
  const data = [];
  const scenarios = ['baseline', 'conservation_tillage', 'cover_crops', 'no_till'];

  for (let year = 2020; year <= 2030; year++) {
    const point: any = { date: year.toString() };

    scenarios.forEach((scenario) => {
      // Simulate carbon accumulation with different practices
      const years = year - 2020;
      const baseC = 20 + Math.random() * 5;

      if (scenario === 'baseline') {
        point[scenario] = baseC;
      } else if (scenario === 'conservation_tillage') {
        point[scenario] = baseC + years * 0.5;
      } else if (scenario === 'cover_crops') {
        point[scenario] = baseC + years * 0.8;
      } else if (scenario === 'no_till') {
        point[scenario] = baseC + years * 1.2;
      }
    });

    data.push(point);
  }

  return {
    type: 'timeseries',
    title: 'Soil Carbon Sequestration Potential',
    description: 'Carbon accumulation under different farming practices',
    unit: 'Mg C/ha',
    data,
    series: [
      { key: 'baseline', name: 'Baseline (Current Practice)', color: '#ef4444' },
      { key: 'conservation_tillage', name: 'Conservation Tillage', color: '#f97316' },
      { key: 'cover_crops', name: 'Cover Crops', color: '#3b82f6' },
      { key: 'no_till', name: 'No-Till (Best)', color: '#10b981' },
    ],
    xAxisLabel: 'Year',
    yAxisLabel: 'Soil Carbon (Mg C/ha)',
  };
}

/**
 * Generate mock irrigation probability map
 */
export function generateMockIrrigationData(): CategoricalVisualization {
  return {
    type: 'categorical',
    title: 'Irrigation Probability Map',
    description: 'Estimated irrigation probability classification',
    data: '', // Would be base64 encoded raster
    colormap: {
      0: '#d1d5db',
      1: '#fee2e2',
      2: '#fca5a5',
      3: '#f87171',
      4: '#dc2626',
    },
    classes: [
      { value: 0, label: 'No Data', color: '#d1d5db' },
      { value: 1, label: 'Very Low (0-20%)', color: '#fee2e2' },
      { value: 2, label: 'Low (20-40%)', color: '#fca5a5' },
      { value: 3, label: 'Medium (40-60%)', color: '#f87171' },
      { value: 4, label: 'High (>60%)', color: '#dc2626' },
    ],
    statistics: {
      total_pixels: 500000,
      class_distribution: {
        0: 50000,
        1: 100000,
        2: 150000,
        3: 150000,
        4: 50000,
      },
    },
  };
}
