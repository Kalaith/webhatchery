// Game data types for Blacksmith Forge

export interface Player {
  gold: number;
  reputation: number;
  level: number;
  experience: number;
}

export interface Material {
  name: string;
  cost: number;
  quality: 'common' | 'rare' | 'legendary';
  description: string;
  icon: string;
}

export interface Recipe {
  name: string;
  materials: Record<string, number>;
  sellPrice: number;
  difficulty: number;
  icon: string;
}

export interface Customer {
  name: string;
  budget: number;
  preferences: string;
  reputation: number;
  icon: string;
}

export interface ForgeUpgrade {
  name: string;
  cost: number;
  effect: string;
  icon: string;
}

export interface GameState {
  player: Player;
  inventory: any[];
  unlockedRecipes: string[];
  materials: Record<string, number>;
  forgeUpgrades: string[];
  forgeLit: boolean;
  currentCustomer: Customer | null;
  tutorialCompleted: boolean;
  tutorialStep: number;
}
