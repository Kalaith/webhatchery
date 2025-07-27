# Frontend Development Standards for React Applications

This document outlines the comprehensive standards for developing React-based frontend applications within our ecosystem. Adhering to these guidelines ensures consistency, maintainability, scalability, and a streamlined development workflow across all projects, with specific focus on clean code principles and game application patterns.

## 1. Core Technologies

*   **Framework**: React (latest stable version)
*   **Language**: TypeScript (latest stable version)
    *   **Rationale**: Provides static type checking, improving code quality, readability, and reducing runtime errors.
*   **Build Tool**: Vite
    *   **Rationale**: Offers extremely fast cold start times, instant hot module replacement (HMR), and optimized production builds.
*   **Styling**: Tailwind CSS
    *   **Rationale**: Utility-first CSS framework for rapid UI development, consistent design, and highly optimized CSS bundles.
*   **Animation**: Framer Motion
    *   **Rationale**: A production-ready motion library for React, enabling smooth and performant animations and transitions.
*   **Routing**: React Router DOM
    *   **Rationale**: Standard solution for declarative routing in React applications.

## 2. Project Structure

All React frontend projects **must** adhere to the following standardized directory structure. This promotes discoverability, modularity, and consistency.

```
src/
├── api/                # (Optional) API service definitions, client instances, and related types for backend interaction.
│                       # Use this for centralized API calls, e.g., `api/auth.ts`, `api/game.ts`.
├── components/         # Reusable React components.
│   ├── ui/             # Generic, presentational UI components (e.g., Button, Modal, Input, Card).
│   │                   # These components should be highly reusable and have minimal business logic.
│   ├── game/           # Game-specific components (e.g., DragonDisplay, UpgradeCard, MinionPanel, AdventurerList).
│   │                   # These components encapsulate game-specific UI and logic.
│   └── layout/         # Components defining the overall application layout (e.g., Header, Sidebar, MainContent, Footer).
├── hooks/              # Custom React hooks for encapsulating reusable logic and stateful behavior.
│                       # (e.g., `useGameLoop`, `useOfflineEarnings`, `useAuth`, `useFormValidation`).
├── stores/             # State management definitions using Zustand.
│                       # Each file in this directory should define a single Zustand store.
│                       # (e.g., `useGameStore.ts`, `usePlayerStore.ts`, `useSettingsStore.ts`).
├── types/              # Centralized TypeScript type definitions and interfaces.
│                       # This includes interfaces for API responses, game entities, component props, and global types.
│                       # (e.g., `game.d.ts`, `api.d.ts`, `components.d.ts`).
├── data/               # Static, immutable game data or configuration files.
│                       # (e.g., `treasures.ts`, `upgrades.ts`, `achievements.ts`, `npcs.ts`).
│                       # These files should export plain JavaScript objects/arrays.
├── utils/              # Utility functions and core game logic that are not tied to React components or hooks.
│                       # (e.g., calculation functions, data transformers, helper functions).
├── assets/             # Static assets like images, icons, fonts, and other media files.
│                       # (If not served from the `public/` directory).
├── styles/             # Global CSS files, Tailwind CSS configuration, and any custom base styles.
│                       # (e.g., `index.css`, `tailwind.css`).
├── App.tsx             # The main application component.
├── main.tsx            # Entry point for the React application (ReactDOM.render).
└── vite-env.d.ts       # Vite environment type definitions.
```

## 3. State Management

*   **Primary Tool**: Zustand
    *   **Rationale**: Lightweight, performant, and easy-to-use state management solution.
    *   **Implementation**:
        *   Define distinct stores for different domains of your application (e.g., `gameStore`, `playerStore`, `uiStore`).
        *   Utilize Zustand's middleware for persistence (e.g., `persist`) to `localStorage` for saving game state.
        *   Avoid deeply nested state; flatten state as much as possible.
        *   Access state and actions directly in components using hooks provided by Zustand.
*   **Server State (Optional)**: React Query (or similar, if backend interaction is significant)
    *   **Rationale**: For applications with significant backend interaction, React Query provides robust solutions for data fetching, caching, synchronization, and error handling.
    *   **Implementation**: Use `useQuery` for fetching data and `useMutation` for data modifications.

## 4. Data Flow & Storage

*   **Static Data**: Stored in `src/data/` as TypeScript files exporting plain objects/arrays. Loaded once at application startup or as needed.
*   **Client-Side Dynamic State**: Managed exclusively by Zustand stores (`src/stores/`). This is the single source of truth for the UI.
*   **Local Storage**: Used for persisting critical game state (e.g., player progress, settings) via Zustand's `persist` middleware.
*   **API Interaction**:
    *   Centralize API calls within the `src/api/` directory.
    *   Use `fetch` API or a lightweight library like `axios` for HTTP requests.
    *   Define clear request and response types in `src/types/api.d.ts`.
    *   Handle loading, error, and success states in components, often facilitated by React Query if used.

## 5. Data Presentation & Styling

*   **React Components**:
    *   Components should be functional components using React Hooks.
    *   Prioritize composition over inheritance.
    *   Keep components small, focused, and reusable.
    *   Separate presentational components (`src/components/ui/`) from container/game-specific components (`src/components/game/`).
*   **Tailwind CSS**:
    *   Apply utility classes directly in JSX for styling.
    *   Use `@apply` sparingly, primarily for creating reusable component classes or for complex, non-utility-based styles.
    *   Ensure responsive design using Tailwind's responsive prefixes (e.g., `md:`, `lg:`).
    *   Customize Tailwind's configuration (`tailwind.config.js`) for project-specific themes, colors, and spacing.
*   **Framer Motion**:
    *   Integrate animations directly into components using `motion` components and `useAnimation` hook.
    *   Keep animations performant by avoiding unnecessary re-renders and complex calculations.

## 6. Type Safety (TypeScript)

*   **Strict Mode**: Enable strict mode in `tsconfig.json` for maximum type safety.
*   **Comprehensive Typing**:
    *   Define interfaces for all data structures, including game entities (e.g., `Dragon`, `Upgrade`), API request/response payloads, and component props.
    *   Use `src/types/` for global type definitions.
    *   Type all function arguments and return values.
    *   Leverage TypeScript's utility types (e.g., `Partial`, `Pick`, `Omit`).

## 7. Development Workflow

*   **Linting**: ESLint with TypeScript ESLint plugin.
    *   **Configuration**: Use a consistent `.eslintrc.js` across projects.
    *   **Enforcement**: Integrate linting into pre-commit hooks or CI/CD pipelines.
*   **Code Formatting**: Prettier (recommended, but not strictly enforced by this document).
*   **Testing**: (To be defined based on project needs, e.g., Vitest, React Testing Library).
*   **Build & Serve**: Use Vite scripts (`npm run dev`, `npm run build`, `npm run preview`).

## 8. Documentation

*   **README.md**: Each project's `README.md` must provide a clear overview, setup instructions, and a summary of its architecture, following the detailed example provided in `dragons_den/frontend/README.md`.
*   **Code Comments**: Use comments sparingly, primarily for explaining *why* a piece of code exists or for complex algorithms, rather than *what* it does.
*   **Type Definitions**: Leverage TypeScript interfaces and JSDoc comments for self-documenting code.

---

## 9. Clean Code Principles Applied

### ✅ Single Responsibility Principle
Each component, hook, and function should have one clear purpose and responsibility.

### ✅ Separation of Concerns
Clear boundaries between UI components, business logic, state management, and data layers.

### ✅ Reusable Components
Generic UI components that can be composed and reused across different features.

### ✅ Type Safety
Full TypeScript coverage with comprehensive interfaces and type definitions.

### ✅ Modern React Patterns
- **Custom Hooks**: Encapsulate business logic
- **Functional Components**: No class components
- **Composition**: Components compose together cleanly
- **State Management**: Zustand for clean, simple state

### Data Flow Architecture
```
useGameStore (Zustand)
    ↓
useGameActions (Business Logic)
    ↓
ActionButtons (UI Component)
    ↓
ActionButton (Reusable UI)
```

### Constants Management
```javascript
// All magic numbers centralized
GAME_CONSTANTS = {
  PRESTIGE_REQUIREMENT: 1000000,
  MINION_BASE_COST: 50,
  MINION_COST_MULTIPLIER: 1.2,
  // ... more constants
}
```

## 10. Benefits Achieved

### 1. **Maintainability**
- Easy to find and modify specific functionality
- Clear component responsibilities
- Centralized configuration

### 2. **Testability**
- Pure functions in hooks
- Isolated component logic
- Mockable dependencies

### 3. **Reusability**
- Generic UI components
- Composable business logic
- Modular architecture

### 4. **Type Safety**
- Compile-time error checking
- IntelliSense support
- Refactoring confidence

### 5. **Performance**
- Zustand's efficient re-renders
- Component isolation
- Minimal prop drilling

## 11. Component Responsibilities

### UI Components (`/ui`)
Generic, reusable presentational components with minimal business logic:
- Button, Modal, Input, Card
- Form controls and layout components
- Highly composable and theme-aware

### Game Components (`/game`)
Domain-specific components that encapsulate game logic:
- DragonDisplay, UpgradeCard, MinionPanel
- Adventure management interfaces
- Battle and simulation displays

### Business Logic (`/hooks`)
Custom hooks that encapsulate stateful behavior and complex logic:
- useGameLoop, useOfflineEarnings
- useFormValidation, useAuth
- Domain-specific game mechanics

### Configuration (`/constants`, `/data`)
Centralized configuration and static data:
- Game constants and configuration
- Static game data (treasures, upgrades, achievements)
- Environment and build configuration

## 12. Future Extensibility

The refactored codebase follows all clean code principles:
- ✅ **Single Responsibility**: Each component/function has one job
- ✅ **Type Safety**: Full TypeScript coverage
- ✅ **Reusable Components**: Generic, composable UI
- ✅ **Separation of Concerns**: Clear boundaries between layers
- ✅ **Modern React Patterns**: Hooks, functional components, clean state management

---

## 13. Game Application Implementation Patterns

### API Integration Patterns

For all game applications, follow these consistent API interaction patterns:

```typescript
// Centralized API service
interface ApiService {
  get<T>(endpoint: string): Promise<T>;
  post<T>(endpoint: string, data: any): Promise<T>;
  put<T>(endpoint: string, data: any): Promise<T>;
  delete<T>(endpoint: string): Promise<T>;
}

// Game-specific API hooks
const useGameApi = () => {
  const fetchGameState = useCallback(async () => {
    return await api.get<GameState>('/api/game');
  }, []);
  
  const updateGameState = useCallback(async (updates: Partial<GameState>) => {
    return await api.post<GameState>('/api/game/update', updates);
  }, []);
  
  return { fetchGameState, updateGameState };
};
```

### State Management Patterns

```typescript
// Game store pattern
interface GameStore {
  // State
  gameState: GameState;
  loading: boolean;
  error: string | null;
  
  // Actions
  initializeGame: () => Promise<void>;
  updateGame: (updates: Partial<GameState>) => void;
  resetGame: () => void;
}

const useGameStore = create<GameStore>((set, get) => ({
  gameState: initialGameState,
  loading: false,
  error: null,
  
  initializeGame: async () => {
    set({ loading: true, error: null });
    try {
      const gameState = await api.get<GameState>('/api/game');
      set({ gameState, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  updateGame: (updates) => set((state) => ({
    gameState: { ...state.gameState, ...updates }
  })),
  
  resetGame: () => set({ gameState: initialGameState })
}));
```

### Component Composition Patterns

```typescript
// Reusable game component pattern
interface GamePanelProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

const GamePanel: React.FC<GamePanelProps> = ({ 
  title, 
  children, 
  actions, 
  className 
}) => (
  <div className={`bg-gray-800 rounded-lg p-4 ${className}`}>
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
    {children}
  </div>
);

// Usage in game-specific components
const DragonManagement = () => (
  <GamePanel 
    title="Dragon Management"
    actions={<Button onClick={addDragon}>Add Dragon</Button>}
  >
    <DragonList dragons={dragons} />
  </GamePanel>
);
```

## 14. Game-Specific Implementation Examples

### Adventurer Guild Pattern
```typescript
interface Adventurer {
  id: string;
  name: string;
  level: number;
  class: 'Warrior' | 'Mage' | 'Rogue';
  experience: number;
  equipment: Equipment[];
}

interface Quest {
  id: string;
  title: string;
  description: string;
  reward: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  requirements: QuestRequirement[];
}

interface Guild {
  name: string;
  level: number;
  resources: {
    gold: number;
    wood: number;
    mana: number;
  };
  adventurers: Adventurer[];
  activeQuests: Quest[];
}
```

### Dragons Den Pattern
```typescript
interface Dragon {
  id: string;
  name: string;
  element: 'Fire' | 'Water' | 'Earth' | 'Air';
  level: number;
  experience: number;
  stats: DragonStats;
  abilities: Ability[];
}

interface Habitat {
  id: string;
  type: 'Mountain' | 'Forest' | 'Volcano' | 'Ocean';
  capacity: number;
  dragons: string[]; // Dragon IDs
  environment: EnvironmentModifiers;
}

interface BreedingPair {
  parent1: string;
  parent2: string;
  breedingTime: number;
  offspring?: Dragon;
}
```

### Dungeon Core Pattern
```typescript
interface DungeonTile {
  id: string;
  type: 'Floor' | 'Wall' | 'Trap' | 'SpawnPoint' | 'Treasure';
  position: { x: number; y: number };
  properties: TileProperties;
}

interface Monster {
  id: string;
  type: MonsterType;
  level: number;
  health: number;
  damage: number;
  position: { x: number; y: number };
}

interface BattleLog {
  timestamp: number;
  message: string;
  type: 'combat' | 'system' | 'loot';
}
```

### State Management Hooks
```typescript
// Game loop hook for idle games
const useGameLoop = (intervalMs: number = 1000) => {
  const updateGame = useGameStore(state => state.updateGame);
  
  useEffect(() => {
    const interval = setInterval(() => {
      updateGame(calculateIdleProgress());
    }, intervalMs);
    
    return () => clearInterval(interval);
  }, [updateGame, intervalMs]);
};

// Offline earnings calculation
const useOfflineEarnings = () => {
  const { gameState, updateGame } = useGameStore();
  
  useEffect(() => {
    const lastSaveTime = localStorage.getItem('lastSaveTime');
    if (lastSaveTime) {
      const offlineTime = Date.now() - parseInt(lastSaveTime);
      const offlineEarnings = calculateOfflineEarnings(offlineTime, gameState);
      updateGame({ resources: { ...gameState.resources, ...offlineEarnings } });
    }
  }, []);
  
  useEffect(() => {
    const saveTime = () => localStorage.setItem('lastSaveTime', Date.now().toString());
    window.addEventListener('beforeunload', saveTime);
    return () => window.removeEventListener('beforeunload', saveTime);
  }, []);
};
```

## 15. Comprehensive Game Application Type Definitions

### Dungeon Master Pattern
```typescript
interface Scenario {
  id: string;
  title: string;
  description: string;
  startingScene: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface NPC {
  id: string;
  name: string;
  dialogue: string[];
  personality: NPCPersonality;
  quests?: Quest[];
}

interface PlayerAction {
  type: 'Move' | 'Talk' | 'Attack' | 'Investigate';
  target?: string;
  parameters?: Record<string, any>;
}

interface GameSession {
  id: string;
  scenarioId: string;
  currentScene: string;
  playerStats: PlayerStats;
  inventory: Item[];
  history: ActionHistory[];
}
```

### Hive Mind Pattern
```typescript
interface Hive {
  id: string;
  level: number;
  resources: {
    biomass: number;
    crystal: number;
    energy: number;
  };
  units: Record<string, number>;
  evolutions: Evolution[];
  productions: Production[];
}

interface Unit {
  id: string;
  name: string;
  type: 'Worker' | 'Warrior' | 'Queen' | 'Specialist';
  cost: ResourceCost;
  productionRate: number;
  abilities: UnitAbility[];
}

interface Evolution {
  id: string;
  name: string;
  description: string;
  cost: number;
  requirements: EvolutionRequirement[];
  effects: EvolutionEffect[];
}

interface Production {
  unitType: string;
  quantity: number;
  timeRemaining: number;
  isCompleted: boolean;
}
```

### Kemo Sim Pattern
```typescript
interface Kemonomimi {
  id: string;
  name: string;
  species: 'Cat' | 'Fox' | 'Wolf' | 'Rabbit' | 'Dragon';
  age: number;
  gender: 'Male' | 'Female';
  genes: Gene[];
  traits: Trait[];
  relationships: Relationship[];
}

interface Gene {
  trait: 'EyeColor' | 'FurPattern' | 'EarShape' | 'TailType';
  value: string;
  dominance: 'Dominant' | 'Recessive';
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Legendary';
}

interface BreedingPair {
  parent1: string;
  parent2: string;
  breedingStartTime: number;
  breedingDuration: number;
  offspring?: Kemonomimi;
  isComplete: boolean;
}

interface Trait {
  id: string;
  name: string;
  category: 'Physical' | 'Personality' | 'Special';
  effect: TraitEffect;
}
```

### Kingdom Wars Pattern
```typescript
interface Kingdom {
  id: string;
  name: string;
  level: number;
  population: number;
  resources: {
    gold: number;
    food: number;
    iron: number;
    wood: number;
  };
  buildings: Building[];
  armies: Army[];
  diplomacy: DiplomaticStatus[];
}

interface Army {
  id: string;
  name: string;
  units: Record<string, number>;
  location: { x: number; y: number };
  status: 'Idle' | 'Moving' | 'Fighting' | 'Defending';
  morale: number;
}

interface BattleReport {
  id: string;
  timestamp: number;
  attacker: string;
  defender: string;
  outcome: 'Victory' | 'Defeat' | 'Draw';
  casualties: {
    attacker: Record<string, number>;
    defender: Record<string, number>;
  };
  loot: ResourceCost;
}

interface Building {
  id: string;
  type: 'Barracks' | 'Farm' | 'Mine' | 'Workshop';
  level: number;
  productionRate: number;
  upgradeRequirements: ResourceCost;
}
```

### Magical Girl Pattern
```typescript
interface MagicalGirl {
  id: string;
  name: string;
  element: 'Light' | 'Dark' | 'Fire' | 'Water' | 'Earth' | 'Air';
  level: number;
  experience: number;
  stats: MagicalGirlStats;
  abilities: Ability[];
  equipment: Equipment[];
  transformation: Transformation;
}

interface Ability {
  id: string;
  name: string;
  element: string;
  level: number;
  cost: number;
  cooldown: number;
  effects: AbilityEffect[];
}

interface Quest {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  rewards: QuestReward[];
  requirements: QuestRequirement[];
  isCompleted: boolean;
  progress: number;
}

interface Transformation {
  id: string;
  name: string;
  statBonus: StatBonus;
  duration: number;
  cooldown: number;
  abilities: string[];
}
```

### MMO Sandbox Pattern
```typescript
interface Player {
  id: string;
  name: string;
  level: number;
  class: string;
  position: { x: number; y: number; zone: string };
  stats: PlayerStats;
  inventory: Item[];
  skills: Record<string, number>;
  guild?: GuildMembership;
}

interface Item {
  id: string;
  name: string;
  type: 'Weapon' | 'Armor' | 'Consumable' | 'Material' | 'Quest';
  quantity: number;
  quality: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
  stats?: ItemStats;
}

interface ChatMessage {
  id: string;
  sender: string;
  channel: 'Global' | 'Local' | 'Guild' | 'Party';
  text: string;
  timestamp: number;
}

interface WorldZone {
  id: string;
  name: string;
  level: number;
  players: Player[];
  npcs: NPC[];
  resources: Resource[];
}
```

### Planet Trader Pattern
```typescript
interface Planet {
  id: string;
  name: string;
  type: 'Desert' | 'Ocean' | 'Forest' | 'Ice' | 'Volcanic';
  population: number;
  commodities: Record<string, CommodityData>;
  events: PlanetEvent[];
  tradingPosts: TradingPost[];
}

interface CommodityData {
  price: number;
  availability: number;
  demand: 'Low' | 'Medium' | 'High';
  trend: 'Rising' | 'Falling' | 'Stable';
}

interface Trade {
  id: string;
  planetId: string;
  commodityId: string;
  quantity: number;
  type: 'Buy' | 'Sell';
  price: number;
  timestamp: number;
  profit: number;
}

interface Spaceship {
  id: string;
  name: string;
  cargoCapacity: number;
  currentCargo: Record<string, number>;
  fuel: number;
  location: string;
  upgrades: ShipUpgrade[];
}
```

### Xenomorph Park Pattern
```typescript
interface Xenomorph {
  id: string;
  species: 'Drone' | 'Warrior' | 'Queen' | 'Praetorian' | 'Crusher';
  age: number;
  health: number;
  aggression: number;
  intelligence: number;
  isContained: boolean;
  habitatId: string;
  feedingSchedule: FeedingSchedule;
}

interface Habitat {
  id: string;
  name: string;
  type: 'Hive' | 'Cavern' | 'Lab' | 'Quarantine';
  size: 'Small' | 'Medium' | 'Large' | 'Massive';
  containmentLevel: number;
  temperature: number;
  humidity: number;
  xenomorphs: string[];
  securitySystems: SecuritySystem[];
}

interface ParkStatus {
  revenue: number;
  safetyRating: number;
  visitorCount: number;
  containmentBreaches: number;
  activeAlerts: Alert[];
  staffCount: number;
}

interface SecuritySystem {
  id: string;
  type: 'Camera' | 'Motion' | 'Bio' | 'AI';
  status: 'Active' | 'Maintenance' | 'Offline';
  effectiveness: number;
}
```

## 16. Implementation Guidelines Summary

### Quick Reference Checklist

- ✅ **React 19+** with functional components and hooks
- ✅ **TypeScript** with strict mode enabled
- ✅ **Vite** for build tooling and development server
- ✅ **Tailwind CSS** for utility-first styling
- ✅ **Framer Motion** for animations and transitions
- ✅ **Zustand** for state management with persistence
- ✅ **React Router DOM** for client-side routing
- ✅ **ESLint + TypeScript ESLint** for code quality
- ✅ **Centralized API layer** in `/src/api/`
- ✅ **Component composition** over inheritance
- ✅ **Custom hooks** for business logic
- ✅ **Type-safe interfaces** for all data structures
- ✅ **Constants management** for configuration
- ✅ **Clean code principles** throughout

### Project Bootstrap Commands

```bash
# Create new React + TypeScript + Vite project
npm create vite@latest my-game-app -- --template react-ts

# Install required dependencies
npm install zustand framer-motion react-router-dom

# Install development dependencies
npm install -D tailwindcss postcss autoprefixer @types/node
npm install -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser

# Initialize Tailwind CSS
npx tailwindcss init -p
```

This comprehensive document serves as the definitive guide for all React frontend development within the WebHatchery ecosystem, combining best practices with game-specific implementation patterns.
```
