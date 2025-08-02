import React from 'react';
import { useGame } from '../../context/GameContext';
import { FORGE_UPGRADES } from '../../constants/gameData';

interface UpgradesTabProps { active: boolean; }

const UpgradesTab: React.FC<UpgradesTabProps> = ({ active }) => {
  const { state, setState } = useGame();
  const { player, forgeUpgrades } = state;

  const handleBuyUpgrade = (upgradeName: string, cost: number) => {
    if (player.gold < cost || forgeUpgrades.includes(upgradeName)) return;
    setState(prev => ({
      ...prev,
      player: { ...prev.player, gold: prev.player.gold - cost },
      forgeUpgrades: [...prev.forgeUpgrades, upgradeName]
    }));
  };

  if (!active) return null;

  return (
    <section id="upgrades-tab" className="tab-content active">
      <div className="upgrades-container">
        <h2>⬆️ Forge Upgrades</h2>
        <div className="upgrades-grid">
          {FORGE_UPGRADES.map(upgrade => {
            const isOwned = forgeUpgrades.includes(upgrade.name);
            return (
              <div key={upgrade.name} className="upgrade-card">
                <div className="material-info">
                  <div className="material-name">{upgrade.icon} {upgrade.name}</div>
                  <div className="material-cost">{isOwned ? 'OWNED' : `${upgrade.cost}g`}</div>
                </div>
                <div className="material-description">{upgrade.effect}</div>
                {!isOwned ? (
                  <button
                    className="btn btn--primary"
                    style={{ marginTop: '12px' }}
                    onClick={() => handleBuyUpgrade(upgrade.name, upgrade.cost)}
                    disabled={player.gold < upgrade.cost}
                  >Buy Upgrade</button>
                ) : (
                  <div className="status status--success" style={{ marginTop: '12px' }}>Owned</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UpgradesTab;
