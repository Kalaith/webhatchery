import React from 'react';
import { useGameStore } from '../stores/gameStore';
import type { Resources } from '../types';

const ResourceBar: React.FC = () => {
  const resources = useGameStore(state => state.resources);
  const kingdomName = useGameStore(state => state.kingdom.name);
  const kingdom = useGameStore(state => state.kingdom);
  const getProductionRates = useGameStore(state => state.getProductionRates);
  const getArmyPower = useGameStore(state => state.getArmyPower);
  
  const productionRates = getProductionRates();
  const armyPower = getArmyPower();
  const totalPower = kingdom.power + armyPower;

  const resourceIcons: Record<keyof Resources, string> = {
    gold: '🏛️',
    food: '🌾',
    wood: '🪵',
    stone: '🪨'
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="resource-bar bg-gray-800 text-white p-4 flex items-center justify-between shadow-lg">
      <div className="flex items-center space-x-6">
        {Object.entries(resources).map(([key, value]) => {
          const resourceKey = key as keyof Resources;
          const production = productionRates[resourceKey];
          
          return (
            <div key={key} className="resource-item flex items-center space-x-2">
              <span className="resource-icon text-xl">{resourceIcons[resourceKey]}</span>
              <div className="flex flex-col">
                <span className="font-bold text-lg">{formatNumber(value)}</span>
                {production > 0 && (
                  <span className="text-xs text-green-400">+{formatNumber(production)}/min</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="kingdom-info flex items-center space-x-4 text-right">
        <div>
          <div className="font-bold text-lg">{kingdomName || 'Kingdom'}</div>
          <div className="text-sm text-gray-300">
            Power: <span className="text-yellow-400 font-semibold">{formatNumber(totalPower)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceBar;
