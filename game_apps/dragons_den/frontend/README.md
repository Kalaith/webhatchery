# Dragon's Den React TypeScript

A modern React TypeScript implementation of the Dragon's Den idle game with treasure collection, upgrades, minions, and prestige mechanics.

## Tech Stack

### Core Framework
- **React 19.1.0** - Latest React with modern features
- **React DOM 19.1.0** - DOM-specific methods for React
- **TypeScript 5.8.3** - Type safety and developer experience
- **Vite 6.3.5** - Fast build tool and dev server

### State Management & Utilities
- **Zustand 5.0.5** - Lightweight state management with persistence
- **React Use 17.6.0** - Collection of essential React hooks
- **React Router DOM 7.6.2** - Client-side routing

### Styling & Animations
- **Tailwind CSS 4.1.10** - Utility-first CSS framework
- **@tailwindcss/vite 4.1.10** - Tailwind CSS integration for Vite
- **Framer Motion 12.18.1** - Production-ready motion library for React
- **Autoprefixer 10.4.21** - CSS vendor prefix automation

### Data Visualization
- **Chart.js 4.4.9** - Charts for game statistics and progress tracking

### Development Tools
- **ESLint 9.25.0** - Code linting and quality
- **TypeScript ESLint 8.30.1** - TypeScript-specific linting rules
- **@vitejs/plugin-react 4.4.1** - React support for Vite
- **@types/react 19.1.2** - TypeScript definitions for React
- **@types/react-dom 19.1.2** - TypeScript definitions for React DOM

## Dragon's Den Frontend

### Overview
The frontend for Dragon's Den is built using modern React and TypeScript principles, ensuring maintainability, scalability, and performance. It implements idle game mechanics with treasure collection, upgrades, minions, and prestige systems.

### Features
- **Idle Game Mechanics**: Click-based and passive income systems.
- **Treasure Discovery**: Randomized treasure finding with rarity tiers.
- **Upgrade System**: Multiple upgrade paths affecting game mechanics.
- **Minion System**: Automated gold collection with cooldowns.
- **Prestige Mechanic**: Reset progress for permanent bonuses.
- **Achievement System**: Unlockable achievements for various milestones.
- **Save/Load System**: Local storage persistence with offline earnings.
- **Game Statistics**: Visual charts and progress tracking.
- **Modern UI**: Beautiful animations with Framer Motion and Tailwind CSS.

### Architecture Highlights

#### State Management
- **Zustand**: Lightweight, persistent state management with automatic local storage synchronization.
- **React Query**: Efficient server state management.

#### Animations
- **Framer Motion**: Smooth, performant animations for:
  - Floating numbers on gold collection.
  - Treasure discovery effects.
  - UI transitions and micro-interactions.
  - Cooldown progress indicators.

#### Styling
- **Tailwind CSS**: Utility-first approach for:
  - Responsive design.
  - Consistent spacing and colors.
  - Fast development workflow.
  - Easy customization and theming.

#### Type Safety
- Comprehensive TypeScript definitions for:
  - Game state and mechanics.
  - Treasure and upgrade systems.
  - Component props and interfaces.
  - API contracts and data structures.

### Project Structure
```
src/
├── components/          # Reusable React components
│   ├── ui/             # Basic UI components (Button, Modal, etc.)
│   ├── game/           # Game-specific components
│   └── layout/         # Layout components (Header, Sidebar, etc.)
├── hooks/              # Custom React hooks
├── stores/             # Zustand state management
├── types/              # TypeScript type definitions
├── data/               # Game data (treasures, upgrades, achievements)
├── utils/              # Utility functions and game logic
└── styles/             # CSS and styling files
```

### Development
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Open [http://localhost:5173](http://localhost:5173) in your browser

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

### License
This project is licensed under the MIT License. See the LICENSE file for details.