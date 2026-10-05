import { useEffect, useRef } from 'react';

/**
 * Page backdrop — one cheap WebGL pass (no fbm): cold gradient with drifting
 * light, diagonal light shafts, fine salt flecks that glint under a light sweep
 * and the pointer, and three depth layers of soft snow. Resolution adapts if
 * frames run long. Cards are glass via `@developer-hub/liquid-glass`.
 */

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const SCENE_FRAG = `
precision highp float;

uniform vec2  u_res;
uniform float u_dpr;
uniform vec2  u_view;
uniform float u_time;
uniform vec2  u_mouse;
uniform float u_scroll;
uniform float u_soft;    /* 1 = pre-blurred pass: no fine grain/glints */

float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}

float flake(vec2 p, float cell, float speed, float rmin, float rmax, float soft, float seed, float t) {
  vec2 q = vec2(p.x, p.y - t * speed) / cell;
  q.x += sin(t * 0.25 + q.y * 1.9 + seed) * 0.12;
  vec2 id = floor(q);
  vec2 f = fract(q);
  float h = hash21(id + seed);
  vec2 c = 0.22 + 0.56 * hash22(id + seed + 4.1);
  c.x += 0.08 * sin(t * (0.4 + h) + h * 20.0);
  float r = mix(rmin, rmax, hash21(id + seed + 2.2)) / cell;
  float d = length(f - c);
  float s = 1.0 - smoothstep(r * (1.0 - soft), r, d);
  return s * step(0.42, h) * (0.45 + 0.55 * hash21(id + seed + 9.0));
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, u_res.y - gl_FragCoord.y) / u_dpr;
  float t = u_time;
  vec2 uv = p / u_view;
  float asp = u_view.x / u_view.y;
  float fine = 1.0 - u_soft;

  /* — Cold gradient with drifting light — */
  /* Original palette: #02070b → #07131f → #183148 → #3e6380 → #6d9dc5 */
  vec3 c0 = vec3(0.008, 0.027, 0.043);
  vec3 c1 = vec3(0.027, 0.075, 0.122);
  vec3 c2 = vec3(0.094, 0.192, 0.282);
  vec3 c3 = vec3(0.160, 0.275, 0.372);
  vec3 c4 = vec3(0.290, 0.450, 0.600);
  float g = clamp(uv.x * 0.86 + uv.y * 0.12 - 0.02, 0.0, 1.0);
  vec3 col = mix(c0, c1, smoothstep(0.00, 0.32, g));
  col = mix(col, c2, smoothstep(0.32, 0.58, g));
  col = mix(col, c3, smoothstep(0.58, 0.82, g));
  col = mix(col, c4, smoothstep(0.82, 1.00, g));

  vec2 la = vec2(0.84 + 0.05 * sin(t * 0.31), 0.30 + 0.07 * cos(t * 0.23));
  float d1 = length((uv - la) * vec2(asp, 1.0));
  col += vec3(0.50, 0.68, 0.88) * exp(-d1 * d1 * 3.2) * 0.20;

  vec2 lb = vec2(0.28 + 0.10 * sin(t * 0.17 + 1.0), 0.78 + 0.07 * cos(t * 0.21));
  float d2 = length((uv - lb) * vec2(asp, 1.0));
  col += vec3(0.20, 0.34, 0.56) * exp(-d2 * d2 * 5.0) * 0.10;

  vec2 dk = (uv - vec2(0.04, 0.10)) * vec2(asp, 1.0);
  col *= 1.0 - 0.6 * exp(-dot(dk, dk) * 2.2);

  /* — Diagonal light shafts: broad bands the glass visibly bends — */
  vec2 su = vec2(uv.x * asp, uv.y + u_scroll * 0.00018);
  float sh1 = pow(0.5 + 0.5 * sin(dot(su, vec2(1.0, -0.62)) * 7.0 + t * 0.16 + sin(su.x * 2.6 + t * 0.1) * 1.4), 7.0);
  float sh2 = pow(0.5 + 0.5 * sin(dot(su, vec2(1.0, -0.62)) * 13.0 - t * 0.11 + 2.0 + sin(su.y * 3.1) * 1.1), 9.0);
  float shMask = smoothstep(0.1, 0.9, uv.x) * 0.8 + 0.2;
  col += vec3(0.55, 0.72, 0.92) * (sh1 * 0.060 + sh2 * 0.040) * shMask;

  /* — Light that makes the salt glint — */
  float sweep = 0.5 + 0.5 * sin(dot(uv, vec2(2.4, 1.3)) * 3.14 - t * 0.55 + sin(uv.y * 3.0 + t * 0.2) * 1.2);
  vec2 dm = p - u_mouse;
  float spot = exp(-dot(dm, dm) / (2.0 * 190.0 * 190.0));
  float lit = 0.26 + 0.60 * sweep * sweep + spot * 0.95 + exp(-d1 * d1 * 2.5) * 0.40;
  vec2 par = (u_mouse / u_view - 0.5);

  /* — Fine salt flecks + glints (sharp pass only) — */
  if (fine > 0.5) {
    vec2 fp = p + vec2(-t * 2.2, t * 3.6) + vec2(0.0, u_scroll * 0.16) + par * 6.0;
    float CELL = 5.0;
    vec2 q = fp / CELL;
    vec2 id = floor(q);
    vec2 f = fract(q) * CELL;
    float h = hash21(id);
    vec2 c = 1.4 + hash22(id + 7.3) * (CELL - 2.8);
    float ang = hash21(id + 3.7) * 6.2832;
    vec2 dir = vec2(cos(ang), sin(ang));
    float len = 0.5 + hash21(id + 9.1) * 1.3;
    vec2 pa = f - c;
    float dist = length(pa - dir * clamp(dot(pa, dir), -len, len));
    float w = 0.30 + 0.22 * hash21(id + 1.9);
    float fl = (1.0 - smoothstep(w, w + 0.55 / u_dpr + 0.2, dist)) * step(0.56, h);
    float amp = hash21(id + 5.5);
    amp = 0.22 + 0.78 * amp * amp;
    float tw = 0.7 + 0.3 * sin(t * (0.5 + amp * 1.8) + h * 60.0);
    float fv = fl * amp * tw * lit;
    col += (1.0 - col) * mix(vec3(0.50, 0.63, 0.78), vec3(0.95, 0.98, 1.0), amp) * fv * 0.40;

    vec2 q2 = (p + vec2(0.0, u_scroll * 0.22) + par * 12.0) / 13.0;
    vec2 id2 = floor(q2);
    float h2 = hash21(id2 + 21.7);
    vec2 c2p = 0.2 + 0.6 * hash22(id2 + 5.1);
    float d3 = length((fract(q2) - c2p) * 13.0);
    float tw2 = pow(max(0.0, sin(t * (0.35 + h2 * 0.7) + h2 * 40.0)), 14.0);
    col += vec3(0.85, 0.93, 1.0) * step(0.9, h2) * tw2 * exp(-d3 * d3 * 1.4) * (0.5 + lit) * 0.55;
  }

  /* — Snow: far (sharp pass only), mid, near bokeh — */
  vec2 sp = p + par * 10.0;
  float s = 0.0;
  s += flake(sp + vec2(0.0, u_scroll * 0.10), 52.0, 7.0, 0.8, 1.7, 0.6, 3.0, t) * 0.45 * fine;
  s += flake(sp + par * 12.0 + vec2(0.0, u_scroll * 0.26), 98.0, 15.0, 1.5, 3.4, 0.85, 17.0, t) * 0.55;
  s += flake(sp + par * 30.0 + vec2(0.0, u_scroll * 0.52), 210.0, 30.0, 5.0, 11.0, 1.0, 41.0, t) * 0.20;
  col += vec3(0.84, 0.92, 1.0) * s * (0.55 + 0.45 * lit);

  vec2 vu = (uv - 0.5) * vec2(asp, 1.0);
  col *= clamp(1.0 - 0.38 * dot(vu * 0.8, vu * 0.8), 0.3, 1.0);
  col += (hash21(gl_FragCoord.xy + t) - 0.5) / 255.0;
  gl_FragColor = vec4(col, 1.0);
}
`;

function start(canvas: HTMLCanvasElement): (() => void) | null {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' });
  if (!gl) return null;

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type);
    if (!s) return null;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error('[Background]', gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  };
  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, SCENE_FRAG);
  if (!vs || !fs) return null;

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.bindAttribLocation(prog, 0, 'a_pos');
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const U = (n: string) => gl.getUniformLocation(prog, n);
  const uRes = U('u_res'), uDpr = U('u_dpr'), uView = U('u_view'), uTime = U('u_time');
  const uMouse = U('u_mouse'), uScroll = U('u_scroll'), uSoft = U('u_soft');
  gl.uniform1f(uSoft, 0);

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Adaptive resolution: drops a notch if frames run long. */
  let quality = 1;
  const resize = () => {
    const pr = Math.min(devicePixelRatio || 1, 1.5) * quality;
    canvas.width = Math.max(2, Math.floor(innerWidth * pr));
    canvas.height = Math.max(2, Math.floor(innerHeight * pr));
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  resize();

  let mx = innerWidth * 0.72, my = innerHeight * 0.28, tx = mx, ty = my;
  const onPointer = (e: PointerEvent) => {
    tx = e.clientX;
    ty = e.clientY;
    request();
  };
  addEventListener('pointermove', onPointer, { passive: true });

  let raf = 0;
  const t0 = performance.now();
  let last = t0, slow = 0, frames = 0;

  const render = (now: number) => {
    const dt = now - last;
    last = now;
    if (!reduced && dt < 200) {
      slow += dt;
      if (++frames === 45) {
        if (slow / frames > 24 && quality > 0.55) {
          quality *= 0.85;
          resize();
        }
        slow = 0;
        frames = 0;
      }
    }

    mx += (tx - mx) * 0.08;
    my += (ty - my) * 0.08;

    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uDpr, canvas.width / innerWidth);
    gl.uniform2f(uView, innerWidth, innerHeight);
    gl.uniform1f(uTime, reduced ? 42 : (now - t0) / 1000 + 42);
    gl.uniform2f(uMouse, mx, my);
    gl.uniform1f(uScroll, window.scrollY);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const loop = (now: number) => {
    render(now);
    raf = requestAnimationFrame(loop);
  };

  /* Reduced motion: static scene, redrawn only when something moves. */
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
    request();
  };
  addEventListener('resize', onResize);
  addEventListener('scroll', request, { passive: true });

  if (reduced) request();
  else raf = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(raf);
    removeEventListener('resize', onResize);
    removeEventListener('scroll', request);
    removeEventListener('pointermove', onPointer);
  };
}

export function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const stop = start(canvas);
    if (!stop) {
      canvas.style.display = 'none';
      return;
    }
    return stop;
  }, []);

  return (
    <>
      {/* CSS fallback gradient — covered by the canvas when WebGL works */}
      <div className="bg-gradient" aria-hidden="true" />
      <canvas ref={canvasRef} className="bg-canvas" aria-hidden="true" />
    </>
  );
}
