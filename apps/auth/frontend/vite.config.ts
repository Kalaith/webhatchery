import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Set base path based on mode and environment
  let base = '/auth/';
  
  // Allow override from environment variable
  if (process.env.VITE_BASE_PATH) {
    base = process.env.VITE_BASE_PATH;
  }
  
  return {
    base,
    plugins: [
      react(),
      tailwindcss(),
    ],
  }
})
