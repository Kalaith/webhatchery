import React, { useState } from "react";
import { useGameStore } from "../../stores/gameStore";
import type { MonsterType } from "../../types/game";

export const MonsterSelector: React.FC = () => {
  const { mana, selectedMonster, selectMonster, unlockedMonsterSpecies, unlockMonsterSpecies } = useGameStore();
  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(() => {
    const initialSelected = unlockedMonsterSpecies.length > 0 ? unlockedMonsterSpecies[0] : (MONSTER_SPECIES_DATA["Mimetic"] ? "Mimetic" : null);
    console.log("MonsterSelector (useState init): unlockedMonsterSpecies=", unlockedMonsterSpecies, "MONSTER_SPECIES_DATA[\"Mimetic\"]=", MONSTER_SPECIES_DATA["Mimetic"], "initialSelected=", initialSelected);
    return initialSelected;
  });

  console.log("MonsterSelector (render): mana=", mana, "selectedMonster=", selectedMonster, "unlockedMonsterSpecies=", unlockedMonsterSpecies, "selectedSpecies=", selectedSpecies);

  const handleSpeciesSelect = (speciesName: string) => {
    console.log("MonsterSelector: handleSpeciesSelect called with", speciesName);
    setSelectedSpecies(speciesName);
    selectMonster(null); // Deselect monster when changing species
  };

  const getMonstersForSelectedSpecies = (): MonsterType[] => {
    console.log("getMonstersForSelectedSpecies: selectedSpecies=", selectedSpecies);
    if (!selectedSpecies) return [];
    const speciesData = MONSTER_SPECIES_DATA[selectedSpecies];
    console.log("getMonstersForSelectedSpecies: speciesData=", speciesData);
    if (!speciesData) return [];

    const monsters: MonsterType[] = [];
    const evolutionTree = MONSTER_EVOLUTION_TREES[selectedSpecies];
    console.log("getMonstersForSelectedSpecies: evolutionTree=", evolutionTree);

    if (evolutionTree) {
      for (const monsterFamily in evolutionTree) {
        for (const tierKey in evolutionTree[monsterFamily]) {
          const tierMonsters = evolutionTree[monsterFamily][tierKey];
          for (const monsterName in tierMonsters) {
            const monster = monsterTypes[monsterName];
            if (monster) {
              monsters.push(monster);
            }
          }
        }
      }
    }
    return monsters.sort((a, b) => a.tier - b.tier);
  };

  

  const availableMonsters = getMonstersForSelectedSpecies();

  return (
    <aside className="sidebar sidebar-right bg-gray-100 p-4 w-64">
      <h3 className="text-lg font-bold mb-4 text-gray-800">Monsters</h3>

      {/* Species Selection */}
      <div className="mb-4">
        <h4 className="font-semibold text-gray-700 mb-2">Monster Species</h4>
        <div className="flex flex-wrap gap-2">
          {Object.keys(MONSTER_SPECIES_DATA).map(speciesName => {
            const isUnlocked = unlockedMonsterSpecies.includes(speciesName);
            const speciesData = MONSTER_SPECIES_DATA[speciesName];
            const canAffordUnlock = mana >= speciesData.unlock_cost;

            return (
              <button
                key={speciesName}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${selectedSpecies === speciesName
                    ? 'bg-blue-600 text-white'
                    : isUnlocked
                      ? 'bg-blue-200 hover:bg-blue-300 text-blue-800'
                      : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  }`}
                onClick={() => {
                  if (isUnlocked) {
                    handleSpeciesSelect(speciesName);
                  } else if (canAffordUnlock) {
                    unlockMonsterSpecies(speciesName);
                    handleSpeciesSelect(speciesName); // Select after unlocking
                  }
                }}
                disabled={!isUnlocked && !canAffordUnlock}
                title={isUnlocked ? `Select ${speciesName}` : `Unlock for ${speciesData.unlock_cost} Mana`}
              >
                {speciesName} {isUnlocked ? '' : `(${speciesData.unlock_cost}✨)`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Monster List for Selected Species */}
      {selectedSpecies && (
        <div className="monster-selector flex flex-col gap-2" id="monster-selector">
          <h4 className="font-semibold text-gray-700 mb-2">{selectedSpecies} Monsters</h4>
          {availableMonsters.map((monster: MonsterType) => {
            const cost = getMonsterManaCost(monster.baseCost, 1, false); // Assuming floor 1, not boss room for display cost
            const canAfford = mana >= cost;
            const isSelected = selectedMonster === monster.name;

            return (
              <div
                key={monster.name}
                className={`monster-type p-3 rounded cursor-pointer border-2 transition-all ${
                  isSelected
                    ? 'bg-red-200 border-red-400'
                    : canAfford
                      ? 'bg-white border-gray-300 hover:bg-gray-50'
                      : 'bg-gray-200 border-gray-200 cursor-not-allowed opacity-50'
                  }`}
                style={{
                  borderLeftWidth: '4px',
                  borderLeftColor: monster.color
                }}
                onClick={() => canAfford && selectMonster(monster.name)}
              >
                <div className="monster-type-header flex justify-between items-center mb-1">
                  <span className="monster-type-name font-bold text-gray-800">{monster.name} (Tier {monster.tier})</span>
                  <span className={`monster-type-cost text-sm font-bold ${canAfford ? 'text-blue-600' : 'text-red-500'}`}>
                    {cost}✨
                  </span>
                </div>
                <div className="monster-type-description text-xs text-gray-600 mb-2">
                  {monster.description}
                </div>
                <div className="monster-stats flex justify-between text-xs">
                  <span className="text-red-600">❤️ {monster.hp}</span>
                  <span className="text-orange-600">⚔️ {monster.attack}</span>
                  <span className="text-blue-600">🛡️ {monster.defense}</span>
                </div>
                {monster.traits && monster.traits.length > 0 && (
                  <div className="monster-traits mt-1">
                    <span className="font-semibold text-xs text-gray-700">Traits: </span>
                    <span className="text-xs text-purple-600 italic">
                      {monster.traits.map(traitName => {
                        const trait = getMonsterTrait(traitName);
                        return trait ? trait.description : traitName;
                      }).join(', ')}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4 p-2 bg-red-50 rounded text-xs text-gray-600">
        💡 Select a monster, then click on a room to spawn it. Cost may be reduced in Monster Lairs.
      </div>
    </aside>
  );
};
