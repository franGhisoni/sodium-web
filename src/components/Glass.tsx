import { GlassCard } from '@developer-hub/liquid-glass';
import type { CSSProperties, ReactNode } from 'react';

/**
 * Project-wide wrapper around `@developer-hub/liquid-glass` GlassCard.
 *
 * Centralises the visual defaults (displacement, blur, radius) so the entire
 * site shares one liquid-glass language. Override per use case via props.
 */
interface GlassProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  padding?: string;
  cornerRadius?: number;
  displacementScale?: number;
  blurAmount?: number;
  onClick?: () => void;
  variant?: 'default' | 'soft' | 'strong';
}

export function Glass({
  children,
  className,
  style,
  padding,
  cornerRadius,
  displacementScale,
  blurAmount,
  onClick,
  variant = 'default',
}: GlassProps) {
  const presets = {
    soft:    { displacementScale: 140, blurAmount: 0.04, cornerRadius: 18 },
    default: { displacementScale: 200, blurAmount: 0.05, cornerRadius: 22 },
    strong:  { displacementScale: 280, blurAmount: 0.07, cornerRadius: 28 },
  } as const;
  const p = presets[variant];

  return (
    <GlassCard
      className={['glass-wrap', className].filter(Boolean).join(' ')}
      style={style}
      padding={padding}
      cornerRadius={cornerRadius ?? p.cornerRadius}
      displacementScale={displacementScale ?? p.displacementScale}
      blurAmount={blurAmount ?? p.blurAmount}
      onClick={onClick}
    >
      {children}
    </GlassCard>
  );
}
