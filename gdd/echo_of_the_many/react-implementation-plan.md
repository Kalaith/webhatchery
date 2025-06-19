# Echo of the Many - React Implementation Plan

## Project Structure

```
echo-of-the-many/
├── public/
│   ├── manifest.json           # PWA manifest
│   ├── sw.js                  # Service worker
│   ├── icons/                 # App icons
│   └── assets/                # Static assets
├── src/
│   ├── components/
│   │   ├── game/
│   │   │   ├── GameMap/
│   │   │   │   ├── GameMap.tsx
│   │   │   │   ├── District.tsx
│   │   │   │   └── MapControls.tsx
│   │   │   ├── CloneManager/
│   │   │   │   ├── CloneManager.tsx
│   │   │   │   ├── CloneCard.tsx
│   │   │   │   ├── CloneCreator.tsx
│   │   │   │   └── MissionAssigner.tsx
│   │   │   ├── FactionPanel/
│   │   │   │   ├── FactionPanel.tsx
│   │   │   │   ├── FactionMeter.tsx
│   │   │   │   └── RelationshipGraph.tsx
│   │   │   ├── SpellBook/
│   │   │   │   ├── SpellBook.tsx
│   │   │   │   ├── SpellCard.tsx
│   │   │   │   └── CastingInterface.tsx
│   │   │   └── GameHUD/
│   │   │       ├── GameHUD.tsx
│   │   │       ├── ResourceBar.tsx
│   │   │       └── NotificationPanel.tsx
│   │   ├── ui/
│   │   │   ├── TouchButton.tsx
│   │   │   ├── SwipePanel.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Tooltip.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── layout/
│   │   │   ├── GameLayout.tsx
│   │   │   ├── MobileLayout.tsx
│   │   │   └── DesktopLayout.tsx
│   │   └── tutorial/
│   │       ├── TutorialOverlay.tsx
│   │       ├── StepIndicator.tsx
│   │       └── InteractiveTip.tsx
│   ├── hooks/
│   │   ├── useGameState.ts
│   │   ├── useClones.ts
│   │   ├── useFactions.ts
│   │   ├── useSpells.ts
│   │   ├── useMissions.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useGestures.ts
│   │   └── useNotifications.ts
│   ├── store/
│   │   ├── index.ts             # Main store configuration
│   │   ├── gameSlice.ts         # General game state
│   │   ├── cloneSlice.ts        # Clone management
│   │   ├── factionSlice.ts      # Faction system
│   │   ├── spellSlice.ts        # Magic system
│   │   ├── missionSlice.ts      # Mission system
│   │   └── settingsSlice.ts     # User preferences
│   ├── utils/
│   │   ├── gameLogic.ts         # Core game mechanics
│   │   ├── calculations.ts      # Mathematical functions
│   │   ├── persistence.ts       # Save/load system
│   │   ├── notifications.ts     # Notification system
│   │   ├── analytics.ts         # Analytics tracking
│   │   └── constants.ts         # Game constants
│   ├── types/
│   │   ├── game.ts              # Game-related types
│   │   ├── clone.ts             # Clone types
│   │   ├── faction.ts           # Faction types
│   │   ├── spell.ts             # Magic system types
│   │   └── mission.ts           # Mission types
│   ├── styles/
│   │   ├── globals.css          # Global styles
│   │   ├── variables.css        # CSS variables
│   │   ├── animations.css       # Animation definitions
│   │   └── mobile.css           # Mobile-specific styles
│   ├── assets/
│   │   ├── images/
│   │   ├── sounds/
│   │   └── fonts/
│   ├── data/
│   │   ├── districts.json       # District definitions
│   │   ├── factions.json        # Faction data
│   │   ├── spells.json          # Spell definitions
│   │   └── missions.json        # Mission templates
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Development Setup

### 1. Initial Project Creation

```bash
# Create new Vite React TypeScript project
npm create vite@latest echo-of-the-many -- --template react-ts
cd echo-of-the-many

# Install core dependencies
npm install

# Install state management
npm install zustand immer

# Install animation libraries
npm install react-spring @use-gesture/react framer-motion

# Install utility libraries
npm install clsx classnames date-fns uuid
npm install @types/uuid

# Install PWA support
npm install @vitejs/plugin-pwa workbox-window

# Install development dependencies
npm install -D @types/node
npm install -D tailwindcss autoprefixer postcss
npm install -D eslint @typescript-eslint/eslint-plugin
npm install -D prettier eslint-config-prettier
npm install -D @testing-library/react @testing-library/jest-dom
npm install -D vitest jsdom
```

### 2. Configuration Files

#### vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Echo of the Many',
        short_name: 'EchoMany',
        description: 'Fantasy strategy game with magical clones',
        theme_color: '#daa520',
        background_color: '#1a1a1a',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@store': path.resolve(__dirname, './src/store'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
      '@assets': path.resolve(__dirname, './src/assets')
    }
  },
  build: {
    target: 'es2015',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          animations: ['react-spring', '@use-gesture/react', 'framer-motion'],
          state: ['zustand', 'immer'],
          utils: ['clsx', 'date-fns', 'uuid']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
```

#### tailwind.config.js
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
        primary: {
          50: '#faf7f0',
          100: '#f4ede0',
          500: '#daa520',
          600: '#b8941c',
          700: '#8b7114',
          800: '#6b5710',
          900: '#2c1810'
        },
        secondary: {
          500: '#8b4513',
          600: '#7a3e11',
          700: '#68350f'
        },
        dark: {
          100: '#2a2a2a',
          200: '#1a1a1a',
          300: '#0f0f0f'
        }
      },
      fontFamily: {
        'game': ['Cinzel', 'serif'],
        'ui': ['Inter', 'sans-serif']
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounce 2s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate'
      },
      keyframes: {
        glow: {
          'from': { boxShadow: '0 0 5px #daa520' },
          'to': { boxShadow: '0 0 20px #daa520' }
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem'
      },
      aspectRatio: {
        '4/3': '4 / 3',
        '3/2': '3 / 2'
      }
    },
  },
  plugins: [],
}
```

## Core Components Implementation

### 1. Game Store (Zustand)

```typescript
// src/store/index.ts
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist, createJSONStorage } from 'zustand/middleware'
import { gameSlice } from './gameSlice'
import { cloneSlice } from './cloneSlice'
import { factionSlice } from './factionSlice'
import { spellSlice } from './spellSlice'

export interface GameStore {
  // Game state
  game: GameState
  clones: CloneState
  factions: FactionState
  spells: SpellState
  
  // Actions
  initializeGame: () => void
  saveGame: () => void
  loadGame: () => void
  resetGame: () => void
}

export const useGameStore = create<GameStore>()(
  persist(
    immer((set, get, api) => ({
      ...gameSlice(set, get, api),
      ...cloneSlice(set, get, api),
      ...factionSlice(set, get, api),
      ...spellSlice(set, get, api),
    })),
    {
      name: 'echo-of-the-many-save',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        game: state.game,
        clones: state.clones,
        factions: state.factions,
        spells: state.spells
      })
    }
  )
)
```

### 2. Clone Management Component

```typescript
// src/components/game/CloneManager/CloneManager.tsx
import React, { useState } from 'react'
import { useSpring, animated, useTransition } from 'react-spring'
import { useDrag } from '@use-gesture/react'
import { useGameStore } from '@store'
import { CloneCard } from './CloneCard'
import { CloneCreator } from './CloneCreator'
import { MissionAssigner } from './MissionAssigner'

export const CloneManager: React.FC = () => {
  const { clones, createClone, assignMission } = useGameStore()
  const [showCreator, setShowCreator] = useState(false)
  const [selectedClone, setSelectedClone] = useState<string | null>(null)

  const containerSpring = useSpring({
    opacity: 1,
    transform: 'translateY(0px)',
    from: { opacity: 0, transform: 'translateY(20px)' }
  })

  const cloneTransitions = useTransition(clones.active, {
    from: { opacity: 0, scale: 0.8, rotateY: -90 },
    enter: { opacity: 1, scale: 1, rotateY: 0 },
    leave: { opacity: 0, scale: 0.8, rotateY: 90 },
    config: { tension: 300, friction: 25 }
  })

  const bind = useDrag(({ args: [cloneId], movement: [mx, my], down }) => {
    // Handle clone dragging for mission assignment
    if (down && Math.abs(mx) > 50) {
      // Show mission assignment interface
      setSelectedClone(cloneId)
    }
  })

  return (
    <animated.div style={containerSpring} className="clone-manager">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-game text-primary-500">Clone Management</h2>
        <button
          onClick={() => setShowCreator(true)}
          className="bg-primary-500 text-dark-200 px-4 py-2 rounded-lg
                     hover:bg-primary-600 transition-colors touch-target"
        >
          Create Clone
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cloneTransitions((style, clone) => (
          <animated.div
            style={style}
            {...bind(clone.id)}
            className="cursor-grab active:cursor-grabbing"
          >
            <CloneCard
              clone={clone}
              onSelect={() => setSelectedClone(clone.id)}
              onMissionComplete={(cloneId) => {
                // Handle mission completion
              }}
            />
          </animated.div>
        ))}
      </div>

      {showCreator && (
        <CloneCreator
          onClose={() => setShowCreator(false)}
          onCreate={(cloneData) => {
            createClone(cloneData)
            setShowCreator(false)
          }}
        />
      )}

      {selectedClone && (
        <MissionAssigner
          cloneId={selectedClone}
          onClose={() => setSelectedClone(null)}
          onAssign={(missionData) => {
            assignMission(selectedClone, missionData)
            setSelectedClone(null)
          }}
        />
      )}
    </animated.div>
  )
}
```

### 3. Touch-Optimized Button Component

```typescript
// src/components/ui/TouchButton.tsx
import React, { useState } from 'react'
import { useSpring, animated } from 'react-spring'
import { clsx } from 'clsx'

interface TouchButtonProps {
  children: React.ReactNode
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  haptic?: boolean
  className?: string
}

export const TouchButton: React.FC<TouchButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  haptic = true,
  className
}) => {
  const [pressed, setPressed] = useState(false)

  const springProps = useSpring({
    scale: pressed ? 0.95 : 1,
    config: { tension: 300, friction: 10 }
  })

  const handleTouchStart = () => {
    if (disabled) return
    setPressed(true)
    if (haptic && 'vibrate' in navigator) {
      navigator.vibrate(10) // Short haptic feedback
    }
  }

  const handleTouchEnd = () => {
    setPressed(false)
  }

  const handleClick = () => {
    if (disabled) return
    onClick()
  }

  const baseClasses = "touch-target relative overflow-hidden transition-colors duration-200"
  const variantClasses = {
    primary: "bg-primary-500 text-dark-200 hover:bg-primary-600 active:bg-primary-700",
    secondary: "bg-secondary-500 text-white hover:bg-secondary-600 active:bg-secondary-700",
    danger: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700"
  }
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm min-h-[36px]",
    md: "px-4 py-2 text-base min-h-[44px]",
    lg: "px-6 py-3 text-lg min-h-[52px]"
  }

  return (
    <animated.button
      style={springProps}
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
      onClick={handleClick}
      disabled={disabled}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity" />
    </animated.button>
  )
}
```

### 4. Game Map Component

```typescript
// src/components/game/GameMap/GameMap.tsx
import React, { useRef, useState } from 'react'
import { useSpring, animated } from 'react-spring'
import { usePinch, useWheel } from '@use-gesture/react'
import { useGameStore } from '@store'
import { District } from './District'
import { MapControls } from './MapControls'

export const GameMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null)
  const { districts, unlockedDistricts } = useGameStore()
  const [{ scale, x, y }, setTransform] = useSpring(() => ({
    scale: 1,
    x: 0,
    y: 0,
    config: { tension: 300, friction: 25 }
  }))

  const bind = usePinch(
    ({ offset: [d, a], memo }) => {
      const newScale = Math.max(0.5, Math.min(3, 1 + d / 200))
      setTransform({ scale: newScale })
      return memo
    },
    { from: [0, 0] }
  )

  const wheelBind = useWheel(
    ({ movement: [mx, my], ctrlKey }) => {
      if (ctrlKey) {
        // Zoom with Ctrl+Wheel
        const newScale = Math.max(0.5, Math.min(3, scale.get() + my / 1000))
        setTransform({ scale: newScale })
      } else {
        // Pan with wheel
        setTransform({
          x: x.get() + mx,
          y: y.get() + my
        })
      }
    }
  )

  return (
    <div className="game-map-container relative w-full h-full overflow-hidden">
      <MapControls
        onZoomIn={() => setTransform({ scale: Math.min(3, scale.get() * 1.2) })}
        onZoomOut={() => setTransform({ scale: Math.max(0.5, scale.get() / 1.2) })}
        onReset={() => setTransform({ scale: 1, x: 0, y: 0 })}
      />
      
      <animated.div
        ref={mapRef}
        {...bind()}
        {...wheelBind()}
        style={{
          transform: to([scale, x, y], (s, x, y) => `scale(${s}) translate(${x}px, ${y}px)`),
          touchAction: 'none'
        }}
        className="game-map w-full h-full relative"
      >
        <div className="map-grid grid grid-cols-3 gap-4 p-4">
          {districts.map((district) => (
            <District
              key={district.id}
              district={district}
              isUnlocked={unlockedDistricts.includes(district.id)}
              onClick={() => {
                // Handle district selection
              }}
            />
          ))}
        </div>
      </animated.div>
    </div>
  )
}
```

## Mobile-First Features

### 1. Touch Gesture Handling

```typescript
// src/hooks/useGestures.ts
import { useGesture } from '@use-gesture/react'
import { useSpring } from 'react-spring'

export interface GestureConfig {
  onTap?: (event: any) => void
  onLongPress?: (event: any) => void
  onSwipe?: (direction: 'left' | 'right' | 'up' | 'down', event: any) => void
  onPinch?: (scale: number, event: any) => void
}

export const useGestures = (config: GestureConfig) => {
  const [springs, api] = useSpring(() => ({
    scale: 1,
    x: 0,
    y: 0,
    config: { tension: 300, friction: 25 }
  }))

  const bind = useGesture({
    onClick: ({ event, ...state }) => {
      config.onTap?.(event)
    },
    onContextMenu: ({ event, ...state }) => {
      event.preventDefault()
      config.onLongPress?.(event)
    },
    onDrag: ({ movement: [mx, my], velocity: [vx, vy], direction: [dx, dy], distance, cancel }) => {
      // Detect swipe gestures
      if (distance > 50 && Math.abs(vx) > 0.5) {
        const direction = dx > 0 ? 'right' : 'left'
        config.onSwipe?.(direction, { mx, my, vx, vy })
        cancel()
      }
      if (distance > 50 && Math.abs(vy) > 0.5) {
        const direction = dy > 0 ? 'down' : 'up'
        config.onSwipe?.(direction, { mx, my, vx, vy })
        cancel()
      }
    },
    onPinch: ({ offset: [scale], ...state }) => {
      config.onPinch?.(scale, state)
      api.start({ scale: 1 + scale / 200 })
    }
  })

  return { bind, springs }
}
```

### 2. Responsive Layout Hook

```typescript
// src/hooks/useResponsive.ts
import { useState, useEffect } from 'react'

export interface BreakpointValues {
  xs: boolean
  sm: boolean
  md: boolean
  lg: boolean
  xl: boolean
}

export const useResponsive = () => {
  const [breakpoints, setBreakpoints] = useState<BreakpointValues>({
    xs: false,
    sm: false,
    md: false,
    lg: false,
    xl: false
  })

  useEffect(() => {
    const updateBreakpoints = () => {
      const width = window.innerWidth
      setBreakpoints({
        xs: width < 640,
        sm: width >= 640 && width < 768,
        md: width >= 768 && width < 1024,
        lg: width >= 1024 && width < 1280,
        xl: width >= 1280
      })
    }

    updateBreakpoints()
    window.addEventListener('resize', updateBreakpoints)
    return () => window.removeEventListener('resize', updateBreakpoints)
  }, [])

  return {
    ...breakpoints,
    isMobile: breakpoints.xs || breakpoints.sm,
    isTablet: breakpoints.md,
    isDesktop: breakpoints.lg || breakpoints.xl
  }
}
```

## Performance Optimization

### 1. Component Memoization

```typescript
// src/components/game/CloneCard.tsx
import React, { memo } from 'react'
import { Clone } from '@types/clone'

interface CloneCardProps {
  clone: Clone
  onSelect: () => void
  onMissionComplete: (cloneId: string) => void
}

export const CloneCard = memo<CloneCardProps>(({ clone, onSelect, onMissionComplete }) => {
  // Component implementation
}, (prevProps, nextProps) => {
  // Custom comparison function for optimization
  return (
    prevProps.clone.id === nextProps.clone.id &&
    prevProps.clone.status === nextProps.clone.status &&
    prevProps.clone.energy === nextProps.clone.energy
  )
})
```

### 2. Virtual List for Large Collections

```typescript
// src/components/ui/VirtualList.tsx
import React, { useMemo, useCallback } from 'react'
import { FixedSizeList as List } from 'react-window'
import { useResponsive } from '@hooks/useResponsive'

interface VirtualListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  itemHeight: number
  className?: string
}

export function VirtualList<T>({ items, renderItem, itemHeight, className }: VirtualListProps<T>) {
  const { isMobile } = useResponsive()
  const containerHeight = useMemo(() => isMobile ? 400 : 600, [isMobile])

  const Row = useCallback(({ index, style }: any) => (
    <div style={style}>
      {renderItem(items[index], index)}
    </div>
  ), [items, renderItem])

  return (
    <List
      className={className}
      height={containerHeight}
      itemCount={items.length}
      itemSize={itemHeight}
    >
      {Row}
    </List>
  )
}
```

## Testing Strategy

### 1. Component Testing

```typescript
// src/components/ui/__tests__/TouchButton.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { TouchButton } from '../TouchButton'

describe('TouchButton', () => {
  it('renders children correctly', () => {
    render(<TouchButton onClick={() => {}}>Test Button</TouchButton>)
    expect(screen.getByRole('button')).toHaveTextContent('Test Button')
  })

  it('calls onClick when pressed', () => {
    const mockClick = jest.fn()
    render(<TouchButton onClick={mockClick}>Test</TouchButton>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(mockClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    const mockClick = jest.fn()
    render(<TouchButton onClick={mockClick} disabled>Test</TouchButton>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    
    fireEvent.click(button)
    expect(mockClick).not.toHaveBeenCalled()
  })

  it('applies correct size classes', () => {
    const { rerender } = render(<TouchButton onClick={() => {}} size="lg">Test</TouchButton>)
    expect(screen.getByRole('button')).toHaveClass('min-h-[52px]')
    
    rerender(<TouchButton onClick={() => {}} size="sm">Test</TouchButton>)
    expect(screen.getByRole('button')).toHaveClass('min-h-[36px]')
  })
})
```

### 2. Game Logic Testing

```typescript
// src/utils/__tests__/gameLogic.test.ts
import { calculateFactionInfluence, validateCloneAction } from '../gameLogic'
import { mockGameState, mockClone } from '../../../__mocks__/gameData'

describe('Game Logic', () => {
  describe('calculateFactionInfluence', () => {
    it('calculates influence correctly', () => {
      const result = calculateFactionInfluence(mockGameState, 'nobles', 'positive')
      expect(result.nobles).toBeGreaterThan(mockGameState.factions.nobles.influence)
    })

    it('respects maximum influence limits', () => {
      const highInfluenceState = {
        ...mockGameState,
        factions: {
          ...mockGameState.factions,
          nobles: { ...mockGameState.factions.nobles, influence: 95 }
        }
      }
      
      const result = calculateFactionInfluence(highInfluenceState, 'nobles', 'positive')
      expect(result.nobles).toBeLessThanOrEqual(100)
    })
  })

  describe('validateCloneAction', () => {
    it('allows valid actions', () => {
      const result = validateCloneAction(mockClone, 'gather_intelligence', mockGameState)
      expect(result.valid).toBe(true)
    })

    it('prevents actions when energy is insufficient', () => {
      const lowEnergyClone = { ...mockClone, energy: 5 }
      const result = validateCloneAction(lowEnergyClone, 'influence_noble', mockGameState)
      expect(result.valid).toBe(false)
      expect(result.reason).toContain('energy')
    })
  })
})
```

## Deployment Configuration

### 1. GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm run test
      
    - name: Run linting
      run: npm run lint
      
    - name: Type check
      run: npm run type-check

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build project
      run: npm run build
      
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: dist
        path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - name: Download build artifacts
      uses: actions/download-artifact@v3
      with:
        name: dist
        path: dist/
        
    - name: Deploy to Vercel
      uses: vercel/action@v1
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### 2. Performance Budget Configuration

```json
// .lighthouserc.json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "url": ["http://localhost:3000"]
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:best-practices": ["error", {"minScore": 0.9}],
        "categories:seo": ["error", {"minScore": 0.9}],
        "categories:pwa": ["error", {"minScore": 0.9}]
      }
    },
    "upload": {
      "target": "filesystem",
      "outputDir": "./lighthouse-results"
    }
  }
}
```

This comprehensive implementation plan provides a solid foundation for building Echo of the Many as a React-based mobile game. The structure is scalable, performance-optimized, and follows modern React best practices while maintaining focus on mobile-first design and touch interactions.
