'use client';

import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useState } from 'react';
import type { AlternativeLocation } from '../sections/AlternativesMap';

interface Props {
  alternatives: AlternativeLocation[];
}

export default function AlternativesMapInner({ alternatives }: Props) {
  const [style, setStyle] = useState<'light' | 'satellite'>('light');

  return (
    <div className="relative h-[360px] w-full overflow-hidden rounded-2xl">
      <MapContainer center={[45.43, 12.34]} zoom={11} className="h-full w-full" scrollWheelZoom>
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url={
            style === 'light'
              ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              : 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
          }
        />
        {alternatives.map((alternative) => (
          <Marker key={alternative.id} position={alternative.position}>
            <Popup>
              <div className="space-y-2">
                <h3 className="font-semibold text-slate-800">{alternative.name}</h3>
                <p className="text-xs text-slate-600">{alternative.summary}</p>
                <ul className="space-y-1 text-xs text-slate-500">
                  {alternative.stakeholderNotes.map((note) => (
                    <li key={note.stakeholder}>
                      <span className="font-semibold text-slate-700">{note.stakeholder}:</span> {note.sentiment}
                    </li>
                  ))}
                </ul>
              </div>
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
