import type { GetState, SetState } from 'zustand';
import type { GameState, Monster, MonsterType } from '../types/game';
import { getMonsterTypes, getMonsterManaCost, getScaledMonsterStats, fetchMonsterSpeciesList, fetchMonsterList } from '../api/gameApi';



// Define a type for the full GameStore actions that will be passed to these functions
// This avoids circular dependency with the main gameStore.ts file
interface GameStoreActions {
  spendMana: (amount: number) => boolean;
  spendGold: (amount: number) => boolean;
}

// Combine GameState and GameStoreActions for the GetState/SetState types
type FullGameStore = GameState & GameStoreActions;

export const placeMonster = async (set: SetState<FullGameStore>, get: GetState<FullGameStore>, floorNumber: number, roomPosition: number, monsterName: string, addLog: (entry: any) => void) => {
  const state = get();
  
  // Cannot place monsters while adventurers are in dungeon
  if (state.adventurerParties.length > 0) {
    addLog({ message: "Cannot place monsters while adventurers are in the dungeon!", type: "system" });
    return false;
  }
  
  const monsterTypes = await getMonsterTypes();
  const monster = monsterTypes[monsterName];
  
  if (!monster) {
    addLog({ message: "Monster type not found!", type: "system" });
    return false;
  }
  
  const floor = state.floors.find(f => f.number === floorNumber);
  if (!floor) {
    addLog({ message: "Floor not found!", type: "system" });
    return false;
  }

  const room = floor.rooms.find(r => r.position === roomPosition);
  if (!room) {
    addLog({ message: "Room not found!", type: "system" });
    return false;
  }

  if (room.type === 'entrance' || room.type === 'core') {
    addLog({ message: "Cannot place monsters in entrance or core rooms!", type: "system" });
    return false;
  }

  // Check room capacity: Room position * 2, divided by monster tier
  const roomCapacity = roomPosition * 2;
  const tierCapacity = Math.floor(roomCapacity / monster.tier);
  const currentTierCount = room.monsters.filter(m => {
    const mType = monsterTypes[m.type];
    return mType && mType.tier === monster.tier;
  }).length;

  if (currentTierCount >= tierCapacity) {
    addLog({ message: `Room ${roomPosition} can only hold ${tierCapacity} Tier ${monster.tier} monsters!`, type: "system" });
    return false;
  }

  const isBossRoom = room.type === 'boss';
  const cost = await getMonsterManaCost(monster.baseCost, floorNumber, isBossRoom);

  if (!get().spendMana(cost)) {
    addLog({ message: `Not enough mana! Need ${cost} mana.`, type: "system" });
    return false;
  }

  const isBoss = isBossRoom && room.monsters.length === 0; // First monster in boss room becomes boss
  const scaledStats = getScaledMonsterStats(
    { hp: monster.hp, attack: monster.attack, defense: monster.defense },
    floorNumber,
    isBoss
  );

  const newMonster: Monster = {
    id: Date.now() + Math.random(),
    type: monsterName,
    hp: scaledStats.hp,
    maxHp: scaledStats.hp,
    alive: true,
    isBoss,
    floorNumber,
    scaledStats
  };

  const updatedFloors = state.floors.map(f => {
    if (f.number === floorNumber) {
      return {
        ...f,
        rooms: f.rooms.map(r => {
          if (r.position === roomPosition) {
            return {
              ...r,
              monsters: [...r.monsters, newMonster]
            };
          }
          return r;
        })
      };
    }
    return f;
  });

  set({ floors: updatedFloors });
  
  addLog({ 
    message: `Spawned ${monster.name}${isBoss ? ' (Boss)' : ''} on floor ${floorNumber}, room ${roomPosition} for ${cost} mana`, 
    type: "system" 
  });
  
  return true;
};

export const unlockMonsterSpecies = async (set: SetState<FullGameStore>, get: GetState<FullGameStore>, speciesName: string, addLog: (entry: any) => void) => {
  const monsterSpeciesData = await fetchMonsterSpeciesList();
  set((state) => {
    if (!state.unlockedMonsterSpecies.includes(speciesName)) {
      const speciesData = monsterSpeciesData.species[speciesName];
      if (speciesData && state.gold >= speciesData.unlock_cost) {
        get().spendGold(speciesData.unlock_cost);
        addLog(`Unlocked new monster species: ${speciesName}!`);
        return { unlockedMonsterSpecies: [...state.unlockedMonsterSpecies, speciesName] };
      } else if (speciesData) {
        addLog(`Not enough gold to unlock ${speciesName}. Need ${speciesData.unlock_cost} gold.`);
      }
    }
    return state;
  });
};

export const gainMonsterExperience = async (set: SetState<FullGameStore>, get: GetState<FullGameStore>, monsterName: string, exp: number, addLog: (entry: any) => void) => {
  const monsterTypes = await getMonsterTypes();
  const monsterSpeciesData = await fetchMonsterSpeciesList();
  const monsterEvolutionTrees = await fetchMonsterList();

  set((state) => {
    const updatedMonsterExperience = {
      ...state.monsterExperience,
      [monsterName]: (state.monsterExperience[monsterName] || 0) + exp,
    };

    const monster = monsterTypes[monsterName];
    if (!monster) return { monsterExperience: updatedMonsterExperience };

    const speciesName = monster.species;
    const speciesData = monsterSpeciesData.species[speciesName];
    if (!speciesData) return { monsterExperience: updatedMonsterExperience };

    const evolutionTree = monsterEvolutionTrees.evolution_trees[speciesName];
    if (!evolutionTree) return { monsterExperience: updatedMonsterExperience };

    let speciesTotalExp = 0;
    for (const familyKey in evolutionTree) {
      for (const tierKey in evolutionTree[familyKey]) {
        for (const monName in evolutionTree[familyKey][tierKey]) {
          speciesTotalExp += updatedMonsterExperience[monName] || 0;
        }
      }
    }

    // Define experience thresholds for each tier
    const tierExperienceThresholds = [
      0,    // Tier 1
      500,  // Tier 2
      1500, // Tier 3
      3000, // Tier 4
      5000  // Tier 5
    ];

    let newUnlockedTier = 1;
    for (let i = 0; i < tierExperienceThresholds.length; i++) {
      if (speciesTotalExp >= tierExperienceThresholds[i]) {
        newUnlockedTier = i + 1;
      } else {
        break;
      }
    }

    // Check if a new tier has been unlocked for this species
    let currentMaxTier = 1;
    for (let i = 0; i < tierExperienceThresholds.length; i++) {
      if (speciesTotalExp >= tierExperienceThresholds[i]) {
        currentMaxTier = i + 1;
      } else {
        break;
      }
    }

    if (newUnlockedTier > currentMaxTier) {
      addLog(`Unlocked new tier (${newUnlockedTier}) for ${speciesName} monsters!`);
    }

    return { monsterExperience: updatedMonsterExperience };
  });
};

export const getAvailableMonsters = async (set: SetState<FullGameStore>, get: GetState<FullGameStore>) => {
  const state = get();
  const available: MonsterType[] = [];
  const monsterTypes = await getMonsterTypes();
  const monsterSpeciesData = await fetchMonsterSpeciesList();
  const monsterEvolutionTrees = await fetchMonsterList();

  state.unlockedMonsterSpecies.forEach(speciesName => {
    const speciesData = monsterSpeciesData.species[speciesName];
    if (speciesData) {
      const evolutionTree = monsterEvolutionTrees.evolution_trees[speciesName];
      if (evolutionTree) {
        // Determine the highest unlocked tier for this species based on total experience
        const speciesTotalExp = Object.keys(evolutionTree).reduce((sum, monsterFamily) => {
          for (const tierKey in evolutionTree[monsterFamily]) {
            for (const monsterName in evolutionTree[monsterFamily][tierKey]) {
              sum += state.monsterExperience[monsterName] || 0;
            }
          }
          return sum;
        }, 0);

        // Simple tier unlocking: 100 exp per tier
        const unlockedTier = Math.floor(speciesTotalExp / 100) + 1; 

        for (const monsterFamily in evolutionTree) {
          for (const tierKey in evolutionTree[monsterFamily]) {
            const tierNumber = parseInt(tierKey.replace('Tier ', ''));
            if (tierNumber <= unlockedTier) {
              for (const monsterName in evolutionTree[monsterFamily][tierKey]) {
                const monster = monsterTypes[monsterName];
                if (monster) {
                  available.push(monster);
                }
              }
            }
          }
        }
      }
    }
  });
  return available.sort((a, b) => a.tier - b.tier);
};