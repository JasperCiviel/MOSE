'use client';

import { useEffect, useState } from 'react';

const frameworks = [
  {
    key: 'pbed',
    title: 'Preference-Based Engineering Design (PBED)',
    body:
      'PBED centres the voices of affected communities in every design iteration. Rather than maximising a single metric, we explicitly balance stakeholder preferences and reject solutions that leave one group behind. In MOSE this meant combining safety, ecology, access, and cost within a transparent aggregation method.'
  },
  {
    key: 'utilitarian',
    title: 'Utilitarianism',
    body:
      'Both PBED and utilitarianism chase the “greatest good.” When MOSE wins the MCDA, it is because the barrier protects the largest portion of Venice. However, PBED tempers pure utilitarian logic by still tracking minority impacts—environmentalists’ lower scores are visible and can trigger redesigns.'
  },
  {
    key: 'justice',
    title: 'Justice / Fairness Perspective',
    body:
      'Fair treatment demands equitable distribution of benefits and burdens. PBED advances this by forcing us to negotiate trade-offs explicitly: shipping downtimes, ecological disruption, and tax burdens are surfaced, not hidden in technical jargon.'
  },
  {
    key: 'rights',
    title: 'Rights Perspective',
    body:
      'Respecting rights means safeguarding essentials like safety, livelihood, and a healthy environment. PBED aligns with this by treating resident safety, environmental stewardship, and economic activity as non-negotiable criteria within the optimisation.'
  },
  {
    key: 'egoism',
    title: 'Ethical Egoism',
    body:
      'Egoism would let a single actor—say a contractor or political leader—optimise for their own success. PBED actively resists this: no stakeholder can unilaterally dictate the solution, and the aggregated score collapses if any perspective is ignored.'
  }
];

const prompts = [
  { key: 'utilitarian-trade', title: 'Utilitarian Reflections', hint: 'Where did maximising total welfare succeed or fail in our PBED runs?' },
  { key: 'fairness', title: 'Fairness & Justice', hint: 'Which compromises felt equitable? Which burdens still land unfairly?' },
  { key: 'rights', title: 'Rights Safeguards', hint: 'How does the final design protect residents, ecosystems, and the economy?' },
  { key: 'egoism-check', title: 'Guarding Against Egoism', hint: 'What mechanisms keep single-interest solutions from dominating?' }
];

export default function EthicsPage() {
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    const stored = localStorage.getItem('mose-ethics');
    if (stored) {
      setNotes(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (Object.keys(notes).length > 0) {
      localStorage.setItem('mose-ethics', JSON.stringify(notes));
    }
  }, [notes]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 space-y-8">
      <header className="space-y-4">
        <h1 className="text-4xl font-semibold text-slate-800">Ethics & Reflection</h1>
        <p className="text-sm text-slate-600">
          Preference-Based Engineering Design (PBED) echoes utilitarian goals but bakes in fairness and rights checks.
          The summaries below capture our reading of each ethical lens; use the notes to extend the conversation for
          your team.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {frameworks.map((framework) => (
          <article key={framework.key} className="card p-5 space-y-2">
            <h2 className="text-lg font-semibold text-slate-800">{framework.title}</h2>
            <p className="text-sm text-slate-600">{framework.body}</p>
          </article>
        ))}
      </section>

      <section className="space-y-6">
        {prompts.map((prompt) => (
          <div key={prompt.key} className="card p-6 space-y-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">{prompt.title}</h2>
              <p className="text-xs text-slate-500">{prompt.hint}</p>
            </div>
            <textarea
              className="min-h-[120px] w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700"
              value={notes[prompt.key] ?? ''}
              onChange={(event) => setNotes((prev) => ({ ...prev, [prompt.key]: event.target.value }))}
              placeholder="Add your reflection"
            />
          </div>
        ))}
      </section>
    </div>
  );
}
