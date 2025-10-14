'use client';

import { useMemo } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { defaultConfig } from '@/lib/defaultConfig';
import { useMoseStore } from '@/lib/store';
import { aggregatePreferences } from '@/lib/model';

const objectives = defaultConfig.OBJECTIVE_KEYS;

export default function StakeholdersPage() {
  const {
    stakeholderNames,
    stakeholderWeights,
    stakeholderObjectiveWeights,
    stakeholderRawInfluence,
    stakeholderRawObjectiveWeights,
    preferences,
    aggregator,
    updateStakeholderInfluence,
    updateStakeholderObjectiveWeight
  } = useMoseStore();

  const groupPreferences = useMemo(
    () =>
      objectives.map((objective, idx) => ({
        objective,
        weight: stakeholderWeights.reduce((acc, w, sIdx) => acc + w * stakeholderObjectiveWeights[sIdx][idx], 0)
      })),
    [stakeholderObjectiveWeights, stakeholderWeights]
  );

  const baseline = useMemo(
    () => aggregatePreferences(preferences, stakeholderWeights, stakeholderObjectiveWeights, aggregator),
    [preferences, stakeholderObjectiveWeights, stakeholderWeights, aggregator]
  );

  const sensitivity = useMemo(() => {
    const results = stakeholderNames.map((name, idx) => {
      const clone = stakeholderRawInfluence.slice();
      clone[idx] = clone[idx] * 1.1;
      const sumUp = clone.reduce((sum, val) => sum + val, 0) || 1;
      const weightsUp = clone.map((val) => val / sumUp);
      const objectivesUp = stakeholderRawObjectiveWeights.map((row) => {
        const rowSum = row.reduce((sum, val) => sum + val, 0) || 1;
        return row.map((val) => val / rowSum);
      });
      const resultUp = aggregatePreferences(preferences, weightsUp, objectivesUp, aggregator).overall;

      const cloneDown = stakeholderRawInfluence.slice();
      cloneDown[idx] = Math.max(0.01, cloneDown[idx] * 0.9);
      const sumDown = cloneDown.reduce((sum, val) => sum + val, 0) || 1;
      const weightsDown = cloneDown.map((val) => val / sumDown);
      const resultDown = aggregatePreferences(preferences, weightsDown, objectivesUp, aggregator).overall;

      return {
        stakeholder: name,
        plus10: Number((resultUp - baseline.overall).toFixed(2)),
        minus10: Number((resultDown - baseline.overall).toFixed(2))
      };
    });
    return results;
  }, [aggregator, baseline.overall, preferences, stakeholderNames, stakeholderRawInfluence, stakeholderRawObjectiveWeights]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-semibold text-slate-800">Stakeholders & MCDA</h1>
        <p className="max-w-3xl text-sm text-slate-600">
          Update the influence of key groups and rebalance the objective weights they champion. Changes reflow into all
          metrics, preference curves, and optimization runs so the class can compare perspectives transparently.
        </p>
      </header>

      <section className="card p-6">
        <h2 className="section-title">Influence Weights</h2>
        <div className="space-y-6">
          {stakeholderNames.map((name, idx) => (
            <div key={name} className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="md:w-1/4">
                <p className="text-sm font-medium text-slate-700">{name}</p>
                <p className="text-xs text-slate-500">Normalized: {(stakeholderWeights[idx] * 100).toFixed(1)}%</p>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={stakeholderRawInfluence[idx]}
                onChange={(event) => updateStakeholderInfluence(idx, Number(event.target.value))}
                className="flex-1"
                aria-label={`${name} influence`}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="card p-6">
        <h2 className="section-title">Objective Emphasis per Stakeholder</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Stakeholder</th>
                {objectives.map((objective) => (
                  <th key={objective} className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {objective.replace('_', ' ')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stakeholderNames.map((name, sIdx) => (
                <tr key={name} className="border-b border-slate-100">
                  <td className="px-3 py-3 font-medium text-slate-700">{name}</td>
                  {objectives.map((objective, oIdx) => (
                    <td key={objective} className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.01}
                          value={stakeholderRawObjectiveWeights[sIdx][oIdx]}
                          onChange={(event) =>
                            updateStakeholderObjectiveWeight(sIdx, oIdx, Number(event.target.value))
                          }
                          className="flex-1"
                          aria-label={`${name} weight for ${objective}`}
                        />
                        <span className="w-14 text-right text-xs text-slate-500">
                          {(stakeholderObjectiveWeights[sIdx][oIdx] * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <article className="card p-6">
          <h2 className="section-title">Group Preference Blend</h2>
          <div className="h-72">
            <ResponsiveContainer>
              <RadarChart data={groupPreferences} outerRadius="80%">
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="objective" tickFormatter={(value) => value.replace('_', ' ')} tick={{ fill: '#475569', fontSize: 11 }} />
                <PolarRadiusAxis tick={{ fill: '#64748b', fontSize: 10 }} angle={90} domain={[0, 1]} tickFormatter={(value) => `${Math.round(value * 100)}%`} />
                <Radar dataKey="weight" stroke="#0f60db" fill="#0f60db" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            The radar combines stakeholder influence and objective emphasis, revealing which metrics dominate the shared narrative.
          </p>
        </article>
        <article className="card p-6">
          <h2 className="section-title">Sensitivity to Influence ±10%</h2>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={sensitivity}>
                <XAxis dataKey="stakeholder" tick={{ fill: '#475569', fontSize: 12 }} />
                <YAxis tick={{ fill: '#475569', fontSize: 11 }} domain={['auto', 'auto']} tickFormatter={(value) => `${value.toFixed(1)}`}
                />
                <Tooltip formatter={(value: number) => `${value.toFixed(2)} pts vs baseline`} />
                <Legend />
                <Bar dataKey="plus10" fill="#0f60db" name="+10% influence" />
                <Bar dataKey="minus10" fill="#94a3b8" name="-10% influence" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Positive bars indicate stakeholders who gain in the aggregate score when their influence grows; negative bars show who loses ground as influence is reduced.
          </p>
        </article>
      </section>
    </div>
  );
}
