import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initializeGame, getGameState, placeMonsterAPI, addRoomAPI, resetGameAPI } from '../api/gameApi';
import type { GameStateResponse, InitializeGameResponse } from '../api/types';

interface BackendGameState {
  // Game state from backend
  gameData: GameStateResponse | null;
  initialData: InitializeGameResponse | null;
  loading: boolean;
  error: string | null;
  
  // UI state
  selectedMonster: string | null;
  selectedRoom: number | null;
  
  // Actions
  initializeGame: () => Promise<void>;
  loadGameState: () => Promise<void>;
  refreshGameState: () => Promise<void>;
  forceRefreshAll: () => Promise<void>;
  resetGame: () => Promise<void>;
  selectMonster: (monster: string | null) => void;
  selectRoom: (room: number | null) => void;
  placeMonster: (roomId: number, monsterType: string) => Promise<boolean>;
  addRoom: (floorNumber: number, roomType: string, position: number) => Promise<boolean>;
}

export const useBackendGameStore = create<BackendGameState>()((set, get) => ({
      gameData: null,
      initialData: null,
      loading: false,
      error: null,
      selectedMonster: null,
      selectedRoom: null,

      initializeGame: async () => {
        set({ loading: true, error: null });
        try {
          console.log('Starting game initialization...');
          
          // Always get fresh initialization data from backend
          // Backend will handle whether to create new game or return existing
          console.log('Calling initializeGame API...');
          const initialData = await initializeGame();
          console.log('Initialize game response received:', initialData);
          console.log('Response type:', typeof initialData);
          console.log('Floors data:', initialData.floors);
          console.log('Floors length:', initialData.floors?.length);
          
          if (initialData.floors && initialData.floors.length > 0) {
            console.log('First floor:', initialData.floors[0]);
            console.log('First floor rooms:', initialData.floors[0].rooms);
            console.log('First floor rooms length:', initialData.floors[0].rooms?.length);
          } else {
            console.error('No floors data received!');
          }
          
          set({ 
            initialData, 
            gameData: { 
              game: initialData.game, 
              monsters: initialData.monsters,
              floors: initialData.floors 
            }, 
            loading: false 
          });
          
          console.log('Game data set in store:', {
            game: initialData.game,
            monsters: initialData.monsters,
            floors: initialData.floors
          });
        } catch (error) {
          console.error('Error during game initialization:', error);
          set({ error: error instanceof Error ? error.message : 'Failed to initialize game', loading: false });
        }
      },

      loadGameState: async () => {
        set({ loading: true, error: null });
        try {
          // Get current game state from backend (only dynamic data)
          const newGameData = await getGameState();
          const currentState = get();
          
          // Preserve floors and other static data, only update dynamic game state
          const gameData = {
            game: newGameData.game,
            floors: currentState.gameData?.floors || [],
            monsters: currentState.gameData?.monsters || []
          };
          
          set({ gameData, loading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to load game state', loading: false });
        }
      },

      refreshGameState: async () => {
        // Don't show loading for background refreshes to prevent UI flashing
        set({ error: null });
        try {
          // Get current game state from backend (only dynamic data)
          const newGameData = await getGameState();
          const currentState = get();
          
          // Only update if the game state actually changed
          const currentGame = currentState.gameData?.game;
          const newGame = newGameData.game;
          
          // Check if we need to update (compare key properties that change)
          const needsUpdate = !currentGame || 
            currentGame.mana !== newGame.mana ||
            currentGame.gold !== newGame.gold ||
            currentGame.souls !== newGame.souls ||
            currentGame.day !== newGame.day ||
            currentGame.hour !== newGame.hour ||
            currentGame.status !== newGame.status;
          
          if (needsUpdate) {
            console.log('Game state changed, updating...');
            // Build the complete game data by merging new dynamic data with existing static data
            const gameData = {
              game: newGameData.game,
              floors: currentState.gameData?.floors || [],
              monsters: currentState.gameData?.monsters || []
            };
            
            set({ gameData });
          } else {
            console.log('Game state unchanged, skipping update');
          }
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to refresh game state' });
        }
      },

      forceRefreshAll: async () => {
        set({ loading: true, error: null });
        try {
          // Force full reinitialization including floors
          const initialData = await initializeGame();
          set({ 
            initialData, 
            gameData: { 
              game: initialData.game, 
              monsters: initialData.monsters,
              floors: initialData.floors 
            }, 
            loading: false 
          });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to force refresh game state', loading: false });
        }
      },

      selectMonster: (monster) => set({ selectedMonster: monster, selectedRoom: null }),
      
      selectRoom: (room) => set({ selectedRoom: room, selectedMonster: null }),

      placeMonster: async (roomId: number, monsterType: string) => {
        // For now, assume floor 1 and use roomId as position
        // TODO: This should be improved to properly extract floor and position from room data
        const floorNumber = 1;
        const roomPosition = roomId;
        
        try {
          const result = await placeMonsterAPI(floorNumber, roomPosition, monsterType);
          if (result.success) {
            // Refresh only dynamic game state (preserves floors)
            await get().refreshGameState();
            return true;
          } else {
            set({ error: result.error || 'Failed to place monster' });
            return false;
          }
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to place monster' });
          return false;
        }
      },

      addRoom: async (floorNumber: number, roomType: string, position: number) => {
        const cost = 20 + (position * 5); // Basic cost calculation
        
        try {
          const result = await addRoomAPI(floorNumber, roomType, position, cost);
          if (result.success) {
            // Apply delta update: add the new room to existing floors data
            const currentState = get();
            if (currentState.gameData) {
              const floors = [...(currentState.gameData.floors || [])];
              
              // Find or create the floor
              let targetFloor = floors.find(f => f.number === floorNumber);
              if (!targetFloor) {
                // Create new floor
                targetFloor = {
                  id: Date.now(),
                  number: floorNumber,
                  rooms: [],
                  isDeepest: true
                };
                
                // Mark previous floors as not deepest
                floors.forEach(f => f.isDeepest = false);
                floors.push(targetFloor);
              }
              
              // Add the new room in the correct position (before core room)
              const newRoom = {
                id: result.roomId || Date.now(),
                type: result.type as "entrance" | "normal" | "boss" | "core",
                position: result.position || position,
                floorNumber: floorNumber,
                monsters: [],
                roomUpgrade: null,
                explored: false,
                loot: 0
              };
              
              // Find core room and insert before it, or add at end if no core room
              const coreRoomIndex = targetFloor.rooms.findIndex(room => room.type === 'core');
              if (coreRoomIndex !== -1) {
                // Insert before core room
                targetFloor.rooms.splice(coreRoomIndex, 0, newRoom);
                // Update core room position to be after the new room
                targetFloor.rooms[coreRoomIndex + 1].position = newRoom.position + 1;
              } else {
                // No core room, add at end
                targetFloor.rooms.push(newRoom);
              }
              
              // Sort all rooms by position to ensure proper order
              targetFloor.rooms.sort((a, b) => a.position - b.position);
              
              // Update game data with new floors and refresh dynamic state
              set({
                gameData: {
                  ...currentState.gameData,
                  floors: floors
                }
              });
              
              // Also refresh game state to update mana, etc.
              await get().refreshGameState();
            }
            return true;
          } else {
            set({ error: result.error || 'Failed to add room' });
            return false;
          }
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to add room' });
          return false;
        }
      },

      resetGame: async () => {
        set({ loading: true, error: null });
        try {
          console.log('Resetting game...');
          const result = await resetGameAPI();
          
          if (result.success && result.gameData) {
            console.log('Game reset successful, reinitializing with fresh data...');
            // Clear all state and set fresh data
            set({ 
              initialData: result.gameData, 
              gameData: { 
                game: result.gameData.game, 
                monsters: result.gameData.monsters,
                floors: result.gameData.floors 
              }, 
              loading: false,
              error: null,
              selectedMonster: null,
              selectedRoom: null
            });
            console.log('Game reset complete');
          } else {
            set({ error: result.error || 'Failed to reset game', loading: false });
          }
        } catch (error) {
          console.error('Error during game reset:', error);
          set({ error: error instanceof Error ? error.message : 'Failed to reset game', loading: false });
        }
      },
    }));