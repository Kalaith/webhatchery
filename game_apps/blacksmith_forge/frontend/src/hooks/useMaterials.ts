import { useGameStore } from '../stores/gameStore';

export function useMaterials() {
  const { state } = useGameStore();
  return state?.materials || {};
}

export function useInventory() {
  const { state } = useGameStore();
  return state?.inventory || [];
}
