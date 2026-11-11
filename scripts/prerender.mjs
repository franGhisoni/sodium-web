/**
 * Prerender (static site generation): one HTML file per page in src/routes.ts.
 *
 * `vite build` emits dist/index.html (the template) with an empty #root;
 * `vite build --ssr` emits dist-ssr/entry-server.js. For every route this
 * script renders the page to HTML at build time and writes
 * dist/<path>/index.html with that page's own title, description, canonical,
 * Open Graph / Twitter tags and JSON-LD, and a preload of its JS chunk. Then it writes dist/sitemap.xml from the same route list, so the
 * sitemap only ever lists real, canonical, indexable URLs.
 */
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const ssrDir = path.join(root, 'dist-ssr')
const SITE = 'https://sodium.ar'

const { render, ROUTES, structuredDataTag } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href)

let template = await readFile(path.join(dist, 'index.html'), 'utf8')

/* The stylesheet (~10 KB gzipped) goes inline in each page instead of as a
   <link>: the page paints as soon as its HTML arrives, without waiting on a
   second, render-blocking request. Its url()s are absolute (/assets/...). */
const cssLink = /<link rel="stylesheet"[^>]*href="\/(assets\/[^"]+\.css)"[^>]*>/
const cssMatch = template.match(cssLink)
if (!cssMatch) throw new Error('prerender: stylesheet link not found in dist/index.html')
const css = await readFile(path.join(dist, cssMatch[1]), 'utf8')
if (/url\((?!["']?(\/|data:|https?:))/.test(css)) throw new Error('prerender: CSS has relative url(), cannot inline')
template = template.replace(cssLink, () => `<style>${css}</style>`)
const manifest = JSON.parse(await readFile(path.join(dist, '.vite', 'manifest.json'), 'utf8'))

/* Each page's chunk is requested by the entry only once it runs, one round
   trip later. Preloading it from the HTML fetches it alongside the entry. */
const preloaded = new Set([...template.matchAll(/(?:src|href)="\/(assets\/[^"]+\.js)"/g)].map((m) => m[1]))
function pagePreloads(route) {
  /* The page module name, from the import in route.load (source or SSR chunk name). */
  const src = route.load.toString().match(/(?:pages\/|\.\/|assets\/)([A-Za-z]+)[.-]/)?.[1]
  const entry = src && manifest[`src/pages/${src}.tsx`]
  if (!entry) throw new Error(`prerender: no chunk found for ${route.path}`)
  return [entry.file, ...(entry.imports ?? []).map((k) => manifest[k].file)]
    .filter((f) => !preloaded.has(f))
    .map((f) => `<link rel="modulepreload" crossorigin href="/${f}">`)
    .join('')
}

const ROOT_MARKER = '<div id="root"></div>'
const LD_MARKER = '<!--structured-data-->'
for (const m of [ROOT_MARKER, LD_MARKER]) {
  if (!template.includes(m)) throw new Error(`prerender: ${m} not found in dist/index.html`)
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const url = (p) => (p === '/' ? `${SITE}/` : `${SITE}${p}`)

/** Replace the content of one existing tag; fail loudly if it isn't there. */
function setTag(html, re, value, what) {
  if (!re.test(html)) throw new Error(`prerender: ${what} not found in template`)
  return html.replace(re, (_m, before, _old, after) => `${before}${value}${after}`)
}

let total = 0
for (const route of ROUTES) {
  const appHtml = await render(route)
  const h1s = appHtml.match(/<h1[\s>]/g)?.length ?? 0
  if (h1s !== 1) throw new Error(`prerender: ${route.path} has ${h1s} <h1> elements (expected 1)`)

  const title = esc(route.title)
  const desc = esc(route.description)
  const canonical = url(route.path)
  let html = template
  html = setTag(html, /(<title>)([\s\S]*?)(<\/title>)/, title, 'title')
  html = setTag(html, /(<meta name="description" content=")([^"]*)(")/, desc, 'description')
  html = setTag(html, /(<link rel="canonical" href=")([^"]*)(")/, canonical, 'canonical')
  html = setTag(html, /(<meta property="og:url" content=")([^"]*)(")/, canonical, 'og:url')
  html = setTag(html, /(<meta property="og:title" content=")([^"]*)(")/, title, 'og:title')
  html = setTag(html, /(<meta name="twitter:title" content=")([^"]*)(")/, title, 'twitter:title')
  if (route.kind !== 'home') {
    html = setTag(html, /(<meta property="og:description" content=")([^"]*)(")/, desc, 'og:description')
    html = setTag(html, /(<meta name="twitter:description" content=")([^"]*)(")/, desc, 'twitter:description')
  }
  if (route.kind === 'article') {
    html = setTag(html, /(<meta property="og:type" content=")([^"]*)(")/, 'article', 'og:type')
  }

  html = html
    .replace(ROOT_MARKER, `<div id="root">${appHtml}</div>`)
    .replace(LD_MARKER, structuredDataTag(route) + pagePreloads(route))

  const out = route.path === '/' ? path.join(dist, 'index.html') : path.join(dist, route.path.slice(1), 'index.html')
  await mkdir(path.dirname(out), { recursive: true })
  await writeFile(out, html)
  total += appHtml.length
}

/* Sitemap: every prerendered route plus the static legal pages. */
const LEGAL = ['/privacidad/', '/eliminacion-de-datos/']
const today = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...ROUTES.map((r) => url(r.path)), ...LEGAL.map((p) => `${SITE}${p}`)]
  .map((loc) => `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`)
  .join('\n')}
</urlset>
`
await writeFile(path.join(dist, 'sitemap.xml'), sitemap)

await rm(ssrDir, { recursive: true, force: true })
await rm(path.join(dist, '.vite'), { recursive: true, force: true })
console.log(`prerender: ${ROUTES.length} pages (${(total / 1024).toFixed(0)} kB of HTML content) + sitemap.xml`)
