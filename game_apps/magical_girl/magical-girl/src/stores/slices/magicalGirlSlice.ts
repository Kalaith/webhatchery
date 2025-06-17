// Magical Girl management slice - Single Responsibility Principle
import type { StateCreator } from 'zustand';
import type { MagicalGirl } from '../../types';
import { initialMagicalGirls } from '../../data/magicalGirls';

export interface MagicalGirlSlice {
  // State
  magicalGirls: MagicalGirl[];
  
  // Actions
  unlockMagicalGirl: (girlId: string) => void;
  levelUpMagicalGirl: (girlId: string) => boolean;
  addExperienceToGirl: (girlId: string, experience: number) => void;
  increaseBond: (girlId: string, amount: number) => void;
}

export const createMagicalGirlSlice: StateCreator<
  MagicalGirlSlice & { 
    addNotification: (notification: any) => void;
    checkAchievements?: (event: any) => void;
  },
  [],
  [],
  MagicalGirlSlice
> = (set, get) => ({
  magicalGirls: initialMagicalGirls,
  
  unlockMagicalGirl: (girlId) => set((state) => {
    const updatedGirls = state.magicalGirls.map(girl => {
      if (girl.id === girlId && !girl.isUnlocked) {
        const unlockedGirl = {
          ...girl,
          isUnlocked: true,
          unlockedAt: Date.now()
        };
          // Add notification
        get().addNotification({
          type: 'success',
          title: 'New Magical Girl!',
          message: `${girl.name} has joined your team!`
        });
        
        // Trigger achievement event
        const state = get();
        if (state.checkAchievements) {
          state.checkAchievements({
            type: 'magical_girl_unlocked',
            data: { 
              girlId,
              girlName: girl.name,
              rarity: girl.rarity
            },
            timestamp: Date.now()
          });
        }
        
        return unlockedGirl;
      }
      return girl;
    });
    
    return { magicalGirls: updatedGirls };
  }),
  
  levelUpMagicalGirl: (girlId) => {
    const state = get();
    const girl = state.magicalGirls.find(g => g.id === girlId);
    
    if (!girl || girl.experience < girl.experienceToNext) {
      return false;
    }
    
    set((currentState) => {
      const updatedGirls = currentState.magicalGirls.map(g => {
        if (g.id === girlId) {
          const newLevel = g.level + 1;
          const remainingExp = g.experience - g.experienceToNext;
          const newExpToNext = Math.floor(100 * Math.pow(1.4, newLevel - 1));
          
          // Calculate stat increases based on rarity
          const statIncrease = g.rarity === 'Common' ? 1 : 
                             g.rarity === 'Uncommon' ? 2 :
                             g.rarity === 'Rare' ? 3 :
                             g.rarity === 'Epic' ? 4 : 
                             g.rarity === 'Legendary' ? 5 : 6;
          
          // Random stat increases
          const statsToIncrease = Math.floor(Math.random() * 3) + 2; // 2-4 stats
          const statKeys = Object.keys(g.stats) as (keyof typeof g.stats)[];
          const newStats = { ...g.stats };
          
          for (let i = 0; i < statsToIncrease; i++) {
            const randomStat = statKeys[Math.floor(Math.random() * statKeys.length)];
            newStats[randomStat] += statIncrease;
          }
          
          return {
            ...g,
            level: newLevel,
            experience: remainingExp,
            experienceToNext: newExpToNext,
            stats: newStats
          };
        }
        return g;
      });
      
      return { magicalGirls: updatedGirls };
    });    get().addNotification({
      type: 'success',
      title: 'Level Up!',
      message: `${girl.name} reached level ${girl.level + 1}!`
    });
    
    // Trigger achievement event
    const currentState = get();
    if (currentState.checkAchievements) {
      currentState.checkAchievements({
        type: 'level_up',
        data: { 
          girlId,
          girlName: girl.name,
          oldLevel: girl.level,
          newLevel: girl.level + 1
        },
        timestamp: Date.now()
      });
    }
    
    return true;
  },
  
  addExperienceToGirl: (girlId, experience) => set((state) => {
    const updatedGirls = state.magicalGirls.map(girl => {
      if (girl.id === girlId) {
        const newExperience = girl.experience + experience;
        const updatedGirl = { ...girl, experience: newExperience };
        
        // Check for level up after updating experience
        if (newExperience >= girl.experienceToNext) {
          // Level up will be handled by the levelUpMagicalGirl function
          setTimeout(() => {
            get().levelUpMagicalGirl(girlId);
          }, 0);
        }
        
        return updatedGirl;
      }
      return girl;
    });
    
    return { magicalGirls: updatedGirls };
  }),
  
  increaseBond: (girlId, amount) => set((state) => {
    const updatedGirls = state.magicalGirls.map(girl => {
      if (girl.id === girlId) {
        const newBondExp = girl.bondExperience + amount;
        const requiredExp = girl.bondLevel * 50;
        
        if (newBondExp >= requiredExp) {
          const newBondLevel = girl.bondLevel + 1;
          const remainingBondExp = newBondExp - requiredExp;
            get().addNotification({
            type: 'info',
            title: 'Bond Level Up!',
            message: `Your bond with ${girl.name} has grown stronger!`
          });
          
          // Trigger achievement event
          const currentState = get();
          if (currentState.checkAchievements) {
            currentState.checkAchievements({
              type: 'bond_increased',
              data: { 
                girlId,
                girlName: girl.name,
                oldBondLevel: girl.bondLevel,
                newBondLevel: newBondLevel
              },
              timestamp: Date.now()
            });
          }
          
          return {
            ...girl,
            bondLevel: newBondLevel,
            bondExperience: remainingBondExp
          };
        }
        
        return { ...girl, bondExperience: newBondExp };
      }
      return girl;
    });
    
    return { magicalGirls: updatedGirls };
  })
});
