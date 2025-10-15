'use client';

import { useMemo, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { AlternativesMap } from '@/components/ui/AlternativesMap';

type StakeholderKey = 'Municipality' | 'Residents' | 'Environmental Agency' | 'Shipping Companies';

interface Alternative {
  id: string;
  name: string;
  description: string;
  overall: number;
  scores: Record<StakeholderKey, number>;
  highlights: string[];
  location: { lat: number; lng: number; summary: string };
}

const stakeholders: StakeholderKey[] = ['Municipality', 'Residents', 'Environmental Agency', 'Shipping Companies'];

const alternatives: Alternative[] = [
  {
    id: 'mose',
    name: 'MOSE Barrier System',
    description:
      'Reference design with 78 mobile gates at Lido, Malamocco, and Chioggia. Provides strong surge protection while keeping navigation possible between activations.',
    overall: 87,
    scores: { Municipality: 94, Residents: 90, 'Environmental Agency': 62, 'Shipping Companies': 78 },
    highlights: [
      'Only alternative satisfying the Municipality’s surge protection threshold without collapsing accessibility.',
      'Residents value the reliability during 95 cm+ forecasts despite periodic construction fatigue.',
      'Environmental groups accept MOSE when closures are short and timed with tidal flushing plans.'
    ],
    location: {
      lat: 45.428,
      lng: 12.508,
      summary: 'Gate lines anchored at the lagoon inlets rise with compressed air and settle once tide levels fall.'
    }
  },
  {
    id: 'raise',
    name: 'Raise Ground Levels',
    description:
      'Incrementally elevate pavements and building thresholds in the historic centre to keep water out of ground floors.',
    overall: 66,
    scores: { Municipality: 58, Residents: 60, 'Environmental Agency': 80, 'Shipping Companies': 85 },
    highlights: [
      'Strong ecological score because lagoon dynamics remain untouched.',
      'Municipality notes that construction disruption is long and only protects selected districts.',
      'Shipping companies appreciate that lagoon inlets remain fully open at all times.'
    ],
    location: {
      lat: 45.434,
      lng: 12.338,
      summary: 'Focus on Piazza San Marco and other low-lying sestieri; no offshore works required.'
    }
  },
  {
    id: 'aquifer',
    name: 'Aquifer Recharge',
    description:
      'Inject water into deep aquifers to gently lift Venice by tens of centimetres, countering historic subsidence.',
    overall: 63,
    scores: { Municipality: 55, Residents: 58, 'Environmental Agency': 88, 'Shipping Companies': 72 },
    highlights: [
      'Environmental agencies favour the low-infrastructure footprint and lagoon-friendly approach.',
      'Municipality doubts long-term controllability and the scientific uncertainty of uniform uplift.',
      'Residents welcome minimal disruption but question whether the uplift is enough for severe tides.'
    ],
    location: {
      lat: 45.49,
      lng: 12.25,
      summary: 'Injection wells on the mainland and barrier islands would elevate soils gradually over years.'
    }
  },
  {
    id: 'narrow',
    name: 'Narrow Lagoon Inlets',
    description:
      'Construct constricted training walls to reduce tidal prism entering the lagoon during storms.',
    overall: 54,
    scores: { Municipality: 46, Residents: 42, 'Environmental Agency': 74, 'Shipping Companies': 70 },
    highlights: [
      'Cheapest option but offers limited surge reduction—insufficient for 110 cm + events.',
      'Environmental score is moderate: less dredging than levees but still alters tidal patterns.',
      'Shipping interests tolerate the design only if navigation channels remain dredged.'
    ],
    location: {
      lat: 45.22,
      lng: 12.29,
      summary: 'Training walls at the Chioggia inlet limit flow; other entrances receive guide structures.'
    }
  },
  {
    id: 'levee',
    name: 'Perimeter Super-Levee',
    description:
      'Build a fixed embankment around the lagoon perimeter to block the Adriatic permanently.',
    overall: 49,
    scores: { Municipality: 82, Residents: 48, 'Environmental Agency': 25, 'Shipping Companies': 18 },
    highlights: [
      'Municipality appreciates the extreme surge protection but the cost and permanence are prohibitive.',
      'Residents and shippers lose direct access to the sea; tourism appeal drops sharply.',
      'Environmental agencies score it lowest due to dramatic habitat loss and stagnant waters.'
    ],
    location: {
      lat: 45.47,
      lng: 12.38,
      summary: 'Continuous barrier imagined along the barrier islands with locks for vessels—a disruptive mega-project.'
    }
  }
];

const sensitivity = [
  {
    stakeholder: 'Municipality',
    plus10: 2.3,
    minus10: -1.9,
    insight: 'More municipal weight emphasises overtopping risk, keeping MOSE dominant but eroding support for softer options.'
  },
  {
    stakeholder: 'Residents',
    plus10: 1.7,
    minus10: -1.4,
    insight: 'Higher resident emphasis rewards solutions that minimise disruption, lifting the appeal of ground-raising schemes.'
  },
  {
    stakeholder: 'Environmental Agency',
    plus10: 3.1,
    minus10: -2.6,
    insight: 'Environmental priorities quickly elevate aquifer recharge to first place, showing how sensitive ecology is to weighting.'
  },
  {
    stakeholder: 'Shipping Companies',
    plus10: 2.0,
    minus10: -1.6,
    insight: 'Shipping weight pushes for shorter closure concepts, narrowing the gap between MOSE and raise-the-city strategies.'
  }
];

export default function MetricsPage() {
  const [selectedStakeholder, setSelectedStakeholder] = useState<StakeholderKey>('Municipality');

  const overallBars = useMemo(
    () => alternatives.map((alt) => ({ name: alt.name, overall: alt.overall })),
    []
  );

  const stakeholderBars = useMemo(
    () =>
      alternatives
        .map((alt) => ({ name: alt.name, score: alt.scores[selectedStakeholder] }))
        .sort((a, b) => b.score - a.score),
    [selectedStakeholder]
  );

  const mapItems = useMemo(
    () =>
      alternatives.map((alt) => ({
        id: alt.id,
        name: alt.name,
        overall: alt.overall,
        summary: alt.location.summary,
        position: { lat: alt.location.lat, lng: alt.location.lng },
        stakeholderScores: stakeholders.map((label) => ({ label, value: alt.scores[label] }))
      })),
    []
  );

  const topPicks = useMemo(() => {
    return stakeholders.map((stakeholder) => {
      const favourite = [...alternatives].sort(
        (a, b) => b.scores[stakeholder] - a.scores[stakeholder]
      )[0];
      return {
        stakeholder,
        alternative: favourite.name,
        score: favourite.scores[stakeholder],
        rationale:
          stakeholder === 'Municipality'
            ? 'Favors the robust flood defence that justifies public investment.'
            : stakeholder === 'Residents'
            ? 'Seeks dependable dry streets with manageable maintenance burdens.'
            : stakeholder === 'Environmental Agency'
            ? 'Prioritises tidal exchange and lagoon health even at the cost of protection.'
            : 'Needs gates to reopen quickly so ferries and cargo can keep schedules.'
      };
    });
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-semibold text-slate-800">Tetra MCDA Analysis</h1>
        <p className="max-w-3xl text-sm text-slate-600">
          We modelled five flood-management alternatives in Tetra. Each stakeholder group supplied objectives and
          weights; the tool aggregates them into overall preference scores. MOSE tops the combined ranking, but shifting
          weights reveals how fragile consensus can be.
        </p>
      </header>

      <section className="card p-6 space-y-6">
        <h2 className="section-title">Final Preference Scores</h2>
        <p className="text-xs text-slate-500">
          Bars show the weighted Tetra result after normalising stakeholder influence. Higher values indicate a better
          compromise across all objectives.
        </p>
        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={overallBars}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#475569', fontSize: 11 }} />
              <Tooltip formatter={(value: number) => `${value.toFixed(0)} preference points`} />
              <Bar dataKey="overall" fill="#0f60db" name="Overall score" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {topPicks.map((item) => (
          <article key={item.stakeholder} className="card p-6 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-lagoon-600">{item.stakeholder}</p>
            <h3 className="text-xl font-semibold text-slate-800">Prefers: {item.alternative}</h3>
            <p className="text-xs text-slate-500">Score {item.score.toFixed(0)} / 100 when weighed alone</p>
            <p className="text-sm text-slate-600">{item.rationale}</p>
          </article>
        ))}
      </section>

      <section className="card p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="section-title">Stakeholder Sensitivity</h2>
            <p className="text-xs text-slate-500">
              Adjusting a stakeholder’s influence by ±10% shifts the overall score. Positive values mean the combined
              solution improves when that group gains leverage.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>View focus:</span>
            <select
              value={selectedStakeholder}
              onChange={(event) => setSelectedStakeholder(event.target.value as StakeholderKey)}
              className="rounded-full border border-slate-300 px-3 py-1"
            >
              {stakeholders.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={stakeholderBars}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#475569', fontSize: 11 }} />
              <Tooltip formatter={(value: number) => `${value.toFixed(0)} pts for ${selectedStakeholder}`} />
              <Legend />
              <Bar dataKey="score" fill="#14b8a6" name={`${selectedStakeholder} preference`} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {sensitivity.map((item) => (
            <div key={item.stakeholder} className="rounded-2xl border border-slate-100 p-4">
              <p className="text-sm font-semibold text-slate-700">{item.stakeholder}</p>
              <p className="mt-1 text-xs text-slate-500">
                +10% influence: <span className="font-semibold text-emerald-600">{item.plus10.toFixed(1)} pts</span> · -10% influence:{' '}
                <span className="font-semibold text-rose-500">{item.minus10.toFixed(1)} pts</span>
              </p>
              <p className="mt-2 text-sm text-slate-600">{item.insight}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <div className="space-y-4">
            <h2 className="section-title">Interactive Lagoon Map</h2>
            <p className="text-sm text-slate-600">
              Explore where each alternative sits. Click a marker to see stakeholder scores and a short description of
              the concept. Physical context helps explain why some ideas struggle with navigation or ecology.
            </p>
          </div>
          <AlternativesMap items={mapItems} />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-800">Alternative Narratives</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {alternatives.map((alt) => (
            <article key={alt.id} className="card p-6 space-y-3">
              <div>
                <p className="text-xs uppercase tracking-widest text-lagoon-600">Overall {alt.overall.toFixed(0)} / 100</p>
                <h3 className="text-xl font-semibold text-slate-800">{alt.name}</h3>
              </div>
              <p className="text-sm text-slate-600">{alt.description}</p>
              <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
                {alt.highlights.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
