'use client';

import Link from 'next/link';

const HERO_BACKGROUND =
  'radial-gradient(circle at 20% 20%, rgba(14,165,233,0.35), transparent 45%), radial-gradient(circle at 80% 10%, rgba(56,189,248,0.3), transparent 55%), radial-gradient(circle at 50% 80%, rgba(167,139,250,0.25), transparent 60%)';

export function Hero() {
  return (
    <section className="relative h-[520px] w-full overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: '#0f172a',
          backgroundImage: HERO_BACKGROUND
        }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/70 to-slate-900/30" aria-hidden />
      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-center px-6 text-white">
        <p className="text-sm uppercase tracking-[0.3em] text-lagoon-200">TU Delft · CIEM0000</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold md:text-6xl">
          MOSE Barrier Project Interactive Site
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-200">
          Venice’s movable flood barrier is a real-world laboratory for preference-based engineering design. Explore
          how we balanced stakeholders, quantified trade-offs, and searched for feasible MOSE configurations that keep
          the lagoon safe without losing what makes the city unique.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/stakeholders" className="rounded-full bg-lagoon-500 px-6 py-3 text-sm font-medium text-white">
            Stakeholder Profiles
          </Link>
          <Link
            href="/design"
            className="rounded-full border border-white/60 px-6 py-3 text-sm font-medium text-white hover:bg-white/10"
          >
            Design Model Sandbox
          </Link>
          <Link
            href="/opt"
            className="rounded-full border border-white/60 px-6 py-3 text-sm font-medium text-white hover:bg-white/10"
          >
            Run the Optimization
          </Link>
        </div>
      </div>
    </section>
  );
}
