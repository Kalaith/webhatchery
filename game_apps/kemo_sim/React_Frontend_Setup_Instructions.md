# Setting Up the React/Vite/TypeScript/Tailwind Frontend

This guide will help you set up the frontend for Kemonomimi Breeding Simulator using the same stack and configuration as the Dungeon Master project.

---

## 1. Create the Project

```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
```

## 2. Install Dependencies

Install the required dependencies and dev dependencies:

```bash
npm install react react-dom react-router-dom zustand framer-motion chart.js react-use tailwindcss @tailwindcss/vite autoprefixer
npm install -D typescript @types/react @types/react-dom @vitejs/plugin-react vite @eslint/js eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals typescript-eslint
```

## 3. Initialize Tailwind CSS

```bash
npx tailwindcss init -p
```

Edit `tailwind.config.js` to match:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

## 4. Configure Vite

Edit `vite.config.ts` to include:

```ts
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

## 5. Set Up ESLint

Create or edit `eslint.config.js`:

```js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
)
```

## 6. Update Scripts in `package.json`

Make sure your `package.json` scripts look like:

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

## 7. Prepare Project Structure

- Create folders: `src/components`, `src/pages`, `src/hooks`, `src/types`, `src/utils`, `src/assets`
- Place your main entry point in `src/main.tsx` and your app root in `src/App.tsx`

## 8. Configure Tailwind in CSS

In your main CSS (e.g., `src/index.css`):

```css
@import "tailwindcss";
```

## 9. Start the Development Server

```bash
npm run dev
```

---

You now have a React/Vite/TypeScript/Tailwind setup matching Dungeon Master. Begin porting your Kemonomimi Breeding Simulator components and logic into this structure. 