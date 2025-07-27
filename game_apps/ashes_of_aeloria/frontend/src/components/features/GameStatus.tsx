/**
 * Game Status Display Component
 * Shows current game phase and turn information
 */

import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/EnhancedButton';
import type { Phase } from '../../types/game';

interface GameStatusProps {
  turn: number;
  phase: Phase;
  onEndTurn: () => void;
  canEndTurn?: boolean;
  className?: string;
}

const PHASE_INFO: Record<Phase, { label: string; color: string; icon: string }> = {
  player: {
    label: 'Your Turn',
    color: 'text-green-600 bg-green-50 border-green-200',
    icon: '👑'
  },
  enemy: {
    label: 'Enemy Turn',
    color: 'text-red-600 bg-red-50 border-red-200',
    icon: '⚔️'
  },
  upkeep: {
    label: 'Upkeep Phase',
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    icon: '⚙️'
  }
};

export const GameStatus: React.FC<GameStatusProps> = ({
  turn,
  phase,
  onEndTurn,
  canEndTurn = true,
  className = ''
}) => {
  const phaseInfo = PHASE_INFO[phase];

  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">Game Status</h3>
        <div className="text-sm text-gray-600">
          Turn {turn}
        </div>
      </div>
      
      <div className={`
        flex items-center justify-center p-3 rounded-lg border mb-4
        ${phaseInfo.color}
      `}>
        <span className="text-lg mr-2">{phaseInfo.icon}</span>
        <span className="font-semibold">{phaseInfo.label}</span>
      </div>

      {phase === 'player' && (
        <Button
          variant="primary"
          fullWidth
          onClick={onEndTurn}
          disabled={!canEndTurn}
          rightIcon="⏭️"
        >
          End Turn
        </Button>
      )}
      
      {phase === 'enemy' && (
        <div className="text-center text-sm text-gray-600">
          Enemy is making their moves...
        </div>
      )}
      
      {phase === 'upkeep' && (
        <div className="text-center text-sm text-gray-600">
          Processing turn end events...
        </div>
      )}
    </Card>
  );
};
