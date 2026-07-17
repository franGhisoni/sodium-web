import { useEffect } from 'react';

/**
 * Scroll-reveal — blur/fade-up entrance for the page's key blocks.
 *
 * Elements get `.reveal` (hidden) on mount; when they enter the viewport
 * `.reveal-in` runs a keyframe animation staggered by sibling order. Both
 * classes are removed on animationend so hover transforms defined elsewhere
 * (cards lift on :hover) are never fought by the reveal styles.
 */
const SELECTORS = [
  '.hero-copy',
  '.hero-card',
  '.section-head',
  '.cap-card',
  '.case-card',
  '.proc-row',
  '.stat',
  '.manifesto-card',
  '.faq-head',
  '.faq-item',
  '.cta-card',
].join(', ');

export function useReveal() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const els = Array.from(document.querySelectorAll<HTMLElement>(SELECTORS));
    els.forEach((el) => el.classList.add('reveal'));

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          io.unobserve(el);

          const parent = el.parentElement;
          const pending = parent
            ? Array.from(parent.children).filter((s) => s.classList.contains('reveal'))
            : [];
          const idx = Math.max(0, pending.indexOf(el));
          el.style.setProperty('--rd', `${Math.min(idx, 6) * 85}ms`);

          el.classList.add('reveal-in');
          el.addEventListener(
            'animationend',
            () => {
              el.classList.remove('reveal', 'reveal-in');
              el.style.removeProperty('--rd');
            },
            { once: true },
          );
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -6% 0px' },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
