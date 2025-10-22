'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState, useTransition, type ChangeEvent } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LabelList
} from 'recharts';
import { useMoseStore } from '@/lib/store';
import { runGeneticAlgorithm } from '@/lib/ga';

const WEIGHT_PRESETS = [
  {
    key: 'balanced',
    label: 'Balanced (course default)',
    values: [0.5, 0.2, 0.1, 0.15] as const,
    description:
      'Matches the stakeholder interviews used in the notebook: Municipality leads, Residents second, followed by Environmental Agency and Shipping.'
  },
  {
    key: 'civic-safety',
    label: 'Civic safety priority',
    values: [0.6, 0.25, 0.05, 0.1] as const,
    description:
      'Municipality and Residents dominate the decision, pushing the GA toward designs that maximise flood safety and cost accountability.'
  },
  {
    key: 'environmental',
    label: 'Environmental emphasis',
    values: [0.35, 0.15, 0.35, 0.15] as const,
    description:
      'Weights chosen to highlight lagoon ecology concerns while still acknowledging civic and navigation needs.'
  },
  {
    key: 'navigation',
    label: 'Navigation emphasis',
    values: [0.4, 0.15, 0.1, 0.35] as const,
    description:
      'Gives the port and marine transport sector a leading voice, favouring shorter closures and more movable spans.'
  }
] as const;

export default function OptimizationPage() {
  const {
    config,
    stakeholderNames,
    stakeholderWeights,
    stakeholderRawInfluence,
    stakeholderObjectiveWeights,
    prefFns,
    setStakeholderInfluences,
    history,
    runGA,
    gaProgress
  } = useMoseStore();

  const weightPresets = WEIGHT_PRESETS;

  const activePreset = useMemo(() => {
    const isMatch = (presetValues: readonly number[], current: number[]) =>
      presetValues.length === current.length &&
      presetValues.every((value, idx) => Math.abs(value - current[idx]) < 1e-3);
    return weightPresets.find((preset) => isMatch(preset.values, stakeholderRawInfluence)) ?? weightPresets[0];
  }, [stakeholderRawInfluence, weightPresets]);

  const [selectedPresetKey, setSelectedPresetKey] = useState<string>(activePreset.key);
  const [soloResults, setSoloResults] = useState<Record<number, ReturnType<typeof runGeneticAlgorithm> | null>>({});
  const [pendingStakeholder, setPendingStakeholder] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setSelectedPresetKey(activePreset.key);
  }, [activePreset.key]);

  const handlePresetChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const preset = weightPresets.find((item) => item.key === event.target.value) ?? weightPresets[0];
    setSelectedPresetKey(preset.key);
    setStakeholderInfluences(Array.from(preset.values));
  };

  const tetraResult = history.tetra.at(-1) ?? null;
  const minmaxResult = history.minmax.at(-1) ?? null;

  const tetraStakeholderChart = useMemo(() => {
    if (!tetraResult) return [];
    return tetraResult.stakeholder.map((score, idx) => ({
      stakeholder: stakeholderNames[idx],
      score
    }));
  }, [stakeholderNames, tetraResult]);

  const runSoloOptimisation = (stakeholderIndex: number) => {
    if (!config || !prefFns) return;
    setPendingStakeholder(stakeholderIndex);
    startTransition(() => {
      const { popSize, iterations, crossover, stallLimit } = config.options;
      const soloWeights = stakeholderNames.map((_, idx) => (idx === stakeholderIndex ? 1 : 0));
      const result = runGeneticAlgorithm({
        paradigm: 'tetra',
        options: { popSize, iterations, crossover, stallLimit },
        bounds: config.bounds,
        prefFns,
        stakeholderWeights: soloWeights,
        stakeholderObjectiveWeights
      });
      setSoloResults((prev) => ({ ...prev, [stakeholderIndex]: result }));
      setPendingStakeholder(null);
    });
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-semibold text-slate-800">Optimization Lab</h1>
        <p className="max-w-4xl text-sm text-slate-600">
          Explore how the genetic algorithm (GA) navigates the MOSE design space. Adjust stakeholder influence, run the
          optimiser, and watch how gate length, height, and closure time settle into new optima.
        </p>
        <p className="text-xs text-slate-500">
          Looking for MCDA dashboards? Visit the{' '}
          <Link href="/tetra" className="font-medium text-lagoon-700 underline underline-offset-2">
            Tetra analysis
          </Link>{' '}
          page for the full figure set.
        </p>
      </header>

      <section className="card p-6 space-y-4">
        <h2 className="section-title">Choose Weight Scenario</h2>
        <p className="text-sm text-slate-600">
          Select one of the stakeholder influence profiles we analysed in the notebook. The values are normalised before
          optimisation runs.
        </p>
        <div className="grid gap-4 md:grid-cols-2 md:items-start">
          <label className="space-y-2 text-sm text-slate-600">
            <span className="block font-medium text-slate-700">Weight profile</span>
            <select
              value={selectedPresetKey}
              onChange={handlePresetChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
            >
              {weightPresets.map((preset) => (
                <option key={preset.key} value={preset.key}>
                  {preset.label}
                </option>
              ))}
            </select>
            <span className="block text-xs text-slate-500">
              {weightPresets.find((preset) => preset.key === selectedPresetKey)?.description ??
                activePreset.description}
            </span>
          </label>
          <div className="rounded-xl bg-slate-50 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Normalised influence</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {stakeholderNames.map((name, idx) => (
                <li key={name} className="flex items-baseline justify-between gap-4">
                  <span className="font-medium text-slate-700">{name}</span>
                  <span>{(stakeholderWeights[idx] * 100).toFixed(1)}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="card p-6 space-y-4">
        <h2 className="section-title">Run the Genetic Algorithm</h2>
        <p className="text-sm text-slate-600">
          Min–max protects the lowest-scoring stakeholder, while the weighted run maximises the stakeholder influence mix
          you configured above.
        </p>
        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            onClick={() => runGA('tetra')}
            className="rounded-full bg-lagoon-600 px-5 py-2 text-sm font-semibold text-white"
          >
            Run weighted optimisation
          </button>
          <button
            type="button"
            onClick={() => runGA('minmax')}
            className="rounded-full border border-lagoon-600 px-5 py-2 text-sm font-semibold text-lagoon-700"
          >
            Run Min–max optimisation
          </button>
        </div>
        {gaProgress ? (
          <p className="text-xs text-slate-500">
            Running {gaProgress.paradigm.toUpperCase()} optimisation…
          </p>
        ) : (
          <p className="text-xs text-slate-500">
            {tetraResult || minmaxResult ? 'Last optimisation complete.' : 'No optimisation run yet.'}
          </p>
        )}
      </section>

      <section className="card p-6 space-y-4">
        <h2 className="section-title">Optimise for one stakeholder at a time</h2>
        <p className="text-sm text-slate-600">
          Run the GA with a single stakeholder set to 100% influence. This mirrors a sensitivity sweep where the other
          groups momentarily step back.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {stakeholderNames.map((name, idx) => {
            const result = soloResults[idx];
            const waiting = pendingStakeholder === idx || (isPending && pendingStakeholder === idx);
            return (
              <article key={name} className="rounded-2xl border border-slate-100 p-4 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">{name}</h3>
                    <p className="text-xs text-slate-500">100% influence, others at 0%</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => runSoloOptimisation(idx)}
                    className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                    disabled={waiting}
                  >
                    {waiting ? 'Running…' : 'Run GA'}
                  </button>
                </div>
                {result ? (
                  <div className="space-y-2 text-sm text-slate-700">
                    <p>
                      Preference {result.overall.toFixed(1)} / 100 using{' '}
                      <span className="font-medium text-slate-800">weighted paradigm</span>.
                    </p>
                    <ul className="space-y-1">
                      <li>
                        <span className="font-medium">x1:</span> {result.design.x1.toFixed(2)} m movable gates
                      </li>
                      <li>
                        <span className="font-medium">x2:</span> {result.design.x2.toFixed(2)} m gate height
                      </li>
                      <li>
                        <span className="font-medium">x3:</span> {result.design.x3.toFixed(2)} h closure duration
                      </li>
                    </ul>
                    <p className="text-xs text-slate-500">
                      Other stakeholders’ weights are zero for this experiment, so their satisfaction scores are not
                      considered in the overall value.
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-600">
                    Run to see the MOSE configuration this stakeholder would choose on their own.
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <article className="card p-6 space-y-3">
          <h2 className="section-title">Latest weighted design</h2>
          {tetraResult ? (
            <>
              <p className="text-sm text-slate-600">
                Stakeholder-weighted optimum with score {tetraResult.overall.toFixed(1)} / 100.
              </p>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>
                  <span className="font-medium">x1:</span> {tetraResult.design.x1.toFixed(2)} m movable gates
                </li>
                <li>
                  <span className="font-medium">x2:</span> {tetraResult.design.x2.toFixed(2)} m gate height
                </li>
                <li>
                  <span className="font-medium">x3:</span> {tetraResult.design.x3.toFixed(2)} h closure duration
                </li>
              </ul>
              <div className="h-64">
                <ResponsiveContainer>
                  <BarChart data={tetraStakeholderChart} margin={{ top: 16, right: 16, left: 0, bottom: 16 }}>
                    <XAxis dataKey="stakeholder" tick={{ fill: '#475569', fontSize: 12 }} />
                    <YAxis domain={[0, 100]} tick={{ fill: '#475569', fontSize: 12 }} />
                    <Tooltip formatter={(value: number) => `${value.toFixed(1)} / 100`} />
                    <Bar dataKey="score" fill="#0f60db" radius={[12, 12, 0, 0]}>
                      <LabelList dataKey="score" position="top" formatter={(value: number) => value.toFixed(1)} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-slate-500">
                All four stakeholders reach acceptable satisfaction: compare the bars to see who benefits most under the
                current weighting.
              </p>
            </>
          ) : (
            <p className="text-sm text-slate-600">
              Run the weighted optimisation to populate the stakeholder preference breakdown.
            </p>
          )}
        </article>
        <article className="card p-6 space-y-3">
          <h2 className="section-title">Latest Min–max design</h2>
          {minmaxResult ? (
            <>
              <p className="text-sm text-slate-600">
                Ensures the lowest stakeholder score is as high as possible. Overall {minmaxResult.overall.toFixed(1)} /
                100.
              </p>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>
                  <span className="font-medium">x1:</span> {minmaxResult.design.x1.toFixed(2)} m
                </li>
                <li>
                  <span className="font-medium">x2:</span> {minmaxResult.design.x2.toFixed(2)} m
                </li>
                <li>
                  <span className="font-medium">x3:</span> {minmaxResult.design.x3.toFixed(2)} h
                </li>
              </ul>
              <ul className="mt-4 space-y-1 text-xs text-slate-500">
                {minmaxResult.stakeholder.map((score, idx) => (
                  <li key={stakeholderNames[idx]}>
                    {stakeholderNames[idx]}: {score.toFixed(1)} / 100
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-sm text-slate-600">
              Run the Min–max optimisation to inspect the most equitable trade-off.
            </p>
          )}
        </article>
      </section>
    </div>
  );
}
