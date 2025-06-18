import React from 'react';
import { useGameStore } from '../../stores/gameStore';
import { TreasureCard } from './TreasureCard';

export const TreasureCollection: React.FC = () => {
  const { discoveredTreasures } = useGameStore();

  if (discoveredTreasures.length === 0) {
    return (
      <div className="upgrade-card text-center py-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">💎 Treasure Collection</h2>
        <p className="text-gray-500">No treasures discovered yet...</p>
        <p className="text-sm text-gray-400 mt-2">Explore ruins to find treasures!</p>
      </div>
    );
  }

  return (
    <div className="upgrade-card">
      <h2 className="text-xl font-bold mb-4 text-gray-800">💎 Treasure Collection</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
        {discoveredTreasures.map((treasure, index) => (
          <TreasureCard key={`${treasure.name}-${index}`} treasure={treasure} />
        ))}
      </div>
    </div>
  );
};