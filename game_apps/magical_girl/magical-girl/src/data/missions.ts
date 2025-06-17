// Initial missions data for the game
import type { Mission, GameMissionType as MissionType, MissionCategory, Difficulty } from '../types';

export const initialMissions: Mission[] = [
  {
    id: 'tutorial_basic_training',
    name: 'First Steps',
    description: 'Learn the basics of being a magical girl through simple training exercises.',
    type: 'Tutorial',
    category: 'Training',
    difficulty: 'Tutorial',
    requirements: [],
    objectives: [
      {
        id: 'complete_training',
        name: 'Complete Basic Training',
        description: 'Complete your first training session',
        type: 'interact',
        target: { type: 'condition', name: 'training_completed', quantity: 1 },
        condition: { type: 'simple', rules: [{ field: 'training_sessions', operator: 'greater', value: 0 }] },
        progress: 0,
        maxProgress: 1,
        isCompleted: false,
        isOptional: false,
        isHidden: false,
        hints: ['Go to the Training section and select a basic training exercise']
      }
    ],
    rewards: [
      {
        type: 'experience',
        item: 'base_experience',
        quantity: 50,
        rarity: 'Common',
        guaranteed: true,
        probability: 1.0
      },
      {
        type: 'sparkles',
        item: 'sparkles',
        quantity: 25,
        rarity: 'Common',
        guaranteed: true,
        probability: 1.0
      }
    ],
    penalties: [],
    location: {
      id: 'training_grounds',
      name: 'Training Grounds',
      description: 'A safe space for magical girls to practice their abilities',
      type: 'School',
      environment: {
        weather: 'Clear',
        timeOfDay: 'Morning',
        lighting: 'Bright',
        temperature: 'Mild',
        visibility: 'Clear',
        magicalIntensity: 3
      },
      hazards: [],
      features: [
        {
          type: 'landmark',
          name: 'Practice Targets',
          description: 'Magical targets that help improve accuracy',
          interactive: true,
          effects: [{ type: 'buff', value: { stat: 'focus', amount: 1 }, duration: 300 }]
        }
      ],
      background: 'training_ground',
      music: 'peaceful_melody'
    },
    story: {
      chapters: [
        {
          id: 'intro',
          title: 'A New Beginning',
          text: 'Welcome to your journey as a magical girl! Every hero starts with their first step. Let\'s begin with some basic training to understand your new abilities.',
          dialogue: [
            {
              speaker: 'Guide',
              text: 'Welcome, new magical girl! I\'m here to help you understand your powers.',
              emotion: 'welcoming'
            },
            {
              speaker: 'Guide',
              text: 'Training is essential to mastering your abilities. Let\'s start with something simple.',
              emotion: 'encouraging'
            }
          ]
        }
      ],
      characters: [
        {
          id: 'guide',
          name: 'Guide',
          role: 'mentor',
          appearance: 'mysterious_figure',
          personality: 'wise_and_patient',
          relationships: {},
          dialogue: {
            happy: ['Excellent work!', 'You\'re learning quickly!'],
            encouraging: ['Don\'t give up!', 'You can do this!']
          }
        }
      ]
    },
    isUnlocked: true,
    isCompleted: false,
    isAvailable: true,
    attempts: 0,
    tags: ['tutorial', 'training', 'beginner'],
    season: 'all'
  },
  {
    id: 'rescue_cat',
    name: 'Rescue the Lost Kitten',
    description: 'A kitten is stuck in a tree and needs your help! Use your magical abilities to safely bring it down.',
    type: 'Story',
    category: 'Rescue',
    difficulty: 'Easy',
    requirements: [
      {
        type: 'level',
        value: 1,
        description: 'Must be at least level 1'
      }
    ],
    objectives: [
      {
        id: 'find_kitten',
        name: 'Locate the Kitten',
        description: 'Find the scared kitten in the park',
        type: 'reach',
        target: { type: 'location', name: 'old_oak_tree', quantity: 1 },
        condition: { type: 'simple', rules: [{ field: 'location', operator: 'equals', value: 'old_oak_tree' }] },
        progress: 0,
        maxProgress: 1,
        isCompleted: false,
        isOptional: false,
        isHidden: false,
        hints: ['Look for the tallest tree in the park', 'Listen for the kitten\'s meowing']
      },
      {
        id: 'calm_kitten',
        name: 'Calm the Frightened Kitten',
        description: 'Use your gentle nature to calm the scared animal',
        type: 'interact',
        target: { type: 'character', name: 'scared_kitten', quantity: 1 },
        condition: { type: 'simple', rules: [{ field: 'charm_check', operator: 'greater', value: 10 }] },
        progress: 0,
        maxProgress: 1,
        isCompleted: false,
        isOptional: false,
        isHidden: false,
        hints: ['Speak softly to the kitten', 'Your charm stat affects success']
      },
      {
        id: 'rescue_safely',
        name: 'Safely Rescue the Kitten',
        description: 'Bring the kitten down from the tree without harm',
        type: 'solve',
        target: { type: 'condition', name: 'kitten_rescued', quantity: 1 },
        condition: { type: 'simple', rules: [{ field: 'rescue_method', operator: 'exists', value: true }] },
        progress: 0,
        maxProgress: 1,
        isCompleted: false,
        isOptional: false,
        isHidden: false,
        hints: ['Consider using your magical abilities', 'Think of a gentle approach']
      }
    ],
    rewards: [
      {
        type: 'experience',
        item: 'base_experience',
        quantity: 75,
        rarity: 'Common',
        guaranteed: true,
        probability: 1.0
      },
      {
        type: 'sparkles',
        item: 'sparkles',
        quantity: 40,
        rarity: 'Common',
        guaranteed: true,
        probability: 1.0
      },
      {
        type: 'achievement',
        item: 'first_rescue',
        quantity: 1,
        rarity: 'Common',
        guaranteed: true,
        probability: 1.0
      }
    ],
    penalties: [
      {
        type: 'failure',
        condition: 'kitten_scared_away',
        severity: 'minor',
        effect: { type: 'resource_loss', value: { sparkles: 10 } }
      }
    ],
    timeLimit: 1800, // 30 minutes
    location: {
      id: 'central_park',
      name: 'Central Park',
      description: 'A peaceful park in the heart of the city, filled with tall trees and walking paths',
      type: 'City',
      environment: {
        weather: 'Clear',
        timeOfDay: 'Afternoon',
        lighting: 'Normal',
        temperature: 'Warm',
        visibility: 'Clear',
        magicalIntensity: 2
      },
      hazards: [
        {
          type: 'environmental',
          name: 'Curious Crowd',
          description: 'Civilian onlookers who might complicate the rescue',
          severity: 'minor',
          frequency: 'common',
          effects: [{ type: 'debuff', value: { stat: 'focus', amount: -2 } }],
          countermeasures: ['Use magic discreetly', 'Work quickly and quietly']
        }
      ],
      features: [
        {
          type: 'landmark',
          name: 'Old Oak Tree',
          description: 'A magnificent old tree where the kitten is stuck',
          interactive: true,
          effects: [{ type: 'special', value: 'climbing_challenge' }]
        },
        {
          type: 'resource',
          name: 'Park Bench',
          description: 'A place to rest and think about your approach',
          interactive: true,
          effects: [{ type: 'heal', value: { magicalEnergy: 5 } }]
        }
      ],
      background: 'sunny_park',
      music: 'gentle_breeze',
      ambientSounds: ['birds_chirping', 'wind_in_leaves', 'distant_traffic']
    },
    story: {
      prologue: {
        id: 'setup',
        title: 'A Cry for Help',
        text: 'While walking through the park, you hear a faint meowing coming from above. Looking up, you see a small kitten stranded high in an old oak tree, too scared to come down on its own.',
        dialogue: [
          {
            speaker: 'Narrator',
            text: 'The afternoon sun filters through the leaves as you notice something unusual...'
          }
        ]
      },
      chapters: [
        {
          id: 'discovery',
          title: 'The Frightened Kitten',
          text: 'The small orange kitten clings to a high branch, meowing pitifully. A small crowd has gathered below, but no one seems sure how to help safely.',
          dialogue: [
            {
              speaker: 'Bystander',
              text: 'Someone should call the fire department!',
              emotion: 'worried'
            },
            {
              speaker: 'Child',
              text: 'Poor kitty! Is it going to be okay?',
              emotion: 'concerned'
            }
          ],
          choices: [
            {
              id: 'offer_help',
              text: 'Offer to help rescue the kitten',
              consequences: [{ type: 'story', target: 'reputation', effect: '+1' }],
              unlocks: ['rescue_attempt']
            },
            {
              id: 'wait_authorities',
              text: 'Wait for the authorities to handle it',
              consequences: [{ type: 'mission', target: 'time_pressure', effect: '+300' }]
            }
          ]
        },
        {
          id: 'rescue_attempt',
          title: 'A Magical Solution',
          text: 'You step forward, knowing your magical abilities might be the key to a safe rescue. You\'ll need to be careful not to reveal your true nature to the watching crowd.',
          conditions: [
            { type: 'choice', condition: 'offer_help', value: true }
          ]
        }
      ],
      epilogue: {
        id: 'resolution',
        title: 'Mission Complete',
        text: 'The kitten is safe, and you\'ve learned something valuable about using your powers to help others. The grateful crowd disperses, none the wiser about your magical abilities.',
        dialogue: [
          {
            speaker: 'Child',
            text: 'Thank you for saving the kitty!',
            emotion: 'grateful'
          }
        ]
      },
      characters: [
        {
          id: 'scared_kitten',
          name: 'Orange Kitten',
          role: 'victim',
          appearance: 'small_orange_cat',
          personality: 'scared_but_trusting',
          relationships: {},
          dialogue: {
            scared: ['Meow!', 'Mrow...'],
            relieved: ['Purr...', 'Mew~']
          }
        }
      ]
    },
    isUnlocked: true,
    isCompleted: false,
    isAvailable: true,
    attempts: 0,
    tags: ['rescue', 'easy', 'animals', 'stealth'],
    season: 'spring'
  },
  {
    id: 'shadow_investigation',
    name: 'Strange Shadows',
    description: 'Mysterious shadows have been appearing around the school. Investigate these supernatural occurrences and discover their source.',
    type: 'Story',
    category: 'Investigation',
    difficulty: 'Normal',
    requirements: [
      {
        type: 'level',
        value: 3,
        description: 'Must be at least level 3'
      },
      {
        type: 'mission_completed',
        value: 'rescue_cat',
        description: 'Must have completed the kitten rescue mission'
      }
    ],
    objectives: [
      {
        id: 'gather_clues',
        name: 'Gather Information',
        description: 'Collect clues about the shadow sightings',
        type: 'collect',
        target: { type: 'item', name: 'shadow_clue', quantity: 3 },
        condition: { type: 'simple', rules: [{ field: 'clues_collected', operator: 'greater', value: 2 }] },
        progress: 0,
        maxProgress: 3,
        isCompleted: false,
        isOptional: false,
        isHidden: false,
        hints: ['Interview witnesses', 'Check affected areas', 'Look for magical residue']
      },
      {
        id: 'track_source',
        name: 'Track the Shadow Source',
        description: 'Follow the trail to find where the shadows originate',
        type: 'reach',
        target: { type: 'location', name: 'shadow_nexus', quantity: 1 },
        condition: { type: 'simple', rules: [{ field: 'clues_analyzed', operator: 'equals', value: true }] },
        progress: 0,
        maxProgress: 1,
        isCompleted: false,
        isOptional: false,
        isHidden: false,
        hints: ['Analyze the collected clues', 'Look for patterns in the sightings']
      },
      {
        id: 'confront_shadows',
        name: 'Confront the Shadow Entity',
        description: 'Face whatever is creating these mysterious shadows',
        type: 'defeat',
        target: { type: 'enemy', name: 'shadow_wraith', quantity: 1 },
        condition: { type: 'simple', rules: [{ field: 'enemy_defeated', operator: 'equals', value: 'shadow_wraith' }] },
        progress: 0,
        maxProgress: 1,
        isCompleted: false,
        isOptional: false,
        isHidden: false,
        hints: ['Light-based attacks are effective', 'Stay confident and focused']
      }
    ],
    rewards: [
      {
        type: 'experience',
        item: 'base_experience',
        quantity: 150,
        rarity: 'Common',
        guaranteed: true,
        probability: 1.0
      },
      {
        type: 'sparkles',
        item: 'sparkles',
        quantity: 75,
        rarity: 'Common',
        guaranteed: true,
        probability: 1.0
      },
      {
        type: 'stardust',
        item: 'stardust',
        quantity: 25,
        rarity: 'Uncommon',
        guaranteed: true,
        probability: 1.0
      },
      {
        type: 'ability',
        item: 'shadow_sight',
        quantity: 1,
        rarity: 'Rare',
        guaranteed: false,
        probability: 0.7
      }
    ],
    penalties: [
      {
        type: 'failure',
        condition: 'shadow_spreads',
        severity: 'moderate',
        effect: { type: 'resource_loss', value: { magicalEnergy: 20 } }
      }
    ],
    timeLimit: 3600, // 1 hour
    location: {
      id: 'magical_academy',
      name: 'Magical Academy',
      description: 'The school where magical girls learn to control their powers',
      type: 'School',
      environment: {
        weather: 'Cloudy',
        timeOfDay: 'Evening',
        lighting: 'Dim',
        temperature: 'Cool',
        visibility: 'Limited',
        magicalIntensity: 7
      },
      hazards: [
        {
          type: 'magical',
          name: 'Shadow Manifestations',
          description: 'Temporary shadow creatures that may appear',
          severity: 'moderate',
          frequency: 'uncommon',
          effects: [{ type: 'status', value: 'fear' }],
          countermeasures: ['Use light magic', 'Stay in well-lit areas']
        }
      ],
      features: [
        {
          type: 'shrine',
          name: 'Purification Circle',
          description: 'A magical circle that cleanses negative energy',
          interactive: true,
          effects: [{ type: 'buff', value: { stat: 'magic', amount: 3 }, duration: 600 }]
        }
      ],
      background: 'school_evening',
      music: 'mysterious_atmosphere'
    },
    story: {
      prologue: {
        id: 'reports',
        title: 'Disturbing Reports',
        text: 'Students have been reporting strange shadow sightings around the academy. These aren\'t ordinary shadows - they move independently and seem to drain the energy from nearby areas.',
        dialogue: [
          {
            speaker: 'Concerned Student',
            text: 'I swear I saw my shadow move on its own yesterday!',
            emotion: 'frightened'
          }
        ]
      },
      chapters: [
        {
          id: 'investigation_begins',
          title: 'The Investigation',
          text: 'As a magical girl, you recognize that this is likely a supernatural threat. You\'ll need to gather evidence and track down the source before it affects more people.',
          dialogue: [
            {
              speaker: 'Academy Guide',
              text: 'We\'re counting on you to solve this mystery. Be careful - shadows can be more dangerous than they appear.',
              emotion: 'serious'
            }
          ]
        }
      ],
      characters: [
        {
          id: 'academy_guide',
          name: 'Professor Luna',
          role: 'informant',
          appearance: 'wise_teacher',
          personality: 'knowledgeable_concerned',
          relationships: {},
          dialogue: {
            serious: ['This situation requires immediate attention.', 'Be very careful with shadow magic.'],
            helpful: ['Here\'s what we know so far...', 'Check the library for more information.']
          }
        }
      ]
    },
    isUnlocked: false,
    isCompleted: false,
    isAvailable: true,
    attempts: 0,
    tags: ['investigation', 'supernatural', 'school', 'combat'],
    season: 'autumn'
  }
];

export const missionTemplates = {
  daily: [
    {
      id: 'daily_training',
      name: 'Daily Training Session',
      type: 'Daily' as MissionType,
      category: 'Training' as MissionCategory,
      difficulty: 'Easy' as Difficulty,
      baseRewards: [
        { type: 'experience' as const, item: 'daily_exp', quantity: 30, rarity: 'Common' as const, guaranteed: true, probability: 1.0 },
        { type: 'sparkles' as const, item: 'sparkles', quantity: 20, rarity: 'Common' as const, guaranteed: true, probability: 1.0 }
      ],
      objectives: [
        {
          type: 'interact' as const,
          weight: 1,
          variations: [
            {
              name: 'Complete Training',
              description: 'Complete any training session',
              target: { type: 'condition', name: 'training_completed', quantity: 1 },
              condition: { type: 'simple', rules: [{ field: 'training_sessions', operator: 'greater', value: 0 }] },
              difficulty: 1,
              rewards: []
            }
          ],
          requirements: []
        }
      ],
      variables: [],
      tags: ['daily', 'training', 'repeatable'],
      weight: 1,
      seasons: ['all'],
      requirements: []
    }
  ],
  weekly: [
    {
      id: 'weekly_challenge',
      name: 'Weekly Challenge',
      type: 'Weekly' as MissionType,
      category: 'Combat' as MissionCategory,
      difficulty: 'Normal' as Difficulty,
      baseRewards: [
        { type: 'experience' as const, item: 'weekly_exp', quantity: 200, rarity: 'Common' as const, guaranteed: true, probability: 1.0 },
        { type: 'sparkles' as const, item: 'sparkles', quantity: 150, rarity: 'Common' as const, guaranteed: true, probability: 1.0 },
        { type: 'stardust' as const, item: 'stardust', quantity: 50, rarity: 'Uncommon' as const, guaranteed: true, probability: 1.0 }
      ],
      objectives: [
        {
          type: 'defeat' as const,
          weight: 1,
          variations: [
            {
              name: 'Weekly Boss Battle',
              description: 'Defeat the weekly challenge boss',
              target: { type: 'enemy', name: 'weekly_boss', quantity: 1 },
              condition: { type: 'simple', rules: [{ field: 'boss_defeated', operator: 'equals', value: true }] },
              difficulty: 3,
              rewards: []
            }
          ],
          requirements: [{ type: 'level', value: 5, description: 'Must be level 5 or higher' }]
        }
      ],
      variables: [],
      tags: ['weekly', 'challenge', 'boss'],
      weight: 1,
      seasons: ['all'],
      requirements: [{ type: 'level', value: 5, description: 'Must be level 5 or higher' }]
    }
  ]
};

export const missionCategories = {
  Combat: {
    name: 'Combat',
    description: 'Direct confrontation with enemies using magical abilities',
    icon: 'sword',
    color: '#FF6B6B'
  },
  Rescue: {
    name: 'Rescue',
    description: 'Save people, animals, or magical creatures in danger',
    icon: 'heart',
    color: '#4ECDC4'
  },
  Investigation: {
    name: 'Investigation',
    description: 'Solve mysteries and uncover hidden supernatural threats',
    icon: 'magnifying-glass',
    color: '#45B7D1'
  },
  Protection: {
    name: 'Protection',
    description: 'Guard important people, places, or objects from harm',
    icon: 'shield',
    color: '#96CEB4'
  },
  Collection: {
    name: 'Collection',
    description: 'Gather magical items, ingredients, or information',
    icon: 'star',
    color: '#FFEAA7'
  },
  Social: {
    name: 'Social',
    description: 'Help with interpersonal problems and community issues',
    icon: 'users',
    color: '#DDA0DD'
  },
  Stealth: {
    name: 'Stealth',
    description: 'Complete objectives without being detected',
    icon: 'eye-slash',
    color: '#74B9FF'
  },
  Puzzle: {
    name: 'Puzzle',
    description: 'Solve complex magical or logical challenges',
    icon: 'puzzle-piece',
    color: '#A29BFE'
  },
  Escort: {
    name: 'Escort',
    description: 'Safely guide someone through dangerous areas',
    icon: 'route',
    color: '#FD79A8'
  },
  Survival: {
    name: 'Survival',
    description: 'Endure harsh conditions or overwhelming odds',
    icon: 'mountain',
    color: '#E17055'
  }
};

export const difficultySettings = {
  Tutorial: {
    name: 'Tutorial',
    description: 'Learn the basics with guided assistance',
    color: '#A8E6CF',
    multipliers: { experience: 0.5, resources: 0.5, difficulty: 0.3 }
  },
  Easy: {
    name: 'Easy',
    description: 'Simple challenges suitable for beginners',
    color: '#88D8A3',
    multipliers: { experience: 0.8, resources: 0.8, difficulty: 0.6 }
  },
  Normal: {
    name: 'Normal',
    description: 'Standard difficulty with balanced challenges',
    color: '#FFF8E1',
    multipliers: { experience: 1.0, resources: 1.0, difficulty: 1.0 }
  },
  Hard: {
    name: 'Hard',
    description: 'Challenging missions requiring skill and strategy',
    color: '#FFD3A5',
    multipliers: { experience: 1.3, resources: 1.2, difficulty: 1.5 }
  },
  Expert: {
    name: 'Expert',
    description: 'Very difficult challenges for experienced magical girls',
    color: '#FF9AA2',
    multipliers: { experience: 1.6, resources: 1.4, difficulty: 2.0 }
  },
  Master: {
    name: 'Master',
    description: 'Extreme challenges that test your limits',
    color: '#B5A7B4',
    multipliers: { experience: 2.0, resources: 1.6, difficulty: 2.5 }
  },
  Nightmare: {
    name: 'Nightmare',
    description: 'Nearly impossible missions for true masters',
    color: '#A8A8A8',
    multipliers: { experience: 2.5, resources: 1.8, difficulty: 3.0 }
  },
  Impossible: {
    name: 'Impossible',
    description: 'The ultimate test of magical girl prowess',
    color: '#8B8B8B',
    multipliers: { experience: 3.0, resources: 2.0, difficulty: 4.0 }
  }
};
