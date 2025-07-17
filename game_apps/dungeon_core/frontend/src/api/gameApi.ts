import type { MonsterType } from '../types/game';
import { apiClient } from './client';
import type { GameStateResponse, InitializeGameResponse } from './types';

// Initialize game from backend
export const initializeGame = async (): Promise<InitializeGameResponse> => {
  return apiClient.initializeGame();
};

// Game state from backend
export const getGameState = async (): Promise<GameStateResponse> => {
  return apiClient.getGameState();
};

// Place monster via backend (secure)
export const placeMonsterAPI = async (floorNumber: number, roomPosition: number, monsterType: string) => {
  return apiClient.placeMonster({ floorNumber, roomPosition, monsterType });
};

// Unlock monster species via backend (secure)
export const unlockMonsterSpeciesAPI = async (speciesName: string) => {
  return apiClient.unlockMonsterSpecies({ speciesName });
};

// Gain monster experience via backend (secure)
export const gainMonsterExperienceAPI = async (monsterName: string, experience: number) => {
  return apiClient.gainMonsterExperience({ monsterName, experience });
};

// Get available monsters via backend (secure)
export const getAvailableMonstersAPI = async () => {
  return apiClient.getAvailableMonsters();
};

// Add room via backend
export const addRoomAPI = async (floorNumber: number, roomType: string, position: number, cost: number) => {
  return apiClient.addRoom({ floorNumber, roomType, position, cost });
};





// Static data - keep local for now
export const fetchMonsterList = async () => {
  const monsterList = await import('../data/monster_list.json');
  return monsterList.default;
};

export const fetchMonsterSpeciesList = async () => {
  const monsterSpecies = await import('../data/monster_species.json');
  return monsterSpecies.default;
};

// Keep monster types local for UI - remove calculations that should be server-side
export const getMonsterTypes = async (): Promise<{ [key: string]: MonsterType }> => {
  const monsterList = await fetchMonsterList();
  const monsterTypes: { [key: string]: MonsterType } = {};
  
  const tierStats: { [key: number]: { hp: number; attack: number; defense: number; cost: number } } = {
    1: { hp: 20, attack: 5, defense: 2, cost: 10 },
    2: { hp: 35, attack: 8, defense: 4, cost: 20 },
    3: { hp: 55, attack: 12, defense: 6, cost: 35 },
    4: { hp: 80, attack: 18, defense: 9, cost: 55 },
    5: { hp: 120, attack: 25, defense: 12, cost: 80 }
  };
  
  const speciesColors: { [key: string]: string } = {
    'Mimetic': '#8B4513',
    'Amorphous': '#32CD32',
    'Plant': '#228B22',
    'Crustacean': '#FF6347',
    'Avian': '#4169E1',
    'Insectoid': '#8B008B',
    'Batkin': '#2F4F4F',
    'Reptilian': '#556B2F',
    'Canine': '#CD853F',
    'Undead': '#696969'
  };
  
  const evolutionTrees = monsterList.evolution_trees as any;
  
  for (const speciesName in evolutionTrees) {
    const species = evolutionTrees[speciesName];
    for (const familyName in species) {
      const family = species[familyName];
      for (const tierKey in family) {
        const tierNumber = parseInt(tierKey.replace('Tier ', ''));
        const tier = family[tierKey];
        for (const monsterName in tier) {
          const monsterInfo = tier[monsterName];
          const stats = tierStats[tierNumber] || tierStats[1];
          
          monsterTypes[monsterName] = {
            name: monsterName,
            baseCost: stats.cost,
            hp: stats.hp,
            attack: stats.attack,
            defense: stats.defense,
            color: speciesColors[speciesName] || '#808080',
            description: monsterInfo.description || `Tier ${tierNumber} monster`,
            species: speciesName,
            tier: tierNumber,
            traits: monsterInfo.traits || []
          };
        }
      }
    }
  }
  
  return monsterTypes;
};

// Simplified local calculations
export const getScaledMonsterStats = (baseStats: { hp: number; attack: number; defense: number }, floorNumber: number, isBoss: boolean = false): { hp: number; attack: number; defense: number } => {
  const floorMultiplier = 1 + ((floorNumber - 1) * 0.2);
  const bossMultiplier = isBoss ? 1.5 : 1;
  
  return {
    hp: Math.floor(baseStats.hp * floorMultiplier * bossMultiplier),
    attack: Math.floor(baseStats.attack * floorMultiplier * bossMultiplier),
    defense: Math.floor(baseStats.defense * floorMultiplier * bossMultiplier)
  };
};

export const getMonsterManaCost = (baseCost: number, floorNumber: number, isBossRoom: boolean = false): number => {
  const floorMultiplier = 1 + ((floorNumber - 1) * 0.5);
  const bossMultiplier = isBossRoom ? 2.0 : 1.0;
  return Math.floor(baseCost * floorMultiplier * bossMultiplier);
};

export const getRoomCost = (totalRoomCount: number, roomType: 'normal' | 'boss'): number => {
  const baseCost = 20;
  const linearIncrease = totalRoomCount * 5;
  let totalCost = baseCost + linearIncrease;
  
  if (roomType === 'boss') {
    totalCost += 30;
  }
  
  return Math.max(5, Math.round(totalCost / 5) * 5);
};

export const fetchGameConstantsData = async () => {
  const gameConstants = await import('../data/gameConstants.json');
  return gameConstants.default;
};
