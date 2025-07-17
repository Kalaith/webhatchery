import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initializeGame, getGameState, placeMonsterAPI, addRoomAPI, getMonsterManaCost } from '../api/gameApi';
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
  selectMonster: (monster: string | null) => void;
  selectRoom: (room: number | null) => void;
  placeMonster: (roomId: number, monsterType: string) => Promise<boolean>;
  addRoom: (floorNumber: number, roomType: string, position: number) => Promise<boolean>;
}

export const useBackendGameStore = create<BackendGameState>()(
  persist(
    (set, get) => ({
      gameData: null,
      initialData: null,
      loading: false,
      error: null,
      selectedMonster: null,
      selectedRoom: null,

      initializeGame: async () => {
        set({ loading: true, error: null });
        try {
          const initialData = await initializeGame();
          set({ initialData, gameData: { game: initialData.game, monsters: initialData.monsters }, loading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to initialize game', loading: false });
        }
      },

      loadGameState: async () => {
        set({ loading: true, error: null });
        try {
          const gameData = await getGameState();
          set({ gameData, loading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to load game state', loading: false });
        }
      },

      selectMonster: (monster) => set({ selectedMonster: monster, selectedRoom: null }),
      
      selectRoom: (room) => set({ selectedRoom: room, selectedMonster: null }),

      placeMonster: async (roomId: number, monsterType: string) => {
        const cost = getMonsterManaCost(10, 1, false); // Basic cost calculation
        
        try {
          const result = await placeMonsterAPI(roomId, monsterType, cost);
          if (result.success) {
            // Reload game state to get updated data
            await get().loadGameState();
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
            // Reload game state to get updated data
            await get().loadGameState();
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
    }),
    {
      name: 'backend-game-store',
      partialize: (state) => ({
        selectedMonster: state.selectedMonster,
        selectedRoom: state.selectedRoom,
      }),
    }
  )
);