'use client';

import { MapContainer, Marker, Popup, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { useMemo, useState } from 'react';
import type { FeatureCollection } from 'geojson';

interface Props {
  geojson: FeatureCollection | null;
}

function CenterButton() {
  const map = useMap();
  return (
    <button
      type="button"
      onClick={() => map.setView([45.437, 12.334], 11)}
      className="absolute left-4 top-4 rounded-full bg-white px-3 py-2 text-xs font-medium shadow"
    >
      Center on Venice
    </button>
  );
}

export default function BarrierMapInner({ geojson }: Props) {
  const [style, setStyle] = useState<'light' | 'satellite'>('light');

  const markers = useMemo(() => {
    if (!geojson) return [] as { position: [number, number]; name: string }[];
    return geojson.features
      .map((feature) => {
        if (feature.geometry.type === 'Point') {
          const [lng, lat] = feature.geometry.coordinates;
          return { position: [lat, lng] as [number, number], name: feature.properties?.name as string };
        }
        return null;
      })
      .filter(Boolean) as { position: [number, number]; name: string }[];
  }, [geojson]);

  return (
    <div className="relative h-[360px] w-full overflow-hidden rounded-2xl">
      <MapContainer center={[45.437, 12.334]} zoom={11} className="h-full w-full" scrollWheelZoom>
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url={
            style === 'light'
              ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              : 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
          }
        />
        {geojson ? <GeoJSON data={geojson} style={{ color: '#0f60db', weight: 2 }} /> : null}
        {markers.map((marker) => (
          <Marker key={marker.name} position={marker.position}>
            <Popup>
              <strong>{marker.name}</strong>
              <p className="mt-2 text-xs text-slate-600">
                These gates lift to seal the lagoon from the Adriatic when acqua alta exceeds the 110 cm trigger.
              </p>
            </Popup>
          </Marker>
        ))}
        <CenterButton />
      </MapContainer>
      <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-xs shadow">
        <span className="font-medium text-slate-700">Basemap</span>
        <button
          type="button"
          onClick={() => setStyle('light')}
          className={`rounded-full px-2 py-1 ${style === 'light' ? 'bg-lagoon-100 text-lagoon-700' : 'text-slate-500'}`}
        >
          Blueprint
        </button>
        <button
          type="button"
          onClick={() => setStyle('satellite')}
          className={`rounded-full px-2 py-1 ${style === 'satellite' ? 'bg-lagoon-100 text-lagoon-700' : 'text-slate-500'}`}
        >
          Relief
        </button>
      </div>
    </div>
  );
}
