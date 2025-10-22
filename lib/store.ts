'use client';

import { create } from 'zustand';
import { defaultConfig } from './defaultConfig';
import {
  aggregatePreferences,
  buildPreferenceFunctions,
  computeMetrics,
  defaultScenario,
  GAHistoryRecord,
  Metrics,
  Preferences,
  ScenarioSettings,
  objectiveColors,
  normalizeStakeholders,
  type DesignVector
} from './model';
import { runGeneticAlgorithm } from './ga';

interface StoreState {
  config: typeof defaultConfig;
  design: DesignVector;
  scenario: ScenarioSettings;
  prefFns: Record<string, (value: number) => number>;
  metrics: Metrics;
  preferences: Preferences;
  aggregator: 'minmax' | 'tetra';
  stakeholderNames: string[];
  stakeholderWeights: number[];
  stakeholderObjectiveWeights: number[][];
  stakeholderRawInfluence: number[];
  stakeholderRawObjectiveWeights: number[][];
  history: Record<'minmax' | 'tetra', GAHistoryRecord[]>;
  gaProgress: { iteration: number; best: number; paradigm: 'minmax' | 'tetra' } | null;
  pinned: GAHistoryRecord[];
  setDesign: (partial: Partial<DesignVector>) => void;
  setScenario: (partial: Partial<ScenarioSettings>) => void;
  setAggregator: (aggregator: 'minmax' | 'tetra') => void;
  recalc: () => void;
  aggregate: (paradigm?: 'minmax' | 'tetra') => { overall: number; stakeholder: number[] };
  runGA: (paradigm: 'minmax' | 'tetra') => void;
  pinDesign: (record: GAHistoryRecord) => void;
  unpinDesign: (index: number) => void;
  importConfig: (config: typeof defaultConfig) => void;
  setStakeholderInfluences: (values: number[]) => void;
  updateStakeholderInfluence: (index: number, value: number) => void;
  updateStakeholderObjectiveWeight: (stakeholderIndex: number, objectiveIndex: number, value: number) => void;
}

const prefFns = buildPreferenceFunctions();
const normalized = normalizeStakeholders(defaultConfig.STAKEHOLDER_DATA);

const initialDesign: DesignVector = {
  x1: (defaultConfig.bounds.x1.min + defaultConfig.bounds.x1.max) / 2,
  x2: (defaultConfig.bounds.x2.min + defaultConfig.bounds.x2.max) / 2,
  x3: (defaultConfig.bounds.x3.min + defaultConfig.bounds.x3.max) / 2
};

const initialMetrics = computeMetrics(initialDesign, defaultScenario);
const initialPreferences = Object.fromEntries(
  Object.entries(initialMetrics).map(([key, value]) => [key, Math.round(prefFns[key](value))])
) as Preferences;

function renormalize(influences: number[], objectiveWeights: number[][]) {
  const influenceSum = influences.reduce((sum, value) => sum + value, 0) || 1;
  const weights = influences.map((value) => value / influenceSum);
  const objectives = objectiveWeights.map((row) => {
    const rowSum = row.reduce((sum, value) => sum + value, 0) || 1;
    return row.map((value) => value / rowSum);
  });
  return { weights, objectives };
}

export const useMoseStore = create<StoreState>((set, get) => ({
  config: defaultConfig,
  design: initialDesign,
  scenario: defaultScenario,
  prefFns,
  metrics: initialMetrics,
  preferences: initialPreferences,
  aggregator: 'minmax',
  stakeholderNames: normalized.names,
  stakeholderWeights: normalized.weights,
  stakeholderObjectiveWeights: normalized.objectiveWeights,
  stakeholderRawInfluence: defaultConfig.STAKEHOLDER_DATA.map((d) => d.influence),
  stakeholderRawObjectiveWeights: defaultConfig.STAKEHOLDER_DATA.map((d) =>
    defaultConfig.OBJECTIVE_KEYS.map((key) => d.weights[key as keyof typeof d.weights] ?? 0)
  ),
  history: { minmax: [], tetra: [] },
  gaProgress: null,
  pinned: [],
  setDesign: (partial) => {
    set((state) => {
      const design = { ...state.design, ...partial };
      const metrics = computeMetrics(design, state.scenario);
      const preferences = Object.fromEntries(
        Object.entries(metrics).map(([key, value]) => [key, Math.round(state.prefFns[key](value))])
      ) as Preferences;
      return { design, metrics, preferences };
    });
  },
  setScenario: (partial) => {
    set((state) => {
      const scenario = { ...state.scenario, ...partial } as ScenarioSettings;
      const metrics = computeMetrics(state.design, scenario);
      const preferences = Object.fromEntries(
        Object.entries(metrics).map(([key, value]) => [key, Math.round(state.prefFns[key](value))])
      ) as Preferences;
      return { scenario, metrics, preferences };
    });
  },
  setAggregator: (aggregator) => set({ aggregator }),
  recalc: () => {
    set((state) => {
      const metrics = computeMetrics(state.design, state.scenario);
      const preferences = Object.fromEntries(
        Object.entries(metrics).map(([key, value]) => [key, Math.round(state.prefFns[key](value))])
      ) as Preferences;
      return { metrics, preferences };
    });
  },
  aggregate: (paradigm) => {
    const state = get();
    return aggregatePreferences(
      state.preferences,
      state.stakeholderWeights,
      state.stakeholderObjectiveWeights,
      paradigm ?? state.aggregator
    );
  },
  runGA: (paradigm) => {
    if (typeof window === 'undefined') return;
    const { gaProgress } = get();
    if (gaProgress && gaProgress.paradigm === paradigm) {
      return;
    }

    set({ gaProgress: { iteration: -1, best: 0, paradigm } });

    setTimeout(() => {
      const state = get();
      const { popSize, iterations, crossover, stallLimit } = state.config.options;
      const result = runGeneticAlgorithm({
        paradigm,
        options: { popSize, iterations, crossover, stallLimit },
        bounds: state.config.bounds,
        prefFns: state.prefFns,
        stakeholderWeights: state.stakeholderWeights,
        stakeholderObjectiveWeights: state.stakeholderObjectiveWeights
      });

      set((s) => ({
        history: {
          ...s.history,
          [paradigm]: [...s.history[paradigm], result]
        },
        gaProgress: null
      }));
    }, 0);
  },
  pinDesign: (record) =>
    set((state) => ({ pinned: state.pinned.find((r) => r.iteration === record.iteration && r.paradigm === record.paradigm)
        ? state.pinned
        : [...state.pinned, record] })),
  unpinDesign: (index) =>
    set((state) => ({ pinned: state.pinned.filter((_, idx) => idx !== index) })),
  importConfig: (config) => {
    const prefFnsLocal = buildPreferenceFunctions(config.knots);
    const normalizedLocal = normalizeStakeholders(config.STAKEHOLDER_DATA);
    const design = {
      x1: (config.bounds.x1.min + config.bounds.x1.max) / 2,
      x2: (config.bounds.x2.min + config.bounds.x2.max) / 2,
      x3: (config.bounds.x3.min + config.bounds.x3.max) / 2
    };
    const metrics = computeMetrics(design, defaultScenario);
    const preferences = Object.fromEntries(
      Object.entries(metrics).map(([key, value]) => [key, Math.round(prefFnsLocal[key](value))])
    ) as Preferences;
    set({
      config,
      prefFns: prefFnsLocal,
      stakeholderNames: normalizedLocal.names,
      stakeholderWeights: normalizedLocal.weights,
      stakeholderObjectiveWeights: normalizedLocal.objectiveWeights,
      stakeholderRawInfluence: config.STAKEHOLDER_DATA.map((d) => d.influence),
      stakeholderRawObjectiveWeights: config.STAKEHOLDER_DATA.map((d) =>
        config.OBJECTIVE_KEYS.map((key) => d.weights[key as keyof typeof d.weights] ?? 0)
      ),
      design,
      metrics,
      preferences,
      history: { minmax: [], tetra: [] }
    });
  },
  setStakeholderInfluences: (values) => {
    set((state) => {
      if (!Array.isArray(values) || values.length !== state.stakeholderRawInfluence.length) {
        return {};
      }
      const sanitized = values.map((val) => Math.max(0.0001, val));
      const normalizedValues = renormalize(sanitized, state.stakeholderRawObjectiveWeights);
      return {
        stakeholderRawInfluence: sanitized,
        stakeholderWeights: normalizedValues.weights,
        stakeholderObjectiveWeights: normalizedValues.objectives
      };
    });
  },
  updateStakeholderInfluence: (index, value) => {
    set((state) => {
      const stakeholderRawInfluence = state.stakeholderRawInfluence.map((val, idx) =>
        idx === index ? Math.max(0.0001, value) : val
      );
      const normalizedValues = renormalize(stakeholderRawInfluence, state.stakeholderRawObjectiveWeights);
      return {
        stakeholderRawInfluence,
        stakeholderWeights: normalizedValues.weights,
        stakeholderObjectiveWeights: normalizedValues.objectives
      };
    });
  },
  updateStakeholderObjectiveWeight: (stakeholderIndex, objectiveIndex, value) => {
    set((state) => {
      const stakeholderRawObjectiveWeights = state.stakeholderRawObjectiveWeights.map((row, idx) => {
        if (idx !== stakeholderIndex) return row;
        return row.map((val, idy) => (idy === objectiveIndex ? value : val));
      });
      const normalizedValues = renormalize(state.stakeholderRawInfluence, stakeholderRawObjectiveWeights);
      return {
        stakeholderRawObjectiveWeights,
        stakeholderWeights: normalizedValues.weights,
        stakeholderObjectiveWeights: normalizedValues.objectives
      };
    });
  }
}));

export { objectiveColors };
