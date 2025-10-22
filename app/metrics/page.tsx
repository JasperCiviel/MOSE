'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LabelList
} from 'recharts';
import { AlternativesMap, type AlternativeLocation } from '@/components/sections/AlternativesMap';

type Alternative = AlternativeLocation & {
  score: number;
  headline: string;
};

const alternatives: Alternative[] = [
  {
    id: 'mose',
    name: 'MOSE movable barrier',
    position: [45.431, 12.433],
    score: 86,
    summary: 'Existing plan: 78 hinged gates at Lido, Malamocco, and Chioggia isolate the lagoon during high tides.',
    headline: 'Balances safety, navigation, and ecology when operated carefully.',
    stakeholderNotes: [
      { stakeholder: 'Municipality', sentiment: 'Delivers the strongest flood protection for the historic centre.' },
      { stakeholder: 'Residents', sentiment: 'Keeps homes dry with manageable disruption when closures are short.' },
      { stakeholder: 'Environmental Agency', sentiment: 'Requires tight monitoring to limit ecological side-effects.' },
      { stakeholder: 'Shipping Companies', sentiment: 'Traffic pauses are acceptable with advanced scheduling.' }
    ]
  },
  {
    id: 'aquifer',
    name: 'Inject water into aquifer',
    position: [45.441, 12.320],
    score: 62,
    summary: 'Pump seawater into deep aquifers to raise the city by ~30 cm, reducing flood frequency without barriers.',
    headline: 'Favoured by environmental advocates but expensive and uncertain long term.',
    stakeholderNotes: [
      { stakeholder: 'Municipality', sentiment: 'Helps historic cores but does not stop extreme surges.' },
      { stakeholder: 'Residents', sentiment: 'Minimal visual impact, yet still need mobile defences for major events.' },
      { stakeholder: 'Environmental Agency', sentiment: 'Protects lagoon flows; long-term hydrogeology risk remains.' },
      { stakeholder: 'Shipping Companies', sentiment: 'No navigation disruption, but limited effect on deep-tide events.' }
    ]
  },
  {
    id: 'narrow',
    name: 'Narrow the lagoon inlets',
    position: [45.282, 12.271],
    score: 48,
    summary: 'Install permanent jetties that reduce inlet width, damping tidal exchange and lowering flood peaks modestly.',
    headline: 'Low capital cost but delivers only marginal protection.',
    stakeholderNotes: [
      { stakeholder: 'Municipality', sentiment: 'Insufficient relief for severe acqua alta events.' },
      { stakeholder: 'Residents', sentiment: 'Reduces minor flooding but still allows damaging surges.' },
      { stakeholder: 'Environmental Agency', sentiment: 'Alters sediment transport and lagoon ecology.' },
      { stakeholder: 'Shipping Companies', sentiment: 'Constrains navigation channels year-round.' }
    ]
  },
  {
    id: 'levee',
    name: 'Perimeter super-levee',
    position: [45.420, 12.380],
    score: 44,
    summary: 'Build a continuous barrier around the city islands, isolating Venice from the lagoon altogether.',
    headline: 'Provides security but sacrifices the lagoon landscape and navigation.',
    stakeholderNotes: [
      { stakeholder: 'Municipality', sentiment: 'Extreme cost and heritage impact make it politically untenable.' },
      { stakeholder: 'Residents', sentiment: 'Protects property but walls off daily life from the water.' },
      { stakeholder: 'Environmental Agency', sentiment: 'Destroys tidal exchange and salt-marsh ecosystems.' },
      { stakeholder: 'Shipping Companies', sentiment: 'Locks ports behind fixed infrastructure.' }
    ]
  }
];

const stakeholderFavorites = [
  {
    stakeholder: 'Environmental Agency',
    preferred: 'Inject water into aquifer',
    reasoning:
      'Raising Venice reduces flood exposure without closing the lagoon, preserving tidal flushing and habitats.'
  },
  {
    stakeholder: 'Municipality',
    preferred: 'MOSE movable barrier',
    reasoning:
      'Delivers the most comprehensive protection for residents and the economy while honouring sunk investments.'
  },
  {
    stakeholder: 'Residents',
    preferred: 'MOSE movable barrier',
    reasoning:
      'Prioritise safety and continuity of daily life; short, predictable closures are an acceptable trade-off.'
  },
  {
    stakeholder: 'Shipping Companies',
    preferred: 'Narrow the lagoon inlets',
    reasoning:
      'Favour solutions that keep channels open; even if protection is modest, traffic can continue unhindered.'
  }
];

const chartData = alternatives.map((alternative) => ({
  name: alternative.name.replace(' ', '\u00a0'),
  score: alternative.score
}));

export default function MetricsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-semibold text-slate-800">Tetra Multi-Criteria Analysis</h1>
        <p className="max-w-4xl text-sm text-slate-600">
          We used the Tetra MCDA tool to compare MOSE with alternative flood mitigation concepts. Each stakeholder
          supplied objective weights, and Tetra aggregated the preference scores to highlight the most balanced option.
          MOSE rose to the top because it offers decisive flood protection without permanently shutting the lagoon.
        </p>
      </header>

      <section className="card p-6 space-y-6">
        <div className="space-y-2">
          <h2 className="section-title">Aggregated Scores</h2>
          <p className="text-sm text-slate-600">
            Scores are normalised to 0–100. MOSE clearly outperforms the other strategies when all stakeholder weights
            are applied.
          </p>
        </div>
        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 16, right: 16, left: 0, bottom: 16 }}>
              <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#475569', fontSize: 12 }} />
              <Tooltip formatter={(value: number) => `${value.toFixed(0)} / 100`} />
              <Bar dataKey="score" fill="#0f60db" radius={[12, 12, 0, 0]}>
                <LabelList dataKey="score" position="top" formatter={(value: number) => `${value.toFixed(0)}`} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {alternatives.map((alternative) => (
            <article key={alternative.id} className="rounded-2xl border border-slate-100 p-4">
              <h3 className="text-lg font-semibold text-slate-800">{alternative.name}</h3>
              <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">Score {alternative.score} / 100</p>
              <p className="mt-3 text-sm text-slate-600">{alternative.summary}</p>
              <p className="mt-3 rounded-xl bg-slate-100 p-3 text-xs text-slate-500">{alternative.headline}</p>
            </article>
          ))}
        </div>
      </section>

      <AlternativesMap alternatives={alternatives} />

      <section className="card p-6 space-y-4">
        <h2 className="section-title">Stakeholder-Specific Sensitivities</h2>
        <p className="text-sm text-slate-600">
          Setting each stakeholder weight to 100% reveals which alternative they would pursue alone. The tension between
          ecological integrity, navigation, and flood safety is why a compromise like MOSE was required.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {stakeholderFavorites.map((item) => (
            <article key={item.stakeholder} className="rounded-2xl border border-slate-100 p-4">
              <h3 className="text-base font-semibold text-slate-800">{item.stakeholder}</h3>
              <p className="text-xs uppercase tracking-wide text-lagoon-600">Prefers: {item.preferred}</p>
              <p className="mt-2 text-sm text-slate-600">{item.reasoning}</p>
            </article>
          ))}
        </div>
        <p className="text-xs text-slate-500">
          Even though stakeholders have different favourites, the aggregated Tetra run shows MOSE as the best compromise:
          every group achieves an acceptable preference level when the gates are operated judiciously.
        </p>
      </section>
    </div>
  );
}
