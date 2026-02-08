import { LatLngExpression } from 'leaflet';
import { MapContainer, TileLayer, Polygon, Popup } from 'react-leaflet';
import type { GeoJSON } from '@/types/api';

interface GeoMapProps {
  geojson?: GeoJSON;
  center?: LatLngExpression;
  zoom?: number;
  style?: React.CSSProperties;
}

function extractCoordinates(geom: any): LatLngExpression[] {
  if (geom.type === 'Polygon') {
    return geom.coordinates[0].map((coord: number[]) => [coord[1], coord[0]]);
  }
  if (geom.type === 'MultiPolygon') {
    return geom.coordinates[0][0].map((coord: number[]) => [coord[1], coord[0]]);
  }
  return [];
}

export function GeoMap({
  geojson,
  center = [40, -95],
  zoom = 4,
  style = { height: '400px', width: '100%' },
}: GeoMapProps) {
  const polygonCoords = geojson
    ? extractCoordinates(geojson.geometry || geojson)
    : undefined;

  return (
    <MapContainer center={center} zoom={zoom} style={style} className="rounded-lg">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {polygonCoords && (
        <Polygon positions={polygonCoords} color="blue">
          <Popup>Selected Area</Popup>
        </Polygon>
      )}
    </MapContainer>
  );
}
