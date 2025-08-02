import React from 'react';
import { useGameStore } from '../../stores/gameStore';
import { MATERIALS } from '../../constants/gameData';
import { MATERIAL_BUY_QUANTITIES } from '../../constants/gameConfig';

interface MaterialsTabProps { active: boolean; }

const MaterialsTab: React.FC<MaterialsTabProps> = ({ active }) => {
  const { state, setState } = useGameStore();
  if (!state || !state.player || !state.materials) return null;
  const { player, materials } = state;

  const handleBuy = (materialName: string, quantity: number) => {
    const material = MATERIALS.find(m => m.name === materialName);
    if (!material) return;
    const totalCost = material.cost * quantity;
    if (player.gold < totalCost) return;
    setState({
      ...state,
      player: { ...player, gold: player.gold - totalCost },
      materials: { ...materials, [materialName]: materials[materialName] + quantity }
    });
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
                  {MATERIAL_BUY_QUANTITIES.map(qty => (
                    <button
                      key={qty}
                      className={`btn btn--sm ${qty === 1 ? 'btn--secondary' : 'btn--primary'}`}
                      onClick={() => handleBuy(material.name, qty)}
                      disabled={player.gold < material.cost * qty}
                    >Buy {qty}</button>
                  ))}
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
