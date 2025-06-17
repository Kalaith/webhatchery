// Game configuration constants
export const GAME_CONFIG = {
  // Resource generation rates (per second)
  RESOURCE_RATES: {
    MANA_REGENERATION: 1,
    ENERGY_REGENERATION: 2,
    EXPERIENCE_MULTIPLIER: 1,
  },
  
  // Level progression
  LEVEL_PROGRESSION: {
    BASE_EXP: 100,
    EXP_MULTIPLIER: 1.5,
    MAX_LEVEL: 100,
  },
  
  // Mission timers (in minutes)
  MISSION_DURATION: {
    TUTORIAL: 5,
    EASY: 15,
    MEDIUM: 30,
    HARD: 60,
    BOSS: 90,
  },
  
  // Training costs and durations
  TRAINING: {
    BASE_COST: 10,
    COST_MULTIPLIER: 1.2,
    BASE_DURATION: 10, // minutes
  },
  
  // Achievement thresholds
  ACHIEVEMENTS: {
    MISSIONS_COMPLETED: [1, 5, 10, 25, 50, 100],
    LEVEL_REACHED: [5, 10, 20, 30, 50, 75, 100],
    TOTAL_MANA_SPENT: [100, 500, 1000, 5000, 10000],
  },
  
  // UI Settings
  UI: {
    NOTIFICATION_DURATION: 3000, // ms
    AUTO_SAVE_INTERVAL: 30000, // ms
    ANIMATION_DURATION: 300, // ms
  },
  
  // Game balance
  BALANCE: {
    STARTING_MANA: 100,
    STARTING_ENERGY: 50,
    MAX_MANA: 1000,
    MAX_ENERGY: 200,
    TRANSFORMATION_COST: 20,
  },
} as const;

export const VIEWS = {
  DASHBOARD: 'dashboard',
  MAGICAL_GIRLS: 'collection',
  TRAINING: 'training',
  MISSIONS: 'missions',
  ACHIEVEMENTS: 'achievements',
  SETTINGS: 'settings',
} as const;

export type ViewType = typeof VIEWS[keyof typeof VIEWS];
