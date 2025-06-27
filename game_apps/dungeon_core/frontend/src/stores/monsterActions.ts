import type { GetState, SetState } from 'zustand';
import type { GameState, Monster, MonsterType } from '../types/game';



// Define a type for the full GameStore actions that will be passed to these functions
// This avoids circular dependency with the main gameStore.ts file
interface GameStoreActions {
  addLog: (entry: any) => void;
  spendMana: (amount: number) => boolean;
  spendGold: (amount: number) => boolean;
}

// Combine GameState and GameStoreActions for the GetState/SetState types
type FullGameStore = GameState & GameStoreActions;

export const placeMonster = async (set: SetState<FullGameStore>, get: GetState<FullGameStore>, floorNumber: number, roomPosition: number, monsterName: string) => {
  const state = get();
  const monsterTypes = await getMonsterTypes();
  const monster = monsterTypes[monsterName];
  
  const floor = state.floors.find(f => f.number === floorNumber);
  if (!floor) {
    get().addLog({ message: "Floor not found!", type: "system" });
    return false;
  }

  const room = floor.rooms.find(r => r.position === roomPosition);
  if (!room) {
    get().addLog({ message: "Room not found!", type: "system" });
    return false;
  }

  if (room.type === 'entrance' || room.type === 'core') {
    get().addLog({ message: "Cannot place monsters in entrance or core rooms!", type: "system" });
    return false;
  }

  const isBossRoom = room.type === 'boss';
  const cost = getMonsterManaCost(monster.baseCost, floorNumber, isBossRoom);

  if (!get().spendMana(cost)) {
    get().addLog({ message: `Not enough mana! Need ${cost} mana.`, type: "system" });
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
  
  get().addLog({ 
    message: `Spawned ${monster.name}${isBoss ? ' (Boss)' : ''} on floor ${floorNumber}, room ${roomPosition} for ${cost} mana`, 
    type: "system" 
  });
  
  return true;
};

export const unlockMonsterSpecies = async (set: SetState<FullGameStore>, get: GetState<FullGameStore>, speciesName: string) => {
  const monsterSpeciesData = await fetchMonsterSpeciesList();
  set((state) => {
    if (!state.unlockedMonsterSpecies.includes(speciesName)) {
      const speciesData = monsterSpeciesData.species[speciesName];
      if (speciesData && state.gold >= speciesData.unlock_cost) {
        get().spendGold(speciesData.unlock_cost);
        get().addLog(`Unlocked new monster species: ${speciesName}!`);
        return { unlockedMonsterSpecies: [...state.unlockedMonsterSpecies, speciesName] };
      } else if (speciesData) {
        get().addLog(`Not enough gold to unlock ${speciesName}. Need ${speciesData.unlock_cost} gold.`);
      }
    }
    return state;
  });
};

export const gainMonsterExperience = async (set: SetState<FullGameStore>, get: GetState<FullGameStore>, monsterName: string, exp: number) => {
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
      get().addLog(`Unlocked new tier (${newUnlockedTier}) for ${speciesName} monsters!`);
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