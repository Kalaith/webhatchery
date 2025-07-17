// API Response Types
export interface GameStateResponse {
  game: {
    id: number;
    mana: number;
    maxMana: number;
    gold: number;
    souls: number;
    day: number;
    hour: number;
    status: string;
  };
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
  roomId: number;
  monsterType: string;
  cost: number;
}

export interface PlaceMonsterResponse {
  success: boolean;
  error?: string;
  monster?: {
    id: number;
    type: string;
    hp: number;
  };
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
    gold: number;
    souls: number;
    day: number;
    hour: number;
    status: string;
  };
  initialData: {
    unlockedMonsterSpecies: string[];
    totalFloors: number;
    deepCoreBonus: number;
    log: Array<{
      message: string;
      type: string;
      timestamp: number;
    }>;
  };
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