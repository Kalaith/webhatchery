// Main game store using Zustand for state management - Clean Architecture
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { StateCreator } from 'zustand';

// Import all slices following Single Responsibility Principle
import { createNotificationSlice, type NotificationSlice } from './slices/notificationSlice';
import { createResourceSlice, type ResourceSlice } from './slices/resourceSlice';
import { createMagicalGirlSlice, type MagicalGirlSlice } from './slices/magicalGirlSlice';
import { createGameProgressionSlice, type GameProgressionSlice } from './slices/gameProgressionSlice';
import { createMissionSlice, type MissionSlice } from './slices/missionSlice';
import { createTrainingSlice, type TrainingSlice } from './slices/trainingSlice';
import { createAchievementSlice, type AchievementSlice } from './slices/achievementSlice';
import { createSettingsSlice, type SettingsSlice } from './slices/settingsSlice';

// Combined store interface - Composition over inheritance
export interface GameStore extends 
  NotificationSlice,
  ResourceSlice,
  MagicalGirlSlice,
  GameProgressionSlice,
  MissionSlice,
  TrainingSlice,
  AchievementSlice,
  SettingsSlice {
  // Utility actions
  resetGame: () => void;
}

// Main store creator that properly composes all slices
const createGameStore: StateCreator<GameStore> = (set, get, api) => ({
  // Notification slice
  ...createNotificationSlice(set as any, get as any, api as any),
  
  // Resource slice
  ...createResourceSlice(set as any, get as any, api as any),
  
  // Magical Girl slice
  ...createMagicalGirlSlice(set as any, get as any, api as any),
  
  // Game Progression slice
  ...createGameProgressionSlice(set as any, get as any, api as any),
  
  // Mission slice
  ...createMissionSlice(set as any, get as any, api as any),
    // Training slice
  ...createTrainingSlice(set as any, get as any, api as any),
  
  // Achievement slice
  ...createAchievementSlice(set as any, get as any, api as any),
  
  // Settings slice
  ...createSettingsSlice(set as any, get as any, api as any),
  
  // Global reset function
  resetGame: () => {
    // Get initial state from each slice
    const initialNotifications = createNotificationSlice(set as any, get as any, api as any);
    const initialResources = createResourceSlice(set as any, get as any, api as any);
    const initialMagicalGirls = createMagicalGirlSlice(set as any, get as any, api as any);
    const initialProgression = createGameProgressionSlice(set as any, get as any, api as any);    const initialMissions = createMissionSlice(set as any, get as any, api as any);
    const initialTraining = createTrainingSlice(set as any, get as any, api as any);
    const initialAchievements = createAchievementSlice(set as any, get as any, api as any);
    const initialSettings = createSettingsSlice(set as any, get as any, api as any);
      set({
      ...initialNotifications,
      ...initialResources,
      ...initialMagicalGirls,
      ...initialProgression,
      ...initialMissions,
      ...initialTraining,
      ...initialAchievements,
      ...initialSettings,
      resetGame: get().resetGame, // Preserve the reset function
    });
    
    // Add notification about reset
    setTimeout(() => {
      get().addNotification({
        type: 'info',
        title: 'Game Reset',
        message: 'Started a new game!'
      });
    }, 100);
  }
});

export const useGameStore = create<GameStore>()(
  persist(
    subscribeWithSelector(createGameStore),
    {
      name: 'magical-girl-game',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Migration logic for version updates
          return {};
        }
        return persistedState;
      }
    }
  )
);

// Subscribe to game time updates
setInterval(() => {
  const state = useGameStore.getState();
  if (state.updateGameTime) {
    state.updateGameTime();
  }
}, 1000);
