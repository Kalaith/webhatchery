// Core game types for Ashes of Aeloria
export type Owner = 'player' | 'enemy' | 'neutral';
export type Phase = 'player' | 'enemy' | 'upkeep';
export type NodeType = 'city' | 'resource' | 'fortress' | 'shrine' | 'stronghold';
export type CommanderClass = 'knight' | 'mage' | 'ranger' | 'warlord';
export type Race = 'human' | 'elf' | 'orc' | 'undead';
export type TroopType = 'soldiers' | 'archers' | 'cavalry' | 'mages';

export interface NodeTypeData {
  name: string;
  color: string;
  icon: string;
  goldGeneration: number;
  suppliesGeneration: number;
  manaGeneration: number;
  defensiveBonus: number;
  description: string;
}

export interface CommanderClassData {
  name: string;
  icon: string;
  description: string;
  baseHealth: number;
  baseAttack: number;
  baseDefense: number;
  specialAbility: string;
  cost: number;
}

export interface RaceData {
  name: string;
  icon: string;
  bonus: string;
  color: string;
}

export interface TroopTypeData {
  name: string;
  icon: string;
  attack: number;
  defense: number;
  cost: number;
  strongAgainst: TroopType[];
  weakAgainst: TroopType[];
  description: string;
}

export interface Resources {
  gold: number;
  supplies: number;
  mana: number;
}

export interface Army {
  soldiers: number;
  archers: number;
  cavalry: number;
  mages: number;
}

export interface Commander {
  id: number;
  name: string;
  class: CommanderClass;
  race: Race;
  level: number;
  experience: number;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  assignedNode: number | null;
  army: Army;
  owner: Owner; // Add owner field to distinguish player vs enemy commanders
}

export interface GameNode {
  id: number;
  type: NodeType;
  x: number;
  y: number;
  owner: Owner;
  starLevel: number;
  garrison: number;
  connections: number[];
}

export interface BattleResult {
  victory: boolean;
  attackerLosses: Army;
  defenderLosses: Army;
  nodeConquered: boolean;
  experienceGained: number;
}

export interface BattleLogEntry {
  timestamp: number;
  type: 'info' | 'combat' | 'victory' | 'defeat' | 'recruitment';
  message: string;
}

export interface GameState {
  turn: number;
  phase: Phase;
  resources: Resources;
  commanders: Commander[];
  nodes: GameNode[];
  selectedNode: number | null;
  selectedCommander: number | null;
  gameOver: boolean;
  winner: Owner | null;
  battleLog: BattleLogEntry[];
}

export interface GameData {
  nodeTypes: Record<NodeType, NodeTypeData>;
  commanderClasses: Record<CommanderClass, CommanderClassData>;
  races: Record<Race, RaceData>;
  troopTypes: Record<TroopType, TroopTypeData>;
}
