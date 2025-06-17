// Mission and quest system types
export interface Mission {
  id: string;
  name: string;
  description: string;
  type: MissionType;
  category: MissionCategory;
  difficulty: Difficulty;
  requirements: MissionRequirement[];
  objectives: Objective[];
  rewards: MissionReward[];
  penalties: MissionPenalty[];
  timeLimit?: number;
  location: MissionLocation;
  story: MissionStory;
  isUnlocked: boolean;
  isCompleted: boolean;
  isAvailable: boolean;
  completedAt?: number;
  attempts: number;
  bestScore?: MissionScore;
  tags: MissionTag[];
  season?: string;
  event?: string;
}

export type MissionType = 
  | 'Story' 
  | 'Daily' 
  | 'Weekly' 
  | 'Event' 
  | 'Challenge' 
  | 'Training' 
  | 'Collection' 
  | 'Boss' 
  | 'Raid' 
  | 'Exploration'
  | 'Tutorial';

export type MissionCategory = 
  | 'Combat' 
  | 'Rescue' 
  | 'Investigation' 
  | 'Protection' 
  | 'Collection' 
  | 'Social' 
  | 'Stealth' 
  | 'Puzzle' 
  | 'Escort' 
  | 'Survival'
  | 'Training';

export type Difficulty = 
  | 'Tutorial' 
  | 'Easy' 
  | 'Normal' 
  | 'Hard' 
  | 'Expert' 
  | 'Master' 
  | 'Nightmare' 
  | 'Impossible';

export interface MissionRequirement {
  type: RequirementType;
  value: any;
  description: string;
  optional?: boolean;
}

export type RequirementType = 
  | 'level' 
  | 'magical_girl' 
  | 'team_size' 
  | 'element' 
  | 'stat' 
  | 'ability' 
  | 'equipment' 
  | 'previous_mission' 
  | 'achievement' 
  | 'resource' 
  | 'time_of_day' 
  | 'special'
  | 'mission_completed';

export interface Objective {
  id: string;
  name: string;
  description: string;
  type: ObjectiveType;
  target: ObjectiveTarget;
  condition: ObjectiveCondition;
  progress: number;
  maxProgress: number;
  isCompleted: boolean;
  isOptional: boolean;
  isHidden: boolean;
  rewards?: MissionReward[];
  hints?: string[];
}

export type ObjectiveType = 
  | 'defeat' 
  | 'survive' 
  | 'collect' 
  | 'protect' 
  | 'reach' 
  | 'interact' 
  | 'solve' 
  | 'time' 
  | 'score' 
  | 'special';

export interface ObjectiveTarget {
  type: 'enemy' | 'item' | 'location' | 'character' | 'condition';
  id?: string;
  name: string;
  quantity?: number;
  properties?: { [key: string]: any };
}

export interface ObjectiveCondition {
  type: 'simple' | 'complex' | 'timed' | 'conditional';
  rules: ConditionRule[];
  logic?: 'AND' | 'OR' | 'NOT';
}

export interface ConditionRule {
  field: string;
  operator: 'equals' | 'greater' | 'less' | 'contains' | 'exists';
  value: any;
  negated?: boolean;
}

export interface MissionReward {
  type: RewardType;
  item: string;
  quantity: number;
  rarity?: Rarity;
  condition?: string;
  guaranteed: boolean;
  probability: number;
  scaling?: RewardScaling;
}

export type RewardType = 
  | 'experience' 
  | 'sparkles' 
  | 'stardust' 
  | 'moonbeams' 
  | 'crystals' 
  | 'magical_energy' 
  | 'magical_girl' 
  | 'equipment' 
  | 'ability' 
  | 'transformation' 
  | 'achievement' 
  | 'unlock' 
  | 'special';

export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythical';

export interface RewardScaling {
  base: number;
  factor: string; // 'level', 'difficulty', 'team_size', etc.
  multiplier: number;
  cap?: number;
}

export interface MissionPenalty {
  type: PenaltyType;
  condition: string;
  severity: PenaltySeverity;
  effect: PenaltyEffect;
}

export type PenaltyType = 'failure' | 'timeout' | 'death' | 'abandon' | 'special';
export type PenaltySeverity = 'minor' | 'moderate' | 'severe' | 'critical';

export interface PenaltyEffect {
  type: 'resource_loss' | 'stat_reduction' | 'cooldown' | 'lock' | 'special';
  value: any;
  duration?: number;
}

export interface MissionLocation {
  id: string;
  name: string;
  description: string;
  type: LocationType;
  environment: Environment;
  hazards: Hazard[];
  features: LocationFeature[];
  background: string;
  music?: string;
  ambientSounds?: string[];
}

export type LocationType = 
  | 'City' 
  | 'Forest' 
  | 'Beach' 
  | 'Mountains' 
  | 'Desert' 
  | 'Underground' 
  | 'Sky' 
  | 'Magical_Realm' 
  | 'School' 
  | 'Home' 
  | 'Laboratory' 
  | 'Castle' 
  | 'Dungeon';

export interface Environment {
  weather: Weather;
  timeOfDay: TimeOfDay;
  lighting: Lighting;
  temperature: Temperature;
  visibility: Visibility;
  magicalIntensity: number;
}

export type Weather = 'Clear' | 'Cloudy' | 'Rainy' | 'Stormy' | 'Snowy' | 'Foggy' | 'Magical';
export type TimeOfDay = 'Dawn' | 'Morning' | 'Noon' | 'Afternoon' | 'Evening' | 'Dusk' | 'Night' | 'Midnight';
export type Lighting = 'Bright' | 'Normal' | 'Dim' | 'Dark' | 'Magical' | 'Flickering';
export type Temperature = 'Freezing' | 'Cold' | 'Cool' | 'Mild' | 'Warm' | 'Hot' | 'Scorching';
export type Visibility = 'Clear' | 'Good' | 'Limited' | 'Poor' | 'Zero';

export interface Hazard {
  type: HazardType;
  name: string;
  description: string;
  severity: HazardSeverity;
  frequency: HazardFrequency;
  effects: HazardEffect[];
  countermeasures: string[];
}

export type HazardType = 'environmental' | 'magical' | 'creature' | 'trap' | 'curse' | 'special';
export type HazardSeverity = 'minor' | 'moderate' | 'major' | 'extreme' | 'lethal';
export type HazardFrequency = 'rare' | 'uncommon' | 'common' | 'frequent' | 'constant';

export interface HazardEffect {
  type: 'damage' | 'status' | 'debuff' | 'drain' | 'disable' | 'special';
  value: any;
  duration?: number;
  condition?: string;
}

export interface LocationFeature {
  type: FeatureType;
  name: string;
  description: string;
  interactive: boolean;
  requirements?: MissionRequirement[];
  effects?: FeatureEffect[];
}

export type FeatureType = 'landmark' | 'resource' | 'portal' | 'shop' | 'shrine' | 'puzzle' | 'secret';

export interface FeatureEffect {
  type: 'buff' | 'heal' | 'resource' | 'unlock' | 'teleport' | 'special';
  value: any;
  duration?: number;
}

export interface MissionStory {
  prologue?: StorySection;
  chapters: StorySection[];
  epilogue?: StorySection;
  branches?: StoryBranch[];
  characters: StoryCharacter[];
}

export interface StorySection {
  id: string;
  title: string;
  text: string;
  dialogue?: Dialogue[];
  choices?: StoryChoice[];
  conditions?: StoryCondition[];
  effects?: StoryEffect[];
  media?: StoryMedia;
}

export interface Dialogue {
  speaker: string;
  text: string;
  emotion?: string;
  voice?: string;
  animation?: string;
}

export interface StoryChoice {
  id: string;
  text: string;
  requirements?: MissionRequirement[];
  consequences: StoryConsequence[];
  unlocks?: string[];
}

export interface StoryConsequence {
  type: 'story' | 'mission' | 'character' | 'world' | 'special';
  target: string;
  effect: any;
  permanent?: boolean;
}

export interface StoryCondition {
  type: 'progress' | 'choice' | 'character' | 'world' | 'random';
  condition: string;
  value: any;
}

export interface StoryEffect {
  type: 'unlock' | 'change' | 'add' | 'remove' | 'special';
  target: string;
  value: any;
}

export interface StoryMedia {
  images?: string[];
  sounds?: string[];
  music?: string;
  video?: string;
}

export interface StoryBranch {
  id: string;
  name: string;
  condition: StoryCondition;
  sections: string[]; // Section IDs
  merge?: string; // Section ID where branches merge
}

export interface StoryCharacter {
  id: string;
  name: string;
  role: CharacterRole;
  appearance: string;
  personality: string;
  relationships: { [characterId: string]: string };
  dialogue: { [emotion: string]: string[] };
}

export type CharacterRole = 'protagonist' | 'ally' | 'enemy' | 'neutral' | 'mentor' | 'victim' | 'informant';

// Mission execution and progress
export interface MissionProgress {
  missionId: string;
  status: MissionStatus;
  startTime: number;
  currentTime: number;
  objectives: ObjectiveProgress[];
  team: MissionTeam;
  events: MissionEvent[];
  score: MissionScore;
  variables: { [key: string]: any };
}

export type MissionStatus = 'not_started' | 'in_progress' | 'paused' | 'completed' | 'failed' | 'abandoned';

export interface ObjectiveProgress {
  objectiveId: string;
  status: ObjectiveStatus;
  progress: number;
  maxProgress: number;
  completedAt?: number;
  events: ObjectiveEvent[];
}

export type ObjectiveStatus = 'locked' | 'available' | 'active' | 'completed' | 'failed' | 'skipped';

export interface ObjectiveEvent {
  type: 'start' | 'progress' | 'complete' | 'fail' | 'reset';
  timestamp: number;
  data?: any;
}

export interface MissionTeam {
  members: MissionMember[];
  formation: string;
  leader: string;
  status: TeamStatus;
}

export interface MissionMember {
  girlId: string;
  role: string;
  position: number;
  status: MemberStatus;
  currentStats: any;
  statusEffects: StatusEffect[];
}

export type TeamStatus = 'ready' | 'active' | 'exhausted' | 'defeated';
export type MemberStatus = 'ready' | 'active' | 'injured' | 'exhausted' | 'defeated' | 'transformed';

export interface StatusEffect {
  type: string;
  name: string;
  description: string;
  duration: number;
  remaining: number;
  effects: any[];
  source: string;
  removable: boolean;
}

export interface MissionEvent {
  id: string;
  type: MissionEventType;
  timestamp: number;
  description: string;
  data: any;
  important: boolean;
}

export type MissionEventType = 
  | 'start' 
  | 'objective_start' 
  | 'objective_progress' 
  | 'objective_complete' 
  | 'combat_start' 
  | 'combat_end' 
  | 'item_found' 
  | 'character_met' 
  | 'choice_made' 
  | 'ability_used' 
  | 'transformation' 
  | 'death' 
  | 'revival' 
  | 'special';

export interface MissionScore {
  total: number;
  breakdown: ScoreBreakdown;
  grade: MissionGrade;
  bonuses: ScoreBonus[];
  penalties: ScorePenalty[];
  rank: number;
  percentile: number;
}

export interface ScoreBreakdown {
  objectives: number;
  time: number;
  efficiency: number;
  style: number;
  survival: number;
  special: number;
}

export type MissionGrade = 'F' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS';

export interface ScoreBonus {
  type: string;
  name: string;
  value: number;
  description: string;
}

export interface ScorePenalty {
  type: string;
  name: string;
  value: number;
  description: string;
}

// Mission generation and management
export interface MissionTemplate {
  id: string;
  name: string;
  type: MissionType;
  category: MissionCategory;
  difficulty: Difficulty;
  baseRewards: MissionReward[];
  objectives: ObjectiveTemplate[];
  variables: MissionVariable[];
  tags: MissionTag[];
  weight: number;
  seasons: string[];
  requirements: MissionRequirement[];
}

export interface ObjectiveTemplate {
  type: ObjectiveType;
  weight: number;
  variations: ObjectiveVariation[];
  requirements: MissionRequirement[];
}

export interface ObjectiveVariation {
  name: string;
  description: string;
  target: ObjectiveTarget;
  condition: ObjectiveCondition;
  difficulty: number;
  rewards: MissionReward[];
}

export interface MissionVariable {
  name: string;
  type: 'number' | 'string' | 'boolean' | 'array' | 'object';
  defaultValue: any;
  range?: [number, number];
  options?: any[];
  formula?: string;
}

export type MissionTag = 
  | 'combat' 
  | 'stealth' 
  | 'puzzle' 
  | 'social' 
  | 'exploration' 
  | 'timed' 
  | 'escort' 
  | 'survival' 
  | 'boss' 
  | 'group' 
  | 'solo' 
  | 'repeatable' 
  | 'seasonal' 
  | 'event' 
  | 'story' 
  | 'challenge'
  | 'tutorial'
  | 'training'
  | 'beginner'
  | 'rescue'
  | 'easy'
  | 'animals'
  | 'investigation'
  | 'supernatural'
  | 'school'
  | 'daily'
  | 'weekly';

// Daily/Weekly mission system
export interface RecurringMission {
  templateId: string;
  type: 'daily' | 'weekly' | 'monthly';
  resetTime: number;
  nextReset: number;
  completions: number;
  maxCompletions: number;
  streak: number;
  maxStreak: number;
  bonusMultiplier: number;
}

export interface MissionCalendar {
  daily: RecurringMission[];
  weekly: RecurringMission[];
  monthly: RecurringMission[];
  events: EventMission[];
  special: SpecialMission[];
}

export interface EventMission {
  id: string;
  eventId: string;
  startTime: number;
  endTime: number;
  missionId: string;
  special: boolean;
}

export interface SpecialMission {
  id: string;
  name: string;
  description: string;
  unlockCondition: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  uniqueRewards: MissionReward[];
}
