import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
/* All styles load with the entry, so a prerendered page is styled from its
   first paint whatever page chunk it needs. */
import './fonts.css'
import './index.css'
import './kinetic.css'
import './components/Nav.css'
import './components/Hero.css'
import './components/sections.css'
import './components/pages.css'
import { findRoute } from './routes'
import { startPerfHud } from './perfHud'

/* `?fps` shows an on-device frame-time readout (see perfHud.ts). */
if (new URLSearchParams(location.search).has('fps')) startPerfHud()

/* One page per URL (src/routes.ts). The build prerenders each page into
   #root (scripts/prerender.mjs), so React adopts that HTML instead of
   rebuilding it; in dev #root is empty and the page renders from scratch. */
const route = findRoute(location.pathname)
const root = document.getElementById('root')
if (route && root) {
  route.load().then(({ default: Page }) => {
    const app = (
      <StrictMode>
        <Page {...route.props} />
      </StrictMode>
    )
    if (root.hasChildNodes()) hydrateRoot(root, app)
    else createRoot(root).render(app)
  })
}
