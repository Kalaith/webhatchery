// Achievement data - Reusable Components principle
import type { Achievement } from '../types/achievements';

export const initialAchievements: Achievement[] = [
  // Training Category
  {
    id: 'first_training',
    name: 'First Steps',
    description: 'Complete your first training session',
    category: 'training',
    icon: '🎯',
    requirement: {
      type: 'count',
      target: 1,
      condition: 'training_completed'
    },
    reward: {
      type: 'resources',
      resources: {
        sparkles: 25,
        experience: 50
      }
    },
    rarity: 'common',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    tags: ['beginner', 'tutorial']
  },
  {
    id: 'training_adept',
    name: 'Training Adept',
    description: 'Complete 10 training sessions',
    category: 'training',
    icon: '💪',
    requirement: {
      type: 'count',
      target: 10,
      condition: 'training_completed'
    },
    reward: {
      type: 'resources',
      resources: {
        sparkles: 100,
        stardust: 10,
        experience: 200
      }
    },
    rarity: 'uncommon',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
    tags: ['training', 'progression']
  },
  {
    id: 'training_master',
    name: 'Training Master',
    description: 'Complete 50 training sessions',
    category: 'training',
    icon: '🏆',
    requirement: {
      type: 'count',
      target: 50,
      condition: 'training_completed'
    },
    reward: {
      type: 'resources',
      resources: {
        sparkles: 500,
        stardust: 50,
        moonbeams: 5,
        experience: 1000
      }
    },
    rarity: 'rare',
    unlocked: false,
    progress: 0,
    maxProgress: 50,
    tags: ['training', 'mastery']
  },
  {
    id: 'perfect_training',
    name: 'Perfect Execution',
    description: 'Complete a training session with perfect score',
    category: 'training',
    icon: '⭐',
    requirement: {
      type: 'condition',
      target: 1,
      condition: 'perfect_training_score'
    },
    reward: {
      type: 'resources',
      resources: {
        stardust: 25,
        experience: 150
      }
    },
    rarity: 'rare',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    tags: ['training', 'excellence']
  },

  // Mission Category
  {
    id: 'first_mission',
    name: 'Magical Debut',
    description: 'Complete your first mission',
    category: 'missions',
    icon: '🌟',
    requirement: {
      type: 'count',
      target: 1,
      condition: 'mission_completed'
    },
    reward: {
      type: 'resources',
      resources: {
        sparkles: 50,
        experience: 100
      }
    },
    rarity: 'common',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    tags: ['beginner', 'missions']
  },
  {
    id: 'mission_hero',
    name: 'Mission Hero',
    description: 'Successfully complete 25 missions',
    category: 'missions',
    icon: '🦸‍♀️',
    requirement: {
      type: 'count',
      target: 25,
      condition: 'mission_completed_success'
    },
    reward: {
      type: 'resources',
      resources: {
        sparkles: 300,
        stardust: 30,
        experience: 500
      }
    },
    rarity: 'uncommon',
    unlocked: false,
    progress: 0,
    maxProgress: 25,
    tags: ['missions', 'heroic']
  },
  {
    id: 'flawless_victory',
    name: 'Flawless Victory',
    description: 'Complete a mission with perfect score',
    category: 'missions',
    icon: '💎',
    requirement: {
      type: 'condition',
      target: 1,
      condition: 'perfect_mission_score'
    },
    reward: {
      type: 'resources',
      resources: {
        stardust: 50,
        moonbeams: 3,
        experience: 300
      }
    },
    rarity: 'epic',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    tags: ['missions', 'excellence']
  },
  {
    id: 'story_complete',
    name: 'Story Champion',
    description: 'Complete all story missions',
    category: 'missions',
    icon: '📖',
    requirement: {
      type: 'condition',
      target: 1,
      condition: 'all_story_missions_complete'
    },
    reward: {
      type: 'resources',
      resources: {
        sparkles: 1000,
        stardust: 100,
        moonbeams: 20,
        experience: 2000
      }
    },
    rarity: 'legendary',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    tags: ['missions', 'story', 'completion']
  },

  // Collection Category
  {
    id: 'first_girl',
    name: 'New Friend',
    description: 'Unlock your first magical girl',
    category: 'collection',
    icon: '👭',
    requirement: {
      type: 'count',
      target: 1,
      condition: 'magical_girl_unlocked'
    },
    reward: {
      type: 'resources',
      resources: {
        sparkles: 100,
        experience: 150
      }
    },
    rarity: 'common',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    tags: ['collection', 'friendship']
  },
  {
    id: 'full_team',
    name: 'Full Team',
    description: 'Unlock 5 magical girls',
    category: 'collection',
    icon: '👥',
    requirement: {
      type: 'count',
      target: 5,
      condition: 'magical_girl_unlocked'
    },
    reward: {
      type: 'resources',
      resources: {
        sparkles: 500,
        stardust: 25,
        experience: 750
      }
    },
    rarity: 'uncommon',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
    tags: ['collection', 'team']
  },
  {
    id: 'rare_collector',
    name: 'Rare Collector',
    description: 'Unlock a rare or higher rarity magical girl',
    category: 'collection',
    icon: '🌈',
    requirement: {
      type: 'condition',
      target: 1,
      condition: 'rare_girl_unlocked'
    },
    reward: {
      type: 'resources',
      resources: {
        stardust: 75,
        moonbeams: 5,
        experience: 400
      }
    },
    rarity: 'rare',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    tags: ['collection', 'rarity']
  },

  // Progression Category
  {
    id: 'level_up',
    name: 'Growing Stronger',
    description: 'Reach level 5',
    category: 'progression',
    icon: '📈',
    requirement: {
      type: 'threshold',
      target: 5,
      condition: 'player_level'
    },
    reward: {
      type: 'resources',
      resources: {
        sparkles: 200,
        magicalEnergy: 50,
        experience: 300
      }
    },
    rarity: 'common',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
    tags: ['progression', 'leveling']
  },
  {
    id: 'veteran_trainer',
    name: 'Veteran Trainer',
    description: 'Reach level 25',
    category: 'progression',
    icon: '🎖️',
    requirement: {
      type: 'threshold',
      target: 25,
      condition: 'player_level'
    },
    reward: {
      type: 'resources',
      resources: {
        sparkles: 1000,
        stardust: 100,
        moonbeams: 10,
        experience: 1500
      }
    },
    rarity: 'epic',
    unlocked: false,
    progress: 0,
    maxProgress: 25,
    tags: ['progression', 'veteran']
  },
  {
    id: 'energy_efficient',
    name: 'Energy Efficient',
    description: 'Complete 10 activities without running out of energy',
    category: 'progression',
    icon: '⚡',
    requirement: {
      type: 'streak',
      target: 10,
      condition: 'activities_without_energy_depletion',
      streak: true
    },
    reward: {
      type: 'resources',
      resources: {
        magicalEnergy: 100,
        stardust: 30,
        experience: 250
      }
    },
    rarity: 'uncommon',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
    tags: ['progression', 'efficiency']
  },

  // Social Category
  {
    id: 'bond_builder',
    name: 'Bond Builder',
    description: 'Increase bond level with any magical girl',
    category: 'social',
    icon: '💕',
    requirement: {
      type: 'count',
      target: 1,
      condition: 'bond_level_increased'
    },
    reward: {
      type: 'resources',
      resources: {
        sparkles: 150,
        experience: 100
      }
    },
    rarity: 'common',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    tags: ['social', 'bonding']
  },
  {
    id: 'best_friends',
    name: 'Best Friends Forever',
    description: 'Reach maximum bond level with a magical girl',
    category: 'social',
    icon: '💖',
    requirement: {
      type: 'condition',
      target: 1,
      condition: 'max_bond_level_reached'
    },
    reward: {
      type: 'resources',
      resources: {
        sparkles: 750,
        stardust: 50,
        moonbeams: 8,
        experience: 600
      }
    },
    rarity: 'epic',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    tags: ['social', 'friendship', 'max']
  },

  // Special Category
  {
    id: 'daily_dedication',
    name: 'Daily Dedication',
    description: 'Complete daily activities for 7 consecutive days',
    category: 'special',
    icon: '📅',
    requirement: {
      type: 'streak',
      target: 7,
      condition: 'daily_activities_complete',
      streak: true,
      timeframe: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    },
    reward: {
      type: 'resources',
      resources: {
        sparkles: 500,
        stardust: 75,
        moonbeams: 10,
        experience: 800
      }
    },
    rarity: 'rare',
    unlocked: false,
    progress: 0,
    maxProgress: 7,
    tags: ['special', 'daily', 'dedication']
  },
  {
    id: 'speed_runner',
    name: 'Speed Runner',
    description: 'Complete a mission in under 30 seconds',
    category: 'special',
    icon: '🏃‍♀️',
    requirement: {
      type: 'condition',
      target: 1,
      condition: 'mission_completed_under_30s'
    },
    reward: {
      type: 'resources',
      resources: {
        stardust: 100,
        moonbeams: 5,
        experience: 350
      }
    },
    rarity: 'rare',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    tags: ['special', 'speed', 'challenge']
  },
  {
    id: 'legendary_collector',
    name: 'Legendary Collector',
    description: 'Unlock a legendary magical girl',
    category: 'special',
    icon: '🌟',
    requirement: {
      type: 'condition',
      target: 1,
      condition: 'legendary_girl_unlocked'
    },
    reward: {
      type: 'resources',
      resources: {
        sparkles: 2000,
        stardust: 200,
        moonbeams: 50,
        experience: 3000
      }
    },
    rarity: 'legendary',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    hidden: true,
    tags: ['special', 'legendary', 'rare']
  },
  {
    id: 'achievement_hunter',
    name: 'Achievement Hunter',
    description: 'Unlock 10 achievements',
    category: 'special',
    icon: '🏆',
    requirement: {
      type: 'count',
      target: 10,
      condition: 'achievements_unlocked'
    },
    reward: {
      type: 'title',
      title: 'Achievement Hunter'
    },
    rarity: 'epic',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
    tags: ['special', 'meta', 'hunter']
  }
];

// Achievement categories configuration
export const achievementCategories = {
  training: {
    name: 'Training Master',
    description: 'Achievements related to training activities',
    icon: '💪',
    color: '#FF6B6B'
  },
  missions: {
    name: 'Mission Hero',
    description: 'Achievements for completing missions',
    icon: '🚀',
    color: '#4ECDC4'
  },
  collection: {
    name: 'Collector',
    description: 'Achievements for collecting magical girls',
    icon: '👥',
    color: '#45B7D1'
  },
  progression: {
    name: 'Progress Tracker',
    description: 'Achievements for character progression',
    icon: '📈',
    color: '#96CEB4'
  },
  social: {
    name: 'Social Butterfly',
    description: 'Achievements for bonding and relationships',
    icon: '💕',
    color: '#FFEAA7'
  },
  exploration: {
    name: 'Explorer',
    description: 'Achievements for exploration activities',
    icon: '🗺️',
    color: '#DDA0DD'
  },
  combat: {
    name: 'Combat Expert',
    description: 'Achievements for combat prowess',
    icon: '⚔️',
    color: '#FD79A8'
  },
  special: {
    name: 'Special',
    description: 'Unique and rare achievements',
    icon: '⭐',
    color: '#FDCB6E'
  }
};

// Achievement rarity configuration
export const achievementRarities = {
  common: {
    name: 'Common',
    color: '#95A5A6',
    glow: 'shadow-sm',
    points: 10
  },
  uncommon: {
    name: 'Uncommon',
    color: '#2ECC71',
    glow: 'shadow-md shadow-green-200',
    points: 25
  },
  rare: {
    name: 'Rare',
    color: '#3498DB',
    glow: 'shadow-lg shadow-blue-200',
    points: 50
  },
  epic: {
    name: 'Epic',
    color: '#9B59B6',
    glow: 'shadow-lg shadow-purple-200',
    points: 100
  },
  legendary: {
    name: 'Legendary',
    color: '#F39C12',
    glow: 'shadow-xl shadow-orange-200',
    points: 250
  },
  mythical: {
    name: 'Mythical',
    color: '#E74C3C',
    glow: 'shadow-2xl shadow-red-200',
    points: 500
  }
};

// Default achievement filters
export const defaultAchievementFilters = {
  category: 'all' as const,
  rarity: 'all' as const,
  status: 'all' as const,
  search: '',
  showHidden: false
};
