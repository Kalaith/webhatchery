// Game configuration and constants
import type { GameConfig } from '../types';

export const GAME_CONFIG: GameConfig = {
  version: '1.0.0',
  resourceLimits: {
    maxMagicalEnergy: 1000,
    maxSparkles: 999999,
    maxStardust: 99999,
    maxMoonbeams: 9999,
    maxCrystals: 999
  },
  costs: {
    training: {
      basic: 10,
      intermediate: 25,
      advanced: 50,
      special: 100
    },
    missions: {
      easy: 15,
      medium: 30,
      hard: 60,
      extreme: 120
    },
    transformation: {
      basic: 20,
      advanced: 50,
      ultimate: 100
    },
    upgrades: {
      statBoost: 100,
      newAbility: 250,
      equipment: 500
    }
  },
  rewards: {
    training: {
      experience: 25,
      sparkles: 10,
      statGain: 1
    },
    missions: {
      baseExperience: 50,
      baseSparkles: 25,
      bonusMultiplier: 1.5
    },    
    achievements: {
      small: { experience: 25, sparkles: 50, stardust: 0, moonbeams: 0, crystals: 0, magicalEnergy: 0, maxMagicalEnergy: 0, level: 0 },
      medium: { experience: 75, sparkles: 150, stardust: 25, moonbeams: 0, crystals: 0, magicalEnergy: 0, maxMagicalEnergy: 0, level: 0 },
      large: { experience: 200, sparkles: 400, stardust: 100, moonbeams: 25, crystals: 0, magicalEnergy: 0, maxMagicalEnergy: 0, level: 0 },
      legendary: { experience: 500, sparkles: 1000, stardust: 300, moonbeams: 100, crystals: 10, magicalEnergy: 0, maxMagicalEnergy: 0, level: 0 }
    }
  },
  timeMultipliers: {
    training: 1.0,
    missions: 1.0,
    recovery: 1.0,
    energy: 1.0
  },
  balanceSettings: {
    experienceScale: 1.0,
    difficultyScale: 1.0,
    rewardScale: 1.0,
    costScale: 1.0
  }
};

export const INITIAL_RESOURCES = {
  magicalEnergy: 100,
  maxMagicalEnergy: 100,
  sparkles: 50,
  stardust: 0,
  moonbeams: 0,
  crystals: 0,
  experience: 0,
  level: 1
};

export const LEVEL_REQUIREMENTS = {
  experienceFormula: (level: number) => Math.floor(100 * Math.pow(1.5, level - 1)),
  maxLevel: 50,
  statPointsPerLevel: 2,
  abilityPointsPerLevel: 1
};

export const ELEMENT_EFFECTIVENESS = {
  Light: { strong: ['Darkness'], weak: ['Void'], neutral: ['Fire', 'Water', 'Earth', 'Air', 'Ice', 'Lightning', 'Nature', 'Crystal'], amplified: ['Celestial'] },
  Darkness: { strong: ['Light'], weak: ['Celestial'], neutral: ['Fire', 'Water', 'Earth', 'Air', 'Ice', 'Lightning', 'Nature', 'Crystal'], amplified: ['Void'] },
  Fire: { strong: ['Ice', 'Nature'], weak: ['Water'], neutral: ['Light', 'Darkness', 'Earth', 'Air', 'Lightning', 'Crystal'], amplified: ['Celestial', 'Void'] },
  Water: { strong: ['Fire'], weak: ['Lightning', 'Nature'], neutral: ['Light', 'Darkness', 'Earth', 'Air', 'Ice', 'Crystal'], amplified: ['Celestial', 'Void'] },
  Earth: { strong: ['Lightning'], weak: ['Air', 'Nature'], neutral: ['Light', 'Darkness', 'Fire', 'Water', 'Ice', 'Crystal'], amplified: ['Celestial', 'Void'] },
  Air: { strong: ['Earth'], weak: ['Lightning'], neutral: ['Light', 'Darkness', 'Fire', 'Water', 'Ice', 'Nature', 'Crystal'], amplified: ['Celestial', 'Void'] },
  Ice: { strong: ['Water'], weak: ['Fire'], neutral: ['Light', 'Darkness', 'Earth', 'Air', 'Lightning', 'Nature', 'Crystal'], amplified: ['Celestial', 'Void'] },
  Lightning: { strong: ['Air', 'Water'], weak: ['Earth'], neutral: ['Light', 'Darkness', 'Fire', 'Ice', 'Nature', 'Crystal'], amplified: ['Celestial', 'Void'] },
  Nature: { strong: ['Earth', 'Water'], weak: ['Fire'], neutral: ['Light', 'Darkness', 'Air', 'Ice', 'Lightning', 'Crystal'], amplified: ['Celestial', 'Void'] },
  Celestial: { strong: [], weak: [], neutral: [], amplified: ['Light', 'Fire', 'Water', 'Earth', 'Air', 'Ice', 'Lightning', 'Nature', 'Crystal', 'Darkness', 'Void'] },
  Void: { strong: [], weak: [], neutral: [], amplified: ['Darkness', 'Fire', 'Water', 'Earth', 'Air', 'Ice', 'Lightning', 'Nature', 'Crystal', 'Light', 'Celestial'] },
  Crystal: { strong: [], weak: [], neutral: ['Light', 'Darkness', 'Fire', 'Water', 'Earth', 'Air', 'Ice', 'Lightning', 'Nature'], amplified: ['Celestial', 'Void'] }
};

export const DAMAGE_MULTIPLIERS = {
  strong: 1.5,
  neutral: 1.0,
  weak: 0.75,
  amplified: 1.25
};

export const RARITY_MODIFIERS = {
  Common: { statMultiplier: 1.0, experienceMultiplier: 1.0, costMultiplier: 1.0 },
  Uncommon: { statMultiplier: 1.1, experienceMultiplier: 1.1, costMultiplier: 1.2 },
  Rare: { statMultiplier: 1.25, experienceMultiplier: 1.2, costMultiplier: 1.5 },
  Epic: { statMultiplier: 1.4, experienceMultiplier: 1.3, costMultiplier: 2.0 },
  Legendary: { statMultiplier: 1.6, experienceMultiplier: 1.5, costMultiplier: 3.0 },
  Mythical: { statMultiplier: 2.0, experienceMultiplier: 2.0, costMultiplier: 5.0 }
};

export const TIME_CONSTANTS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000
};

export const ENERGY_REGENERATION = {
  baseRate: 1, // energy per second
  levelMultiplier: 0.1, // additional energy per level
  restMultiplier: 2.0, // multiplier when not active
  trainingPenalty: 0.5, // multiplier during training
  missionPenalty: 0.3 // multiplier during missions
};

export const SAVE_CONSTANTS = {
  autoSaveInterval: 30 * TIME_CONSTANTS.SECOND,
  maxSaveSlots: 5,
  saveVersion: '1.0.0',
  compressionEnabled: true
};

export const UI_CONSTANTS = {
  animationDuration: 300,
  notificationDuration: 3000,
  modalFadeTime: 200,
  buttonCooldown: 100,
  tooltipDelay: 500
};

export const AUDIO_CONSTANTS = {
  defaultVolume: 0.7,
  fadeTime: 1000,
  maxConcurrentSounds: 10,
  soundCategories: {
    music: { defaultVolume: 0.5, maxVolume: 1.0 },
    sfx: { defaultVolume: 0.8, maxVolume: 1.0 },
    voice: { defaultVolume: 0.9, maxVolume: 1.0 },
    ambient: { defaultVolume: 0.3, maxVolume: 0.6 }
  }
};

export const PERFORMANCE_CONSTANTS = {
  targetFPS: 60,
  maxParticles: 100,
  renderDistance: 1000,
  cullingEnabled: true,
  levelOfDetail: true
};

export const TUTORIAL_CONSTANTS = {
  steps: [
    { id: 'welcome', target: 'header', content: 'Welcome to the Magical Girl Simulator!' },
    { id: 'resources', target: 'resource-display', content: 'Here you can see your current resources' },
    { id: 'training', target: 'training-tab', content: 'Start here to train your magical girls' },
    { id: 'missions', target: 'missions-tab', content: 'Complete missions to earn rewards' },
    { id: 'collection', target: 'collection-tab', content: 'View your magical girl collection' }
  ],
  autoStart: true,
  canSkip: true,
  showProgress: true
};

export const ACHIEVEMENT_CATEGORIES = {
  training: {
    name: 'Training Master',
    description: 'Achievements related to training activities',
    icon: 'dumbbell',
    color: '#FF6B6B'
  },
  missions: {
    name: 'Mission Hero',
    description: 'Achievements for completing missions',
    icon: 'flag',
    color: '#4ECDC4'
  },
  collection: {
    name: 'Collector',
    description: 'Achievements for collecting magical girls',
    icon: 'star',
    color: '#45B7D1'
  },
  progression: {
    name: 'Progress',
    description: 'General progression achievements',
    icon: 'chart-line',
    color: '#96CEB4'
  },
  special: {
    name: 'Special',
    description: 'Unique and hidden achievements',
    icon: 'crown',
    color: '#FFEAA7'
  },
  exploration: {
    name: 'Explorer',
    description: 'Achievements for discovering new content',
    icon: 'map',
    color: '#DDA0DD'
  }
};

export const ERROR_MESSAGES = {
  INSUFFICIENT_ENERGY: 'Not enough magical energy to perform this action',
  INSUFFICIENT_RESOURCES: 'Not enough resources to complete this action',
  LEVEL_REQUIRED: 'You need to reach a higher level first',
  REQUIREMENT_NOT_MET: 'You don\'t meet the requirements for this action',
  ALREADY_IN_PROGRESS: 'This action is already in progress',
  COOLDOWN_ACTIVE: 'This action is on cooldown',
  INVALID_SELECTION: 'Invalid selection, please try again',
  SAVE_FAILED: 'Failed to save game data',
  LOAD_FAILED: 'Failed to load game data',
  NETWORK_ERROR: 'Network connection error',
  UNKNOWN_ERROR: 'An unknown error occurred'
};

export const SUCCESS_MESSAGES = {
  TRAINING_COMPLETE: 'Training session completed successfully!',
  MISSION_COMPLETE: 'Mission completed!',
  LEVEL_UP: 'Congratulations! You leveled up!',
  ACHIEVEMENT_UNLOCKED: 'Achievement unlocked!',
  NEW_GIRL_UNLOCKED: 'New magical girl unlocked!',
  ABILITY_LEARNED: 'New ability learned!',
  TRANSFORMATION_MASTERED: 'Transformation mastered!',
  SAVE_SUCCESS: 'Game saved successfully',
  LOAD_SUCCESS: 'Game loaded successfully'
};

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  ACHIEVEMENT: 'achievement'
} as const;

export const STORAGE_KEYS = {
  GAME_SAVE: 'magical_girl_save',
  SETTINGS: 'magical_girl_settings',
  PREFERENCES: 'magical_girl_preferences',
  TUTORIAL: 'magical_girl_tutorial',
  STATISTICS: 'magical_girl_statistics'
};

export const API_ENDPOINTS = {
  SAVE_GAME: '/api/save',
  LOAD_GAME: '/api/load',
  SYNC_PROGRESS: '/api/sync',
  SUBMIT_SCORE: '/api/score',
  GET_LEADERBOARD: '/api/leaderboard',
  REPORT_BUG: '/api/bug-report'
};

export const FEATURE_FLAGS = {
  CLOUD_SAVE: false,
  MULTIPLAYER: false,
  ANALYTICS: true,
  DEBUG_MODE: import.meta.env.DEV,
  BETA_FEATURES: false,
  SEASONAL_EVENTS: true,
  SOCIAL_FEATURES: false
};

export const LIMITS = {
  MAX_MAGICAL_GIRLS: 50,
  MAX_ACTIVE_MISSIONS: 3,
  MAX_SAVE_SLOTS: 5,
  MAX_NOTIFICATIONS: 10,
  MAX_UNDO_HISTORY: 20,
  MAX_NAME_LENGTH: 30,
  MIN_NAME_LENGTH: 2
};

export const DEFAULTS = {
  MAGICAL_GIRL_NAME: 'New Magical Girl',
  SAVE_SLOT_NAME: 'Save Slot',
  VOLUME_SETTINGS: {
    master: 0.7,
    music: 0.5,
    sfx: 0.8,
    voice: 0.9
  },
  DISPLAY_SETTINGS: {
    theme: 'light',
    language: 'en',
    animations: true,
    particles: true,
    highQuality: true
  }
};
