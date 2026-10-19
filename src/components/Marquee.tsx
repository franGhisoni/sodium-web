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

    const touch = matchMedia('(pointer: coarse)').matches;
    const rows = Array.from(root.querySelectorAll<HTMLElement>('.mq-row'));
    const offsets = rows.map(() => 0);
    const widths = rows.map(() => 0);
    const ready = rows.map(() => false);
    const BASE = 38; /* px/s */
    let lastY = window.scrollY;
    let vel = 0; /* smoothed px per frame */
    let skew = 0;
    let visible = false;
    let raf = 0;
    let last = performance.now();

    const measure = () => {
      rows.forEach((row, i) => {
        const set = row.firstElementChild as HTMLElement | null;
        const w = set ? set.offsetWidth : 0;
        widths[i] = w;
        if (w && !ready[i]) {
          offsets[i] = i % 2 === 1 ? -w : 0;
          ready[i] = true;
        }
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);

    const frame = (now: number) => {
      if (!visible) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(frame);
      const dt = Math.min(now - last, 50) / 1000;
      last = now;

      const y = window.scrollY;
      vel += ((y - lastY) - vel) * 0.12;
      lastY = y;

      const targetSkew = touch ? 0 : Math.max(-9, Math.min(9, vel * -0.35));
      skew += (targetSkew - skew) * 0.15;

      rows.forEach((row, i) => {
        const w = widths[i];
        if (!w) return;
        const dir = i % 2 === 0 ? -1 : 1;
        /* Scroll speed adds to the drift, always in the row's own direction. */
        offsets[i] += dir * (BASE * dt + Math.abs(vel) * (touch ? 0.45 : 0.9));
        if (dir === -1 && offsets[i] <= -w) offsets[i] += w;
        if (dir === 1 && offsets[i] >= 0) offsets[i] -= w;
        row.style.transform = touch
          ? `translate3d(${offsets[i]}px,0,0)`
          : `translate3d(${offsets[i]}px,0,0) skewX(${skew}deg)`;
      });
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) {
        last = performance.now();
        lastY = window.scrollY;
        raf = requestAnimationFrame(frame);
      } else if (!visible && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(root);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
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
