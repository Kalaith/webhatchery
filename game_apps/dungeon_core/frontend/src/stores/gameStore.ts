import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, DungeonFloor, Room, LogEntry, AdventurerParty, Monster } from '../types/game';
import { monsterTypes, GAME_CONSTANTS, getMonsterManaCost, getScaledMonsterStats, getRoomCost } from '../data/gameData';

interface GameStore extends GameState {
  floors: DungeonFloor[];
  setFloors: (floors: DungeonFloor[]) => void;
  addRoom: (floorNumber?: number) => boolean;
  selectRoom: (roomIndex: number | null) => void;
  selectMonster: (monsterIndex: number | null) => void;
  addLog: (entry: LogEntry) => void;
  spendMana: (amount: number) => boolean;
  spendGold: (amount: number) => boolean;
  gainGold: (amount: number) => void;
  gainSouls: (amount: number) => void;
  placeMonster: (floorNumber: number, roomPosition: number, monsterType: number) => boolean;
  advanceTime: () => void;
  setStatus: (status: 'Open' | 'Closing' | 'Closed' | 'Maintenance') => void;
  setSpeed: (speed: number) => void;
  closeModal: () => void;
  addAdventurerParty: (party: AdventurerParty) => void;
  updateAdventurerParty: (partyId: number, updates: Partial<AdventurerParty>) => void;
  removeAdventurerParty: (partyId: number) => void;
  respawnMonsters: () => void;
  createNewFloor: () => DungeonFloor;  updateDeepCoreBonus: () => void;
  resetGame: () => void;
  ensureCoreRoom: () => void;
}

const createInitialFloor = (): DungeonFloor => {
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

const initialState: GameState = {
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
  selectedMonster: null,  log: [
    { message: "Welcome to Dungeon Core Simulator v1.2!", type: "system", timestamp: Date.now() },
    { message: "Your dungeon starts with an entrance and core room. Add more rooms to expand!", type: "system", timestamp: Date.now() },
  ],
  modalOpen: true,
  dungeonLevel: 1,
  adventurerParties: [],
  nextPartySpawn: 8, // First party spawns at 8 AM
  totalFloors: 1,
  deepCoreBonus: 0,
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      floors: [createInitialFloor()],

      setFloors: (floors) => set({ floors }),

      createNewFloor: () => {
        const state = get();
        const newFloorNumber = state.totalFloors + 1;
        
        const entranceRoom: Room = {
          id: Date.now(),
          type: 'entrance',
          position: 0,
          floorNumber: newFloorNumber,
          monsters: [],
          roomUpgrade: null,
          explored: false,
          loot: 0
        };

        const newFloor: DungeonFloor = {
          id: Date.now() + 1,
          number: newFloorNumber,
          rooms: [entranceRoom],
          isDeepest: true
        };

        return newFloor;
      },

      addRoom: (targetFloorNumber?: number) => {
        const state = get();
        let targetFloor: DungeonFloor;
        
        if (targetFloorNumber) {
          const floor = state.floors.find(f => f.number === targetFloorNumber);
          if (!floor) return false;
          targetFloor = floor;
        } else {
          // Add to the deepest floor by default
          targetFloor = state.floors.find(f => f.isDeepest) || state.floors[state.floors.length - 1];
        }        // Check if current floor is full (entrance + 5 regular/boss rooms, excluding core room)
        const nonCoreRooms = targetFloor.rooms.filter(room => room.type !== 'core');
        if (nonCoreRooms.length >= GAME_CONSTANTS.MAX_ROOMS_PER_FLOOR + 1) {
          // Creating new floor - calculate total rooms across all floors
          const totalRoomCount = state.floors.reduce((total, floor) => {
            return total + floor.rooms.filter(room => room.type !== 'core' && room.type !== 'entrance').length;
          }, 0);
          const roomCost = getRoomCost(totalRoomCount, 'normal');
          
          // Check if player has enough mana
          if (state.mana < roomCost) {
            get().addLog({
              message: `Not enough mana! Need ${roomCost} mana to create a new floor.`,
              type: "system"
            });
            return false;
          }
          
          // Spend mana
          get().spendMana(roomCost);
          
          // Create new floor
          const newFloor = get().createNewFloor();
          
          // Add a normal room to the new floor
          const newRoom: Room = {
            id: Date.now() + 2,
            type: 'normal',
            position: 1,
            floorNumber: newFloor.number,
            monsters: [],
            roomUpgrade: null,
            explored: false,
            loot: 0
          };          newFloor.rooms.push(newRoom);

          // Update floor states and handle core room transfer
          const updatedFloors = state.floors.map(f => {
            // Remove core room from previous deepest floor
            if (f.isDeepest) {
              return {
                ...f,
                isDeepest: false,
                rooms: f.rooms.filter(room => room.type !== 'core')
              };
            }
            return { ...f, isDeepest: false };
          });
          updatedFloors.push(newFloor);

          // Add core room to the new deepest floor only
          const coreRoom: Room = {
            id: Date.now() + 3,
            type: 'core',
            position: GAME_CONSTANTS.MAX_ROOMS_PER_FLOOR + 1,
            floorNumber: newFloor.number,
            monsters: [],
            roomUpgrade: null,
            explored: false,
            loot: 0
          };

          newFloor.rooms.push(coreRoom);          set({ 
            floors: updatedFloors,
            totalFloors: state.totalFloors + 1
          });

          get().updateDeepCoreBonus();          get().addLog({ 
            message: `New floor ${newFloor.number} created! Room added at position 1 for ${roomCost} mana.`, 
            type: "system" 
          });
          
          // Debug: Log current core room status
          const coreRooms = updatedFloors.flatMap(f => f.rooms.filter(r => r.type === 'core'));
          get().addLog({ 
            message: `Debug: ${coreRooms.length} core room(s) exist. On floors: ${coreRooms.map(r => r.floorNumber).join(', ')}`, 
            type: "system" 
          });
          
          return true;        } else {
          // Add room to current floor, inserting before the core room
          const coreRoom = targetFloor.rooms.find(room => room.type === 'core');
          const nonCoreRooms = targetFloor.rooms.filter(room => room.type !== 'core');
            const nextPosition = nonCoreRooms.length;
          const roomType = nextPosition === GAME_CONSTANTS.MAX_ROOMS_PER_FLOOR ? 'boss' : 'normal';
          
          // Calculate room cost based on total room count across all floors
          const totalRoomCount = state.floors.reduce((total, floor) => {
            return total + floor.rooms.filter(room => room.type !== 'core' && room.type !== 'entrance').length;
          }, 0);
          const roomCost = getRoomCost(totalRoomCount, roomType);
          
          // Check if player has enough mana
          if (state.mana < roomCost) {
            get().addLog({
              message: `Not enough mana! Need ${roomCost} mana to add a ${roomType} room.`,
              type: "system"
            });
            return false;
          }
          
          // Spend mana
          get().spendMana(roomCost);
          
          const newRoom: Room = {
            id: Date.now(),
            type: roomType,
            position: nextPosition,
            floorNumber: targetFloor.number,
            monsters: [],
            roomUpgrade: null,
            explored: false,
            loot: 0
          };

          // Create updated rooms array with new room inserted before core room
          const updatedRooms = [...nonCoreRooms, newRoom];
          if (coreRoom) {
            // Update core room position to be after all other rooms
            const updatedCoreRoom = {
              ...coreRoom,
              position: updatedRooms.length
            };
            updatedRooms.push(updatedCoreRoom);
          }

          const updatedFloors = state.floors.map(floor => {
            if (floor.id === targetFloor.id) {
              return {
                ...floor,
                rooms: updatedRooms
              };
            }
            return floor;          });

          set({ floors: updatedFloors });
            get().addLog({ 
            message: `${roomType === 'boss' ? 'Boss room' : 'Normal room'} added to floor ${targetFloor.number} at position ${nextPosition} for ${roomCost} mana.`, 
            type: "system" 
          });
          
          // Debug: Log current core room status
          const coreRooms = updatedFloors.flatMap(f => f.rooms.filter(r => r.type === 'core'));
          get().addLog({ 
            message: `Debug: ${coreRooms.length} core room(s) exist. On floors: ${coreRooms.map(r => r.floorNumber).join(', ')}`, 
            type: "system" 
          });
          
          return true;
        }
      },

      updateDeepCoreBonus: () => {
        const state = get();
        const newBonus = state.totalFloors * GAME_CONSTANTS.CORE_ROOM_MANA_BONUS;
        const newManaRegen = 1 + newBonus; // Base 1 + bonus
        
        set({ 
          deepCoreBonus: newBonus,
          manaRegen: newManaRegen
        });
        
        get().addLog({ 
          message: `Deep Core Bonus updated: +${Math.round(newBonus * 100)}% mana regeneration`, 
          type: "system" 
        });
      },

      selectRoom: (roomIndex) => set({ selectedRoom: roomIndex, selectedMonster: null }),

      selectMonster: (monsterIndex) => set({ selectedMonster: monsterIndex, selectedRoom: null }),

      addLog: (entry) => set((state) => ({
        log: [...state.log.slice(-49), { ...entry, timestamp: Date.now() }] // Keep last 50 entries
      })),

      spendMana: (amount) => {
        const state = get();
        if (state.mana >= amount) {
          set({ mana: state.mana - amount });
          return true;
        }
        return false;
      },

      spendGold: (amount) => {
        const state = get();
        if (state.gold >= amount) {
          set({ gold: state.gold - amount });
          return true;
        }
        return false;
      },

      gainGold: (amount) => set((state) => ({ gold: state.gold + amount })),

      gainSouls: (amount) => set((state) => ({ souls: state.souls + amount })),

      placeMonster: (floorNumber, roomPosition, monsterType) => {
        const state = get();
        const monster = monsterTypes[monsterType];
        
        const floor = state.floors.find(f => f.number === floorNumber);
        if (!floor) {
          get().addLog({ message: "Floor not found!", type: "system" });
          return false;
        }

        const room = floor.rooms.find(r => r.position === roomPosition);
        if (!room) {
          get().addLog({ message: "Room not found!", type: "system" });
          return false;
        }

        if (room.type === 'entrance' || room.type === 'core') {
          get().addLog({ message: "Cannot place monsters in entrance or core rooms!", type: "system" });
          return false;
        }

        const isBossRoom = room.type === 'boss';
        const cost = getMonsterManaCost(monster.baseCost, floorNumber, isBossRoom);

        if (!get().spendMana(cost)) {
          get().addLog({ message: `Not enough mana! Need ${cost} mana.`, type: "system" });
          return false;
        }

        const isBoss = isBossRoom && room.monsters.length === 0; // First monster in boss room becomes boss
        const scaledStats = getScaledMonsterStats(
          { hp: monster.hp, attack: monster.attack, defense: monster.defense },
          floorNumber,
          isBoss
        );

        const newMonster: Monster = {
          id: Date.now() + Math.random(),
          type: monsterType,
          hp: scaledStats.hp,
          maxHp: scaledStats.hp,
          alive: true,
          isBoss,
          floorNumber,
          scaledStats
        };

        const updatedFloors = state.floors.map(f => {
          if (f.number === floorNumber) {
            return {
              ...f,
              rooms: f.rooms.map(r => {
                if (r.position === roomPosition) {
                  return {
                    ...r,
                    monsters: [...r.monsters, newMonster]
                  };
                }
                return r;
              })
            };
          }
          return f;
        });

        set({ floors: updatedFloors });
        
        get().addLog({ 
          message: `Spawned ${monster.name}${isBoss ? ' (Boss)' : ''} on floor ${floorNumber}, room ${roomPosition} for ${cost} mana`, 
          type: "system" 
        });
        
        return true;
      },

      advanceTime: () => set((state) => {
        let newHour = state.hour + 1;
        let newDay = state.day;
        
        if (newHour >= 24) {
          newHour = 0;
          newDay += 1;
        }        // Determine status based on time (but can be overridden by manual control)
        let status: 'Open' | 'Closing' | 'Closed' | 'Maintenance' = state.status;
        
        // Only auto-update status if not manually set to Closing or Closed
        if (state.status !== 'Closing' && state.status !== 'Closed') {
          if (newHour >= 0 && newHour < 6) {
            status = 'Maintenance';
          } else if (newHour >= 6 && newHour < 18) {
            status = 'Open';
          } else {
            status = 'Open'; // Changed: Keep open during evening hours too
          }
        }

        return {
          hour: newHour,
          day: newDay,
          status,
          // Regenerate mana
          mana: Math.min(state.mana + state.manaRegen, state.maxMana),
        };
      }),

      setStatus: (status) => {
        const state = get();
        
        // Special logic for closing the dungeon
        if (status === 'Closed' && state.adventurerParties.length > 0) {
          // If there are parties in the dungeon, set to Closing instead
          set({ status: 'Closing' });
          get().addLog({
            message: "Dungeon is closing... waiting for current adventurers to finish.",
            type: "system"
          });
        } else {
          set({ status });
          if (status === 'Closed') {
            get().addLog({
              message: "Dungeon is now closed to new adventurers.",
              type: "system"
            });
          } else if (status === 'Open') {
            get().addLog({
              message: "Dungeon is now open to adventurers!",
              type: "system"
            });
          }
        }
      },

      setSpeed: (speed) => set({ speed }),

      closeModal: () => {
        set({ modalOpen: false });
        if (typeof window !== 'undefined') {
          sessionStorage.setItem("dungeoncore_modal_seen", "1");
        }
      },      addAdventurerParty: (party) => set((state) => {
        // Safety check: only allow one party at a time
        if (state.adventurerParties.length > 0) {
          get().addLog({
            message: `Cannot add party - ${state.adventurerParties.length} parties already in dungeon`,
            type: "system"
          });
          return state;
        }
        
        return {
          adventurerParties: [...state.adventurerParties, party]
        };
      }),

      updateAdventurerParty: (partyId, updates) => set((state) => ({
        adventurerParties: state.adventurerParties.map(party =>
          party.id === partyId ? { ...party, ...updates } : party
        )
      })),

      removeAdventurerParty: (partyId) => set((state) => ({
        adventurerParties: state.adventurerParties.filter(party => party.id !== partyId)
      })),      respawnMonsters: () => set((state) => {
        // Only respawn if no adventurers are in the dungeon
        if (state.adventurerParties.length > 0) return state;

        const updatedFloors = state.floors.map(floor => ({
          ...floor,
          rooms: floor.rooms.map(room => ({
            ...room,
            monsters: room.monsters.map(monster => ({
              ...monster,
              hp: monster.maxHp,
              alive: true,
            }))
          }))
        }));

        get().addLog({ message: "Monsters have respawned throughout the dungeon!", type: "system" });
        return { floors: updatedFloors };
      }),      resetGame: () => {
        // Clear localStorage and sessionStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('dungeon-core-game-v2');
          sessionStorage.removeItem('dungeoncore_modal_seen');
        }
        
        // Reset to initial state with a new floor
        set({
          ...initialState,
          floors: [createInitialFloor()],          log: [
            { message: "Game reset successfully!", type: "system", timestamp: Date.now() },
            { message: "Welcome to Dungeon Core Simulator v1.2!", type: "system", timestamp: Date.now() },
            { message: "Your dungeon starts with an entrance and core room. Add more rooms to expand!", type: "system", timestamp: Date.now() },
          ],
        });
        
        // Ensure core room is present after reset
        get().ensureCoreRoom();
      },

      ensureCoreRoom: () => {
        const state = get();
        const deepestFloor = state.floors.find(f => f.isDeepest);
        
        if (!deepestFloor) return;
        
        // Check if deepest floor has a core room
        const hasCore = deepestFloor.rooms.some(room => room.type === 'core');
        
        if (!hasCore) {
          const coreRoom: Room = {
            id: Date.now(),
            type: 'core',
            position: GAME_CONSTANTS.MAX_ROOMS_PER_FLOOR + 1,
            floorNumber: deepestFloor.number,
            monsters: [],
            roomUpgrade: null,
            explored: false,
            loot: 0
          };

          const updatedFloors = state.floors.map(floor => {
            if (floor.id === deepestFloor.id) {
              return {
                ...floor,
                rooms: [...floor.rooms, coreRoom]
              };
            }
            return floor;
          });

          set({ floors: updatedFloors });
          
          get().addLog({ 
            message: `Core room added to floor ${deepestFloor.number}.`, 
            type: "system" 
          });
        }
      },
    }),
    {
      name: 'dungeon-core-game-v2',
      partialize: (state) => ({
        mana: state.mana,
        maxMana: state.maxMana,
        manaRegen: state.manaRegen,
        gold: state.gold,
        souls: state.souls,
        day: state.day,
        hour: state.hour,
        dungeonLevel: state.dungeonLevel,
        floors: state.floors,
        totalFloors: state.totalFloors,
        deepCoreBonus: state.deepCoreBonus,
      }),
    }
  )
);
