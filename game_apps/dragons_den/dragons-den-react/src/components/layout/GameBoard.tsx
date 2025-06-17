import React from 'react';
import { ResourceCounter } from '../game/ResourceCounter';
import { ActionButtons } from '../game/ActionButtons';
import { TreasureCollection } from '../game/TreasureCollection';
import { UpgradeShop } from '../game/UpgradeShop';
import { GameEvents } from '../game/GameEvents';

export const GameBoard: React.FC = () => {
  return (
    <main className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Main Game Actions */}
        <div className="xl:col-span-2 space-y-6">
          <ResourceCounter />
          <ActionButtons />
          <GameEvents />
        </div>
        
        {/* Right Column - Collections and Upgrades */}
        <div className="space-y-6">
          <UpgradeShop />
          <TreasureCollection />
        </div>
      </div>
    </main>
  );
};