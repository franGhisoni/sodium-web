import { useEffect, useRef } from 'react';

/**
 * 3D salt-crystal field — raw WebGL, no dependencies.
 *
 * Sodium chloride crystallises in cubes (halite), so the scene is a field of
 * translucent cubes: additive fresnel-lit faces plus glowing wireframe edges
 * read as ice/salt crystal. A hero cluster sits beside the headline; more
 * cubes are scattered along a corridor the camera flies through on scroll.
 */

const VERT = `
attribute vec3 a_pos;
attribute vec3 a_nrm;
uniform mat4 u_proj;
uniform mat4 u_view;
uniform mat4 u_model;
varying vec3 v_nrm;
varying vec3 v_wpos;
void main() {
  vec4 w = u_model * vec4(a_pos, 1.0);
  v_wpos = w.xyz;
  v_nrm = mat3(u_model) * a_nrm;
  gl_Position = u_proj * u_view * w;
}
`;

const FRAG = `
precision highp float;
uniform vec3  u_eye;
uniform float u_fade;   /* distance fade, per cube */
uniform float u_edge;   /* 0 = face pass, 1 = wireframe pass */
varying vec3 v_nrm;
varying vec3 v_wpos;
void main() {
  if (u_edge > 0.5) {
    gl_FragColor = vec4(0.80, 0.89, 0.97, 0.16 * u_fade);
    return;
  }
  vec3 n = normalize(v_nrm);
  vec3 v = normalize(u_eye - v_wpos);
  float fres = pow(1.0 - abs(dot(n, v)), 2.2);
  vec3 ice = vec3(0.55, 0.70, 0.85);
  float facet = 0.5 + 0.5 * dot(n, normalize(vec3(0.45, 0.8, 0.5)));
  vec3 col = ice * (0.06 + fres * 0.9)
           + vec3(0.92, 0.97, 1.0) * pow(fres, 3.0) * 0.75
           + ice * facet * 0.07;
  gl_FragColor = vec4(col * 1.15, (0.07 + fres * 0.85) * u_fade);
}
`;

/* ── minimal column-major mat4 helpers ── */
type M4 = Float32Array;
const m4 = (): M4 => new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);

function mul(out: M4, a: M4, b: M4): M4 {
  const r = new Float32Array(16);
  for (let c = 0; c < 4; c++) {
    for (let ro = 0; ro < 4; ro++) {
      r[c * 4 + ro] =
        a[ro] * b[c * 4] + a[4 + ro] * b[c * 4 + 1] + a[8 + ro] * b[c * 4 + 2] + a[12 + ro] * b[c * 4 + 3];
    }
  }
  out.set(r);
  return out;
}

function perspective(out: M4, fovy: number, aspect: number, near: number, far: number): M4 {
  const f = 1 / Math.tan(fovy / 2);
  out.fill(0);
  out[0] = f / aspect;
  out[5] = f;
  out[10] = (far + near) / (near - far);
  out[11] = -1;
  out[14] = (2 * far * near) / (near - far);
  return out;
}

function rotX(a: number): M4 {
  const c = Math.cos(a), s = Math.sin(a);
  return new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]);
}
function rotY(a: number): M4 {
  const c = Math.cos(a), s = Math.sin(a);
  return new Float32Array([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]);
}
function rotZ(a: number): M4 {
  const c = Math.cos(a), s = Math.sin(a);
  return new Float32Array([c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
}
function trs(t: [number, number, number], s: number): M4 {
  return new Float32Array([s, 0, 0, 0, 0, s, 0, 0, 0, 0, s, 0, t[0], t[1], t[2], 1]);
}

/* ── cube geometry: 24 verts (pos+nrm interleaved), tris + edge lines ── */
function cubeGeometry() {
  const faces: Array<[number[], number[]]> = [
    [[0, 0, 1], [-1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1]],
    [[0, 0, -1], [1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, -1]],
    [[1, 0, 0], [1, -1, 1, 1, -1, -1, 1, 1, -1, 1, 1, 1]],
    [[-1, 0, 0], [-1, -1, -1, -1, -1, 1, -1, 1, 1, -1, 1, -1]],
    [[0, 1, 0], [-1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, -1]],
    [[0, -1, 0], [-1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1]],
  ];
  const verts: number[] = [];
  const tris: number[] = [];
  faces.forEach(([n, p], fi) => {
    for (let v = 0; v < 4; v++) {
      verts.push(p[v * 3], p[v * 3 + 1], p[v * 3 + 2], n[0], n[1], n[2]);
    }
    const b = fi * 4;
    tris.push(b, b + 1, b + 2, b, b + 2, b + 3);
  });
  const lines: number[] = [];
  faces.forEach((_, fi) => {
    const b = fi * 4;
    lines.push(b, b + 1, b + 1, b + 2, b + 2, b + 3, b + 3, b);
  });
  return { verts: new Float32Array(verts), tris: new Uint16Array(tris), lines: new Uint16Array(lines) };
}

type Cube = {
  o: [number, number, number];
  s: number;
  ph: number;
  sp: number;
  /** Cubes with a pivot orbit around it (the hero cluster). */
  pivot?: [number, number, number];
};

/* Hero cluster: where it sits on first load (right of the copy). */
const HERO_PIVOT: [number, number, number] = [3.6, 0, 0];
const HERO_REL: Array<Omit<Cube, 'pivot'>> = [
  { o: [0, 0, 0], s: 1.2, ph: 0.0, sp: 0.10 },
  { o: [2.5, 1.6, -1.0], s: 0.5, ph: 1.7, sp: 0.16 },
  { o: [-2.2, -1.8, 0.9], s: 0.58, ph: 3.9, sp: 0.13 },
  { o: [-2.5, 1.7, -0.6], s: 0.36, ph: 2.6, sp: 0.20 },
  { o: [2.0, -2.2, 0.5], s: 0.4, ph: 5.1, sp: 0.18 },
  { o: [0.3, 2.9, 1.0], s: 0.26, ph: 0.8, sp: 0.24 },
  { o: [3.0, -0.2, 1.1], s: 0.22, ph: 4.4, sp: 0.21 },
  { o: [-3.0, -0.1, -1.1], s: 0.24, ph: 2.1, sp: 0.19 },
];

/* The camera flies this far down -z over the whole page. */
const TRAVEL = 100;
const START_Z = 12;

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
    const z = -7 - k * 2.0 - rnd() * 1.4;
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

function startScene(canvas: HTMLCanvasElement): (() => void) | null {
  const gl = canvas.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: false });
  if (!gl) return null;

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type);
    if (!s) return null;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error('[Crystal]', gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  };
  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const geo = cubeGeometry();
  const vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, geo.verts, gl.STATIC_DRAW);
  const iboTris = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboTris);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geo.tris, gl.STATIC_DRAW);
  const iboLines = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboLines);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geo.lines, gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  const aPos = gl.getAttribLocation(prog, 'a_pos');
  const aNrm = gl.getAttribLocation(prog, 'a_nrm');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 24, 0);
  gl.enableVertexAttribArray(aNrm);
  gl.vertexAttribPointer(aNrm, 3, gl.FLOAT, false, 24, 12);

  const uProj = gl.getUniformLocation(prog, 'u_proj');
  const uView = gl.getUniformLocation(prog, 'u_view');
  const uModel = gl.getUniformLocation(prog, 'u_model');
  const uEye = gl.getUniformLocation(prog, 'u_eye');
  const uEdge = gl.getUniformLocation(prog, 'u_edge');
  const uFade = gl.getUniformLocation(prog, 'u_fade');

  gl.disable(gl.DEPTH_TEST);
  gl.disable(gl.CULL_FACE);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
  gl.clearColor(0, 0, 0, 0);

  const cubes = buildCubes();
  const proj = m4();
  let aspect = 1;
  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.max(2, Math.floor(innerWidth * dpr));
    canvas.height = Math.max(2, Math.floor(innerHeight * dpr));
    aspect = canvas.width / canvas.height;
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  resize();

  /* Scroll → camera progress, measured against the live page height. */
  let maxScroll = 1;
  const measure = () => {
    maxScroll = Math.max(1, document.documentElement.scrollHeight - innerHeight);
  };
  measure();
  const ro = new ResizeObserver(measure);
  ro.observe(document.body);

  let mouseX = 0, mouseY = 0, tMouseX = 0, tMouseY = 0;
  const onPointer = (e: PointerEvent) => {
    tMouseX = e.clientX / innerWidth - 0.5;
    tMouseY = e.clientY / innerHeight - 0.5;
    request();
  };
  addEventListener('pointermove', onPointer, { passive: true });

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const view = m4();
  const eye = new Float32Array(3);
  let raf = 0;
  const t0 = performance.now();
  let last = t0;
  let prog01 = clamp(window.scrollY / maxScroll, 0, 1);
  let vel = 0;

  const render = (now: number) => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const t = reduced ? 0 : (now - t0) / 1000;

    /* Camera follows the scroll with inertia; velocity drives a lens "kick". */
    const target = clamp(window.scrollY / maxScroll, 0, 1);
    const prev = prog01;
    prog01 += (target - prog01) * (reduced ? 1 : 1 - Math.exp(-dt * 3.2));
    vel += (((prog01 - prev) / Math.max(dt, 0.001)) - vel) * 0.1;
    mouseX += (tMouseX - mouseX) * 0.05;
    mouseY += (tMouseY - mouseY) * 0.05;

    const p = prog01;
    const ex = Math.sin(p * 9.0) * 2.2 + mouseX * 1.2;
    const ey = Math.sin(p * 6.0) * 1.0 - mouseY * 0.8;
    const ez = START_Z - p * TRAVEL;
    const yaw = Math.sin(p * 7.0) * 0.22 + mouseX * 0.1;
    const pitch = Math.sin(p * 5.0) * 0.06 + mouseY * 0.05;
    const roll = Math.sin(p * 11.0) * 0.05;
    const fov = clamp(0.62 + vel * 2.2, 0.5, 0.95);

    eye[0] = ex;
    eye[1] = ey;
    eye[2] = ez;
    mul(view, rotZ(-roll), mul(m4(), rotX(-pitch), mul(m4(), rotY(-yaw), trs([-ex, -ey, -ez], 1))));
    perspective(proj, fov, aspect, 0.1, 160);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniformMatrix4fv(uProj, false, proj);
    gl.uniformMatrix4fv(uView, false, view);
    gl.uniform3fv(uEye, eye);

    for (const c of cubes) {
      let x = c.o[0], y = c.o[1], z = c.o[2];
      if (c.pivot) {
        const a = t * 0.22;
        const rx = x - c.pivot[0], rz = z - c.pivot[2];
        x = c.pivot[0] + rx * Math.cos(a) + rz * Math.sin(a);
        z = c.pivot[2] - rx * Math.sin(a) + rz * Math.cos(a);
        y += Math.sin(t * 0.5 + c.ph) * 0.12;
      }

      /* Depth in view space: skip what's behind/too close, fade with distance. */
      const depth = -(view[2] * x + view[6] * y + view[10] * z + view[14]);
      if (depth < 1.2) continue;
      const fade = smooth(1.2, 5.0, depth) * (1 - smooth(34, 62, depth));
      if (fade < 0.01) continue;

      let local = mul(m4(), rotY(t * c.sp + c.ph), rotX(c.ph * 0.7));
      local = mul(local, rotZ(0.615), local); /* rest on a corner, like real halite */
      local = mul(local, trs([x, y, z], c.s), local);
      gl.uniformMatrix4fv(uModel, false, local);
      gl.uniform1f(uFade, fade);

      gl.uniform1f(uEdge, 0);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboTris);
      gl.drawElements(gl.TRIANGLES, geo.tris.length, gl.UNSIGNED_SHORT, 0);

      gl.uniform1f(uEdge, 1);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboLines);
      gl.drawElements(gl.LINES, geo.lines.length, gl.UNSIGNED_SHORT, 0);
    }
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
  };
}

/**
 * One fixed canvas behind the whole page. The camera travels through the
 * crystal field as you scroll (dolly, yaw sway, pitch, roll, lens kick), so
 * the glass cards above it always have something to bend.
 */
export function CrystalScene() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const stop = startScene(canvas);
    if (!stop) {
      canvas.style.display = 'none';
      return;
    }
    return stop;
  }, []);

  return <canvas ref={ref} className="scene-canvas" aria-hidden="true" />;
}
