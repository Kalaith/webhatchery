import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import GameContainer from './GameContainer.tsx'
import { GameProvider } from './contexts/GameContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameProvider>
      <GameContainer />
    </GameProvider>
  </StrictMode>,
)
