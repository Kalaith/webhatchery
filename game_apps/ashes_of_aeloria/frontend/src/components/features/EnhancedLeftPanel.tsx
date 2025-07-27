/**
 * Enhanced Left Panel Component
 * Clean, modular implementation using feature components
 */

import React from 'react';
import { ResourceDisplay } from '../features/ResourceDisplay';
import { GameStatus } from '../features/GameStatus';
import { Button } from '../ui/EnhancedButton';
import { useGameActions } from '../../hooks/useGameActions';
import { useGameStore } from '../../stores/useGameStore';
import { calculateIncome } from '../../utils/gameLogic';

interface EnhancedLeftPanelProps {
  onRecruitClick: () => void;
  onHelpClick: () => void;
  className?: string;
}

export const EnhancedLeftPanel: React.FC<EnhancedLeftPanelProps> = ({
  onRecruitClick,
  onHelpClick,
  className = ''
}) => {
  const {
    resources,
    phase,
    completeTurn,
    canPerformActions
  } = useGameActions();

  const { turn, nodes } = useGameStore();
  
  // Calculate current income
  const income = calculateIncome(nodes);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Resources */}
      <ResourceDisplay 
        resources={resources}
        income={income}
        showIncome={true}
      />

      {/* Game Status */}
      <GameStatus
        turn={turn}
        phase={phase}
        onEndTurn={completeTurn}
        canEndTurn={canPerformActions}
      />

      {/* Quick Actions */}
      <div className="space-y-2">
        <Button
          variant="primary"
          fullWidth
          onClick={onRecruitClick}
          leftIcon="⚔️"
          disabled={!canPerformActions}
        >
          Recruit Commander
        </Button>
        
        <Button
          variant="secondary"
          fullWidth
          onClick={onHelpClick}
          leftIcon="❓"
        >
          Help & Guide
        </Button>
      </div>
    </div>
  );
};
