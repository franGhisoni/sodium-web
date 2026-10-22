import { useEffect, useRef } from 'react';

/**
 * One fixed canvas behind the whole page. The camera travels through the
 * crystal field as you scroll (dolly, yaw sway, pitch, roll, lens kick), and
 * every card above it is a crystal slab the light rays pass through.
 */
export function CrystalScene() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    /* Phones get the plain page (CSS backdrop and cards): the live scene made
       scrolling jumpy and the backdrop flash black. `?gl` forces it on, and
       `?nogl` forces it off, to compare on a device. */
    const params = new URLSearchParams(location.search);
    const mobile = matchMedia('(max-width: 768px), (pointer: coarse)').matches;
    const root = document.documentElement;
    if (params.has('nogl')) {
      canvas.style.display = 'none';
      root.classList.add('no-scene');
      return;
    }
    if (mobile && !params.has('gl')) {
      root.classList.add('no-scene', 'lite-scene');
      let stopLite: (() => void) | null = null;
      let gone = false;
      import('./liteScene').then(({ startLiteScene }) => {
        if (gone) return;
        stopLite = startLiteScene(canvas);
        if (!stopLite) canvas.style.display = 'none';
      });
      return () => {
        gone = true;
        stopLite?.();
      };
    }
    /* three.js loads in its own chunk so the page paints first. */
    let stop: (() => void) | null = null;
    let cancelled = false;
    import('./crystalScene').then(({ startScene }) => {
      if (cancelled) return;
      stop = startScene(canvas);
      if (!stop) {
        canvas.style.display = 'none';
        root.classList.add('no-scene');
      }
    });
    return () => {
      cancelled = true;
      stop?.();
    };
  }, []);

  return (
    <div className="scene-wrap" aria-hidden="true">
      <canvas ref={ref} className="scene-canvas" />
    </div>
  );
}
