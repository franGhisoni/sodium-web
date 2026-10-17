/**
 * On-device performance readout, for diagnosing scroll jank on phones.
 *
 * Open the site with `?fps` to show it. Add `&nogl` to run the same page
 * without the WebGL scene (see Crystal.tsx), so the two can be compared on
 * the real device: if the page is smooth with `nogl`, the scene is the
 * cost; if not, the jank comes from the DOM/CSS.
 */
type SceneInfo = { quality: number; width: number; height: number };

declare global {
  interface Window {
    __scene?: SceneInfo;
  }
}

export function startPerfHud() {
  const el = document.createElement('pre');
  Object.assign(el.style, {
    position: 'fixed',
    left: '8px',
    bottom: '8px',
    zIndex: '9999',
    margin: '0',
    padding: '8px 10px',
    font: '11px/1.4 ui-monospace, monospace',
    color: '#d6f5d6',
    background: 'rgba(0, 0, 0, 0.72)',
    borderRadius: '8px',
    pointerEvents: 'none',
    whiteSpace: 'pre',
  } satisfies Partial<CSSStyleDeclaration>);
  document.body.appendChild(el);

  const frames: number[] = [];
  let last = performance.now();
  let lastPaint = 0;
  const tick = (now: number) => {
    frames.push(now - last);
    last = now;
    if (frames.length > 120) frames.shift();
    if (now - lastPaint > 500) {
      lastPaint = now;
      const n = frames.length || 1;
      const avg = frames.reduce((s, f) => s + f, 0) / n;
      const worst = Math.max(...frames);
      const slow = frames.filter((f) => f > 20).length;
      const s = window.__scene;
      el.textContent = [
        `fps     ${(1000 / avg).toFixed(0)}`,
        `worst   ${worst.toFixed(0)} ms`,
        `>20ms   ${Math.round((slow / n) * 100)}%`,
        `dpr     ${devicePixelRatio}`,
        s ? `scene   ${s.width}x${s.height} q${s.quality.toFixed(2)}` : 'scene   off',
      ].join('\n');
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
