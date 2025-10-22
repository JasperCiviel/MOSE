'use client';

import dynamic from 'next/dynamic';

export interface AlternativeLocation {
  id: string;
  name: string;
  position: [number, number];
  summary: string;
  stakeholderNotes: { stakeholder: string; sentiment: string }[];
}

const Map = dynamic(() => import('../ui/AlternativesMapInner'), { ssr: false });

interface Props {
  alternatives: AlternativeLocation[];
}

export function AlternativesMap({ alternatives }: Props) {
  return (
    <section className="card p-6">
      <div className="grid gap-6 md:grid-cols-5">
        <div className="md:col-span-2 space-y-3">
          <h2 className="section-title">Interactive Lagoon Map</h2>
          <p className="text-sm text-slate-600">
            Click each marker to see how stakeholders judged that alternative. Locations are indicative — they show where
            a strategy would intervene in the Venetian lagoon.
          </p>
        </div>
        <div className="md:col-span-3">
          <Map alternatives={alternatives} />
        </div>
      </div>
    </section>
  );
}
