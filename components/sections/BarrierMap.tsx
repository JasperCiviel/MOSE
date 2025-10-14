'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import type { FeatureCollection } from 'geojson';

const Map = dynamic(() => import('../ui/BarrierMapInner'), { ssr: false });

export function BarrierMap() {
  const [geojson, setGeojson] = useState<FeatureCollection | null>(null);

  useEffect(() => {
    fetch('/data/barriers.geojson')
      .then((res) => res.json())
      .then((data) => setGeojson(data))
      .catch(() => setGeojson(null));
  }, []);

  return (
    <section className="mx-auto mt-16 max-w-6xl px-6">
      <div className="card overflow-hidden">
        <div className="flex flex-col gap-6 p-6 md:flex-row">
          <div className="md:w-1/3">
            <h2 className="section-title">Where MOSE Stands Guard</h2>
            <p className="text-sm text-slate-600">
              Three inlets connect the Venetian lagoon to the Adriatic Sea. Activate the basemap toggle to view either
              the satellite or schematic layer, and tap points to learn about each barrier line.
            </p>
          </div>
          <div className="md:w-2/3">
            <Map geojson={geojson} />
          </div>
        </div>
      </div>
    </section>
  );
}
