'use client';

export default function RnDPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12 space-y-10">
      <header className="space-y-4">
        <h1 className="text-4xl font-semibold text-slate-800">Research &amp; Development</h1>
        <p className="text-sm text-slate-600">
          This workspace is reserved for future experiments, literature notes, and follow-on ideas. Document new
          alternatives, nature-based concepts, or stakeholder interviews here so future cohorts can extend the project.
        </p>
      </header>

      <section className="card p-6 space-y-3">
        <h2 className="text-xl font-semibold text-slate-800">Coming Soon</h2>
        <p className="text-sm text-slate-600">
          Use this area to capture research leads—e.g. sediment nourishment pilots, adaptive operation protocols, or
          alternative aggregation strategies. The section is intentionally light so teams can tailor it to upcoming work.
        </p>
        <p className="rounded-2xl bg-lagoon-100 p-4 text-sm text-lagoon-700">
          Tip: Link any future analyses back into the Tetra or optimisation pages so stakeholders can see how new ideas
          affect their preferences.
        </p>
      </section>
    </div>
  );
}
