import { useState } from 'react';
import type { GeoJSON } from '@/types/api';

interface GeometryInputProps {
  onChange: (geometry: GeoJSON) => void;
  value?: GeoJSON;
}

export function GeometryInput({ onChange, value }: GeometryInputProps) {
  const [mode, setMode] = useState<'upload' | 'geojson'>('upload');
  const [geojsonText, setGeojsonText] = useState(
    value ? JSON.stringify(value, null, 2) : ''
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const geojson = JSON.parse(content) as GeoJSON;
        onChange(geojson);
        setGeojsonText(JSON.stringify(geojson, null, 2));
      } catch (error) {
        alert('Invalid GeoJSON file: ' + (error instanceof Error ? error.message : ''));
      }
    };
    reader.readAsText(file);
  };

  const handleGeojsonChange = (text: string) => {
    setGeojsonText(text);
    try {
      const geojson = JSON.parse(text) as GeoJSON;
      onChange(geojson);
    } catch {
      // Invalid JSON, don't update until it's valid
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`px-4 py-2 rounded font-medium transition ${
            mode === 'upload'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
          }`}
        >
          Upload GeoJSON
        </button>
        <button
          type="button"
          onClick={() => setMode('geojson')}
          className={`px-4 py-2 rounded font-medium transition ${
            mode === 'geojson'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
          }`}
        >
          Paste GeoJSON
        </button>
      </div>

      {mode === 'upload' && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            accept=".geojson,.json"
            onChange={handleFileUpload}
            className="hidden"
            id="geojson-upload"
          />
          <label
            htmlFor="geojson-upload"
            className="cursor-pointer inline-block"
          >
            <div className="text-4xl mb-2">📁</div>
            <p className="text-gray-900 font-medium">Choose GeoJSON file</p>
            <p className="text-gray-600 text-sm">or drag and drop</p>
          </label>
        </div>
      )}

      {mode === 'geojson' && (
        <textarea
          value={geojsonText}
          onChange={(e) => handleGeojsonChange(e.target.value)}
          placeholder='{"type": "FeatureCollection", "features": [...]}'
          className="w-full h-40 px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      )}

      {value && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-900">
            ✓ Geometry loaded: {value.type}
          </p>
        </div>
      )}
    </div>
  );
}
