'use client';

const gallery = [
  {
    title: 'Barrier Modules',
    description: 'Steel gates hinged to the seabed, ready to pivot upward when forecasts call for acqua alta.',
    gradient: 'from-cyan-400 via-sky-200 to-blue-100'
  },
  {
    title: 'Venetian Lagoon',
    description: 'A delicate ecosystem of 118 islands, salt marshes, and tidal flats connected to the Adriatic Sea.',
    gradient: 'from-emerald-300 via-teal-200 to-lime-100'
  },
  {
    title: 'Operations Hub',
    description: 'Engineers monitor wind, tide, and vessel traffic to decide when to actuate the barriers.',
    gradient: 'from-violet-300 via-indigo-200 to-sky-100'
  },
  {
    title: 'Maintenance Works',
    description: 'Regular inspections and cleaning are essential to avoid corrosion and biofouling on moving parts.',
    gradient: 'from-amber-300 via-orange-200 to-rose-100'
  }
];

export function Gallery() {
  return (
    <section className="mx-auto mt-16 max-w-6xl px-6">
      <h2 className="section-title">Inside the MOSE System</h2>
      <p className="section-subtitle">
        Move through recent imagery to understand the scale of the infrastructure and the landscape it protects.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        {gallery.map((item) => (
          <figure key={item.title} className="card overflow-hidden">
            <div
              className={`relative h-60 w-full bg-gradient-to-br ${item.gradient}`}
              role="img"
              aria-label={`${item.title} — illustrative stock graphic`}
            >
              <div
                className="absolute inset-0 opacity-60 mix-blend-overlay"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 20% 20%, rgba(15, 23, 42, 0.25), transparent 55%), radial-gradient(circle at 75% 40%, rgba(15, 23, 42, 0.2), transparent 60%)'
                }}
                aria-hidden
              />
            </div>
            <figcaption className="space-y-2 p-6">
              <h3 className="text-lg font-semibold text-slate-800">{item.title}</h3>
              <p className="text-sm text-slate-600">{item.description}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
