// Achievement type definitions - Type Safety principle
export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  icon: string;
  requirement: AchievementRequirement;
  reward: AchievementReward;
  rarity: AchievementRarity;
  unlocked: boolean;
  unlockedAt?: number;
  progress: number;
  maxProgress: number;
  hidden?: boolean;
  seasonal?: boolean;
  tags: string[];
}

export type AchievementCategory = 
  | 'training' 
  | 'missions' 
  | 'collection' 
  | 'progression' 
  | 'social'
  | 'exploration'
  | 'combat'
  | 'special';

export type AchievementRarity = 
  | 'common'
  | 'uncommon' 
  | 'rare'
  | 'epic'
  | 'legendary'
  | 'mythical';

export interface AchievementRequirement {
  type: 'count' | 'threshold' | 'condition' | 'special' | 'streak' | 'time';
  target: number;
  condition?: string;
  timeframe?: number; // for time-based achievements
  streak?: boolean; // for streak achievements
}

export interface AchievementReward {
  type: 'resources' | 'feature' | 'cosmetic' | 'title' | 'special';
  resources?: {
    sparkles?: number;
    stardust?: number;
    moonbeams?: number;
    magicalEnergy?: number;
    experience?: number;
  };
  feature?: string;
  cosmetic?: {
    type: 'avatar' | 'theme' | 'effect';
    id: string;
  };
  title?: string;
  special?: any;
}

export interface AchievementProgress {
  achievementId: string;
  currentProgress: number;
  lastUpdated: number;
  milestones: AchievementMilestone[];
}

export interface AchievementMilestone {
  threshold: number;
  reached: boolean;
  reachedAt?: number;
  reward?: AchievementReward;
}

export interface AchievementStats {
  totalAchievements: number;
  unlockedAchievements: number;
  achievementPoints: number;
  completionRate: number;
  favoriteCategory: AchievementCategory;
  recentUnlocks: Achievement[];
  nearCompletion: Achievement[];
}

export interface AchievementFilters {
  category: AchievementCategory | 'all';
  rarity: AchievementRarity | 'all';
  status: 'all' | 'unlocked' | 'locked' | 'in-progress';
  search: string;
  showHidden: boolean;
}

export interface AchievementEvent {
  type: string;
  data: any;
  timestamp: number;
}

// Achievement notification types
export interface AchievementNotification {
  achievement: Achievement;
  progress?: {
    current: number;
    previous: number;
    max: number;
  };
  milestone?: AchievementMilestone;
  unlocked?: boolean;
}
