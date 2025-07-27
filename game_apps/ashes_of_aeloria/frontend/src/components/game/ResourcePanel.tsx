import React from 'react';
import { Card } from '../ui/Card';
import { useGameStore } from '../../stores/useGameStore';

export const ResourcePanel: React.FC = () => {
  const resources = useGameStore(state => state.resources);

  return (
    <Card className="resources-panel">
      <h3>Resources</h3>
      <div className="resource-item">
        <span className="resource-icon">💰</span>
        <span>Gold: {resources.gold}</span>
      </div>
      <div className="resource-item">
        <span className="resource-icon">📦</span>
        <span>Supplies: {resources.supplies}</span>
      </div>
      <div className="resource-item">
        <span className="resource-icon">✨</span>
        <span>Mana: {resources.mana}</span>
      </div>
    </Card>
  );
};
