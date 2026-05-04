import { Logo } from './Logo';
import './Nav.css';

export function Nav() {
  return (
    <header className="nav">
      <div className="nav-inner container">
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
    </header>
  );
}
