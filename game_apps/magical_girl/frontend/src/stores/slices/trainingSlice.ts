// Training management slice - Single Responsibility Principle
import type { StateCreator } from 'zustand';
import { initialTrainingSessions } from '../../data/training';

export interface ActiveTrainingSession {
  id: string;
  trainingId: string;
  trainingName: string;
  girlId: string;
  girlName: string;
  startTime: number;
  duration: number; // in seconds
  endTime: number;
}

export interface TrainingSlice {
  activeSessions: ActiveTrainingSession[];
  
  // Actions
  startTraining: (girlId: string, trainingId: string) => boolean;
  completeTraining: (girlId: string, trainingId: string) => void;
  completeActiveSession: (sessionId: string) => void;
  updateActiveSessions: () => void;
}

export const createTrainingSlice: StateCreator<
  TrainingSlice & { 
    addNotification: (notification: any) => void;
    spendResources: (resources: any) => boolean;
    addExperienceToGirl: (girlId: string, experience: number) => void;
    gainExperience: (amount: number) => void;
    addResources: (resources: any) => void;
    magicalGirls: any[];
    checkAchievements?: (event: any) => void;
  },
  [],
  [],
  TrainingSlice
> = (set, get) => ({
  activeSessions: [],
  
  startTraining: (girlId, trainingId) => {
    const state = get();
    const girl = state.magicalGirls.find((g: any) => g.id === girlId);
    const training = initialTrainingSessions.find(t => t.id === trainingId);
    
    if (!girl || !training || !girl.isUnlocked) {
      state.addNotification({
        type: 'error',
        title: 'Training Failed',
        message: 'Unable to start training session'
      });
      return false;
    }
    
    const cost = { magicalEnergy: training.cost.magicalEnergy };
    if (!state.spendResources(cost)) {
      state.addNotification({
        type: 'error',
        title: 'Insufficient Energy',
        message: 'Not enough magical energy to start training'
      });
      return false;
    }
    
    // Create active training session
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();
    const newSession: ActiveTrainingSession = {
      id: sessionId,
      trainingId,
      trainingName: training.name,
      girlId,
      girlName: girl.name,
      startTime: now,
      duration: training.duration,
      endTime: now + (training.duration * 1000)
    };
    
    set((state) => ({
      activeSessions: [...state.activeSessions, newSession]
    }));

    state.addNotification({
      type: 'info',
      title: 'Training Started',
      message: `${girl.name} has started ${training.name}`
    });
    
    return true;
  },  
  
  completeTraining: (girlId, trainingId) => {
    const training = initialTrainingSessions.find(t => t.id === trainingId);
    if (!training) return;
    
    const state = get();
    
    // Apply training effects
    training.effects.forEach(effect => {
      if (effect.type === 'stat_increase' && Math.random() < effect.probability) {
        // Apply stat increase (simplified)
        state.addExperienceToGirl(girlId, 10);
      }
    });
    
    // Give rewards
    training.rewards.forEach(reward => {
      if (Math.random() < reward.probability) {
        if (reward.type === 'experience') {
          state.gainExperience(reward.quantity);
        } else if (reward.type === 'sparkles') {
          state.addResources({ sparkles: reward.quantity });
        }
      }
    });

    state.addNotification({
      type: 'success',
      title: 'Training Complete!',
      message: `Training session completed successfully!`
    });
    
    // Trigger achievement event
    if (state.checkAchievements) {
      state.checkAchievements({
        type: 'training_completed',
        data: { 
          trainingId, 
          girlId,
          score: 100 // Placeholder score
        },
        timestamp: Date.now()
      });
    }
  },
  
  completeActiveSession: (sessionId) => {
    const state = get();
    const session = state.activeSessions.find(s => s.id === sessionId);
    if (!session) return;
    
    // Complete the training
    state.completeTraining(session.girlId, session.trainingId);
    
    // Remove from active sessions
    set((state) => ({
      activeSessions: state.activeSessions.filter(s => s.id !== sessionId)
    }));
  },
  
  updateActiveSessions: () => {
    const now = Date.now();
    const state = get();
    
    // Find completed sessions
    const completedSessions = state.activeSessions.filter(session => now >= session.endTime);
    
    // Auto-complete them
    completedSessions.forEach(session => {
      state.completeActiveSession(session.id);
    });
  }
});