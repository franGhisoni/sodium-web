/**
 * Prerender (static site generation) for the home page.
 *
 * `vite build` emits dist/index.html with an empty #root; `vite build --ssr`
 * emits dist-ssr/entry-server.js. This script renders the app to HTML once,
 * at build time, and writes it into #root, so the first response already
 * contains the real content (name, services, cases, contact) for crawlers,
 * Lighthouse and users on slow connections. React hydrates it on load.
 */
import { readFile, writeFile, rm } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const ssrDir = path.join(root, 'dist-ssr')

const { render, structuredDataTag } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href)

const file = path.join(dist, 'index.html')
const template = await readFile(file, 'utf8')
const marker = '<div id="root"></div>'
if (!template.includes(marker)) throw new Error(`prerender: ${marker} not found in dist/index.html`)

const appHtml = render()
if (!appHtml.includes('<h1')) throw new Error('prerender: rendered HTML has no <h1>')

const ldMarker = '<!--structured-data-->'
if (!template.includes(ldMarker)) throw new Error(`prerender: ${ldMarker} not found in dist/index.html`)

const html = template
  .replace(marker, `<div id="root">${appHtml}</div>`)
  .replace(ldMarker, structuredDataTag())
await writeFile(file, html)
await rm(ssrDir, { recursive: true, force: true })
console.log(`prerender: wrote dist/index.html (${(appHtml.length / 1024).toFixed(1)} kB of HTML content)`)
