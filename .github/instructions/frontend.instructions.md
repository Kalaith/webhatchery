---
applyTo: '*.ts, *.tsx, *.js, *.jsx'
---
# Clean Code Principles - React + TypeScript
## Core Principles

- **Single Responsibility** - One purpose per component/function
- **Type Safety** - TypeScript prevents runtime errors
- **Composition** - Small, reusable components
- **No Prop Drilling** - Use custom hooks for clean data flow
- **Functional Components** - No class components
- **Modern React** - Hooks, suspense, concurrent features

## Architecture

### Folder Structure
```
📁 src/
├── components/
│   ├── ui/           # Pure UI (Button, Card, Input)
│   ├── features/     # Feature-specific components
│   └── layout/       # Layout components (Header, Sidebar)
├── hooks/            # Custom hooks & business logic
├── stores/           # Global state (Zustand/Context)
├── constants/        # Configuration & magic numbers
├── types/            # TypeScript definitions
├── utils/            # Pure utility functions
└── styles/           # Global styles & themes
```

### Component Hierarchy Example
```
App
├── Header (layout)
└── GameBoard (layout)
    ├── ResourceCounter (features)
    ├── ActionButtons (features)
    │   └── ActionButton (ui) × N
    └── UpgradeShop (features)
        └── UpgradeItem (ui) × N
```

## Best Practices

### State Management
- **Zustand** for global state (minimal re-renders)
- **React Query** for server state
- **Local state** for component-specific data

### Mobile-First Design
- **Responsive breakpoints** using Tailwind
- **Touch-friendly** targets (min 44px)
- **Accessible** with proper ARIA labels
- **Performance** optimized with lazy loading

### Code Organization
```typescript
// Constants centralized
const GAME_CONSTANTS = {
  PRESTIGE_REQUIREMENT: 1000000,
  MINION_BASE_COST: 50,
  COST_MULTIPLIER: 1.2
} as const;

// Strong typing
interface GameStat {
  icon: string;
  label: string;
  value: string | number;
  color: string;
  showChange?: boolean;
}
```

### Component Patterns
- **Custom hooks** for business logic
- **Compound components** for flexibility
- **Render props** for reusability
- **Error boundaries** for error handling

## Missing Elements Added

### Performance
- **React.memo** for expensive renders
- **useMemo/useCallback** for optimization
- **Lazy loading** with React.lazy
- **Virtual scrolling** for large lists

### Developer Experience
- **ESLint + Prettier** for code consistency
- **Husky** for git hooks
- **Vitest** for testing
- **Storybook** for component documentation

### Production Ready
- **Error boundaries** for crash prevention
- **Loading states** for better UX
- **Offline support** with service workers
- **PWA features** for mobile installation

### Accessibility
- **Semantic HTML** elements
- **Keyboard navigation** support
- **Screen reader** compatibility
- **Color contrast** compliance

## Benefits

1. **Maintainability** - Easy to find and modify code
2. **Testability** - Isolated, pure functions
3. **Reusability** - Generic, composable components
4. **Type Safety** - Compile-time error prevention
5. **Performance** - Efficient re-renders and loading
6. **Mobile-First** - Responsive, touch-friendly design