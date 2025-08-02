import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import GameContainer from './GameContainer.tsx'
import { GameProvider } from './contexts/GameContext.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'
import ProtectedRoute from './contexts/ProtectedRoute.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ProtectedRoute>
        <GameProvider>
          <GameContainer />
        </GameProvider>
      </ProtectedRoute>
    </AuthProvider>
  </StrictMode>,
)
