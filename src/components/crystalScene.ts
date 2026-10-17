import {
  AdditiveBlending,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  Color,
  DataTexture,
  DirectionalLight,
  DoubleSide,
  DynamicDrawUsage,
  EdgesGeometry,
  ExtrudeGeometry,
  Group,
  HalfFloatType,
  IcosahedronGeometry,
  LinearFilter,
  LinearMipmapLinearFilter,
  LineBasicMaterial,
  LineSegments,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  NoToneMapping,
  OctahedronGeometry,
  OrthographicCamera,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Quaternion,
  RepeatWrapping,
  RGBAFormat,
  Scene,
  Shape,
  ShaderMaterial,
  SphereGeometry,
  SRGBColorSpace,
  TetrahedronGeometry,
  Texture,
  Vector2,
  Vector3,
  WebGLRenderer,
  WebGLRenderTarget,
} from 'three';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { BG_FRAG } from './Background';
import {
  getAnchors,
  getCards,
  type BeamLight,
  type CardMaterial,
  type CrystalCard,
  type SceneAnchorEntry,
} from '../crystalCards';

/**
 * The whole page backdrop, rendered in two passes so every crystal can
 * refract everything behind it:
 *
 * 1. Beams: light beams traced through each glass prism with Snell's law,
 *    one path per wavelength, so white light bends at every face and leaves
 *    as a fanned spectrum. Drawn as glowing ribbons into a texture.
 * 2. World: the salt/snow backdrop (with the beams composited in), the
 *    octahedra the camera flies through on scroll, the prisms and the glass
 *    fractal (a tetrahedron with a morphing liquid orb inside).
 * 3. Cards: the world image as an opaque layer, plus a slab behind every
 *    `<Glass>` card. three's transmission only sees opaque objects, so this
 *    is what lets the cards bend the prisms, the orb and the beams.
 */

const FULLSCREEN_VERT = `
varying vec2 v_uv;
void main() {
  v_uv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

/* Backdrop + traced beams, in linear. */
const WORLD_BG_FRAG = BG_FRAG.replace(
  'varying vec2  v_uv;',
  'varying vec2  v_uv;\nuniform sampler2D u_beams;',
).replace(
  'gl_FragColor = vec4(pow(max(col, 0.0), vec3(2.2)), 1.0);',
  'gl_FragColor = vec4(pow(max(col, 0.0), vec3(2.2)) + texture2D(u_beams, v_uv).rgb, 1.0);',
);

/* The finished world image, shown opaque so the card slabs refract it. */
const WORLD_QUAD_FRAG = `
uniform sampler2D tWorld;
varying vec2 v_uv;
void main() {
  gl_FragColor = vec4(texture2D(tWorld, v_uv).rgb, 1.0);
  #include <colorspace_fragment>
  gl_FragColor.rgb += (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0;
}
`;

/* Beam ribbons (kind 0) and lens flares (kind 1), in CSS pixels. */
const BEAM_VERT = `
attribute vec3 aColor;
attribute vec2 aUv;
attribute float aKind;
varying vec3 v_col;
varying vec2 v_uv;
varying float v_kind;
void main() {
  v_col = aColor;
  v_uv = aUv;
  v_kind = aKind;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const BEAM_FRAG = `
varying vec3 v_col;
varying vec2 v_uv;
varying float v_kind;
void main() {
  if (v_kind < 0.5) {
    float a = v_uv.y;
    float core = exp(-a * a * 42.0);
    float glow = exp(-a * a * 4.5) * 0.3;
    gl_FragColor = vec4(v_col * (core * 1.5 + glow), 1.0);
  } else {
    float r2 = dot(v_uv, v_uv);
    float f = exp(-r2 * 5.0) * 0.45 + exp(-r2 * 46.0) * 2.2
            + exp(-abs(v_uv.y) * 34.0) * exp(-v_uv.x * v_uv.x * 2.5) * 0.6;
    gl_FragColor = vec4(v_col * f, 1.0);
  }
}
`;

/* Additive fresnel shell: keeps the octahedra reading as lit ice. */
const RIM_VERT = `
varying vec3 v_nrm;
varying vec3 v_view;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  v_nrm = normalize(normalMatrix * normal);
  v_view = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`;

const RIM_FRAG = `
uniform float u_fade;
varying vec3 v_nrm;
varying vec3 v_view;
void main() {
  vec3 n = normalize(v_nrm);
  float fres = pow(1.0 - abs(dot(n, normalize(v_view))), 2.2);
  vec3 ice = vec3(0.26, 0.45, 0.68);
  vec3 col = ice * fres * 0.9 + vec3(0.85, 0.94, 1.0) * pow(fres, 3.0) * 0.8;
  gl_FragColor = vec4(col * u_fade, 1.0);
}
`;

/* Holographic foil over a slab: hue bands that slide with view angle, the
   facet normals and pointer tilt — the part three's iridescence can't show
   against a dark sky (it only tints reflections). */
const HOLO_VERT = `
varying vec2 v_uv;
varying vec3 v_nrm;
varying vec3 v_view;
void main() {
  v_uv = uv;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  v_nrm = normalize(normalMatrix * normal);
  v_view = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`;

const HOLO_FRAG = `
uniform sampler2D uFacets;
uniform float uTime;
uniform float uAlpha;
uniform float uShift; /* card offset from screen centre: slides the foil on scroll */
varying vec2 v_uv;
varying vec3 v_nrm;
varying vec3 v_view;
vec3 hue(float h) {
  return clamp(abs(fract(h + vec3(0.0, 2.0 / 3.0, 1.0 / 3.0)) * 6.0 - 3.0) - 1.0, 0.0, 1.0);
}
void main() {
  vec3 f = texture2D(uFacets, v_uv / 300.0).xyz * 2.0 - 1.0;
  vec3 n = normalize(v_nrm + vec3(f.xy * 0.7, 0.0));
  vec3 v = normalize(v_view);
  float facing = dot(n, v);
  float h = fract((v_uv.x * 0.7 - v_uv.y) * 0.0011 + n.x * 1.4 - n.y * 0.9 + uTime * 0.025 + uShift * 0.9);
  float bands = 0.5 + 0.5 * sin((v_uv.x + v_uv.y * 0.6) * 0.016 + facing * 14.0 + uTime * 0.4 + uShift * 7.0);
  float edge = pow(1.0 - abs(facing), 2.0);
  vec3 col = hue(h) * (0.04 + 0.1 * bands * bands + edge * 0.3);
  gl_FragColor = vec4(col * uAlpha, 1.0);
}
`;

type Cube = {
  o: [number, number, number];
  s: number;
  ph: number;
  sp: number;
  /** Cubes with a pivot orbit around it (the hero cluster). */
  pivot?: [number, number, number];
};

/* Hero cluster: upper right and set back, so the first view stays clear
   for the title and the prism. */
const HERO_PIVOT: [number, number, number] = [6.2, 3, -7];
const HERO_REL: Array<Omit<Cube, 'pivot'>> = [
  { o: [0, 0, 0], s: 1.2, ph: 0.0, sp: 0.10 },
  { o: [2.5, 1.6, -1.0], s: 0.5, ph: 1.7, sp: 0.16 },
  { o: [-2.2, -1.8, 0.9], s: 0.4, ph: 3.9, sp: 0.13 },
];

/* The camera flies this far down -z over the whole page. */
const TRAVEL = 100;
const START_Z = 12;

/* Card slabs ride with the camera at this distance, sized in CSS pixels. */
const CARD_DIST = 6;
const SLAB_DEPTH = 10;
const SLAB_BEVEL = 7;

/* Anchored pieces sit further back, behind the card slabs. */
const ANCHOR_DIST = 9;

function buildCubes(): Cube[] {
  const cubes: Cube[] = HERO_REL.map((c) => ({
    ...c,
    o: [c.o[0] + HERO_PIVOT[0], c.o[1] + HERO_PIVOT[1], c.o[2] + HERO_PIVOT[2]],
    pivot: HERO_PIVOT,
  }));

  /* Deterministic scatter down the corridor, kept to the sides so the
     centre of the page (where the copy lives) stays mostly clear. */
  let seed = 1337;
  const rnd = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let k = 0; k < 44; k++) {
    /* Starts a few units back so the first view stays uncluttered. */
    const z = -13 - k * 1.9 - rnd() * 1.4;
    const side = rnd() < 0.5 ? -1 : 1;
    const big = rnd() < 0.18;
    cubes.push({
      o: [side * (3.4 + rnd() * 6.5), (rnd() - 0.5) * 8, z],
      s: big ? 0.9 + rnd() * 0.8 : 0.22 + rnd() * 0.55,
      ph: rnd() * Math.PI * 2,
      sp: 0.06 + rnd() * 0.18,
    });
  }
  return cubes;
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

/* ── Spectral beam tracing (2D, CSS pixels, y down) ── */

type P = { x: number; y: number };
type RGB = [number, number, number];

/** Visible wavelengths sampled per beam, nm. */
const WAVES = [410, 445, 480, 515, 550, 585, 625, 670];

/** Cauchy dispersion, exaggerated so the fan reads at UI scale. */
const iorAt = (nm: number) => 1.44 + 0.024 / (nm / 1000) ** 2;

function waveColor(nm: number): RGB {
  let r = 0, g = 0, b = 0;
  if (nm < 440) { r = -(nm - 440) / 60; b = 1; }
  else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
  else if (nm < 510) { g = 1; b = -(nm - 510) / 20; }
  else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
  else if (nm < 645) { r = 1; g = -(nm - 645) / 65; }
  else r = 1;
  return [r, g, b];
}

/* Normalised so the colours of all wavelengths add back up to white. */
const WAVE_RGB: RGB[] = (() => {
  const raw = WAVES.map(waveColor);
  const sum = raw.reduce((s, c) => [s[0] + c[0], s[1] + c[1], s[2] + c[2]], [0, 0, 0]);
  return raw.map((c) => [c[0] / sum[0], c[1] / sum[1], c[2] / sum[2]] as RGB);
})();

const dot2 = (a: P, b: P) => a.x * b.x + a.y * b.y;

/** Snell refraction; `n` faces against `d`, eta = n1 / n2. Null on TIR. */
function refract2(d: P, n: P, eta: number): P | null {
  const cosi = -dot2(n, d);
  const k = 1 - eta * eta * (1 - cosi * cosi);
  if (k < 0) return null;
  const f = eta * cosi - Math.sqrt(k);
  return { x: d.x * eta + n.x * f, y: d.y * eta + n.y * f };
}

function reflect2(d: P, n: P): P {
  const k = 2 * dot2(d, n);
  return { x: d.x - n.x * k, y: d.y - n.y * k };
}

/** Nearest edge hit of a ray against a convex polygon, skipping one edge. */
function hitEdge(poly: P[], p: P, d: P, skip: number): { t: number; i: number } | null {
  let best: { t: number; i: number } | null = null;
  for (let i = 0; i < poly.length; i++) {
    if (i === skip) continue;
    const a = poly[i], b = poly[(i + 1) % poly.length];
    const ex = b.x - a.x, ey = b.y - a.y;
    const den = d.x * ey - d.y * ex;
    if (Math.abs(den) < 1e-9) continue;
    const wx = a.x - p.x, wy = a.y - p.y;
    const t = (wx * ey - wy * ex) / den;
    const s = (wx * d.y - wy * d.x) / den;
    if (t > 1e-3 && s >= 0 && s <= 1 && (!best || t < best.t)) best = { t, i };
  }
  return best;
}

function outwardNormal(poly: P[], i: number): P {
  const a = poly[i], b = poly[(i + 1) % poly.length];
  let n = { x: b.y - a.y, y: -(b.x - a.x) };
  const l = Math.hypot(n.x, n.y) || 1;
  n = { x: n.x / l, y: n.y / l };
  const c = poly.reduce((s, q) => ({ x: s.x + q.x / poly.length, y: s.y + q.y / poly.length }), { x: 0, y: 0 });
  if (dot2(n, { x: (a.x + b.x) / 2 - c.x, y: (a.y + b.y) / 2 - c.y }) < 0) n = { x: -n.x, y: -n.y };
  return n;
}

/* ── Beam ribbon batch ── */

const MAX_QUADS = 220;

function createBeamBatch() {
  const pos = new Float32Array(MAX_QUADS * 4 * 3);
  const col = new Float32Array(MAX_QUADS * 4 * 3);
  const uv = new Float32Array(MAX_QUADS * 4 * 2);
  const kind = new Float32Array(MAX_QUADS * 4);
  const index = new Uint16Array(MAX_QUADS * 6);
  for (let q = 0; q < MAX_QUADS; q++) {
    const v = q * 4;
    index.set([v, v + 1, v + 2, v + 2, v + 1, v + 3], q * 6);
  }
  const geo = new BufferGeometry();
  const attr = (a: Float32Array, n: number) => {
    const b = new BufferAttribute(a, n);
    b.setUsage(DynamicDrawUsage);
    return b;
  };
  geo.setAttribute('position', attr(pos, 3));
  geo.setAttribute('aColor', attr(col, 3));
  geo.setAttribute('aUv', attr(uv, 2));
  geo.setAttribute('aKind', attr(kind, 1));
  geo.setIndex(new BufferAttribute(index, 1));
  let n = 0;

  const vert = (i: number, x: number, y: number, c: RGB, u: number, w: number, k: number) => {
    pos.set([x, y, 0], i * 3);
    col.set(c, i * 3);
    uv.set([u, w], i * 2);
    kind[i] = k;
  };

  return {
    geo,
    reset() {
      n = 0;
    },
    /** Glowing ribbon from a to b, widths and colours interpolated. */
    ribbon(a: P, b: P, wa: number, wb: number, ca: RGB, cb: RGB) {
      if (n >= MAX_QUADS) return;
      const dx = b.x - a.x, dy = b.y - a.y;
      const l = Math.hypot(dx, dy) || 1;
      const px = -dy / l, py = dx / l;
      const v = n * 4;
      vert(v, a.x + px * wa, a.y + py * wa, ca, 0, 1, 0);
      vert(v + 1, a.x - px * wa, a.y - py * wa, ca, 0, -1, 0);
      vert(v + 2, b.x + px * wb, b.y + py * wb, cb, 1, 1, 0);
      vert(v + 3, b.x - px * wb, b.y - py * wb, cb, 1, -1, 0);
      n++;
    },
    flare(p: P, size: number, c: RGB) {
      if (n >= MAX_QUADS) return;
      const v = n * 4;
      vert(v, p.x - size, p.y - size, c, -1, -1, 1);
      vert(v + 1, p.x + size, p.y - size, c, 1, -1, 1);
      vert(v + 2, p.x - size, p.y + size, c, -1, 1, 1);
      vert(v + 3, p.x + size, p.y + size, c, 1, 1, 1);
      n++;
    },
    commit() {
      for (const name of ['position', 'aColor', 'aUv', 'aKind']) geo.getAttribute(name).needsUpdate = true;
      geo.setDrawRange(0, n * 6);
    },
  };
}

type BeamBatch = ReturnType<typeof createBeamBatch>;

const scaleRGB = (c: RGB, k: number): RGB => [c[0] * k, c[1] * k, c[2] * k];

/**
 * Per-path setup. 'spectrum': one path per wavelength, each with its own
 * index, so the exit fans out. 'white': a single mid-spectrum path that
 * bends exactly like the prism would but stays white and tight.
 */
const BEAM_PATHS: Record<BeamLight, { ior: number; c: RGB; inner: number; out: number; wb: number }[]> = {
  spectrum: WAVES.map((nm, w) => ({ ior: iorAt(nm), c: WAVE_RGB[w], inner: 1.6, out: 3, wb: 120 })),
  white: [{ ior: iorAt(550), c: [1, 1, 1], inner: 1.2, out: 1.5, wb: 64 }],
};

/**
 * One white beam into a convex prism: a weak surface reflection, then each
 * path bends at entry, may bounce inside (total internal reflection), bends
 * again on exit and leaves — as a spectrum, or as one white beam.
 */
function traceBeam(batch: BeamBatch, poly: P[], origin: P, dir: P, reach: number, light: BeamLight) {
  const white: RGB = [1, 1, 1];
  const entry = hitEdge(poly, origin, dir, -1);
  if (!entry) {
    batch.ribbon(origin, { x: origin.x + dir.x * reach, y: origin.y + dir.y * reach }, 20, 20, white, white);
    return;
  }
  const E = { x: origin.x + dir.x * entry.t, y: origin.y + dir.y * entry.t };
  const nIn = outwardNormal(poly, entry.i);
  batch.ribbon(origin, E, 22, 18, white, scaleRGB(white, 1.15));

  const r = reflect2(dir, nIn);
  batch.ribbon(E, { x: E.x + r.x * reach * 0.5, y: E.y + r.y * reach * 0.5 }, 10, 40, scaleRGB(white, 0.08), [0, 0, 0]);

  let exitFlare: P | null = null;
  const paths = BEAM_PATHS[light];
  paths.forEach(({ ior, c, inner, out: outGain, wb }, w) => {
    let d = refract2(dir, nIn, 1 / ior);
    if (!d) return;
    let cur = E;
    let skip = entry.i;
    for (let bounce = 0; bounce < 4; bounce++) {
      const h = hitEdge(poly, cur, d, skip);
      if (!h) return;
      const X = { x: cur.x + d.x * h.t, y: cur.y + d.y * h.t };
      batch.ribbon(cur, X, 7, 7, scaleRGB(c, inner), scaleRGB(c, inner));
      const nOut = outwardNormal(poly, h.i);
      const out = refract2(d, { x: -nOut.x, y: -nOut.y }, ior);
      if (out) {
        const far = { x: X.x + out.x * reach, y: X.y + out.y * reach };
        batch.ribbon(X, far, 9, wb, scaleRGB(c, outGain), scaleRGB(c, outGain * 0.12));
        if (w === paths.length >> 1) exitFlare = X;
        return;
      }
      d = reflect2(d, nOut);
      cur = X;
      skip = h.i;
    }
  });
  batch.flare(E, 70, [1, 1, 1]);
  if (exitFlare) batch.flare(exitFlare, 46, [0.9, 0.95, 1]);
}

/* ── Textures and geometry ── */

/**
 * Tileable Voronoi normal map: every cell is a flat facet with its own tilt,
 * so the slab body refracts the backdrop like a cut crystal.
 */
function facetNormalMap(size = 256, cells = 22): DataTexture {
  let seed = 7;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const pts = Array.from({ length: cells }, () => {
    const a = rnd() * Math.PI * 2;
    const tilt = 0.12 + rnd() * 0.3;
    const n = new Vector3(Math.cos(a) * tilt, Math.sin(a) * tilt, 1).normalize();
    return { x: rnd() * size, y: rnd() * size, n };
  });
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let best = Infinity;
      let n = pts[0].n;
      for (const p of pts) {
        let dx = Math.abs(x - p.x);
        let dy = Math.abs(y - p.y);
        dx = Math.min(dx, size - dx);
        dy = Math.min(dy, size - dy);
        const d = dx * dx + dy * dy;
        if (d < best) {
          best = d;
          n = p.n;
        }
      }
      const i = (y * size + x) * 4;
      data[i] = (n.x * 0.5 + 0.5) * 255;
      data[i + 1] = (n.y * 0.5 + 0.5) * 255;
      data[i + 2] = (n.z * 0.5 + 0.5) * 255;
      data[i + 3] = 255;
    }
  }
  return pixelTexture(data, size, 300);
}

/**
 * Holographic foil: diagonal thin-film thickness bands with a little grain,
 * read by the iridescence (G channel) so colour shifts as the card tilts.
 */
function holoThicknessMap(size = 256): DataTexture {
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = (x / size) * Math.PI * 2;
      const v = (y / size) * Math.PI * 2;
      const band = 0.5 + 0.5 * Math.sin(u * 2 + v * 3 + Math.sin(u * 3 - v) * 0.8);
      const grain = 0.5 + 0.5 * Math.sin(u * 23 + v * 17) * Math.sin(u * 13 - v * 29);
      const g = clamp(band * 0.85 + grain * 0.15, 0, 1) * 255;
      data.set([g, g, g, 255], (y * size + x) * 4);
    }
  }
  return pixelTexture(data, size, 520);
}

/** Repeating texture for geometry whose uvs are CSS pixels. */
function pixelTexture(data: Uint8Array, size: number, periodPx: number): DataTexture {
  const tex = new DataTexture(data, size, size, RGBAFormat);
  tex.wrapS = tex.wrapT = RepeatWrapping;
  tex.magFilter = LinearFilter;
  tex.minFilter = LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  tex.repeat.set(1 / periodPx, 1 / periodPx);
  tex.needsUpdate = true;
  return tex;
}

/** Rounded-rect slab with a single-step chamfer, centred, in CSS pixels. */
function slabGeometry(w: number, h: number, radius: number): BufferGeometry {
  const b = SLAB_BEVEL;
  const iw = Math.max(2, w - 2 * b);
  const ih = Math.max(2, h - 2 * b);
  const r = clamp(radius - b, 0, Math.min(iw, ih) / 2);
  const x0 = -iw / 2, y0 = -ih / 2, x1 = iw / 2, y1 = ih / 2;
  const s = new Shape();
  s.moveTo(x0 + r, y0);
  s.lineTo(x1 - r, y0);
  s.quadraticCurveTo(x1, y0, x1, y0 + r);
  s.lineTo(x1, y1 - r);
  s.quadraticCurveTo(x1, y1, x1 - r, y1);
  s.lineTo(x0 + r, y1);
  s.quadraticCurveTo(x0, y1, x0, y1 - r);
  s.lineTo(x0, y0 + r);
  s.quadraticCurveTo(x0, y0, x0 + r, y0);
  const g = new ExtrudeGeometry(s, {
    depth: SLAB_DEPTH,
    bevelEnabled: true,
    bevelThickness: b,
    bevelSize: b,
    bevelSegments: 1,
    curveSegments: 6,
  });
  g.translate(0, 0, -SLAB_DEPTH / 2);
  return g;
}

/** Unit triangular prism (circumradius 1 incl. bevel), apex up, centred. */
function prismGeometry(): BufferGeometry {
  const bevel = 0.045;
  const R = 1 - bevel * 2; /* inset so the bevel brings the silhouette to 1 */
  const s = new Shape();
  [90, 210, 330].forEach((deg, i) => {
    const a = (deg * Math.PI) / 180;
    if (i === 0) s.moveTo(Math.cos(a) * R, Math.sin(a) * R);
    else s.lineTo(Math.cos(a) * R, Math.sin(a) * R);
  });
  s.closePath();
  const g = new ExtrudeGeometry(s, {
    depth: 0.9,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 2,
  });
  g.translate(0, 0, -0.45);
  return g;
}

/**
 * Reflection environment: a dark winter sky with a few bright light panels,
 * so facets catch crisp highlights instead of mirroring a bright room.
 */
function crystalEnvironment(): Scene {
  const env = new Scene();
  env.background = new Color().setRGB(0.004, 0.012, 0.024);
  const panel = new PlaneGeometry(1, 1);
  const add = (w: number, h: number, pos: [number, number, number], power: number, tint = [0.85, 0.93, 1]) => {
    const m = new Mesh(panel, new MeshBasicMaterial({ color: new Color(tint[0] * power, tint[1] * power, tint[2] * power), side: DoubleSide }));
    m.scale.set(w, h, 1);
    m.position.set(...pos);
    m.lookAt(0, 0, 0);
    env.add(m);
  };
  add(6, 4, [7, 8, 4], 9); /* key: top right */
  add(10, 0.5, [-6, 4, -6], 3); /* long strips for edge glints */
  add(0.5, 9, [-8, 0, 3], 2.4, [0.7, 0.82, 1]);
  add(8, 0.4, [2, -6, 6], 1.6, [0.6, 0.75, 1]);
  add(3, 3, [0, 2, -9], 1.2, [0.55, 0.7, 0.95]);
  return env;
}

/**
 * Richer surroundings for the mirror crystals, where the environment map
 * itself is the look: a graded winter sky with a bright horizon band, light
 * panels, and one warm accent so reflections read as a real place.
 */
function mirrorEnvironment(): Scene {
  const env = crystalEnvironment();
  env.background = null;
  const sky = new Mesh(
    new SphereGeometry(40, 32, 16),
    new ShaderMaterial({
      side: BackSide,
      depthWrite: false,
      vertexShader: `
        varying vec3 v_dir;
        void main() {
          v_dir = normalize(position);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: `
        varying vec3 v_dir;
        void main() {
          float y = v_dir.y;
          vec3 zenith = vec3(0.10, 0.20, 0.42);
          vec3 horizon = vec3(0.55, 0.72, 0.95);
          vec3 ground = vec3(0.006, 0.012, 0.024);
          vec3 col = y > 0.0 ? mix(horizon, zenith, pow(y, 0.55)) : mix(horizon * 0.35, ground, pow(-y, 0.4));
          col += vec3(0.9, 0.96, 1.0) * exp(-abs(y) * 28.0) * 1.6; /* horizon glow */
          gl_FragColor = vec4(col, 1.0);
        }`,
    }),
  );
  env.add(sky);
  const panel = new PlaneGeometry(1, 1);
  const add = (w: number, h: number, pos: [number, number, number], c: [number, number, number]) => {
    const m = new Mesh(panel, new MeshBasicMaterial({ color: new Color(...c), side: DoubleSide }));
    m.scale.set(w, h, 1);
    m.position.set(...pos);
    m.lookAt(0, 0, 0);
    env.add(m);
  };
  add(1.2, 14, [9, 2, -2], [6, 7, 8]);
  add(1.2, 14, [-9, 2, 2], [4, 5, 6.5]);
  add(9, 1, [0, 9, 0], [5, 6, 7]);
  add(4, 2.5, [-4, 3, 8], [5.5, 3.6, 2.2]); /* warm accent */
  add(2.5, 2.5, [4, -2, -8], [1.2, 2.4, 4.5]);
  return env;
}

type Slab = {
  mesh: Mesh;
  mat: MeshPhysicalMaterial;
  holo: ShaderMaterial | null;
  key: string;
  alpha: number;
};

type AnchorPiece = {
  group: Group;
  /** Per-frame update in the anchor's CSS-pixel frame. */
  update: (t: number, w: number, h: number) => void;
  dispose: () => void;
};

export function startScene(canvas: HTMLCanvasElement): (() => void) | null {
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' });
  } catch {
    return null;
  }
  renderer.toneMapping = NoToneMapping;
  renderer.outputColorSpace = SRGBColorSpace;
  const mobile = matchMedia('(max-width: 768px), (pointer: coarse)').matches;
  const touch = matchMedia('(pointer: coarse)').matches;
  renderer.transmissionResolutionScale = 0.5;

  /* Scroll sync (touch). Phones scroll on the compositor thread, so a fixed
     canvas drawn from JS always shows the page as it was a frame ago, and
     everything pinned to the DOM trails it. Instead the canvas rides the
     page: each frame it's drawn for the current scroll and moved to that
     scroll, and between frames the compositor carries it along with the
     content. OVERSCAN px above and below hide the edges while it drifts. */
  const synced = touch;
  const OVERSCAN = synced ? 140 : 0;
  if (synced) canvas.classList.add('scene-canvas--synced');
  /** Element rect in canvas pixels (viewport rect shifted by the overscan). */
  const rectOf = (el: Element) => {
    const r = el.getBoundingClientRect();
    return { left: r.left, top: r.top + OVERSCAN, width: r.width, height: r.height, bottom: r.bottom + OVERSCAN };
  };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const pmrem = new PMREMGenerator(renderer);
  const bake = (envScene: Scene) => {
    const tex = pmrem.fromScene(envScene, 0.02).texture;
    envScene.traverse((o) => {
      if (o instanceof Mesh) {
        o.geometry.dispose();
        o.material.dispose();
      }
    });
    return tex;
  };
  const envTex = bake(crystalEnvironment());
  const mirrorEnvTex = bake(mirrorEnvironment());

  const world = new Scene();
  world.environment = envTex;
  const cardScene = new Scene();
  cardScene.environment = envTex;

  const camera = new PerspectiveCamera(35, 1, 0.1, 160);
  world.add(camera);

  /* Key light rides with the camera so it always comes from the top right. */
  const sunColor = new Color().setRGB(0.88, 0.94, 1, SRGBColorSpace);
  const sun = new DirectionalLight(sunColor, 2.4);
  sun.position.set(5, 7, 2);
  sun.target.position.set(0, 0, -CARD_DIST);
  camera.add(sun, sun.target);
  /* The card pass has its own copy, placed from the camera every frame. */
  const cardSun = new DirectionalLight(sunColor, 2.4);
  cardScene.add(cardSun, cardSun.target);

  const quad = new PlaneGeometry(2, 2);
  const fullscreen = (mat: ShaderMaterial) => {
    const m = new Mesh(quad, mat);
    m.frustumCulled = false;
    m.renderOrder = -1000;
    return m;
  };

  /* Render targets: beams (half res), the world image (MSAA). */
  const rtBeams = new WebGLRenderTarget(2, 2, { type: HalfFloatType, depthBuffer: false });
  const rtWorld = new WebGLRenderTarget(2, 2, { type: HalfFloatType, samples: mobile ? 0 : 4 });

  /* ── 1 · beams ── */
  const beamScene = new Scene();
  const beamCam = new OrthographicCamera(0, 1, 0, 1, -1, 1);
  const beams = createBeamBatch();
  const beamMat = new ShaderMaterial({
    vertexShader: BEAM_VERT,
    fragmentShader: BEAM_FRAG,
    transparent: true,
    blending: AdditiveBlending,
    depthTest: false,
    depthWrite: false,
    side: DoubleSide,
  });
  const beamMesh = new Mesh(beams.geo, beamMat);
  beamMesh.frustumCulled = false;
  beamScene.add(beamMesh);

  /* ── 2 · world ── */
  const bgMat = new ShaderMaterial({
    vertexShader: FULLSCREEN_VERT,
    fragmentShader: WORLD_BG_FRAG,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      u_res: { value: new Vector2() },
      u_dpr: { value: 1 },
      u_view: { value: new Vector2() },
      u_time: { value: 0 },
      u_mouse: { value: new Vector2() },
      u_scroll: { value: 0 },
      u_soft: { value: 0 },
      u_beams: { value: rtBeams.texture },
    },
  });
  world.add(fullscreen(bgMat));

  const octGeo = new OctahedronGeometry(1.3, 0);
  const edgeGeo = new EdgesGeometry(octGeo);
  const octMat = new MeshPhysicalMaterial({
    color: new Color().setRGB(0.86, 0.93, 1, SRGBColorSpace),
    metalness: 0,
    roughness: 0.04,
    transmission: 1,
    thickness: 1.6,
    ior: 1.62,
    /* Dispersion samples the scene three times per pixel; across ~50
       crystals that's too much for a phone GPU. Phones keep it on the
       prism only. */
    dispersion: mobile ? 0 : 9,
    iridescence: 0.35,
    iridescenceIOR: 1.35,
    attenuationColor: new Color().setRGB(0.78, 0.88, 0.98, SRGBColorSpace),
    attenuationDistance: 6,
    specularIntensity: 0.8,
    envMapIntensity: 0.7,
    flatShading: true,
    transparent: true,
  });
  const edgeMat = new LineBasicMaterial({
    color: new Color().setRGB(0.8, 0.89, 0.97, SRGBColorSpace),
    transparent: true,
    blending: AdditiveBlending,
    depthWrite: false,
  });
  const rimMat = new ShaderMaterial({
    vertexShader: RIM_VERT,
    fragmentShader: RIM_FRAG,
    uniforms: { u_fade: { value: 1 } },
    transparent: true,
    blending: AdditiveBlending,
    depthWrite: false,
  });
  /* Polished mirror crystals: opaque, so the card slabs refract them too.
     They get the rich environment map on their own material. */
  const mirrorMat = new MeshPhysicalMaterial({
    color: new Color().setRGB(0.86, 0.92, 1, SRGBColorSpace),
    metalness: 1,
    roughness: 0.04,
    iridescence: 0.45,
    iridescenceIOR: 1.5,
    iridescenceThicknessRange: [200, 600],
    envMap: mirrorEnvTex,
    envMapIntensity: 1.25,
    flatShading: true,
  });
  /* Two in the hero cluster, then every fourth crystal down the corridor. */
  const isMirror = (i: number) => i === 1 || i === 4 || (i >= HERO_REL.length && (i - HERO_REL.length) % 4 === 1);

  const cubes = buildCubes().map((c, i) => {
    const mat = (isMirror(i) ? mirrorMat : octMat).clone();
    const lineMat = edgeMat.clone();
    const rim = rimMat.clone();
    const mesh = new Mesh(octGeo, mat);
    mesh.add(new LineSegments(edgeGeo, lineMat), new Mesh(octGeo, rim));
    mesh.rotation.order = 'ZYX';
    world.add(mesh);
    return { c, mesh, mat, lineMat, rim };
  });

  /* Anchored pieces: prisms and the glass fractal. */
  const prismGeo = prismGeometry();
  const prismEdges = new EdgesGeometry(prismGeo, 30);
  const prismMat = new MeshPhysicalMaterial({
    color: new Color().setRGB(0.82, 0.86, 0.92, SRGBColorSpace),
    metalness: 0,
    roughness: 0.03,
    transmission: 1,
    thickness: 0.7,
    ior: 1.5,
    dispersion: 10,
    attenuationColor: new Color().setRGB(0.45, 0.52, 0.62, SRGBColorSpace),
    attenuationDistance: 1.6,
    specularIntensity: 1,
    envMapIntensity: 1.3,
  });
  const prismEdgeMat = new LineBasicMaterial({
    color: new Color().setRGB(0.75, 0.82, 0.9, SRGBColorSpace),
    transparent: true,
    opacity: 0.35,
    blending: AdditiveBlending,
    depthWrite: false,
  });

  const makePrism = (a: SceneAnchorEntry): AnchorPiece => {
    const group = new Group();
    group.matrixAutoUpdate = false;
    const mesh = new Mesh(prismGeo, prismMat);
    mesh.add(new LineSegments(prismEdges, prismEdgeMat));
    group.add(mesh);
    return {
      group,
      update(t, w, h) {
        const R = Math.min(w, h) / 2;
        const r = rectOf(a.el);
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        /* Steering: the pointer on desktop, the prism's own scroll position
           on touch. Only the in-plane roll re-aims the light (the beam is
           traced in the screen plane), so that is where the motion goes:
           ±16° sweeps the spectrum across the page, and at the extremes
           some colours hit total internal reflection and bounce out of
           another face. The 3D tilt stays small so the silhouette keeps
           matching the traced triangle. */
        const sx = touch ? 0 : mouseX;
        const sy = touch ? clamp((cy - cssH / 2) / cssH, -0.5, 0.5) : mouseY;
        const roll = (a.rotation * Math.PI) / 180 + Math.sin(t * 0.35) * 0.03 + sx * 0.55 + sy * (touch ? 0.5 : 0.18);
        mesh.scale.setScalar(R);
        mesh.rotation.set(
          Math.sin(t * 0.5) * 0.04 + sy * 0.1,
          Math.sin(t * 0.3) * 0.06 + sx * 0.16,
          -roll,
        );
        /* Same triangle in screen px (y down) for the tracer. */
        const poly = [90, 210, 330].map((deg) => {
          const ang = (deg * Math.PI) / 180;
          const x = Math.cos(ang) * R, y = -Math.sin(ang) * R;
          return {
            x: cx + x * Math.cos(roll) - y * Math.sin(roll),
            y: cy + x * Math.sin(roll) + y * Math.cos(roll),
          };
        });
        const ba = (a.beamAngle * Math.PI) / 180;
        const dir = { x: Math.cos(ba), y: Math.sin(ba) };
        /* Aim at the centroid's height so the beam meets the near face. */
        const aim = { x: cx, y: cy };
        const back = (aim.x + 400) / Math.max(dir.x, 0.2);
        const origin = { x: aim.x - dir.x * back, y: aim.y - dir.y * back };
        traceBeam(beams, poly, origin, dir, Math.max(cssW, cssH) * 1.6, a.light);
      },
      dispose() {},
    };
  };

  const tetraGeo = new TetrahedronGeometry(1, 0);
  tetraGeo.applyQuaternion(new Quaternion().setFromUnitVectors(new Vector3(1, 1, 1).normalize(), new Vector3(0, 1, 0)));
  const tetraEdges = new EdgesGeometry(tetraGeo);
  const tetraMat = new MeshPhysicalMaterial({
    color: new Color().setRGB(0.9, 0.94, 1, SRGBColorSpace),
    metalness: 0,
    roughness: 0.1,
    transmission: 1,
    thickness: 1.1,
    ior: 1.45,
    dispersion: 6,
    attenuationColor: new Color().setRGB(0.75, 0.85, 0.96, SRGBColorSpace),
    attenuationDistance: 4,
    specularIntensity: 1,
    envMapIntensity: 1.2,
    flatShading: true,
  });
  const orbMat = new MeshPhysicalMaterial({
    color: new Color().setRGB(0.03, 0.035, 0.045, SRGBColorSpace),
    metalness: 0.1,
    roughness: 0.22,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    iridescence: 0.8,
    iridescenceIOR: 1.6,
    iridescenceThicknessRange: [180, 520],
    envMapIntensity: 1.4,
  });
  /* Cold fresnel rim baked into the orb's own shading (not a transparent
     shell), so it survives being refracted by the tetrahedron around it. */
  orbMat.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <emissivemap_fragment>',
      `#include <emissivemap_fragment>
      float orbFres = pow(1.0 - abs(dot(normal, normalize(vViewPosition))), 2.4);
      totalEmissiveRadiance += vec3(0.22, 0.48, 0.95) * orbFres * 1.3;`,
    );
  };

  const makeFractal = (): AnchorPiece => {
    const group = new Group();
    group.matrixAutoUpdate = false;
    const tetra = new Mesh(tetraGeo, tetraMat);
    const tetraRim = rimMat.clone();
    tetraRim.uniforms.u_fade.value = 0.75;
    tetra.add(new LineSegments(tetraEdges, prismEdgeMat), new Mesh(tetraGeo, tetraRim));
    /* Welded so displaced vertices keep smooth shared normals. */
    const ico = new IcosahedronGeometry(1, 18);
    ico.deleteAttribute('uv');
    ico.deleteAttribute('normal');
    const orbGeo = mergeVertices(ico);
    ico.dispose();
    orbGeo.computeVertexNormals();
    const base = (orbGeo.getAttribute('position').array as Float32Array).slice();
    const orb = new Mesh(orbGeo, orbMat);
    group.add(tetra, orb);
    return {
      group,
      update(t, w, h) {
        const R = Math.min(w, h) / 2;
        tetra.scale.setScalar(R);
        /* Tipped towards the viewer so three faces read, slowly turning. */
        tetra.rotation.set(0.42 + Math.sin(t * 0.3) * 0.1, t * 0.25, Math.sin(t * 0.2) * 0.08);
        /* Liquid orb: layered sine waves pushed along each vertex normal,
           kept inside the tetrahedron's insphere (radius R / 3). */
        orb.scale.setScalar(R * 0.25);
        const p = orbGeo.getAttribute('position');
        const arr = p.array as Float32Array;
        for (let i = 0; i < arr.length; i += 3) {
          const x = base[i], y = base[i + 1], z = base[i + 2];
          const d =
            1 +
            0.11 * Math.sin(x * 3.1 + t * 1.3) * Math.sin(y * 2.7 - t * 1.1) +
            0.07 * Math.sin(z * 4.3 + t * 1.7 + x * 2.0) +
            0.04 * Math.sin((x + y + z) * 6.0 - t * 2.2);
          arr[i] = x * d;
          arr[i + 1] = y * d;
          arr[i + 2] = z * d;
        }
        p.needsUpdate = true;
        orbGeo.computeVertexNormals();
      },
      dispose() {
        orbGeo.dispose();
        tetraRim.dispose();
      },
    };
  };

  const pieces = new Map<SceneAnchorEntry, AnchorPiece>();
  const dropPiece = (a: SceneAnchorEntry, piece: AnchorPiece) => {
    world.remove(piece.group);
    piece.dispose();
    pieces.delete(a);
  };

  /* ── 3 · cards ── */
  const worldQuadMat = new ShaderMaterial({
    vertexShader: FULLSCREEN_VERT,
    fragmentShader: WORLD_QUAD_FRAG,
    depthTest: false,
    depthWrite: false,
    uniforms: { tWorld: { value: rtWorld.texture } },
  });
  cardScene.add(fullscreen(worldQuadMat));

  const facets = facetNormalMap();
  const holoBands = holoThicknessMap();
  const slabMats: Record<CardMaterial, MeshPhysicalMaterial> = {
    crystal: new MeshPhysicalMaterial({
      color: new Color().setRGB(0.92, 0.96, 1, SRGBColorSpace),
      metalness: 0,
      roughness: 0.07,
      transmission: 1,
      /* CSS-pixel units: the slab is tiny in world space, so the optical
         thickness is exaggerated to make the facets visibly bend the world. */
      thickness: 420,
      ior: 1.55,
      dispersion: 8,
      iridescence: 0.22,
      iridescenceIOR: 1.3,
      attenuationColor: new Color().setRGB(0.7, 0.82, 0.94, SRGBColorSpace),
      attenuationDistance: 240,
      specularIntensity: 1,
      normalMap: facets,
      normalScale: new Vector2(0.45, 0.45),
    }),
    holo: new MeshPhysicalMaterial({
      color: new Color().setRGB(0.95, 0.97, 1, SRGBColorSpace),
      metalness: 0,
      roughness: 0.1,
      transmission: 1,
      thickness: 300,
      ior: 1.5,
      dispersion: 10,
      iridescence: 1,
      iridescenceIOR: 1.9,
      iridescenceThicknessRange: [220, 1100],
      iridescenceThicknessMap: holoBands,
      specularIntensity: 1,
      envMapIntensity: 1.6,
      normalMap: facets,
      normalScale: new Vector2(0.9, 0.9),
    }),
  };
  const cardGroup = new Group();
  cardGroup.matrixAutoUpdate = false;
  cardScene.add(cardGroup);
  const slabs = new Map<CrystalCard, Slab>();

  const holoMat = new ShaderMaterial({
    vertexShader: HOLO_VERT,
    fragmentShader: HOLO_FRAG,
    transparent: true,
    blending: AdditiveBlending,
    depthWrite: false,
    uniforms: { uFacets: { value: facets }, uTime: { value: 0 }, uAlpha: { value: 1 }, uShift: { value: 0 } },
  });

  const dropSlab = (card: CrystalCard, s: Slab) => {
    cardGroup.remove(s.mesh);
    s.mesh.geometry.dispose();
    s.mat.dispose();
    s.holo?.dispose();
    slabs.delete(card);
  };

  /* Adaptive resolution: drops a notch if frames run long. */
  let quality = mobile ? 0.8 : 1;
  /* Never adapt below this: on phones a lower floor reads as pixelation. */
  const qualityFloor = mobile ? 0.75 : 0.5;
  let cssW = 1, cssH = 1;
  let sized = '';
  const buf = new Vector2();
  /* Only reallocates when the canvas really changes size. The canvas is
     100lvh tall, so a phone's URL bar showing/hiding doesn't resize it. */
  const resize = () => {
    const w = Math.max(1, canvas.clientWidth);
    const h = Math.max(1, canvas.clientHeight);
    const key = `${w}x${h}x${quality}`;
    if (key === sized) return;
    sized = key;
    cssW = w;
    cssH = h;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5) * quality);
    renderer.setSize(cssW, cssH, false);
    renderer.getDrawingBufferSize(buf);
    const ww = buf.x, wh = buf.y;
    rtWorld.setSize(ww, wh);
    rtBeams.setSize(Math.max(1, buf.x >> 1), Math.max(1, buf.y >> 1));
    camera.aspect = cssW / cssH;
    beamCam.right = cssW;
    beamCam.bottom = cssH;
    beamCam.updateProjectionMatrix();
    bgMat.uniforms.u_res.value.set(ww, wh);
    bgMat.uniforms.u_dpr.value = ww / cssW;
    bgMat.uniforms.u_view.value.set(cssW, cssH);
    window.__scene = { quality, width: buf.x, height: buf.y };
  };
  resize();

  /* Scroll → camera progress, against the page height minus the stable
     canvas height (not innerHeight, which jumps with a phone's URL bar). */
  let maxScroll = 1;
  const measure = () => {
    maxScroll = Math.max(1, document.documentElement.scrollHeight - (cssH - 2 * OVERSCAN));
  };
  measure();
  const ro = new ResizeObserver(measure);
  ro.observe(document.body);

  let mouseX = 0, mouseY = 0, tMouseX = 0, tMouseY = 0;
  let px = innerWidth * 0.72, py = innerHeight * 0.28, tpx = px, tpy = py;
  const onPointer = (e: PointerEvent) => {
    tMouseX = e.clientX / innerWidth - 0.5;
    tMouseY = e.clientY / innerHeight - 0.5;
    tpx = e.clientX;
    tpy = e.clientY + OVERSCAN;
    request();
  };
  addEventListener('pointermove', onPointer, { passive: true });

  let raf = 0;
  const t0 = performance.now();
  let last = t0, slow = 0, frames = 0;
  let prog01 = clamp(window.scrollY / maxScroll, 0, 1);
  let vel = 0;
  const v = new Vector3();
  const local = new Matrix4();
  const noRot = new Quaternion();
  const sc = new Vector3();

  /** Pins `obj` in front of the camera so 1 unit = 1 CSS px at `dist`. */
  const pinToScreen = (obj: Group, fov: number, dist: number, x: number, y: number) => {
    const s = (2 * dist * Math.tan(fov / 2)) / cssH;
    local.compose(v.set(x * s, y * s, -dist), noRot, sc.setScalar(s));
    obj.matrix.multiplyMatrices(camera.matrixWorld, local);
    obj.matrixWorldNeedsUpdate = true;
  };

  const render = (now: number) => {
    const dtMs = now - last;
    const dt = Math.min(dtMs / 1000, 0.05);
    last = now;
    const t = reduced ? 0 : (now - t0) / 1000;

    if (!reduced && dtMs < 200) {
      slow += dtMs;
      if (++frames === 45) {
        if (slow / frames > 24 && quality > qualityFloor) {
          quality = Math.max(qualityFloor, quality * 0.85);
          resize();
        }
        slow = 0;
        frames = 0;
      }
    }

    /* One scroll read per frame: this frame is drawn for it, and (touch)
       the canvas is moved to it, so DOM rects read below line up. */
    const sy = window.scrollY;
    if (synced) canvas.style.transform = `translate3d(0, ${sy - OVERSCAN}px, 0)`;

    /* Camera follows the scroll with inertia; velocity drives a lens "kick". */
    const target = clamp(sy / maxScroll, 0, 1);
    const prev = prog01;
    /* Inertia: soft on desktop; tight on touch, where a fling already
       carries momentum and extra easing reads as lag. */
    prog01 += (target - prog01) * (reduced ? 1 : 1 - Math.exp(-dt * (touch ? 9 : 3.2)));
    vel += (((prog01 - prev) / Math.max(dt, 0.001)) - vel) * 0.1;
    mouseX += (tMouseX - mouseX) * 0.05;
    mouseY += (tMouseY - mouseY) * 0.05;
    px += (tpx - px) * 0.08;
    py += (tpy - py) * 0.08;

    const p = prog01;
    /* Lens kick from scroll speed; gentle on touch, where a fling would
       otherwise snap the zoom. */
    const fov = clamp(0.62 + vel * (touch ? 0.5 : 2.2), 0.5, 0.95);
    camera.position.set(
      Math.sin(p * 9.0) * 2.2 + mouseX * 1.2,
      Math.sin(p * 6.0) * 1.0 - mouseY * 0.8,
      START_Z - p * TRAVEL,
    );
    camera.rotation.set(
      Math.sin(p * 5.0) * 0.06 + mouseY * 0.05,
      Math.sin(p * 7.0) * 0.22 + mouseX * 0.1,
      Math.sin(p * 11.0) * 0.05,
      'YXZ',
    );
    camera.fov = (fov * 180) / Math.PI;
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();

    const bu = bgMat.uniforms;
    bu.u_time.value = reduced ? 42 : t + 42;
    bu.u_mouse.value.set(px, py);
    bu.u_scroll.value = sy;

    for (const { c, mesh, mat, lineMat, rim } of cubes) {
      let x = c.o[0], y = c.o[1], z = c.o[2];
      if (c.pivot) {
        const a = t * 0.22;
        const rx = x - c.pivot[0], rz = z - c.pivot[2];
        x = c.pivot[0] + rx * Math.cos(a) + rz * Math.sin(a);
        z = c.pivot[2] - rx * Math.sin(a) + rz * Math.cos(a);
        y += Math.sin(t * 0.5 + c.ph) * 0.12;
      }

      /* Depth in view space: skip what's behind/too close, fade with distance. */
      const depth = -v.set(x, y, z).applyMatrix4(camera.matrixWorldInverse).z;
      /* Far ones fade early: perspective bunches them towards the centre,
         behind the copy; they appear as the camera flies in. */
      const fade = depth < 1.2 ? 0 : smooth(1.2, 5.0, depth) * (1 - smooth(18, 30, depth));
      mesh.visible = fade >= 0.01;
      if (!mesh.visible) continue;

      mesh.position.set(x, y, z);
      mesh.rotation.set(c.ph * 0.7, t * c.sp + c.ph, 0.615);
      mesh.scale.setScalar(c.s);
      /* Mirrors stay opaque once settled so they reach the card refraction. */
      if (mat.transmission === 0) mat.transparent = fade < 0.99;
      mat.opacity = fade;
      lineMat.opacity = 0.16 * fade;
      rim.uniforms.u_fade.value = fade;
    }

    /* Anchored pieces (and their traced beams). */
    beams.reset();
    const liveAnchors = getAnchors();
    for (const [a, piece] of pieces) if (!liveAnchors.has(a)) dropPiece(a, piece);
    for (const a of liveAnchors) {
      let piece = pieces.get(a);
      if (!piece) {
        piece = a.kind === 'prism' ? makePrism(a) : makeFractal();
        world.add(piece.group);
        pieces.set(a, piece);
      }
      const r = rectOf(a.el);
      /* Prisms stay live a screen away: their beams reach across the page. */
      const margin = a.kind === 'prism' ? cssH : 120;
      const live = r.width > 2 && r.height > 2 && r.bottom > -margin && r.top < cssH + margin;
      piece.group.visible = live;
      if (!live) continue;
      pinToScreen(piece.group, fov, ANCHOR_DIST, r.left + r.width / 2 - cssW / 2, cssH / 2 - (r.top + r.height / 2));
      piece.update(t, r.width, r.height);
    }
    beams.commit();

    /* Slabs: one CSS pixel at CARD_DIST, so DOM rects map 1:1. */
    pinToScreen(cardGroup, fov, CARD_DIST, 0, 0);
    /* The slabs never tilt (perspective would slide a wide card's edges off
       its DOM box); the key light follows the pointer instead, so chamfer
       glints still travel as the mouse moves. */
    const lx = touch ? 0 : (px / cssW - 0.5) * 9;
    const ly = touch ? 0 : (0.5 - py / cssH) * 7;
    cardSun.position.copy(camera.localToWorld(v.set(5 + lx, 7 + ly, 2)));
    cardSun.target.position.copy(camera.localToWorld(v.set(0, 0, -CARD_DIST)));
    cardSun.target.updateMatrixWorld();
    const liveCards = getCards();
    for (const [card, s] of slabs) if (!liveCards.has(card)) dropSlab(card, s);
    for (const card of liveCards) {
      let s = slabs.get(card);
      if (!s) {
        const mat = slabMats[card.material].clone();
        const mesh = new Mesh(new BufferGeometry(), mat);
        const holo = card.material === 'holo' ? holoMat.clone() : null;
        if (holo) mesh.add(new Mesh(mesh.geometry, holo));
        cardGroup.add(mesh);
        s = { mesh, mat, holo, key: '', alpha: card.on };
        slabs.set(card, s);
      }
      s.alpha += (card.on - s.alpha) * (reduced ? 1 : 1 - Math.exp(-dt * 6));
      const r = rectOf(card.el);
      const onScreen = r.width > 2 && r.height > 2 && r.bottom > -80 && r.top < cssH + 80;
      s.mesh.visible = onScreen && s.alpha > 0.01;
      if (!s.mesh.visible) continue;

      const key = `${Math.round(r.width)}x${Math.round(r.height)}x${card.radius}`;
      if (key !== s.key) {
        s.mesh.geometry.dispose();
        s.mesh.geometry = slabGeometry(Math.round(r.width), Math.round(r.height), card.radius);
        for (const child of s.mesh.children) (child as Mesh).geometry = s.mesh.geometry;
        s.key = key;
      }
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      if (s.holo) {
        s.holo.uniforms.uTime.value = t;
        s.holo.uniforms.uAlpha.value = s.alpha;
        /* Foil slides with scroll position, plus the pointer on desktop. */
        const pointer = touch ? 0 : ((px - cx) / cssW + (py - cy) / cssH) * 0.8;
        s.holo.uniforms.uShift.value = (cy - cssH / 2) / cssH + pointer;
      }
      s.mesh.position.set(cx - cssW / 2, cssH / 2 - cy, 0);
      /* Opaque when settled; blended only while fading. */
      s.mat.transparent = s.alpha < 0.995;
      s.mat.opacity = s.alpha;
    }

    renderer.setRenderTarget(rtBeams);
    renderer.render(beamScene, beamCam);
    renderer.setRenderTarget(rtWorld);
    renderer.render(world, camera);
    renderer.setRenderTarget(null);
    renderer.render(cardScene, camera);
  };

  const loop = (now: number) => {
    render(now);
    raf = requestAnimationFrame(loop);
  };

  /* Reduced motion: no loop; redraw only when the page moves. */
  let pending = false;
  function request() {
    if (!reduced || pending) return;
    pending = true;
    requestAnimationFrame((now) => {
      pending = false;
      render(now);
    });
  }
  const onResize = () => {
    resize();
    measure();
    request();
  };
  addEventListener('resize', onResize);
  addEventListener('scroll', request, { passive: true });

  if (reduced) request();
  else raf = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    removeEventListener('resize', onResize);
    removeEventListener('scroll', request);
    removeEventListener('pointermove', onPointer);
    for (const [card, s] of slabs) dropSlab(card, s);
    for (const [a, piece] of pieces) dropPiece(a, piece);
    for (const { mat, lineMat, rim } of cubes) {
      mat.dispose();
      lineMat.dispose();
      rim.dispose();
    }
    [octGeo, edgeGeo, quad, prismGeo, prismEdges, tetraGeo, tetraEdges, beams.geo].forEach((g) => g.dispose());
    [
      octMat, mirrorMat, edgeMat, rimMat, prismMat, prismEdgeMat, tetraMat, orbMat,
      slabMats.crystal, slabMats.holo, holoMat, bgMat, beamMat, worldQuadMat,
    ].forEach((m) => m.dispose());
    ([facets, holoBands, envTex, mirrorEnvTex] as Texture[]).forEach((tx) => tx.dispose());
    pmrem.dispose();
    rtWorld.dispose();
    rtBeams.dispose();
    /* No forceContextLoss: StrictMode remounts on the same canvas. */
    renderer.dispose();
    canvas.classList.remove('scene-canvas--synced');
    canvas.style.transform = '';
  };
}
