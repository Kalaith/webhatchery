import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import checker from 'vite-plugin-checker'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: './', // Use relative paths for assets
  plugins: [
    react(),
    tailwindcss(),
    checker({
      typescript: true,
      // Disable ESLint checker due to compatibility issues with newer ESLint versions
      // You can run `npm run lint` separately for ESLint checking
      // eslint: {
      //   lintCommand: 'eslint "./src/**/*.{ts,tsx}"'
      // }
    })
  ],
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress TypeScript warnings in production builds if needed
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return
        warn(warning)
      }
    }
  },
  server: {
    host: true,
    port: 5173
  }
})
