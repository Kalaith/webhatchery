// API Response Types
export interface GameStateResponse {
  game: {
    id: number;
    mana: number;
    maxMana: number;
    manaRegen: number;
    gold: number;
    souls: number;
    day: number;
    hour: number;
    status: string;
  };
  floors?: Array<{
    id: number;
    number: number;
    rooms: Array<{
      id: number;
      type: 'entrance' | 'normal' | 'boss' | 'core';
      position: number;
      floorNumber: number;
      monsters: any[];
      roomUpgrade: null;
      explored: boolean;
      loot: number;
    }>;
    isDeepest: boolean;
  }>;
  monsters: Array<{
    id: number;
    roomId: number;
    type: string;
    hp: number;
    maxHp: number;
    alive: boolean;
    isBoss: boolean;
  }>;
}

export interface PlaceMonsterRequest {
  floorNumber: number;
  roomPosition: number;
  monsterType: string;
}

export interface PlaceMonsterResponse {
  success: boolean;
  error?: string;
  monster?: {
    id: number;
    type: string;
    hp: number;
    maxHp: number;
    isBoss: boolean;
    scaledStats: {
      hp: number;
      attack: number;
      defense: number;
    };
  };
  costPaid?: number;
  remainingMana?: number;
}

export interface UnlockMonsterSpeciesRequest {
  speciesName: string;
}

export interface UnlockMonsterSpeciesResponse {
  success: boolean;
  error?: string;
  speciesName?: string;
  costPaid?: number;
  remainingGold?: number;
  required?: number;
}

export interface GainMonsterExperienceRequest {
  monsterName: string;
  experience: number;
}

export interface GainMonsterExperienceResponse {
  success: boolean;
  error?: string;
  monsterName?: string;
  previousExp?: number;
  newExp?: number;
  expGained?: number;
  tierUnlocks?: Array<{
    species: string;
    tier: number;
  }>;
}

export interface GetAvailableMonstersResponse {
  success: boolean;
  error?: string;
  monsters?: Array<{
    name: string;
    hp: number;
    attack: number;
    defense: number;
    tier: number;
  }>;
}

export interface AddRoomRequest {
  floorNumber: number;
  roomType: string;
  position: number;
  cost: number;
}

export interface AddRoomResponse {
  success: boolean;
  error?: string;
  roomId?: number;
  type?: string;
  position?: number;
}

export interface InitializeGameResponse {
  game: {
    id: number;
    mana: number;
    maxMana: number;
    manaRegen: number;
    gold: number;
    souls: number;
    day: number;
    hour: number;
    status: string;
    speed: number;
    selectedRoom: null;
    selectedMonster: null;
    modalOpen: boolean;
    dungeonLevel: number;
    adventurerParties: any[];
    nextPartySpawn: number;
    totalFloors: number;
    deepCoreBonus: number;
    unlockedMonsterSpecies: string[];
    monsterExperience: any[];
    log: Array<{
      message: string;
      type: string;
      timestamp: number;
    }>;
  };
  floors: Array<{
    id: number;
    number: number;
    rooms: Array<{
      id: number;
      type: 'entrance' | 'normal' | 'boss' | 'core';
      position: number;
      floorNumber: number;
      monsters: any[];
      roomUpgrade: null;
      explored: boolean;
      loot: number;
    }>;
    isDeepest: boolean;
  }>;
  monsters: Array<{
    id: number;
    roomId: number;
    type: string;
    hp: number;
    maxHp: number;
    alive: boolean;
    isBoss: boolean;
  }>;
}