// Achievement management slice - Single Responsibility Principle
import type { StateCreator } from 'zustand';
import type { Achievement, AchievementEvent, AchievementFilters, AchievementStats } from '../../types/achievements';
import { initialAchievements, achievementRarities, defaultAchievementFilters } from '../../data/achievements';

export interface AchievementSlice {
  // State
  achievements: Achievement[];
  achievementStats: AchievementStats;
  achievementFilters: AchievementFilters;
  recentlyUnlocked: Achievement[];
  
  // Actions
  unlockAchievement: (achievementId: string) => void;
  updateAchievementProgress: (achievementId: string, progress: number) => void;
  checkAchievements: (event: AchievementEvent) => void;
  resetAchievementProgress: (achievementId: string) => void;
  
  // Filters and utilities
  setAchievementFilters: (filters: Partial<AchievementFilters>) => void;
  resetAchievementFilters: () => void;
  getFilteredAchievements: () => Achievement[];
  calculateAchievementStats: () => void;
  
  // Event handlers for specific game events
  onTrainingCompleted: (trainingId: string, score?: number) => void;
  onMissionCompleted: (missionId: string, success: boolean, score?: number) => void;
  onMagicalGirlUnlocked: (girlId: string, rarity: string) => void;
  onLevelUp: (newLevel: number) => void;
  onBondLevelIncreased: (girlId: string, newBondLevel: number) => void;
}

export const createAchievementSlice: StateCreator<
  AchievementSlice & { 
    addNotification: (notification: any) => void;
    player: any;
    magicalGirls: any[];
    missions: any[];
  },
  [],
  [],
  AchievementSlice
> = (set, get) => ({
  achievements: initialAchievements.map(achievement => ({ ...achievement })),
  achievementStats: {
    totalAchievements: initialAchievements.length,
    unlockedAchievements: 0,
    achievementPoints: 0,
    completionRate: 0,
    favoriteCategory: 'training',
    recentUnlocks: [],
    nearCompletion: []
  },
  achievementFilters: { ...defaultAchievementFilters },
  recentlyUnlocked: [],
  
  unlockAchievement: (achievementId) => {
    const state = get();
    const achievement = state.achievements.find(a => a.id === achievementId);
    
    if (!achievement || achievement.unlocked) return;
    
    set((currentState) => {
      const updatedAchievements = currentState.achievements.map(a => {
        if (a.id === achievementId) {
          return {
            ...a,
            unlocked: true,
            unlockedAt: Date.now(),
            progress: a.maxProgress
          };
        }
        return a;
      });
      
      return {
        achievements: updatedAchievements,
        recentlyUnlocked: [achievement, ...currentState.recentlyUnlocked.slice(0, 4)]
      };    });
    
    // Show notification
    state.addNotification({
      type: 'achievement',
      title: '🏆 Achievement Unlocked!',
      message: `${achievement.name} - ${achievement.description}`,
      duration: 5000
    });
    
    // Update stats
    get().calculateAchievementStats();
    
    // Check for meta achievements (achievements about achievements)
    setTimeout(() => {
      const unlockedCount = get().achievements.filter(a => a.unlocked).length;
      get().checkAchievements({
        type: 'achievement_unlocked',
        data: { count: unlockedCount },
        timestamp: Date.now()
      });
    }, 100);
  },
  
  updateAchievementProgress: (achievementId, progress) => {
    set((state) => {
      const updatedAchievements = state.achievements.map(achievement => {
        if (achievement.id === achievementId && !achievement.unlocked) {
          const newProgress = Math.min(progress, achievement.maxProgress);
          const wasCompleted = achievement.progress >= achievement.maxProgress;
          const isNowCompleted = newProgress >= achievement.maxProgress;
          
          // Auto-unlock if progress reaches max
          if (!wasCompleted && isNowCompleted) {
            setTimeout(() => get().unlockAchievement(achievementId), 100);
          }
          
          return {
            ...achievement,
            progress: newProgress
          };
        }
        return achievement;
      });
      
      return { achievements: updatedAchievements };
    });
    
    // Update stats after progress change
    get().calculateAchievementStats();
  },
  
  checkAchievements: (event) => {
    const state = get();
    
    switch (event.type) {
      case 'training_completed':
        state.onTrainingCompleted(event.data.trainingId, event.data.score);
        break;
      case 'mission_completed':
        state.onMissionCompleted(event.data.missionId, event.data.success, event.data.score);
        break;
      case 'magical_girl_unlocked':
        state.onMagicalGirlUnlocked(event.data.girlId, event.data.rarity);
        break;
      case 'level_up':
        state.onLevelUp(event.data.newLevel);
        break;
      case 'bond_increased':
        state.onBondLevelIncreased(event.data.girlId, event.data.newBondLevel);
        break;
      case 'achievement_unlocked':
        // Check meta achievements
        if (event.data.count >= 10) {
          state.updateAchievementProgress('achievement_hunter', event.data.count);
        }
        break;
    }
  },
  
  resetAchievementProgress: (achievementId) => {
    set((state) => {
      const updatedAchievements = state.achievements.map(achievement => {
        if (achievement.id === achievementId) {
          return {
            ...achievement,
            progress: 0,
            unlocked: false,
            unlockedAt: undefined
          };
        }
        return achievement;
      });
      
      return { achievements: updatedAchievements };
    });
    
    get().calculateAchievementStats();
  },
  
  setAchievementFilters: (filters) => {
    set((state) => ({
      achievementFilters: { ...state.achievementFilters, ...filters }
    }));
  },
  
  resetAchievementFilters: () => {
    set({ achievementFilters: { ...defaultAchievementFilters } });
  },
  
  getFilteredAchievements: () => {
    const state = get();
    const { achievementFilters, achievements } = state;
    
    return achievements.filter(achievement => {
      // Category filter
      if (achievementFilters.category !== 'all' && achievement.category !== achievementFilters.category) {
        return false;
      }
      
      // Rarity filter
      if (achievementFilters.rarity !== 'all' && achievement.rarity !== achievementFilters.rarity) {
        return false;
      }
      
      // Status filter
      if (achievementFilters.status === 'unlocked' && !achievement.unlocked) {
        return false;
      }
      if (achievementFilters.status === 'locked' && achievement.unlocked) {
        return false;
      }
      if (achievementFilters.status === 'in-progress' && (achievement.unlocked || achievement.progress === 0)) {
        return false;
      }
      
      // Hidden filter
      if (achievement.hidden && !achievementFilters.showHidden && !achievement.unlocked) {
        return false;
      }
      
      // Search filter
      if (achievementFilters.search) {
        const searchTerm = achievementFilters.search.toLowerCase();
        const searchableText = `${achievement.name} ${achievement.description} ${achievement.tags.join(' ')}`.toLowerCase();
        if (!searchableText.includes(searchTerm)) {
          return false;
        }
      }
      
      return true;
    });
  },
  
  calculateAchievementStats: () => {
    const state = get();
    const achievements = state.achievements;
    
    const unlockedAchievements = achievements.filter(a => a.unlocked);
    const achievementPoints = unlockedAchievements.reduce((total, achievement) => {
      return total + (achievementRarities[achievement.rarity]?.points || 10);
    }, 0);
    
    // Calculate favorite category
    const categoryStats = unlockedAchievements.reduce((stats, achievement) => {
      stats[achievement.category] = (stats[achievement.category] || 0) + 1;
      return stats;
    }, {} as Record<string, number>);
    
    const favoriteCategory = Object.entries(categoryStats).length > 0
      ? Object.entries(categoryStats).reduce((a, b) => a[1] > b[1] ? a : b)[0] as any
      : 'training';
    
    // Get recent unlocks (last 5)
    const recentUnlocks = unlockedAchievements
      .filter(a => a.unlockedAt)
      .sort((a, b) => (b.unlockedAt || 0) - (a.unlockedAt || 0))
      .slice(0, 5);
    
    // Get near completion (80%+ progress, not unlocked)
    const nearCompletion = achievements
      .filter(a => !a.unlocked && a.progress > 0 && (a.progress / a.maxProgress) >= 0.8)
      .sort((a, b) => (b.progress / b.maxProgress) - (a.progress / a.maxProgress))
      .slice(0, 5);
    
    set({
      achievementStats: {
        totalAchievements: achievements.length,
        unlockedAchievements: unlockedAchievements.length,
        achievementPoints,
        completionRate: (unlockedAchievements.length / achievements.length) * 100,
        favoriteCategory,
        recentUnlocks,
        nearCompletion
      }
    });
  },
  
  // Event handlers
  onTrainingCompleted: (_trainingId, score) => {
    const state = get();
    
    // Count-based achievements
    const trainingCompletedCount = state.player?.statistics?.trainingSessionsCompleted || 0;
    state.updateAchievementProgress('first_training', Math.min(trainingCompletedCount, 1));
    state.updateAchievementProgress('training_adept', Math.min(trainingCompletedCount, 10));
    state.updateAchievementProgress('training_master', Math.min(trainingCompletedCount, 50));
    
    // Perfect score achievements
    if (score && score >= 100) {
      state.updateAchievementProgress('perfect_training', 1);
    }
  },
  
  onMissionCompleted: (_missionId, success, score) => {
    const state = get();
    const missionsCompleted = state.player?.statistics?.missionsCompleted || 0;
    
    // Basic mission achievements
    if (success) {
      state.updateAchievementProgress('first_mission', Math.min(missionsCompleted, 1));
      state.updateAchievementProgress('mission_hero', Math.min(missionsCompleted, 25));
      
      // Perfect score
      if (score && score >= 100) {
        state.updateAchievementProgress('flawless_victory', 1);
      }
    }
    
    // Story completion check
    const storyMissions = state.missions?.filter(m => m.type === 'Story') || [];
    const completedStoryMissions = storyMissions.filter(m => m.isCompleted);
    if (completedStoryMissions.length === storyMissions.length && storyMissions.length > 0) {
      state.updateAchievementProgress('story_complete', 1);
    }
  },
  
  onMagicalGirlUnlocked: (_girlId, rarity) => {
    const state = get();
    const unlockedGirls = state.magicalGirls?.filter(g => g.isUnlocked) || [];
    
    state.updateAchievementProgress('first_girl', Math.min(unlockedGirls.length, 1));
    state.updateAchievementProgress('full_team', Math.min(unlockedGirls.length, 5));
    
    // Rarity-based achievements
    if (['Rare', 'Epic', 'Legendary'].includes(rarity)) {
      state.updateAchievementProgress('rare_collector', 1);
    }
    
    if (rarity === 'Legendary') {
      state.updateAchievementProgress('legendary_collector', 1);
    }
  },
  
  onLevelUp: (newLevel) => {
    const state = get();
    
    state.updateAchievementProgress('level_up', Math.min(newLevel, 5));
    state.updateAchievementProgress('veteran_trainer', Math.min(newLevel, 25));
  },
  
  onBondLevelIncreased: (_girlId, newBondLevel) => {
    const state = get();
    
    state.updateAchievementProgress('bond_builder', 1);
    
    if (newBondLevel >= 10) { // Assuming max bond level is 10
      state.updateAchievementProgress('best_friends', 1);
    }
  }
});
