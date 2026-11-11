import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './fonts.css'
import './index.css'
import App from './App.tsx'
import { startPerfHud } from './perfHud'

/* `?fps` shows an on-device frame-time readout (see perfHud.ts). */
if (new URLSearchParams(location.search).has('fps')) startPerfHud()

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

/* The production build prerenders the page into #root (scripts/prerender.mjs),
   so React adopts that HTML instead of rebuilding it. In dev it's empty. */
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
