import { useEffect, useRef } from 'react';

/**
 * Background system — generates the salt/snow grain ONCE in a canvas,
 * tiles it as a fixed background. No animation on background-image
 * (avoids the lag of Claude Design's feTurbulence approach).
 *
 * Spec from Figma: 5px particles · 33% density ·
 *   colour A #809EC1 @ 66% · colour B #FFFFFF @ 40% · 2px blur.
 */
function generateGrainDataURL(): string {
  const size = 400;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // ~700 particles — quiet snowfall, not static. Tweakable from one place.
  const particles = 1450;

  // Slight blur so particles look like out-of-focus snowflakes/salt.
  // Supported in Chromium / Firefox / Safari ≥ 18.
  ctx.filter = 'blur(1.35px)';

  for (let i = 0; i < particles; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const radius = 0.35 + Math.random() * 1.65;

    // Mix the two colours roughly 50/50 — Figma spec is a layered effect
    // not a probability ratio, so 50/50 reproduces it well.
    ctx.fillStyle = Math.random() < 0.5
      ? 'rgba(128, 158, 193, 0.66)' // #809EC1 @ 66%
      : 'rgba(255, 255, 255, 0.40)'; // #FFFFFF @ 40%

    // Draw each particle 9× in a 3×3 grid so the tile wraps seamlessly.
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        ctx.beginPath();
        ctx.arc(x + dx * size, y + dy * size, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  return canvas.toDataURL('image/png');
}

export function Background() {
  const grainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!grainRef.current) return;
    const url = generateGrainDataURL();
    if (url) {
      grainRef.current.style.backgroundImage = `url(${url})`;
    }
  }, []);

  return (
    <>
      <div className="bg-gradient" aria-hidden="true" />
      <div className="bg-light-field" aria-hidden="true" />
      <div ref={grainRef} className="bg-grain" aria-hidden="true" />
      <div className="bg-vignette" aria-hidden="true" />
    </>
  );
}
