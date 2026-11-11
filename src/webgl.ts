/**
 * Shared guards for the decorative WebGL pieces (the page scene and the hero
 * crystal): they only start after the page has loaded, and never where WebGL
 * runs on the CPU (crawlers, Lighthouse/PageSpeed, machines without a GPU).
 */

/** Renderer names of CPU (software) WebGL implementations. */
const SOFTWARE_GL = /swiftshader|llvmpipe|softpipe|software|basic render|mesa offscreen/i;

/** True when WebGL is available and backed by a real GPU. */
export function hasHardwareWebGL(): boolean {
  try {
    const probe = document.createElement('canvas');
    const gl = (probe.getContext('webgl2') ?? probe.getContext('webgl')) as WebGLRenderingContext | null;
    if (!gl) return false;
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    const name = String(
      info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER),
    );
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return !SOFTWARE_GL.test(name);
  } catch {
    return false;
  }
}

/** Runs `fn` once the page has loaded and the browser is idle. */
export function afterLoadAndIdle(fn: () => void): () => void {
  let cancelled = false;
  let idle = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const run = () => {
    if (cancelled) return;
    if ('requestIdleCallback' in window) idle = requestIdleCallback(() => !cancelled && fn(), { timeout: 2500 });
    else timer = setTimeout(() => !cancelled && fn(), 300);
  };
  if (document.readyState === 'complete') run();
  else addEventListener('load', run, { once: true });
  return () => {
    cancelled = true;
    removeEventListener('load', run);
    if (idle) cancelIdleCallback(idle);
    if (timer) clearTimeout(timer);
  };
}
