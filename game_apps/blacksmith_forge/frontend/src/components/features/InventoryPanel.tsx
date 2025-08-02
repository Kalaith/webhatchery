import React from 'react';
import { useGameStore } from '../../stores/gameStore';
import { GameState } from '../../types/game';

interface InventoryItem {
  name: string;
  icon: string;
  quality?: string;
  value: number;
  type: string;
}

const InventoryPanel: React.FC = () => {
  const { state } = useGameStore();
  const { inventory } = state as GameState;

  if (!inventory || inventory.length === 0) {
    return <div className="inventory-grid"><div>No items in inventory.</div></div>;
  }

  return (
    <div className="inventory-grid">
      {inventory.map((item: InventoryItem, idx: number) => (
        <div key={idx} className="inventory-item">
          <div className="item-icon">{item.icon}</div>
          <div className="item-name">{item.name}</div>
          {item.quality && <div className="item-quantity">{item.quality} Quality</div>}
          <div className="item-value">{item.value}g</div>
        </div>
      ))}
    </div>
  );
};

export default InventoryPanel;
