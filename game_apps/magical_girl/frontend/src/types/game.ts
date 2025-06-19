// Core game types and interfaces
import type { MagicalGirl, MagicalGirlStats } from './magicalGirl';
import type { Mission } from './missions';

export interface GameState {
  player: Player;
  magicalGirls: MagicalGirl[];
  missions: Mission[];
  activeMission: Mission | null;
  notifications: Notification[];
  gameTime: number;
  lastSaveTime: number;
  version: string;
}

export interface Player {
  id: string;
  name: string;
  resources: Resources;
  unlockedFeatures: UnlockedFeatures;
  achievements: Achievement[];
  statistics: PlayerStatistics;
  preferences: PlayerPreferences;
}

export interface Resources {
  magicalEnergy: number;
  maxMagicalEnergy: number;
  sparkles: number;
  stardust: number;
  moonbeams: number;
  crystals: number;
  experience: number;
  level: number;
}

export interface UnlockedFeatures {
  training: boolean;
  missions: boolean;
  advancedTraining: boolean;
  teamMissions: boolean;
  transformation: boolean;
  specialPowers: boolean;
  craftingWorkshop: boolean;
  magicalGarden: boolean;
}

export interface PlayerStatistics {
  totalPlayTime: number;
  missionsCompleted: number;
  trainingSessionsCompleted: number;
  totalMagicalEnergySpent: number;
  totalSparklesEarned: number;
  transformationsPerformed: number;
  criticalSuccesses: number;
  perfectMissions: number;
}

export interface PlayerPreferences {
  autoSave: boolean;
  soundEnabled: boolean;
  animationsEnabled: boolean;
  notificationsEnabled: boolean;
  theme: 'light' | 'dark' | 'auto';
  language: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  requirement: AchievementRequirement;
  reward: AchievementReward;
  unlocked: boolean;
  unlockedAt?: number;
  progress: number;
  maxProgress: number;
}

export type AchievementCategory = 
  | 'training' 
  | 'missions' 
  | 'collection' 
  | 'progression' 
  | 'special' 
  | 'exploration';

export interface AchievementRequirement {
  type: 'count' | 'threshold' | 'condition' | 'special';
  target: number;
  condition?: string;
}

export interface AchievementReward {
  type: 'resources' | 'feature' | 'cosmetic' | 'special';
  value: any;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
  duration?: number;
  actions?: NotificationAction[];
  read: boolean;
}

export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'achievement';

export interface NotificationAction {
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary' | 'danger';
}

// Game mechanics types
export interface GameEvent {
  id: string;
  type: GameEventType;
  timestamp: number;
  data: any;
  processed: boolean;
}

export type GameEventType = 
  | 'mission_complete' 
  | 'training_complete' 
  | 'level_up' 
  | 'achievement_unlock' 
  | 'transformation' 
  | 'resource_gained' 
  | 'feature_unlock';

export interface GameConfig {
  version: string;
  resourceLimits: ResourceLimits;
  costs: GameCosts;
  rewards: GameRewards;
  timeMultipliers: TimeMultipliers;
  balanceSettings: BalanceSettings;
}

export interface ResourceLimits {
  maxMagicalEnergy: number;
  maxSparkles: number;
  maxStardust: number;
  maxMoonbeams: number;
  maxCrystals: number;
}

export interface GameCosts {
  training: TrainingCosts;
  missions: MissionCosts;
  transformation: TransformationCosts;
  upgrades: UpgradeCosts;
}

export interface GameRewards {
  training: TrainingRewards;
  missions: MissionRewards;
  achievements: AchievementRewards;
}

export interface TrainingCosts {
  basic: number;
  intermediate: number;
  advanced: number;
  special: number;
}

export interface MissionCosts {
  easy: number;
  medium: number;
  hard: number;
  extreme: number;
}

export interface TransformationCosts {
  basic: number;
  advanced: number;
  ultimate: number;
}

export interface UpgradeCosts {
  statBoost: number;
  newAbility: number;
  equipment: number;
}

export interface TrainingRewards {
  experience: number;
  sparkles: number;
  statGain: number;
}

export interface MissionRewards {
  baseExperience: number;
  baseSparkles: number;
  bonusMultiplier: number;
}

export interface AchievementRewards {
  small: Resources;
  medium: Resources;
  large: Resources;
  legendary: Resources;
}

export interface TimeMultipliers {
  training: number;
  missions: number;
  recovery: number;
  energy: number;
}

export interface BalanceSettings {
  experienceScale: number;
  difficultyScale: number;
  rewardScale: number;
  costScale: number;
}

// Utility types
export type ResourceType = keyof Resources;
export type StatType = keyof MagicalGirlStats;
export type GameMode = 'normal' | 'tutorial' | 'sandbox';
export type SaveFormat = 'json' | 'compressed';

export interface SaveData {
  version: string;
  timestamp: number;
  gameState: GameState;
  checksum?: string;
}

export interface GameAction {
  type: string;
  payload?: any;
  timestamp?: number;
}
