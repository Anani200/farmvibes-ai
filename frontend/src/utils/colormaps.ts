import type { ColorPalette } from '@/types/visualization';

// Predefined colormaps
export const COLORMAPS = {
  viridis: {
    name: 'viridis',
    colors: [
      '#440154', '#482878', '#3e4989', '#31688e', '#26828e',
      '#1f9e89', '#35b779', '#6ece58', '#b5de2b', '#fde724'
    ],
    description: 'Perceptually uniform sequential colormap',
    type: 'sequential' as const,
  },

  plasma: {
    name: 'plasma',
    colors: [
      '#0d0887', '#46039f', '#7201a8', '#9c179e', '#bd3786',
      '#d8576b', '#ed7953', '#fb9f3a', '#fdca26', '#f0f921'
    ],
    description: 'Perceptually uniform sequential colormap',
    type: 'sequential' as const,
  },

  magma: {
    name: 'magma',
    colors: [
      '#000004', '#3b0f70', '#8c2981', '#de4968', '#fe9f6d',
      '#fcfdbf', '#ffffff', '#000004', '#3b0f70', '#8c2981'
    ],
    description: 'Perceptually uniform sequential colormap',
    type: 'sequential' as const,
  },

  cool: {
    name: 'cool',
    colors: [
      '#00008F', '#0020FF', '#0040FF', '#0080FF', '#00BFFF',
      '#00FFFF', '#40FFFF', '#80FFFF', '#BFFFFF', '#FFFFFF'
    ],
    description: 'Cool colors from blue to white',
    type: 'sequential' as const,
  },

  warm: {
    name: 'warm',
    colors: [
      '#FFFFFF', '#FFFF00', '#FFCC00', '#FF9900', '#FF6600',
      '#FF3300', '#CC0000', '#990000', '#660000', '#330000'
    ],
    description: 'Warm colors from white to dark red',
    type: 'sequential' as const,
  },

  rdylbu: {
    name: 'RdYlBu',
    colors: [
      '#a50026', '#d73027', '#f46d43', '#fdae61', '#fee090',
      '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4',
      '#313695'
    ],
    description: 'Diverging red-yellow-blue colormap',
    type: 'diverging' as const,
  },

  bwr: {
    name: 'RdBu',
    colors: [
      '#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddfc7',
      '#f7f7f7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac',
      '#053061'
    ],
    description: 'Diverging red-blue colormap',
    type: 'diverging' as const,
  },

  categorical: {
    name: 'Set1',
    colors: [
      '#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00',
      '#ffff33', '#a65628', '#f781bf', '#999999'
    ],
    description: 'Qualitative categorical colors',
    type: 'categorical' as const,
  },

  spectral: {
    name: 'Spectral',
    colors: [
      '#9e0142', '#d53e4f', '#f46d43', '#fdae61', '#fee08b',
      '#ffffbf', '#e6f598', '#abdda4', '#66c2a5', '#3288bd',
      '#5e4fa2'
    ],
    description: 'Spectral diverging colormap',
    type: 'diverging' as const,
  },
} as const;

/**
 * Get a colormap by name
 */
export function getColormap(name: keyof typeof COLORMAPS): ColorPalette {
  return COLORMAPS[name];
}

/**
 * Get a color from a colormap for a normalized value (0-1)
 */
export function getColorFromNormalizedValue(
  value: number,
  colormap: string[] = COLORMAPS.viridis.colors
): string {
  // Clamp value between 0 and 1
  const clampedValue = Math.max(0, Math.min(1, value));

  // Get the index in the colormap
  const index = Math.floor(clampedValue * (colormap.length - 1));
  return colormap[index];
}

/**
 * Get a color for a value within a range
 */
export function getColorForValue(
  value: number,
  min: number,
  max: number,
  colormap: string[] = COLORMAPS.viridis.colors
): string {
  // Normalize the value to 0-1
  const normalized = (value - min) / (max - min);
  return getColorFromNormalizedValue(normalized, colormap);
}

/**
 * Create a custom colormap from a list of colors with interpolation
 */
export function interpolateColormap(colors: string[], steps: number = 256): string[] {
  if (colors.length < 2) return colors;
  if (colors.length === steps) return colors;

  const result: string[] = [];
  const stepsPerSegment = (steps - 1) / (colors.length - 1);

  for (let i = 0; i < steps; i++) {
    const segment = i / stepsPerSegment;
    const lowerIndex = Math.floor(segment);
    const upperIndex = Math.ceil(segment);
    const t = segment - lowerIndex;

    if (lowerIndex === upperIndex) {
      result.push(colors[lowerIndex] || colors[colors.length - 1]);
    } else {
      const color1 = colors[lowerIndex];
      const color2 = colors[upperIndex];
      result.push(interpolateColor(color1, color2, t));
    }
  }

  return result;
}

/**
 * Interpolate between two hex colors
 */
function interpolateColor(color1: string, color2: string, t: number): string {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);

  if (!c1 || !c2) return color1;

  const r = Math.round(c1.r + (c2.r - c1.r) * t);
  const g = Math.round(c1.g + (c2.g - c1.g) * t);
  const b = Math.round(c1.b + (c2.b - c1.b) * t);

  return rgbToHex(r, g, b);
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Convert RGB to hex color
 */
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * Create a legend for a categorical colormap
 */
export function createCategoricalLegend(
  classes: Array<{ value: number; label: string; color: string }>,
  maxItems: number = 10
): Array<{ value: number; label: string; color: string }> {
  return classes.slice(0, maxItems);
}

/**
 * Get contrasting text color (black or white) for a background color
 */
export function getContrastingTextColor(bgColor: string): string {
  const rgb = hexToRgb(bgColor);
  if (!rgb) return '#000000';

  // Calculate luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

/**
 * Generate a colormap for numeric ranges
 */
export function generateNumericColormap(
  min: number,
  max: number,
  colormap: 'viridis' | 'plasma' | 'magma' | 'cool' | 'warm' = 'viridis'
): Map<number, string> {
  const colors = COLORMAPS[colormap].colors;
  const map = new Map<number, string>();

  const steps = Math.min(256, Math.ceil(max - min));
  for (let i = 0; i < steps; i++) {
    const value = min + (i / steps) * (max - min);
    const color = getColorForValue(value, min, max, colors);
    map.set(Math.round(value * 100) / 100, color);
  }

  return map;
}
