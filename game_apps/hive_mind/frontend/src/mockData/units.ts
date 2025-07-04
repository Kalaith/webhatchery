import type { Unit } from '../types/Unit';

export const mockUnits: Unit[] = [
  {
    id: 'worker',
    name: 'Worker',
    description: 'Gathers biomass and energy for the hive',
    baseCost: { biomass: 10, energy: 5 },
    production: { biomass: 2, energy: 1 },
    productionRate: '10%',
    productionTime: 3000,
    unlockRequirement: 'start',
    cost: 50,
    icon: '🐛',
    isVisible: true,
  },
  {
    id: 'scout',
    name: 'Scout',
    description: 'Explores territory and generates knowledge',
    baseCost: { biomass: 25, energy: 15, knowledge: 5 },
    production: { knowledge: 3, territory: 0.5 },
    productionRate: '5%',
    productionTime: 5000,
    unlockRequirement: 'knowledge_10',
    cost: 100,
    icon: '🦗',
    isVisible: true,
  },
  {
    id: 'soldier',
    name: 'Soldier',
    description: 'Conquers territory and defends the hive',
    baseCost: { biomass: 50, energy: 30, knowledge: 10 },
    production: { territory: 2 },
    productionRate: '15%',
    productionTime: 8000,
    unlockRequirement: 'territory_5',
    cost: 200,
    icon: '🐞',
    isVisible: false,
  },
  {
    id: 'specialist',
    name: 'Specialist',
    description: 'Advanced unit with unique capabilities',
    baseCost: { biomass: 100, energy: 75, knowledge: 25, territory: 5 },
    production: { biomass: 5, energy: 3, knowledge: 2, territory: 1 },
    productionRate: '20%',
    productionTime: 12000,
    unlockRequirement: 'evolution_1',
    cost: 500,
    icon: '🕸️',
    isVisible: false,
  },
];
