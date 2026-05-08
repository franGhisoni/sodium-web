import { useEffect, useState } from 'react';
import { Logo } from './Logo';
import { Glass } from './Glass';
import './Nav.css';

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

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
          displacementScale={220}
          blurAmount={0.06}
        >
          <div className="nav-pill-content">
            <a href="#top" className="nav-brand" aria-label="Sodium Software · inicio">
              <Logo size={18} />
              <span className="nav-wordmark">
                sodium<span className="nav-wordmark-light">/software</span>
              </span>
            </a>

            <nav className="nav-links" aria-label="Principal">
              <a href="#capacidades">Capacidades</a>
              <a href="#casos">Casos</a>
              <a href="#proceso">Proceso</a>
              <a href="#estudio">Estudio</a>
            </nav>

            <a href="#contacto" className="nav-cta">
              <span>Iniciar proyecto</span>
              <span className="nav-cta-arrow" aria-hidden="true">↗</span>
            </a>
          </div>
        </Glass>
      </div>
    </header>
  );
}
