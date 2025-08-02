import { useCallback, useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { RECIPES } from '../constants/gameData';

export function useForge() {
  const { state, setState } = useGameStore();
  const { forgeLit, unlockedRecipes, materials } = state;
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);

  const handleLightForge = useCallback(() => {
    setState({ ...state, forgeLit: true });
  }, [state, setState]);

  const handleSelectRecipe = useCallback((recipeName: string) => {
    setSelectedRecipe(recipeName);
  }, []);

  const getCanCraft = useCallback((recipeName: string) => {
    const recipe = RECIPES.find((r) => r.name === recipeName);
    if (!recipe) return false;
    return Object.entries(recipe.materials).every(
      ([mat, qty]) => (materials[mat] ?? 0) >= qty
    );
  }, [materials]);

  return {
    forgeLit,
    unlockedRecipes,
    materials,
    selectedRecipe,
    handleLightForge,
    handleSelectRecipe,
    getCanCraft,
  };
}
