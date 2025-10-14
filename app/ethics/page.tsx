'use client';

import { useEffect, useState } from 'react';

const prompts = [
  { key: 'distribution', title: 'Distributional Effects', hint: 'Who benefits first? Who bears the residual risk?' },
  { key: 'equity', title: 'Risk Equity', hint: 'How are marginalized communities affected by barrier activation?' },
  { key: 'transparency', title: 'Transparency', hint: 'What information is shared during MOSE activation?' },
  { key: 'reversibility', title: 'Reversibility', hint: 'How easily can the strategy adapt or be undone?' }
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
          Capture reflections on fairness, transparency, and resilience. Notes are stored locally in your browser and
          can be included in the export bundle.
        </p>
      </header>

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
