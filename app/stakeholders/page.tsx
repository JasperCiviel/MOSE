'use client';

import { useMemo } from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import { defaultConfig } from '@/lib/defaultConfig';
import { useMoseStore } from '@/lib/store';
import { aggregatePreferences } from '@/lib/model';

const objectives = defaultConfig.OBJECTIVE_KEYS;

const stakeholderNarratives = [
  {
    name: 'Municipality',
    role: 'City & regional authorities',
    focus:
      'Must justify billions invested in MOSE while keeping Venice habitable and the local economy afloat.',
    tension:
      'High upfront cost and political scrutiny mean every activation must demonstrate value without alienating taxpayers.'
  },
  {
    name: 'Residents',
    role: 'Inhabitants of Venice',
    focus:
      'Depend on reliable flood protection so their homes, schools, and businesses remain viable year-round.',
    tension:
      'Want safety but worry about taxes, noise, and disruption from frequent maintenance or long closures.'
  },
  {
    name: 'Environmental Agency',
    role: 'Lagoon ecology watchdogs',
    focus:
      'Monitor water exchange, sediment transport, and wildlife impacts when the lagoon is sealed from the sea.',
    tension:
      'Long closures stagnate water and harm habitats, so ecological safeguards are essential to accept MOSE operations.'
  },
  {
    name: 'Shipping Companies',
    role: 'Port & marine transport',
    focus:
      'Require predictable access through the inlets to keep ferries, cargo, and cruise traffic moving on schedule.',
    tension:
      'Every hour the gates stay closed halts navigation, threatening jobs and supply chains tied to Venice’s port.'
  }
];

export default function StakeholdersPage() {
  const {
    stakeholderNames,
    stakeholderWeights,
    stakeholderObjectiveWeights,
    stakeholderRawInfluence,
    preferences,
    aggregator
  } = useMoseStore();

  const stakeholderSummary = useMemo(() => {
    const dataset = defaultConfig.STAKEHOLDER_DATA;
    return stakeholderNames.map((name, idx) => {
      const share = stakeholderWeights[idx] ?? 0;
      const narrative = stakeholderNarratives.find((item) => item.name === name);
      const configRecord = dataset[idx];
      const topObjectives = Object.entries(configRecord.weights)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(
          ([objective, weight]) => `${objective.replace(/_/g, ' ')} (${Math.round(weight * 100)}%)`
        );
      return {
        name,
        share,
        role: narrative?.role ?? '',
        focus: narrative?.focus ?? '',
        tension: narrative?.tension ?? '',
        topObjectives,
        rawInfluence: stakeholderRawInfluence[idx]
      };
    });
  }, [stakeholderNames, stakeholderWeights, stakeholderRawInfluence]);

  const groupPreferences = useMemo(
    () =>
      objectives.map((objective, idx) => ({
        objective,
        weight: stakeholderWeights.reduce(
          (acc, weight, stakeholderIdx) => acc + weight * stakeholderObjectiveWeights[stakeholderIdx][idx],
          0
        )
      })),
    [stakeholderObjectiveWeights, stakeholderWeights]
  );

  const baseline = useMemo(
    () => aggregatePreferences(preferences, stakeholderWeights, stakeholderObjectiveWeights, aggregator),
    [preferences, stakeholderObjectiveWeights, stakeholderWeights, aggregator]
  );

  const sensitivity = useMemo(() => {
    return stakeholderNames.map((name, idx) => {
      const cloneUp = stakeholderRawInfluence.slice();
      cloneUp[idx] = cloneUp[idx] * 1.1;
      const sumUp = cloneUp.reduce((sum, val) => sum + val, 0) || 1;
      const weightsUp = cloneUp.map((val) => val / sumUp);
      const resultUp = aggregatePreferences(
        preferences,
        weightsUp,
        stakeholderObjectiveWeights,
        aggregator
      ).overall;

      const cloneDown = stakeholderRawInfluence.slice();
      cloneDown[idx] = Math.max(0.01, cloneDown[idx] * 0.9);
      const sumDown = cloneDown.reduce((sum, val) => sum + val, 0) || 1;
      const weightsDown = cloneDown.map((val) => val / sumDown);
      const resultDown = aggregatePreferences(
        preferences,
        weightsDown,
        stakeholderObjectiveWeights,
        aggregator
      ).overall;

      return {
        stakeholder: name,
        plus10: Number((resultUp - baseline.overall).toFixed(2)),
        minus10: Number((resultDown - baseline.overall).toFixed(2))
      };
    });
  }, [aggregator, baseline.overall, preferences, stakeholderNames, stakeholderRawInfluence, stakeholderObjectiveWeights]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-semibold text-slate-800">Stakeholders & Preference Balancing</h1>
        <p className="max-w-3xl text-sm text-slate-600">
          PBED starts with people. Four stakeholder groups captured in our TU Delft interviews define what “good”
          means for MOSE — and their priorities often pull in opposite directions.
        </p>
      </header>

      <section className="card p-6 space-y-6">
        <h2 className="section-title">Who Holds Influence?</h2>
        <p className="text-sm text-slate-600">
          The influence shares below match the weights used in the optimisation notebook. Each profile summarises the
          stakeholder’s mission, primary concern, and the objectives they emphasised during the PBED workshops.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          {stakeholderSummary.map((stakeholder) => (
            <article key={stakeholder.name} className="rounded-2xl border border-slate-100 p-5 space-y-3">
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">{stakeholder.name}</h2>
                  <p className="text-xs uppercase tracking-wide text-slate-400">{stakeholder.role}</p>
                </div>
                <span className="rounded-full bg-lagoon-50 px-3 py-1 text-xs font-semibold text-lagoon-700">
                  {(stakeholder.share * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-xs text-slate-500">Raw influence value: {stakeholder.rawInfluence.toFixed(2)}</p>
              <p className="text-sm text-slate-600">{stakeholder.focus}</p>
              <p className="rounded-xl bg-lagoon-50 p-3 text-xs text-lagoon-700">
                <strong className="font-semibold">Key concern:</strong> {stakeholder.tension}
              </p>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Primary objectives</p>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-slate-500">
                  {stakeholder.topObjectives.map((objective) => (
                    <li key={objective}>{objective}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="card p-6">
        <h2 className="section-title">Objective Emphasis (read-only)</h2>
        <p className="text-xs text-slate-500">
          Normalised weights supplied by each stakeholder during the PBED workshop.
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Stakeholder
                </th>
                {objectives.map((objective) => (
                  <th
                    key={objective}
                    className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    {objective.replace('_', ' ')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stakeholderNames.map((name, stakeholderIdx) => (
                <tr key={name} className="border-b border-slate-100">
                  <td className="px-3 py-3 font-medium text-slate-700">{name}</td>
                  {objectives.map((objective, objectiveIdx) => (
                    <td key={objective} className="px-3 py-3 text-xs text-slate-500">
                      {(stakeholderObjectiveWeights[stakeholderIdx][objectiveIdx] * 100).toFixed(0)}%
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
                <PolarAngleAxis
                  dataKey="objective"
                  tickFormatter={(value) => value.replace('_', ' ')}
                  tick={{ fill: '#475569', fontSize: 11 }}
                />
                <PolarRadiusAxis
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  angle={90}
                  domain={[0, 1]}
                  tickFormatter={(value) => `${Math.round(value * 100)}%`}
                />
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
                <YAxis
                  tick={{ fill: '#475569', fontSize: 11 }}
                  domain={['auto', 'auto']}
                  tickFormatter={(value) => `${value.toFixed(1)}`}
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
