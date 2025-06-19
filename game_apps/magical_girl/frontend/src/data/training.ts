// Initial training data for the game
import type { TrainingSession } from '../types';

export const initialTrainingSessions: TrainingSession[] = [
  {
    id: 'basic_meditation',
    name: 'Basic Meditation',
    description: 'Focus your mind and connect with your inner magical energy through simple meditation techniques.',
    type: 'Mental',
    category: 'Focus',
    difficulty: 'Beginner',
    duration: 300, // 5 minutes
    cost: {
      magicalEnergy: 5,
      time: 5
    },
    requirements: [],
    effects: [
      {
        type: 'stat_increase',
        target: 'self',
        value: 1,
        probability: 1.0,
        scaling: { basedOn: 'level', formula: 'base + level * 0.5', cap: 5 }
      }
    ],
    rewards: [
      {
        type: 'experience',
        item: 'meditation_exp',
        quantity: 15,
        probability: 1.0
      },
      {
        type: 'sparkles',
        item: 'sparkles',
        quantity: 5,
        probability: 1.0
      }
    ],
    unlockConditions: [],
    isUnlocked: true,
    isCompleted: false,
    completionCount: 0,
    tags: ['peaceful', 'solo', 'mental', 'safe', 'repeatable'],
    instructor: {
      id: 'master_zen',
      name: 'Master Zen',
      specialization: ['Mental', 'Spiritual'],
      bonuses: [
        {
          type: 'experience',
          value: 1.2,
          condition: 'mental_training'
        }
      ],
      availability: {
        timeSlots: [
          { start: 6, end: 10, efficiency: 1.2 },
          { start: 17, end: 21, efficiency: 1.1 }
        ],
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        seasons: ['Spring', 'Summer', 'Autumn', 'Winter']
      },
      personality: {
        traits: ['patient', 'wise', 'calm'],
        teachingStyle: 'Patient',
        favoriteStudents: [],
        specialQuirks: ['speaks_in_riddles', 'loves_tea']
      },
      relationship: 50
    }
  },
  {
    id: 'physical_conditioning',
    name: 'Physical Conditioning',
    description: 'Build your physical strength and endurance through targeted exercises designed for magical girls.',
    type: 'Physical',
    category: 'Stat_Boost',
    difficulty: 'Beginner',
    duration: 900, // 15 minutes
    cost: {
      magicalEnergy: 10,
      time: 15
    },
    requirements: [],
    effects: [
      {
        type: 'stat_increase',
        target: 'self',
        value: 1,
        probability: 0.8,
        scaling: { basedOn: 'endurance', formula: 'base + endurance * 0.1', cap: 3 }
      },
      {
        type: 'stat_increase',
        target: 'self',
        value: 1,
        probability: 0.6,
        scaling: { basedOn: 'power', formula: 'base + power * 0.1', cap: 2 }
      }
    ],
    rewards: [
      {
        type: 'experience',
        item: 'physical_exp',
        quantity: 20,
        probability: 1.0
      },
      {
        type: 'sparkles',
        item: 'sparkles',
        quantity: 8,
        probability: 1.0
      }
    ],
    unlockConditions: [],
    isUnlocked: true,
    isCompleted: false,
    completionCount: 0,
    tags: ['physical', 'solo', 'intensive', 'safe', 'repeatable']
  },
  {
    id: 'magic_control_basics',
    name: 'Magic Control Basics',
    description: 'Learn to channel and control your magical energy with precision and stability.',
    type: 'Magic',
    category: 'Magic_Control',
    difficulty: 'Novice',
    duration: 600, // 10 minutes
    cost: {
      magicalEnergy: 15,
      time: 10
    },
    requirements: [
      {
        type: 'level',
        value: 2,
        description: 'Must be at least level 2'
      }
    ],
    effects: [
      {
        type: 'stat_increase',
        target: 'self',
        value: 1,
        probability: 0.9,
        scaling: { basedOn: 'magic', formula: 'base + magic * 0.1', cap: 4 }
      },
      {
        type: 'stat_increase',
        target: 'self',
        value: 1,
        probability: 0.7,
        scaling: { basedOn: 'focus', formula: 'base + focus * 0.1', cap: 3 }
      }
    ],
    rewards: [
      {
        type: 'experience',
        item: 'magic_exp',
        quantity: 25,
        probability: 1.0
      },
      {
        type: 'sparkles',
        item: 'sparkles',
        quantity: 12,
        probability: 1.0
      },
      {
        type: 'ability_fragment',
        item: 'magic_burst_fragment',
        quantity: 1,
        probability: 0.3
      }
    ],
    unlockConditions: [
      {
        type: 'level',
        value: 2,
        description: 'Reach level 2'
      }
    ],
    isUnlocked: false,
    isCompleted: false,
    completionCount: 0,
    tags: ['magic', 'solo', 'elemental', 'safe', 'repeatable']
  },
  {
    id: 'combat_training',
    name: 'Combat Training',
    description: 'Practice your combat techniques against magical training dummies and obstacles.',
    type: 'Combat',
    category: 'Combat_Technique',
    difficulty: 'Intermediate',
    duration: 1200, // 20 minutes
    cost: {
      magicalEnergy: 25,
      time: 20
    },
    requirements: [
      {
        type: 'level',
        value: 3,
        description: 'Must be at least level 3'
      },
      {
        type: 'stat',
        value: { power: 10 },
        description: 'Power must be at least 10'
      }
    ],
    effects: [
      {
        type: 'stat_increase',
        target: 'self',
        value: 2,
        probability: 0.8,
        scaling: { basedOn: 'power', formula: 'base + power * 0.15', cap: 5 }
      },
      {
        type: 'stat_increase',
        target: 'self',
        value: 1,
        probability: 0.6,
        scaling: { basedOn: 'courage', formula: 'base + courage * 0.1', cap: 3 }
      },
      {
        type: 'ability_upgrade',
        target: 'self',
        value: 1,
        probability: 0.4,
        condition: 'has_combat_ability'
      }
    ],
    rewards: [
      {
        type: 'experience',
        item: 'combat_exp',
        quantity: 40,
        probability: 1.0
      },
      {
        type: 'sparkles',
        item: 'sparkles',
        quantity: 20,
        probability: 1.0
      },
      {
        type: 'stardust',
        item: 'stardust',
        quantity: 5,
        probability: 0.7
      }
    ],
    unlockConditions: [
      {
        type: 'level',
        value: 3,
        description: 'Reach level 3'
      },
      {
        type: 'training',
        value: 'physical_conditioning',
        description: 'Complete Physical Conditioning at least 3 times'
      }
    ],
    isUnlocked: false,
    isCompleted: false,
    completionCount: 0,
    tags: ['combat', 'solo', 'intensive', 'dangerous', 'repeatable'],
    instructor: {
      id: 'captain_valor',
      name: 'Captain Valor',
      specialization: ['Combat', 'Physical'],
      bonuses: [
        {
          type: 'success_rate',
          value: 1.15,
          condition: 'combat_training'
        },
        {
          type: 'experience',
          value: 1.1
        }
      ],
      availability: {
        timeSlots: [
          { start: 14, end: 18, efficiency: 1.3 },
          { start: 19, end: 22, efficiency: 1.1 }
        ],
        days: ['Tuesday', 'Thursday', 'Saturday'],
        seasons: ['Spring', 'Summer', 'Autumn', 'Winter']
      },
      personality: {
        traits: ['disciplined', 'encouraging', 'tough'],
        teachingStyle: 'Demanding',
        favoriteStudents: [],
        specialQuirks: ['military_background', 'loves_challenges']
      },
      relationship: 30
    }
  },
  {
    id: 'elemental_mastery',
    name: 'Elemental Mastery',
    description: 'Deepen your connection with your magical element and learn advanced elemental techniques.',
    type: 'Elemental',
    category: 'Skill_Development',
    difficulty: 'Advanced',
    duration: 1800, // 30 minutes
    cost: {
      magicalEnergy: 40,
      stardust: 10,
      time: 30
    },
    requirements: [
      {
        type: 'level',
        value: 5,
        description: 'Must be at least level 5'
      },
      {
        type: 'stat',
        value: { magic: 15 },
        description: 'Magic must be at least 15'
      },
      {
        type: 'training_completed',
        value: 'magic_control_basics',
        description: 'Must have completed Magic Control Basics at least 5 times'
      }
    ],
    effects: [
      {
        type: 'stat_increase',
        target: 'self',
        value: 3,
        probability: 0.9,
        scaling: { basedOn: 'magic', formula: 'base + magic * 0.2', cap: 8 }
      },
      {
        type: 'ability_unlock',
        target: 'self',
        value: 1,
        probability: 0.5,
        condition: 'element_specific_ability'
      },
      {
        type: 'transformation_progress',
        target: 'self',
        value: 10,
        probability: 0.8
      }
    ],
    rewards: [
      {
        type: 'experience',
        item: 'elemental_exp',
        quantity: 80,
        probability: 1.0
      },
      {
        type: 'sparkles',
        item: 'sparkles',
        quantity: 40,
        probability: 1.0
      },
      {
        type: 'stardust',
        item: 'stardust',
        quantity: 15,
        probability: 1.0
      },
      {
        type: 'special',
        item: 'elemental_crystal',
        quantity: 1,
        probability: 0.3
      }
    ],
    unlockConditions: [
      {
        type: 'level',
        value: 5,
        description: 'Reach level 5'
      },
      {
        type: 'training',
        value: 'magic_control_basics',
        description: 'Master Magic Control Basics (complete 5 times)'
      }
    ],
    isUnlocked: false,
    isCompleted: false,
    completionCount: 0,
    tags: ['elemental', 'solo', 'intensive', 'special', 'repeatable']
  },
  {
    id: 'team_coordination',
    name: 'Team Coordination',
    description: 'Train with other magical girls to improve teamwork and combination abilities.',
    type: 'Team',
    category: 'Team_Coordination',
    difficulty: 'Intermediate',
    duration: 1500, // 25 minutes
    cost: {
      magicalEnergy: 20,
      time: 25
    },
    requirements: [
      {
        type: 'level',
        value: 4,
        description: 'Must be at least level 4'
      },
      {
        type: 'magical_girl',
        value: 2,
        description: 'Must have at least 2 magical girls unlocked'
      }
    ],
    effects: [
      {
        type: 'stat_increase',
        target: 'all_team',
        value: 1,
        probability: 0.8,
        scaling: { basedOn: 'charm', formula: 'base + charm * 0.1', cap: 3 }
      },
      {
        type: 'bond_increase',
        target: 'all_team',
        value: 5,
        probability: 1.0
      },
      {
        type: 'skill_point',
        target: 'self',
        value: 1,
        probability: 0.6
      }
    ],
    rewards: [
      {
        type: 'experience',
        item: 'team_exp',
        quantity: 35,
        probability: 1.0,
        scaling: { factor: 'team_size', multiplier: 1.2, base: 35 }
      },
      {
        type: 'sparkles',
        item: 'sparkles',
        quantity: 25,
        probability: 1.0
      }
    ],
    unlockConditions: [
      {
        type: 'level',
        value: 4,
        description: 'Reach level 4'
      },
      {
        type: 'achievement',
        value: 'first_friend',
        description: 'Unlock a second magical girl'
      }
    ],
    isUnlocked: false,
    isCompleted: false,
    completionCount: 0,
    tags: ['group', 'social', 'peaceful', 'safe', 'repeatable']
  },
  {
    id: 'transformation_practice',
    name: 'Transformation Practice',
    description: 'Practice your magical girl transformation to reduce energy cost and improve effectiveness.',
    type: 'Special',
    category: 'Transformation',
    difficulty: 'Advanced',
    duration: 1200, // 20 minutes
    cost: {
      magicalEnergy: 35,
      sparkles: 25,
      time: 20
    },
    requirements: [
      {
        type: 'level',
        value: 6,
        description: 'Must be at least level 6'
      },
      {
        type: 'ability',
        value: 'transformation_unlocked',
        description: 'Must have unlocked transformation ability'
      }
    ],
    effects: [
      {
        type: 'transformation_progress',
        target: 'self',
        value: 20,
        probability: 1.0
      },
      {
        type: 'stat_increase',
        target: 'self',
        value: 2,
        probability: 0.7,
        scaling: { basedOn: 'magic', formula: 'base + magic * 0.15', cap: 6 }
      },
      {
        type: 'special',
        target: 'self',
        value: 'transformation_efficiency',
        probability: 0.4
      }
    ],
    rewards: [
      {
        type: 'experience',
        item: 'transformation_exp',
        quantity: 60,
        probability: 1.0
      },
      {
        type: 'sparkles',
        item: 'sparkles',
        quantity: 30,
        probability: 1.0
      },
      {
        type: 'stardust',
        item: 'stardust',
        quantity: 20,
        probability: 0.8
      },
      {
        type: 'special',
        item: 'transformation_essence',
        quantity: 1,
        probability: 0.5
      }
    ],
    unlockConditions: [
      {
        type: 'level',
        value: 6,
        description: 'Reach level 6'
      },
      {
        type: 'special',
        value: 'transformation_available',
        description: 'Have transformation ability available'
      }
    ],
    isUnlocked: false,
    isCompleted: false,
    completionCount: 0,
    tags: ['special', 'solo', 'transformation', 'intensive', 'repeatable']
  }
];

export const trainingCategories = {
  Stat_Boost: {
    name: 'Stat Boost',
    description: 'Directly increase your character stats',
    icon: 'chart-line',
    color: '#FF6B6B',
    focusStats: ['power', 'defense', 'speed', 'endurance']
  },
  Skill_Development: {
    name: 'Skill Development',
    description: 'Learn new abilities and improve existing ones',
    icon: 'star',
    color: '#4ECDC4',
    focusStats: ['magic', 'wisdom', 'focus']
  },
  Ability_Training: {
    name: 'Ability Training',
    description: 'Practice specific magical abilities',
    icon: 'magic',
    color: '#45B7D1',
    focusStats: ['magic', 'focus']
  },
  Endurance: {
    name: 'Endurance',
    description: 'Build stamina and resilience',
    icon: 'heart',
    color: '#96CEB4',
    focusStats: ['endurance', 'defense']
  },
  Focus: {
    name: 'Focus',
    description: 'Improve concentration and mental clarity',
    icon: 'brain',
    color: '#FFEAA7',
    focusStats: ['focus', 'wisdom']
  },
  Transformation: {
    name: 'Transformation',
    description: 'Master your magical girl transformation',
    icon: 'sparkles',
    color: '#DDA0DD',
    focusStats: ['magic', 'charm']
  },
  Combat_Technique: {
    name: 'Combat Technique',
    description: 'Learn fighting skills and tactics',
    icon: 'sword',
    color: '#74B9FF',
    focusStats: ['power', 'courage', 'speed']
  },
  Magic_Control: {
    name: 'Magic Control',
    description: 'Refine magical energy manipulation',
    icon: 'circle',
    color: '#A29BFE',
    focusStats: ['magic', 'focus', 'wisdom']
  },
  Team_Coordination: {
    name: 'Team Coordination',
    description: 'Improve teamwork and cooperation',
    icon: 'users',
    color: '#FD79A8',
    focusStats: ['charm', 'wisdom']
  },
  Leadership: {
    name: 'Leadership',
    description: 'Develop leadership and inspiration skills',
    icon: 'crown',
    color: '#E17055',
    focusStats: ['charm', 'courage', 'wisdom']
  }
};

export const trainingTypes = {
  Basic: {
    name: 'Basic',
    description: 'Fundamental training for beginners',
    color: '#A8E6CF',
    requirements: [],
    bonuses: { experience: 1.0, cost: 1.0 }
  },
  Combat: {
    name: 'Combat',
    description: 'Fighting techniques and battle strategies',
    color: '#FFD3A5',
    requirements: [{ type: 'stat', value: { power: 5 } }],
    bonuses: { experience: 1.2, cost: 1.3 }
  },
  Magic: {
    name: 'Magic',
    description: 'Magical theory and energy manipulation',
    color: '#A8A8F0',
    requirements: [{ type: 'stat', value: { magic: 5 } }],
    bonuses: { experience: 1.2, cost: 1.2 }
  },
  Physical: {
    name: 'Physical',
    description: 'Physical conditioning and athleticism',
    color: '#FFA8A8',
    requirements: [],
    bonuses: { experience: 1.1, cost: 0.9 }
  },
  Mental: {
    name: 'Mental',
    description: 'Mental training and psychological preparation',
    color: '#A8F0A8',
    requirements: [],
    bonuses: { experience: 1.1, cost: 0.8 }
  },
  Spiritual: {
    name: 'Spiritual',
    description: 'Connection with inner power and harmony',
    color: '#DDA0DD',
    requirements: [{ type: 'stat', value: { wisdom: 8 } }],
    bonuses: { experience: 1.3, cost: 1.1 }
  },
  Elemental: {
    name: 'Elemental',
    description: 'Element-specific magical training',
    color: '#87CEEB',
    requirements: [{ type: 'level', value: 3 }],
    bonuses: { experience: 1.4, cost: 1.5 }
  },
  Team: {
    name: 'Team',
    description: 'Cooperative training with other magical girls',
    color: '#F0E68C',
    requirements: [{ type: 'magical_girl', value: 2 }],
    bonuses: { experience: 1.5, cost: 0.8 }
  },
  Special: {
    name: 'Special',
    description: 'Unique advanced training techniques',
    color: '#DEB887',
    requirements: [{ type: 'level', value: 5 }],
    bonuses: { experience: 2.0, cost: 2.0 }
  },
  Advanced: {
    name: 'Advanced',
    description: 'High-level training for experienced magical girls',
    color: '#D3D3D3',
    requirements: [{ type: 'level', value: 8 }],
    bonuses: { experience: 2.5, cost: 3.0 }
  }
};

export const trainingDifficulties = {
  Beginner: {
    name: 'Beginner',
    description: 'Perfect for those just starting their journey',
    color: '#A8E6CF',
    requirements: [],
    multipliers: { experience: 0.8, cost: 0.7, success: 1.2 }
  },
  Novice: {
    name: 'Novice',
    description: 'For those with some basic experience',
    color: '#DCEDC8',
    requirements: [{ type: 'level', value: 2 }],
    multipliers: { experience: 1.0, cost: 0.9, success: 1.1 }
  },
  Intermediate: {
    name: 'Intermediate',
    description: 'Challenging training for developing magical girls',
    color: '#FFF9C4',
    requirements: [{ type: 'level', value: 4 }],
    multipliers: { experience: 1.3, cost: 1.2, success: 1.0 }
  },
  Advanced: {
    name: 'Advanced',
    description: 'Demanding training requiring significant skill',
    color: '#FFCCBC',
    requirements: [{ type: 'level', value: 6 }],
    multipliers: { experience: 1.6, cost: 1.5, success: 0.9 }
  },
  Expert: {
    name: 'Expert',
    description: 'For highly skilled and experienced magical girls',
    color: '#F8BBD9',
    requirements: [{ type: 'level', value: 8 }],
    multipliers: { experience: 2.0, cost: 1.8, success: 0.8 }
  },
  Master: {
    name: 'Master',
    description: 'Elite training pushing you to your limits',
    color: '#E1BEE7',
    requirements: [{ type: 'level', value: 10 }],
    multipliers: { experience: 2.5, cost: 2.2, success: 0.7 }
  },
  Legendary: {
    name: 'Legendary',
    description: 'Mythical training for true masters',
    color: '#C5CAE9',
    requirements: [{ type: 'level', value: 15 }],
    multipliers: { experience: 3.0, cost: 3.0, success: 0.6 }
  }
};

export const trainingFacilities = [
  {
    id: 'basic_gym',
    name: 'Basic Training Gym',
    description: 'A simple gym with basic equipment for physical training',
    type: 'Gym' as const,
    level: 1,
    maxLevel: 5,
    bonuses: [
      { type: 'efficiency' as const, value: 1.1, trainingTypes: ['Physical'] }
    ],
    capacity: 2,
    currentUsers: [],
    maintenance: {
      condition: 100,
      costPerDay: 5,
      lastMaintained: Date.now(),
      breakdownRisk: 0.01,
      repairCost: 50
    },
    upgrades: [
      {
        id: 'advanced_equipment',
        name: 'Advanced Equipment',
        description: 'Better equipment for more effective training',
        level: 2,
        cost: { sparkles: 200, stardust: 50 },
        benefits: [
          { type: 'bonus', value: { type: 'efficiency', value: 1.2 }, description: 'Increased training efficiency' }
        ],
        requirements: [],
        isUnlocked: true,
        isPurchased: false
      }
    ],
    requirements: [],
    isUnlocked: true
  },
  {
    id: 'meditation_garden',
    name: 'Peaceful Meditation Garden',
    description: 'A tranquil garden perfect for mental and spiritual training',
    type: 'Garden' as const,
    level: 1,
    maxLevel: 3,
    bonuses: [
      { type: 'efficiency' as const, value: 1.2, trainingTypes: ['Mental', 'Spiritual'] },
      { type: 'cost_reduction' as const, value: 0.9 }
    ],
    capacity: 3,
    currentUsers: [],
    maintenance: {
      condition: 100,
      costPerDay: 3,
      lastMaintained: Date.now(),
      breakdownRisk: 0.005,
      repairCost: 30
    },
    upgrades: [],
    requirements: [
      { type: 'level', value: 3, description: 'Player must be level 3' }
    ],
    isUnlocked: false
  }
];

export const trainingEquipment = [
  {
    id: 'practice_weights',
    name: 'Magical Practice Weights',
    description: 'Weights that adjust to provide optimal resistance for magical girl training',
    type: 'Weights' as const,
    rarity: 'Common' as const,
    bonuses: [
      { type: 'stat_gain', value: 1.2, trainingTypes: ['Physical'] }
    ],
    durability: 100,
    maxDurability: 100,
    repairCost: { sparkles: 20 },
    requirements: [],
    isUnlocked: true,
    isOwned: false,
    quantity: 0
  },
  {
    id: 'focus_crystal',
    name: 'Focus Enhancement Crystal',
    description: 'A crystal that helps concentrate magical energy during training',
    type: 'Crystals' as const,
    rarity: 'Uncommon' as const,
    bonuses: [
      { type: 'efficiency', value: 1.3, trainingTypes: ['Magic', 'Mental'] },
      { type: 'success_rate', value: 1.1 }
    ],
    durability: 80,
    maxDurability: 80,
    repairCost: { stardust: 15, sparkles: 30 },
    requirements: [
      { type: 'level', value: 4, description: 'Must be level 4 or higher' }
    ],
    isUnlocked: false,
    isOwned: false,
    quantity: 0
  }
];
