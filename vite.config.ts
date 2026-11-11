import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Preloads the two fonts almost every word uses.
 *
 * The three.js scene (its own chunk, dynamic import in Crystal.tsx) is NOT
 * preloaded: it only starts after the page has loaded, so fetching it early
 * would just compete with the fonts, CSS and main bundle for bandwidth.
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
  build: {
    /* scripts/prerender.mjs reads it to preload each page's own chunk. */
    manifest: true,
    rolldownOptions: {
      output: {
        /* Shared components and content in one chunk, so a page needs the
           entry, that chunk and its own small page chunk: few requests on
           the critical path. three.js and the scene stay in their own lazy
           chunk. */
        codeSplitting: {
          groups: [{ name: 'app', test: /src[\\/](components|content)[\\/](?!crystalScene)[\w.-]+\.tsx?$/ }],
        },
      },
    },
  },
})
