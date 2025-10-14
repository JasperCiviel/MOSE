'use client';

import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';
import { useMoseStore } from '@/lib/store';
import { defaultConfig } from '@/lib/defaultConfig';
import { Accordion } from '@/components/ui/Accordion';

const objectives = defaultConfig.OBJECTIVE_KEYS;

export default function MetricsPage() {
  const { metrics, preferences, prefFns, config, history } = useMoseStore();

  const curves = useMemo(() => {
    return objectives.map((objective) => {
      const { x } = config.knots[objective];
      const min = x[0];
      const max = x[x.length - 1];
      const step = (max - min) / 60;
      const samples = Array.from({ length: 61 }, (_, idx) => {
        const value = min + step * idx;
        return { x: Number(value.toFixed(2)), pref: Number(prefFns[objective](value).toFixed(2)) };
      });
      return { objective, samples };
    });
  }, [config.knots, prefFns]);

  const latestSolutions = useMemo(() => {
    return {
      minmax: history.minmax.at(-1) ?? null,
      tetra: history.tetra.at(-1) ?? null
    };
  }, [history.minmax, history.tetra]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-semibold text-slate-800">Metrics & Preference Curves</h1>
        <p className="max-w-3xl text-sm text-slate-600">
          Each objective is evaluated with piecewise cubic Hermite interpolation (PCHIP) to respect the elicited
          preference points. The current design and the latest GA solutions are plotted for comparison.
        </p>
      </header>

      <section className="space-y-8">
        {curves.map(({ objective, samples }) => {
          const currentMetric = metrics[objective as keyof typeof metrics];
          const currentPref = preferences[objective as keyof typeof preferences];
          const minmaxPoint = latestSolutions.minmax?.metrics[objective as keyof typeof metrics];
          const minmaxPref = latestSolutions.minmax?.preferences[objective as keyof typeof preferences];
          const tetraPoint = latestSolutions.tetra?.metrics[objective as keyof typeof metrics];
          const tetraPref = latestSolutions.tetra?.preferences[objective as keyof typeof preferences];
          return (
            <article key={objective} className="card p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-800">{objective.replace('_', ' ')}</h2>
                  <p className="text-xs text-slate-500">
                    Current metric: {currentMetric.toFixed(2)} → Preference {currentPref.toFixed(0)} / 100
                  </p>
                </div>
              </div>
              <div className="mt-6 h-64 w-full">
                <ResponsiveContainer>
                  <LineChart data={samples} margin={{ left: 24, right: 24, top: 20, bottom: 10 }}>
                    <XAxis dataKey="x" tick={{ fill: '#475569', fontSize: 11 }} type="number" domain={['auto', 'auto']} />
                    <YAxis dataKey="pref" domain={[0, 100]} tick={{ fill: '#475569', fontSize: 11 }} />
                    <Tooltip formatter={(value: number) => `${value.toFixed(1)} preference`} labelFormatter={(label) => `${objective} metric ${label}`} />
                    <Line type="monotone" dataKey="pref" stroke="#0f60db" strokeWidth={2} dot={false} />
                    <ReferenceDot x={currentMetric} y={currentPref} r={6} fill="#dc2626" stroke="white" label={{ value: 'Current', position: 'top', fill: '#dc2626', fontSize: 11 }} />
                    {minmaxPoint != null && minmaxPref != null ? (
                      <ReferenceDot x={minmaxPoint} y={minmaxPref} r={6} fill="#0f766e" stroke="white" label={{ value: 'Minmax', position: 'top', fill: '#0f766e', fontSize: 11 }} />
                    ) : null}
                    {tetraPoint != null && tetraPref != null ? (
                      <ReferenceDot x={tetraPoint} y={tetraPref} r={6} fill="#6366f1" stroke="white" label={{ value: 'Tetra', position: 'bottom', fill: '#6366f1', fontSize: 11 }} />
                    ) : null}
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4">
                <Accordion title="How is this computed?">
                  <p>
                    Metric values are converted to preferences with a monotone PCHIP interpolant defined by the knots {JSON.stringify(config.knots[objective].x)} →
                    {JSON.stringify(config.knots[objective].y)}. Values outside the knot range are clamped before interpolation.
                  </p>
                </Accordion>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
