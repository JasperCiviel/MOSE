import { aggregatePreferences, computeMetrics, type DesignVector, type Preferences } from './model';
import type { ModelConfig } from './defaultConfig';

export interface GAOptions {
  iterations: number;
  popSize: number;
  crossover: number;
  stallLimit: number;
}

export interface GAInput {
  paradigm: 'minmax' | 'tetra';
  options: GAOptions;
  bounds: ModelConfig['bounds'];
  prefFns: Record<string, (value: number) => number>;
  stakeholderWeights: number[];
  stakeholderObjectiveWeights: number[][];
}

export interface GAResult {
  paradigm: 'minmax' | 'tetra';
  design: DesignVector;
  metrics: ReturnType<typeof computeMetrics>;
  preferences: Preferences;
  stakeholder: number[];
  overall: number;
  iteration: number;
}

type Candidate = GAResult;

function randomValue(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function toPreferences(
  metrics: ReturnType<typeof computeMetrics>,
  prefFns: Record<string, (value: number) => number>
) {
  const entries = Object.entries(metrics).map(([key, value]) => [
    key,
    Math.round(prefFns[key]?.(value) ?? 0)
  ]);
  return Object.fromEntries(entries) as Preferences;
}

export function runGeneticAlgorithm({
  paradigm,
  options,
  bounds,
  prefFns,
  stakeholderWeights,
  stakeholderObjectiveWeights
}: GAInput): GAResult {
  const popSize = Math.max(40, Math.min(options.popSize, 240));
  const iterations = Math.max(40, Math.min(options.iterations, 200));
  const crossover = options.crossover ?? 0.8;
  const stallLimit = options.stallLimit ?? 15;

  const evaluate = (design: DesignVector): Candidate => {
    const metrics = computeMetrics(design);
    const preferences = toPreferences(metrics, prefFns);
    const aggregation = aggregatePreferences(preferences, stakeholderWeights, stakeholderObjectiveWeights, paradigm);
    return {
      paradigm,
      design,
      metrics,
      preferences,
      stakeholder: aggregation.stakeholder,
      overall: aggregation.overall,
      iteration: Date.now()
    };
  };

  const randomDesign = (): DesignVector => ({
    x1: randomValue(bounds.x1.min, bounds.x1.max),
    x2: randomValue(bounds.x2.min, bounds.x2.max),
    x3: randomValue(bounds.x3.min, bounds.x3.max)
  });

  const blend = (a: number, b: number) => a + (b - a) * Math.random();

  let population = Array.from({ length: popSize }, () => evaluate(randomDesign()));
  population.sort((a, b) => b.overall - a.overall);
  let best = population[0];
  let stallCounter = 0;

  for (let iteration = 0; iteration < iterations; iteration += 1) {
    population.sort((a, b) => b.overall - a.overall);
    const elites = population.slice(0, Math.max(2, Math.floor(popSize * 0.1)));
    const newPopulation: Candidate[] = [...elites];

    while (newPopulation.length < popSize) {
      const parentA = elites[Math.floor(Math.random() * elites.length)];
      const parentB = population[Math.floor(Math.random() * population.length)];
      let childDesign: DesignVector;

      if (Math.random() < crossover) {
        childDesign = {
          x1: blend(parentA.design.x1, parentB.design.x1),
          x2: blend(parentA.design.x2, parentB.design.x2),
          x3: blend(parentA.design.x3, parentB.design.x3)
        };
      } else {
        childDesign = randomDesign();
      }

      const mutationScale = 0.12;
      if (Math.random() < 0.6) {
        childDesign.x1 = clamp(
          childDesign.x1 +
            (Math.random() - 0.5) * mutationScale * (bounds.x1.max - bounds.x1.min),
          bounds.x1.min,
          bounds.x1.max
        );
      }
      if (Math.random() < 0.6) {
        childDesign.x2 = clamp(
          childDesign.x2 +
            (Math.random() - 0.5) * mutationScale * (bounds.x2.max - bounds.x2.min),
          bounds.x2.min,
          bounds.x2.max
        );
      }
      if (Math.random() < 0.6) {
        childDesign.x3 = clamp(
          childDesign.x3 +
            (Math.random() - 0.5) * mutationScale * (bounds.x3.max - bounds.x3.min),
          bounds.x3.min,
          bounds.x3.max
        );
      }

      newPopulation.push(evaluate(childDesign));
    }

    population = newPopulation.slice(0, popSize);
    const currentBest = population[0];

    if (currentBest.overall > best.overall + 1e-6) {
      best = { ...currentBest, iteration };
      stallCounter = 0;
    } else {
      stallCounter += 1;
    }

    if (stallCounter >= stallLimit) {
      break;
    }
  }

  return best;
}
