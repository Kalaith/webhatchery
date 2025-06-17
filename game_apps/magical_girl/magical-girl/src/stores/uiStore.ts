// UI store for managing interface state
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type ViewType = 
  | 'dashboard' 
  | 'collection' 
  | 'training' 
  | 'missions' 
  | 'settings' 
  | 'achievements';

export type ModalType = 
  | 'magical-girl-details' 
  | 'training-session' 
  | 'mission-details' 
  | 'settings' 
  | 'achievement-details'
  | 'confirmation'
  | null;

interface UIState {
  // Current view and navigation
  currentView: ViewType;
  previousView: ViewType | null;
  isLoading: boolean;
  
  // Modal system
  activeModal: ModalType;
  modalData: any;
  
  // Panel states
  sidebarCollapsed: boolean;
  resourcePanelVisible: boolean;
  notificationPanelVisible: boolean;
  
  // Selected items
  selectedMagicalGirl: string | null;
  selectedMission: string | null;
  selectedTraining: string | null;
  
  // Filter and search states
  collectionFilter: {
    element: string | null;
    rarity: string | null;
    unlocked: boolean | null;
    search: string;
  };
  
  missionFilter: {
    type: string | null;
    difficulty: string | null;
    completed: boolean | null;
    search: string;
  };
  
  trainingFilter: {
    type: string | null;
    difficulty: string | null;
    search: string;
  };  
  // Animation states
  animationStates: {
    [key: string]: boolean;
  };
  
  // Tutorial state
  tutorial: {
    active: boolean;
    currentStep: number;
    completed: boolean;
    skipped: boolean;
  };
  
  // Theme and display
  theme: 'light' | 'dark' | 'auto';
  animationsEnabled: boolean;
  soundEnabled: boolean;
  
  // Responsive design
  isMobile: boolean;
  screenSize: 'sm' | 'md' | 'lg' | 'xl';
}

interface UIActions {
  // Navigation
  setCurrentView: (view: ViewType) => void;
  goBack: () => void;
  setLoading: (loading: boolean) => void;
  
  // Modal management
  openModal: (modal: ModalType, data?: any) => void;
  closeModal: () => void;
  
  // Panel management
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleResourcePanel: () => void;
  toggleNotificationPanel: () => void;
  
  // Selection management
  selectMagicalGirl: (id: string | null) => void;
  selectMission: (id: string | null) => void;
  selectTraining: (id: string | null) => void;
  
  // Filter management
  setCollectionFilter: (filter: Partial<UIState['collectionFilter']>) => void;
  resetCollectionFilter: () => void;
  setMissionFilter: (filter: Partial<UIState['missionFilter']>) => void;
  resetMissionFilter: () => void;
  setTrainingFilter: (filter: Partial<UIState['trainingFilter']>) => void;
  resetTrainingFilter: () => void;
  
  // Animation management
  setAnimation: (key: string, value: boolean) => void;
  
  // Tutorial management
  startTutorial: () => void;
  nextTutorialStep: () => void;
  previousTutorialStep: () => void;
  skipTutorial: () => void;
  completeTutorial: () => void;
  
  // Settings
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  setAnimations: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  
  // Responsive
  setScreenSize: (size: 'sm' | 'md' | 'lg' | 'xl') => void;
  setIsMobile: (mobile: boolean) => void;
}

type UIStore = UIState & UIActions;

const initialState: UIState = {
  currentView: 'dashboard',
  previousView: null,
  isLoading: false,
  
  activeModal: null,
  modalData: null,
  
  sidebarCollapsed: false,
  resourcePanelVisible: true,
  notificationPanelVisible: false,
  
  selectedMagicalGirl: null,
  selectedMission: null,
  selectedTraining: null,
  
  collectionFilter: {
    element: null,
    rarity: null,
    unlocked: null,
    search: ''
  },
  
  missionFilter: {
    type: null,
    difficulty: null,
    completed: null,
    search: ''
  },
  
  trainingFilter: {
    type: null,
    difficulty: null,
    search: ''
  },  
  animationStates: {},
  
  tutorial: {
    active: false,
    currentStep: 0,
    completed: false,
    skipped: false
  },
  
  theme: 'light',
  animationsEnabled: true,
  soundEnabled: true,
  
  isMobile: false,
  screenSize: 'lg'
};

export const useUIStore = create<UIStore>()(
  immer((set, get) => ({
    ...initialState,
    
    // Navigation
    setCurrentView: (view) => set((state) => {
      state.previousView = state.currentView;
      state.currentView = view;
      // Clear selections when changing views
      if (view !== 'collection') {
        state.selectedMagicalGirl = null;
      }
      if (view !== 'missions') {
        state.selectedMission = null;
      }
      if (view !== 'training') {
        state.selectedTraining = null;
      }
    }),
    
    goBack: () => set((state) => {
      if (state.previousView) {
        const temp = state.currentView;
        state.currentView = state.previousView;
        state.previousView = temp;
      }
    }),
    
    setLoading: (loading) => set((state) => {
      state.isLoading = loading;
    }),
    
    // Modal management
    openModal: (modal, data) => set((state) => {
      state.activeModal = modal;
      state.modalData = data || null;
    }),
    
    closeModal: () => set((state) => {
      state.activeModal = null;
      state.modalData = null;
    }),
    
    // Panel management
    toggleSidebar: () => set((state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    }),
    
    setSidebarCollapsed: (collapsed) => set((state) => {
      state.sidebarCollapsed = collapsed;
    }),
    
    toggleResourcePanel: () => set((state) => {
      state.resourcePanelVisible = !state.resourcePanelVisible;
    }),
    
    toggleNotificationPanel: () => set((state) => {
      state.notificationPanelVisible = !state.notificationPanelVisible;
    }),
    
    // Selection management
    selectMagicalGirl: (id) => set((state) => {
      state.selectedMagicalGirl = id;
    }),
    
    selectMission: (id) => set((state) => {
      state.selectedMission = id;
    }),
    
    selectTraining: (id) => set((state) => {
      state.selectedTraining = id;
    }),
    
    // Filter management
    setCollectionFilter: (filter) => set((state) => {
      Object.assign(state.collectionFilter, filter);
    }),
    
    resetCollectionFilter: () => set((state) => {
      state.collectionFilter = {
        element: null,
        rarity: null,
        unlocked: null,
        search: ''
      };
    }),
    
    setMissionFilter: (filter) => set((state) => {
      Object.assign(state.missionFilter, filter);
    }),
    
    resetMissionFilter: () => set((state) => {
      state.missionFilter = {
        type: null,
        difficulty: null,
        completed: null,
        search: ''
      };
    }),
    
    setTrainingFilter: (filter) => set((state) => {
      Object.assign(state.trainingFilter, filter);
    }),
    
    resetTrainingFilter: () => set((state) => {
      state.trainingFilter = {
        type: null,
        difficulty: null,
        search: ''
      };
    }),
      // Animation management
    setAnimation: (key, value) => set((state) => {
      state.animationStates[key] = value;
    }),
    
    // Tutorial management
    startTutorial: () => set((state) => {
      state.tutorial.active = true;
      state.tutorial.currentStep = 0;
      state.tutorial.completed = false;
      state.tutorial.skipped = false;
    }),
    
    nextTutorialStep: () => set((state) => {
      if (state.tutorial.active) {
        state.tutorial.currentStep += 1;
        // Check if tutorial is complete (assuming 5 steps)
        if (state.tutorial.currentStep >= 5) {
          get().completeTutorial();
        }
      }
    }),
    
    previousTutorialStep: () => set((state) => {
      if (state.tutorial.active && state.tutorial.currentStep > 0) {
        state.tutorial.currentStep -= 1;
      }
    }),
    
    skipTutorial: () => set((state) => {
      state.tutorial.active = false;
      state.tutorial.skipped = true;
    }),
    
    completeTutorial: () => set((state) => {
      state.tutorial.active = false;
      state.tutorial.completed = true;
    }),
    
    // Settings
    setTheme: (theme) => set((state) => {
      state.theme = theme;
    }),
      setAnimations: (enabled) => set((state) => {
      state.animationsEnabled = enabled;
    }),
    
    setSoundEnabled: (enabled) => set((state) => {
      state.soundEnabled = enabled;
    }),
    
    // Responsive
    setScreenSize: (size) => set((state) => {
      state.screenSize = size;
    }),
    
    setIsMobile: (mobile) => set((state) => {
      state.isMobile = mobile;
      // Auto-collapse sidebar on mobile
      if (mobile) {
        state.sidebarCollapsed = true;
      }
    })
  }))
);

// Auto-detect screen size changes
if (typeof window !== 'undefined') {
  const updateScreenSize = () => {
    const width = window.innerWidth;
    let size: 'sm' | 'md' | 'lg' | 'xl';
    
    if (width < 640) {
      size = 'sm';
    } else if (width < 768) {
      size = 'md';
    } else if (width < 1024) {
      size = 'lg';
    } else {
      size = 'xl';
    }
    
    useUIStore.getState().setScreenSize(size);
    useUIStore.getState().setIsMobile(width < 768);
  };
  
  // Initial check
  updateScreenSize();
  
  // Listen for resize events
  window.addEventListener('resize', updateScreenSize);
}
