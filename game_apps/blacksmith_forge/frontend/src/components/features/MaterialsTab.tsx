import React from 'react';
import { useGame } from '../../context/GameContext';
import { MATERIALS } from '../../constants/gameData';

interface MaterialsTabProps { active: boolean; }

const MaterialsTab: React.FC<MaterialsTabProps> = ({ active }) => {
  const { state, setState } = useGame();
  const { player, materials } = state;

  const handleBuy = (materialName: string, quantity: number) => {
    const material = MATERIALS.find(m => m.name === materialName);
    if (!material) return;
    const totalCost = material.cost * quantity;
    if (player.gold < totalCost) return;
    setState(prev => ({
      ...prev,
      player: { ...prev.player, gold: prev.player.gold - totalCost },
      materials: { ...prev.materials, [materialName]: prev.materials[materialName] + quantity }
    }));
  };

  if (!active) return null;

  return (
    <section id="materials-tab" className="tab-content active">
      <div className="materials-container">
        <h2>⚒️ Material Market</h2>
        <div className="materials-grid">
          {MATERIALS.map(material => (
            <div key={material.name} className="material-card">
              <div className="material-info">
                <div className="material-name">{material.icon} {material.name}</div>
                <div className="material-cost">{material.cost}g</div>
              </div>
              <div className="material-description">{material.description}</div>
              <div className={`quality-badge quality-${material.quality}`}>{material.quality}</div>
              <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Owned: {materials[material.name]}</span>
                <div>
                  <button
                    className="btn btn--sm btn--secondary"
                    onClick={() => handleBuy(material.name, 1)}
                    disabled={player.gold < material.cost}
                  >Buy 1</button>
                  <button
                    className="btn btn--sm btn--primary"
                    onClick={() => handleBuy(material.name, 5)}
                    disabled={player.gold < material.cost * 5}
                  >Buy 5</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MaterialsTab;
