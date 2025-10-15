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
  const lengthRatio = constants.TOTAL_LENGTH === 0 ? 0 : design.x1 / constants.TOTAL_LENGTH;
  const closure = Math.max(design.x3, constants.MIN_CLOSING_TIME);
  const seaPressure = 1 + scenario.seaLevelRise * 0.4;
  const stormFactor = scenario.storminess;
  const maintenanceFactor = scenario.maintenanceBudget;

  const metrics: Metrics = {
    initial_cost: clampToObjective(
      'initial_cost',
      650 +
        0.75 * design.x1 * seaPressure +
        28 * Math.pow(design.x2, 1.6) +
        220 / closure
    ),
    maintenance_cost: clampToObjective(
      'maintenance_cost',
      (22 + 0.02 * design.x1 * stormFactor + 2.8 * Math.pow(design.x2, 1.4) + 55 / closure) /
        Math.max(maintenanceFactor, 0.4)
    ),
    sight: clampToObjective(
      'sight',
      3.2 +
        6.3 * Math.min(Math.max(lengthRatio, 0), 1) -
        0.3 * (design.x2 - 1) -
        0.35 * Math.max(closure - 1.5, 0)
    ),
    accessibility: clampToObjective(
      'accessibility',
      4.2 +
        5.4 * Math.min(Math.max(lengthRatio, 0), 1) -
        1.6 * (closure - 0.5) -
        0.25 * (design.x2 - 1)
    ),
    water_quality: clampToObjective(
      'water_quality',
      5.1 +
        3.4 * Math.min(Math.max(lengthRatio, 0), 1) -
        2.0 * (closure - 0.5) -
        0.12 * Math.max(design.x2 - 5, 0)
    ),
    overtopping_risk: clampToObjective(
      'overtopping_risk',
      Math.max(0, (5 + 80 * Math.exp(-0.45 * design.x2) - 1.4 * (closure - 0.5)) * stormFactor)
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
