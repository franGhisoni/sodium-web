import { useEffect, useRef } from 'react';
import { registerAnchor, type AnchorKind } from '../crystalCards';

/**
 * An empty, layout-only box where the WebGL scene pins a 3D piece: a glass
 * prism that splits a traced light beam into a spectrum, or the glass
 * fractal. Hide it with CSS (display: none) to drop the piece.
 */
interface SceneAnchorProps {
  kind: AnchorKind;
  className?: string;
  rotation?: number;
  beamAngle?: number;
}

export function SceneAnchor({ kind, className, rotation = 0, beamAngle = 0 }: SceneAnchorProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return registerAnchor({ el, kind, rotation, beamAngle });
  }, [kind, rotation, beamAngle]);

  return <div ref={ref} className={['scene-anchor', className].filter(Boolean).join(' ')} aria-hidden="true" />;
}
