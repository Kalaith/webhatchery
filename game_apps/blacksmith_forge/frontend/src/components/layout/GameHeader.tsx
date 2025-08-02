import React from 'react';
import { useGame } from '../../context/GameContext';

const GameHeader: React.FC = () => {
  const { state } = useGame();
  const { player } = state;

  return (
    <header className="game-header">
      <h1>🔨 Blacksmith's Forge</h1>
      <div className="player-stats">
        <div className="stat">
          <span className="stat-label">Gold:</span>
          <span className="stat-value">{player.gold}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Reputation:</span>
          <span className="stat-value">{player.reputation}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Level:</span>
          <span className="stat-value">{player.level}</span>
        </div>
      </div>
    </header>
  );
};

export default GameHeader;
