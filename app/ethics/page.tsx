'use client';

const perspectives = [
  {
    title: 'Preference-Based Engineering Design (PBED)',
    summary:
      'PBED integrates stakeholder values directly into the design loop. For MOSE, the Municipality, Residents, Environmental Agency, and Shipping Companies were all invited to articulate objectives and trade-offs. The optimisation then searched for a design that each group could accept without losing technical feasibility.',
    takeaway:
      'PBED treats engineering as a conversational process: data, preferences, and optimisation tools come together to surface a compromise rather than a single-author solution.'
  },
  {
    title: 'Utilitarian perspective',
    summary:
      'Utilitarianism seeks the greatest good for the greatest number. Our aggregated preference score effectively applies this logic — the winning MOSE configuration keeps most people safe, preserves the local economy, and uses public funds responsibly.',
    takeaway:
      'PBED aligns strongly with utilitarianism, though it tempers “majority wins” by still quantifying how minority stakeholders are affected.'
  },
  {
    title: 'Justice and fairness',
    summary:
      'A justice-oriented lens emphasises fair distribution of benefits and burdens. By giving each stakeholder a seat at the table and visualising their satisfaction, PBED makes inequities visible and adjustable (for instance, dialling up environmental weightings to test alternative optima).',
    takeaway:
      'The method reinforces procedural justice — everyone is heard, and fairness can be debated with evidence rather than rhetoric.'
  },
  {
    title: 'Rights-based view',
    summary:
      'Rights frameworks prioritise non-negotiable entitlements such as safety, heritage, or ecological health. PBED does not override rights, but it shows where a solution may be approaching a rights boundary (e.g. if environmental scores become unacceptably low).',
    takeaway:
      'Respecting rights requires pairing PBED with hard constraints: we enforced mechanical limits, overtopping tolerances, and ecological safeguards before any optimisation could occur.'
  },
  {
    title: 'Ethical egoism (contrast)',
    summary:
      'Egoism would allow a single actor — say, a contractor or political leader — to optimise for their own benefit. This mindset is incompatible with PBED, which explicitly models and balances opposing interests.',
    takeaway:
      'Running the optimisation with one stakeholder weight set to 100% demonstrates the risk of egoism: other parties see their preferences crash, undermining legitimacy.'
  }
];

export default function EthicsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12 space-y-8">
      <header className="space-y-4">
        <h1 className="text-4xl font-semibold text-slate-800">Ethical Reflection</h1>
        <p className="text-sm text-slate-600">
          Engineering decisions are never purely technical. The MOSE case highlights how PBED maps to familiar ethical
          theories and where tensions remain.
        </p>
      </header>

      <section className="space-y-6">
        {perspectives.map((item) => (
          <article key={item.title} className="card p-6 space-y-3">
            <h2 className="text-xl font-semibold text-slate-800">{item.title}</h2>
            <p className="text-sm text-slate-600">{item.summary}</p>
            <p className="rounded-2xl bg-lagoon-50 p-3 text-xs text-lagoon-700">
              <strong className="font-semibold">Takeaway:</strong> {item.takeaway}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
