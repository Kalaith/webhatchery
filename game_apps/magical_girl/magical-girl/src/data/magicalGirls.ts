// Initial magical girls data for the game
import type { MagicalGirl, MagicalElement, Rarity, Specialization } from '../types';

export const initialMagicalGirls: MagicalGirl[] = [
  {
    id: 'sakura',
    name: 'Sakura Moonlight',
    element: 'Light',
    rarity: 'Common',
    level: 1,
    experience: 0,
    experienceToNext: 100,
    stats: {
      power: 12,
      defense: 8,
      speed: 10,
      magic: 15,
      wisdom: 9,
      charm: 13,
      courage: 11,
      luck: 7,
      endurance: 8,
      focus: 10
    },
    abilities: [
      {
        id: 'healing_light',
        name: 'Healing Light',
        description: 'Restores health to self or ally with warm, gentle light',
        type: 'Heal',
        element: 'Light',
        cost: { magicalEnergy: 15 },
        effects: [
          {
            type: 'heal',
            target: 'ally',
            magnitude: 25,
            duration: 0,
            probability: 1.0
          }
        ],
        cooldown: 3,
        currentCooldown: 0,
        level: 1,
        maxLevel: 5,
        requirements: [],
        tags: ['support', 'instant'],
        isActive: true,
        isPassive: false,
        isUltimate: false
      }
    ],
    equipment: {},
    transformation: {
      id: 'moonlight_guardian',
      name: 'Moonlight Guardian',
      level: 1,
      maxLevel: 10,
      isUnlocked: true,
      requirements: [],
      forms: [
        {
          id: 'basic_form',
          name: 'Basic Moonlight Form',
          description: 'Sakura\'s initial transformation, glowing with soft moonlight',
          appearance: {
            hair: { style: 'long_flowing', color: 'silver', length: 'waist', texture: 'silky' },
            eyes: { shape: 'large', color: 'blue', expression: 'determined' },
            outfit: { 
              base: 'sailor_dress', 
              colors: ['white', 'silver', 'light_blue'], 
              pattern: 'moon_crescents',
              accessories: ['moon_tiara', 'silver_boots'] 
            },
            accessories: [
              { type: 'tiara', position: 'head', color: 'silver', special: true }
            ],
            pose: 'confident',
            background: 'moonlit_sky',
            effects: [
              { type: 'glow', intensity: 0.7, color: 'silver', duration: -1, animation: 'pulse' }
            ]
          },
          statMultipliers: { magic: 1.2, wisdom: 1.1 },
          abilities: ['moonbeam_blast'],
          cost: 20,
          duration: 300,
          cooldown: 60,
          requirements: []
        }
      ],
      currentForm: 0,
      experience: 0,
      experienceToNext: 50,
      mastery: { level: 1, experience: 0, bonuses: [] }
    },
    personality: {
      traits: [
        { name: 'Kind', value: 85, description: 'Naturally caring and compassionate', effects: [] },
        { name: 'Determined', value: 70, description: 'Strong-willed and persistent', effects: [] },
        { name: 'Shy', value: 60, description: 'Reserved around strangers', effects: [] }
      ],
      mood: 'Calm',
      relationships: [],
      preferences: {
        favoriteActivity: 'Training',
        favoriteMission: 'Rescue',
        favoriteTime: 'Evening',
        favoriteLocation: 'School',
        specialInterests: ['reading', 'gardening', 'astronomy']
      },
      dialogues: {
        greetings: [
          'Good morning! Ready for a new day of training?',
          'Hello! The moon\'s energy feels strong today.',
          'I hope we can help many people today!'
        ],
        training: [
          'I feel my power growing stronger!',
          'This training is challenging, but I won\'t give up!',
          'I can sense the moonlight guiding me.'
        ],
        missions: [
          'Let\'s do our best to protect everyone!',
          'I won\'t let anyone get hurt!',
          'Together, we can overcome any challenge!'
        ],
        idle: [
          'I wonder what adventures await us...',
          'The stars are so beautiful tonight.',
          'I hope everyone is safe and happy.'
        ],
        levelUp: [
          'I feel the moon\'s blessing growing stronger!',
          'This new power... I\'ll use it to help others!',
          'Thank you for believing in me!'
        ],
        transformation: [
          'By the power of the moonlight, transform!',
          'Moonlight Guardian, awaken!',
          'Silver light, guide my way!'
        ],
        victory: [
          'We did it! Everyone is safe!',
          'The moonlight protected us all.',
          'I\'m so glad we could help!'
        ],
        defeat: [
          'I... I need to get stronger...',
          'I\'m sorry I couldn\'t protect everyone.',
          'Next time, I\'ll be ready!'
        ],
        special: []
      }
    },
    backstory: 'A gentle student who discovered her magical powers during a lunar eclipse. She fights to protect the innocent and bring light to dark places.',
    avatar: {
      base: {
        hair: { style: 'shoulder_length', color: 'brown', length: 'shoulder', texture: 'straight' },
        eyes: { shape: 'round', color: 'brown', expression: 'kind' },
        outfit: { 
          base: 'school_uniform', 
          colors: ['navy', 'white'], 
          pattern: 'plain',
          accessories: ['hair_ribbon'] 
        },
        accessories: [
          { type: 'ribbon', position: 'hair', color: 'blue', special: false }
        ],
        pose: 'friendly',
        background: 'classroom',
        effects: []
      },
      expressions: {
        happy: {
          hair: { style: 'shoulder_length', color: 'brown', length: 'shoulder', texture: 'straight' },
          eyes: { shape: 'round', color: 'brown', expression: 'joyful' },
          outfit: { 
            base: 'school_uniform', 
            colors: ['navy', 'white'], 
            pattern: 'plain',
            accessories: ['hair_ribbon'] 
          },
          accessories: [
            { type: 'ribbon', position: 'hair', color: 'blue', special: false }
          ],
          pose: 'cheerful',
          background: 'classroom',
          effects: []
        }
      },
      outfits: {
        casual: {
          hair: { style: 'shoulder_length', color: 'brown', length: 'shoulder', texture: 'straight' },
          eyes: { shape: 'round', color: 'brown', expression: 'relaxed' },
          outfit: { 
            base: 'casual_dress', 
            colors: ['light_blue', 'white'], 
            pattern: 'floral',
            accessories: ['cardigan'] 
          },
          accessories: [],
          pose: 'casual',
          background: 'park',
          effects: []
        }
      },
      accessories: {},
      current: {
        expression: 'kind',
        outfit: 'default',
        accessories: [],
        pose: 'friendly',
        effects: []
      }
    },
    isUnlocked: true,
    unlockedAt: Date.now(),
    favoriteLevel: 50,
    totalMissionsCompleted: 0,
    specialization: 'Healing',
    bondLevel: 1,
    bondExperience: 0
  },
  {
    id: 'akira',
    name: 'Akira Stormwind',
    element: 'Lightning',
    rarity: 'Uncommon',
    level: 1,
    experience: 0,
    experienceToNext: 100,
    stats: {
      power: 16,
      defense: 7,
      speed: 18,
      magic: 12,
      wisdom: 8,
      charm: 9,
      courage: 15,
      luck: 11,
      endurance: 10,
      focus: 12
    },
    abilities: [
      {
        id: 'lightning_strike',
        name: 'Lightning Strike',
        description: 'A quick electrical attack that can paralyze enemies',
        type: 'Attack',
        element: 'Lightning',
        cost: { magicalEnergy: 18 },
        effects: [
          {
            type: 'damage',
            target: 'enemy',
            magnitude: 30,
            duration: 0,
            probability: 1.0
          },
          {
            type: 'status_effect',
            target: 'enemy',
            magnitude: 1,
            duration: 2,
            probability: 0.3
          }
        ],
        cooldown: 2,
        currentCooldown: 0,
        level: 1,
        maxLevel: 5,
        requirements: [],
        tags: ['offensive', 'elemental'],
        isActive: true,
        isPassive: false,
        isUltimate: false
      }
    ],
    equipment: {},
    transformation: {
      id: 'storm_rider',
      name: 'Storm Rider',
      level: 1,
      maxLevel: 10,
      isUnlocked: true,
      requirements: [],
      forms: [
        {
          id: 'basic_form',
          name: 'Basic Storm Form',
          description: 'Akira channels the power of lightning and wind',
          appearance: {
            hair: { style: 'spiky_short', color: 'electric_blue', length: 'short', texture: 'wild' },
            eyes: { shape: 'sharp', color: 'yellow', expression: 'fierce' },
            outfit: { 
              base: 'combat_suit', 
              colors: ['black', 'electric_blue', 'yellow'], 
              pattern: 'lightning_bolts',
              accessories: ['storm_gauntlets', 'speed_boots'] 
            },
            accessories: [
              { type: 'gauntlets', position: 'hands', color: 'electric_blue', special: true }
            ],
            pose: 'dynamic',
            background: 'stormy_sky',
            effects: [
              { type: 'electricity', intensity: 0.8, color: 'electric_blue', duration: -1, animation: 'crackling' }
            ]
          },
          statMultipliers: { speed: 1.3, power: 1.2 },
          abilities: ['thunder_dash'],
          cost: 25,
          duration: 300,
          cooldown: 60,
          requirements: []
        }
      ],
      currentForm: 0,
      experience: 0,
      experienceToNext: 50,
      mastery: { level: 1, experience: 0, bonuses: [] }
    },
    personality: {
      traits: [
        { name: 'Confident', value: 90, description: 'Self-assured and bold', effects: [] },
        { name: 'Competitive', value: 80, description: 'Loves challenges and rivalry', effects: [] },
        { name: 'Impatient', value: 65, description: 'Wants quick results', effects: [] }
      ],
      mood: 'Excited',
      relationships: [],
      preferences: {
        favoriteActivity: 'Training',
        favoriteMission: 'Combat',
        favoriteTime: 'Afternoon',
        favoriteLocation: 'City',
        specialInterests: ['sports', 'racing', 'martial_arts']
      },
      dialogues: {
        greetings: [
          'Hey! Ready to show them what we\'re made of?',
          'Another day, another chance to prove ourselves!',
          'Let\'s get moving! I\'m charged up and ready!'
        ],
        training: [
          'Is that all you\'ve got? I can go faster!',
          'Feel that electricity? I\'m getting stronger!',
          'No holding back! Push it to the limit!'
        ],
        missions: [
          'Finally! Let\'s see some real action!',
          'Time to light things up!',
          'They won\'t know what hit them!'
        ],
        idle: [
          'Come on, let\'s do something exciting!',
          'I can feel the storm building inside me...',
          'When\'s the next challenge coming?'
        ],
        levelUp: [
          'Yes! I knew I could get stronger!',
          'The lightning flows through me even more now!',
          'This power... it\'s incredible!'
        ],
        transformation: [
          'Lightning speed, activate!',
          'Storm Rider, charge up!',
          'Feel the power of the storm!'
        ],
        victory: [
          'Ha! That was lightning fast!',
          'Did you see that speed?',
          'Too easy! Next challenge!'
        ],
        defeat: [
          'Damn! I need to be faster next time!',
          'This isn\'t over! I\'ll come back stronger!',
          'I underestimated them... won\'t happen again!'
        ],
        special: []
      }
    },
    backstory: 'A spirited athlete who gained lightning powers during a thunderstorm. She uses her incredible speed and electrical abilities to fight for justice.',
    avatar: {
      base: {
        hair: { style: 'short_spiky', color: 'blonde', length: 'short', texture: 'spiky' },
        eyes: { shape: 'determined', color: 'green', expression: 'confident' },
        outfit: { 
          base: 'athletic_wear', 
          colors: ['blue', 'white'], 
          pattern: 'stripes',
          accessories: ['headband'] 
        },
        accessories: [
          { type: 'headband', position: 'head', color: 'blue', special: false }
        ],
        pose: 'dynamic',
        background: 'sports_field',
        effects: []
      },
      expressions: {
        excited: {
          hair: { style: 'short_spiky', color: 'blonde', length: 'short', texture: 'spiky' },
          eyes: { shape: 'determined', color: 'green', expression: 'excited' },
          outfit: { 
            base: 'athletic_wear', 
            colors: ['blue', 'white'], 
            pattern: 'stripes',
            accessories: ['headband'] 
          },
          accessories: [
            { type: 'headband', position: 'head', color: 'blue', special: false }
          ],
          pose: 'energetic',
          background: 'sports_field',
          effects: []
        }
      },
      outfits: {},
      accessories: {},
      current: {
        expression: 'confident',
        outfit: 'default',
        accessories: [],
        pose: 'dynamic',
        effects: []
      }
    },
    isUnlocked: false,
    favoriteLevel: 0,
    totalMissionsCompleted: 0,
    specialization: 'Speed',
    bondLevel: 1,
    bondExperience: 0
  }
];

export const magicalElements: { [key in MagicalElement]: { name: string; color: string; description: string } } = {
  Light: {
    name: 'Light',
    color: '#FFD700',
    description: 'The element of hope, healing, and purification. Strong against Darkness.'
  },
  Darkness: {
    name: 'Darkness',
    color: '#4B0082',
    description: 'The element of mystery, shadows, and transformation. Strong against Light.'
  },
  Fire: {
    name: 'Fire',
    color: '#FF4500',
    description: 'The element of passion, destruction, and rebirth. Strong against Ice and Nature.'
  },
  Water: {
    name: 'Water',
    color: '#1E90FF',
    description: 'The element of flow, adaptation, and cleansing. Strong against Fire.'
  },
  Earth: {
    name: 'Earth',
    color: '#8B4513',
    description: 'The element of stability, growth, and endurance. Strong against Lightning.'
  },
  Air: {
    name: 'Air',
    color: '#87CEEB',
    description: 'The element of freedom, speed, and change. Strong against Earth.'
  },
  Ice: {
    name: 'Ice',
    color: '#B0E0E6',
    description: 'The element of preservation, clarity, and control. Strong against Water.'
  },
  Lightning: {
    name: 'Lightning',
    color: '#FFD700',
    description: 'The element of power, speed, and energy. Strong against Air and Water.'
  },
  Nature: {
    name: 'Nature',
    color: '#228B22',
    description: 'The element of life, growth, and harmony. Strong against Earth and Water.'
  },
  Celestial: {
    name: 'Celestial',
    color: '#DDA0DD',
    description: 'The element of cosmic power, fate, and divine energy. Balanced against all.'
  },
  Void: {
    name: 'Void',
    color: '#2F2F2F',
    description: 'The element of nothingness, erasure, and infinite possibility. Chaotic against all.'
  },
  Crystal: {
    name: 'Crystal',
    color: '#FF69B4',
    description: 'The element of focus, amplification, and purity. Enhances other elements.'
  }
};

export const rarityInfo: { [key in Rarity]: { name: string; color: string; probability: number } } = {
  Common: {
    name: 'Common',
    color: '#FFFFFF',
    probability: 0.6
  },
  Uncommon: {
    name: 'Uncommon',
    color: '#00FF00',
    probability: 0.25
  },
  Rare: {
    name: 'Rare',
    color: '#0080FF',
    probability: 0.1
  },
  Epic: {
    name: 'Epic',
    color: '#8000FF',
    probability: 0.04
  },
  Legendary: {
    name: 'Legendary',
    color: '#FF8000',
    probability: 0.009
  },
  Mythical: {
    name: 'Mythical',
    color: '#FF0080',
    probability: 0.001
  }
};

export const specializationInfo: { [key in Specialization]: { name: string; description: string; bonuses: string[] } } = {
  Combat: {
    name: 'Combat',
    description: 'Excels in direct confrontation and offensive abilities',
    bonuses: ['Power +20%', 'Courage +15%', 'Attack abilities cost -10%']
  },
  Healing: {
    name: 'Healing',
    description: 'Specializes in restoration and support magic',
    bonuses: ['Wisdom +20%', 'Charm +15%', 'Healing abilities +50% effectiveness']
  },
  Support: {
    name: 'Support',
    description: 'Enhances team performance and provides utility',
    bonuses: ['Charm +20%', 'Focus +15%', 'Buff abilities last +50% longer']
  },
  Magic: {
    name: 'Magic',
    description: 'Masters pure magical energy and elemental forces',
    bonuses: ['Magic +25%', 'Focus +20%', 'Magical Energy regeneration +30%']
  },
  Defense: {
    name: 'Defense',
    description: 'Protects allies and withstands enemy attacks',
    bonuses: ['Defense +25%', 'Endurance +20%', 'Shield abilities +100% effectiveness']
  },
  Speed: {
    name: 'Speed',
    description: 'Utilizes incredible speed and agility in combat',
    bonuses: ['Speed +25%', 'Luck +15%', 'Dodge chance +20%']
  },
  Balanced: {
    name: 'Balanced',
    description: 'Well-rounded abilities suitable for any situation',
    bonuses: ['All stats +10%', 'Experience gain +15%', 'Versatility bonus']
  }
};
