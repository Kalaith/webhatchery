# React Migration Guide

This guide provides a step-by-step, generic process for migrating an existing HTML/JS site to a modern React-based frontend. It is based on the structure and best practices used in the `dungeon_master` frontend, but is designed to be reusable for any project in your workspace.

---

## 1. Project Structure

**Recommended React Project Structure:**

```
project-root/
  frontend/
    public/
      index.html
      favicon.ico
    src/
      components/
      App.tsx
      main.tsx
      index.css
    package.json
    tsconfig.json
    vite.config.ts
    ...
```

- Place all React code in a `frontend/` subdirectory.
- Use `src/components/` for reusable UI components.
- Use Vite (or Create React App) for fast builds and modern tooling.

---

## 2. Initializing the React App

1. **Navigate to your project directory:**
   ```sh
   cd your_project
   ```
2. **Create the React app in a `frontend` folder:**
   ```sh
   npm create vite@latest frontend -- --template react-ts
   cd frontend
   npm install
   ```
3. **Configure Vite for subdirectory deployment:**
   - In `vite.config.ts`, set `base: './'` for relative asset paths.

---

## 3. Migrating HTML/CSS/JS

1. **Copy static assets** (images, icons, etc.) to `public/`.
2. **Move global CSS** to `src/index.css`.
3. **Break up HTML into React components:**
   - Each logical UI section (header, sidebar, main, etc.) becomes a component in `src/components/`.
   - Convert inline event handlers (`onclick`, etc.) to React props and state.
4. **Replace direct DOM manipulation** with React state and props.
5. **Use TypeScript for type safety** (recommended, as in `dungeon_master`).

---

## 4. Routing (Optional)

If your site has multiple pages, use [React Router](https://reactrouter.com/) for navigation:
```sh
npm install react-router-dom
```

---

## 5. Building and Deploying

- **Build:**
  ```sh
  npm run build
  ```
- **Output:** The production build will be in `frontend/dist/`.
- **Deploy:** Copy the contents of `dist/` to your server or deployment directory (as handled by your build-deploy scripts).

---

## 6. Best Practices

- Use functional components and hooks (`useState`, `useEffect`, etc.).
- Keep components small and focused.
- Use props for data flow and callbacks.
- Use CSS modules or styled-components for scoped styles (optional).
- Test on both desktop and mobile.

---

## 7. Example: Migrating a Simple HTML Section

**Original HTML:**
```html
<div class="hero">
  <h1>Welcome!</h1>
  <button onclick="alert('Hello!')">Say Hi</button>
</div>
```

**React Component:**
```tsx
import React from 'react';

const Hero: React.FC = () => (
  <div className="hero">
    <h1>Welcome!</h1>
    <button onClick={() => alert('Hello!')}>Say Hi</button>
  </div>
);

export default Hero;
```

---

## 8. Further Steps

- Refactor and modularize as you migrate more features.
- Add state management (e.g., Redux, Zustand) if needed for complex apps.
- Add tests (Jest, React Testing Library) for critical components.

---

**This guide can be reused for any HTML/JS site in your workspace.**

For more details, see the [React documentation](https://react.dev/learn) and [Vite documentation](https://vitejs.dev/guide/).
