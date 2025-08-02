import { useCallback } from 'react';
import { useGameStore } from '../stores/gameStore';
import { GameState } from '../types/game';

export function useCustomerActions() {
  const { state, setState } = useGameStore();
  const { currentCustomer, inventory, player } = state as GameState;

  interface InventoryItem {
    name: string;
    icon: string;
    quality?: string;
    value: number;
    type: string;
  }

  const handleSell = useCallback((itemIdx: number) => {
    const item = inventory[itemIdx];
    if (!item || !currentCustomer) return;
    let finalPrice = item.value;
    // Apply customer preference modifier
    if (currentCustomer.preferences === 'quality' && item.quality === 'Excellent') {
      finalPrice = Math.floor(finalPrice * 1.2);
    } else if (currentCustomer.preferences === 'value' && finalPrice <= currentCustomer.budget * 0.7) {
      finalPrice = Math.floor(finalPrice * 1.1);
    }
    if (finalPrice > currentCustomer.budget) return;
    setState({
      ...state,
      player: { ...player, gold: player.gold + finalPrice, reputation: player.reputation + 1 },
      inventory: inventory.filter((_, idx) => idx !== itemIdx),
      currentCustomer: null // After sale, customer leaves
    });
  }, [state, setState, currentCustomer, inventory, player]);

  return {
    currentCustomer,
    inventory,
    player,
    handleSell,
  };
}
