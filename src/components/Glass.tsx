import { useEffect, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { registerCard, type CardMaterial, type CrystalCard } from '../crystalCards';

/**
 * Project-wide crystal card.
 *
 * The DOM keeps the content (accessible, selectable text); the WebGL scene
 * draws a refractive, dispersive crystal slab exactly behind it, tracked from
 * the element's live rect. Markup mirrors the old liquid-glass structure
 * (`.glass > .glass__warp + content`) so existing layout CSS keeps working.
 */
interface GlassProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  padding?: string;
  cornerRadius?: number;
  onClick?: () => void;
  variant?: 'default' | 'soft' | 'strong';
  /** Whether the crystal slab is shown (eased in/out by the scene). */
  crystal?: boolean;
  /** 'holo': thin-film iridescent foil instead of clear crystal. */
  material?: CardMaterial;
}

const RADIUS = { soft: 18, default: 22, strong: 28 } as const;

export function Glass({
  children,
  className,
  style,
  padding,
  cornerRadius,
  onClick,
  variant = 'default',
  crystal = true,
  material = 'crystal',
}: GlassProps) {
  const ref = useRef<HTMLDivElement>(null);
  const card = useRef<CrystalCard | null>(null);
  const radius = cornerRadius ?? RADIUS[variant];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const c: CrystalCard = { el, radius, material, on: crystal ? 1 : 0 };
    card.current = c;
    return registerCard(c);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [radius, material]);

  useEffect(() => {
    if (card.current) card.current.on = crystal ? 1 : 0;
  }, [crystal]);

  return (
    <div style={{ display: 'flex' }}>
      <div
        className={['glass-wrap', `glass-wrap--${variant}`, `glass-wrap--${material}`, className].filter(Boolean).join(' ')}
        style={{ ...style, borderRadius: radius }}
        onClick={onClick}
      >
        <div ref={ref} className="glass" style={{ borderRadius: radius, padding }}>
          <span className="glass__warp" aria-hidden="true" />
          <div className="glass__content">{children}</div>
        </div>
      </div>
    </div>
  );
}
