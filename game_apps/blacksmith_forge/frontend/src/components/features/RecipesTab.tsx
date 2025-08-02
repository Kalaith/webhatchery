import React from 'react';
import { useGameStore } from '../../stores/gameStore';
import { RECIPES } from '../../constants/gameData';

interface RecipesTabProps { active: boolean; }

const RecipesTab: React.FC<RecipesTabProps> = ({ active }) => {
  const { state } = useGameStore();
  const { unlockedRecipes, materials } = state;

  if (!active) return null;

  return (
    <section id="recipes-tab" className="tab-content active">
      <div className="recipes-container">
        <h2>📖 Recipe Book</h2>
        <div className="recipes-grid">
          {RECIPES.map(recipe => {
            const isUnlocked = unlockedRecipes.includes(recipe.name);
            return (
              <div key={recipe.name} className={`recipe-card${!isUnlocked ? ' locked' : ''}`}>
                <div className="recipe-name">{recipe.icon} {recipe.name}</div>
                <div className={`recipe-difficulty difficulty-${recipe.difficulty}`}>{`Difficulty: ${'★'.repeat(recipe.difficulty)}`}</div>
                <div className="recipe-profit">Sell Price: {recipe.sellPrice}g</div>
                <div className="required-materials">
                  {Object.entries(recipe.materials).map(([mat, qty]) => (
                    <div key={mat} className={`material-requirement${(materials[mat] ?? 0) < qty ? ' insufficient' : ''}`}>
                      {mat}: {qty} (Owned: {materials[mat] ?? 0})
                    </div>
                  ))}
                </div>
                {!isUnlocked && (
                  <div style={{ color: 'var(--color-error)', fontSize: 'var(--font-size-xs)', marginTop: '8px' }}>
                    Locked - Level up to unlock
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RecipesTab;
