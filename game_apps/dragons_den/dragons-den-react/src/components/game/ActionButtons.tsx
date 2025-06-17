import React from 'react';
import { ActionButton } from '../ui/ActionButton';
import { PrestigeCard } from './PrestigeCard';
import { useGameActions } from '../../hooks/useGameActions';

export const ActionButtons: React.FC = () => {
  const {
    handleCollectGold,
    handleSendMinions,
    handleExploreRuins,
    handleHireMinion,
    handlePrestige,
    goldPerClick,
    minions,
    minionCooldown,
    exploreCooldown,
    hireMinionCost,
    canPrestige,
    prestigeLevel,
    canSendMinions,
    canExplore,
    canHireMinion,
    formatNumber
  } = useGameActions();

  return (
    <div className="space-y-4">
      {/* Main Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-6">
        <ActionButton
          onClick={handleCollectGold}
          variant="primary"
        >
          🐉 Collect Gold (+{goldPerClick})
        </ActionButton>
        
        <ActionButton
          onClick={handleSendMinions}
          disabled={!canSendMinions}
          variant="danger"
          cooldownTime={minionCooldown}
        >
          👹 Send Minions ({minions})
        </ActionButton>
        
        <ActionButton
          onClick={handleExploreRuins}
          disabled={!canExplore}
          variant="secondary"
          cooldownTime={exploreCooldown}
        >
          🗺️ Explore Ruins
        </ActionButton>
        
        <ActionButton
          onClick={handleHireMinion}
          disabled={!canHireMinion}
          variant="success"
        >
          🏰 Hire Minion ({formatNumber(hireMinionCost)})
        </ActionButton>
      </div>

      {/* Prestige Section */}
      <PrestigeCard
        canPrestige={canPrestige}
        currentLevel={prestigeLevel}
        nextLevel={prestigeLevel + 1}
        onPrestige={handlePrestige}
      />
    </div>
  );
};
