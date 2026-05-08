import { useEffect, useRef } from 'react';

/**
 * Background system — generates the salt/snow grain ONCE in a canvas,
 * tiles it as a fixed background, then moves the layers with CSS animation
 * and scroll-linked parallax.
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
  const gradientRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const grainRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!grainRef.current) return;
    const url = generateGrainDataURL();
    if (url) {
      grainRef.current.style.backgroundImage = `url(${url})`;
    }
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let frame = 0;

    const applyParallax = () => {
      frame = 0;
      const y = window.scrollY;

      if (gradientRef.current) {
        gradientRef.current.style.transform = `translate3d(0, ${y * -0.035}px, 0) scale(1.04)`;
      }

      if (lightRef.current) {
        lightRef.current.style.transform = `translate3d(0, ${y * -0.075}px, 0) scale(1.03)`;
      }

      if (grainRef.current) {
        grainRef.current.style.transform = `translate3d(0, ${y * -0.14}px, 0)`;
      }

      if (vignetteRef.current) {
        vignetteRef.current.style.transform = `translate3d(0, ${y * -0.02}px, 0)`;
      }
    };

    const requestParallax = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(applyParallax);
    };

    applyParallax();
    window.addEventListener('scroll', requestParallax, { passive: true });
    window.addEventListener('resize', requestParallax);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestParallax);
      window.removeEventListener('resize', requestParallax);
    };
  }, []);

  return (
    <>
      <div ref={gradientRef} className="bg-gradient" aria-hidden="true" />
      <div ref={lightRef} className="bg-light-field" aria-hidden="true" />
      <div ref={grainRef} className="bg-grain" aria-hidden="true" />
      <div className="bg-noise" aria-hidden="true" />
      <div ref={vignetteRef} className="bg-vignette" aria-hidden="true" />
    </>
  );
}
