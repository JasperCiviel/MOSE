'use client';

export default function ScenariosPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12 space-y-6">
      <header className="space-y-4">
        <h1 className="text-4xl font-semibold text-slate-800">Scenario Exploration</h1>
        <p className="text-sm text-slate-600">
          Future work will extend the design model with dynamic sea-level and storminess scenarios. The GA notebook already
          supports these parameters — they will be surfaced here once validated against operational data.
        </p>
      </header>
      <section className="card p-6 space-y-3">
        <h2 className="text-lg font-semibold text-slate-800">Planned additions</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
          <li>Link synthetic sea-level projections to design metrics in real time.</li>
          <li>Allow users to script day-of-operation scenarios and export playbooks.</li>
          <li>Visualise the resilience envelope across climate, maintenance, and funding assumptions.</li>
        </ul>
      </section>
    </div>
  );
}
