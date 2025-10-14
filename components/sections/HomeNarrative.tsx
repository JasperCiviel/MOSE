'use client';

export function HomeNarrative() {
  return (
    <section className="mx-auto mt-16 max-w-6xl px-6">
      <div className="grid gap-10 md:grid-cols-2">
        <article className="card p-6">
          <h2 className="section-title">Why MOSE?</h2>
          <p className="text-sm leading-relaxed text-slate-600">
            Venice is a lagoon city built on 118 islands. Seasonal high tides — acqua alta — now frequently crest 95 cm,
            flooding piazzas, damaging heritage, and displacing residents. Climate change and subsidence amplify the
            frequency of these events, demanding a long-term protection strategy that respects the lagoon&apos;s delicate
            ecology.
          </p>
          <h2 className="section-title mt-10">What is MOSE?</h2>
          <p className="text-sm leading-relaxed text-slate-600">
            MOSE is a system of movable gates at the Lido, Malamocco, and Chioggia inlets. When activated, the gates pivot
            upward, isolating the lagoon from the Adriatic Sea. The system has faced decades of engineering, financial, and
            political turbulence — from corruption scandals to technical delays — making transparent, preference-driven
            planning essential.
          </p>
        </article>
        <article className="card p-6">
          <h2 className="section-title">Alternatives Considered</h2>
          <p className="text-sm leading-relaxed text-slate-600">
            Other strategies once on the table included pumping groundwater to raise the city, narrowing the inlets,
            and building a continuous super-levee. Each alternative carried severe trade-offs for navigation, ecology,
            heritage, or cost. MOSE emerged as a compromise, but its success depends on aligning design choices with the
            values of residents, shipping, tourism, environmental advocates, and EU partners.
          </p>
          <div className="mt-8 rounded-2xl bg-lagoon-100 p-4 text-sm text-lagoon-800">
            <h3 className="text-base font-semibold text-lagoon-700">What you can do here</h3>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li>Compare stakeholder preferences and re-balance influence.</li>
              <li>Explore the design space with transparent metrics and curves.</li>
              <li>Run optimization scenarios and export narrative-ready reports.</li>
            </ul>
          </div>
        </article>
      </div>
    </section>
  );
}
