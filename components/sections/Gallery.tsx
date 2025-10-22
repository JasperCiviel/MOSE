'use client';

import Image from 'next/image';

const gallery = [
  {
    title: 'MOSE gates lifting at Lido inlet',
    description:
      'Each caisson houses 21 gates finished in Venetian yellow. Compressed air empties them so they rotate upward and hold back the Adriatic.',
    image: '/images/mose-gates-rising.svg',
    credit: 'Illustration based on Consorzio Venezia Nuova documentation.'
  },
  {
    title: 'Cross-section of a single gate',
    description:
      'A hollow steel box pivots around a seabed hinge. When stowed the gate rests in a concrete housing flushed with seawater.',
    image: '/images/mose-gate-cutaway.svg',
    credit: 'Adapted from TU Delft PBED project notes.'
  },
  {
    title: 'Venetian lagoon system',
    description:
      'The 118 islands, marshes, and navigation channels depend on tide exchange. Any flood defence must preserve this living system.',
    image: '/images/venice-lagoon-overview.svg',
    credit: 'Simplified map for the CIEM0000 studio.'
  }
];

export function Gallery() {
  return (
    <section className="mx-auto mt-16 max-w-6xl px-6">
      <h2 className="section-title">Visualising the MOSE Barrier</h2>
      <p className="section-subtitle">
        Sketches used in our TU Delft studio explain how the bright-yellow gates operate and why the lagoon context matters.
      </p>
      <div className="grid gap-6 md:grid-cols-3">
        {gallery.map((item) => (
          <figure key={item.title} className="card h-full overflow-hidden">
            <div className="relative h-56 w-full bg-slate-100">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
            </div>
            <figcaption className="space-y-2 p-6">
              <h3 className="text-lg font-semibold text-slate-800">{item.title}</h3>
              <p className="text-sm text-slate-600">{item.description}</p>
              <p className="text-xs text-slate-400">{item.credit}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
