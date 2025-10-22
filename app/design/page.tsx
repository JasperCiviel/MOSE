'use client';

import { useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceDot
} from 'recharts';
import { useMoseStore } from '@/lib/store';
<<<<<<< Updated upstream
import { defaultConfig } from '@/lib/defaultConfig';
=======
import type { ModelConfig } from '@/lib/defaultConfig';
import type { ObjectiveKey } from '@/lib/model';

const metricMeta: Record<
  ObjectiveKey,
  { label: string; description: string; formatter: 'currency' | 'score' | 'risk'; axisLabel: string }
> = {
  initial_cost: {
    label: 'Initial construction cost',
    description:
      'Capital expenditure for movable gates versus fixed structures. More movable metres and taller gates increase expenditure.',
    formatter: 'currency',
    axisLabel: 'Cost (EUR)'
  },
  maintenance_cost: {
    label: 'Lifetime maintenance cost',
    description:
      'Ongoing upkeep over a 100-year horizon. Frequent short closures and tall gates accelerate maintenance spending.',
    formatter: 'currency',
    axisLabel: 'Maintenance (EUR)'
  },
  sight: {
    label: 'Sightline score',
    description:
      'Aesthetic impact on Venice’s skyline. Movable gates stay underwater when not in use, improving the score.',
    formatter: 'score',
    axisLabel: 'Sight score [-]'
  },
  accessibility: {
    label: 'Navigation accessibility',
    description:
      'Measures how easy it is for vessels to enter and leave the lagoon. Long closures or few movable spans reduce access.',
    formatter: 'score',
    axisLabel: 'Accessibility score [-]'
  },
  water_quality: {
    label: 'Water quality score',
    description:
      'Proxy for tidal exchange and ecological health. Frequent closures stagnate water; more movable gates help the lagoon breathe.',
    formatter: 'score',
    axisLabel: 'Water quality score [-]'
  },
  overtopping_risk: {
    label: 'Residual overtopping risk',
    description:
      'Annual probability that surge water flows over the barrier. Taller gates suppress the risk exponentially.',
    formatter: 'risk',
    axisLabel: 'Risk [-]'
  }
};
>>>>>>> Stashed changes

const { bounds, constants } = defaultConfig;

function explanation(x1: number, x2: number, x3: number) {
  const parts: string[] = [];
<<<<<<< Updated upstream
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
=======
  const halfLength = (bounds.x1.min + bounds.x1.max) / 2;
  const halfHeight = (bounds.x2.min + bounds.x2.max) / 2;
  const halfTime = (bounds.x3.min + bounds.x3.max) / 2;

  parts.push(
    x1 > halfLength
      ? 'Extending the movable span towards 1.6 km maximises protection but drives costs sharply upward.'
      : 'A shorter movable length trims capital cost, yet more of the lagoon stays exposed to storm surge.'
  );
  parts.push(
    x2 > halfHeight
      ? 'Taller gates (above ~5 m) almost eliminate overtopping but increase weight, energy demand, and visual impact when raised.'
      : 'Lower gates respect the skyline, though the remaining overtopping risk climbs quickly.'
  );
  parts.push(
    x3 < halfTime
      ? 'Keeping closures under two hours favours residents and shipping but requires high readiness and maintenance.'
      : 'Long closures are easier on machinery yet frustrate port access and reduce tidal flushing.'
  );

>>>>>>> Stashed changes
  return parts.join(' ');
}

function formatMetricValue(key: ObjectiveKey, value: number) {
  const meta = metricMeta[key];
  if (meta.formatter === 'currency') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      notation: 'compact',
      maximumFractionDigits: 2
    }).format(value);
  }
  if (meta.formatter === 'risk') {
    return `${(value * 100).toFixed(1)}%`;
  }
  return value.toFixed(2);
}

export default function DesignPage() {
<<<<<<< Updated upstream
  const { design, metrics, preferences, setDesign, aggregate } = useMoseStore();
=======
  const { config, design, metrics, preferences, prefFns, history, setDesign, aggregate } = useMoseStore();
  const { bounds, constants } = config;

>>>>>>> Stashed changes
  const feasibility = useMemo(() => {
    const issues: string[] = [];
    if (design.x1 > constants.TOTAL_LENGTH) issues.push('Barrier length exceeds the lagoon inlet envelope.');
    if (design.x3 < constants.MIN_CLOSING_TIME) issues.push('Opening time breaches the minimum mechanical limit.');
    const ok = issues.length === 0;
    return { ok, issues };
<<<<<<< Updated upstream
  }, [design.x1, design.x3]);
=======
  }, [bounds, constants.MIN_CLOSING_TIME, constants.TOTAL_LENGTH, design]);
>>>>>>> Stashed changes

  const aggregation = aggregate();
  const latestTetra = history.tetra.at(-1) ?? null;
  const latestMinmax = history.minmax.at(-1) ?? null;

  const preferenceCurves = useMemo(() => {
    return (config.OBJECTIVE_KEYS as ObjectiveKey[]).map((objective) => {
      const { x: domain } = config.knots[objective];
      const min = domain[0];
      const max = domain[domain.length - 1];
      const steps = 120;
      const samples = Array.from({ length: steps + 1 }, (_, idx) => {
        const value = min + (idx / steps) * (max - min);
        const preference = prefFns[objective]?.(value) ?? 0;
        return { metric: value, preference };
      });
      return { objective, min, max, samples };
    });
  }, [config.OBJECTIVE_KEYS, config.knots, prefFns]);

  return (
<<<<<<< Updated upstream
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
=======
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="grid gap-6 items-start lg:grid-cols-[380px_1fr] xl:grid-cols-[420px_1fr]">
        <div className="space-y-6 lg:sticky lg:top-24 self-start">
          <header className="space-y-4">
            <h1 className="text-4xl font-semibold text-slate-800">Design &amp; Feasibility</h1>
            <p className="text-sm text-slate-600">
              Adjust the three degrees of freedom — movable length (x1), gate height (x2), and closure duration (x3) — to
              see how stakeholder metrics respond in real time. The sliders mirror the GA notebook used in PBED sessions.
>>>>>>> Stashed changes
            </p>
          </header>

          <section className="card p-6 space-y-6">
            <h2 className="section-title">Design Controls</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Movable barrier length x1 ({bounds.x1.unit})
                </label>
                <p className="text-xs text-slate-500">
                  {bounds.x1.min}–{bounds.x1.max} m. Represents how much of the 1.6 km inlet span is composed of movable
                  gates rather than fixed structure.
                </p>
                <input
                  type="range"
                  min={bounds.x1.min}
                  max={bounds.x1.max}
                  step={bounds.x1.step}
                  value={design.x1}
                  onChange={(event) => setDesign({ x1: Number(event.target.value) })}
                  className="w-full"
                />
                <p className="text-sm text-slate-700">Current: {design.x1.toFixed(0)} {bounds.x1.unit}</p>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Gate height above water x2 ({bounds.x2.unit})
                </label>
                <p className="text-xs text-slate-500">
                  {bounds.x2.min}–{bounds.x2.max} m. Taller gates improve safety but are heavier, more visible, and harder
                  to maintain.
                </p>
                <input
                  type="range"
                  min={bounds.x2.min}
                  max={bounds.x2.max}
                  step={bounds.x2.step}
                  value={design.x2}
                  onChange={(event) => setDesign({ x2: Number(event.target.value) })}
                  className="w-full"
                />
                <p className="text-sm text-slate-700">Current: {design.x2.toFixed(2)} {bounds.x2.unit}</p>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Closure duration x3 ({bounds.x3.unit})
                </label>
                <p className="text-xs text-slate-500">
                  {bounds.x3.min}–{bounds.x3.max} h. Short closures favour water exchange and port access; long closures
                  ease operations but frustrate shipping and ecology.
                </p>
                <input
                  type="range"
                  min={bounds.x3.min}
                  max={bounds.x3.max}
                  step={bounds.x3.step}
                  value={design.x3}
                  onChange={(event) => setDesign({ x3: Number(event.target.value) })}
                  className="w-full"
                />
                <p className="text-sm text-slate-700">Current: {design.x3.toFixed(2)} {bounds.x3.unit}</p>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="grid gap-6 sm:grid-cols-2">
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
              <p className="text-sm text-slate-600">{explanation(bounds, design.x1, design.x2, design.x3)}</p>
              <div className="mt-4 rounded-xl bg-lagoon-100 p-4 text-sm text-lagoon-700">
                <p>
                  Aggregated stakeholder score ({aggregation.overall.toFixed(1)} / 100). Use the Optimization Lab to
                  compare min-max fairness with the weighted-sum (Tetra) paradigm.
                </p>
              </div>
            </article>
          </section>

          <section className="card p-6">
            <h2 className="section-title">Metric Feedback</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {(Object.keys(metricMeta) as ObjectiveKey[]).map((key) => (
                <div key={key} className="rounded-2xl border border-slate-100 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-700">{metricMeta[key].label}</p>
                    <span className="text-xs text-slate-500">
                      Preference: {preferences[key as keyof typeof preferences]} / 100
                    </span>
                  </div>
                  <p className="text-2xl font-semibold text-slate-800">{formatMetricValue(key, metrics[key])}</p>
                  <p className="text-xs text-slate-500">{metricMeta[key].description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="card p-6 space-y-6">
            <h2 className="section-title">Preference Curves (notebook derived)</h2>
            <p className="text-sm text-slate-600">
              Each curve is the PCHIP interpolation from the <code>mose_3x5_corrected.ipynb</code> notebook. The dots show
              the current design and the latest GA outcomes so you can compare where they fall on the preference scale.
            </p>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {preferenceCurves.map(({ objective, samples, min, max }) => {
                const meta = metricMeta[objective];
                const clamp = (value: number) => Math.min(Math.max(value, min), max);
                const currentMetric = clamp(metrics[objective]);
                const currentPref = preferences[objective];
                const tetraMetric = latestTetra ? clamp(latestTetra.metrics[objective]) : null;
                const tetraPref = latestTetra ? latestTetra.preferences[objective] : null;
                const minmaxMetric = latestMinmax ? clamp(latestMinmax.metrics[objective]) : null;
                const minmaxPref = latestMinmax ? latestMinmax.preferences[objective] : null;

                return (
                  <article key={objective} className="space-y-3">
                    <h3 className="text-base font-semibold text-slate-700">{meta.label}</h3>
                    <div className="h-40 w-full">
                      <ResponsiveContainer>
                        <LineChart data={samples} margin={{ left: 12, right: 12, top: 12, bottom: 12 }}>
                          <XAxis
                            dataKey="metric"
                            tick={{ fill: '#475569', fontSize: 11 }}
                            type="number"
                            domain={[min, max]}
                            label={{
                              value: meta.axisLabel,
                              position: 'insideBottom',
                              offset: -6,
                              fill: '#475569',
                              fontSize: 10
                            }}
                          />
                          <YAxis
                            dataKey="preference"
                            domain={[0, 100]}
                            tick={{ fill: '#475569', fontSize: 11 }}
                            label={{
                              value: 'Preference (0-100)',
                              angle: -90,
                              position: 'insideLeft',
                              offset: 8,
                              fill: '#475569',
                              fontSize: 10
                            }}
                          />
                          <Tooltip
                            formatter={(value: number) => `${value.toFixed(1)} preference`}
                            labelFormatter={(label) => `${meta.label}: ${label.toLocaleString()}`}
                          />
                          <Line type="monotone" dataKey="preference" stroke="#0f60db" strokeWidth={2} dot={false} />
                          <ReferenceDot
                            x={currentMetric}
                            y={currentPref}
                            r={6}
                            fill="#dc2626"
                            stroke="white"
                            label={{ value: 'Current', position: 'top', fill: '#dc2626', fontSize: 10 }}
                          />
                          {tetraMetric != null && tetraPref != null ? (
                            <ReferenceDot
                              x={tetraMetric}
                              y={tetraPref}
                              r={6}
                              fill="#0f766e"
                              stroke="white"
                              label={{ value: 'Tetra', position: 'top', fill: '#0f766e', fontSize: 10 }}
                            />
                          ) : null}
                          {minmaxMetric != null && minmaxPref != null ? (
                            <ReferenceDot
                              x={minmaxMetric}
                              y={minmaxPref}
                              r={6}
                              fill="#6366f1"
                              stroke="white"
                              label={{ value: 'Min-max', position: 'bottom', fill: '#6366f1', fontSize: 10 }}
                            />
                          ) : null}
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
