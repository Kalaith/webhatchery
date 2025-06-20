// Game types for Dungeon Core Simulator v1.2 - Floor-based system

export interface LogEntry {
  message: string;
  type: 'system' | 'combat' | 'economic' | 'adventurer';
  timestamp?: number;
}

export interface GameState {
  mana: number;
  maxMana: number;
  manaRegen: number;
  gold: number;
  souls: number;
  day: number;
  hour: number; // 0-23 hour format
  status: 'Open' | 'Closed' | 'Maintenance';
  speed: number;
  selectedRoom: number | null;
  selectedMonster: number | null;
  log: LogEntry[];
  modalOpen: boolean;
  dungeonLevel: number;
  adventurerParties: AdventurerParty[];
  nextPartySpawn: number; // Hour when next party will spawn
  totalFloors: number;
  deepCoreBonus: number; // Percentage mana regen bonus
}

export interface DungeonFloor {
  id: number;
  number: number; // Floor number (1, 2, 3, etc.)
  rooms: Room[];
  isDeepest: boolean;
}

export interface Room {
  id: number;
  type: 'entrance' | 'normal' | 'boss' | 'core';
  position: number; // Position in the floor (0 = entrance, 1-4 = normal/boss, 5 = core)
  floorNumber: number;
  monsters: Monster[];
  roomUpgrade: RoomUpgrade | null;
  explored: boolean;
  loot: number;
}

export interface RoomUpgrade {
  type: 'trap' | 'treasure' | 'reinforcement' | 'evolution';
  name: string;
  effect: string;
  multiplier: number;
}

export interface Monster {
  id: number;
  type: number; // Index into monsterTypes
  hp: number;
  maxHp: number;
  alive: boolean;
  lastRespawn?: number;
  isBoss: boolean;
  floorNumber: number;
  scaledStats: {
    hp: number;
    attack: number;
    defense: number;
  };
}

export interface Adventurer {
  id: number;
  classIdx: number;
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  alive: boolean;
  experience: number;
  gold: number;
  equipment: Equipment;
  conditions: string[]; // Status effects
  scaledStats: {
    hp: number;
    attack: number;
    defense: number;
  };
}

export interface AdventurerParty {
  id: number;
  members: Adventurer[];
  currentFloor: number;
  currentRoom: number;
  retreating: boolean;
  casualties: number;
  loot: number;
  entryTime: number;
  targetFloor: number; // How deep they plan to go
}

export interface Equipment {
  weapon: string;
  armor: string;
  accessory: string;
}

export interface RoomType {
  name: string;
  cost: number;
  description: string;
  color: string;
  spawnCostReduction: number;
  special?: string; // Special property
}

export interface MonsterType {
  name: string;
  baseCost: number;
  hp: number;
  attack: number;
  defense: number;
  color: string;
  description: string;
  special?: string;
  bossAbility?: string; // Special ability when in boss room
}

export interface AdventurerClass {
  name: string;
  hp: number;
  attack: number;
  defense: number;
  color: string;
  special?: string;
}

export interface FloorScaling {
  manaCostMultiplier: number;
  monsterBoostPercentage: number;
  adventurerLevelRange: [number, number];
}
