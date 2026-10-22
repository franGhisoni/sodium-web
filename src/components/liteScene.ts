/**
 * Phone backdrop: a cheap 2D stand-in for the WebGL scene. Drifting snow and
 * glinting salt flecks plus a few slowly turning faceted octahedra, drawn on
 * a transparent fixed canvas over the CSS gradient. No refraction, no scroll
 * sync: the canvas never moves, the octahedra only parallax with the scroll.
 */

type V3 = [number, number, number];

const VERTS: V3[] = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
const FACES: [number, number, number][] = [
  [0, 2, 4], [4, 2, 1], [1, 2, 5], [5, 2, 0],
  [4, 3, 0], [1, 3, 4], [5, 3, 1], [0, 3, 5],
];

interface Crystal { x: number; y: number; r: number; depth: number; ax: number; ay: number; sx: number; sy: number; ph: number }
interface Flake { x: number; y: number; r: number; v: number; ph: number; glint: boolean }

export function startLiteScene(canvas: HTMLCanvasElement): (() => void) | null {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let w = 0, h = 0, dpr = 1;
  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
  };
  resize();
  /* Width only: the URL bar resizing the viewport must not respawn anything. */
  let lastW = w;
  const onResize = () => { if (innerWidth !== lastW) { lastW = innerWidth; resize(); } };
  addEventListener('resize', onResize);

  const rnd = (a: number, b: number) => a + Math.random() * (b - a);
  const crystals: Crystal[] = Array.from({ length: 6 }, (_, i) => ({
    x: rnd(0.08, 0.92), y: rnd(0.05, 0.95),
    r: rnd(22, 60), depth: rnd(0.15, 0.6),
    ax: rnd(0, 6.28), ay: rnd(0, 6.28),
    sx: rnd(-0.25, 0.25), sy: rnd(0.12, 0.35) * (i % 2 ? 1 : -1), ph: rnd(0, 6.28),
  }));
  const flakes: Flake[] = Array.from({ length: 70 }, () => ({
    x: Math.random(), y: Math.random(), r: rnd(0.6, 2.2), v: rnd(0.008, 0.03),
    ph: rnd(0, 6.28), glint: Math.random() < 0.3,
  }));

  const drawCrystal = (c: Crystal, t: number, scroll: number) => {
    const ax = c.ax + t * c.sx, ay = c.ay + t * c.sy;
    const cx = Math.cos(ax), sx = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay);
    const px = c.x * w + Math.sin(t * 0.15 + c.ph) * 14;
    /* Wraps vertically so scroll parallax never runs out of crystals. */
    const span = h + 160;
    const py = ((((c.y * h - scroll * c.depth + Math.cos(t * 0.12 + c.ph) * 10) % span) + span) % span) - 80;
    const pts = VERTS.map(([x, y, z]) => {
      const y1 = y * cx - z * sx, z1 = y * sx + z * cx;
      const x2 = x * cy + z1 * sy, z2 = -x * sy + z1 * cy;
      return [px + x2 * c.r, py + y1 * c.r, z2] as V3;
    });
    const faces = FACES.map((f) => {
      const [a, b, d] = f.map((i) => pts[i]);
      const ux = b[0] - a[0], uy = b[1] - a[1], vx = d[0] - a[0], vy = d[1] - a[1];
      const cross = ux * vy - uy * vx;
      const z = (a[2] + b[2] + d[2]) / 3;
      return { f, cross, z };
    }).filter((f) => f.cross < 0).sort((a, b) => a.z - b.z);
    for (const { f, z } of faces) {
      const shade = 0.5 + 0.5 * Math.sin(ax * 2 + f[0] * 1.7 + ay) * 0.6 + z * 0.05;
      const a = 0.05 + Math.max(0, Math.min(1, shade)) * 0.13;
      ctx.beginPath();
      f.forEach((i, k) => (k ? ctx.lineTo(pts[i][0], pts[i][1]) : ctx.moveTo(pts[i][0], pts[i][1])));
      ctx.closePath();
      ctx.fillStyle = `rgba(190, 225, 252, ${a})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(225, 242, 255, ${0.16 + a})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  };

  let raf = 0, last = 0, running = true;
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    if (now - last < 33) return; /* ~30fps is plenty for slow drift */
    last = now;
    const t = reduced ? 0 : now / 1000;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const scroll = scrollY;
    for (const c of crystals) drawCrystal(c, t, scroll);
    for (const f of flakes) {
      const y = (((f.y + t * f.v) % 1) + 1) % 1;
      const x = f.x + Math.sin(t * 0.3 + f.ph) * 0.012;
      const tw = f.glint ? 0.35 + 0.65 * Math.max(0, Math.sin(t * 1.4 + f.ph * 3)) : 0.55;
      ctx.fillStyle = `rgba(235, 246, 255, ${tw * (f.glint ? 0.9 : 0.55)})`;
      ctx.beginPath();
      ctx.arc(x * w, y * h, f.r * (f.glint ? 0.9 + tw * 0.5 : 1), 0, 6.283);
      ctx.fill();
    }
  };
  raf = requestAnimationFrame(frame);

  const onVis = () => {
    if (document.hidden) { cancelAnimationFrame(raf); running = false; }
    else if (!running) { running = true; raf = requestAnimationFrame(frame); }
  };
  document.addEventListener('visibilitychange', onVis);

  return () => {
    cancelAnimationFrame(raf);
    removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVis);
  };
}
