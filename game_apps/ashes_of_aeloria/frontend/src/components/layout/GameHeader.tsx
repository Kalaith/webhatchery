import React from 'react';
import { useGameStore } from '../../stores/useGameStore';

export const GameHeader: React.FC = () => {
  const { turn, phase } = useGameStore(state => ({
    turn: state.turn,
    phase: state.phase
  }));

  const formatPhase = (phase: string) => {
    return phase.charAt(0).toUpperCase() + phase.slice(1);
  };

  return (
    <header className="game-header">
      <h1>⚔️ Ashes of Aeloria</h1>
      <div className="turn-info">
        <span className="turn-counter">Turn: {turn}</span>
        <span className="phase-indicator">Phase: {formatPhase(phase)}</span>
      </div>
    </header>
  );
};
