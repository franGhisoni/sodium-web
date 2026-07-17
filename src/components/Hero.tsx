import { Glass } from './Glass';
import { Crystal } from './Crystal';
import './Hero.css';

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-inner container">
        <div className="hero-copy">
          <span className="pill hero-pill">
            <span className="pill-dot" />
            IA APLICADA · SISTEMAS · ADOPCIÓN
          </span>

          <h1 className="hero-title display">
            IA aplicada.
            <br />
            <span className="hero-title-accent">Impacto real.</span>
          </h1>

          <p className="hero-sub">
            Intervenimos los flujos de trabajo clave de tu empresa para acelerar
            decisiones, ejecución y crecimiento. <span className="muted">No desarrollamos otra IA:
            integramos lo mejor del mercado donde el cambio genera impacto real.</span>
          </p>

          <div className="hero-actions">
            <a href="#contacto" className="btn btn-primary">
              Iniciar proyecto
              <span className="btn-arrow" aria-hidden="true">→</span>
            </a>
            <a href="#casos" className="btn btn-ghost">
              Ver casos
              <span className="btn-arrow" aria-hidden="true">↘</span>
            </a>
          </div>

          <dl className="hero-meta">
            <div>
              <dt>Enfoque</dt>
              <dd>Problema antes que herramienta</dd>
            </div>
            <div>
              <dt>Tecnología</dt>
              <dd>Los mejores modelos del mercado</dd>
            </div>
            <div>
              <dt>Resultado</dt>
              <dd>Flujos más rápidos y capaces</dd>
            </div>
          </dl>
        </div>

        <div className="hero-stage">
          <Crystal className="hero-crystal" />
          <HeroWorkflowCard />
          <HeroReviewCard />
          <HeroStackCard />
        </div>
      </div>
    </section>
  );
}

/* ─── Primary glass card: workflow intervention ─── */
function HeroWorkflowCard() {
  return (
    <Glass variant="strong" className="hero-card hero-card-primary" padding="28px">
      <header className="hero-card-head">
        <div>
          <span className="hero-card-label">Flujo clave <span className="muted">/ comercial</span></span>
          <h3 className="hero-card-title display">
            Menos fricción. <br /><strong>Más capacidad.</strong>
          </h3>
        </div>
        <span className="hero-card-tag">
          <span className="pill-dot" />
          PUNTO DE IMPACTO
        </span>
      </header>

      <div className="hero-workflow" aria-label="Ejemplo de flujo de trabajo asistido por IA">
        <div className="hero-workflow-step">
          <span className="hero-workflow-num">01</span>
          <div><span>Entrada</span><strong>Consulta comercial</strong></div>
        </div>
        <span className="hero-workflow-arrow" aria-hidden="true">→</span>
        <div className="hero-workflow-step hero-workflow-step--active">
          <span className="hero-workflow-num">02</span>
          <div><span>IA aplicada</span><strong>Entiende y propone</strong></div>
        </div>
        <span className="hero-workflow-arrow" aria-hidden="true">→</span>
        <div className="hero-workflow-step">
          <span className="hero-workflow-num">03</span>
          <div><span>Equipo</span><strong>Decide y ejecuta</strong></div>
        </div>
      </div>
      <p className="hero-workflow-note">La IA potencia el criterio del equipo; no lo reemplaza.</p>
    </Glass>
  );
}

/* ─── Secondary card: human review ─── */
function HeroReviewCard() {
  return (
    <Glass variant="default" className="hero-card hero-card-notif" padding="20px">
      <header className="hero-card-head-mini">
        <span className="hero-card-label">Revisión humana</span>
        <span className="hero-card-time">Lista</span>
      </header>
      <p className="hero-notif-body">
        Propuesta preparada con contexto <br />
        <span className="muted">el equipo conserva la decisión final</span>
      </p>
      <footer className="hero-card-foot">
        <span className="pill-dot" />
        CONTROL EN TU EQUIPO
      </footer>
    </Glass>
  );
}

/* ─── Tertiary card: best available technology ─── */
function HeroStackCard() {
  return (
    <Glass variant="default" className="hero-card hero-card-eco" padding="22px">
      <header className="hero-card-head-mini">
        <span className="hero-card-label">Tecnología</span>
        <span className="hero-eco-count"><strong>Best fit</strong> por flujo</span>
      </header>
      <div className="hero-stack-list">
        <span>OpenAI</span>
        <span>Anthropic</span>
        <span>Open source</span>
      </div>
    </Glass>
  );
}
