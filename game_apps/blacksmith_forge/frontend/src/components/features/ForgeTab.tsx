import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { RECIPES } from '../../constants/gameData';
import CraftingInterface from './CraftingInterface';
import InventoryPanel from './InventoryPanel';

interface ForgeTabProps { active: boolean; }

const ForgeTab: React.FC<ForgeTabProps> = ({ active }) => {
  const { state, setState } = useGame();
  const { forgeLit, unlockedRecipes, materials } = state;

  // Handler to light the forge
  const handleLightForge = () => {
    setState(prev => ({ ...prev, forgeLit: true }));
  };

  // Track selected recipe in local state for crafting interface
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);

  const handleSelectRecipe = (recipeName: string) => {
    setSelectedRecipe(recipeName);
  };

  if (!active) return null;

  return (
    <section id="forge-tab" className="tab-content active">
      <div className="forge-area">
        <div className="forge-main">
          <h2>🔥 Forge</h2>
          <div className={`forge-fire${forgeLit ? ' lit' : ''}`} id="forge-fire" onClick={handleLightForge}>
            <div className="fire-animation">{forgeLit ? '🔥🔥🔥' : '🔥'}</div>
            <p>{forgeLit ? 'Forge is burning hot!' : 'Click to light the forge!'}</p>
          </div>

          {forgeLit && (
            <div className="crafting-area" id="crafting-area">
              <h3>Select Recipe to Craft</h3>
              <div className="recipe-selector" id="recipe-selector">
                {unlockedRecipes.map((recipeName: string) => {
                  const recipe = RECIPES.find((r) => r.name === recipeName);
                  if (!recipe) return null;
                  // Check if player has enough materials
                  const canCraft = Object.entries(recipe.materials).every(
                    ([mat, qty]: [string, number]) => (materials[mat] ?? 0) >= qty
                  );
                  return (
                    <div
                      key={recipe.name}
                      className={`recipe-card${!canCraft ? ' disabled' : ''}`}
                      data-recipe={recipe.name}
                      style={{ opacity: canCraft ? 1 : 0.5 }}
                      onClick={() => canCraft && handleSelectRecipe(recipe.name)}
                    >
                      <div className="recipe-name">{recipe.icon} {recipe.name}</div>
                      <div className={`recipe-difficulty difficulty-${recipe.difficulty}`}>{`Difficulty: ${'★'.repeat(recipe.difficulty)}`}</div>
                      <div className="recipe-profit">Profit: {recipe.sellPrice}g</div>
                      {!canCraft && (
                        <div style={{ color: 'var(--color-error)', fontSize: 'var(--font-size-xs)' }}>
                          Missing materials
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {selectedRecipe && (
                <CraftingInterface selectedRecipe={selectedRecipe} canCraft={true} />
              )}
            </div>
          )}
        </div>
        <div className="inventory-panel">
          <h3>📦 Inventory</h3>
          <InventoryPanel />
        </div>
      </div>
    </section>
  );
};
export default ForgeTab;
