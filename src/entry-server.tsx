/* eslint-disable react-refresh/only-export-components -- build-time server entry, never hot-reloaded */
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { ROUTES, type Route } from './routes'

export { ROUTES }
export { structuredDataTag } from './seo'

/**
 * Build-time render of one page (see scripts/prerender.mjs). The HTML that
 * reaches browsers and crawlers carries all the content; the client bundle
 * then hydrates it.
 */
export async function render(route: Route): Promise<string> {
  const { default: Page } = await route.load()
  return renderToString(
    <StrictMode>
      <Page {...route.props} />
    </StrictMode>,
  )
}
