import React from 'react';
import { useGame } from '../../context/GameContext';

const InventoryPanel: React.FC = () => {
  const { state } = useGame();
  const { inventory } = state;

  if (!inventory || inventory.length === 0) {
    return <div className="inventory-grid"><div>No items in inventory.</div></div>;
  }

  return (
    <div className="inventory-grid">
      {inventory.map((item: any, idx: number) => (
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
