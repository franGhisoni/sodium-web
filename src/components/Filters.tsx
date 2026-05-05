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
        {/* — Refraction for nav / pills / icons — visible bend on small surfaces — */}
        <filter id="liquid-glass" x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.010 0.012"
            numOctaves="2"
            seed="7"
            result="turbulence"
          />
          <feGaussianBlur in="turbulence" stdDeviation="2.5" result="softTurbulence" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softTurbulence"
            scale="90"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* — Stronger refraction for big surfaces — */}
        <filter id="liquid-glass-strong" x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.007 0.009"
            numOctaves="2"
            seed="13"
            result="turbulence"
          />
          <feGaussianBlur in="turbulence" stdDeviation="3.5" result="softTurbulence" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softTurbulence"
            scale="140"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
