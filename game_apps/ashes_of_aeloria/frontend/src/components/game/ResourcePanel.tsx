import React from 'react';
import { Card } from '../ui/Card';
import { useGameLogic } from '../../hooks/useGameLogic';

export const ResourcePanel: React.FC = () => {
  const { gold } = useGameLogic();

  return (
    <Card className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Resources</h3>
      <div className="flex items-center gap-3 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
        <span className="text-xl">💰</span>
        <span className="font-medium text-gray-700">Gold: {gold}</span>
      </div>
      <div className="flex items-center gap-3 p-2 bg-blue-50 border border-blue-200 rounded-md">
        <span className="text-xl">📦</span>
        <span className="font-medium text-gray-700">Supplies: 300</span>
      </div>
      <div className="flex items-center gap-3 p-2 bg-purple-50 border border-purple-200 rounded-md">
        <span className="text-xl">✨</span>
        <span className="font-medium text-gray-700">Mana: 100</span>
      </div>
    </Card>
  );
};
