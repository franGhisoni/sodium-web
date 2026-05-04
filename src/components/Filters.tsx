/**
 * SVG filter primitives for real "liquid glass" rendering.
 *
 * Apple's Liquid Glass effect = soft refraction through the surface.
 * It's reproduced on the web by chaining:
 *   feTurbulence  → low-frequency organic noise field
 *   feGaussianBlur → smooths the noise into rolling waves
 *   feDisplacementMap → uses that map to bend SourceGraphic pixels
 *
 * Applied via `backdrop-filter: url(#liquid-glass)` on a card,
 * the pixels behind the card get bent like through a real lens.
 *
 * Mounted once at app root, referenced by id from CSS.
 */
export function Filters() {
  return (
    <svg
      aria-hidden="true"
      style={{ position: 'fixed', width: 0, height: 0, pointerEvents: 'none' }}
    >
      <defs>
        {/* — Refraction: subtle organic lensing through the surface — */}
        <filter id="liquid-glass" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.012"
            numOctaves="2"
            seed="7"
            result="turbulence"
          />
          <feGaussianBlur in="turbulence" stdDeviation="2" result="softTurbulence" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softTurbulence"
            scale="40"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* — Stronger refraction for hero/feature cards — */}
        <filter id="liquid-glass-strong" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.009 0.009"
            numOctaves="2"
            seed="13"
            result="turbulence"
          />
          <feGaussianBlur in="turbulence" stdDeviation="3" result="softTurbulence" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softTurbulence"
            scale="65"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
