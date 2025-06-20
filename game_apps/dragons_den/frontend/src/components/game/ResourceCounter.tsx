import React from 'react';
import { useGameStore } from '../../stores/gameStore';

export const ResourceCounter: React.FC = () => {
  const { gold, totalTreasures, uniqueTreasures, minions, formatNumber, calculateGoldPerSecond } = useGameStore();
  return (
    <div className="resource-counter flex-wrap">
      <div className="flex items-center gap-1 lg:gap-2 min-w-0 flex-shrink">
        <span className="text-lg lg:text-xl">💰</span>
        <div className="flex flex-col min-w-0">
          <span className="text-xs lg:text-sm text-gray-600 truncate">Gold</span>
          <span className="font-bold text-sm lg:text-lg text-yellow-600 truncate">{formatNumber(gold)}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-1 lg:gap-2 min-w-0 flex-shrink">
        <span className="text-lg lg:text-xl">💎</span>
        <div className="flex flex-col min-w-0">
          <span className="text-xs lg:text-sm text-gray-600 truncate">Treasures</span>
          <span className="font-bold text-sm lg:text-lg text-blue-600 truncate">{totalTreasures}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-1 lg:gap-2 min-w-0 flex-shrink">
        <span className="text-lg lg:text-xl">⭐</span>
        <div className="flex flex-col min-w-0">
          <span className="text-xs lg:text-sm text-gray-600 truncate">Unique</span>
          <span className="font-bold text-sm lg:text-lg text-purple-600 truncate">{uniqueTreasures.size}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-1 lg:gap-2 min-w-0 flex-shrink">
        <span className="text-lg lg:text-xl">👹</span>
        <div className="flex flex-col min-w-0">
          <span className="text-xs lg:text-sm text-gray-600 truncate">Minions</span>
          <span className="font-bold text-sm lg:text-lg text-red-600 truncate">{minions}</span>
        </div>
      </div>

      <div className="flex items-center gap-1 lg:gap-2 min-w-0 flex-shrink">
        <span className="text-lg lg:text-xl">⚡</span>
        <div className="flex flex-col min-w-0">
          <span className="text-xs lg:text-sm text-gray-600 truncate">Gold/sec</span>
          <span className="font-bold text-sm lg:text-lg text-green-600 truncate">{formatNumber(calculateGoldPerSecond())}</span>
        </div>
      </div>
    </div>
  );
};
