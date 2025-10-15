export const defaultConfig = {
  constants: { TOTAL_LENGTH: 1600, MIN_CLOSING_TIME: 0.5 },
  bounds: {
    x1: { min: 0, max: 1600, step: 20, unit: 'm' },
    x2: { min: 1.0, max: 10.0, step: 0.1, unit: 'm' },
    x3: { min: 0.5, max: 5.0, step: 0.1, unit: 'h' }
  },
  OBJECTIVE_KEYS: ['initial_cost', 'maintenance_cost', 'sight', 'accessibility', 'water_quality', 'overtopping_risk'],
  STAKEHOLDER_DATA: [
    {
      name: 'Municipality',
      influence: 0.35,
      weights: { initial_cost: 0.2, maintenance_cost: 0.2, sight: 0.05, accessibility: 0.15, water_quality: 0.1, overtopping_risk: 0.3 }
    },
    {
      name: 'Residents',
      influence: 0.25,
      weights: { initial_cost: 0.1, maintenance_cost: 0.1, sight: 0.15, accessibility: 0.2, water_quality: 0.25, overtopping_risk: 0.2 }
    },
    {
      name: 'Environmental Agency',
      influence: 0.2,
      weights: { initial_cost: 0.05, maintenance_cost: 0.05, sight: 0.15, accessibility: 0.05, water_quality: 0.55, overtopping_risk: 0.15 }
    },
    {
      name: 'Shipping Companies',
      influence: 0.2,
      weights: { initial_cost: 0.1, maintenance_cost: 0.1, sight: 0.05, accessibility: 0.5, water_quality: 0.05, overtopping_risk: 0.2 }
    }
  ],
  knots: {
    initial_cost: { x: [700, 1200, 2000, 3200], y: [100, 75, 40, 10] },
    maintenance_cost: { x: [40, 80, 140, 220], y: [100, 75, 45, 15] },
    sight: { x: [0, 4, 7, 10], y: [25, 60, 85, 95] },
    accessibility: { x: [0, 4, 7, 10], y: [20, 55, 80, 95] },
    water_quality: { x: [0, 4, 7, 10], y: [25, 60, 82, 96] },
    overtopping_risk: { x: [0, 20, 50, 80], y: [100, 80, 45, 15] }
  },
  options: { popSize: 100, iterations: 200, crossover: 0.8, stallLimit: 30, encoding: 'real' },
  paradigms: ['minmax', 'tetra']
} as const;

export type ModelConfig = typeof defaultConfig;
