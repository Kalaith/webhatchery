# Kemonomimi Breeding Simulator: Migration Checklist (HTML/JS to React/Vite/TypeScript/Tailwind + PHP Backend)

## 1. Project Setup
- [x] Create new Vite + React + TypeScript project structure
- [x] Install and configure Tailwind CSS
- [x] Set up ESLint, Prettier, and basic code quality tools
- [x] Set up folder structure for components, pages, hooks, utils, types, and assets
- [x] Set up environment variables for API endpoints

## 2. Core Game Data & State Management
- [x] Define TypeScript types/interfaces for Kemonomimi, Jobs, Stats, Breeding, Training, Market, Family Tree, etc.
- [x] Implement global state management (Context API, Zustand, Redux, or similar)
- [x] Migrate initial game data (kemonomimi types, jobs, traits, etc.) to TypeScript modules
- [x] Implement persistent state (localStorage or backend sync)

## 3. UI/UX & Component Migration
### General Layout
- [x] Responsive main layout with header, navigation tabs, and main content area
- [x] Theming (light/dark mode) using Tailwind (in progress)

### Header
- [x] Coins, Day, Collection count display as React components

### Navigation Tabs
- [x] Tab navigation (Collection, Breeding, Training, Marketplace, Family Tree)
- [x] Active tab highlighting and accessibility

### Collection Tab
- [x] Kemonomimi grid/cards (with stats, type, avatar, status)
- [x] Modal for detailed kemonomimi info and actions
- [x] Integrate AI images from `/gallery/portraits` (map images to types/IDs) (pending)

### Breeding Tab
- [x] Parent selection UI (click-select)
- [x] Breeding controls and cost display
- [x] Breeding queue/progress display
- [x] Modal for breeding results (integrated in logic/UI)

### Training Tab
- [x] Job list/grid with requirements and costs
- [x] Training queue/progress display
- [x] Modal for job selection

### Marketplace Tab
- [x] Market actions (refresh, filter by type)
- [x] Buy/Sell tabs and grids
- [x] Price display and transaction modals

### Family Tree Tab
- [x] Family tree visualization (tree/graph component)
- [x] Display lineage and prevent inbreeding

### Modals
- [x] General modal component (reusable)
- [x] Kemonomimi details modal
- [x] Job selection modal
- [x] Transaction confirmation modal (integrated in logic/UI)

## 4. Game Logic Refactor
- [x] Port all game logic (breeding, training, market, family tree, day progression) to TypeScript modules/hooks
- [x] Refactor random generation, stat calculation, and price logic
- [x] Implement timers/progress bars for breeding/training
- [ ] Implement achievement and event systems (optional/bonus)

## 5. AI Image Integration
- [ ] Create mapping logic for kemonomimi type/ID to AI image filename
- [ ] Load images from `/gallery/portraits` dynamically
- [ ] Fallback/default image handling
- [ ] Optimize image loading (lazy loading, responsive sizes)

## 6. Backend API (PHP) Integration (Outline)
- [ ] Define API endpoints for game state, breeding, training, market, and family tree
- [ ] Implement frontend API calls (fetch/axios, error handling)
- [ ] Sync state with backend (save/load game, transactions)
- [ ] Authentication (optional/bonus)

## 7. Styling & Polish
- [x] Import original CSS for legacy styles
- [ ] Convert all CSS to Tailwind utility classes (in progress)
- [ ] Ensure accessibility (a11y) for all components
- [ ] Add animations/transitions for UI feedback
- [ ] Mobile and tablet responsiveness (basic via Tailwind, polish in progress)
- [ ] Polish modals, buttons, and interactive elements

## 8. Testing & QA
- [ ] Unit tests for core logic (TypeScript)
- [ ] Component tests (React Testing Library)
- [ ] End-to-end tests (Cypress/Playwright)
- [ ] Manual QA for all game flows

## 9. Documentation
- [ ] Update README with setup, build, and deployment instructions
- [ ] Document component structure and state management
- [ ] Add code comments and JSDoc for complex logic

## 10. Deployment
- [ ] Set up build scripts for frontend and backend
- [ ] Configure deployment (Vercel, Netlify, custom server, etc.)
- [ ] Set up environment variables for production
- [ ] Final production build and smoke test

---

**Bonus/Optional:**
- [ ] Add sound effects/music
- [ ] Add user accounts and cloud save
- [ ] Add advanced analytics or event tracking
- [ ] Add social sharing features

**Note:**
- The original CSS is imported for full legacy styling. Tailwind migration and polish are ongoing. 