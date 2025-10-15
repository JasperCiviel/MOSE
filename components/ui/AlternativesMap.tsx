'use client';

import { useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

interface StakeholderScore {
  label: string;
  value: number;
}

export interface AlternativeLocation {
  id: string;
  name: string;
  summary: string;
  overall: number;
  position: { lat: number; lng: number };
  stakeholderScores: StakeholderScore[];
}

interface AlternativesMapProps {
  items: AlternativeLocation[];
}

export function AlternativesMap({ items }: AlternativesMapProps) {
  const [style, setStyle] = useState<'light' | 'relief'>('light');

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
        {items.map((alt) => (
          <Marker key={alt.id} position={[alt.position.lat, alt.position.lng]}>
            <Popup>
              <strong className="block text-sm">{alt.name}</strong>
              <p className="mt-1 text-xs text-slate-600">{alt.summary}</p>
              <p className="mt-2 text-xs font-semibold text-slate-700">Overall score: {alt.overall.toFixed(0)} / 100</p>
              <ul className="mt-2 space-y-1 text-xs text-slate-600">
                {alt.stakeholderScores.map((score) => (
                  <li key={`${alt.id}-${score.label}`}>
                    {score.label}: {score.value.toFixed(0)} / 100
                  </li>
                ))}
              </ul>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-xs shadow">
        <span className="font-medium text-slate-700">Basemap</span>
        <button
          type="button"
          onClick={() => setStyle('light')}
          className={`rounded-full px-2 py-1 ${style === 'light' ? 'bg-lagoon-100 text-lagoon-700' : 'text-slate-500'}`}
        >
          Lagoon
        </button>
        <button
          type="button"
          onClick={() => setStyle('relief')}
          className={`rounded-full px-2 py-1 ${style === 'relief' ? 'bg-lagoon-100 text-lagoon-700' : 'text-slate-500'}`}
        >
          Relief
        </button>
      </div>
    </div>
  );
}
