import { useLayoutEffect } from 'react';
import './kinetic.css';

/**
 * Kinetic typography, applied to the page's existing markup (DOM-level, like
 * useReveal, so the section components stay plain JSX):
 *
 *  - Headings (.hero-title, .section-title, .cta-title) are split into words
 *    that pull focus (blur → sharp) while dollying in, staggered, once they
 *    scroll into view.
 *  - The manifesto text lights up word by word as you scroll through it.
 *  - Stat numbers count up when they enter the viewport.
 *  - A scroll-linked parallax lifts the hero copy as you leave it.
 *
 * Everything is skipped under prefers-reduced-motion.
 */

const HEADINGS = '.hero-title, .section-title, .cta-title';
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/** Wrap every word of every text node under `root` in `wrap(word)` elements. */
function wrapWords(root: HTMLElement, make: (word: string) => HTMLElement) {
  const walk = (node: Node) => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        for (const part of (child.textContent ?? '').split(/(\s+)/)) {
          if (!part) continue;
          frag.appendChild(/^\s+$/.test(part) ? document.createTextNode(part) : make(part));
        }
        node.replaceChild(frag, child);
      } else if (child.nodeType === Node.ELEMENT_NODE && (child as Element).tagName !== 'BR') {
        walk(child);
      }
    }
  };
  walk(root);
}

function splitHeadings(): Array<() => void> {
  const cleanups: Array<() => void> = [];
  const els = Array.from(document.querySelectorAll<HTMLElement>(HEADINGS));

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('kinetic-in');
        io.unobserve(e.target);
      }
    },
    { threshold: 0.35 },
  );

  for (const el of els) {
    if (!el.dataset.kinetic) {
      el.dataset.kinetic = '1';
      el.setAttribute('aria-label', (el.textContent ?? '').replace(/\s+/g, ' ').trim());

      let idx = 0;
      wrapWords(el, (word) => {
        const w = document.createElement('span');
        w.className = 'kw';
        w.setAttribute('aria-hidden', 'true');
        w.textContent = word;
        w.style.setProperty('--i', String(Math.min(idx++, 12)));
        return w;
      });
      el.classList.add('kinetic');
    }
    /* Observe even if already split: the effect re-runs under StrictMode. */
    if (!el.classList.contains('kinetic-in')) io.observe(el);
  }

  cleanups.push(() => io.disconnect());
  return cleanups;
}

/** Words fade in as the paragraph scrolls through the viewport. */
function scrubText(): Array<() => void> {
  const el = document.querySelector<HTMLElement>('.manifesto-text');
  if (!el) return [];

  if (!el.dataset.kinetic) {
    el.dataset.kinetic = '1';
    wrapWords(el, (word) => {
      const w = document.createElement('span');
      w.className = 'sw';
      w.textContent = word;
      return w;
    });
  }
  const words = Array.from(el.querySelectorAll<HTMLElement>('.sw'));
  const n = words.length;
  let raf = 0;

  const update = () => {
    raf = 0;
    const r = el.getBoundingClientRect();
    const vh = innerHeight;
    const p = clamp((vh * 0.82 - r.top) / (r.height + vh * 0.22), 0, 1);
    for (let i = 0; i < n; i++) {
      const o = clamp((p * (n + 3) - i) / 3, 0, 1);
      words[i].style.setProperty('--o', (0.16 + 0.84 * o).toFixed(3));
    }
  };
  const request = () => {
    if (!raf) raf = requestAnimationFrame(update);
  };
  update();
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', request);

  return [
    () => {
      cancelAnimationFrame(raf);
      removeEventListener('scroll', request);
      removeEventListener('resize', request);
    },
  ];
}

/** "99.98" counts 00.00 → 99.98, keeping decimals and leading zeros. */
function countUps(): Array<() => void> {
  const nums = Array.from(document.querySelectorAll<HTMLElement>('.stat-num'));
  const rafs = new Set<number>();

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        io.unobserve(e.target);
        const node = e.target.firstChild;
        const info = (node as Text & { _count?: { to: number; dec: number; int: number } })._count;
        if (!node || !info) continue;
        const t0 = performance.now();
        const DUR = 1600;
        const tick = (now: number) => {
          const k = clamp((now - t0) / DUR, 0, 1);
          const eased = k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
          const [i, d] = (info.to * eased).toFixed(info.dec).split('.');
          node.textContent = i.padStart(info.int, '0') + (d ? '.' + d : '');
          if (k < 1) rafs.add(requestAnimationFrame(tick));
        };
        rafs.add(requestAnimationFrame(tick));
      }
    },
    { threshold: 0.6 },
  );

  for (const el of nums) {
    const node = el.firstChild as (Text & { _count?: { to: number; dec: number; int: number } }) | null;
    if (!node || node.nodeType !== Node.TEXT_NODE) continue;
    if (!node._count) {
      const raw = (node.textContent ?? '').trim();
      if (!/^\d+(\.\d+)?$/.test(raw)) continue;
      const [i, d = ''] = raw.split('.');
      node._count = { to: parseFloat(raw), dec: d.length, int: i.length };
      node.textContent = '0'.repeat(i.length) + (d ? '.' + '0'.repeat(d.length) : '');
    }
    io.observe(el);
  }

  return [
    () => {
      io.disconnect();
      rafs.forEach(cancelAnimationFrame);
    },
  ];
}

/** Lifts the hero copy as it scrolls away (single CSS variable, one rAF). */
function heroParallax(): Array<() => void> {
  const root = document.documentElement;
  let raf = 0;
  const update = () => {
    raf = 0;
    root.style.setProperty('--hs', clamp(window.scrollY / (innerHeight * 0.8), 0, 1).toFixed(3));
  };
  const request = () => {
    if (!raf) raf = requestAnimationFrame(update);
  };
  update();
  addEventListener('scroll', request, { passive: true });
  return [
    () => {
      cancelAnimationFrame(raf);
      removeEventListener('scroll', request);
      root.style.removeProperty('--hs');
    },
  ];
}

export function useKinetic() {
  useLayoutEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cleanups = [
      ...splitHeadings(),
      ...scrubText(),
      ...countUps(),
      ...heroParallax(),
    ];
    return () => cleanups.forEach((fn) => fn());
  }, []);
}
