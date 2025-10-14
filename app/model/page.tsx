'use client';

import { useMemo, useRef, type ChangeEvent } from 'react';
import { useMoseStore } from '@/lib/store';

export default function ModelPage() {
  const { config, stakeholderNames, stakeholderWeights, stakeholderObjectiveWeights, history, importConfig } = useMoseStore();
  const fileInput = useRef<HTMLInputElement>(null);

  const serializedHistory = useMemo(() => JSON.stringify(history, null, 2), [history]);

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'model-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const json = JSON.parse(text);
    importConfig(json);
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 space-y-8">
      <header className="space-y-4">
        <h1 className="text-4xl font-semibold text-slate-800">Model Dump</h1>
        <p className="text-sm text-slate-600">
          Review the current configuration, normalized stakeholder matrices, and optimization history to ensure the
          workflow stays transparent.
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <button onClick={handleDownload} type="button" className="rounded-full bg-lagoon-500 px-4 py-2 text-white">
            Download JSON
          </button>
          <button
            type="button"
            className="rounded-full border border-lagoon-500 px-4 py-2 text-lagoon-600"
            onClick={() => fileInput.current?.click()}
          >
            Import JSON
          </button>
          <input ref={fileInput} type="file" accept="application/json" className="hidden" onChange={handleImport} />
        </div>
      </header>

      <section className="card p-6">
        <h2 className="section-title">model-config.json</h2>
        <pre className="max-h-[400px] overflow-auto rounded-2xl bg-slate-900 p-4 text-xs text-lime-200">
          {JSON.stringify(config, null, 2)}
        </pre>
      </section>

      <section className="card p-6">
        <h2 className="section-title">Normalized Stakeholder Weights</h2>
        <div className="overflow-x-auto text-sm text-slate-600">
          <table className="min-w-full divide-y divide-slate-200">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Stakeholder</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Influence</th>
                {config.OBJECTIVE_KEYS.map((objective) => (
                  <th key={objective} className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {objective.replace('_', ' ')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stakeholderNames.map((name, idx) => (
                <tr key={name} className="border-b border-slate-100">
                  <td className="px-3 py-2 font-medium text-slate-700">{name}</td>
                  <td className="px-3 py-2">{(stakeholderWeights[idx] * 100).toFixed(1)}%</td>
                  {stakeholderObjectiveWeights[idx].map((value, objIdx) => (
                    <td key={config.OBJECTIVE_KEYS[objIdx]} className="px-3 py-2">
                      {(value * 100).toFixed(1)}%
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card p-6">
        <h2 className="section-title">GA History</h2>
        <pre className="max-h-[400px] overflow-auto rounded-2xl bg-slate-900 p-4 text-xs text-lime-200">{serializedHistory}</pre>
      </section>
    </div>
  );
}
