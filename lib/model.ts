import { defaultConfig } from './defaultConfig';
import { pchip } from './pchip';

export type ObjectiveKey = (typeof defaultConfig.OBJECTIVE_KEYS)[number];
export type StakeholderDatum = (typeof defaultConfig.STAKEHOLDER_DATA)[number];

export interface DesignVector {
  x1: number;
  x2: number;
  x3: number;
}

export type Metrics = Record<ObjectiveKey, number>;
export type Preferences = Record<ObjectiveKey, number>;

export interface AggregationResult {
  overall: number;
  stakeholder: number[];
}

export interface ScenarioSettings {
  seaLevelRise: number; // meters equivalent to stress
  storminess: number; // multiplier 0.5-2
  maintenanceBudget: number; // scaling 0.5-1.5
}

export const defaultScenario: ScenarioSettings = {
  seaLevelRise: 0,
  storminess: 1,
  maintenanceBudget: 1
};

export const coeffs = {
  initial_cost: { base: 180, perMeter: 0.95, heightFactor: 150, timeFactor: 40 },
  maintenance_cost: { base: 0.45, lengthFactor: 0.0006, heightFactor: 0.5, timeFactor: 0.08 },
  sight: { base: 1.2, heightFactor: 0.22, lengthPenalty: 0.018, timePenalty: 0.04 },
  accessibility: { base: 0.4, timeFactor: 0.9, heightPenalty: 0.15 },
  water_quality: { base: 220, lengthFactor: 0.5, heightPenalty: 30, timeBenefit: 25 },
  overtopping_risk: { base: 0.22, heightExponent: 1.4, timeRelief: 3.0 }
};

export const objectiveColors: Record<ObjectiveKey, string> = {
  initial_cost: '#0f60db',
  maintenance_cost: '#1f7dff',
  sight: '#f97316',
  accessibility: '#0ea5e9',
  water_quality: '#16a34a',
  overtopping_risk: '#dc2626'
};

const knotDomains: Record<ObjectiveKey, [number, number]> = Object.fromEntries(
  defaultConfig.OBJECTIVE_KEYS.map((key) => {
    const xs = defaultConfig.knots[key].x;
    return [key, [xs[0], xs[xs.length - 1]]];
  })
) as Record<ObjectiveKey, [number, number]>;

export function clampToObjective(key: ObjectiveKey, value: number) {
  const [min, max] = knotDomains[key];
  return Math.min(Math.max(value, min), max);
}

export function computeMetrics(design: DesignVector, scenario: ScenarioSettings = defaultScenario): Metrics {
  const { constants } = defaultConfig;
  const lengthRatio = design.x1 / constants.TOTAL_LENGTH;
  const seaPressure = 1 + scenario.seaLevelRise * 0.4;
  const stormFactor = scenario.storminess;
  const maintenanceFactor = scenario.maintenanceBudget;

  const metrics: Metrics = {
    initial_cost: clampToObjective(
      'initial_cost',
      coeffs.initial_cost.base +
        coeffs.initial_cost.perMeter * design.x1 * seaPressure +
        coeffs.initial_cost.heightFactor * Math.pow(design.x2, 1.6) +
        coeffs.initial_cost.timeFactor * Math.pow(Math.max(design.x3, constants.MIN_CLOSING_TIME), 1.2)
    ),
    maintenance_cost: clampToObjective(
      'maintenance_cost',
      (coeffs.maintenance_cost.base +
        coeffs.maintenance_cost.lengthFactor * design.x1 * stormFactor +
        coeffs.maintenance_cost.heightFactor * Math.pow(design.x2, 1.4) +
        coeffs.maintenance_cost.timeFactor * Math.pow(design.x3, 1.15)) /
        Math.max(maintenanceFactor, 0.2)
    ),
    sight: clampToObjective(
      'sight',
      coeffs.sight.base +
        coeffs.sight.heightFactor * Math.pow(design.x2, 0.9) -
        coeffs.sight.lengthPenalty * Math.pow(lengthRatio, 1.1) -
        coeffs.sight.timePenalty * Math.pow(design.x3, 0.7)
    ),
    accessibility: clampToObjective(
      'accessibility',
      coeffs.accessibility.base +
        coeffs.accessibility.timeFactor * Math.pow(design.x3, 0.85) -
        coeffs.accessibility.heightPenalty * Math.pow(design.x2, 1.1)
    ),
    water_quality: clampToObjective(
      'water_quality',
      coeffs.water_quality.base +
        coeffs.water_quality.lengthFactor * design.x1 * seaPressure -
        coeffs.water_quality.heightPenalty * Math.pow(design.x2, 1.35) +
        coeffs.water_quality.timeBenefit * Math.pow(design.x3, 1.1)
    ),
    overtopping_risk: clampToObjective(
      'overtopping_risk',
      coeffs.overtopping_risk.base +
        2.2 / Math.pow(Math.max(design.x2, 0.1), coeffs.overtopping_risk.heightExponent) * stormFactor +
        coeffs.overtopping_risk.timeRelief /
          Math.pow(Math.max(design.x3, constants.MIN_CLOSING_TIME), 1.3)
    )
  };

  return metrics;
}

export function buildPreferenceFunctions(knots = defaultConfig.knots) {
  const entries = Object.entries(knots).map(([key, { x, y }]) => [key as ObjectiveKey, pchip(x, y)] as const);
  return Object.fromEntries(entries) as Record<ObjectiveKey, (value: number) => number>;
}

export function toPreferences(metrics: Metrics, prefFns: Record<ObjectiveKey, (value: number) => number>): Preferences {
  return Object.fromEntries(
    Object.entries(metrics).map(([key, value]) => [key, Math.round(prefFns[key as ObjectiveKey](value))])
  ) as Preferences;
}

export function normalizeStakeholders(data: StakeholderDatum[]) {
  const names = data.map((d) => d.name);
  const influenceSum = data.reduce((sum, d) => sum + d.influence, 0);
  const weights = data.map((d) => (influenceSum === 0 ? 0 : d.influence / influenceSum));
  const objectiveWeights = data.map((d) => {
    const objValues = defaultConfig.OBJECTIVE_KEYS.map((key) => d.weights[key as ObjectiveKey] ?? 0);
    const rowSum = objValues.reduce((sum, value) => sum + value, 0);
    return objValues.map((value) => (rowSum === 0 ? 0 : value / rowSum));
  });
  return { names, weights, objectiveWeights };
}

export function aggregatePreferences(
  preferences: Preferences,
  stakeholderWeights: number[],
  stakeholderObjectiveWeights: number[][],
  paradigm: 'minmax' | 'tetra'
): AggregationResult {
  const prefVector = defaultConfig.OBJECTIVE_KEYS.map((key) => preferences[key as ObjectiveKey]);
  const stakeholderScores = stakeholderObjectiveWeights.map((row) =>
    row.reduce((acc, weight, idx) => acc + weight * prefVector[idx], 0)
  );

  let overall = 0;
  if (paradigm === 'minmax') {
    // Classical minimax fairness: choose the lowest stakeholder score as the governing metric
    overall = Math.min(...stakeholderScores);
  } else {
    // Tetra aggregation: weighted root-mean-cube emphasises balanced yet ambitious outcomes
    const weighted = stakeholderScores.map((score, idx) => stakeholderWeights[idx] * Math.pow(score / 100, 3));
    overall = Math.pow(weighted.reduce((acc, value) => acc + value, 0), 1 / 3) * 100;
  }
  return { overall, stakeholder: stakeholderScores };
}

export interface GARunConfig {
  iterations: number;
  popSize: number;
  crossover: number;
  stallLimit: number;
}

export interface GAHistoryRecord {
  paradigm: 'minmax' | 'tetra';
  design: DesignVector;
  metrics: Metrics;
  preferences: Preferences;
  stakeholder: number[];
  overall: number;
  iteration: number;
}
