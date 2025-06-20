# Mobile-First React Project Setup with Clean Architecture (Vite + Tailwind CSS v4)

This guide will help you convert or start a JavaScript app as a modern, mobile-first React project using Vite, Tailwind CSS v4, and Clean Architecture principles. The configuration is based on a proven production setup.

---

## 1. Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

---

## 2. Create a New Project
```sh
npm create vite@latest my-react-app -- --template react-ts
cd my-react-app
```

---

## 3. Update `package.json` Dependencies
Replace your dependencies with:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@tailwindcss/vite": "^4.1.10",
    "autoprefixer": "^10.4.21",
    "chart.js": "^4.4.9",
    "framer-motion": "^12.18.1",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-router-dom": "^7.6.2",
    "react-use": "^17.6.0",
    "tailwindcss": "^4.1.10",
    "zustand": "^5.0.5"
  },
  "devDependencies": {
    "@eslint/js": "^9.25.0",
    "@types/react": "^19.1.2",
    "@types/react-dom": "^19.1.2",
    "@vitejs/plugin-react": "^4.4.1",
    "eslint": "^9.25.0",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.19",
    "globals": "^16.0.0",
    "typescript": "~5.8.3",
    "typescript-eslint": "^8.30.1",
    "vite": "^6.3.5"
  }
}
```
Then run:
```sh
npm install
```

---

## 4. Add and Configure Vite
Create or update `vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
```

---

## 5. Add and Configure TypeScript
Create or update `tsconfig.json`:
```jsonc
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
    "downlevelIteration": true
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

---

## 6. Add Tailwind CSS v4
```sh
npx tailwindcss@latest init -p
```
Include talwind4 in your css file:
```css
@import "tailwindcss";
/* Add your custom styles below */
```

---

## 7. Clean Architecture Structure
Organize your project for maintainability and scalability:
```
📁 src/
├── components/
│   ├── ui/           # Pure UI components (Button, ActionButton)
│   ├── game/         # Game-specific or feature components
│   └── layout/       # Layout components
├── hooks/            # Business logic and state management
├── stores/           # Global state (e.g., Zustand)
├── constants/        # Configuration and magic numbers
├── data/             # Static app data
├── types/            # TypeScript definitions
└── styles/           # Global and component styles
```

### Example Component Hierarchy
```
App
├── Header (layout)
└── MainView (layout)
    ├── ResourceCounter (game)
    ├── ActionButtons (game)
    │   └── ActionButton (ui)
    ├── UpgradeShop (game)
    │   └── UpgradeItem (game)
    └── ...
```

---

## 8. Mobile-First Design
- Use Tailwind’s responsive utilities (`sm:`, `md:`, `lg:`, etc.).
- Design for mobile by default, then enhance for larger screens.
- Use touch-friendly classes and spacing (see `globals.css` for examples).

---

## 9. Clean Code Principles
- **Single Responsibility**: Each component/hook does one thing.
- **Separation of Concerns**: UI, logic, and data are separated.
- **Reusable Components**: Build generic, composable UI.
- **Type Safety**: Use TypeScript for all logic and props.
- **Modern React Patterns**: Use hooks, functional components, and state libraries like Zustand.

---

## 10. Start Developing
```sh
npm run dev
```

---

## 11. Resources
- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [TypeScript](https://www.typescriptlang.org/)

---

**You now have a modern, mobile-first, clean-architecture React project ready for development!**
