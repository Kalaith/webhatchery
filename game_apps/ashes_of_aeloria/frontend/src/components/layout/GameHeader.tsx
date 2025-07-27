import React from 'react';
import { useGameLogic } from '../../hooks/useGameLogic';

export const GameHeader: React.FC = () => {
  const { turn } = useGameLogic();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
      <h1 className="text-2xl font-bold text-blue-600 m-0">⚔️ Ashes of Aeloria</h1>
      <div className="flex gap-6">
        <span className="font-medium px-4 py-2 bg-blue-100 text-blue-800 rounded-md">Turn: {turn}</span>
        <span className="font-medium px-4 py-2 bg-blue-100 text-blue-800 rounded-md">Phase: Player</span>
      </div>
    </header>
  );
};
