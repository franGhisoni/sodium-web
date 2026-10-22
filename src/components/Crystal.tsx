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
    /* `?nogl`: same page without the scene, to compare on a device. */
    if (new URLSearchParams(location.search).has('nogl')) {
      canvas.style.display = 'none';
      return;
    }
    /* three.js loads in its own chunk so the page paints first. */
    let stop: (() => void) | null = null;
    let cancelled = false;
    import('./crystalScene').then(({ startScene }) => {
      if (cancelled) return;
      stop = startScene(canvas);
      if (!stop) canvas.style.display = 'none';
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
