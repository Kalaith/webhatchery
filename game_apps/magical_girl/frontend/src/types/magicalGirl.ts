// Magical Girl character types and interfaces
export interface MagicalGirl {
  id: string;
  name: string;
  element: MagicalElement;
  rarity: Rarity;
  level: number;
  experience: number;
  experienceToNext: number;
  stats: MagicalGirlStats;
  abilities: Ability[];
  equipment: Equipment;
  transformation: Transformation;
  personality: Personality;
  backstory: string;
  avatar: Avatar;
  isUnlocked: boolean;
  unlockedAt?: number;
  favoriteLevel: number;
  totalMissionsCompleted: number;
  specialization: Specialization;
  bondLevel: number;
  bondExperience: number;
}

export interface MagicalGirlStats {
  power: number;
  defense: number;
  speed: number;
  magic: number;
  wisdom: number;
  charm: number;
  courage: number;
  luck: number;
  endurance: number;
  focus: number;
}

export type MagicalElement = 
  | 'Light' 
  | 'Darkness' 
  | 'Fire' 
  | 'Water' 
  | 'Earth' 
  | 'Air' 
  | 'Ice' 
  | 'Lightning' 
  | 'Nature' 
  | 'Celestial' 
  | 'Void' 
  | 'Crystal';

export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythical';

export type Specialization = 
  | 'Combat' 
  | 'Healing' 
  | 'Support' 
  | 'Magic' 
  | 'Defense' 
  | 'Speed' 
  | 'Balanced';

export interface Ability {
  id: string;
  name: string;
  description: string;
  type: AbilityType;
  element: MagicalElement;
  cost: AbilityCost;
  effects: AbilityEffect[];
  cooldown: number;
  currentCooldown: number;
  level: number;
  maxLevel: number;
  requirements: AbilityRequirement[];
  tags: AbilityTag[];
  animation?: string;
  soundEffect?: string;
  isActive: boolean;
  isPassive: boolean;
  isUltimate: boolean;
}

export type AbilityType = 
  | 'Attack' 
  | 'Defense' 
  | 'Heal' 
  | 'Buff' 
  | 'Debuff' 
  | 'Utility' 
  | 'Ultimate' 
  | 'Passive';

export interface AbilityCost {
  magicalEnergy: number;
  sparkles?: number;
  stardust?: number;
  special?: SpecialCost;
}

export interface SpecialCost {
  type: 'health' | 'time' | 'condition';
  amount: number;
  condition?: string;
}

export interface AbilityEffect {
  type: EffectType;
  target: EffectTarget;
  magnitude: number;
  duration: number;
  probability: number;
  scaling?: EffectScaling;
}

export type EffectType = 
  | 'damage' 
  | 'heal' 
  | 'stat_boost' 
  | 'stat_reduction' 
  | 'status_effect' 
  | 'resource_gain' 
  | 'special';

export type EffectTarget = 'self' | 'ally' | 'enemy' | 'all_allies' | 'all_enemies' | 'all';

export interface EffectScaling {
  stat: keyof MagicalGirlStats;
  ratio: number;
}

export interface AbilityRequirement {
  type: 'level' | 'stat' | 'element' | 'ability' | 'item';
  value: any;
  condition?: string;
}

export type AbilityTag = 
  | 'offensive' 
  | 'defensive' 
  | 'support' 
  | 'elemental' 
  | 'rare' 
  | 'channeled' 
  | 'instant' 
  | 'aoe' 
  | 'single_target';

export interface Equipment {
  weapon?: EquipmentItem;
  accessory?: EquipmentItem;
  outfit?: EquipmentItem;
  charm?: EquipmentItem;
}

export interface EquipmentItem {
  id: string;
  name: string;
  type: EquipmentType;
  rarity: Rarity;
  level: number;
  stats: Partial<MagicalGirlStats>;
  abilities: string[]; // Ability IDs
  description: string;
  requirements: EquipmentRequirement[];
  durability: number;
  maxDurability: number;
  enhancement: number;
  maxEnhancement: number;
  setBonus?: SetBonus;
  special?: EquipmentSpecial;
}

export type EquipmentType = 'Weapon' | 'Accessory' | 'Outfit' | 'Charm';

export interface EquipmentRequirement {
  type: 'level' | 'stat' | 'element' | 'specialization';
  value: any;
}

export interface SetBonus {
  setName: string;
  pieces: number;
  requiredPieces: number;
  bonus: Partial<MagicalGirlStats>;
  abilities: string[];
}

export interface EquipmentSpecial {
  type: 'proc' | 'passive' | 'active';
  effect: AbilityEffect;
  trigger?: string;
  cooldown?: number;
}

export interface Transformation {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  isUnlocked: boolean;
  requirements: TransformationRequirement[];
  forms: TransformationForm[];
  currentForm: number;
  experience: number;
  experienceToNext: number;
  mastery: TransformationMastery;
}

export interface TransformationRequirement {
  type: 'level' | 'bond' | 'mission' | 'special';
  value: any;
  description: string;
}

export interface TransformationForm {
  id: string;
  name: string;
  description: string;
  appearance: Appearance;
  statMultipliers: Partial<MagicalGirlStats>;
  abilities: string[]; // Additional abilities in this form
  cost: number; // Energy cost to maintain
  duration: number; // How long it lasts
  cooldown: number; // Cooldown after use
  requirements: TransformationRequirement[];
}

export interface TransformationMastery {
  level: number;
  experience: number;
  bonuses: MasteryBonus[];
}

export interface MasteryBonus {
  type: 'stat' | 'ability' | 'cost_reduction' | 'duration' | 'special';
  value: any;
  description: string;
}

export interface Personality {
  traits: PersonalityTrait[];
  mood: Mood;
  relationships: Relationship[];
  preferences: MagicalGirlPreferences;
  dialogues: DialogueSet;
}

export interface PersonalityTrait {
  name: string;
  value: number; // -100 to 100
  description: string;
  effects: TraitEffect[];
}

export interface TraitEffect {
  type: 'stat' | 'ability' | 'mission' | 'social';
  modifier: number;
  condition?: string;
}

export type Mood = 
  | 'Happy' 
  | 'Excited' 
  | 'Calm' 
  | 'Focused' 
  | 'Tired' 
  | 'Sad' 
  | 'Angry' 
  | 'Nervous' 
  | 'Confident' 
  | 'Determined';

export interface Relationship {
  targetId: string; // ID of another magical girl
  type: RelationshipType;
  level: number;
  experience: number;
  maxLevel: number;
  bonuses: RelationshipBonus[];
}

export type RelationshipType = 
  | 'Friend' 
  | 'Rival' 
  | 'Mentor' 
  | 'Student' 
  | 'Partner' 
  | 'Sister' 
  | 'Neutral';

export interface RelationshipBonus {
  type: 'stat' | 'ability' | 'mission' | 'special';
  value: any;
  condition?: string;
}

export interface MagicalGirlPreferences {
  favoriteActivity: Activity;
  favoriteMission: MissionType;
  favoriteTime: TimeOfDay;
  favoriteLocation: Location;
  specialInterests: string[];
}

export type Activity = 'Training' | 'Missions' | 'Socializing' | 'Studying' | 'Resting' | 'Exploring';
export type MissionType = 'Combat' | 'Rescue' | 'Investigation' | 'Protection' | 'Collection' | 'Social';
export type TimeOfDay = 'Dawn' | 'Morning' | 'Afternoon' | 'Evening' | 'Night' | 'Midnight';
export type Location = 'City' | 'Forest' | 'Beach' | 'Mountains' | 'School' | 'Home' | 'Magical Realm';

export interface DialogueSet {
  greetings: string[];
  training: string[];
  missions: string[];
  idle: string[];
  levelUp: string[];
  transformation: string[];
  victory: string[];
  defeat: string[];
  special: DialogueSpecial[];
}

export interface DialogueSpecial {
  trigger: string;
  condition?: string;
  lines: string[];
  once?: boolean;
}

export interface Avatar {
  base: Appearance;
  expressions: { [key: string]: Appearance };
  outfits: { [key: string]: Appearance };
  accessories: { [key: string]: Appearance };
  current: CurrentAppearance;
}

export interface Appearance {
  hair: HairStyle;
  eyes: EyeStyle;
  outfit: OutfitStyle;
  accessories: AccessoryStyle[];
  pose: string;
  background: string;
  effects: VisualEffect[];
}

export interface CurrentAppearance {
  expression: string;
  outfit: string;
  accessories: string[];
  pose: string;
  effects: string[];
}

export interface HairStyle {
  style: string;
  color: string;
  length: string;
  texture: string;
}

export interface EyeStyle {
  shape: string;
  color: string;
  expression: string;
}

export interface OutfitStyle {
  base: string;
  colors: string[];
  pattern: string;
  accessories: string[];
}

export interface AccessoryStyle {
  type: string;
  position: string;
  color: string;
  special: boolean;
}

export interface VisualEffect {
  type: string;
  intensity: number;
  color: string;
  duration: number;
  animation: string;
}

// Collection and progression
export interface MagicalGirlCollection {
  owned: string[]; // Magical Girl IDs
  total: number;
  completionRate: number;
  categories: CollectionCategory[];
  milestones: CollectionMilestone[];
}

export interface CollectionCategory {
  name: string;
  girls: string[];
  completed: boolean;
  reward?: any;
}

export interface CollectionMilestone {
  id: string;
  name: string;
  description: string;
  requirement: number;
  current: number;
  reward: any;
  completed: boolean;
}

// Magical Girl creation and customization
export interface MagicalGirlTemplate {
  id: string;
  name: string;
  element: MagicalElement;
  rarity: Rarity;
  baseStats: MagicalGirlStats;
  startingAbilities: string[];
  appearance: Appearance;
  personality: Partial<Personality>;
  unlockConditions: UnlockCondition[];
}

export interface UnlockCondition {
  type: 'level' | 'mission' | 'achievement' | 'time' | 'special';
  value: any;
  description: string;
}

// Team and party system
export interface MagicalGirlTeam {
  id: string;
  name: string;
  members: string[]; // Magical Girl IDs
  leader: string; // Magical Girl ID
  formation: TeamFormation;
  bonuses: TeamBonus[];
  experience: number;
  level: number;
  totalMissions: number;
  winRate: number;
}

export interface TeamFormation {
  positions: TeamPosition[];
  bonuses: FormationBonus[];
}

export interface TeamPosition {
  position: number;
  girlId: string;
  role: TeamRole;
}

export type TeamRole = 'Leader' | 'Attacker' | 'Defender' | 'Support' | 'Healer' | 'Specialist';

export interface FormationBonus {
  type: 'stat' | 'ability' | 'special';
  value: any;
  condition?: string;
}

export interface TeamBonus {
  source: 'synergy' | 'leadership' | 'equipment' | 'special';
  type: 'stat' | 'ability' | 'experience' | 'resources';
  value: any;
  description: string;
}
