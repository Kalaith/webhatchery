import type { GetState, SetState } from 'zustand';
import type { GameState } from '../types/game';

// Define a type for the full GameStore actions that will be passed to these functions
// This avoids circular dependency with the main gameStore.ts file
interface GameStoreActions {
  addLog: (entry: any) => void;
}

// Combine GameState and GameStoreActions for the GetState/SetState types
type FullGameStore = GameState & GameStoreActions;

export const spendMana = (set: SetState<FullGameStore>, get: GetState<FullGameStore>, amount: number) => {
  const state = get();
  if (state.mana >= amount) {
    set({ mana: state.mana - amount });
    return true;
  }
  return false;
};

export const spendGold = (set: SetState<FullGameStore>, get: GetState<FullGameStore>, amount: number) => {
  const state = get();
  if (state.gold >= amount) {
    set({ gold: state.gold - amount });
    return true;
  }
  return false;
};

export const gainGold = (set: SetState<FullGameStore>, get: GetState<FullGameStore>, amount: number) => set((state) => ({
  gold: state.gold + amount
}));

export const gainSouls = (set: SetState<FullGameStore>, get: GetState<FullGameStore>, amount: number) => set((state) => ({
  souls: state.souls + amount
}));