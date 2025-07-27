import React from 'react';
import { useGameLogic } from '../../hooks/useGameLogic';

export const GameHeader: React.FC = () => {
  const { turn } = useGameLogic();

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 lg:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm gap-2 sm:gap-0">
      <h1 className="text-xl lg:text-2xl font-bold text-blue-600 m-0">⚔️ Ashes of Aeloria</h1>
      <div className="flex gap-3 lg:gap-6">
        <span className="font-medium px-3 lg:px-4 py-1.5 lg:py-2 bg-blue-100 text-blue-800 rounded-md text-sm lg:text-base">Turn: {turn}</span>
        <span className="font-medium px-3 lg:px-4 py-1.5 lg:py-2 bg-blue-100 text-blue-800 rounded-md text-sm lg:text-base">Phase: Player</span>
      </div>
    </header>
  );
};
