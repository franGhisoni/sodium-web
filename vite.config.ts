import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * The three.js scene lives in its own chunk (dynamic import in Crystal.tsx)
 * so the page paints before it loads. Without a hint the browser only
 * discovers that chunk once the main bundle has run, so this preloads it
 * from the HTML, and preloads the two fonts almost every word uses.
 */
function preloadHints(): Plugin {
  return {
    name: 'sodium:preload-hints',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        const bundle = ctx.bundle
        if (!bundle) return
        const tags = []
        for (const out of Object.values(bundle)) {
          if (out.type === 'chunk' && out.name === 'crystalScene') {
            tags.push({
              tag: 'link',
              attrs: { rel: 'modulepreload', crossorigin: true, href: `/${out.fileName}` },
              injectTo: 'head' as const,
            })
          }
          if (
            out.type === 'asset' &&
            /(inter-tight|jetbrains-mono)-normal-latin-[\w-]{8}\.woff2$/.test(out.fileName)
          ) {
            tags.push({
              tag: 'link',
              attrs: { rel: 'preload', as: 'font', type: 'font/woff2', crossorigin: true, href: `/${out.fileName}` },
              injectTo: 'head' as const,
            })
          }
        }
        return tags
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), preloadHints()],
})
