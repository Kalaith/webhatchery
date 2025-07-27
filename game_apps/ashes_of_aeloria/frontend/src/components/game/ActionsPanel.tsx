import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useGameStore } from '../../stores/useGameStore';

interface ActionsPanelProps {
  onHelpClick: () => void;
}

export const ActionsPanel: React.FC<ActionsPanelProps> = ({ onHelpClick }) => {
  const { phase, endTurn } = useGameStore(state => ({
    phase: state.phase,
    endTurn: state.endTurn
  }));

  const handleEndTurn = () => {
    endTurn();
  };

  return (
    <Card className="actions-panel">
      <h3>Actions</h3>
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
