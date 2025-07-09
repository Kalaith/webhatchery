# Frontend Development Standards for React Applications

This document outlines the core standards for developing React-based frontend applications within our ecosystem. Adhering to these guidelines ensures consistency, maintainability, scalability, and a streamlined development workflow across all projects.

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
