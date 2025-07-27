import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useGameStore } from '../../stores/useGameStore';

interface ActionsPanelProps {
  onHelpClick: () => void;
}

export const ActionsPanel: React.FC<ActionsPanelProps> = ({ onHelpClick }) => {
  const phase = useGameStore(state => state.phase);
  const endTurn = useGameStore(state => state.endTurn);

  const handleEndTurn = () => {
    endTurn();
  };

  return (
    <Card className="space-y-3 lg:space-y-4">
      <h3 className="text-base lg:text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Actions</h3>
      <Button 
        variant="secondary" 
        fullWidth 
        onClick={handleEndTurn}
        disabled={phase !== 'player'}
      >
        {phase === 'player' ? 'End Turn' : 'Enemy Turn...'}
      </Button>
      <Button 
        variant="outline" 
        fullWidth 
        onClick={onHelpClick}
      >
        Help & Rules
      </Button>
    </Card>
  );
};
