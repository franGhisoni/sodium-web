import { Glass } from './Glass';
import './sections.css';

export function CTA() {
  return (
    <section className="section cta" id="contacto">
      <div className="section-inner">
        <Glass variant="strong" className="cta-card" padding="72px 48px">
          <span className="pill">
            <span className="pill-dot" />
            CONTACTO
          </span>
          <h2 className="cta-title">
            Empecemos por un<br />
            <strong>brief de 30 minutos.</strong>
          </h2>
          <p className="cta-sub">
            Contanos qué parte de tu operación necesita cambiar. Encontramos juntos
            dónde la IA puede generar impacto real.
          </p>

          <form
            className="cta-form"
            onSubmit={(e) => {
              e.preventDefault();
              const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement)?.value;
              if (email) {
                window.location.href = `mailto:softwaresodium@gmail.com?subject=Brief%20Sodium&body=Email%3A%20${encodeURIComponent(email)}`;
              }
            }}
          >
            <input type="email" name="email" placeholder="tu@empresa.com" required />
            <button type="submit">
              Agendar →
            </button>
          </form>

          <div className="cta-meta">
            <a href="mailto:softwaresodium@gmail.com">softwaresodium@gmail.com</a>
            <span className="cta-meta-sep">·</span>
            <a href="https://wa.me/5491125918111" target="_blank" rel="noopener noreferrer">
              WhatsApp +54 11 2591 8111
            </a>
            <span className="cta-meta-sep">·</span>
            <a href="https://www.linkedin.com/in/sodium-software-9500b43b2/" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </div>
        </Glass>
      </div>
    </section>
  );
}
