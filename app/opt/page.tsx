'use client';

import { useMemo, useState } from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Legend } from 'recharts';
import { useMoseStore } from '@/lib/store';
import { defaultConfig } from '@/lib/defaultConfig';

const objectiveOptions = defaultConfig.OBJECTIVE_KEYS;

export default function OptimizationPage() {
  const { history, runGA, gaProgress, pinDesign, pinned, unpinDesign, preferences, aggregate } = useMoseStore();
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>(objectiveOptions.slice(0, 2));
  const baselineOverall = aggregate().overall;

  const scatterData = useMemo(() => {
    const data: { paradigm: string; x: number; y: number; name: string }[] = [];
    history.minmax.forEach((record, idx) => {
      const [first, second] = selectedObjectives;
      data.push({
        paradigm: 'Minmax',
        name: `Minmax #${idx + 1}`,
        x: record.preferences[first as keyof typeof record.preferences],
        y: record.preferences[second as keyof typeof record.preferences]
      });
    });
    history.tetra.forEach((record, idx) => {
      const [first, second] = selectedObjectives;
      data.push({
        paradigm: 'Tetra',
        name: `Tetra #${idx + 1}`,
        x: record.preferences[first as keyof typeof record.preferences],
        y: record.preferences[second as keyof typeof record.preferences]
      });
    });
    return data;
  }, [history.minmax, history.tetra, selectedObjectives]);

  const groupedBars = useMemo(() => {
    return objectiveOptions.map((objective) => ({
      objective,
      minmax: history.minmax.at(-1)?.preferences[objective as keyof (typeof history)['minmax'][number]['preferences']] ?? null,
      tetra: history.tetra.at(-1)?.preferences[objective as keyof (typeof history)['tetra'][number]['preferences']] ?? null,
      current: preferences[objective as keyof typeof preferences]
    }));
  }, [history.minmax, history.tetra, preferences]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-semibold text-slate-800">Optimization Lab</h1>
        <p className="max-w-3xl text-sm text-slate-600">
          Launch the genetic algorithm with different aggregation paradigms. Visualize Pareto-style trade-offs and pin
          designs for narrative comparisons.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        <article className="card p-6 md:col-span-2">
          <h2 className="section-title">Pareto Snapshot</h2>
          <div className="flex flex-wrap gap-3 text-xs text-slate-600">
            {objectiveOptions.map((objective) => (
              <button
                key={objective}
                type="button"
                onClick={() =>
                  setSelectedObjectives((current) => {
                    if (current.includes(objective)) return current;
                    return [objective, current[0]];
                  })
                }
                className={`rounded-full border px-3 py-1 ${
                  selectedObjectives.includes(objective) ? 'border-lagoon-500 text-lagoon-700' : 'border-slate-200'
                }`}
              >
                {objective.replace('_', ' ')}
              </button>
            ))}
          </div>
          <div className="mt-6 h-80">
            <ResponsiveContainer>
              <ScatterChart>
                <CartesianGrid stroke="#e2e8f0" />
                <XAxis type="number" dataKey="x" name={selectedObjectives[0]?.replace('_', ' ')} domain={[0, 100]} />
                <YAxis type="number" dataKey="y" name={selectedObjectives[1]?.replace('_', ' ')} domain={[0, 100]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(value: number) => `${value.toFixed(1)} pts`} />
                <Scatter data={scatterData.filter((d) => d.paradigm === 'Minmax')} name="Minmax" fill="#0f60db" />
                <Scatter data={scatterData.filter((d) => d.paradigm === 'Tetra')} name="Tetra" fill="#f97316" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </article>
        <article className="card p-6 flex flex-col justify-between">
          <div>
            <h2 className="section-title">Run GA</h2>
            <p className="text-xs text-slate-500">Each run launches a web worker and reports best-so-far progress.</p>
          </div>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => runGA('minmax')}
              className="w-full rounded-full bg-lagoon-500 px-4 py-2 text-sm font-semibold text-white"
            >
              Run Minmax
            </button>
            <button
              type="button"
              onClick={() => runGA('tetra')}
              className="w-full rounded-full bg-lagoon-700 px-4 py-2 text-sm font-semibold text-white"
            >
              Run Tetra
            </button>
            {gaProgress ? (
              <div className="rounded-xl bg-lagoon-100 p-3 text-xs text-lagoon-700">
                <p>
                  {gaProgress.paradigm.toUpperCase()} iteration {gaProgress.iteration} — best score {gaProgress.best.toFixed(1)}
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-500">No runs in progress.</p>
            )}
          </div>
        </article>
      </section>

      <section className="card p-6">
        <h2 className="section-title">Preference Comparison</h2>
        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={groupedBars}>
              <XAxis dataKey="objective" tickFormatter={(value) => value.replace('_', ' ')} tick={{ fill: '#475569', fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#475569', fontSize: 11 }} />
              <Tooltip formatter={(value: number) => `${value.toFixed(1)} pts`} />
              <Legend />
              <Bar dataKey="current" fill="#94a3b8" name="Current" />
              <Bar dataKey="minmax" fill="#0f60db" name="Minmax best" />
              <Bar dataKey="tetra" fill="#f97316" name="Tetra best" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <article className="card p-6">
          <h2 className="section-title">Latest Runs</h2>
          <div className="space-y-4 text-sm text-slate-600">
            {[...history.minmax.slice(-3), ...history.tetra.slice(-3)].map((record) => (
              <div key={`${record.paradigm}-${record.iteration}`} className="rounded-xl border border-slate-100 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-700">{record.paradigm.toUpperCase()}</p>
                  <button
                    type="button"
                    onClick={() => pinDesign(record)}
                    className="text-xs font-semibold text-lagoon-600"
                  >
                    Pin
                  </button>
                </div>
                <p className="mt-2 text-xs text-slate-500">Overall score {record.overall.toFixed(1)} / 100</p>
                <p className="mt-2 text-xs text-slate-500">
                  Δ vs baseline: {(record.overall - baselineOverall).toFixed(1)} pts overall preference
                </p>
              </div>
            ))}
          </div>
        </article>
        <article className="card p-6">
          <h2 className="section-title">Pinned Designs</h2>
          {pinned.length === 0 ? (
            <p className="text-sm text-slate-500">Pin GA outcomes to compare metrics, stakeholder totals, and export later.</p>
          ) : (
            <ul className="space-y-4 text-sm text-slate-700">
              {pinned.map((record, idx) => (
                <li key={`${record.paradigm}-${record.iteration}`} className="rounded-xl border border-slate-100 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-700">{record.paradigm.toUpperCase()}</p>
                      <p className="text-xs text-slate-500">Overall {record.overall.toFixed(1)} / 100</p>
                    </div>
                    <button type="button" onClick={() => unpinDesign(idx)} className="text-xs text-rose-500">
                      Remove
                    </button>
                  </div>
                  <p className="mt-3 text-xs text-slate-500">
                    Narrative delta: {record.stakeholder.map((score, sIdx) => `S${sIdx + 1}: ${score.toFixed(1)}`).join(' | ')}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>
    </div>
  );
}
