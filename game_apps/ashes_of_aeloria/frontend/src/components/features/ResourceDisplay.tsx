/**
 * Resource Display Component
 * Pure presentational component for showing game resources
 */

import React from 'react';
import { Card } from '../ui/Card';
import type { Resources } from '../../types/game';

interface ResourceDisplayProps {
  resources: Resources;
  income?: Resources;
  showIncome?: boolean;
  className?: string;
}

interface ResourceItemProps {
  icon: string;
  label: string;
  value: number;
  income?: number;
  showIncome?: boolean;
  color: string;
}

const ResourceItem: React.FC<ResourceItemProps> = ({
  icon,
  label,
  value,
  income,
  showIncome = false,
  color
}) => (
  <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
    <div className="flex items-center gap-2">
      <span className="text-lg">{icon}</span>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </div>
    <div className="text-right">
      <div className={`text-lg font-bold ${color}`}>
        {value.toLocaleString()}
      </div>
      {showIncome && income !== undefined && income > 0 && (
        <div className="text-xs text-gray-500">
          +{income}/turn
        </div>
      )}
    </div>
  </div>
);

export const ResourceDisplay: React.FC<ResourceDisplayProps> = ({
  resources,
  income,
  showIncome = false,
  className = ''
}) => {
  const resourceItems = [
    {
      key: 'gold',
      icon: '💰',
      label: 'Gold',
      value: resources.gold,
      income: income?.gold,
      color: 'text-yellow-600'
    },
    {
      key: 'supplies',
      icon: '📦',
      label: 'Supplies',
      value: resources.supplies,
      income: income?.supplies,
      color: 'text-green-600'
    },
    {
      key: 'mana',
      icon: '✨',
      label: 'Mana',
      value: resources.mana,
      income: income?.mana,
      color: 'text-purple-600'
    }
  ];

  return (
    <Card className={`p-4 ${className}`}>
      <h3 className="text-lg font-bold mb-3 text-gray-800">Resources</h3>
      <div className="space-y-2">
        {resourceItems.map(item => (
          <ResourceItem
            key={item.key}
            icon={item.icon}
            label={item.label}
            value={item.value}
            income={item.income}
            showIncome={showIncome}
            color={item.color}
          />
        ))}
      </div>
    </Card>
  );
};
