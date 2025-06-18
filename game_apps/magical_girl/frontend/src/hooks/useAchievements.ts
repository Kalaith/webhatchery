// Achievement business logic hook - Separation of Concerns principle
import { useMemo } from 'react';
import { useGameStore } from '../stores/gameStore';
import type { Achievement, AchievementFilters } from '../types/achievements';
import { achievementCategories, achievementRarities } from '../data/achievements';

export const useAchievements = () => {
  const {
    achievements,
    achievementStats,
    achievementFilters,
    recentlyUnlocked,
    unlockAchievement,
    updateAchievementProgress,
    checkAchievements,
    resetAchievementProgress,
    setAchievementFilters,
    resetAchievementFilters,
    getFilteredAchievements,
    calculateAchievementStats
  } = useGameStore();

  // Memoized filtered achievements
  const filteredAchievements = useMemo(() => {
    return getFilteredAchievements();
  }, [achievements, achievementFilters, getFilteredAchievements]);

  // Group achievements by category
  const achievementsByCategory = useMemo(() => {
    return filteredAchievements.reduce((groups, achievement) => {
      const category = achievement.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(achievement);
      return groups;
    }, {} as Record<string, Achievement[]>);
  }, [filteredAchievements]);

  // Group achievements by rarity
  const achievementsByRarity = useMemo(() => {
    return filteredAchievements.reduce((groups, achievement) => {
      const rarity = achievement.rarity;
      if (!groups[rarity]) {
        groups[rarity] = [];
      }
      groups[rarity].push(achievement);
      return groups;
    }, {} as Record<string, Achievement[]>);
  }, [filteredAchievements]);

  // Get achievements by status
  const achievementsByStatus = useMemo(() => {
    const unlocked = filteredAchievements.filter(a => a.unlocked);
    const inProgress = filteredAchievements.filter(a => !a.unlocked && a.progress > 0);
    const locked = filteredAchievements.filter(a => !a.unlocked && a.progress === 0);
    
    return { unlocked, inProgress, locked };
  }, [filteredAchievements]);

  // Calculate completion percentage for specific category
  const getCategoryCompletion = (category: string) => {
    const categoryAchievements = achievements.filter(a => a.category === category);
    const unlockedInCategory = categoryAchievements.filter(a => a.unlocked).length;
    return categoryAchievements.length > 0 ? (unlockedInCategory / categoryAchievements.length) * 100 : 0;
  };

  // Calculate rarity completion percentage
  const getRarityCompletion = (rarity: string) => {
    const rarityAchievements = achievements.filter(a => a.rarity === rarity);
    const unlockedInRarity = rarityAchievements.filter(a => a.unlocked).length;
    return rarityAchievements.length > 0 ? (unlockedInRarity / rarityAchievements.length) * 100 : 0;
  };

  // Get next achievement to unlock (highest progress)
  const getNextAchievement = () => {
    const inProgress = achievements
      .filter(a => !a.unlocked && a.progress > 0)
      .sort((a, b) => (b.progress / b.maxProgress) - (a.progress / a.maxProgress));
    
    return inProgress[0] || null;
  };

  // Get recent achievements (last 5 unlocked)
  const getRecentAchievements = () => {
    return achievements
      .filter(a => a.unlocked && a.unlockedAt)
      .sort((a, b) => (b.unlockedAt || 0) - (a.unlockedAt || 0))
      .slice(0, 5);
  };

  // Get achievements close to completion (80%+ progress)
  const getNearCompletionAchievements = () => {
    return achievements
      .filter(a => !a.unlocked && a.progress > 0 && (a.progress / a.maxProgress) >= 0.8)
      .sort((a, b) => (b.progress / b.maxProgress) - (a.progress / a.maxProgress));
  };

  // Search functionality
  const searchAchievements = (searchTerm: string) => {
    if (!searchTerm.trim()) return achievements;
    
    const term = searchTerm.toLowerCase();
    return achievements.filter(achievement => 
      achievement.name.toLowerCase().includes(term) ||
      achievement.description.toLowerCase().includes(term) ||
      achievement.tags.some(tag => tag.toLowerCase().includes(term)) ||
      achievement.category.toLowerCase().includes(term)
    );
  };

  // Filter helper functions
  const handleSearchChange = (search: string) => {
    setAchievementFilters({ search });
  };

  const handleCategoryChange = (category: AchievementFilters['category']) => {
    setAchievementFilters({ category });
  };

  const handleRarityChange = (rarity: AchievementFilters['rarity']) => {
    setAchievementFilters({ rarity });
  };

  const handleStatusChange = (status: AchievementFilters['status']) => {
    setAchievementFilters({ status });
  };

  const handleShowHiddenChange = (showHidden: boolean) => {
    setAchievementFilters({ showHidden });
  };

  const clearAllFilters = () => {
    resetAchievementFilters();
  };

  // Achievement progress formatting
  const formatProgress = (progress: number, maxProgress: number) => {
    if (maxProgress <= 1) {
      return progress >= maxProgress ? 'Complete' : 'Incomplete';
    }
    return `${progress}/${maxProgress}`;
  };

  const getProgressPercentage = (progress: number, maxProgress: number) => {
    return Math.min((progress / maxProgress) * 100, 100);
  };

  // Achievement rarity styling
  const getRarityStyle = (rarity: string) => {
    const rarityConfig = achievementRarities[rarity as keyof typeof achievementRarities];
    return {
      color: rarityConfig?.color || '#95A5A6',
      glow: rarityConfig?.glow || 'shadow-sm'
    };
  };

  // Category styling
  const getCategoryStyle = (category: string) => {
    const categoryConfig = achievementCategories[category as keyof typeof achievementCategories];
    return {
      color: categoryConfig?.color || '#95A5A6',
      icon: categoryConfig?.icon || '🏆'
    };
  };

  // Calculate total achievement points
  const getTotalPoints = () => {
    return achievements
      .filter(a => a.unlocked)
      .reduce((total, achievement) => {
        const rarityConfig = achievementRarities[achievement.rarity as keyof typeof achievementRarities];
        return total + (rarityConfig?.points || 10);
      }, 0);
  };

  // Get achievement by ID
  const getAchievementById = (id: string) => {
    return achievements.find(a => a.id === id);
  };

  // Check if achievement is hidden and should be shown
  const shouldShowAchievement = (achievement: Achievement) => {
    if (!achievement.hidden) return true;
    return achievement.unlocked || achievementFilters.showHidden;
  };

  // Sort achievements by various criteria
  const sortAchievements = (achievementList: Achievement[], sortBy: 'name' | 'progress' | 'rarity' | 'category' | 'unlock-date') => {
    const sorted = [...achievementList];
    
    switch (sortBy) {
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'progress':
        return sorted.sort((a, b) => {
          const aProgress = a.progress / a.maxProgress;
          const bProgress = b.progress / b.maxProgress;
          return bProgress - aProgress;
        });
      case 'rarity':
        const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythical'];
        return sorted.sort((a, b) => {
          const aIndex = rarityOrder.indexOf(a.rarity);
          const bIndex = rarityOrder.indexOf(b.rarity);
          return bIndex - aIndex;
        });
      case 'category':
        return sorted.sort((a, b) => a.category.localeCompare(b.category));
      case 'unlock-date':
        return sorted.sort((a, b) => {
          if (!a.unlocked && !b.unlocked) return 0;
          if (!a.unlocked) return 1;
          if (!b.unlocked) return -1;
          return (b.unlockedAt || 0) - (a.unlockedAt || 0);
        });
      default:
        return sorted;
    }
  };

  return {
    // Data
    achievements,
    filteredAchievements,
    achievementStats,
    achievementFilters,
    recentlyUnlocked,
    achievementsByCategory,
    achievementsByRarity,
    achievementsByStatus,
    
    // Actions
    unlockAchievement,
    updateAchievementProgress,
    checkAchievements,
    resetAchievementProgress,
    
    // Filters
    handleSearchChange,
    handleCategoryChange,
    handleRarityChange,
    handleStatusChange,
    handleShowHiddenChange,
    clearAllFilters,
    setAchievementFilters,
    resetAchievementFilters,
    
    // Utilities
    searchAchievements,
    getCategoryCompletion,
    getRarityCompletion,
    getNextAchievement,
    getRecentAchievements,
    getNearCompletionAchievements,
    formatProgress,
    getProgressPercentage,
    getRarityStyle,
    getCategoryStyle,
    getTotalPoints,
    getAchievementById,
    shouldShowAchievement,
    sortAchievements,
    calculateAchievementStats
  };
};
