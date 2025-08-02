import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState } from '../types/game';
import { STARTING_GOLD, STARTING_LEVEL, STARTING_REPUTATION, STARTING_EXPERIENCE } from '../constants/gameConfig';

const defaultState: GameState = {
  player: {
    gold: STARTING_GOLD,
    reputation: STARTING_REPUTATION,
    level: STARTING_LEVEL,
    experience: STARTING_EXPERIENCE
  },
  inventory: [],
  unlockedRecipes: ['Iron Dagger', 'Iron Sword'],
  materials: {
    'Iron Ore': 0,
    'Coal': 0,
    'Wood': 0,
    'Leather': 0,
    'Silver Ore': 0,
    'Mythril': 0
  },
  forgeUpgrades: [],
  forgeLit: false,
  currentCustomer: null,
  tutorialCompleted: false,
  tutorialStep: 0
};

interface GameStore {
  state: GameState;
  setState: (state: GameState) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      state: defaultState,
      setState: (state) => set({ state }),
      resetGame: () => set({ state: defaultState })
    }),
    {
      name: 'blacksmith-forge-game', // localStorage key
    }
  )
);
