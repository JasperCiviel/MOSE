import Link from 'next/link';

const steps = [
  { week: 'Week 1', title: 'Orientation & Context', href: '/' },
  { week: 'Week 2', title: 'Systems Mapping', href: '/stakeholders' },
  { week: 'Week 3', title: 'MCDA Foundations', href: '/stakeholders' },
  { week: 'Week 4', title: '2×2 Design Exploration', href: '/design' },
  { week: 'Week 5', title: 'Feasibility Extensions', href: '/design' },
  { week: 'Week 6', title: 'Ethics & Reflection', href: '/ethics' },
  { week: 'Week 7', title: 'R&D Prototyping', href: '/rnd' },
  { week: 'Week 8', title: 'Final Narrative & Export', href: '/export' }
];

export default function StepsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-semibold text-slate-800">Project Roadmap</h1>
      <p className="mt-4 max-w-2xl text-sm text-slate-600">
        Follow the eight-week cadence of the Engineering Systems Design lab. Each step links to the workspace where
        you will update stakeholders, adjust design parameters, evaluate metrics, and capture insights for your final
        story.
      </p>
      <ol className="mt-10 space-y-6">
        {steps.map((step, idx) => (
          <li key={step.week} className="card p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-lagoon-600">{step.week}</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-800">{step.title}</h2>
              </div>
              <Link href={step.href} className="rounded-full bg-lagoon-500 px-4 py-2 text-sm text-white">
                Go to workspace
              </Link>
            </div>
            <div className="mt-4 h-1 w-full rounded-full bg-lagoon-100">
              <div className="h-full rounded-full bg-lagoon-500" style={{ width: `${((idx + 1) / steps.length) * 100}%` }} />
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
