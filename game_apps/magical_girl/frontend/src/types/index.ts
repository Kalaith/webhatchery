// Re-export all types for easy importing

// Game types (re-export all)
export * from './game';
export type { GameConfig, GameState } from './game';

// Magical Girl types (specific exports to avoid conflicts)
export type {
  MagicalGirl,
  MagicalGirlStats,
  MagicalElement,
  Rarity,
  Specialization,
  Ability,
  AbilityType,
  AbilityCost,
  SpecialCost,
  AbilityEffect,
  EffectType,
  EffectTarget,
  EffectScaling,
  AbilityRequirement,
  AbilityTag,
  Equipment,
  EquipmentItem,
  EquipmentType,
  EquipmentRequirement,
  SetBonus,
  EquipmentSpecial,
  Transformation,
  TransformationRequirement,
  TransformationForm,
  TransformationMastery,
  MasteryBonus,
  Personality,
  PersonalityTrait,
  Mood,
  RelationshipType,
  Activity,
  MissionType as MagicalGirlMissionType,
  TimeOfDay,
  Location,
  TeamRole
} from './magicalGirl';

// Mission types (specific exports to avoid conflicts)
export type {
  Mission,
  MissionType as GameMissionType,
  MissionCategory,
  Difficulty,
  MissionRequirement,
  RequirementType,
  Objective,
  ObjectiveType,
  ObjectiveTarget,
  ObjectiveCondition,
  ConditionRule,
  MissionReward,
  RewardType,
  RewardScaling,
  MissionPenalty,
  PenaltyType,
  PenaltySeverity,
  PenaltyEffect,
  MissionLocation
} from './missions';

// Training types (specific exports to avoid conflicts)
export type {
  TrainingSession,
  TrainingType,
  TrainingCategory,
  TrainingDifficulty,
  TrainingCost,
  SpecialTrainingCost,
  TrainingRequirement,
  TrainingRequirementType,
  TrainingEffect,
  TrainingEffectType,
  TrainingTarget,
  TrainingReward,
  TrainingRewardType,
  UnlockCondition,
  TrainingTag,
  TrainingInstructor,
  InstructorBonus,  InstructorAvailability
} from './training';

// Achievement types (specific exports)
export type {
  Achievement,
  AchievementCategory,
  AchievementRarity,
  AchievementRequirement,
  AchievementReward,
  AchievementProgress,
  AchievementMilestone,
  AchievementStats,
  AchievementFilters,
  AchievementEvent,
  AchievementNotification
} from './achievements';

// Common utility types used across the application
export interface Vector2D {
  x: number;
  y: number;
}

export interface Vector3D extends Vector2D {
  z: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Color {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface Animation {
  name: string;
  duration: number;
  easing: string;
  loop: boolean;
  autoPlay: boolean;
}

export interface Sound {
  id: string;
  src: string;
  volume: number;
  loop: boolean;
  category: SoundCategory;
}

export type SoundCategory = 'sfx' | 'music' | 'voice' | 'ambient';

export interface Image {
  id: string;
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// Event system types
export interface GameEventData {
  type: string;
  payload: any;
  timestamp: number;
  source: string;
}

export interface EventListener {
  id: string;
  type: string;
  callback: (data: GameEventData) => void;
  once?: boolean;
}

// Component props types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
  style?: React.CSSProperties;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'magical' | 'sparkle' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface CardProps extends BaseComponentProps {
  title?: string;
  variant?: 'default' | 'magical' | 'sparkle';
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

// Form types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'checkbox' | 'radio' | 'textarea';
  required?: boolean;
  validation?: ValidationRule[];
  options?: SelectOption[];
  placeholder?: string;
  defaultValue?: any;
}

export interface SelectOption {
  value: any;
  label: string;
  disabled?: boolean;
}

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string;
  validator?: (value: any) => boolean;
}

// Settings and preferences types
export interface UserSettings {
  display: DisplaySettings;
  audio: AudioSettings;
  controls: ControlSettings;
  privacy: PrivacySettings;
  accessibility: AccessibilitySettings;
}

export interface DisplaySettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  fontSize: number;
  animations: boolean;
  particles: boolean;
  backgroundColor: string;
  uiScale: number;
}

export interface AudioSettings {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  voiceVolume: number;
  muted: boolean;
  musicEnabled: boolean;
  sfxEnabled: boolean;
}

export interface ControlSettings {
  keyBindings: { [action: string]: string };
  mouseSpeed: number;
  doubleClickSpeed: number;
  gesturesEnabled: boolean;
  tooltipsEnabled: boolean;
}

export interface PrivacySettings {
  analytics: boolean;
  crashReporting: boolean;
  socialFeatures: boolean;
  dataSharing: boolean;
}

export interface AccessibilitySettings {
  screenReader: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  colorBlind: boolean;
  subtitles: boolean;
}

// Performance and optimization types
export interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  loadTime: number;
  renderTime: number;
  cpuUsage: number;
  networkLatency: number;
}

export interface CacheEntry<T = any> {
  key: string;
  value: T;
  timestamp: number;
  expiry?: number;
  size: number;
}

export interface CacheConfig {
  maxSize: number;
  maxAge: number;
  cleanupInterval: number;
  strategy: 'LRU' | 'LFU' | 'FIFO';
}

// Localization types
export interface LocaleData {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  translations: { [key: string]: string };
  dateFormat: string;
  numberFormat: Intl.NumberFormatOptions;
}

export interface TranslationKey {
  key: string;
  defaultValue: string;
  namespace?: string;
  interpolation?: { [key: string]: any };
}

// Network and sync types
export interface SyncState {
  lastSync: number;
  pending: boolean;
  conflicts: SyncConflict[];
  version: number;
}

export interface SyncConflict {
  key: string;
  local: any;
  remote: any;
  timestamp: number;
  resolved: boolean;
}

// Analytics and telemetry types
export interface AnalyticsEvent {
  name: string;
  category: string;
  properties: { [key: string]: any };
  timestamp: number;
  sessionId: string;
  userId?: string;
}

export interface TelemetryData {
  events: AnalyticsEvent[];
  performance: PerformanceMetrics;
  errors: ErrorReport[];
  metadata: SessionMetadata;
}

export interface ErrorReport {
  type: 'javascript' | 'network' | 'game' | 'ui';
  message: string;
  stack?: string;
  timestamp: number;
  context: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface SessionMetadata {
  sessionId: string;
  userId?: string;
  platform: string;
  browser: string;
  version: string;
  startTime: number;
  duration: number;
}
