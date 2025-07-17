import React, { useState, useEffect, useMemo } from "react";
import { useBackendGameStore } from "../../stores/backendGameStore";
import type { MonsterType, MonsterSpecies } from "../../types/game";
import { fetchMonsterSpeciesList, fetchMonsterList, getMonsterTypes } from "../../api/gameApi";

export const MonsterSelector: React.FC = () => {
  const { gameData, selectedMonster, selectMonster } = useBackendGameStore();
  const mana = gameData?.game.mana || 0;
  const unlockedMonsterSpecies = ['Mimetic', 'Amorphous']; // Hardcoded for now
  const [monsterSpeciesData, setMonsterSpeciesData] = useState<{[key: string]: MonsterSpecies} | null>(null);
  const [monsterEvolutionTrees, setMonsterEvolutionTrees] = useState<any>(null);
  const [monsterTypes, setMonsterTypes] = useState<{[key: string]: MonsterType}>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [speciesList, monsterList, types] = await Promise.all([
          fetchMonsterSpeciesList(),
          fetchMonsterList(),
          getMonsterTypes()
        ]);
        setMonsterSpeciesData(speciesList.species);
        setMonsterEvolutionTrees(monsterList.evolution_trees);
        setMonsterTypes(types);
      } catch (error) {
        console.error('Error loading monster data:', error);
      }
    };
    fetchData();
  }, []);

  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(
    unlockedMonsterSpecies.length > 0 ? unlockedMonsterSpecies[0] : null
  );
  const [showSpecies, setShowSpecies] = useState(false);

  useEffect(() => {
    if (!selectedSpecies && unlockedMonsterSpecies.length > 0) {
      setSelectedSpecies(unlockedMonsterSpecies[0]);
    }
  }, [unlockedMonsterSpecies.length]);

  const handleSpeciesSelect = (speciesName: string) => {
    setSelectedSpecies(speciesName);
    selectMonster(null);
  };

  const availableMonsters = useMemo((): MonsterType[] => {
    if (!selectedSpecies || !monsterSpeciesData || !monsterEvolutionTrees || !monsterTypes) return [];
    const speciesData = monsterSpeciesData[selectedSpecies];
    if (!speciesData) return [];

    const monsters: MonsterType[] = [];
    const evolutionTree = monsterEvolutionTrees[selectedSpecies];

    if (evolutionTree) {
      for (const monsterFamily in evolutionTree) {
        const familyTree = evolutionTree[monsterFamily];
        if (familyTree) {
          for (const tierKey in familyTree) {
            const tierMonsters = familyTree[tierKey];
            if (tierMonsters) {
              for (const monsterName in tierMonsters) {
                const monster = monsterTypes[monsterName];
                if (monster) {
                  monsters.push(monster);
                }
              }
            }
          }
        }
      }
    }
    return monsters.sort((a, b) => a.tier - b.tier);
  }, [selectedSpecies, monsterSpeciesData, monsterEvolutionTrees, monsterTypes]);



  return (
    <aside className="sidebar sidebar-right bg-gray-100 p-4 w-64">
      <h3 className="text-lg font-bold mb-4 text-gray-800">Monsters</h3>

      {/* Species Toggle */}
      <div className="mb-4">
        <button
          onClick={() => setShowSpecies(!showSpecies)}
          className="w-full flex justify-between items-center p-2 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium text-gray-700"
        >
          <span>Unlock Species</span>
          <span>{showSpecies ? '▼' : '▶'}</span>
        </button>
        
        {showSpecies && (
        <div className="flex flex-wrap gap-2">
          {monsterSpeciesData && Object.keys(monsterSpeciesData).map((speciesName: string) => {
            const isUnlocked = unlockedMonsterSpecies.includes(speciesName);
            const speciesData = monsterSpeciesData[speciesName];
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
        )}
      </div>

      {/* Species Tabs */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-1">
          {unlockedMonsterSpecies.map((speciesName: string) => (
            <button
              key={speciesName}
              onClick={() => handleSpeciesSelect(speciesName)}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                selectedSpecies === speciesName
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
              }`}
            >
              {speciesName}
            </button>
          ))}
        </div>
      </div>

      {/* Monster List for Selected Species */}
      {selectedSpecies && (
        <div className="monster-selector flex flex-col gap-2" id="monster-selector">

          {availableMonsters.map((monster: MonsterType) => {
            // Use base cost for display, actual cost calculated when placing
            const displayCost = monster.baseCost;
            const canAfford = mana >= displayCost;
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
                  borderLeftColor: monster.color || '#gray'
                }}
                onClick={() => canAfford && selectMonster(monster.name)}
              >
                <div className="monster-type-header flex justify-between items-center mb-1">
                  <span className="monster-type-name font-bold text-gray-800">{monster.name} (Tier {monster.tier})</span>
                  <span className={`monster-type-cost text-sm font-bold ${canAfford ? 'text-blue-600' : 'text-red-500'}`}>
                    {displayCost}✨
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
                      {monster.traits.join(', ')}
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
