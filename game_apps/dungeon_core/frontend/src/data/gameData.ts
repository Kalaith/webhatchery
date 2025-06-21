// Room and Monster data for Dungeon Core Simulator v1.2 - Floor-based system
import type { MonsterType, AdventurerClass, FloorScaling } from '../types/game';

export const roomUpgrades = [
  { 
    type: 'trap' as const, 
    name: "Spike Trap", 
    effect: "Deals damage to all adventurers", 
    multiplier: 1.5 
  },
  { 
    type: 'treasure' as const, 
    name: "Treasure Cache", 
    effect: "Increases loot rewards", 
    multiplier: 2.0 
  },
  { 
    type: 'reinforcement' as const, 
    name: "Fortified Walls", 
    effect: "Monsters gain +25% defense", 
    multiplier: 1.25 
  },
  { 
    type: 'evolution' as const, 
    name: "Evolution Chamber", 
    effect: "Monsters gain +50% all stats", 
    multiplier: 1.5 
  }
];

export const monsterTypes: MonsterType[] = [
  { 
    name: "Goblin", 
    baseCost: 5, 
    hp: 15, 
    attack: 3, 
    defense: 1, 
    color: "#228B22", 
    description: "Weak but cheap basic monster",
    special: "swarm",
    bossAbility: "Summons 2 additional goblins"
  },
  { 
    name: "Orc", 
    baseCost: 10, 
    hp: 25, 
    attack: 5, 
    defense: 2, 
    color: "#8B4513", 
    description: "Balanced fighter with decent stats",
    special: "none",
    bossAbility: "Berserker rage - double attack for 3 rounds"
  },
  { 
    name: "Skeleton", 
    baseCost: 8, 
    hp: 20, 
    attack: 4, 
    defense: 3, 
    color: "#F5F5DC", 
    description: "Durable undead warrior",
    special: "undead",
    bossAbility: "Reassembles once when defeated"
  },
  { 
    name: "Troll", 
    baseCost: 20, 
    hp: 40, 
    attack: 7, 
    defense: 3, 
    color: "#556B2F", 
    description: "Powerful tank monster",
    special: "regeneration",
    bossAbility: "Regenerates 10 HP per round"
  },
  { 
    name: "Dragon", 
    baseCost: 50, 
    hp: 80, 
    attack: 12, 
    defense: 5, 
    color: "#DC143C", 
    description: "Legendary boss monster",
    special: "boss",
    bossAbility: "Fire breath hits entire party"
  }
];

export const adventurerClasses: AdventurerClass[] = [
  { 
    name: "Warrior", 
    hp: 30, 
    attack: 6, 
    defense: 4, 
    color: "#CD853F",
    special: "tank"
  },
  { 
    name: "Mage", 
    hp: 20, 
    attack: 8, 
    defense: 2, 
    color: "#4169E1",
    special: "magic"
  },
  { 
    name: "Archer", 
    hp: 25, 
    attack: 7, 
    defense: 3, 
    color: "#228B22",
    special: "ranged"
  },
  { 
    name: "Rogue", 
    hp: 22, 
    attack: 8, 
    defense: 2, 
    color: "#8B008B",
    special: "stealth"
  }
];

// Floor scaling system from the battle system document
export const FLOOR_SCALING: FloorScaling[] = [
  { manaCostMultiplier: 1.0, monsterBoostPercentage: 0, adventurerLevelRange: [1, 3] }, // Floor 1
  { manaCostMultiplier: 1.5, monsterBoostPercentage: 30, adventurerLevelRange: [3, 5] }, // Floor 2
  { manaCostMultiplier: 2.2, monsterBoostPercentage: 60, adventurerLevelRange: [5, 7] }, // Floor 3
  { manaCostMultiplier: 3.0, monsterBoostPercentage: 100, adventurerLevelRange: [7, 10] }, // Floor 4
];

// For floors 5+ each additional floor adds these values
export const DEEP_FLOOR_SCALING = {
  manaCostMultiplierIncrease: 1.0,
  monsterBoostPercentageIncrease: 50,
  adventurerLevelIncrease: 2
};

// Equipment and loot tables
export const equipment = {
  weapons: ["Rusty Sword", "Iron Blade", "Steel Sword", "Magic Blade", "Dragon Slayer"],
  armor: ["Cloth Robe", "Leather Armor", "Chain Mail", "Plate Armor", "Dragon Scale"],
  accessories: ["Worn Ring", "Silver Ring", "Magic Amulet", "Ring of Power", "Legendary Talisman"]
};

// Game constants
export const GAME_CONSTANTS = {
  MAX_ROOMS_PER_FLOOR: 5,
  MAX_LOG_ENTRIES: 50,
  BASE_ROOM_COST: 20, // Base mana cost to add a room
  BOSS_ROOM_EXTRA_COST: 30, // Additional cost for boss rooms  MANA_REGEN_INTERVAL: 1000, // milliseconds
  TIME_ADVANCE_INTERVAL: 5000, // 5 seconds = 1 hour in game
  ADVENTURER_SPAWN_CHANCE: 0.05, // 5% chance per hour during open hours (further reduced to prevent overlapping parties)
  MAX_PARTY_SIZE: 4,
  MIN_PARTY_SIZE: 2,
  RETREAT_THRESHOLD: 0.5, // Retreat if 50%+ casualties
  BOSS_ROOM_LOOT_MULTIPLIER: 3.0,
  BOSS_STAT_MULTIPLIER: 1.5, // +50% stats for boss monsters
  BOSS_ROOM_COST_MULTIPLIER: 2.0, // 2x mana cost in boss rooms
  CORE_ROOM_MANA_BONUS: 0.05, // +5% mana regen per floor
  LEVEL_SCALING_FORMULA: 0.3, // base × (1 + floor_number × 0.3)
  RETREAT_CHANCE_UNDERLEVELED: 0.25, // 25% chance to retreat if underleveled
} as const;

// Calculate floor scaling for floors 5+
export const getFloorScaling = (floorNumber: number): FloorScaling => {
  if (floorNumber <= 4) {
    return FLOOR_SCALING[floorNumber - 1];
  }
  
  const additionalFloors = floorNumber - 4;
  const baseScaling = FLOOR_SCALING[3]; // Floor 4 as base
  
  return {
    manaCostMultiplier: baseScaling.manaCostMultiplier + (additionalFloors * DEEP_FLOOR_SCALING.manaCostMultiplierIncrease),
    monsterBoostPercentage: baseScaling.monsterBoostPercentage + (additionalFloors * DEEP_FLOOR_SCALING.monsterBoostPercentageIncrease),
    adventurerLevelRange: [
      baseScaling.adventurerLevelRange[0] + (additionalFloors * DEEP_FLOOR_SCALING.adventurerLevelIncrease),
      baseScaling.adventurerLevelRange[1] + (additionalFloors * DEEP_FLOOR_SCALING.adventurerLevelIncrease)
    ]
  };
};

// Calculate scaled monster stats
export const getScaledMonsterStats = (baseStats: { hp: number, attack: number, defense: number }, floorNumber: number, isBoss: boolean = false) => {
  const scaling = getFloorScaling(floorNumber);
  const floorMultiplier = 1 + (scaling.monsterBoostPercentage / 100);
  const bossMultiplier = isBoss ? GAME_CONSTANTS.BOSS_STAT_MULTIPLIER : 1;
  
  return {
    hp: Math.floor(baseStats.hp * floorMultiplier * bossMultiplier),
    attack: Math.floor(baseStats.attack * floorMultiplier * bossMultiplier),
    defense: Math.floor(baseStats.defense * floorMultiplier * bossMultiplier)
  };
};

// Calculate mana cost for monsters
export const getMonsterManaCost = (baseCost: number, floorNumber: number, isBossRoom: boolean = false) => {
  const scaling = getFloorScaling(floorNumber);
  const floorMultiplier = scaling.manaCostMultiplier;
  const bossMultiplier = isBossRoom ? GAME_CONSTANTS.BOSS_ROOM_COST_MULTIPLIER : 1;
  
  return Math.floor(baseCost * floorMultiplier * bossMultiplier);
};

// Calculate room cost based on total room count (linear scaling, rounded to nearest 5)
export const getRoomCost = (totalRoomCount: number, roomType: 'normal' | 'boss'): number => {
  let baseCost = GAME_CONSTANTS.BASE_ROOM_COST;
  
  // Linear scaling: +5 mana per room built so far
  const linearIncrease = totalRoomCount * 5;
  let totalCost = baseCost + linearIncrease;
  
  // Boss rooms cost more
  if (roomType === 'boss') {
    totalCost += GAME_CONSTANTS.BOSS_ROOM_EXTRA_COST;
  }
  
  // Round to nearest 5
  const roundedCost = Math.round(totalCost / 5) * 5;
  
  return Math.max(5, roundedCost); // Minimum cost of 5
};
