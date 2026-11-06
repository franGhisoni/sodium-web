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
 */
export function CrystalScene() {
  const worldRef = useRef<HTMLCanvasElement>(null);
  const pinnedRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const worldCanvas = worldRef.current;
    const pinnedCanvas = pinnedRef.current;
    if (!worldCanvas || !pinnedCanvas) return;
    const hide = () => {
      worldCanvas.style.display = 'none';
      pinnedCanvas.style.display = 'none';
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

    /* three.js loads in its own chunk so the page paints first. */
    const stops: Array<() => void> = [];
    let cancelled = false;
    import('./crystalScene').then(({ startScene }) => {
      if (cancelled) return;
      const world = startScene(worldCanvas, split ? 'world' : 'all');
      if (!world) {
        hide();
        return;
      }
      stops.push(world);
      if (split) {
        const pinned = startScene(pinnedCanvas, 'pinned');
        if (pinned) stops.push(pinned);
        else pinnedCanvas.style.display = 'none';
      }
    });
    return () => {
      cancelled = true;
      stops.forEach((stop) => stop());
    };
  }, []);

  return (
    <div className="scene-wrap" aria-hidden="true">
      <canvas ref={worldRef} className="scene-canvas" />
      <canvas ref={pinnedRef} className="scene-canvas" />
    </div>
  );
}
