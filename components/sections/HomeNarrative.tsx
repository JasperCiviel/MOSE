'use client';

const highlights = [
  {
    title: 'Venice’s Flooding Problem',
    body:
      'Acqua alta events above 110 cm used to occur a few dozen times per century. Over the last nine years alone the city has endured 76 such tides, inundating homes, museums, and transport links. Sea-level rise and land subsidence now push this heritage site toward chronic flooding.'
  },
  {
    title: 'What is MOSE?',
    body:
      'MOSE (Modulo Sperimentale Elettromeccanico) strings 78 hinged gates across the lagoon’s three inlets. Forecasted storm surges trigger compressed air to lift the gates, sealing Venice off from the Adriatic until the tide recedes and the modules flood again to reopen navigation.'
  },
  {
    title: 'Why MOSE was Chosen',
    body:
      'The system promises robust protection yet has been marred by political scandal, technical redesigns, and spiralling budgets. Those tensions make MOSE an ideal case to examine how ambitious civil works must reconcile societal expectations with engineering feasibility.'
  },
  {
    title: 'Course Context',
    body:
      'This site is the interactive deliverable for TU Delft’s Interdisciplinary Engineering Systems Design course (CIEM0000). We apply Preference-Based Engineering Design (PBED) to surface stakeholder values, build transparent models, and search for designs that maximise collective preference while remaining feasible.'
  }
];

export function HomeNarrative() {
  return (
    <section className="mx-auto mt-16 max-w-6xl px-6">
      <div className="grid gap-6 md:grid-cols-2">
        {highlights.map((item) => (
          <article key={item.title} className="card p-6 space-y-3">
            <h2 className="text-xl font-semibold text-slate-800">{item.title}</h2>
            <p className="text-sm leading-relaxed text-slate-600">{item.body}</p>
          </article>
        ))}
      </div>
      <div className="mt-10 rounded-3xl bg-slate-900/90 p-6 text-slate-100 shadow-xl">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-widest text-lagoon-200">Flood urgency</p>
            <p className="mt-2 text-2xl font-semibold">76 high-tide floods</p>
            <p className="text-xs text-slate-300">Recorded above 110 cm between 2014 and 2023.</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-lagoon-200">System scale</p>
            <p className="mt-2 text-2xl font-semibold">78 movable gates</p>
            <p className="text-xs text-slate-300">Distributed across Lido, Malamocco, and Chioggia inlets.</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-lagoon-200">Course lens</p>
            <p className="mt-2 text-2xl font-semibold">Preference-based design</p>
            <p className="text-xs text-slate-300">Optimise with stakeholder values instead of single-point engineering.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
