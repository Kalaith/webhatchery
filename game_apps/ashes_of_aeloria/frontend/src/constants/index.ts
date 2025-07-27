/**
 * Application Constants
 * Centralized configuration and magic numbers for clean code principles
 */

// Game Configuration
export const GAME_CONFIG = {
  // Initial Resources
  INITIAL_GOLD: 500,
  INITIAL_SUPPLIES: 100,
  INITIAL_MANA: 50,
  
  // Victory Conditions
  CONQUEST_THRESHOLD: 0.7, // 70% of nodes for victory
  
  // Commander Limits
  MAX_COMMANDERS_PER_NODE: 3,
  COMMANDER_BASE_ARMY_SIZE: 37, // 20+10+5+2
  
  // Battle Constants
  BASE_ATTACK_STRENGTH: 50,
  EXPERIENCE_WIN: 50,
  EXPERIENCE_LOSS: 25,
  
  // Turn Phases
  PHASES: ['player', 'enemy', 'upkeep'] as const,
  
  // Node Star Levels
  MIN_STAR_LEVEL: 1,
  MAX_STAR_LEVEL: 5,
  
  // Upgrade Costs (multiplier per star level)
  UPGRADE_COST_MULTIPLIER: 1.5,
  BASE_UPGRADE_COST: {
    gold: 100,
    supplies: 50,
    mana: 25
  },
  
  // AI Behavior
  AI_RECRUITMENT_PROBABILITY: 0.3,
  AI_ATTACK_PROBABILITY: 0.4,
  AI_UPGRADE_PROBABILITY: 0.2,
} as const;

// UI Constants
export const UI_CONFIG = {
  // Canvas Dimensions
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,
  NODE_RADIUS: 30,
  
  // Colors
  COLORS: {
    PLAYER: '#22c55e',     // green-500
    ENEMY: '#ef4444',      // red-500
    NEUTRAL: '#6b7280',    // gray-500
    SELECTED: '#3b82f6',   // blue-500
    CONNECTION: '#d1d5db', // gray-300
  },
  
  // Animation Timings
  ANIMATION_DURATION: 300,
  HOVER_SCALE: 1.05,
  
  // Responsive Breakpoints (matches Tailwind)
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
  },
  
  // Touch Targets (accessibility)
  MIN_TOUCH_TARGET: 44,
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  GAME_STATE: 'ashes-of-aeloria-game',
  SETTINGS: 'ashes-of-aeloria-settings',
  TUTORIAL_COMPLETED: 'ashes-of-aeloria-tutorial',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  INSUFFICIENT_RESOURCES: 'Insufficient resources for this action',
  NO_COMMANDER_SELECTED: 'Please select a commander first',
  NO_NODE_SELECTED: 'Please select a node first',
  INVALID_ATTACK_TARGET: 'Cannot attack this target',
  NODE_AT_CAPACITY: 'Node is at maximum commander capacity',
  COMMANDER_ALREADY_ASSIGNED: 'Commander is already assigned to a node',
  GAME_STATE_CORRUPTED: 'Game state is corrupted, resetting to default',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  COMMANDER_RECRUITED: 'Commander recruited successfully',
  NODE_CAPTURED: 'Node captured!',
  NODE_UPGRADED: 'Node upgraded successfully',
  COMMANDER_ASSIGNED: 'Commander assigned to node',
  TURN_COMPLETED: 'Turn completed',
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_ANIMATIONS: true,
  ENABLE_SOUND: false, // Will be implemented in Phase 2
  ENABLE_TUTORIAL: true,
  ENABLE_DEBUG_MODE: process.env.NODE_ENV === 'development',
  ENABLE_ANALYTICS: false, // Will be implemented for production
} as const;

// Type exports for constants
export type GamePhase = typeof GAME_CONFIG.PHASES[number];
export type ColorKey = keyof typeof UI_CONFIG.COLORS;
