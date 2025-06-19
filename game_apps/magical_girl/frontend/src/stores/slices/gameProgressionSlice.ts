// Game progression slice - Single Responsibility Principle
import type { StateCreator } from 'zustand';
import type { Player } from '../../types';

export interface GameProgressionSlice {
  // State
  player: Player;
  gameTime: number;
  lastSaveTime: number;
  version: string;
  
  // Actions
  gainExperience: (amount: number) => void;
  levelUp: () => void;
  unlockFeature: (feature: keyof Player['unlockedFeatures']) => void;
  updateGameTime: () => void;
  saveGame: () => void;
  loadGame: () => void;
  resetGame: () => void;
  getCurrentTime: () => number;
}

export const createGameProgressionSlice: StateCreator<
  GameProgressionSlice & { 
    addNotification: (notification: any) => void;
    unlockMission: (missionId: string) => void;
    addResources: (resources: any) => void;
  },
  [],
  [],
  GameProgressionSlice
> = (set, get) => ({
  player: {
    id: 'player_1',
    name: 'Magical Girl Trainer',
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
    unlockedFeatures: {
      training: true,
      missions: false,
      advancedTraining: false,
      teamMissions: false,
      transformation: false,
      specialPowers: false,
      craftingWorkshop: false,
      magicalGarden: false
    },
    achievements: [],
    statistics: {
      totalPlayTime: 0,
      missionsCompleted: 0,
      trainingSessionsCompleted: 0,
      totalMagicalEnergySpent: 0,
      totalSparklesEarned: 0,
      transformationsPerformed: 0,
      criticalSuccesses: 0,
      perfectMissions: 0
    },
    preferences: {
      autoSave: true,
      soundEnabled: true,
      animationsEnabled: true,
      notificationsEnabled: true,
      theme: 'light',
      language: 'en'
    }
  },
  gameTime: Date.now(),
  lastSaveTime: 0,
  version: '1.0.0',
  
  gainExperience: (amount) => {
    get().addResources({ experience: amount });
  },
  
  levelUp: () => set((state) => {
    const newLevel = state.player.resources.level + 1;
    const newMaxEnergy = state.player.resources.maxMagicalEnergy + 10;
    
    const updatedPlayer = {
      ...state.player,
      resources: {
        ...state.player.resources,
        level: newLevel,
        maxMagicalEnergy: newMaxEnergy,
        magicalEnergy: newMaxEnergy // Restore energy on level up
      }
    };
    
    // Unlock features based on level
    if (newLevel === 2) {
      updatedPlayer.unlockedFeatures.missions = true;
      setTimeout(() => get().unlockMission('rescue_cat'), 0);
    }
    if (newLevel === 3) {
      updatedPlayer.unlockedFeatures.advancedTraining = true;
    }
    if (newLevel === 5) {
      updatedPlayer.unlockedFeatures.teamMissions = true;
      updatedPlayer.unlockedFeatures.transformation = true;
    }
    
    get().addNotification({
      type: 'success',
      title: 'Level Up!',
      message: `Congratulations! You reached level ${newLevel}!`
    });
    
    return { player: updatedPlayer };
  }),
  
  unlockFeature: (feature) => set((state) => {
    if (!state.player.unlockedFeatures[feature]) {
      const updatedPlayer = {
        ...state.player,
        unlockedFeatures: {
          ...state.player.unlockedFeatures,
          [feature]: true
        }
      };
      
      get().addNotification({
        type: 'info',
        title: 'Feature Unlocked!',
        message: `${feature.replace(/([A-Z])/g, ' $1').toLowerCase()} is now available!`
      });
      
      return { player: updatedPlayer };
    }
    return state;
  }),
  
  updateGameTime: () => set((state) => {
    const now = Date.now();
    const timeDiff = now - state.gameTime;
    
    const updatedPlayer = {
      ...state.player,
      statistics: {
        ...state.player.statistics,
        totalPlayTime: state.player.statistics.totalPlayTime + timeDiff
      }
    };
    
    // Regenerate energy
    const energyToAdd = Math.floor(timeDiff / 1000); // 1 energy per second
    if (energyToAdd > 0) {
      const maxEnergy = state.player.resources.maxMagicalEnergy;
      const currentEnergy = state.player.resources.magicalEnergy;
      updatedPlayer.resources = {
        ...updatedPlayer.resources,
        magicalEnergy: Math.min(maxEnergy, currentEnergy + energyToAdd)
      };
    }
    
    return {
      player: updatedPlayer,
      gameTime: now
    };
  }),
  
  saveGame: () => {
    set((_state) => ({ lastSaveTime: Date.now() }));
    get().addNotification({
      type: 'success',
      title: 'Game Saved',
      message: 'Your progress has been saved!'
    });
  },
  
  loadGame: () => {
    get().addNotification({
      type: 'info',
      title: 'Game Loaded',
      message: 'Your progress has been loaded!'
    });
  },
  
  resetGame: () => {
    // This will be handled by the main store
    get().addNotification({
      type: 'info',
      title: 'Game Reset',
      message: 'Started a new game!'
    });
  },
  
  getCurrentTime: () => Date.now()
});
