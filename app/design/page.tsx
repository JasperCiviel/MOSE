'use client';

import { useMemo } from 'react';
import { useMoseStore } from '@/lib/store';
import { defaultConfig } from '@/lib/defaultConfig';

const { bounds, constants } = defaultConfig;

function explanation(x1: number, x2: number, x3: number) {
  const parts: string[] = [];
  if (x1 > (bounds.x1.min + bounds.x1.max) / 2) {
    parts.push('Longer barriers improve coverage but drive initial cost upward.');
  } else {
    parts.push('Shorter barrier length trims capital cost yet may leave the lagoon exposed.');
  }
  if (x2 > (bounds.x2.min + bounds.x2.max) / 2) {
    parts.push('Taller gates bolster overtopping protection and help residents feel secure.');
  } else {
    parts.push('Lower gate profiles preserve views but increase overtopping risk.');
  }
  if (x3 < 1.5) {
    parts.push('Rapid opening times reduce flood exposure but increase mechanical stress and maintenance.');
  } else {
    parts.push('Slower openings ease mechanical loads and shipping coordination, yet risk missing surprise surges.');
  }
  return parts.join(' ');
}

export default function DesignPage() {
  const { design, metrics, preferences, setDesign, aggregate } = useMoseStore();
  const feasibility = useMemo(() => {
    const issues: string[] = [];
    if (design.x1 > constants.TOTAL_LENGTH) issues.push('Barrier length exceeds the lagoon inlet envelope.');
    if (design.x3 < constants.MIN_CLOSING_TIME) issues.push('Opening time breaches the minimum mechanical limit.');
    const ok = issues.length === 0;
    return { ok, issues };
  }, [design.x1, design.x3]);

  const aggregation = aggregate();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 space-y-10">
      <header className="space-y-4">
        <h1 className="text-4xl font-semibold text-slate-800">Design & Feasibility</h1>
        <p className="max-w-3xl text-sm text-slate-600">
          Explore how barrier length (x1), gate height (x2), and opening time (x3) shape the MOSE system&apos;s metrics.
          Move the sliders to see immediate feedback across cost, accessibility, water quality, and risk preferences.
        </p>
      </header>

      <section className="card p-6">
        <h2 className="section-title">Design Controls</h2>
        <div className="space-y-8">
          <div>
            <label className="block text-sm font-medium text-slate-700">Barrier Length x1 ({bounds.x1.unit})</label>
            <p className="text-xs text-slate-500">Longer barriers close more lagoon entrances but increase fabrication cost.</p>
            <input
              type="range"
              min={bounds.x1.min}
              max={bounds.x1.max}
              step={bounds.x1.step}
              value={design.x1}
              onChange={(event) => setDesign({ x1: Number(event.target.value) })}
              className="mt-2 w-full"
            />
            <p className="mt-2 text-sm text-slate-700">Current: {design.x1.toFixed(0)} {bounds.x1.unit}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Barrier Height x2 ({bounds.x2.unit})</label>
            <p className="text-xs text-slate-500">Taller gates resist storm surge but change the skyline and require more energy.</p>
            <input
              type="range"
              min={bounds.x2.min}
              max={bounds.x2.max}
              step={bounds.x2.step}
              value={design.x2}
              onChange={(event) => setDesign({ x2: Number(event.target.value) })}
              className="mt-2 w-full"
            />
            <p className="mt-2 text-sm text-slate-700">Current: {design.x2.toFixed(2)} {bounds.x2.unit}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Opening Time x3 ({bounds.x3.unit})</label>
            <p className="text-xs text-slate-500">Faster openings reduce flood exposure but can disrupt vessels and raise maintenance.</p>
            <input
              type="range"
              min={bounds.x3.min}
              max={bounds.x3.max}
              step={bounds.x3.step}
              value={design.x3}
              onChange={(event) => setDesign({ x3: Number(event.target.value) })}
              className="mt-2 w-full"
            />
            <p className="mt-2 text-sm text-slate-700">Current: {design.x3.toFixed(2)} {bounds.x3.unit}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <article className={`card p-6 ${feasibility.ok ? 'border-green-200' : 'border-red-200'}`}>
          <h2 className="section-title">Feasibility Snapshot</h2>
          <p className={`text-sm font-medium ${feasibility.ok ? 'text-emerald-600' : 'text-rose-600'}`}>
            {feasibility.ok ? 'Design passes current constraints.' : 'Design violates constraints.'}
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-xs text-slate-600">
            {feasibility.ok ? (
              <li>Within structural envelope and mechanical operating limits.</li>
            ) : (
              feasibility.issues.map((issue) => <li key={issue}>{issue}</li>)
            )}
          </ul>
        </article>
        <article className="card p-6">
          <h2 className="section-title">Narrative Insight</h2>
          <p className="text-sm text-slate-600">{explanation(design.x1, design.x2, design.x3)}</p>
          <div className="mt-6 rounded-xl bg-lagoon-100 p-4 text-sm text-lagoon-700">
            <p>
              Aggregated stakeholder score ({aggregation.overall.toFixed(1)} / 100) — switch paradigms in the optimization
              lab to compare fairness assumptions.
            </p>
          </div>
        </article>
      </section>

      <section className="card p-6">
        <h2 className="section-title">Metric Feedback</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(metrics).map(([key, value]) => (
            <div key={key} className="rounded-2xl border border-slate-100 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">{key.replace('_', ' ')}</p>
                <span className="text-xs text-slate-500">Preference: {preferences[key as keyof typeof preferences]} / 100</span>
              </div>
              <p className="mt-3 text-2xl font-semibold text-slate-800">{value.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
