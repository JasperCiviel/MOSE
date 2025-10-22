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

export function computeMetrics(design: DesignVector, _scenario: ScenarioSettings = defaultScenario): Metrics {
  const { constants } = defaultConfig;
  const { x1, x2, x3 } = design;
  const totalLength = constants.TOTAL_LENGTH;
  const minClosing = Math.max(x3, constants.MIN_CLOSING_TIME);

  const movableCostPerMeter =
    5.2e5 + 4.8e4 * Math.pow(x2, 1.5) + 2.2e5 / minClosing;
  const permanentCostPerMeter = 1.8e4 + 5.5e3 * Math.pow(x2, 1.1);
  const initialCost =
    Math.max(0, x1) * movableCostPerMeter +
    Math.max(0, totalLength - x1) * permanentCostPerMeter;

  const movableMaintenancePerMeter =
    1.25e6 + 4.8e5 * x2 + 1.5e6 / Math.pow(minClosing, 1.2);
  const fixedMaintenancePerMeter = 8.5e4 + 2.2e4 * x2;
  const maintenanceCost =
    Math.max(0, x1) * movableMaintenancePerMeter * 180 +
    Math.max(0, totalLength - x1) * fixedMaintenancePerMeter * 55;

  const movableFraction = totalLength === 0 ? 0 : Math.max(0, Math.min(1, x1 / totalLength));
  const fixedFraction = 1 - movableFraction;

  const sightScore =
    movableFraction * 10 +
    fixedFraction * 10 / Math.max(x2, 1e-6);

  const accessibilityScore =
    movableFraction * 10 - (10 / 7) * x3;

  const waterQualityScore =
    movableFraction * 10 - (10 / 24) * x3;

  const overtoppingRisk = 0.65 * Math.exp(-0.35 * (x2 - 1));

  return {
    initial_cost: clampToObjective('initial_cost', initialCost),
    maintenance_cost: clampToObjective('maintenance_cost', maintenanceCost),
    sight: clampToObjective('sight', sightScore),
    accessibility: clampToObjective('accessibility', accessibilityScore),
    water_quality: clampToObjective('water_quality', waterQualityScore),
    overtopping_risk: clampToObjective('overtopping_risk', overtoppingRisk)
  };
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

export interface GAHistoryRecord {
  paradigm: 'minmax' | 'tetra';
  design: DesignVector;
  metrics: Metrics;
  preferences: Preferences;
  stakeholder: number[];
  overall: number;
  iteration: number;
}
