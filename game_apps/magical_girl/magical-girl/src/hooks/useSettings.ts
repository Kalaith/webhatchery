import { useGameStore } from '../stores/gameStore';
import { useCallback } from 'react';

export const useSettings = () => {
  const settings = useGameStore((state) => state.settings);
  const updateSettings = useGameStore((state) => state.updateSettings);
  const setMasterVolume = useGameStore((state) => state.setMasterVolume);
  const resetSettings = useGameStore((state) => state.resetSettings);

  const handleVolumeChange = useCallback((volume: number) => {
    setMasterVolume(volume);
  }, [setMasterVolume]);

  const handleSettingsChange = useCallback((newSettings: Partial<typeof settings>) => {
    updateSettings(newSettings);
  }, [updateSettings]);

  const handleReset = useCallback(() => {
    resetSettings();
  }, [resetSettings]);

  return {
    settings,
    updateSettings: handleSettingsChange,
    setMasterVolume: handleVolumeChange,
    resetSettings: handleReset,
    
    // Derived values
    isMuted: settings.masterVolume === 0,
    volumePercentage: Math.round(settings.masterVolume * 100)
  };
};
