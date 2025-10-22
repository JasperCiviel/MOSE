'use client';

export function HomeNarrative() {
  return (
    <section className="mx-auto mt-16 max-w-6xl px-6">
      <div className="grid gap-10 md:grid-cols-2">
        <article className="card p-6">
          <h2 className="section-title">Why This Project Exists</h2>
          <p className="text-sm leading-relaxed text-slate-600">
            Venice was built for the tides, yet climate change and land subsidence now push acqua alta events past livable
            limits. Since 2014 the city has endured 76 tides above 110 cm — more than double the number observed between
            1870 and 1949. The MOSE (Modulo Sperimentale Elettromeccanico) barrier is Italy’s answer: 78 bright-yellow
            steel gates that rise from the lagoon bed to block the Adriatic during storms. It is an engineering landmark
            surrounded by controversy, delays, and questions about whether the benefits truly outweigh the impacts on
            ecology, heritage, and commerce.
          </p>
          <p className="mt-6 text-sm leading-relaxed text-slate-600">
            Our CIEM0000 team at TU Delft used MOSE as the capstone case for preference-based engineering design. By
            translating stakeholder interviews, MCDA sessions, and optimization experiments into an interactive site, we
            can show how competing priorities were reconciled — and where tensions remain.
          </p>
        </article>
        <article className="card p-6">
          <h2 className="section-title">Introduction Highlights</h2>
          <dl className="space-y-6 text-sm leading-relaxed text-slate-600">
            <div>
              <dt className="font-semibold text-slate-800">Venice’s flooding problem</dt>
              <dd>
                Frequent “acqua alta” tides now swamp homes, museums, and the public realm. Protecting 118 islands without
                sacrificing the lagoon’s health is the design brief.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-800">What MOSE does</dt>
              <dd>
                Gates at Lido, Malamocco, and Chioggia pivot upward when forecasts exceed ~95 cm, sealing the lagoon until
                the surge passes. When stowed, they rest invisibly on the seabed.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-800">Why we chose it</dt>
              <dd>
                MOSE combines massive public investment, environmental risk, and decades of political scandal. It is the
                perfect laboratory for weighing societal needs against engineering feasibility.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-800">Course context</dt>
              <dd>
                CIEM0000 teaches Preference-Based Engineering Design (PBED). This site captures the PBED workflow — from
                stakeholder preference elicitation to multi-criteria analysis, optimization, and ethical reflection.
              </dd>
            </div>
          </dl>
          <div className="mt-8 rounded-2xl bg-lagoon-100 p-4 text-sm text-lagoon-800">
            <h3 className="text-base font-semibold text-lagoon-700">How to explore the studio</h3>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li>Meet the Municipality, Residents, Environmental Agency, and Shipping Companies.</li>
              <li>Review the Tetra multi-criteria analysis that ranked MOSE against alternative defences.</li>
              <li>Interact with the design model, run the GA optimizer, and reflect on the ethics of PBED.</li>
            </ul>
          </div>
        </article>
      </div>
    </section>
  );
}
