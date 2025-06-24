import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import './styles/site-overrides.css'
import App from './components/layout/App.tsx'

if (process.env.NODE_ENV === 'development') {
  import('./api/browser').then(({ worker }) => worker.start());
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
