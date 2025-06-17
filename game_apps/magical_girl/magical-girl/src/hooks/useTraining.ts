// Custom hook for training logic - Separation of Concerns

import { useState, useMemo, useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';
import { initialTrainingSessions } from '../data/training';
import type { TrainingType, TrainingDifficulty, TrainingCategory } from '../types/training';

interface UseTrainingFilters {
  searchTerm: string;
  selectedType: TrainingType | 'all';
  selectedDifficulty: TrainingDifficulty | 'all';
  selectedCategory: TrainingCategory | 'all';
  showOnlyUnlocked: boolean;
}

interface ActiveTrainingSessionWithTime {
  id: string;
  trainingName: string;
  girlName: string;
  girlId: string;
  startTime: number;
  duration: number;
  timeRemaining: number;
}

export const useTraining = () => {
  const { 
    startTraining, 
    completeActiveSession,
    updateActiveSessions,
    activeSessions,
    magicalGirls, 
    resources 
  } = useGameStore();
  
  const [filters, setFilters] = useState<UseTrainingFilters>({
    searchTerm: '',
    selectedType: 'all',
    selectedDifficulty: 'all',
    selectedCategory: 'all',
    showOnlyUnlocked: false
  });

  // Auto-update active sessions every second
  useEffect(() => {
    const interval = setInterval(() => {
      updateActiveSessions();
    }, 1000);

    return () => clearInterval(interval);
  }, [updateActiveSessions]);

  // Get all training sessions (in a real app, this might come from the store)
  const allTrainingSessions = useMemo(() => initialTrainingSessions, []);

  // Active sessions with time remaining calculated
  const activeSessionsWithTime = useMemo((): ActiveTrainingSessionWithTime[] => {
    const now = Date.now();
    return activeSessions.map(session => ({
      id: session.id,
      trainingName: session.trainingName,
      girlName: session.girlName,
      girlId: session.girlId,
      startTime: session.startTime,
      duration: session.duration,
      timeRemaining: Math.max(0, Math.floor((session.endTime - now) / 1000))
    }));
  }, [activeSessions]);

  // Filter training sessions based on current filters
  const filteredTrainingSessions = useMemo(() => {
    return allTrainingSessions.filter(session => {
      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          session.name.toLowerCase().includes(searchLower) ||
          session.description.toLowerCase().includes(searchLower) ||
          session.tags.some(tag => tag.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      // Type filter
      if (filters.selectedType !== 'all' && session.type !== filters.selectedType) {
        return false;
      }

      // Difficulty filter
      if (filters.selectedDifficulty !== 'all' && session.difficulty !== filters.selectedDifficulty) {
        return false;
      }

      // Category filter
      if (filters.selectedCategory !== 'all' && session.category !== filters.selectedCategory) {
        return false;
      }

      // Show only unlocked filter
      if (filters.showOnlyUnlocked && !session.isUnlocked) {
        return false;
      }

      return true;
    });
  }, [allTrainingSessions, filters]);

  // Training statistics
  const trainingStats = useMemo(() => {
    const totalSessions = allTrainingSessions.length;
    const completedSessions = allTrainingSessions.filter(s => s.isCompleted).length;
    const totalTimeSpent = allTrainingSessions
      .filter(s => s.isCompleted)
      .reduce((sum, s) => sum + (s.duration * s.completionCount), 0);
    const magicalEnergySpent = allTrainingSessions
      .filter(s => s.isCompleted)
      .reduce((sum, s) => sum + (s.cost.magicalEnergy * s.completionCount), 0);

    return {
      totalSessions,
      completedSessions,
      totalTimeSpent,
      magicalEnergySpent,
      completionRate: totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0
    };
  }, [allTrainingSessions]);

  // Available magical girls for training
  const availableMagicalGirls = useMemo(() => {
    return magicalGirls.filter(girl => girl.isUnlocked);
  }, [magicalGirls]);

  // Can afford training check
  const canAffordTraining = (trainingId: string): boolean => {
    const training = allTrainingSessions.find(t => t.id === trainingId);
    if (!training) return false;
    
    return resources.magicalEnergy >= training.cost.magicalEnergy;
  };

  // Start training with validation
  const handleStartTraining = (trainingId: string, girlId?: string): boolean => {
    const training = allTrainingSessions.find(t => t.id === trainingId);
    if (!training || !training.isUnlocked) return false;

    if (!canAffordTraining(trainingId)) return false;

    // If no specific girl is selected, use the first available one
    const targetGirlId = girlId || availableMagicalGirls[0]?.id;
    if (!targetGirlId) return false;

    return startTraining(targetGirlId, trainingId);
  };

  // Update filters
  const updateFilters = (newFilters: Partial<UseTrainingFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };  return {
    // Data
    allTrainingSessions,
    filteredTrainingSessions,
    trainingStats,
    availableMagicalGirls,
    activeSessions: activeSessionsWithTime,
    filters,
    
    // Actions
    handleStartTraining,
    canAffordTraining,
    updateFilters,
    completeActiveSession,
    updateActiveSessions,
    
    // Utilities
    setSearchTerm: (searchTerm: string) => updateFilters({ searchTerm }),
    setSelectedType: (selectedType: TrainingType | 'all') => updateFilters({ selectedType }),
    setSelectedDifficulty: (selectedDifficulty: TrainingDifficulty | 'all') => updateFilters({ selectedDifficulty }),
    setSelectedCategory: (selectedCategory: TrainingCategory | 'all') => updateFilters({ selectedCategory }),
    setShowOnlyUnlocked: (showOnlyUnlocked: boolean) => updateFilters({ showOnlyUnlocked })
  };
};
