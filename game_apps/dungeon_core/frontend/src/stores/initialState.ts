import type { GameState, DungeonFloor, Room } from '../types/game';

export const createInitialFloor = (): DungeonFloor => {
  const entranceRoom: Room = {
    id: Date.now(),
    type: 'entrance',
    position: 0,
    floorNumber: 1,
    monsters: [],
    roomUpgrade: null,
    explored: false,
    loot: 0
  };

  const coreRoom: Room = {
    id: Date.now() + 1,
    type: 'core',
    position: 1,
    floorNumber: 1,
    monsters: [],
    roomUpgrade: null,
    explored: false,
    loot: 0
  };

  return {
    id: Date.now(),
    number: 1,
    rooms: [entranceRoom, coreRoom],
    isDeepest: true
  };
};

export const initialState: GameState = {
  mana: 50,
  maxMana: 100,
  manaRegen: 1,
  gold: 100,
  souls: 0,
  day: 1,
  hour: 6, // Start at 6 AM
  status: 'Open',
  speed: 1,
  selectedRoom: null,
  selectedMonster: null,
  log: [
    { message: "Welcome to Dungeon Core Simulator v1.2!", type: "system", timestamp: Date.now() },
    { message: "Your dungeon starts with an entrance and core room. Add more rooms to expand!", type: "system", timestamp: Date.now() },
  ],
  modalOpen: true,
  dungeonLevel: 1,
  adventurerParties: [],
  nextPartySpawn: 8, // First party spawns at 8 AM
  totalFloors: 1,
  deepCoreBonus: 0,
  unlockedMonsterSpecies: ["Mimetic"], // Start with Mimetic unlocked
  monsterExperience: {}, // { "MonsterName": experience_points }
};