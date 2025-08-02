import React from 'react';
import RecipeSelector from './RecipeSelector';
import CraftingInterface from './CraftingInterface';

interface CraftingAreaProps {
  forgeLit: boolean;
  unlockedRecipes: string[];
  getCanCraft: (recipeName: string) => boolean;
  selectedRecipe: string | null;
  onSelectRecipe: (recipeName: string) => void;
}

const CraftingArea: React.FC<CraftingAreaProps> = ({ forgeLit, unlockedRecipes, getCanCraft, selectedRecipe, onSelectRecipe }) => (
  forgeLit ? (
    <div className="crafting-area" id="crafting-area">
      <h3>Select Recipe to Craft</h3>
      <RecipeSelector
        unlockedRecipes={unlockedRecipes}
        getCanCraft={getCanCraft}
        onSelectRecipe={onSelectRecipe}
      />
      {selectedRecipe && (
        <CraftingInterface selectedRecipe={selectedRecipe} canCraft={true} />
      )}
    </div>
  ) : null
);

export default CraftingArea;
