/**
 * Base game store structure following Zustand patterns
 * This can be extended by individual games
 */
import React from 'react';

// For now, we'll create a simple base store without Zustand dependencies
// This can be enhanced once Zustand is installed

// Base UI state interface
export interface BaseUIState {
  activeTab: string;
  isLoading: boolean;
  error: string | null;
  modals: {
    [key: string]: {
      isOpen: boolean;
      data?: any;
    };
  };
}

// Base game state interface
export interface BaseGameState {
  ui: BaseUIState;
  resources: Record<string, number>;
  entities: Record<string, any[]>;
  settings: {
    autoSave: boolean;
    soundEnabled: boolean;
    [key: string]: any;
  };
}

// Base actions interface
export interface BaseGameActions {
  // UI actions
  setActiveTab: (tab: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  openModal: (modalId: string, data?: any) => void;
  closeModal: (modalId: string) => void;
  
  // Resource actions
  updateResource: (resource: string, amount: number) => void;
  setResource: (resource: string, amount: number) => void;
  
  // Entity actions
  addEntity: (type: string, entity: any) => void;
  updateEntity: (type: string, id: string, updates: Partial<any>) => void;
  removeEntity: (type: string, id: string) => void;
  
  // Settings actions
  updateSetting: (key: string, value: any) => void;
  
  // Utility actions
  reset: () => void;
  clearError: () => void;
}

/**
 * Create a game store with base functionality
 */
export function createGameStore<T extends BaseGameState, A extends BaseGameActions>(
  initialState: Omit<T, keyof BaseGameState>,
  actions: (set: any, get: any) => Omit<A, keyof BaseGameActions>,
  options: {
    name: string;
    version?: number;
    autoSave?: boolean;
  }
) {
  const defaultState: BaseGameState = {
    ui: {
      activeTab: 'dashboard',
      isLoading: false,
      error: null,
      modals: {},
    },
    resources: {},
    entities: {},
    settings: {
      autoSave: options.autoSave ?? true,
      soundEnabled: true,
    },
  };

  // Simple implementation without Zustand for now
  // This should be replaced when Zustand is available
  console.warn('createGameStore: Zustand not available, using basic implementation');
  
  return () => ({
    ...defaultState,
    ...initialState,
    // Basic actions would go here
  });
}

/**
 * Hook for memoized selectors
 */
export function useGameSelector<T, R>(
  store: () => T,
  selector: (state: T) => R,
  deps: any[] = []
) {
  const selected = store();
  return React.useMemo(() => selector(selected), deps);
}

/**
 * Performance monitoring hook
 */
export function usePerformanceMonitor(componentName: string) {
  React.useEffect(() => {
    if (import.meta.env.DEV) {
      console.time(`${componentName} render`);
      return () => {
        console.timeEnd(`${componentName} render`);
      };
    }
  });
}
