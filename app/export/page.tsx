'use client';

import { useMemo, useRef, useState } from 'react';
import { useMoseStore } from '@/lib/store';

const html2pdfPromise = () => import('html2pdf.js');

export default function ExportPage() {
  const exportRef = useRef<HTMLDivElement>(null);
  const { design, metrics, preferences, history, pinned, scenario } = useMoseStore();
  const [status, setStatus] = useState<string>('');

  const pageEstimate = useMemo(() => 8 + pinned.length * 2 + history.minmax.length + history.tetra.length, [history, pinned.length]);
  const overLimit = pageEstimate > 50;

  const handleExport = async () => {
    if (!exportRef.current) return;
    setStatus('Preparing PDF…');
    const html2pdf = (await html2pdfPromise()).default;
    const opt = {
      margin: 0.5,
      filename: 'mose-odl-report.pdf',
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    await html2pdf().from(exportRef.current).set(opt).save();
    setStatus('Export complete — check your downloads folder.');
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 space-y-8">
      <header className="space-y-4">
        <h1 className="text-4xl font-semibold text-slate-800">Export Bundle</h1>
        <p className="text-sm text-slate-600">
          Generate a management-ready PDF containing the current design snapshot, GA outcomes, MCDA settings, and ethics
          notes. Ensure the bundle stays under 50 pages for reviewers.
        </p>
      </header>

      <section className="card p-6 space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Report status</h2>
            <p className="text-xs text-slate-500">Estimated pages: {pageEstimate} (limit 50)</p>
          </div>
          <button
            type="button"
            onClick={handleExport}
            className="rounded-full bg-lagoon-500 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
            disabled={overLimit}
          >
            Export PDF
          </button>
        </div>
        {overLimit ? (
          <p className="text-xs text-rose-500">
            Trim pinned designs or GA history to stay within the 50-page export limit.
          </p>
        ) : null}
        {status ? <p className="text-xs text-slate-500">{status}</p> : null}
      </section>

      <div ref={exportRef} className="hidden">
        <section>
          <h1>MOSE Open Design Lab — Export</h1>
          <p>Scenario: sea-level {scenario.seaLevelRise.toFixed(2)} m, storminess {scenario.storminess.toFixed(2)}×, maintenance budget {scenario.maintenanceBudget.toFixed(2)}×.</p>
        </section>
        <section>
          <h2>Current Design</h2>
          <ul>
            <li>x1: {design.x1.toFixed(0)}</li>
            <li>x2: {design.x2.toFixed(2)}</li>
            <li>x3: {design.x3.toFixed(2)}</li>
          </ul>
        </section>
        <section>
          <h2>Metrics & Preferences</h2>
          <ul>
            {Object.entries(metrics).map(([key, value]) => (
              <li key={key}>
                {key}: {value.toFixed(2)} (preference {preferences[key as keyof typeof preferences]})
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2>Optimization History</h2>
          {['minmax', 'tetra'].map((paradigm) => (
            <div key={paradigm}>
              <h3>{paradigm.toUpperCase()}</h3>
              <ul>
                {history[paradigm as 'minmax' | 'tetra'].map((record) => (
                  <li key={record.iteration}>
                    overall {record.overall.toFixed(1)} / 100 — design ({record.design.x1.toFixed(0)}, {record.design.x2.toFixed(2)}, {record.design.x3.toFixed(2)})
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
        <section>
          <h2>Pinned Designs</h2>
          <ul>
            {pinned.map((record) => (
              <li key={record.iteration}>
                {record.paradigm.toUpperCase()} — {record.overall.toFixed(1)} / 100 with stakeholder scores {record.stakeholder
                  .map((score) => score.toFixed(1))
                  .join(', ')}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
