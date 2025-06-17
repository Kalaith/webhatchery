// Settings management slice - Single Responsibility Principle
import type { StateCreator } from 'zustand';

export interface SettingsSlice {
  // State
  settings: {
    masterVolume: number;
    musicVolume: number;
    sfxVolume: number;
    animationsEnabled: boolean;
    autoSave: boolean;
    notifications: boolean;
    theme: 'light' | 'dark' | 'auto';
  };
  
  // Actions
  updateSettings: (settings: Partial<SettingsSlice['settings']>) => void;
  resetSettings: () => void;
  setMasterVolume: (volume: number) => void;
}

const defaultSettings = {
  masterVolume: 0.7,
  musicVolume: 0.5,
  sfxVolume: 0.8,
  animationsEnabled: true,
  autoSave: true,
  notifications: true,
  theme: 'light' as const
};

export const createSettingsSlice: StateCreator<
  SettingsSlice & { 
    addNotification: (notification: any) => void;
  },
  [],
  [],
  SettingsSlice
> = (set, get) => ({
  settings: defaultSettings,
  
  updateSettings: (newSettings) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings }
    }));
    
    // Show notification for settings update
    get().addNotification({
      type: 'success',
      title: 'Settings Updated',
      message: 'Your settings have been saved successfully!',
      duration: 2000
    });
  },
  
  resetSettings: () => {
    set({ settings: defaultSettings });
    
    get().addNotification({
      type: 'info',
      title: 'Settings Reset',
      message: 'All settings have been reset to default values.',
      duration: 3000
    });
  },
  
  setMasterVolume: (volume) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    
    set((state) => ({
      settings: { ...state.settings, masterVolume: clampedVolume }
    }));
    
    // Only show notification if volume is not muted/unmuted
    if (clampedVolume > 0) {
      get().addNotification({
        type: 'info',
        title: 'Volume Changed',
        message: `Master volume set to ${Math.round(clampedVolume * 100)}%`,
        duration: 1500
      });
    }
  }
});
