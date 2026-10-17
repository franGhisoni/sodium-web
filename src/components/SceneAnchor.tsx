import { useEffect, useRef } from 'react';
import { registerAnchor, type AnchorKind, type BeamLight } from '../crystalCards';

/**
 * An empty, layout-only box where the WebGL scene pins a 3D piece: a glass
 * prism that bends a traced light beam (into a spectrum, or kept white), or
 * the glass fractal. Hide it with CSS (display: none) to drop the piece.
 */
interface SceneAnchorProps {
  kind: AnchorKind;
  className?: string;
  rotation?: number;
  beamAngle?: number;
  light?: BeamLight;
}

export function SceneAnchor({ kind, className, rotation = 0, beamAngle = 0, light = 'spectrum' }: SceneAnchorProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return registerAnchor({ el, kind, rotation, beamAngle, light });
  }, [kind, rotation, beamAngle, light]);

  return <div ref={ref} className={['scene-anchor', className].filter(Boolean).join(' ')} aria-hidden="true" />;
}
