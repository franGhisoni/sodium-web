import { useEffect, useState } from 'react';
import { Logo } from './Logo';
import { Glass } from './Glass';
import { useContactLink } from '../contact';

/** Main sections; plain links, so every page is reachable for people and crawlers. */
const LINKS: Array<[string, string]> = [
  ['/software-a-medida', 'Software a medida'],
  ['/desarrollo-ia', 'IA'],
  ['/automatizacion', 'Automatización'],
  ['/casos-de-exito', 'Casos'],
  ['/nosotros', 'Nosotros'],
  ['/recursos', 'Recursos'],
];

const isTouch = typeof window !== 'undefined' && matchMedia('(pointer: coarse)').matches;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const contact = useContactLink();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
      <div className="nav-pill">
        <Glass
          className="nav-pill-glass"
          padding="9px 14px 9px 22px"
          cornerRadius={999}
          crystal={scrolled && !isTouch}
        >
          <div className="nav-pill-content">
            <a href="/" className="nav-brand" aria-label="Sodium Software · inicio">
              <Logo size={18} />
              <span className="nav-wordmark">
                sodium<span className="nav-wordmark-light">/software</span>
              </span>
            </a>

            <nav className="nav-links" aria-label="Principal">
              {LINKS.map(([href, label]) => (
                <a key={href} href={href}>{label}</a>
              ))}
            </nav>

            <details className="nav-menu">
              <summary aria-label="Menú">
                <span className="nav-menu-icon" aria-hidden="true" />
              </summary>
              <nav className="nav-menu-panel" aria-label="Menú móvil">
                {LINKS.map(([href, label]) => (
                  <a key={href} href={href}>{label}</a>
                ))}
                <a href="/contacto">Contacto</a>
              </nav>
            </details>

            <a {...contact} className="nav-cta" aria-label="Iniciar proyecto por WhatsApp">
              <span>Iniciar proyecto</span>
              <span className="nav-cta-arrow" aria-hidden="true">↗</span>
            </a>
          </div>
        </Glass>
      </div>
    </header>
  );
}
