# React TypeScript Frontend Migration Guide

## Overview

This document provides a comprehensive guide for migrating JavaScript applications to modern React TypeScript frontends. While originally created for the Dragon's Den idle game migration, this guide serves as a template for any JavaScript-to-React TypeScript migration project.

## ✨ Clean Code Principles
- **Single Responsibility**: Components, functions, and modules should do one thing only.  
- **Readable Code**: Use meaningful names, clear structure, and consistent formatting.  
- **Reusable Components**: Keep UI components generic and reusable.  
- **Type Safety**: Use TypeScript to enforce contracts and prevent runtime errors.  
- **Separation of Concerns**:
  - UI logic → in components  
  - Business logic → in `features/` or `hooks/`  
  - API calls → in `lib/api/`  
  - Routing → in `pages/` and `App.tsx`
- Use absolute imports via @/ prefix for clarity.
- Extract and reuse hooks, types, and constants.
- Write small, focused components and keep file sizes minimal.
- Keep styles scoped

## Current Application Analysis

Before beginning migration, analyze your existing JavaScript application:

### Core Features Assessment
- **Resource Management**: How does your app handle data/state?
- **User Interactions**: What are the main user actions and workflows?
- **Data Persistence**: How is data stored (localStorage, API, etc.)?
- **Performance Requirements**: What are the current performance bottlenecks?
- **UI Complexity**: How complex are the current UI interactions?

### Existing State Structure Analysis
Analyze your current application state structure. Example for a game application:
```javascript
// Example: Game State Structure
gameState = {
    gold: number,
    totalTreasures: number,
    uniqueTreasures: Set<string>,
    minions: number,
    goldPerClick: number,
    goldPerSecond: number,
    upgrades: Record<string, number>,
    discoveredTreasures: Treasure[],
    achievements: Set<string>,
    prestigeLevel: number,
    lastSave: number,
    cooldowns: { minions: number, explore: number }
}
```

For other application types, consider:
- **E-commerce**: Products, cart, user profile, orders
- **Social Media**: Posts, users, comments, likes
- **Productivity**: Tasks, projects, users, deadlines
- **Dashboard**: Metrics, charts, filters, time ranges

## React TypeScript Architecture

### Project Setup

### Project Setup

#### 1. Initialize React TypeScript Project

Choose your preferred setup method:

**Option A: Vite (Recommended for modern projects)**
```bash
# Navigate to your project directory
cd your-project-directory

# Create new React TypeScript project with Vite
npm create vite@latest your-app-name -- --template react-ts
cd your-app-name

# Install dependencies
npm install
```

**Option B: Create React App (Legacy/Enterprise)**
```bash
# Create new React TypeScript project
npx create-react-app your-app-name --template typescript
cd your-app-name

# Install additional dependencies
npm install @types/react @types/react-dom
```

#### 2. Install Essential Dependencies

**State Management**
```bash
# Choose one based on complexity:
npm install zustand              # Simple state management
npm install @reduxjs/toolkit     # Complex state management
npm install jotai               # Atomic state management
```

**Styling & UI**
```bash
# Tailwind CSS v4 (Recommended)
npm install tailwindcss@^4.0.0 @tailwindcss/vite autoprefixer

# Alternative: Styled Components
npm install styled-components @types/styled-components

# Alternative: Material-UI / Chakra UI / Ant Design
npm install @mui/material @emotion/react @emotion/styled
```

**Animations**
```bash
npm install framer-motion       # React animations
npm install react-spring        # Spring physics animations
```

**Utilities**
```bash
npm install react-use           # Utility hooks
npm install date-fns            # Date utilities
npm install react-router-dom    # Routing
```

#### 3. Configure Tailwind CSS v4 (If chosen)

**Create `tailwind.config.js`:**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Add your brand colors
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
        // Custom color palettes
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        // Custom animations
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
```

**For Vite + Tailwind v4, update `vite.config.ts`:**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
```

**Create `src/styles/globals.css`:**
```css
@import "tailwindcss";

/* Custom CSS variables for Tailwind v4 */
@layer base {
  :root {
    --color-primary: #3b82f6;
    --color-secondary: #64748b;
    --font-sans: 'Inter', system-ui, sans-serif;
  }

  body {
    font-family: var(--font-sans);
    @apply bg-gray-50 text-gray-900;
  }
}

/* Custom component styles */
@layer components {
  .btn-primary {
    @apply bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors;
  }
  
  .card {
    @apply bg-white border border-gray-200 rounded-lg shadow-sm p-6;
  }
}

/* Animation classes */
@layer utilities {
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
```

#### 4. Configure TypeScript

**Update `tsconfig.json` for modern React:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["DOM", "DOM.Iterable", "ES6"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "ESNext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "downlevelIteration": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

#### 5. Project Structure

Create a scalable project structure:
```
your-app-name/
├── public/
├── src/
│   ├── components/
│   │   ├── ui/               # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Card.tsx
│   │   ├── features/         # Feature-specific components
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   └── settings/
│   │   └── layout/           # Layout components
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       └── Footer.tsx
│   ├── hooks/                # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useApi.ts
│   │   └── useLocalStorage.ts
│   ├── stores/               # State management
│   │   ├── authStore.ts
│   │   ├── appStore.ts
│   │   └── uiStore.ts
│   ├── types/                # TypeScript type definitions
│   │   ├── api.ts
│   │   ├── user.ts
│   │   └── components.ts
│   ├── lib/                  # Utilities and helpers
│   │   ├── api.ts
│   │   ├── utils.ts
│   │   └── constants.ts
│   ├── styles/               # Global styles
│   │   ├── globals.css
│   │   └── components.css
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

### Type Definitions

### Type Definitions

Create comprehensive TypeScript interfaces for your application. Adapt these examples to your specific domain:

#### 1. Core Application Types (`src/types/app.ts`)
```typescript
// Base interfaces that apply to most applications
export interface AppState {
  user: User | null;
  preferences: UserPreferences;
  lastSave: number;
  version: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: number;
  updatedAt: number;
}

export type UserRole = 'admin' | 'user' | 'moderator';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  inApp: boolean;
}

// Example: Game-specific types
export interface GameState extends AppState {
  gold: number;
  totalTreasures: number;
  uniqueTreasures: Set<string>;
  minions: number;
  goldPerClick: number;
  goldPerSecond: number;
  upgrades: Record<string, number>;
  discoveredTreasures: Treasure[];
  achievements: Set<string>;
  prestigeLevel: number;
  cooldowns: Cooldowns;
}

export interface Cooldowns {
  minions: number;
  explore: number;
}

// Example: E-commerce types
export interface EcommerceState extends AppState {
  cart: CartItem[];
  orders: Order[];
  products: Product[];
  wishlist: string[];
  shippingAddress: Address | null;
}

export interface CartItem {
  productId: string;
  quantity: number;
  selectedVariant?: ProductVariant;
}

// Example: Task management types
export interface TaskState extends AppState {
  projects: Project[];
  tasks: Task[];
  activeProject: string | null;
  filters: TaskFilters;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string | null;
  dueDate: number | null;
  tags: string[];
}

export type TaskStatus = 'todo' | 'in-progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
```

#### 2. API Types (`src/types/api.ts`)
```typescript
// Generic API response structure
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: 'success' | 'error';
  timestamp: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// HTTP method types
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// API endpoint configuration
export interface ApiEndpoint {
  method: HttpMethod;
  url: string;
  requiresAuth?: boolean;
}
```

#### 3. Component Types (`src/types/components.ts`)
```typescript
// Generic component props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  testId?: string;
}

// Form-related types
export interface FormFieldProps extends BaseComponentProps {
  label: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Table/List components
export interface TableColumn<T = any> {
  key: keyof T;
  title: string;
  width?: string;
  sortable?: boolean;
  render?: (value: any, record: T) => React.ReactNode;
}

export interface ListItemProps<T = any> extends BaseComponentProps {
  item: T;
  selected?: boolean;
  onSelect?: (item: T) => void;
  actions?: React.ReactNode;
}
```

### State Management with Zustand

### State Management with Zustand

Zustand provides a simple, scalable state management solution. Here are patterns for different application types:

#### 1. Basic App Store (`src/stores/appStore.ts`)
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, User, UserPreferences } from '../types';

interface AppStore extends AppState {
  // User Management
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  
  // Preferences
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  // App State
  initialize: () => void;
  reset: () => void;
  updateLastSave: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      preferences: {
        theme: 'system',
        language: 'en',
        notifications: {
          email: true,
          push: true,
          inApp: true,
        },
      },
      lastSave: Date.now(),
      version: '1.0.0',

      // Actions
      setUser: (user) => {
        set({ user });
        get().updateLastSave();
      },

      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              ...updates,
              updatedAt: Date.now(),
            },
          });
          get().updateLastSave();
        }
      },

      updatePreferences: (preferences) => {
        set((state) => ({
          preferences: { ...state.preferences, ...preferences },
        }));
        get().updateLastSave();
      },

      setTheme: (theme) => {
        get().updatePreferences({ theme });
      },

      initialize: () => {
        // Initialize app-specific logic
        console.log('App initialized');
      },

      reset: () => {
        set({
          user: null,
          preferences: {
            theme: 'system',
            language: 'en',
            notifications: {
              email: true,
              push: true,
              inApp: true,
            },
          },
          lastSave: Date.now(),
        });
      },

      updateLastSave: () => {
        set({ lastSave: Date.now() });
      },
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        user: state.user,
        preferences: state.preferences,
        lastSave: state.lastSave,
      }),
    }
  )
);
```

#### 2. Feature-Specific Store Example (Game Store)
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, Treasure } from '../types';

interface GameStore extends GameState {
  // Actions
  collectGold: () => void;
  sendMinions: () => void;
  exploreRuins: () => void;
  buyUpgrade: (upgradeId: string) => void;
  discoverTreasure: () => void;
  prestige: () => void;
  
  // Calculations
  calculateGoldPerClick: () => number;
  calculateGoldPerSecond: () => number;
  calculateUpgradeCost: (upgradeId: string) => number;
  
  // Utilities
  formatNumber: (num: number) => string;
  checkAchievements: () => void;
  updateCooldowns: (deltaTime: number) => void;
  
  // Game Loop
  gameLoop: (deltaTime: number) => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      gold: 0,
      totalTreasures: 0,
      uniqueTreasures: new Set(),
      minions: 0,
      goldPerClick: 1,
      goldPerSecond: 0.1,
      upgrades: {},
      discoveredTreasures: [],
      achievements: new Set(),
      prestigeLevel: 0,
      lastSave: Date.now(),
      cooldowns: { minions: 0, explore: 0 },

      // Actions implementation
      collectGold: () => {
        const goldEarned = get().calculateGoldPerClick();
        set((state) => ({
          gold: state.gold + goldEarned
        }));
        get().checkAchievements();
      },

      // ... other game-specific actions
      
      calculateGoldPerClick: () => {
        const state = get();
        let base = 1;
        const clawLevel = state.upgrades.clawSharpness || 0;
        base *= (1 + clawLevel * 0.5);
        
        // Apply treasure bonuses
        state.discoveredTreasures.forEach(treasure => {
          if (treasure.name === "Ancient Golden Goblet") {
            base *= 1.05;
          }
        });
        
        return Math.ceil(base);
      },

      formatNumber: (num: number) => {
        if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
        if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
        return Math.floor(num).toString();
      },

      // ... other methods
    }),
    {
      name: 'game-storage',
      partialize: (state) => ({
        gold: state.gold,
        totalTreasures: state.totalTreasures,
        uniqueTreasures: Array.from(state.uniqueTreasures),
        minions: state.minions,
        upgrades: state.upgrades,
        discoveredTreasures: state.discoveredTreasures,
        achievements: Array.from(state.achievements),
        prestigeLevel: state.prestigeLevel,
        lastSave: state.lastSave,
      }),
    }
  )
);
```

#### 3. E-commerce Store Example
```typescript
interface EcommerceStore extends EcommerceState {
  // Cart actions
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Wishlist actions
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  
  // Order actions
  placeOrder: (orderData: Omit<Order, 'id' | 'createdAt'>) => void;
  
  // Product actions
  setProducts: (products: Product[]) => void;
  
  // Calculations
  getCartTotal: () => number;
  getCartItemCount: () => number;
}
```

#### 4. Task Management Store Example
```typescript
interface TaskStore extends TaskState {
  // Task actions
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  completeTask: (taskId: string) => void;
  
  // Project actions
  addProject: (project: Omit<Project, 'id'>) => void;
  setActiveProject: (projectId: string | null) => void;
  
  // Filter actions
  setFilters: (filters: Partial<TaskFilters>) => void;
  
  // Computed values
  getFilteredTasks: () => Task[];
  getTasksByProject: (projectId: string) => Task[];
  getCompletedTasksCount: () => number;
}
```

### Component Architecture

### Component Architecture

#### 1. Main App Component (`src/App.tsx`)

**For Tailwind CSS projects:**
```typescript
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/features/Dashboard';
import { useAppStore } from './stores/appStore';
import './styles/globals.css';

function App() {
  const { initialize, preferences } = useAppStore();

  React.useEffect(() => {
    initialize();
  }, [initialize]);

  // Apply theme to document
  React.useEffect(() => {
    const { theme } = preferences;
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [preferences.theme]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Router>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* Add more routes as needed */}
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
```

**For Styled Components projects:**
```typescript
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/layout/Dashboard';
import { useAppStore } from './stores/appStore';
import { theme } from './styles/theme';
import { GlobalStyle } from './styles/globals';

function App() {
  const { initialize, preferences } = useAppStore();

  React.useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <div className="app-container">
        <Header />
        <Dashboard />
      </div>
    </ThemeProvider>
  );
}

export default App;
```

#### 2. Reusable UI Components

**Button Component (`src/components/ui/Button.tsx`):**
```typescript
import React from 'react';
import { motion } from 'framer-motion';
import { ButtonProps } from '../../types/components';

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-blue-500',
    ghost: 'hover:bg-gray-100 text-gray-700 focus:ring-gray-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </motion.button>
  );
};
```

**Modal Component (`src/components/ui/Modal.tsx`):**
```typescript
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ModalProps } from '../../types/components';

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  // Close on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-xl mx-4 w-full ${sizeClasses[size]} ${className}`}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            
            {/* Content */}
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
```

#### 3. Custom Hooks

**API Hook (`src/hooks/useApi.ts`):**
```typescript
import { useState, useEffect } from 'react';
import { ApiResponse, ApiError } from '../types/api';

interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError) => void;
}

export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  options: UseApiOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const { immediate = false, onSuccess, onError } = options;

  const execute = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiCall();
      
      if (response.status === 'success') {
        setData(response.data);
        onSuccess?.(response.data);
      } else {
        throw new Error(response.message || 'API request failed');
      }
    } catch (err) {
      const apiError: ApiError = {
        code: 'API_ERROR',
        message: err instanceof Error ? err.message : 'Unknown error',
      };
      setError(apiError);
      onError?.(apiError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate]);

  return {
    data,
    loading,
    error,
    execute,
    refetch: execute,
  };
}
```

**Local Storage Hook (`src/hooks/useLocalStorage.ts`):**
```typescript
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
```## Migration Strategy and Implementation

### Phase-by-Phase Migration Approach

#### Phase 1: Project Setup and Foundation (Week 1)
1. **Initialize React TypeScript Project**
   - Set up Vite + React + TypeScript
   - Configure Tailwind CSS v4 or chosen styling solution
   - Set up ESLint, Prettier, and basic tooling

2. **Type Definitions**
   - Create comprehensive TypeScript interfaces
   - Define API types and component props
   - Set up type-safe constants and enums

3. **State Management Setup**
   - Install and configure Zustand (or chosen state manager)
   - Create basic store structure
   - Implement persistence layer

#### Phase 2: Core Components and Hooks (Week 2)
1. **UI Component Library**
   - Build reusable Button, Modal, Input components
   - Create layout components (Header, Sidebar, Footer)
   - Implement responsive design patterns

2. **Custom Hooks**
   - Create useLocalStorage, useApi, useDebounce hooks
   - Implement application-specific hooks
   - Add error handling and loading states

3. **Basic Routing**
   - Set up React Router (if needed)
   - Create main application routes
   - Implement protected routes (if auth required)

#### Phase 3: Feature Migration (Weeks 3-4)
1. **Identify Core Features**
   - List all existing functionality
   - Prioritize by user impact and complexity
   - Create migration checklist

2. **Migrate Features One by One**
   - Start with simplest features
   - Test thoroughly before moving to next feature
   - Maintain feature parity with original

3. **Data Migration**
   - Handle existing localStorage data
   - Implement data transformation if needed
   - Provide migration utilities for users

#### Phase 4: Testing and Polish (Week 5)
1. **Comprehensive Testing**
   - Unit tests for utilities and hooks
   - Integration tests for key user flows
   - Performance testing and optimization

2. **UI/UX Improvements**
   - Add loading states and error boundaries
   - Implement animations and transitions
   - Optimize for mobile devices

3. **Final Migration**
   - Deploy to production
   - Monitor for issues
   - Collect user feedback

### Data Migration Patterns

#### 1. Handling Existing Data
```typescript
// src/utils/dataMigration.ts
export interface MigrationResult {
  success: boolean;
  version: string;
  errors?: string[];
}

export class DataMigrator {
  private static VERSION_KEY = 'app_data_version';
  private static CURRENT_VERSION = '2.0.0';

  static migrate(): MigrationResult {
    const currentVersion = localStorage.getItem(this.VERSION_KEY) || '1.0.0';
    
    if (currentVersion === this.CURRENT_VERSION) {
      return { success: true, version: currentVersion };
    }

    try {
      // Example: Game data migration
      if (currentVersion === '1.0.0') {
        this.migrateFrom1_0_0();
      }
      
      localStorage.setItem(this.VERSION_KEY, this.CURRENT_VERSION);
      
      return { 
        success: true, 
        version: this.CURRENT_VERSION 
      };
    } catch (error) {
      return {
        success: false,
        version: currentVersion,
        errors: [error instanceof Error ? error.message : 'Unknown migration error'],
      };
    }
  }

  private static migrateFrom1_0_0() {
    // Migrate from vanilla JS data structure to React structure
    const oldGameData = localStorage.getItem('dragon-hoard-game');
    if (oldGameData) {
      try {
        const parsed = JSON.parse(oldGameData);
        
        // Transform data structure
        const newData = {
          ...parsed,
          uniqueTreasures: Array.isArray(parsed.uniqueTreasures) 
            ? parsed.uniqueTreasures 
            : Array.from(parsed.uniqueTreasures || []),
          achievements: Array.isArray(parsed.achievements)
            ? parsed.achievements
            : Array.from(parsed.achievements || []),
          version: '2.0.0',
        };
        
        localStorage.setItem('app-storage', JSON.stringify(newData));
        localStorage.removeItem('dragon-hoard-game'); // Clean up old key
      } catch (error) {
        console.error('Failed to migrate game data:', error);
      }
    }
  }
}

// Usage in App.tsx
export default function App() {
  useEffect(() => {
    const migrationResult = DataMigrator.migrate();
    if (!migrationResult.success) {
      console.error('Data migration failed:', migrationResult.errors);
      // Show user notification about migration issues
    }
  }, []);
  
  // ... rest of app
}
```

#### 2. Backward Compatibility
```typescript
// src/stores/gameStore.ts
export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // ... store implementation
    }),
    {
      name: 'app-storage',
      // Handle different data formats
      migrate: (persistedState: any, version: number) => {
        // Handle migration between different store versions
        if (version === 0) {
          // Convert Set to Array for JSON serialization
          return {
            ...persistedState,
            uniqueTreasures: Array.from(persistedState.uniqueTreasures || []),
            achievements: Array.from(persistedState.achievements || []),
          };
        }
        return persistedState;
      },
      version: 1,
    }
  )
);
```

### Testing Strategy

#### 1. Unit Testing Setup
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest jsdom
```

**Vite Test Configuration (`vite.config.ts`):**
```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
```

**Test Setup (`src/test/setup.ts`):**
```typescript
import '@testing-library/jest-dom'
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Cleanup after each test case
afterEach(() => {
  cleanup()
})
```

#### 2. Component Testing Examples
```typescript
// src/components/ui/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when loading', () => {
    render(<Button loading>Click me</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

#### 3. Store Testing
```typescript
// src/stores/gameStore.test.ts
import { renderHook, act } from '@testing-library/react'
import { useGameStore } from './gameStore'

describe('Game Store', () => {
  beforeEach(() => {
    // Reset store before each test
    useGameStore.getState().reset?.()
  })

  it('initializes with default values', () => {
    const { result } = renderHook(() => useGameStore())
    
    expect(result.current.gold).toBe(0)
    expect(result.current.minions).toBe(0)
  })

  it('increases gold when collectGold is called', () => {
    const { result } = renderHook(() => useGameStore())
    
    act(() => {
      result.current.collectGold()
    })
    
    expect(result.current.gold).toBeGreaterThan(0)
  })
})
```

### Performance Optimization

#### 1. Code Splitting
```typescript
// Lazy load heavy components
import { lazy, Suspense } from 'react'

const TreasureCollection = lazy(() => import('./components/TreasureCollection'))
const UpgradeShop = lazy(() => import('./components/UpgradeShop'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/treasures" element={<TreasureCollection />} />
        <Route path="/upgrades" element={<UpgradeShop />} />
      </Routes>
    </Suspense>
  )
}
```

#### 2. Memoization
```typescript
import { memo, useMemo, useCallback } from 'react'

// Memoize expensive calculations
const ExpensiveComponent = memo(({ items }: { items: Item[] }) => {
  const processedItems = useMemo(() => {
    return items.map(item => ({
      ...item,
      processedValue: heavyCalculation(item.value)
    }))
  }, [items])

  const handleItemClick = useCallback((item: Item) => {
    // Handle item click
  }, [])

  return (
    <div>
      {processedItems.map(item => (
        <ItemCard 
          key={item.id} 
          item={item} 
          onClick={handleItemClick}
        />
      ))}
    </div>
  )
})
```

### Deployment Considerations

#### 1. Build Configuration
```json
// package.json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  }
}
```

#### 2. Environment Variables
```typescript
// src/config/env.ts
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  appName: import.meta.env.VITE_APP_NAME || 'Your App',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
}
```

#### 3. Static Asset Optimization
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          state: ['zustand'],
          ui: ['framer-motion'],
        },
      },
    },
  },
})
```

#### 2. Resource Counter Component (`src/components/game/ResourceCounter.tsx`)
```typescript
import React from 'react';
import styled from 'styled-components';
import { useGameStore } from '../../stores/gameStore';

const CounterContainer = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: var(--color-surface);
  border-radius: 8px;
  border: 1px solid var(--color-border);
`;

const ResourceItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ResourceIcon = styled.span`
  font-size: 1.2em;
`;

const ResourceValue = styled.span`
  font-weight: 600;
  color: var(--color-primary);
`;

export const ResourceCounter: React.FC = () => {
  const { gold, totalTreasures, uniqueTreasures, minions, formatNumber } = useGameStore();

  return (
    <CounterContainer>
      <ResourceItem>
        <ResourceIcon>💰</ResourceIcon>
        <span>Gold:</span>
        <ResourceValue>{formatNumber(gold)}</ResourceValue>
      </ResourceItem>
      <ResourceItem>
        <ResourceIcon>💎</ResourceIcon>
        <span>Treasures:</span>
        <ResourceValue>{totalTreasures}</ResourceValue>
      </ResourceItem>
      <ResourceItem>
        <ResourceIcon>⭐</ResourceIcon>
        <span>Unique:</span>
        <ResourceValue>{uniqueTreasures.size}</ResourceValue>
      </ResourceItem>
      <ResourceItem>
        <ResourceIcon>👹</ResourceIcon>
        <span>Minions:</span>
        <ResourceValue>{minions}</ResourceValue>
      </ResourceItem>
    </CounterContainer>
  );
};
```

#### 3. Action Buttons Component (`src/components/game/ActionButtons.tsx`)
```typescript
import React from 'react';
import styled from 'styled-components';
import { useGameStore } from '../../stores/gameStore';
import { Button } from '../ui/Button';
import { useCooldowns } from '../../hooks/useCooldowns';

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1rem;
`;

const ActionButton = styled(Button)<{ disabled?: boolean }>`
  position: relative;
  height: 60px;
  font-size: 1.1em;
  
  ${props => props.disabled && `
    opacity: 0.5;
    cursor: not-allowed;
  `}
`;

const CooldownOverlay = styled.div<{ progress: number }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  border-radius: inherit;
  
  ${props => props.progress === 0 && 'display: none;'}
`;

export const ActionButtons: React.FC = () => {
  const { 
    collectGold, 
    sendMinions, 
    exploreRuins, 
    upgradeLair,
    calculateGoldPerClick,
    cooldowns
  } = useGameStore();

  const { minionCooldown, exploreCooldown } = useCooldowns();

  return (
    <ButtonGrid>
      <ActionButton 
        onClick={collectGold}
        variant="primary"
      >
        🐉 Collect Gold (+{calculateGoldPerClick()})
      </ActionButton>
      
      <ActionButton 
        onClick={sendMinions}
        disabled={minionCooldown > 0}
        variant="secondary"
      >
        👹 Send Minions
        <CooldownOverlay progress={minionCooldown}>
          {Math.ceil(minionCooldown)}s
        </CooldownOverlay>
      </ActionButton>
      
      <ActionButton 
        onClick={exploreRuins}
        disabled={exploreCooldown > 0}
        variant="secondary"
      >
        🗺️ Explore Ruins
        <CooldownOverlay progress={exploreCooldown}>
          {Math.ceil(exploreCooldown)}s
        </CooldownOverlay>
      </ActionButton>
      
      <ActionButton 
        onClick={upgradeLair}
        variant="outline"
      >
        🏰 Upgrade Lair
      </ActionButton>
    </ButtonGrid>
  );
};
```

### Custom Hooks

#### 1. Game Loop Hook (`src/hooks/useGameLoop.ts`)
```typescript
import { useEffect, useRef } from 'react';
import { useGameStore } from '../stores/gameStore';

export const useGameLoop = () => {
  const gameLoop = useGameStore(state => state.gameLoop);
  const updateCooldowns = useGameStore(state => state.updateCooldowns);
  const lastTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const loop = () => {
      const now = Date.now();
      const deltaTime = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      gameLoop(deltaTime);
      updateCooldowns(deltaTime);

      requestAnimationFrame(loop);
    };

    const animationId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationId);
  }, [gameLoop, updateCooldowns]);
};
```

#### 2. Auto Save Hook (`src/hooks/useGameSave.ts`)
```typescript
import { useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';

export const useGameSave = (interval: number = 10000) => {
  const lastSave = useGameStore(state => state.lastSave);

  useEffect(() => {
    const saveInterval = setInterval(() => {
      // Zustand persist middleware handles the actual saving
      useGameStore.setState({ lastSave: Date.now() });
    }, interval);

    return () => clearInterval(saveInterval);
  }, [interval]);
};
```

#### 3. Cooldowns Hook (`src/hooks/useCooldowns.ts`)
```typescript
import { useGameStore } from '../stores/gameStore';

export const useCooldowns = () => {
  const cooldowns = useGameStore(state => state.cooldowns);

  return {
    minionCooldown: cooldowns.minions,
    exploreCooldown: cooldowns.explore,
    isMinionsReady: cooldowns.minions <= 0,
    isExploreReady: cooldowns.explore <= 0,
  };
};
```

### Styling and Theme Configuration

#### 1. Tailwind CSS v4 Setup (Recommended)

Tailwind CSS v4 introduces several breaking changes and new features. Here's how to properly configure it:

**Package.json Configuration:**
```json
{
  "type": "module",
  "dependencies": {
    "tailwindcss": "^4.1.10",
    "@tailwindcss/vite": "^4.1.10"
  }
}
```

**Updated Vite Configuration (`vite.config.ts`):**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
```

**Tailwind v4 CSS Import (`src/styles/globals.css`):**
```css
@import "tailwindcss";

/* Tailwind v4 uses the new @import syntax instead of @tailwind directives */

/* Custom CSS variables and base styles */
@layer base {
  :root {
    /* Define your color system */
    --color-primary: #3b82f6;
    --color-primary-foreground: #ffffff;
    --color-secondary: #64748b;
    --color-background: #ffffff;
    --color-foreground: #0f172a;
    --color-muted: #f1f5f9;
    --color-border: #e2e8f0;
    --color-success: #10b981;
    --color-error: #ef4444;
    
    /* Typography */
    --font-family-sans: 'Inter', system-ui, sans-serif;
    --font-family-mono: 'Fira Code', monospace;
  }

  /* Dark mode variables */
  .dark {
    --color-background: #0f172a;
    --color-foreground: #f8fafc;
    --color-muted: #1e293b;
    --color-border: #334155;
  }

  body {
    font-family: var(--font-family-sans);
    background-color: var(--color-background);
    color: var(--color-foreground);
  }
}

/* Updated opacity syntax for Tailwind v4 */
@layer components {
  .card {
    @apply bg-white/90 dark:bg-gray-800/90 border border-gray-200/50 dark:border-gray-700/50 rounded-lg shadow-sm p-6;
  }
  
  .btn-primary {
    @apply bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors;
  }
  
  .btn-secondary {
    @apply bg-gray-500/10 hover:bg-gray-500/20 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg transition-colors;
  }

  /* Note: Tailwind v4 uses slash notation for opacity instead of separate classes */
  /* OLD v3: bg-opacity-30, text-opacity-50 */
  /* NEW v4: bg-black/30, text-black/50 */
}

/* Custom animations */
@layer utilities {
  .animate-fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }
  
  .animate-slide-up {
    animation: slideUp 0.4s ease-out;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

**Tailwind Config for v4 (`tailwind.config.js`):**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Custom color palette
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          500: '#64748b',
          600: '#475569',
          900: '#0f172a',
        },
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
}
```

#### 2. Alternative: Styled Components Setup

If you prefer Styled Components, here's a complete theme configuration:

**Theme Configuration (`src/styles/theme.ts`):**
```typescript
export const theme = {
  colors: {
    // Light mode colors
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#0f172a',
    textSecondary: '#64748b',
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    secondary: '#64748b',
    border: '#e2e8f0',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    
    // Semantic colors for different app types
    // Game colors (if building a game)
    gold: '#ffd700',
    treasure: {
      common: '#8b7355',
      rare: '#4a90e2',
      epic: '#9b59b6',
      legendary: '#f39c12',
    },
    
    // E-commerce colors (if building e-commerce)
    price: '#059669',
    sale: '#dc2626',
    
    // Task management colors (if building productivity app)
    todo: '#6b7280',
    inProgress: '#f59e0b',
    completed: '#10b981',
    urgent: '#ef4444',
  },
  
  fonts: {
    base: '"Inter", system-ui, -apple-system, sans-serif',
    mono: '"Fira Code", ui-monospace, monospace',
    heading: '"Inter", system-ui, sans-serif',
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
  
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
  
  zIndex: {
    dropdown: 1000,
    modal: 1050,
    popover: 1100,
    tooltip: 1200,
  },
};

export type Theme = typeof theme;
```

**Global Styles for Styled Components (`src/styles/globals.ts`):**
```typescript
import { createGlobalStyle } from 'styled-components';
import { Theme } from './theme';

export const GlobalStyle = createGlobalStyle<{ theme: Theme }>`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    line-height: 1.5;
  }

  body {
    font-family: ${props => props.theme.fonts.base};
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${props => props.theme.fonts.heading};
    font-weight: 600;
    line-height: 1.2;
  }

  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: ${props => props.theme.colors.primaryHover};
    }
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    background: none;
    transition: all 0.2s ease;
  }

  /* Animation classes */
  .fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .slide-up {
    animation: slideUp 0.4s ease-out;
  }

  @keyframes slideUp {
    from { 
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  /* Utility classes */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;
```

#### 3. Dark Mode Implementation

**For Tailwind CSS:**
```typescript
// src/hooks/useTheme.ts
import { useEffect } from 'react';
import { useAppStore } from '../stores/appStore';

export const useTheme = () => {
  const { preferences, setTheme } = useAppStore();

  useEffect(() => {
    const { theme } = preferences;
    const root = document.documentElement;
    
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [preferences.theme]);

  return {
    theme: preferences.theme,
    setTheme,
  };
};
```

**For Styled Components:**
```typescript
// src/hooks/useTheme.ts with styled-components
import { useState, useEffect } from 'react';
import { Theme } from '../styles/theme';
import { lightTheme, darkTheme } from '../styles/themes';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(lightTheme);
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    setTheme(isDark ? lightTheme : darkTheme);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);
    setTheme(mediaQuery.matches ? darkTheme : lightTheme);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
      setTheme(e.matches ? darkTheme : lightTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return {
    theme,
    isDark,
    toggleTheme,
  };
};
```

#### 4. Common Migration Issues and Solutions

**Tailwind v4 Breaking Changes:**
1. **Opacity syntax change**: `bg-opacity-30` → `bg-black/30`
2. **Import syntax**: `@tailwind base;` → `@import "tailwindcss";`
3. **Plugin configuration**: Some plugins need updates for v4 compatibility

**Package.json Requirements:**
```json
{
  "type": "module",  // Required for Tailwind v4
  "dependencies": {
    "tailwindcss": "^4.1.10",
    "@tailwindcss/vite": "^4.1.10"
  }
}
```

**Common Build Errors and Fixes:**
- **ESM Module Error**: Add `"type": "module"` to package.json
- **CSS Import Error**: Use `@import "tailwindcss"` instead of `@tailwind` directives
- **Vite Plugin Error**: Ensure you're importing the correct Tailwind Vite plugin for v4

## Migration Steps

### Phase 1: Setup and Core Components
1. Initialize React TypeScript project
2. Set up project structure and dependencies
3. Create type definitions for all game entities
4. Implement basic game store with Zustand
5. Create core UI components (Button, Modal, etc.)

### Phase 2: Game Logic Migration
1. Port game calculation functions to utility modules
2. Implement game state management in Zustand store
3. Create game loop and save system hooks
4. Port treasure and upgrade data to TypeScript modules

### Phase 3: Component Development
1. Build resource counter and action button components
2. Create upgrade shop and treasure collection components
3. Implement treasure modal and floating number animations
4. Add game events and achievement displays

### Phase 4: Advanced Features
1. Implement prestige system component
2. Add achievement tracking and displays
3. Create advanced animations with react-spring
4. Add responsive design and mobile support

### Phase 5: Testing and Optimization
1. Add unit tests for game logic utilities
2. Implement integration tests for components
3. Performance optimization and code splitting
4. Cross-browser testing and accessibility improvements

## Key Benefits of React TypeScript Migration

### Type Safety
- Compile-time error checking for game state and calculations
- Better IDE support with autocomplete and refactoring
- Reduced runtime errors from type mismatches

### Component Reusability
- Modular component architecture for easy maintenance
- Reusable UI components across different game sections
- Easy to add new features without breaking existing code

### State Management
- Centralized game state with Zustand
- Predictable state updates and debugging
- Automatic persistence with middleware

### Performance
- React's virtual DOM for efficient updates
- Code splitting for faster initial load
- Optimized re-renders with proper component structure

### Developer Experience
- Hot reloading for faster development
- Component-based development with clear separation of concerns
- Easy testing with React Testing Library

## Deployment Integration

The migrated React application can be integrated into the existing WebHatchery build system:

1. **Build Configuration**: Add React build configuration to `build-config.json`
2. **Deployment Script**: Update `build-deploy.ps1` to handle React build process
3. **Apache Integration**: Configure Apache to serve the React SPA correctly

## Enhanced Game Features

The React TypeScript migration provides an excellent opportunity to implement significant gameplay improvements that would be difficult to manage in vanilla JavaScript. These enhancements leverage TypeScript's type safety and React's component architecture to create a more engaging and complex game experience.

### 1. Multi-Layer Progression System

#### Overview
Transform the simple upgrade system into a comprehensive progression framework with skill trees, territory expansion, and dragon evolution paths.

#### TypeScript Interfaces

```typescript
// Skill Tree System
export interface SkillNode {
  id: string;
  name: string;
  description: string;
  icon: string;
  maxLevel: number;
  cost: SkillCost;
  prerequisites: string[];
  effects: SkillEffect[];
  position: { x: number; y: number };
}

export interface SkillCost {
  gold?: number;
  treasures?: number;
  dragonEssence?: number;
}

export interface SkillEffect {
  type: 'multiplier' | 'additive' | 'unlock' | 'passive';
  target: string;
  value: number;
  description: string;
}

export interface SkillTree {
  id: string;
  name: string;
  category: 'combat' | 'economic' | 'exploration' | 'mystical';
  nodes: SkillNode[];
  unlockRequirement: string;
}

// Territory System
export interface Territory {
  id: string;
  name: string;
  description: string;
  type: 'lair' | 'hunting_ground' | 'treasure_vault' | 'minion_quarters';
  level: number;
  maxLevel: number;
  effects: TerritoryEffect[];
  upgradeCost: ResourceCost;
  unlockRequirement: string;
}

export interface TerritoryEffect {
  type: 'resource_generation' | 'capacity_increase' | 'efficiency_boost';
  value: number;
  description: string;
}

// Dragon Evolution
export interface DragonForm {
  id: string;
  name: string;
  description: string;
  stage: 'hatchling' | 'juvenile' | 'adult' | 'ancient' | 'legendary';
  requirements: EvolutionRequirement[];
  bonuses: DragonBonus[];
  appearance: {
    color: string;
    size: number;
    effects: string[];
  };
}

export interface EvolutionRequirement {
  type: 'level' | 'treasures' | 'achievements' | 'time';
  value: number;
  description: string;
}

export interface DragonBonus {
  type: 'global_multiplier' | 'special_ability' | 'passive_income';
  value: number;
  description: string;
}
```

#### React Components

```typescript
// Skill Tree Component
export const SkillTreeView: React.FC<{ treeId: string }> = ({ treeId }) => {
  const { skillTrees, learnedSkills, spendSkillPoint } = useGameStore();
  const tree = skillTrees[treeId];

  return (
    <SkillTreeContainer>
      <TreeHeader>
        <TreeIcon>{tree.icon}</TreeIcon>
        <TreeTitle>{tree.name}</TreeTitle>
      </TreeHeader>
      <NodeGrid>
        {tree.nodes.map(node => (
          <SkillNodeComponent
            key={node.id}
            node={node}
            isLearned={learnedSkills.has(node.id)}
            canLearn={canLearnSkill(node)}
            onLearn={() => spendSkillPoint(node.id)}
          />
        ))}
      </NodeGrid>
    </SkillTreeContainer>
  );
};

// Territory Management Component
export const TerritoryManager: React.FC = () => {
  const { territories, upgradTerritory } = useGameStore();

  return (
    <TerritoryGrid>
      {Object.values(territories).map(territory => (
        <TerritoryCard key={territory.id}>
          <TerritoryInfo>
            <h3>{territory.name}</h3>
            <p>Level {territory.level}/{territory.maxLevel}</p>
            <EffectsList>
              {territory.effects.map(effect => (
                <EffectItem key={effect.type}>
                  {effect.description}: +{effect.value}
                </EffectItem>
              ))}
            </EffectsList>
          </TerritoryInfo>
          <UpgradeButton
            onClick={() => upgradTerritory(territory.id)}
            disabled={territory.level >= territory.maxLevel}
          >
            Upgrade ({formatCost(territory.upgradeCost)})
          </UpgradeButton>
        </TerritoryCard>
      ))}
    </TerritoryGrid>
  );
};
```

### 2. Interactive Treasure Synergy System

#### Overview
Replace static treasure bonuses with dynamic set bonuses, crafting mechanics, and active treasure abilities that create strategic depth.

#### TypeScript Interfaces

```typescript
// Enhanced Treasure System
export interface EnhancedTreasure extends Treasure {
  id: string;
  setId?: string;
  craftingMaterials?: CraftingMaterial[];
  activeAbility?: ActiveAbility;
  synergies: TreasureSynergy[];
  enchantmentLevel: number;
  maxEnchantmentLevel: number;
}

export interface TreasureSet {
  id: string;
  name: string;
  description: string;
  treasures: string[];
  bonuses: SetBonus[];
  loreText: string;
}

export interface SetBonus {
  requiredPieces: number;
  effects: TreasureEffect[];
  description: string;
}

export interface TreasureEffect {
  type: 'stat_boost' | 'special_ability' | 'passive_income' | 'unlock';
  target: string;
  value: number;
  duration?: number;
  description: string;
}

export interface ActiveAbility {
  id: string;
  name: string;
  description: string;
  cooldown: number;
  cost?: ResourceCost;
  effects: AbilityEffect[];
}

export interface AbilityEffect {
  type: 'instant_gold' | 'temporary_boost' | 'spawn_event' | 'auto_collect';
  value: number;
  duration?: number;
  description: string;
}

// Crafting System
export interface CraftingRecipe {
  id: string;
  name: string;
  description: string;
  materials: CraftingMaterial[];
  result: CraftingResult;
  unlockRequirement: string;
  craftingTime: number;
}

export interface CraftingMaterial {
  type: 'treasure' | 'essence' | 'gold' | 'special';
  id: string;
  quantity: number;
  consumed: boolean;
}

export interface CraftingResult {
  type: 'treasure' | 'enhancement' | 'ability';
  id: string;
  quantity: number;
  bonusChance?: number;
}

// Synergy System
export interface TreasureSynergy {
  triggerTreasures: string[];
  effects: SynergyEffect[];
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface SynergyEffect {
  type: 'multiplier' | 'unlock' | 'transformation' | 'special';
  value: number;
  description: string;
}
```

#### React Components

```typescript
// Treasure Collection with Synergies
export const EnhancedTreasureCollection: React.FC = () => {
  const { 
    discoveredTreasures, 
    activeSets, 
    availableSynergies,
    useActiveAbility 
  } = useGameStore();

  return (
    <TreasureCollectionContainer>
      <ActiveSetsPanel>
        <h3>Active Sets</h3>
        {activeSets.map(set => (
          <SetBonusCard key={set.id}>
            <SetName>{set.name}</SetName>
            <SetProgress>
              {set.ownedPieces}/{set.totalPieces} pieces
            </SetProgress>
            <BonusList>
              {set.activeBonuses.map(bonus => (
                <BonusItem key={bonus.requiredPieces}>
                  ✓ {bonus.description}
                </BonusItem>
              ))}
            </BonusList>
          </SetBonusCard>
        ))}
      </ActiveSetsPanel>

      <TreasureGrid>
        {discoveredTreasures.map(treasure => (
          <EnhancedTreasureCard
            key={treasure.id}
            treasure={treasure}
            onUseAbility={() => useActiveAbility(treasure.activeAbility?.id)}
          />
        ))}
      </TreasureGrid>

      <SynergyPanel>
        <h3>Active Synergies</h3>
        {availableSynergies.map(synergy => (
          <SynergyDisplay key={synergy.id} synergy={synergy} />
        ))}
      </SynergyPanel>
    </TreasureCollectionContainer>
  );
};

// Crafting Workshop Component
export const CraftingWorkshop: React.FC = () => {
  const { 
    craftingRecipes, 
    materials, 
    craftItem, 
    craftingQueue 
  } = useGameStore();

  return (
    <CraftingContainer>
      <CraftingQueue>
        <h3>Crafting Queue</h3>
        {craftingQueue.map(item => (
          <QueueItem key={item.id}>
            <ItemName>{item.name}</ItemName>
            <ProgressBar progress={item.progress} />
            <TimeRemaining>{formatTime(item.timeRemaining)}</TimeRemaining>
          </QueueItem>
        ))}
      </CraftingQueue>

      <RecipeList>
        {craftingRecipes.map(recipe => (
          <RecipeCard key={recipe.id}>
            <RecipeHeader>
              <RecipeName>{recipe.name}</RecipeName>
              <CraftButton
                onClick={() => craftItem(recipe.id)}
                disabled={!canCraftRecipe(recipe)}
              >
                Craft
              </CraftButton>
            </RecipeHeader>
            <MaterialsList>
              {recipe.materials.map(material => (
                <MaterialItem
                  key={material.id}
                  available={materials[material.id] >= material.quantity}
                >
                  {material.quantity}x {material.name}
                </MaterialItem>
              ))}
            </MaterialsList>
          </RecipeCard>
        ))}
      </RecipeList>
    </CraftingContainer>
  );
};
```

### 3. Dynamic Economy & Market System

#### Overview
Introduce multiple currencies, fluctuating markets, trading mechanics, and economic events that create a living, breathing game economy.

#### TypeScript Interfaces

```typescript
// Multi-Currency System
export interface Currency {
  id: string;
  name: string;
  symbol: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  sources: CurrencySource[];
}

export interface CurrencySource {
  type: 'action' | 'passive' | 'trade' | 'event';
  rate: number;
  condition?: string;
  description: string;
}

export interface CurrencyBalance {
  [currencyId: string]: number;
}

// Market System
export interface MarketData {
  currencies: MarketCurrency[];
  commodities: MarketCommodity[];
  lastUpdate: number;
  trends: MarketTrend[];
}

export interface MarketCurrency {
  id: string;
  currentRate: number;
  baseRate: number;
  volatility: number;
  trend: 'rising' | 'falling' | 'stable';
  volume: number;
}

export interface MarketCommodity {
  id: string;
  name: string;
  category: 'materials' | 'treasures' | 'services';
  price: CurrencyAmount[];
  supply: number;
  demand: number;
  quality: number;
}

export interface CurrencyAmount {
  currencyId: string;
  amount: number;
}

export interface MarketTrend {
  type: 'currency' | 'commodity';
  targetId: string;
  direction: 'up' | 'down';
  strength: number;
  duration: number;
  cause: string;
}

// Trading System
export interface TradeOffer {
  id: string;
  type: 'buy' | 'sell';
  commodity: string;
  quantity: number;
  pricePerUnit: CurrencyAmount;
  totalPrice: CurrencyAmount;
  expires: number;
  reputation: number;
}

export interface TradeHistory {
  timestamp: number;
  type: 'buy' | 'sell';
  commodity: string;
  quantity: number;
  price: CurrencyAmount;
  profit?: number;
}

// Economic Events
export interface EconomicEvent {
  id: string;
  name: string;
  description: string;
  type: 'market_crash' | 'treasure_boom' | 'currency_discovery' | 'trade_war';
  effects: EconomicEffect[];
  duration: number;
  probability: number;
  triggers: EventTrigger[];
}

export interface EconomicEffect {
  target: 'currency' | 'commodity' | 'global';
  targetId?: string;
  effectType: 'price_change' | 'availability' | 'new_opportunity';
  magnitude: number;
  description: string;
}

export interface EventTrigger {
  type: 'time' | 'player_action' | 'market_condition';
  condition: string;
  value: number;
}
```

#### React Components

```typescript
// Market Dashboard Component
export const MarketDashboard: React.FC = () => {
  const { 
    marketData, 
    playerCurrencies, 
    activeTrades,
    createTradeOffer 
  } = useGameStore();

  return (
    <MarketContainer>
      <CurrencyPanel>
        <h3>Currency Exchange</h3>
        <CurrencyGrid>
          {marketData.currencies.map(currency => (
            <CurrencyCard key={currency.id}>
              <CurrencyHeader>
                <CurrencyIcon>{currency.icon}</CurrencyIcon>
                <CurrencyName>{currency.name}</CurrencyName>
                <TrendIndicator trend={currency.trend} />
              </CurrencyHeader>
              <ExchangeRate>
                1 Gold = {currency.currentRate.toFixed(4)} {currency.symbol}
              </ExchangeRate>
              <VolumeInfo>
                24h Volume: {formatNumber(currency.volume)}
              </VolumeInfo>
            </CurrencyCard>
          ))}
        </CurrencyGrid>
      </CurrencyPanel>

      <TradingPanel>
        <h3>Commodity Trading</h3>
        <CommodityList>
          {marketData.commodities.map(commodity => (
            <CommodityRow key={commodity.id}>
              <CommodityInfo>
                <span>{commodity.name}</span>
                <QualityStars quality={commodity.quality} />
              </CommodityInfo>
              <PriceInfo>
                {commodity.price.map(price => (
                  <PriceDisplay key={price.currencyId}>
                    {price.amount} {getCurrencySymbol(price.currencyId)}
                  </PriceDisplay>
                ))}
              </PriceInfo>
              <TradeActions>
                <TradeButton 
                  variant="buy"
                  onClick={() => createTradeOffer('buy', commodity.id)}
                >
                  Buy
                </TradeButton>
                <TradeButton 
                  variant="sell"
                  onClick={() => createTradeOffer('sell', commodity.id)}
                >
                  Sell
                </TradeButton>
              </TradeActions>
            </CommodityRow>
          ))}
        </CommodityList>
      </TradingPanel>

      <ActiveTradesPanel>
        <h3>Active Trades</h3>
        {activeTrades.map(trade => (
          <TradeCard key={trade.id}>
            <TradeType type={trade.type}>{trade.type.toUpperCase()}</TradeType>
            <TradeDetails>
              {trade.quantity}x {trade.commodity}
            </TradeDetails>
            <TradePrice>
              {formatCurrency(trade.totalPrice)}
            </TradePrice>
            <TradeExpiry>
              Expires: {formatTime(trade.expires - Date.now())}
            </TradeExpiry>
          </TradeCard>
        ))}
      </ActiveTradesPanel>
    </MarketContainer>
  );
};

// Economic Events Component
export const EconomicEventsPanel: React.FC = () => {
  const { activeEvents, eventHistory } = useGameStore();

  return (
    <EventsContainer>
      <ActiveEventsSection>
        <h3>Current Economic Events</h3>
        {activeEvents.map(event => (
          <EventCard key={event.id} type={event.type}>
            <EventHeader>
              <EventIcon>{getEventIcon(event.type)}</EventIcon>
              <EventTitle>{event.name}</EventTitle>
              <EventDuration>
                {formatTime(event.duration)}
              </EventDuration>
            </EventHeader>
            <EventDescription>{event.description}</EventDescription>
            <EventEffects>
              {event.effects.map(effect => (
                <EffectItem key={effect.target}>
                  {effect.description}
                </EffectItem>
              ))}
            </EventEffects>
          </EventCard>
        ))}
      </ActiveEventsSection>

      <EventHistorySection>
        <h3>Recent Events</h3>
        {eventHistory.slice(0, 5).map(event => (
          <HistoryItem key={event.timestamp}>
            <EventTime>
              {formatDate(event.timestamp)}
            </EventTime>
            <EventSummary>{event.summary}</EventSummary>
          </HistoryItem>
        ))}
      </EventHistorySection>
    </EventsContainer>
  );
};
```

### Implementation Strategy for Enhanced Features

#### Phase 1: Core Systems (Weeks 1-2)
1. **Multi-Currency Foundation**
   - Implement currency interfaces and basic exchange system
   - Create currency display components
   - Add multiple currency earning sources

2. **Skill Tree Infrastructure**
   - Design skill tree data structures
   - Create basic skill node components
   - Implement prerequisite checking system

#### Phase 2: Market Mechanics (Weeks 3-4)
1. **Dynamic Market System**
   - Implement price fluctuation algorithms
   - Create market simulation engine
   - Build trading interface components

2. **Territory System**
   - Design territory management interface
   - Implement territory upgrade mechanics
   - Add visual territory representations

#### Phase 3: Advanced Features (Weeks 5-6)
1. **Treasure Synergies**
   - Implement set bonus calculations
   - Create synergy detection system
   - Build enhanced treasure display

2. **Crafting System**
   - Design crafting queue management
   - Implement recipe discovery mechanics
   - Create crafting workshop interface

#### Phase 4: Integration & Polish (Weeks 7-8)
1. **Economic Events**
   - Implement event trigger system
   - Create event notification system
   - Add event history tracking

2. **Dragon Evolution**
   - Design evolution requirements system
   - Create evolution ceremony interface
   - Implement form-specific bonuses

### Enhanced Store Management

```typescript
// Extended Game Store for Enhanced Features
interface EnhancedGameStore extends GameStore {
  // Multi-Currency
  currencies: CurrencyBalance;
  earnCurrency: (currencyId: string, amount: number) => void;
  exchangeCurrency: (fromId: string, toId: string, amount: number) => void;
  
  // Skill Trees
  skillTrees: Record<string, SkillTree>;
  learnedSkills: Set<string>;
  skillPoints: number;
  learnSkill: (skillId: string) => void;
  
  // Market System
  marketData: MarketData;
  updateMarketPrices: () => void;
  createTradeOffer: (type: 'buy' | 'sell', commodityId: string) => void;
  
  // Territory Management
  territories: Record<string, Territory>;
  upgradeTerritory: (territoryId: string) => void;
  
  // Enhanced Treasures
  treasureSets: Record<string, TreasureSet>;
  craftingRecipes: CraftingRecipe[];
  craftItem: (recipeId: string) => void;
  
  // Economic Events
  activeEvents: EconomicEvent[];
  eventHistory: EconomicEvent[];
  triggerEvent: (eventId: string) => void;
}
```

These enhanced features transform Dragon's Den from a simple idle clicker into a complex economic simulation with deep strategic gameplay. The React TypeScript architecture makes these advanced features maintainable and extensible, providing a solid foundation for future game development.

## Common Issues and Troubleshooting

### Build and Configuration Issues

#### 1. Tailwind CSS v4 Issues
**Problem**: CSS not loading or Tailwind classes not working
```bash
# Solution: Check these common issues
# 1. Ensure correct import syntax in CSS
@import "tailwindcss"; // Correct for v4
// NOT: @tailwind base; @tailwind components; @tailwind utilities;

# 2. Check package.json has type: module
{
  "type": "module"
}

# 3. Verify Vite plugin configuration
import tailwindcss from '@tailwindcss/vite' // Correct for v4
```

**Problem**: Opacity classes not working
```tsx
// OLD (Tailwind v3):
<div className="bg-black bg-opacity-30">

// NEW (Tailwind v4):
<div className="bg-black/30">
```

#### 2. TypeScript Errors
**Problem**: Set serialization errors with Zustand persist
```typescript
// Solution: Handle Set types in persist configuration
persist(
  (set, get) => ({ /* store */ }),
  {
    name: 'storage',
    partialize: (state) => ({
      ...state,
      uniqueItems: Array.from(state.uniqueItems), // Convert Set to Array
    }),
  }
)
```

**Problem**: Import path resolution errors
```typescript
// Solution: Configure path mapping in tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

#### 3. Vite Configuration Issues
**Problem**: Module resolution errors
```typescript
// Solution: Proper Vite config for React + TypeScript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
```

### Runtime Issues

#### 1. State Management Problems
**Problem**: State not persisting correctly
```typescript
// Check localStorage compatibility
// Ensure JSON serialization works for your data types
const testSerialization = (data: any) => {
  try {
    const serialized = JSON.stringify(data);
    const parsed = JSON.parse(serialized);
    return parsed;
  } catch (error) {
    console.error('Serialization failed:', error);
    return null;
  }
};
```

#### 2. Performance Issues
**Problem**: Too many re-renders
```typescript
// Solution: Use React DevTools Profiler and optimize with memo/useMemo
import { memo, useMemo } from 'react';

const OptimizedComponent = memo(({ data }) => {
  const processedData = useMemo(() => {
    return expensiveOperation(data);
  }, [data]);
  
  return <div>{processedData}</div>;
});
```

### Migration-Specific Issues

#### 1. Data Format Compatibility
```typescript
// Handle legacy data formats gracefully
const migrateOldData = (oldData: any) => {
  return {
    ...oldData,
    // Transform old format to new format
    newField: oldData.oldField || defaultValue,
    // Handle array/Set conversions
    items: Array.isArray(oldData.items) 
      ? oldData.items 
      : Array.from(oldData.items || [])
  };
};
```

#### 2. Event Handler Migration
```typescript
// OLD: Direct DOM manipulation
document.getElementById('button').addEventListener('click', handler);

// NEW: React event handling
const [count, setCount] = useState(0);
const handleClick = useCallback(() => {
  setCount(prev => prev + 1);
}, []);

return <button onClick={handleClick}>Count: {count}</button>;
```

## Best Practices Summary

### 1. Code Organization
- Keep components small and focused (Single Responsibility)
- Use custom hooks for reusable logic
- Separate business logic from UI components
- Create clear folder structure with features/domains

### 2. Type Safety
- Define comprehensive TypeScript interfaces
- Use strict TypeScript configuration
- Type all props, state, and API responses
- Leverage union types for state management

### 3. Performance
- Use React.memo for expensive components
- Implement proper dependency arrays in useEffect/useMemo
- Lazy load heavy components and routes
- Optimize bundle size with code splitting

### 4. State Management
- Choose appropriate state solution (Zustand for simplicity, Redux for complex apps)
- Implement proper error handling and loading states
- Use persistence middleware for user data
- Handle state serialization correctly

### 5. Styling
- Choose one styling approach and stick to it
- Use CSS custom properties for theming
- Implement responsive design from the start
- Consider dark mode early in development

### 6. Testing
- Write tests for critical business logic
- Test user interactions, not implementation details
- Use React Testing Library best practices
- Implement error boundaries for production

## Conclusion

This migration guide provides a comprehensive framework for transforming JavaScript applications into modern React TypeScript frontends. The key to successful migration is:

1. **Thorough Planning**: Understand your existing application architecture
2. **Incremental Migration**: Move features one at a time to minimize risk
3. **Modern Tooling**: Leverage Vite, Tailwind v4, and TypeScript for developer experience
4. **Clean Architecture**: Follow React best practices and clean code principles
5. **Comprehensive Testing**: Ensure feature parity and reliability

Whether you're migrating a game, e-commerce platform, productivity app, or dashboard, these patterns and practices will help you create a maintainable, scalable, and modern React application.

### Recommended Next Steps

1. Set up your development environment with the tools outlined in this guide
2. Create a basic project structure following the patterns shown
3. Start with the simplest features and gradually add complexity
4. Implement comprehensive testing as you build
5. Consider adding advanced features like PWA support, analytics, or real-time updates

This foundation will serve you well for any React TypeScript project, providing a robust architecture that can grow with your application's needs.

---

*This guide is living document. Update it as you discover new patterns, encounter issues, or as the React ecosystem evolves.*
