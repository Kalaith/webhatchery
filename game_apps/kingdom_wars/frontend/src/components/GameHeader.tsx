import React from 'react';
import ResourceBar from './ResourceBar';
import { useGameStore } from '../stores/gameStore';

const GameHeader: React.FC = () => {
  const isKingdomCreated = useGameStore(state => state.isKingdomCreated);

  return (
    <header className="game-header">
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 text-white p-6 text-center shadow-lg">
        <h1 className="text-4xl font-bold tracking-wide">Kingdom Wars</h1>
        <p className="text-lg mt-2 opacity-90">Build, Conquer, Rule</p>
      </div>
      {isKingdomCreated && <ResourceBar />}
    </header>
  );
};

export default GameHeader;
