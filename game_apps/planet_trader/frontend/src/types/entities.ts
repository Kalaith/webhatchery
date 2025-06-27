// Define types for Planet, PlanetType, Tool, Species, Alien, and GameData

export interface Planet {
  id: string; // Added id property
  type: PlanetType;
  name: string;
  temperature: number;
  atmosphere: number;
  water: number;
  gravity: number;
  radiation: number;
  purchasePrice: number;
  color: string; // Added color property
}

export interface PlanetType {
  name: string; // Added name property
  baseTemp: number;
  baseAtmo: number;
  baseWater: number;
  baseGrav: number;
  baseRad: number;
  color: string;
}

export interface Tool {
  name: string;
  cost: number;
  category: string; // Added category property
  id: string; // Added id property
  description: string; // Added description property
  tier?: number; // Added tier property
  unlocked?: boolean; // Added unlocked property
  upgradeRequired?: string; // Added optional upgradeRequired property
  effect?: Record<string, number>;
  sideEffects?: Record<string, number>;
}

export interface Species {
  name: string;
  description: string;
  tempRange: [number, number];
  atmoRange: [number, number];
  waterRange: [number, number];
  gravRange: [number, number];
  radRange: [number, number];
  basePrice: number;
  color: string;
}

export interface Alien {
  id: number;
  name: string;
  description: string;
  tempRange: [number, number];
  atmoRange: [number, number];
  waterRange: [number, number];
  gravRange: [number, number];
  radRange: [number, number];
  basePrice: number;
  color: string;
  currentPrice: number; // Added currentPrice property
}

// Ensure GameData type includes researchList
export interface GameData {
  planetTypes: PlanetType[];
  alienSpecies: Species[];
  terraformingTools: Tool[];
  planetNames: string[];
  researchList: Research[]; // Added researchList property
}

export interface Research {
  name: string;
  description: string;
  cost: number;
}
