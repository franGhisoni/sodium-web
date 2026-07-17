import { useEffect, useRef } from 'react';

/**
 * Background system — WebGL shader in the spirit of the NodoSur oil field,
 * but cold: a domain-warped fbm "frost" field over the winter-night gradient,
 * three parallax layers of falling snow/salt, and rare crystalline glints.
 *
 * Mouse moves the field slightly (lerped), scroll drifts the snow.
 * If WebGL is unavailable the CSS gradient fallback stays visible.
 */

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_mouse;
uniform float u_scroll;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.87, -0.48, 0.48, 0.87);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = rot * p * 2.0 + vec2(1.7, 4.1);
    a *= 0.5;
  }
  return v;
}

/* One layer of falling flakes on a hashed grid. */
float snow(vec2 uv, float scale, float fall, float drift, float size, float t) {
  uv *= scale;
  uv.y += t * fall;
  uv.x += t * drift + sin(t * 0.22 + uv.y * 0.35) * 0.4;
  vec2 id = floor(uv);
  vec2 f  = fract(uv);
  float h = hash(id);
  vec2 p = vec2(hash(id + 3.1), hash(id + 7.7));
  p = 0.15 + 0.7 * p;
  p += 0.10 * vec2(sin(t * (0.6 + h) + h * 6.28), cos(t * (0.5 + h) + h * 6.28));
  float d = length(f - p);
  float m = smoothstep(size * (0.5 + h), 0.0, d);
  m *= 0.55 + 0.45 * sin(t * (0.8 + h * 1.6) + h * 40.0);
  return m;
}

/* Rare diamond glints — crystals catching light. */
float sparkle(vec2 uv, float t) {
  vec2 id = floor(uv);
  vec2 f  = fract(uv) - 0.5;
  float h = hash(id + 11.7);
  vec2 p = vec2(hash(id + 1.3), hash(id + 2.6)) - 0.5;
  vec2 q = f - p * 0.7;
  float tw = pow(max(0.0, sin(t * (0.25 + h * 0.6) + h * 6.28)), 10.0);
  float star = pow(max(0.0, 1.0 - (abs(q.x) + abs(q.y)) * 9.0), 4.0);
  return star * tw * step(0.82, h);
}

void main() {
  vec2 st = gl_FragCoord.xy / u_res;               /* 0..1, y up */
  float aspect = u_res.x / u_res.y;
  vec2 uv = (st - 0.5) * vec2(aspect, 1.0);
  vec2 par = (u_mouse - 0.5) * 0.12;
  float scr = u_scroll * 0.00028;

  /* — Base: winter-night gradient (matches the CSS fallback) — */
  vec3 cDeep  = vec3(0.008, 0.027, 0.043);
  vec3 cMid   = vec3(0.094, 0.192, 0.282);
  vec3 cLight = vec3(0.427, 0.616, 0.773);

  float g = clamp(st.x * 0.9 + (1.0 - st.y) * 0.18 - 0.12, 0.0, 1.0);
  vec3 col = mix(cDeep, cMid, smoothstep(0.10, 0.72, g));
  col = mix(col, cLight, smoothstep(0.62, 1.05, g) * 0.85);

  /* Icy bloom top-right (the "moon" of the composition) */
  float dGlow = distance(st * vec2(aspect, 1.0), vec2(1.06 * aspect, 0.68));
  col += vec3(0.505, 0.682, 0.823) * exp(-dGlow * dGlow * 3.4) * 0.55;

  /* Darkness pooling top-left */
  float dDark = distance(st, vec2(0.06, 0.92));
  col *= 1.0 - 0.5 * exp(-dDark * dDark * 2.6);

  /* — Frost field: slow domain-warped fbm, cold shimmer — */
  float t = u_time;
  vec2 fuv = uv + par + vec2(0.0, scr * 0.5);
  vec2 q = vec2(
    fbm(fuv * 1.2 + vec2(t * 0.7, -t * 0.5)),
    fbm(fuv * 1.2 + vec2(5.2, 1.3) - t * 0.8)
  );
  float f = fbm(fuv * 1.5 + 2.6 * q);

  float phase = fract(f * 0.9 + q.x * 0.4 + t * 0.05);
  vec3 icePale = vec3(0.62, 0.76, 0.88);
  vec3 iceBlue = vec3(0.32, 0.52, 0.72);
  vec3 iceWhite = vec3(0.88, 0.94, 1.00);
  vec3 frost = mix(iceBlue, icePale, smoothstep(0.15, 0.6, phase));
  frost = mix(frost, iceWhite, smoothstep(0.6, 0.95, phase));

  float intensity = smoothstep(0.32, 0.95, f);
  col += frost * intensity * 0.16;
  col += iceWhite * smoothstep(0.78, 0.99, f) * 0.10;

  /* — Snow: three parallax layers (far → near) — */
  vec2 suv = uv + vec2(0.0, scr);
  float s = 0.0;
  s += snow(suv + par * 0.4, 14.0, 0.30, -0.05, 0.055, t) * 0.30;
  s += snow(suv + par * 0.9, 8.0, 0.52, -0.10, 0.075, t + 31.0) * 0.50;
  s += snow(suv + par * 1.6, 4.5, 0.85, -0.16, 0.095, t + 77.0) * 0.85;
  col += vec3(0.82, 0.90, 0.98) * s;

  /* — Crystalline glints — */
  float sp = sparkle((uv + par) * 9.0 + vec2(0.0, scr * 6.0), t);
  col += vec3(0.95, 0.98, 1.0) * sp * 0.85;

  /* — Vignette + dither — */
  float vig = 1.0 - 0.42 * dot(uv * 0.8, uv * 0.8);
  col *= clamp(vig, 0.3, 1.0);
  col += (hash(gl_FragCoord.xy) - 0.5) / 255.0;

  gl_FragColor = vec4(col, 1.0);
}
`;

function startShader(canvas: HTMLCanvasElement): (() => void) | null {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
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
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, 'u_res');
  const uTime = gl.getUniformLocation(prog, 'u_time');
  const uMouse = gl.getUniformLocation(prog, 'u_mouse');
  const uScroll = gl.getUniformLocation(prog, 'u_scroll');

  const RENDER_SCALE = 0.6;
  const resize = () => {
    canvas.width = Math.floor(innerWidth * devicePixelRatio * RENDER_SCALE);
    canvas.height = Math.floor(innerHeight * devicePixelRatio * RENDER_SCALE);
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  resize();
  addEventListener('resize', resize);

  let mx = 0.5, my = 0.5, tx = 0.5, ty = 0.5;
  const onPointer = (e: PointerEvent) => {
    tx = e.clientX / innerWidth;
    ty = 1.0 - e.clientY / innerHeight;
  };
  addEventListener('pointermove', onPointer);

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let raf = 0;
  const start = performance.now();
  const SPEED = 0.05;

  const frame = (now: number) => {
    mx += (tx - mx) * 0.03;
    my += (ty - my) * 0.03;
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, reduced ? 0 : ((now - start) / 1000) * SPEED + 40.0);
    gl.uniform2f(uMouse, mx, my);
    gl.uniform1f(uScroll, window.scrollY);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (!reduced) raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    removeEventListener('resize', resize);
    removeEventListener('pointermove', onPointer);
  };
}

export function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const stop = startShader(canvas);
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
      <div className="bg-noise" aria-hidden="true" />
      <div className="bg-vignette" aria-hidden="true" />
    </>
  );
}
