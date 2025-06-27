import type { FloorScaling, MonsterTrait, MonsterInfo, BaseStats, GameConstants, DeepFloorScaling, MonsterList, MonsterSpeciesList, EquipmentData, RoomType, RoomUpgradeData, AdventurerClass } from '../types/game';

export const fetchRoomTypesData = async (): Promise<RoomType[]> => {
  return [
    {
      name: "Normal Room",
      cost: 20,
      description: "Basic room for monsters",
      color: "#8B7355",
      spawnCostReduction: 0
    },
    {
      name: "Boss Room", 
      cost: 50,
      description: "Powerful room for boss monsters",
      color: "#8B0000",
      spawnCostReduction: 0,
      special: "boss"
    },
    {
      name: "Treasure Room",
      cost: 35,
      description: "Room that increases loot rewards",
      color: "#FFD700", 
      spawnCostReduction: 0,
      special: "treasure"
    },
    {
      name: "Spawning Chamber",
      cost: 30,
      description: "Reduces monster spawn costs by 25%",
      color: "#4B0082",
      spawnCostReduction: 0.25
    }
  ];
};

export const fetchRoomUpgradesData = async (): Promise<RoomUpgradeData[]> => {
  return [
    { 
      type: 'trap' as const, 
      name: "Spike Trap", 
      effect: "Deals damage to all adventurers", 
      multiplier: 1.5 
    },
    { 
      type: 'treasure' as const, 
      name: "Treasure Cache", 
      effect: "Increases loot rewards", 
      multiplier: 2.0 
    },
    { 
      type: 'reinforcement' as const, 
      name: "Fortified Walls", 
      effect: "Monsters gain +25% defense", 
      multiplier: 1.25 
    },
    { 
      type: 'evolution' as const, 
      name: "Evolution Chamber", 
      effect: "Monsters gain +50% all stats", 
      multiplier: 1.5 
    }
  ];
};

export const fetchAdventurerClassesData = async (): Promise<AdventurerClass[]> => {
  return [
    { 
      name: "Warrior", 
      hp: 30, 
      attack: 6, 
      defense: 4, 
      color: "#CD853F",
      special: "tank"
    },
    { 
      name: "Mage", 
      hp: 20, 
      attack: 8, 
      defense: 2, 
      color: "#4169E1",
      special: "magic"
    },
    { 
      name: "Archer", 
      hp: 25, 
      attack: 7, 
      defense: 3, 
      color: "#228B22",
      special: "ranged"
    },
    { 
      name: "Rogue", 
      hp: 22, 
      attack: 8, 
      defense: 2, 
      color: "#8B008B",
      special: "stealth"
    }
  ];
};

export const fetchMonsterList = async (): Promise<MonsterList> => {
  const monsterList = await import('../data/monster_list.json');
  return monsterList.default as MonsterList;
};

export const fetchMonsterSpeciesList = async (): Promise<MonsterSpeciesList> => {
  const monsterSpecies = await import('../data/monster_species.json');
  return monsterSpecies.default as MonsterSpeciesList;
};

export const fetchMonsterTraits = async (): Promise<{ [key: string]: MonsterTrait }> => {
  const monsterTraits = await import('../data/monster_traits.json');
  return monsterTraits.default as { [key: string]: MonsterTrait };
};

export const fetchFloorScalingData = async (): Promise<FloorScaling[]> => {
  const floorScaling = await import('../data/floorScaling.json');
  return floorScaling.default as FloorScaling[];
};

export const fetchDeepFloorScalingData = async (): Promise<DeepFloorScaling> => {
  const deepFloorScaling = await import('../data/deepFloorScaling.json');
  return deepFloorScaling.default as DeepFloorScaling;
};

export const fetchEquipmentData = async (): Promise<EquipmentData> => {
  const equipment = await import('../data/equipment.json');
  return equipment.default as EquipmentData;
};

export const fetchGameConstantsData = async (): Promise<GameConstants> => {
  const gameConstants = await import('../data/gameConstants.json');
  return gameConstants.default as GameConstants;
};

// Helper to get a monster's full data by its name and species
export const getMonsterData = async (speciesName: string, monsterName: string): Promise<MonsterInfo | null> => {
  const monsterList = await fetchMonsterList();
  const monsterSpeciesList = await fetchMonsterSpeciesList();
  const species = monsterSpeciesList.species[speciesName];
  if (!species) return null;

  for (const treeName in monsterList.evolution_trees[speciesName]) {
    const tree = monsterList.evolution_trees[speciesName][treeName];
    for (const tier in tree) {
      if (tree[tier][monsterName]) {
        return tree[tier][monsterName];
      }
    }
  }
  return null;
};

// Helper to get monster traits by name
export const getMonsterTrait = async (traitName: string): Promise<MonsterTrait | undefined> => {
  const monsterTraitsData = await fetchMonsterTraits();
  return monsterTraitsData[traitName];
};

// Calculate floor scaling for floors 5+
export const getFloorScaling = async (floorNumber: number): Promise<FloorScaling> => {
  const floorScalingData = await fetchFloorScalingData();
  const deepFloorScalingData = await fetchDeepFloorScalingData();
  if (floorNumber <= 4) {
    return floorScalingData[floorNumber - 1];
  }
  
  const additionalFloors = floorNumber - 4;
  const baseScaling = floorScalingData[3]; // Floor 4 as base
  
  return {
    manaCostMultiplier: baseScaling.manaCostMultiplier + (additionalFloors * deepFloorScalingData.manaCostMultiplierIncrease),
    monsterBoostPercentage: baseScaling.monsterBoostPercentage + (additionalFloors * deepFloorScalingData.monsterBoostPercentageIncrease),
    adventurerLevelRange: [
      baseScaling.adventurerLevelRange[0] + (additionalFloors * deepFloorScalingData.adventurerLevelIncrease),
      baseScaling.adventurerLevelRange[1] + (additionalFloors * deepFloorScalingData.adventurerLevelIncrease)
    ]
  };
};

// Calculate scaled monster stats
export const getScaledMonsterStats = async (baseStats: BaseStats, floorNumber: number, isBoss: boolean = false): Promise<{ hp: number, attack: number, defense: number }> => {
  const gameConstants = await fetchGameConstantsData();
  const scaling = await getFloorScaling(floorNumber);
  const floorMultiplier = 1 + (scaling.monsterBoostPercentage / 100);
  const bossMultiplier = isBoss ? gameConstants.BOSS_STAT_MULTIPLIER : 1;
  
  return {
    hp: Math.floor(baseStats.hp * floorMultiplier * bossMultiplier),
    attack: Math.floor(baseStats.attack * floorMultiplier * bossMultiplier),
    defense: Math.floor(baseStats.defense * floorMultiplier * bossMultiplier)
  };
};

// Calculate mana cost for monsters
export const getMonsterManaCost = async (baseCost: number, floorNumber: number, isBossRoom: boolean = false): Promise<number> => {
  const gameConstants = await fetchGameConstantsData();
  const scaling = await getFloorScaling(floorNumber);
  const floorMultiplier = scaling.manaCostMultiplier;
  const bossMultiplier = isBossRoom ? gameConstants.BOSS_ROOM_COST_MULTIPLIER : 1;
  
  return Math.floor(baseCost * floorMultiplier * bossMultiplier);
};

// Calculate room cost based on total room count (linear scaling, rounded to nearest 5)
export const getRoomCost = async (totalRoomCount: number, roomType: 'normal' | 'boss'): Promise<number> => {
  const gameConstants = await fetchGameConstantsData();
  let baseCost = gameConstants.BASE_ROOM_COST;
  
  // Linear scaling: +5 mana per room built so far
  const linearIncrease = totalRoomCount * 5;
  let totalCost = baseCost + linearIncrease;
  
  // Boss rooms cost more
  if (roomType === 'boss') {
    totalCost += gameConstants.BOSS_ROOM_EXTRA_COST;
  }
  
  // Round to nearest 5
  const roundedCost = Math.round(totalCost / 5) * 5;
  
  return Math.max(5, roundedCost); // Minimum cost of 5
};
