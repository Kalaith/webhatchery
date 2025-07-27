import React from 'react';
import { Card } from '../ui/Card';
import { useGameLogic } from '../../hooks/useGameLogic';

export const ResourcePanel: React.FC = () => {
  const { gold } = useGameLogic();

  return (
    <Card className="space-y-3 lg:space-y-4">
      <h3 className="text-base lg:text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Resources</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
        <div className="flex items-center gap-2 lg:gap-3 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
          <span className="text-lg lg:text-xl">💰</span>
          <span className="font-medium text-gray-700 text-sm lg:text-base">Gold: {gold}</span>
        </div>
        <div className="flex items-center gap-2 lg:gap-3 p-2 bg-blue-50 border border-blue-200 rounded-md">
          <span className="text-lg lg:text-xl">📦</span>
          <span className="font-medium text-gray-700 text-sm lg:text-base">Supplies: 300</span>
        </div>
        <div className="flex items-center gap-2 lg:gap-3 p-2 bg-purple-50 border border-purple-200 rounded-md">
          <span className="text-lg lg:text-xl">✨</span>
          <span className="font-medium text-gray-700 text-sm lg:text-base">Mana: 100</span>
        </div>
      </div>
    </Card>
  );
};
