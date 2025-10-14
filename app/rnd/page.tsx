'use client';

import { useState } from 'react';
import { useMoseStore } from '@/lib/store';

const team = [
  { key: 'hydro', title: 'Hydrodynamics', hypothesis: 'Finer tide windows reduce overtopping without blocking traffic.' },
  { key: 'ecology', title: 'Lagoon Ecology', hypothesis: 'Longer openings improve water quality resilience.' },
  { key: 'ops', title: 'Operations', hypothesis: 'Predictive scheduling lowers maintenance cost growth.' }
];

export default function RnDPage() {
  const { setScenario, scenario } = useMoseStore();
  const [notes, setNotes] = useState<Record<string, string>>({});

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 space-y-10">
      <header className="space-y-4">
        <h1 className="text-4xl font-semibold text-slate-800">R&D Experiments</h1>
        <p className="text-sm text-slate-600">
          Document working hypotheses and trigger quick tests by adjusting scenario levers. Snapshot results for
          discussion in studio.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        {team.map((member) => (
          <article key={member.key} className="card p-6 space-y-3">
            <h2 className="text-lg font-semibold text-slate-800">{member.title}</h2>
            <p className="text-xs text-slate-500">Hypothesis</p>
            <p className="text-sm text-slate-600">{member.hypothesis}</p>
            <textarea
              className="min-h-[120px] w-full rounded-2xl border border-slate-200 p-3 text-sm"
              placeholder="Method & expected impact"
              value={notes[member.key] ?? ''}
              onChange={(event) => setNotes((prev) => ({ ...prev, [member.key]: event.target.value }))}
            />
          </article>
        ))}
      </section>

      <section className="card p-6 space-y-4">
        <h2 className="section-title">Quick Test</h2>
        <p className="text-xs text-slate-500">
          Apply a temporary scenario shift to inspect how metrics respond. Reset to baseline by moving sliders back to
          their defaults (0 m, 1× storminess, 1× maintenance).
        </p>
        <div className="grid gap-4 md:grid-cols-3 text-sm text-slate-600">
          <label className="space-y-2">
            <span>Sea-level stress</span>
            <input
              type="range"
              min={0}
              max={0.6}
              step={0.05}
              value={scenario.seaLevelRise}
              onChange={(event) => setScenario({ seaLevelRise: Number(event.target.value) })}
            />
            <span className="block text-xs text-slate-500">{scenario.seaLevelRise.toFixed(2)} m</span>
          </label>
          <label className="space-y-2">
            <span>Storm index</span>
            <input
              type="range"
              min={0.5}
              max={2}
              step={0.1}
              value={scenario.storminess}
              onChange={(event) => setScenario({ storminess: Number(event.target.value) })}
            />
            <span className="block text-xs text-slate-500">{scenario.storminess.toFixed(2)}×</span>
          </label>
          <label className="space-y-2">
            <span>O&M budget</span>
            <input
              type="range"
              min={0.5}
              max={1.5}
              step={0.05}
              value={scenario.maintenanceBudget}
              onChange={(event) => setScenario({ maintenanceBudget: Number(event.target.value) })}
            />
            <span className="block text-xs text-slate-500">{scenario.maintenanceBudget.toFixed(2)}×</span>
          </label>
        </div>
      </section>
    </div>
  );
}
