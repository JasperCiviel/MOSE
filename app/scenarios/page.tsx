'use client';

import { useMemo } from 'react';
import { useMoseStore } from '@/lib/store';

export default function ScenariosPage() {
  const { scenario, setScenario, metrics, preferences } = useMoseStore();

  const notes = useMemo(() => {
    const items: string[] = [];
    if (scenario.seaLevelRise > 0) items.push('Higher sea-level rise increases capital and environmental loads.');
    if (scenario.storminess !== 1) items.push('Storminess shifts maintenance and overtopping penalties.');
    if (scenario.maintenanceBudget !== 1) items.push('Maintenance budget scaling changes how upkeep costs are evaluated.');
    return items.length > 0 ? items : ['Scenario matches baseline configuration.'];
  }, [scenario.maintenanceBudget, scenario.seaLevelRise, scenario.storminess]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 space-y-10">
      <header className="space-y-4">
        <h1 className="text-4xl font-semibold text-slate-800">Scenarios</h1>
        <p className="max-w-3xl text-sm text-slate-600">
          Stress-test MOSE under changing environmental and budget assumptions. Scenario adjustments immediately feed
          the design workspace, stakeholder aggregation, and optimization runs.
        </p>
      </header>

      <section className="card p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700">Sea-level rise (m equivalent)</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={scenario.seaLevelRise}
            onChange={(event) => setScenario({ seaLevelRise: Number(event.target.value) })}
            className="mt-2 w-full"
          />
          <p className="mt-2 text-xs text-slate-500">Current: {scenario.seaLevelRise.toFixed(2)} m</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Storminess multiplier</label>
          <input
            type="range"
            min={0.5}
            max={2}
            step={0.1}
            value={scenario.storminess}
            onChange={(event) => setScenario({ storminess: Number(event.target.value) })}
            className="mt-2 w-full"
          />
          <p className="mt-2 text-xs text-slate-500">Current: {scenario.storminess.toFixed(2)}×</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Maintenance budget scaling</label>
          <input
            type="range"
            min={0.5}
            max={1.5}
            step={0.05}
            value={scenario.maintenanceBudget}
            onChange={(event) => setScenario({ maintenanceBudget: Number(event.target.value) })}
            className="mt-2 w-full"
          />
          <p className="mt-2 text-xs text-slate-500">Current: {scenario.maintenanceBudget.toFixed(2)}×</p>
        </div>
      </section>

      <section className="card p-6">
        <h2 className="section-title">Scenario Notes</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
          {notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>

      <section className="card p-6">
        <h2 className="section-title">Current Impact</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(metrics).map(([key, value]) => (
            <div key={key} className="rounded-2xl border border-slate-100 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-700">{key.replace('_', ' ')}</p>
              <p className="mt-1">Metric: {value.toFixed(2)}</p>
              <p className="text-xs text-slate-500">Preference: {preferences[key as keyof typeof preferences]} / 100</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
