// Resource management slice - Single Responsibility Principle
import type { StateCreator } from 'zustand';
import type { Resources } from '../../types';
import { GAME_CONFIG } from '../../data/gameConfig';

export interface ResourceSlice {
  // State
  resources: Resources;
  
  // Actions
  addResources: (resources: Partial<Resources>) => void;
  spendResources: (resources: Partial<Resources>) => boolean;
  canAfford: (resources: Partial<Resources>) => boolean;
}

export const createResourceSlice: StateCreator<
  ResourceSlice & { levelUp: () => void },
  [],
  [],
  ResourceSlice
> = (set, get) => ({
  resources: {
    gold: 1000,
    magicalCrystals: 500,
    friendshipPoints: 1000,
    sparkles: 50,
    stardust: 0,
    moonbeams: 0,
    crystals: 0,
    experience: 0,
    level: 1,
    magicalEnergy: 100,
    maxMagicalEnergy: 100
  },
  
  addResources: (resourceUpdates) => set((state) => {
    const newResources = { ...state.resources };
    
    Object.entries(resourceUpdates).forEach(([key, value]) => {
      if (value && key in newResources) {
        const resourceKey = key as keyof Resources;
        const current = newResources[resourceKey] as number;
        const valueToAdd = value as number;
        
        if (resourceKey === 'experience') {
          newResources.experience = current + valueToAdd;
          // Check for level up
          const requiredExp = 100 * Math.pow(1.5, newResources.level - 1);
          if (newResources.experience >= requiredExp) {
            get().levelUp();
          }
        } else {
          const maxKey = `max${resourceKey.charAt(0).toUpperCase() + resourceKey.slice(1)}` as keyof typeof GAME_CONFIG.resourceLimits;
          const max = GAME_CONFIG.resourceLimits[maxKey];
          
          if (max !== undefined) {
            newResources[resourceKey] = Math.min(current + valueToAdd, max) as any;
          } else {
            newResources[resourceKey] = current + valueToAdd as any;
          }
        }
      }
    });
    
    return { resources: newResources };
  }),
  
  spendResources: (resourceCosts) => {
    const state = get();
    if (!state.canAfford(resourceCosts)) {
      return false;
    }
    
    set((currentState) => {
      const newResources = { ...currentState.resources };
      
      Object.entries(resourceCosts).forEach(([key, value]) => {
        if (value && key in newResources) {
          const resourceKey = key as keyof Resources;
          const current = newResources[resourceKey] as number;
          const cost = value as number;
          newResources[resourceKey] = Math.max(0, current - cost) as any;
        }
      });
      
      return { resources: newResources };
    });
    
    return true;
  },
  
  canAfford: (resourceCosts) => {
    const state = get();
    return Object.entries(resourceCosts).every(([key, value]) => {
      if (!value || !(key in state.resources)) return true;
      const resourceKey = key as keyof Resources;
      const current = state.resources[resourceKey] as number;
      const cost = value as number;
      return current >= cost;
    });
  }
});
