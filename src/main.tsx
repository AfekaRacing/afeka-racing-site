import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/heebo'
import './styles/global.css'
import './styles/layout.css'
import './styles/pages.css'
import './styles/story.css'
import './styles/orna.css'
import './styles/join.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
