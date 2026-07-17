import { useEffect, useRef } from 'react';

/**
 * 3D salt-crystal cluster — raw WebGL, no dependencies.
 *
 * Sodium chloride crystallises in cubes (halite), so the hero centrepiece is
 * a slowly rotating cluster of translucent cubes: additive fresnel-lit faces
 * plus glowing wireframe edges read as ice/salt crystal. The whole cluster
 * tilts gently toward the pointer.
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
precision mediump float;
uniform vec3  u_eye;
uniform float u_edge;   /* 0 = face pass, 1 = wireframe pass */
varying vec3 v_nrm;
varying vec3 v_wpos;
void main() {
  if (u_edge > 0.5) {
    gl_FragColor = vec4(0.80, 0.89, 0.97, 0.34);
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
  gl_FragColor = vec4(col, 0.05 + fres * 0.8);
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

/* The cluster: one mother crystal + satellites (offset, scale, spin phase) */
const CLUSTER: Array<{ o: [number, number, number]; s: number; ph: number; sp: number }> = [
  { o: [0, 0, 0], s: 1.0, ph: 0.0, sp: 0.10 },
  { o: [1.15, 0.72, -0.25], s: 0.42, ph: 1.7, sp: 0.16 },
  { o: [-0.95, -0.80, 0.35], s: 0.50, ph: 3.9, sp: 0.13 },
  { o: [-1.05, 0.85, -0.15], s: 0.30, ph: 2.6, sp: 0.20 },
  { o: [0.85, -1.0, 0.15], s: 0.34, ph: 5.1, sp: 0.18 },
  { o: [0.15, 1.25, 0.45], s: 0.22, ph: 0.8, sp: 0.24 },
];

function startCrystal(canvas: HTMLCanvasElement): (() => void) | null {
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

  gl.disable(gl.DEPTH_TEST);
  gl.disable(gl.CULL_FACE);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
  gl.clearColor(0, 0, 0, 0);

  const proj = m4();
  const EYE: [number, number, number] = [0, 0, 7.2];
  const view = m4();
  view[14] = -EYE[2];

  const resize = () => {
    const dpr = Math.min(devicePixelRatio, 2);
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    perspective(proj, 0.62, canvas.width / canvas.height, 0.1, 40);
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  let tiltX = 0, tiltY = 0, targetX = 0, targetY = 0;
  const onPointer = (e: PointerEvent) => {
    targetY = (e.clientX / innerWidth - 0.5) * 0.7;
    targetX = (e.clientY / innerHeight - 0.5) * 0.5;
  };
  addEventListener('pointermove', onPointer);

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let raf = 0;
  const start = performance.now();

  const frame = (now: number) => {
    const t = reduced ? 0 : (now - start) / 1000;
    tiltX += (targetX - tiltX) * 0.04;
    tiltY += (targetY - tiltY) * 0.04;

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniformMatrix4fv(uProj, false, proj);
    gl.uniformMatrix4fv(uView, false, view);
    gl.uniform3fv(uEye, EYE);

    const bob = Math.sin(t * 0.5) * 0.12;
    let global = mul(m4(), rotX(0.42 + tiltX + Math.sin(t * 0.33) * 0.05), rotY(t * 0.22 + tiltY));
    global = mul(global, trs([0, bob, 0], 1), global);

    for (const c of CLUSTER) {
      let local = mul(m4(), rotY(t * c.sp + c.ph), rotX(c.ph * 0.7));
      local = mul(local, rotZ(0.615), local); /* rest on a corner, like real halite */
      local = mul(local, trs(c.o, c.s), local);
      const model = mul(m4(), global, local);
      gl.uniformMatrix4fv(uModel, false, model);

      gl.uniform1f(uEdge, 0);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboTris);
      gl.drawElements(gl.TRIANGLES, geo.tris.length, gl.UNSIGNED_SHORT, 0);

      gl.uniform1f(uEdge, 1);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboLines);
      gl.drawElements(gl.LINES, geo.lines.length, gl.UNSIGNED_SHORT, 0);
    }

    if (!reduced) raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    removeEventListener('pointermove', onPointer);
  };
}

export function Crystal({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const stop = startCrystal(canvas);
    if (!stop) {
      canvas.style.display = 'none';
      return;
    }
    return stop;
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
