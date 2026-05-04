import { Logo } from './Logo';
import './sections.css';

export function Footer() {
  return (
    <footer className="footer">
      <div className="section-inner">
        <div className="footer-top">
          <div className="footer-mark">
            <Logo size={48} />
            <p>Software factory enfocada en agentes de IA, web, scraping y dashboards.</p>
          </div>
          <div className="footer-cols">
            <div>
              <h5>Estudio</h5>
              <a href="#estudio">Manifiesto</a>
              <a href="#">Equipo</a>
              <a href="#">Notas</a>
              <a href="#">GitHub</a>
            </div>
            <div>
              <h5>Capacidades</h5>
              <a href="#capacidades">Agentes IA</a>
              <a href="#capacidades">Webs</a>
              <a href="#capacidades">Scraping</a>
              <a href="#capacidades">Dashboards</a>
              <a href="#capacidades">Operación</a>
            </div>
            <div>
              <h5>Contacto</h5>
              <a href="mailto:softwaresodium@gmail.com">softwaresodium@gmail.com</a>
              <a href="https://wa.me/5491125918111" target="_blank" rel="noopener noreferrer">
                WhatsApp · 11 2591 8111
              </a>
              <a href="https://www.linkedin.com/in/sodium-software-9500b43b2/" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bot">
          <span className="footer-word">sodium/software</span>
          <span className="footer-meta">© 2026 — todos los sistemas reservados</span>
        </div>
      </div>
    </footer>
  );
}
