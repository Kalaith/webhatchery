import React from 'react';
import { useCrafting } from '../../hooks/useCrafting';
import { useMaterials } from '../../hooks/useMaterials';
import { MAX_HAMMER_CLICKS } from '../../constants/gameConfig';
import HammerMiniGame from './HammerMiniGame';
import { useCraftingResult } from '../../hooks/useCraftingResult';

interface CraftingInterfaceProps {
  selectedRecipe: string | null;
  canCraft: boolean;
}

const CraftingInterface: React.FC<CraftingInterfaceProps> = ({ selectedRecipe, canCraft }) => {
  const {
    recipe,
    totalCost,
    hammerClicks,
    hammerAccuracy,
    craftingStarted,
    result,
    handleStartCrafting,
    handleHammer
  } = useCrafting(selectedRecipe, canCraft);
  const materials = useMaterials();
  const safeHammerClicks = typeof hammerClicks === 'number' ? hammerClicks : 0;
  const {
    localResult,
    showResult,
    handleMiniGameComplete,
    setShowResult,
  } = useCraftingResult(recipe as any);
  if (!recipe) return null;
  return (
    <div className="crafting-interface">
      <div className="recipe-details">
        <h4>{recipe.icon} {recipe.name}</h4>
        <div className="required-materials">
          {Object.entries(recipe.materials).map(([mat, qty]) => {
            const owned = materials[mat] ?? 0;
            const lacking = owned < qty;
            return (
              <div key={mat} className={`material-requirement${lacking ? ' insufficient' : ''}`}>
                {owned} / {qty} {mat} {lacking ? <span style={{ color: 'var(--color-error)' }}>(Lacking)</span> : null}
              </div>
            );
          })}
        </div>
        <div className="crafting-cost">
          <span>Total Cost: </span>
          <span>{totalCost}</span> gold
        </div>
      </div>
      {!craftingStarted ? (
        <button
          className="btn btn--primary"
          onClick={handleStartCrafting}
          disabled={!canCraft}
        >Start Crafting</button>
      ) : (
        <>
          {!showResult ? (
            <HammerMiniGame
              maxClicks={MAX_HAMMER_CLICKS}
              craftingStarted={craftingStarted}
              onComplete={handleMiniGameComplete}
            />
          ) : (
            <div style={{ marginTop: '16px' }}>
              <div className="status status--success">{localResult} Quality Crafted!</div>
              <div>Item added to inventory.</div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CraftingInterface;
