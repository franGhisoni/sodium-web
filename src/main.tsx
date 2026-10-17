import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { startPerfHud } from './perfHud'

/* `?fps` shows an on-device frame-time readout (see perfHud.ts). */
if (new URLSearchParams(location.search).has('fps')) startPerfHud()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
