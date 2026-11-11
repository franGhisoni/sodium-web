import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.tsx'

export { structuredDataTag } from './seo'

/**
 * Build-time render of the page (see scripts/prerender.mjs). The HTML that
 * reaches browsers and crawlers carries all the content; the client bundle
 * then hydrates it.
 */
export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
