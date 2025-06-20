import React from "react";
import { monsterTypes } from "../../data/gameData";
import { useGameStore } from "../../stores/gameStore";

export const MonsterSelector: React.FC = () => {
  const { selectedMonster, mana, selectMonster } = useGameStore();

  return (
    <aside className="sidebar sidebar-right bg-gray-100 p-4 w-64">
      <h3 className="text-lg font-bold mb-4 text-gray-800">Monsters</h3>
      <div className="monster-selector flex flex-col gap-2" id="monster-selector">
        {monsterTypes.map((monster, idx) => {
          const canAfford = mana >= monster.baseCost;
          return (
            <div
              key={monster.name}
              className={`monster-type p-3 rounded cursor-pointer border-2 transition-all ${
                selectedMonster === idx 
                  ? 'bg-red-200 border-red-400' 
                  : canAfford 
                    ? 'bg-white border-gray-300 hover:bg-gray-50' 
                    : 'bg-gray-200 border-gray-200 cursor-not-allowed opacity-50'
              }`}
              style={{ 
                borderLeftWidth: '4px',
                borderLeftColor: monster.color 
              }}
              onClick={() => canAfford && selectMonster(idx)}
            >
              <div className="monster-type-header flex justify-between items-center mb-1">
                <span className="monster-type-name font-bold text-gray-800">{monster.name}</span>
                <span className={`monster-type-cost text-sm font-bold ${canAfford ? 'text-blue-600' : 'text-red-500'}`}>
                  {monster.baseCost}✨
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
              {monster.special && monster.special !== 'none' && (
                <div className="monster-special text-xs text-purple-600 italic mt-1">
                  Special: {monster.special}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-4 p-2 bg-red-50 rounded text-xs text-gray-600">
        💡 Select a monster, then click on a room to spawn it. Cost may be reduced in Monster Lairs.
      </div>
    </aside>
  );
};
