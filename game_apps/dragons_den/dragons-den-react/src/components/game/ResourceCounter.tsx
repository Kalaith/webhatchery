import React from 'react';
import { useGameStore } from '../../stores/gameStore';

export const ResourceCounter: React.FC = () => {
  const { gold, totalTreasures, uniqueTreasures, minions, formatNumber, calculateGoldPerSecond } = useGameStore();

  return (
    <div className="resource-counter">
      <div className="flex items-center gap-2">
        <span className="text-xl">💰</span>
        <div className="flex flex-col">
          <span className="text-sm text-gray-600">Gold</span>
          <span className="font-bold text-lg text-yellow-600">{formatNumber(gold)}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-xl">💎</span>
        <div className="flex flex-col">
          <span className="text-sm text-gray-600">Treasures</span>
          <span className="font-bold text-lg text-blue-600">{totalTreasures}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-xl">⭐</span>
        <div className="flex flex-col">
          <span className="text-sm text-gray-600">Unique</span>
          <span className="font-bold text-lg text-purple-600">{uniqueTreasures.size}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-xl">👹</span>
        <div className="flex flex-col">
          <span className="text-sm text-gray-600">Minions</span>
          <span className="font-bold text-lg text-red-600">{minions}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xl">⚡</span>
        <div className="flex flex-col">
          <span className="text-sm text-gray-600">Gold/sec</span>
          <span className="font-bold text-lg text-green-600">{formatNumber(calculateGoldPerSecond())}</span>
        </div>
      </div>
    </div>
  );
};
