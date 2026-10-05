import { useEffect, useRef } from 'react';

/**
 * Kinetic marquee band — two rows of oversized type drifting in opposite
 * directions. Scrolling pushes them (speed) and shears them (skew) in
 * proportion to the scroll velocity, so the page feels physically connected
 * to the wheel. Static under prefers-reduced-motion.
 */
const WORDS = ['Agentes de IA', 'Sitios web', 'Scraping', 'Dashboards', 'Integraciones', 'Automatización'];

function Words() {
  return (
    <span className="mq-set" aria-hidden="true">
      {WORDS.map((w) => (
        <span className="mq-item" key={w}>
          {w}
          <i className="mq-dot" />
        </span>
      ))}
    </span>
  );
}

export function Marquee() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rows = Array.from(root.querySelectorAll<HTMLElement>('.mq-row'));
    const offsets = rows.map(() => 0);
    const ready = rows.map(() => false);
    const BASE = 38; /* px/s */
    let lastY = window.scrollY;
    let vel = 0; /* smoothed px per frame */
    let skew = 0;
    let visible = true;
    let raf = 0;
    let last = performance.now();

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(root);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(now - last, 50) / 1000;
      last = now;

      const y = window.scrollY;
      vel += ((y - lastY) - vel) * 0.12;
      lastY = y;
      if (!visible) return;

      const targetSkew = Math.max(-9, Math.min(9, vel * -0.35));
      skew += (targetSkew - skew) * 0.15;

      rows.forEach((row, i) => {
        const dir = i % 2 === 0 ? -1 : 1;
        const set = row.firstElementChild as HTMLElement | null;
        const w = set ? set.offsetWidth : 0;
        if (!w) return;
        if (!ready[i]) {
          offsets[i] = dir === 1 ? -w : 0;
          ready[i] = true;
        }
        /* Scroll speed adds to the drift, always in the row's own direction. */
        offsets[i] += dir * (BASE * dt + Math.abs(vel) * 0.9);
        if (dir === -1 && offsets[i] <= -w) offsets[i] += w;
        if (dir === 1 && offsets[i] >= 0) offsets[i] -= w;
        row.style.transform = `translate3d(${offsets[i]}px,0,0) skewX(${skew}deg)`;
      });
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return (
    <section className="mq" ref={rootRef} aria-label="Qué hacemos">
      <div className="mq-clip">
        <div className="mq-row mq-row--solid">
          <Words />
          <Words />
          <Words />
        </div>
      </div>
      <div className="mq-clip">
        <div className="mq-row mq-row--outline">
          <Words />
          <Words />
          <Words />
        </div>
      </div>
    </section>
  );
}
