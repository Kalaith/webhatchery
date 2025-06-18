// Mission management slice - Single Responsibility Principle
import type { StateCreator } from 'zustand';
import type { Mission } from '../../types';
import { initialMissions } from '../../data/missions';

export interface MissionSlice {
  // State
  missions: Mission[];
  activeMission: Mission | null;
  missionStartTime: number | null;
  
  // Actions
  startMission: (missionId: string, teamIds: string[]) => boolean;
  completeMission: (missionId: string, success: boolean, score?: number) => void;
  unlockMission: (missionId: string) => void;
  updateMissionProgress: (missionId: string, objectiveId: string, progress: number) => void;
}

export const createMissionSlice: StateCreator<
  MissionSlice & { 
    addNotification: (notification: any) => void;
    spendResources: (resources: any) => boolean;
    gainExperience: (amount: number) => void;
    addResources: (resources: any) => void;
    checkAchievements?: (event: any) => void;
  },
  [],
  [],
  MissionSlice
> = (set, get) => ({
  missions: initialMissions,
  activeMission: null,
  missionStartTime: null,
  
  startMission: (missionId, teamIds) => {
    const state = get();
    const mission = state.missions.find(m => m.id === missionId);
    
    if (!mission || !mission.isUnlocked || !mission.isAvailable) {
      state.addNotification({
        type: 'error',
        title: 'Mission Unavailable',
        message: 'This mission is not available'
      });
      return false;
    }
    
    // Check energy cost (simplified)
    const energyCost = 30;
    if (!state.spendResources({ magicalEnergy: energyCost })) {
      state.addNotification({
        type: 'error',
        title: 'Insufficient Energy',
        message: 'Not enough energy to start mission'
      });
      return false;
    }
    
    // Validate team requirements
    if (teamIds.length === 0) {
      state.addNotification({
        type: 'error',
        title: 'No Team Selected',
        message: 'Please select at least one magical girl for the mission'
      });
      return false;
    }
    
    set({ 
      activeMission: mission,
      missionStartTime: Date.now()
    });
    
    // Simulate mission completion (simplified)
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate
      get().completeMission(missionId, success);
    }, 10000); // 10 seconds for demo
    
    state.addNotification({
      type: 'info',
      title: 'Mission Started',
      message: `Started mission: ${mission.name}`
    });
    
    return true;
  },
  completeMission: (missionId, success, score) => {
    const state = get();
    const mission = state.missions.find(m => m.id === missionId);
    
    if (!mission) return;
    
    // Create mission score object
    const missionScore: any = score || {
      total: success ? 100 : 0,
      breakdown: {
        objectives: success ? 50 : 0,
        time: success ? 30 : 0,
        efficiency: success ? 20 : 0,
        style: 0,
        survival: 0,
        special: 0
      },
      grade: success ? 'A' : 'F',
      bonuses: [],
      penalties: [],
      rank: 1,
      percentile: success ? 85 : 0
    };
    
    set((currentState) => {
      const updatedMissions = currentState.missions.map(m => {
        if (m.id === missionId) {
          return {
            ...m,
            isCompleted: success ? true : m.isCompleted,
            completedAt: success ? Date.now() : m.completedAt,
            attempts: m.attempts + 1,
            bestScore: m.bestScore ? 
              (m.bestScore.total > missionScore.total ? m.bestScore : missionScore) : 
              missionScore
          };
        }
        return m;
      });
      
      return {
        ...currentState,
        missions: updatedMissions,
        activeMission: null,
        missionStartTime: null
      };
    });
    
    if (success) {
      // Give rewards
      mission.rewards.forEach(reward => {
        if (reward.guaranteed || Math.random() < reward.probability) {
          if (reward.type === 'experience') {
            state.gainExperience(reward.quantity);
          } else if (reward.type === 'sparkles') {
            state.addResources({ sparkles: reward.quantity });
          } else if (reward.type === 'stardust') {
            state.addResources({ stardust: reward.quantity });
          }
        }
      });
        state.addNotification({
        type: 'success',
        title: 'Mission Complete!',
        message: `Successfully completed ${mission.name}! Score: ${missionScore.total}`
      });
      
      // Trigger achievement event
      if (state.checkAchievements) {
        state.checkAchievements({
          type: 'mission_completed',
          data: { 
            missionId, 
            success: true,
            score: missionScore.total,
            grade: missionScore.grade,
            attempts: mission.attempts + 1
          },
          timestamp: Date.now()
        });
      }
      
      // Unlock next missions if this was a story mission
      if (mission.type === 'Story') {
        const nextMissionIndex = initialMissions.findIndex(m => m.id === missionId) + 1;
        if (nextMissionIndex < initialMissions.length) {
          get().unlockMission(initialMissions[nextMissionIndex].id);
        }
      }
    } else {
      state.addNotification({
        type: 'error',
        title: 'Mission Failed',
        message: `Failed to complete ${mission.name}. Try again!`
      });
    }
  },
  
  unlockMission: (missionId) => set((state) => {
    const updatedMissions = state.missions.map(mission => {
      if (mission.id === missionId && !mission.isUnlocked) {
        get().addNotification({
          type: 'info',
          title: 'New Mission Available!',
          message: `${mission.name} is now available!`
        });
        
        return { ...mission, isUnlocked: true };
      }
      return mission;
    });
      return { missions: updatedMissions };
  }),
  
  updateMissionProgress: (missionId, objectiveId, progress) => set((state) => {
    const updatedMissions = state.missions.map(mission => {
      if (mission.id === missionId) {
        const updatedObjectives = mission.objectives.map(objective => {
          if (objective.id === objectiveId) {
            const newProgress = Math.min(progress, objective.maxProgress);
            return {
              ...objective,
              progress: newProgress,
              isCompleted: newProgress >= objective.maxProgress
            };
          }
          return objective;
        });
        
        return { ...mission, objectives: updatedObjectives };
      }
      return mission;
    });
    
    return { missions: updatedMissions };
  })
});
