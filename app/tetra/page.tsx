import Image from 'next/image';
import Link from 'next/link';

const combinedFigure = {
  title: 'Combined stakeholder ranking',
  description:
    'Weighted by the interview-derived influences (Municipality 50%, Residents 20%, Environmental Agency 10%, Shipping 15%), the MOSE movable barrier clearly outperforms the alternative concepts.',
  src: '/images/tetra/image1.png',
  alt: 'Screenshot of the Tetra dashboard showing the MOSE barrier as the highest scoring alternative overall.'
};

const stakeholderFigures = [
  {
    stakeholder: 'Environmental groups',
    src: '/images/tetra/image2.png',
    alt: 'Tetra sensitivity dashboard for environmental groups with lagoon ecology criteria highlighted.',
    summary:
      'Maximising environmental influence favours designs with extensive movable spans and the shortest closure windows, keeping tidal exchange high and ecological disruption limited.'
  },
  {
    stakeholder: 'Government',
    src: '/images/tetra/image3.png',
    alt: 'Tetra sensitivity dashboard for government stakeholders highlighting cost and flood-risk objectives.',
    summary:
      'A government-focused run stresses residual flood risk and capital cost control, driving the GA toward taller gates and reliable closures that guarantee protection during acqua alta events.'
  },
  {
    stakeholder: 'Inhabitants',
    src: '/images/tetra/image4.png',
    alt: 'Tetra sensitivity dashboard for inhabitants emphasising day-to-day liveability metrics.',
    summary:
      'Residents balance safety with daily accessibility: the solo optimisation keeps closure durations tight while moderating gate height to preserve views.'
  },
  {
    stakeholder: 'Tourism & business',
    src: '/images/tetra/image5.png',
    alt: 'Tetra sensitivity dashboard for tourism and business stakeholders highlighting navigation criteria.',
    summary:
      'Tourism and port operators prioritise uninterrupted access. They choose configurations that cap closure times and rely on movable spans to keep channels open outside surge events.'
  }
] as const;

export default function TetraPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12 space-y-10">
      <header className="space-y-4">
        <h1 className="text-4xl font-semibold text-slate-800">Tetra Decision Analysis</h1>
        <p className="text-sm text-slate-600">
          The figures below reproduce the highlights from the <code>Tetra analysis.docx</code> briefing. Tetra collects
          each stakeholder&apos;s criteria, applies their weights, and computes preference scores for every alternative
          in the MOSE study.
        </p>
        <p className="text-xs text-slate-500">
          Need the raw document?{' '}
          <Link href="/docs/tetra-analysis.docx" className="font-medium text-lagoon-700 underline underline-offset-2">
            Download the Word file
          </Link>{' '}
          for the original charts.
        </p>
      </header>

      <section className="space-y-6">
        <figure className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="overflow-hidden rounded-xl border border-slate-100">
            <Image
              src={combinedFigure.src}
              alt={combinedFigure.alt}
              width={1360}
              height={768}
              className="h-auto w-full object-contain"
              priority
            />
          </div>
          <figcaption className="mt-4 space-y-2 text-sm text-slate-600">
            <p className="font-semibold text-slate-800">{combinedFigure.title}</p>
            <p>{combinedFigure.description}</p>
          </figcaption>
        </figure>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-800">Stakeholder sensitivity runs</h2>
        <p className="text-sm text-slate-600">
          Setting one stakeholder to 100% influence (and the rest to 0%) mirrors the sensitivity exploration suggested in
          the document. Each dashboard shows how priorities shift when a single perspective dominates.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          {stakeholderFigures.map((item) => (
            <figure key={item.stakeholder} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="overflow-hidden rounded-xl border border-slate-100">
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={1200}
                  height={675}
                  className="h-auto w-full object-contain"
                />
              </div>
              <figcaption className="mt-3 space-y-1 text-sm text-slate-600">
                <p className="font-semibold text-slate-800">{item.stakeholder}</p>
                <p>{item.summary}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}
