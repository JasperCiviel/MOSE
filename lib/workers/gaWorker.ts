import { aggregatePreferences, computeMetrics, type DesignVector } from '../model';
import { defaultConfig } from '../defaultConfig';
import { pchip } from '../pchip';

interface WorkerMessage {
  paradigm: 'minmax' | 'tetra';
  options: {
    iterations: number;
    popSize: number;
    crossover: number;
    stallLimit: number;
  };
  bounds: typeof defaultConfig.bounds;
  scenario: {
    seaLevelRise: number;
    storminess: number;
    maintenanceBudget: number;
  };
  prefFnsData: typeof defaultConfig.knots;
  stakeholderWeights: number[];
  stakeholderObjectiveWeights: number[][];
}

const ctx: Worker = self as unknown as Worker;

ctx.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const { paradigm, options, bounds, scenario, prefFnsData, stakeholderObjectiveWeights, stakeholderWeights } = event.data;

  const prefFns = Object.fromEntries(
    Object.entries(prefFnsData).map(([key, { x, y }]) => [key, pchip(x, y)])
  ) as Record<string, (value: number) => number>;

  type Candidate = {
    design: DesignVector;
    metrics: ReturnType<typeof computeMetrics>;
    preferences: Record<string, number>;
    overall: number;
    stakeholder: number[];
  };

  const randomValue = (min: number, max: number) => min + Math.random() * (max - min);
  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

  const evaluate = (design: DesignVector): Candidate => {
    const metrics = computeMetrics(design, scenario);
    const preferences = Object.fromEntries(
      Object.entries(metrics).map(([key, value]) => [key, Math.round(prefFns[key](value))])
    ) as Record<string, number>;
    const aggregation = aggregatePreferences(
      preferences,
      stakeholderWeights,
      stakeholderObjectiveWeights,
      paradigm
    );
    return {
      design,
      metrics,
      preferences,
      overall: aggregation.overall,
      stakeholder: aggregation.stakeholder
    };
  };

  const makeRandomDesign = (): DesignVector => ({
    x1: randomValue(bounds.x1.min, bounds.x1.max),
    x2: randomValue(bounds.x2.min, bounds.x2.max),
    x3: randomValue(bounds.x3.min, bounds.x3.max)
  });

  const blend = (a: number, b: number) => a + (b - a) * Math.random();

  let population = Array.from({ length: options.popSize }, () => evaluate(makeRandomDesign()));
  let best = population.reduce((acc, cand) => (cand.overall > acc.overall ? cand : acc), population[0]);
  let stallCounter = 0;

  for (let iteration = 0; iteration < options.iterations; iteration += 1) {
    population.sort((a, b) => b.overall - a.overall);
    const elites = population.slice(0, Math.max(2, Math.floor(population.length * 0.1)));
    const newPopulation: typeof population = [...elites];

    while (newPopulation.length < options.popSize) {
      const parentA = population[Math.floor(Math.random() * elites.length)];
      const parentB = population[Math.floor(Math.random() * population.length)];
      let childDesign: DesignVector;
      if (Math.random() < options.crossover) {
        childDesign = {
          x1: blend(parentA.design.x1, parentB.design.x1),
          x2: blend(parentA.design.x2, parentB.design.x2),
          x3: blend(parentA.design.x3, parentB.design.x3)
        };
      } else {
        childDesign = makeRandomDesign();
      }

      const mutationScale = 0.1;
      if (Math.random() < 0.5) {
        childDesign.x1 = clamp(
          childDesign.x1 + (Math.random() - 0.5) * mutationScale * (bounds.x1.max - bounds.x1.min),
          bounds.x1.min,
          bounds.x1.max
        );
      }
      if (Math.random() < 0.5) {
        childDesign.x2 = clamp(
          childDesign.x2 + (Math.random() - 0.5) * mutationScale * (bounds.x2.max - bounds.x2.min),
          bounds.x2.min,
          bounds.x2.max
        );
      }
      if (Math.random() < 0.5) {
        childDesign.x3 = clamp(
          childDesign.x3 + (Math.random() - 0.5) * mutationScale * (bounds.x3.max - bounds.x3.min),
          bounds.x3.min,
          bounds.x3.max
        );
      }

      newPopulation.push(evaluate(childDesign));
    }

    population = newPopulation.slice(0, options.popSize);

    const currentBest = population[0];
    if (currentBest.overall > best.overall + 1e-6) {
      best = currentBest;
      stallCounter = 0;
    } else {
      stallCounter += 1;
    }

    if (iteration % 10 === 0 || iteration === options.iterations - 1) {
      ctx.postMessage({ type: 'progress', payload: { iteration, best } });
    }

    if (stallCounter >= options.stallLimit) {
      break;
    }
  }

  ctx.postMessage({
    type: 'result',
    payload: {
      paradigm,
      design: best.design,
      metrics: best.metrics,
      preferences: best.preferences,
      stakeholder: best.stakeholder,
      overall: best.overall,
      iteration: Date.now()
    }
  });
};
