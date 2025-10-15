'use client';

import { useMemo } from 'react';
import { useMoseStore } from '@/lib/store';
import { defaultConfig } from '@/lib/defaultConfig';

const { bounds, constants } = defaultConfig;

const metricCopy: Record<string, { label: string; unit?: string; hint: string }> = {
  initial_cost: {
    label: 'Initial Construction Cost',
    unit: 'M€',
    hint: 'Upfront capital required to fabricate caissons, gates, and control systems.'
  },
  maintenance_cost: {
    label: 'Annual Maintenance Cost',
    unit: 'M€ / yr',
    hint: 'Lifecycle servicing effort including corrosion protection and hydraulic upkeep.'
  },
  sight: {
    label: 'Sight / Visual Impact',
    hint: 'Higher values mean the lagoon skyline remains largely unobstructed.'
  },
  accessibility: {
    label: 'Accessibility for Vessels',
    hint: 'Scores above 7 indicate short closures and generous navigation channels.'
  },
  water_quality: {
    label: 'Water Quality (Tidal Exchange)',
    hint: 'Captures how well tides can refresh the lagoon despite barrier operation.'
  },
  overtopping_risk: {
    label: 'Residual Overtopping Risk',
    unit: '%',
    hint: 'Lower values mean the barrier comfortably clears projected storm surges.'
  }
};

function explanation(x1: number, x2: number, x3: number) {
  const parts: string[] = [];
  if (x1 > 1200) {
    parts.push('Most of the 1.6 km inlet is now movable gates, maximising flexibility but demanding costly fabrication.');
  } else if (x1 < 400) {
    parts.push('With few movable modules the barrier acts more like a wall, lowering cost yet constraining vessels.');
  } else {
    parts.push('A mixed fixed / movable layout keeps capital moderate while still giving pilots gate lanes.');
  }

  if (x2 >= 8) {
    parts.push('Towering gates crush overtopping risk but begin to intrude on the lagoon skyline.');
  } else if (x2 <= 4) {
    parts.push('Compact gate heights respect Venice’s horizon yet leave less surge freeboard.');
  } else {
    parts.push('Mid-height gates balance flood safety with a discreet profile.');
  }

  if (x3 <= 1) {
    parts.push('Keeping closures under an hour pleases shippers but requires premium actuators and crews.');
  } else if (x3 >= 4) {
    parts.push('Multi-hour closures simplify operations but slow tidal flushing and port access.');
  } else {
    parts.push('A moderate closure window coordinates safety, ecology, and traffic.');
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
          Explore how movable gate length (x1), gate crest elevation (x2), and closure duration (x3) shape the MOSE
          system&apos;s performance. The sliders mirror the remaining degrees of freedom discussed in studio.
        </p>
      </header>

      <section className="card p-6">
        <h2 className="section-title">Design Controls</h2>
        <div className="space-y-8">
          <div>
            <label className="block text-sm font-medium text-slate-700">Movable Gate Length x1 ({bounds.x1.unit})</label>
            <p className="text-xs text-slate-500">Drag to adjust how much of the 1.6 km inlet can rise on demand.</p>
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
            <label className="block text-sm font-medium text-slate-700">Gate Height x2 ({bounds.x2.unit})</label>
            <p className="text-xs text-slate-500">Set the crest above mean sea level to manage overtopping headroom.</p>
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
            <label className="block text-sm font-medium text-slate-700">Closure Duration x3 ({bounds.x3.unit})</label>
            <p className="text-xs text-slate-500">Short closures favour shipping and ecology but strain mechanical systems.</p>
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
          {Object.entries(metrics).map(([key, value]) => {
            const meta = metricCopy[key] ?? { label: key.replace('_', ' '), hint: '' };
            return (
              <div key={key} className="rounded-2xl border border-slate-100 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{meta.label}</p>
                    {meta.hint ? <p className="text-xs text-slate-500">{meta.hint}</p> : null}
                  </div>
                  <span className="text-xs text-slate-500">Preference: {preferences[key as keyof typeof preferences]} / 100</span>
                </div>
                <p className="mt-3 text-2xl font-semibold text-slate-800">
                  {value.toFixed(key === 'overtopping_risk' ? 1 : 2)} {meta.unit ?? ''}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
