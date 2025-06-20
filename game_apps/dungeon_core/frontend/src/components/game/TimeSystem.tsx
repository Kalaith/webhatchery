import { useEffect, useRef } from "react";
import { useGameStore } from "../../stores/gameStore";
import { GAME_CONSTANTS } from "../../data/gameData";

export const TimeSystem: React.FC = () => {
  const { mana, maxMana, manaRegen } = useGameStore();
  const manaIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Mana regeneration system
  useEffect(() => {
    if (manaIntervalRef.current) {
      clearInterval(manaIntervalRef.current);
    }

    manaIntervalRef.current = setInterval(() => {
      const store = useGameStore.getState();
      if (store.mana < store.maxMana) {
        const newMana = Math.min(store.mana + store.manaRegen, store.maxMana);
        useGameStore.setState({ mana: newMana });
      }
    }, GAME_CONSTANTS.MANA_REGEN_INTERVAL);

    return () => {
      if (manaIntervalRef.current) {
        clearInterval(manaIntervalRef.current);
      }
    };
  }, [mana, maxMana, manaRegen]);

  return null; // This is a system component, no visual rendering
};
