// Training system types and interfaces
export interface TrainingSession {
  id: string;
  name: string;
  description: string;
  type: TrainingType;
  category: TrainingCategory;
  difficulty: TrainingDifficulty;
  duration: number; // in seconds
  cost: TrainingCost;
  requirements: TrainingRequirement[];
  effects: TrainingEffect[];
  rewards: TrainingReward[];
  unlockConditions: UnlockCondition[];
  isUnlocked: boolean;
  isCompleted: boolean;
  completionCount: number;
  bestScore?: TrainingScore;
  tags: TrainingTag[];
  instructor?: TrainingInstructor;
}

export type TrainingType = 
  | 'Basic' 
  | 'Combat' 
  | 'Magic' 
  | 'Physical' 
  | 'Mental' 
  | 'Spiritual' 
  | 'Elemental' 
  | 'Team' 
  | 'Special' 
  | 'Advanced';

export type TrainingCategory = 
  | 'Stat_Boost' 
  | 'Skill_Development' 
  | 'Ability_Training' 
  | 'Endurance' 
  | 'Focus' 
  | 'Transformation' 
  | 'Combat_Technique' 
  | 'Magic_Control' 
  | 'Team_Coordination' 
  | 'Leadership';

export type TrainingDifficulty = 
  | 'Beginner' 
  | 'Novice' 
  | 'Intermediate' 
  | 'Advanced' 
  | 'Expert' 
  | 'Master' 
  | 'Legendary';

export interface TrainingCost {
  magicalEnergy: number;
  sparkles?: number;
  stardust?: number;
  time: number; // in minutes
  special?: SpecialTrainingCost[];
}

export interface SpecialTrainingCost {
  type: 'item' | 'condition' | 'cooldown';
  requirement: string;
  value: any;
}

export interface TrainingRequirement {
  type: TrainingRequirementType;
  value: any;
  description: string;
}

export type TrainingRequirementType = 
  | 'level' 
  | 'stat' 
  | 'ability' 
  | 'magical_girl' 
  | 'training_completed' 
  | 'mission_completed' 
  | 'achievement' 
  | 'item' 
  | 'time_of_day' 
  | 'energy_level';

export interface TrainingEffect {
  type: TrainingEffectType;
  target: TrainingTarget;
  value: number | string;
  probability: number;
  duration?: number;
  scaling?: EffectScaling;
  condition?: string;
}

export type TrainingEffectType = 
  | 'stat_increase' 
  | 'stat_temporary' 
  | 'ability_unlock' 
  | 'ability_upgrade' 
  | 'experience_gain' 
  | 'skill_point' 
  | 'transformation_progress' 
  | 'bond_increase' 
  | 'mood_change' 
  | 'special';

export type TrainingTarget = 'self' | 'all_team' | 'specific_girl' | 'random_girl';

export interface EffectScaling {
  basedOn: string; // 'level', 'stat', 'training_count', etc.
  formula: string;
  cap?: number;
}

export interface TrainingReward {
  type: TrainingRewardType;
  item: string;
  quantity: number;
  probability: number;
  condition?: string;
  scaling?: RewardScaling;
}

export type TrainingRewardType = 
  | 'experience' 
  | 'sparkles' 
  | 'stardust' 
  | 'skill_points' 
  | 'ability_fragment' 
  | 'equipment' 
  | 'consumable' 
  | 'special';

export interface RewardScaling {
  factor: string;
  multiplier: number;
  base: number;
}

export interface UnlockCondition {
  type: 'level' | 'training' | 'mission' | 'achievement' | 'special';
  value: any;
  description: string;
}

export type TrainingTag = 
  | 'solo' 
  | 'group' 
  | 'combat' 
  | 'peaceful' 
  | 'intensive' 
  | 'relaxed' 
  | 'elemental' 
  | 'physical' 
  | 'mental' 
  | 'repeatable' 
  | 'daily' 
  | 'special' 
  | 'dangerous' 
  | 'safe'
  | 'magic'
  | 'social'
  | 'transformation';

export interface TrainingInstructor {
  id: string;
  name: string;
  specialization: TrainingType[];
  bonuses: InstructorBonus[];
  availability: InstructorAvailability;
  personality: InstructorPersonality;
  relationship: number; // with player
}

export interface InstructorBonus {
  type: 'experience' | 'success_rate' | 'cost_reduction' | 'special_unlock';
  value: number;
  condition?: string;
}

export interface InstructorAvailability {
  timeSlots: TimeSlot[];
  days: DayOfWeek[];
  seasons: Season[];
  special?: AvailabilityCondition[];
}

export interface TimeSlot {
  start: number; // hour
  end: number; // hour
  efficiency: number; // multiplier
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter';

export interface AvailabilityCondition {
  type: string;
  condition: string;
  effect: 'available' | 'unavailable' | 'bonus';
}

export interface InstructorPersonality {
  traits: string[];
  teachingStyle: TeachingStyle;
  favoriteStudents: string[];
  specialQuirks: string[];
}

export type TeachingStyle = 'Strict' | 'Encouraging' | 'Patient' | 'Demanding' | 'Friendly' | 'Professional';

// Training progress and results
export interface TrainingProgress {
  sessionId: string;
  girlId: string;
  status: TrainingStatus;
  startTime: number;
  currentTime: number;
  totalTime: number;
  progress: number; // 0-1
  events: TrainingEvent[];
  modifiers: TrainingModifier[];
  currentStats: any;
  score: TrainingScore;
}

export type TrainingStatus = 'not_started' | 'in_progress' | 'paused' | 'completed' | 'failed' | 'cancelled';

export interface TrainingEvent {
  type: TrainingEventType;
  timestamp: number;
  description: string;
  effect?: any;
  critical?: boolean;
}

export type TrainingEventType = 
  | 'start' 
  | 'milestone' 
  | 'breakthrough' 
  | 'setback' 
  | 'critical_success' 
  | 'critical_failure' 
  | 'instructor_intervention' 
  | 'special_event' 
  | 'completion';

export interface TrainingModifier {
  type: string;
  name: string;
  description: string;
  effect: number; // multiplier
  duration: number;
  source: string;
}

export interface TrainingScore {
  total: number;
  breakdown: TrainingScoreBreakdown;
  grade: TrainingGrade;
  improvements: StatImprovement[];
  bonuses: ScoreBonus[];
}

export interface TrainingScoreBreakdown {
  effort: number;
  technique: number;
  focus: number;
  improvement: number;
  consistency: number;
  instructor: number;
}

export type TrainingGrade = 'F' | 'D' | 'C' | 'B' | 'A' | 'S' | 'Perfect';

export interface StatImprovement {
  stat: string;
  before: number;
  after: number;
  improvement: number;
  percentage: number;
}

export interface ScoreBonus {
  type: string;
  name: string;
  value: number;
  description: string;
}

// Training facilities and equipment
export interface TrainingFacility {
  id: string;
  name: string;
  description: string;
  type: FacilityType;
  level: number;
  maxLevel: number;
  bonuses: FacilityBonus[];
  capacity: number;
  currentUsers: string[]; // girl IDs
  maintenance: FacilityMaintenance;
  upgrades: FacilityUpgrade[];
  requirements: FacilityRequirement[];
  isUnlocked: boolean;
}

export type FacilityType = 
  | 'Gym' 
  | 'Dojo' 
  | 'Library' 
  | 'Garden' 
  | 'Pool' 
  | 'Meditation_Room' 
  | 'Obstacle_Course' 
  | 'Magic_Circle' 
  | 'Simulation_Chamber' 
  | 'Healing_Center';

export interface FacilityBonus {
  type: 'experience' | 'efficiency' | 'success_rate' | 'cost_reduction' | 'special';
  value: number;
  condition?: string;
  trainingTypes?: TrainingType[];
}

export interface FacilityMaintenance {
  condition: number; // 0-100
  costPerDay: number;
  lastMaintained: number;
  breakdownRisk: number;
  repairCost: number;
}

export interface FacilityUpgrade {
  id: string;
  name: string;
  description: string;
  level: number;
  cost: UpgradeCost;
  benefits: UpgradeBenefit[];
  requirements: UpgradeRequirement[];
  isUnlocked: boolean;
  isPurchased: boolean;
}

export interface UpgradeCost {
  sparkles?: number;
  stardust?: number;
  crystals?: number;
  materials?: Material[];
  time?: number;
}

export interface Material {
  id: string;
  name: string;
  quantity: number;
}

export interface UpgradeBenefit {
  type: 'capacity' | 'bonus' | 'efficiency' | 'unlock' | 'special';
  value: any;
  description: string;
}

export interface UpgradeRequirement {
  type: 'level' | 'achievement' | 'mission' | 'resource' | 'special';
  value: any;
  description: string;
}

export interface FacilityRequirement {
  type: 'level' | 'achievement' | 'resource' | 'space' | 'special';
  value: any;
  description: string;
}

// Training equipment and consumables
export interface TrainingEquipment {
  id: string;
  name: string;
  description: string;
  type: EquipmentType;
  rarity: Rarity;
  bonuses: EquipmentBonus[];
  durability: number;
  maxDurability: number;
  repairCost: RepairCost;
  requirements: EquipmentRequirement[];
  isUnlocked: boolean;
  isOwned: boolean;
  quantity: number;
}

export type EquipmentType = 
  | 'Weights' 
  | 'Targets' 
  | 'Mats' 
  | 'Books' 
  | 'Crystals' 
  | 'Potions' 
  | 'Tools' 
  | 'Simulators' 
  | 'Artifacts' 
  | 'Consumables';

export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythical';

export interface EquipmentBonus {
  type: 'stat_gain' | 'experience' | 'efficiency' | 'success_rate' | 'special';
  value: number;
  trainingTypes?: TrainingType[];
  condition?: string;
}

export interface RepairCost {
  sparkles?: number;
  stardust?: number;
  materials?: Material[];
  time?: number;
}

export interface EquipmentRequirement {
  type: 'level' | 'stat' | 'training_type' | 'achievement';
  value: any;
  description: string;
}

// Training programs and schedules
export interface TrainingProgram {
  id: string;
  name: string;
  description: string;
  duration: number; // in days
  sessions: ProgramSession[];
  goals: ProgramGoal[];
  requirements: TrainingRequirement[];
  rewards: ProgramReward[];
  isActive: boolean;
  isCompleted: boolean;
  progress: ProgramProgress;
}

export interface ProgramSession {
  day: number;
  trainingId: string;
  intensity: number; // 0-1
  focus: string[];
  optional: boolean;
}

export interface ProgramGoal {
  type: 'stat' | 'ability' | 'completion' | 'score';
  target: string;
  value: number;
  description: string;
  completed: boolean;
}

export interface ProgramReward {
  type: 'resources' | 'unlock' | 'achievement' | 'special';
  value: any;
  condition: 'completion' | 'perfect' | 'goal_achieved';
}

export interface ProgramProgress {
  currentDay: number;
  totalDays: number;
  sessionsCompleted: number;
  totalSessions: number;
  goalsAchieved: number;
  totalGoals: number;
  averageScore: number;
  streakDays: number;
}

// Training AI and automation
export interface TrainingAI {
  id: string;
  name: string;
  personality: AIPersonality;
  specialization: TrainingType[];
  recommendations: TrainingRecommendation[];
  adaptability: number; // 0-1
  learningRate: number; // 0-1
  knowledge: AIKnowledge;
}

export interface AIPersonality {
  traits: string[];
  communication: CommunicationStyle;
  preferences: AIPreferences;
}

export type CommunicationStyle = 'Direct' | 'Encouraging' | 'Analytical' | 'Friendly' | 'Professional';

export interface AIPreferences {
  trainingIntensity: number; // 0-1
  riskTolerance: number; // 0-1
  focusAreas: string[];
  avoidancePatterns: string[];
}

export interface AIKnowledge {
  girlProfiles: { [girlId: string]: GirlProfile };
  trainingHistory: TrainingHistoryEntry[];
  patterns: TrainingPattern[];
  insights: AIInsight[];
}

export interface GirlProfile {
  strengths: string[];
  weaknesses: string[];
  preferences: string[];
  learningStyle: LearningStyle;
  optimalTimes: TimeSlot[];
  motivation: MotivationFactors;
}

export type LearningStyle = 'Visual' | 'Auditory' | 'Kinesthetic' | 'Reading' | 'Mixed';

export interface MotivationFactors {
  primary: string;
  secondary: string[];
  demotivators: string[];
  rewards: string[];
}

export interface TrainingHistoryEntry {
  girlId: string;
  trainingId: string;
  timestamp: number;
  results: TrainingResults;
  context: TrainingContext;
}

export interface TrainingResults {
  score: number;
  improvements: StatImprovement[];
  satisfaction: number; // 0-1
  fatigue: number; // 0-1
  breakthroughs: string[];
}

export interface TrainingContext {
  timeOfDay: number;
  mood: string;
  energy: number;
  recentActivities: string[];
  teamMembers?: string[];
}

export interface TrainingPattern {
  type: 'success' | 'failure' | 'optimal' | 'warning';
  conditions: PatternCondition[];
  outcomes: PatternOutcome[];
  confidence: number; // 0-1
  frequency: number;
}

export interface PatternCondition {
  factor: string;
  operator: string;
  value: any;
}

export interface PatternOutcome {
  type: string;
  probability: number;
  impact: number;
}

export interface AIInsight {
  type: 'recommendation' | 'warning' | 'observation' | 'prediction';
  title: string;
  description: string;
  confidence: number; // 0-1
  actionable: boolean;
  priority: number; // 1-5
  expiry?: number;
}

export interface TrainingRecommendation {
  girlId: string;
  trainingId: string;
  priority: number; // 1-5
  reasoning: string;
  expectedOutcome: ExpectedOutcome;
  confidence: number; // 0-1
  alternatives: AlternativeRecommendation[];
}

export interface ExpectedOutcome {
  statGains: { [stat: string]: number };
  experience: number;
  satisfaction: number;
  risks: string[];
  benefits: string[];
}

export interface AlternativeRecommendation {
  trainingId: string;
  reason: string;
  tradeoffs: string[];
}
