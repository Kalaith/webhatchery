// Custom hook for mission logic - Separation of Concerns

import { useState, useMemo } from 'react';
import { useGameStore } from '../stores/gameStore';
import type { MissionType, MissionCategory, Difficulty } from '../types/missions';

interface UseMissionFilters {
  searchTerm: string;
  selectedType: MissionType | 'all';
  selectedDifficulty: Difficulty | 'all';
  selectedCategory: MissionCategory | 'all';
  showOnlyAvailable: boolean;
  showCompleted: boolean;
}

export const useMissions = () => {
  const { 
    missions,
    activeMission,
    startMission,
    completeMission,
    magicalGirls,
    resources
  } = useGameStore();
  
  const [filters, setFilters] = useState<UseMissionFilters>({
    searchTerm: '',
    selectedType: 'all',
    selectedDifficulty: 'all',
    selectedCategory: 'all',
    showOnlyAvailable: false,
    showCompleted: true
  });

  // Filter missions based on current filters
  const filteredMissions = useMemo(() => {
    return missions.filter(mission => {
      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          mission.name.toLowerCase().includes(searchLower) ||
          mission.description.toLowerCase().includes(searchLower) ||
          mission.location.name.toLowerCase().includes(searchLower) ||
          mission.tags.some(tag => tag.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      // Type filter
      if (filters.selectedType !== 'all' && mission.type !== filters.selectedType) {
        return false;
      }

      // Difficulty filter
      if (filters.selectedDifficulty !== 'all' && mission.difficulty !== filters.selectedDifficulty) {
        return false;
      }

      // Category filter
      if (filters.selectedCategory !== 'all' && mission.category !== filters.selectedCategory) {
        return false;
      }

      // Show only available filter
      if (filters.showOnlyAvailable && (!mission.isUnlocked || !mission.isAvailable)) {
        return false;
      }

      // Show completed filter
      if (!filters.showCompleted && mission.isCompleted) {
        return false;
      }

      return true;
    });
  }, [missions, filters]);

  // Mission statistics
  const missionStats = useMemo(() => {
    const totalMissions = missions.length;
    const completedMissions = missions.filter(m => m.isCompleted).length;
    const activeMissions = activeMission ? 1 : 0;
    const unlockedMissions = missions.filter(m => m.isUnlocked).length;
    
    // Calculate average success rate (simplified)
    const totalAttempts = missions.reduce((sum, m) => sum + m.attempts, 0);
    const averageSuccessRate = totalAttempts > 0 ? (completedMissions / totalAttempts) * 100 : 0;
    
    // Calculate streak (simplified - consecutive completed missions)
    let streakCount = 0;
    for (let i = missions.length - 1; i >= 0; i--) {
      if (missions[i].isCompleted) {
        streakCount++;
      } else {
        break;
      }
    }

    return {
      totalMissions,
      completedMissions,
      activeMissions,
      unlockedMissions,
      averageSuccessRate,
      streakCount,
      totalRewardsEarned: completedMissions * 50 // Simplified calculation
    };
  }, [missions, activeMission]);

  // Available magical girls for missions
  const availableMagicalGirls = useMemo(() => {
    return magicalGirls.filter(girl => girl.isUnlocked);
  }, [magicalGirls]);

  // Can start mission check
  const canStartMission = (missionId: string): boolean => {
    const mission = missions.find(m => m.id === missionId);
    if (!mission || !mission.isUnlocked || !mission.isAvailable) return false;
    
    // Check if there's already an active mission
    if (activeMission) return false;
    
    // Check basic energy requirement (simplified)
    return resources.magicalEnergy >= 30;
  };

  // Start mission with validation
  const handleStartMission = (missionId: string, teamIds: string[] = []): boolean => {
    if (!canStartMission(missionId)) return false;
    
    // Use first available girl if no team specified
    const selectedTeam = teamIds.length > 0 ? teamIds : [availableMagicalGirls[0]?.id].filter(Boolean);
    
    if (selectedTeam.length === 0) return false;

    return startMission(missionId, selectedTeam);
  };

  // Complete active mission
  const handleCompleteMission = (success: boolean = true, score?: number): void => {
    if (!activeMission) return;
    
    completeMission(activeMission.id, success, score);
  };

  // Update filters
  const updateFilters = (newFilters: Partial<UseMissionFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Group missions by type for better organization
  const missionsByType = useMemo(() => {
    const groups: Record<string, typeof filteredMissions> = {};
    
    filteredMissions.forEach(mission => {
      if (!groups[mission.type]) {
        groups[mission.type] = [];
      }
      groups[mission.type].push(mission);
    });
    
    return groups;
  }, [filteredMissions]);

  return {
    // Data
    missions: filteredMissions,
    missionsByType,
    activeMission,
    missionStats,
    availableMagicalGirls,
    filters,
    
    // Actions
    handleStartMission,
    handleCompleteMission,
    canStartMission,
    updateFilters,
    
    // Utilities
    setSearchTerm: (searchTerm: string) => updateFilters({ searchTerm }),
    setSelectedType: (selectedType: MissionType | 'all') => updateFilters({ selectedType }),
    setSelectedDifficulty: (selectedDifficulty: Difficulty | 'all') => updateFilters({ selectedDifficulty }),
    setSelectedCategory: (selectedCategory: MissionCategory | 'all') => updateFilters({ selectedCategory }),
    setShowOnlyAvailable: (showOnlyAvailable: boolean) => updateFilters({ showOnlyAvailable }),
    setShowCompleted: (showCompleted: boolean) => updateFilters({ showCompleted })
  };
};
