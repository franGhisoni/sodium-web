import { useEffect, useRef } from 'react';

/**
 * The WebGL scene behind the whole page. The camera travels through the
 * crystal field as you scroll (dolly, yaw sway, pitch, roll, lens kick), and
 * every card above it is a crystal slab the light rays pass through.
 *
 * Desktop draws everything on one fixed canvas. Touch devices scroll on the
 * compositor thread, so anything placed from JS on a fixed canvas trails the
 * page by a frame; there the scene splits in two (see crystalScene.ts):
 * the backdrop stays on the fixed canvas, and the pieces tied to the DOM
 * (prisms, beams, fractal, card slabs) go on a transparent canvas that
 * rides the page, so the compositor moves them together with their cards.
 *
 * The scene is decoration, so it never competes with the content: it starts
 * after the page has loaded and painted, it is skipped where WebGL runs on
 * the CPU (no GPU: crawlers, Lighthouse/PageSpeed, some VMs and old
 * laptops), and it switches itself off if frames come out too slowly. In
 * all those cases the CSS gradient (.bg-gradient) stays as the backdrop.
 */

/** Renderer names of CPU (software) WebGL implementations. */
const SOFTWARE_GL = /swiftshader|llvmpipe|softpipe|software|basic render|mesa offscreen/i;

/** True when WebGL is available and backed by a real GPU. */
function hasHardwareWebGL(): boolean {
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
function afterLoadAndIdle(fn: () => void): () => void {
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

export function CrystalScene() {
  const worldRef = useRef<HTMLCanvasElement>(null);
  const pinnedRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const worldCanvas = worldRef.current;
    const pinnedCanvas = pinnedRef.current;
    if (!worldCanvas || !pinnedCanvas) return;
    const root = document.documentElement;
    const hide = () => {
      worldCanvas.style.display = 'none';
      pinnedCanvas.style.display = 'none';
      root.classList.remove('scene-on');
    };
    /* `?nogl`: same page without the scene, to compare on a device. */
    const params = new URLSearchParams(location.search);
    if (params.has('nogl')) {
      hide();
      return;
    }
    /* `?nosplit`: the single-canvas desktop pipeline on a touch device. */
    const split = matchMedia('(pointer: coarse)').matches && !params.has('nosplit');
    if (!split) pinnedCanvas.style.display = 'none';

    const stops: Array<() => void> = [];
    let cancelled = false;
    const stopAll = () => {
      stops.splice(0).forEach((stop) => stop());
    };
    /* Too slow to be worth it on this device: drop it, keep the CSS backdrop. */
    const onSlow = () => {
      stopAll();
      hide();
    };

    const cancelWait = afterLoadAndIdle(() => {
      /* `?gl` forces the scene on (to test software renderers on purpose). */
      if (!params.has('gl') && !hasHardwareWebGL()) {
        hide();
        return;
      }
      /* three.js loads in its own chunk, only once the page is ready. */
      import('./crystalScene').then(({ startScene }) => {
        if (cancelled) return;
        const world = startScene(worldCanvas, split ? 'world' : 'all', onSlow);
        if (!world) {
          hide();
          return;
        }
        stops.push(world);
        if (split) {
          const pinned = startScene(pinnedCanvas, 'pinned', onSlow);
          if (pinned) stops.push(pinned);
          else pinnedCanvas.style.display = 'none';
        }
        /* Fade the canvas in over the CSS backdrop once it has drawn. */
        requestAnimationFrame(() => requestAnimationFrame(() => {
          if (!cancelled && stops.length) root.classList.add('scene-on');
        }));
      }, hide);
    });
    return () => {
      cancelled = true;
      cancelWait();
      stopAll();
    };
  }, []);

  return (
    <div className="scene-wrap" aria-hidden="true">
      <canvas ref={worldRef} className="scene-canvas" />
      <canvas ref={pinnedRef} className="scene-canvas" />
    </div>
  );
}
