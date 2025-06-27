import { useEffect, useRef } from "react";
import { useGameStore } from "../../stores/gameStore";
import { fetchGameConstantsData } from "../../api/gameApi";

export const TimeSystem: React.FC = () => {
  const { mana, maxMana, manaRegen } = useGameStore();
  const manaIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const setupInterval = async () => {
      if (manaIntervalRef.current) {
        clearInterval(manaIntervalRef.current);
      }
      const gameConstants = await fetchGameConstantsData();
      manaIntervalRef.current = setInterval(() => {
        const store = useGameStore.getState();
        if (store.mana < store.maxMana) {
          const newMana = Math.min(store.mana + store.manaRegen, store.maxMana);
          useGameStore.setState({ mana: newMana });
        }
      }, gameConstants.MANA_REGEN_INTERVAL);
    };

    setupInterval();

    return () => {
      if (manaIntervalRef.current) {
        clearInterval(manaIntervalRef.current);
      }
    };
  }, [mana, maxMana, manaRegen]);

  return null; // This is a system component, no visual rendering
};
