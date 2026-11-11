import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="footer">
      <div className="section-inner">
        <div className="footer-top">
          <div className="footer-mark">
            <Logo size={48} title="Sodium Software" />
            <p>Software factory en Buenos Aires: software a medida e IA aplicada a los flujos de trabajo que realmente mueven el negocio.</p>
          </div>
          <div className="footer-cols">
            <div>
              <p className="footer-col-title">Servicios</p>
              <a href="/software-factory">Software factory</a>
              <a href="/software-a-medida">Software a medida</a>
              <a href="/desarrollo-ia">Desarrollo de IA</a>
              <a href="/automatizacion">Automatización</a>
            </div>
            <div>
              <p className="footer-col-title">Sodium</p>
              <a href="/nosotros">Nosotros</a>
              <a href="/casos-de-exito">Casos de éxito</a>
              <a href="/recursos">Recursos</a>
              <a href="/contacto">Contacto</a>
              <a href="/privacidad/">Privacidad</a>
            </div>
            <div>
              <p className="footer-col-title">Contacto</p>
              <a href="mailto:contacto@sodium.com.ar">contacto@sodium.com.ar</a>
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
