import React from 'react';
import { RECIPES } from '../../constants/gameData';
// ...existing code...

interface RecipeMaterialListProps {
  required: Record<string, number>;
}

import { useMaterials } from '../../hooks/useMaterials';

const RecipeMaterialList: React.FC<RecipeMaterialListProps> = ({ required }) => {
  const materials = useMaterials();
  return (
    <div className="recipe-material-list">
      {Object.entries(required).map(([mat, qty]) => {
        const owned = materials[mat] ?? 0;
        const lacking = owned < qty;
        return (
          <div key={mat} className={`material-requirement${lacking ? ' insufficient' : ''}`}>
            {owned} / {qty} {mat} {lacking ? <span style={{ color: 'var(--color-error)' }}>(Lacking)</span> : null}
          </div>
        );
      })}
    </div>
  );
};

interface RecipeSelectorProps {
  unlockedRecipes: string[];
  getCanCraft: (recipeName: string) => boolean;
  onSelectRecipe: (recipeName: string) => void;
}

const RecipeSelector: React.FC<RecipeSelectorProps> = ({ unlockedRecipes, getCanCraft, onSelectRecipe }) => {
  const materials = useMaterials();
  return (
    <div className="recipe-selector" id="recipe-selector">
      {unlockedRecipes.map((recipeName: string) => {
        const recipe = RECIPES.find((r) => r.name === recipeName);
        if (!recipe) return null;
        const canCraft = getCanCraft(recipeName);
        return (
          <div
            key={recipe.name}
            className={`recipe-card${!canCraft ? ' disabled' : ''}`}
            data-recipe={recipe.name}
            style={{ opacity: canCraft ? 1 : 0.5 }}
            onClick={() => canCraft && onSelectRecipe(recipe.name)}
          >
            <div className="recipe-name">{recipe.icon} {recipe.name}</div>
            <div className={`recipe-difficulty difficulty-${recipe.difficulty}`}>{`Difficulty: ${'★'.repeat(recipe.difficulty)}`}</div>
            <div className="recipe-profit">Profit: {recipe.sellPrice}g</div>
            <RecipeMaterialList required={recipe.materials} />
            {!canCraft && (
              <div style={{ color: 'var(--color-error)', fontSize: 'var(--font-size-xs)' }}>
                Missing materials
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RecipeSelector;
