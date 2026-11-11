import type React from 'react';
import { Glass } from './Glass';
import { SceneAnchor } from './SceneAnchor';
import { useContactLink } from '../contact';
import './Hero.css';

/** Splits a headline into word spans for the staggered CSS entrance. */
function Words({ text, from }: { text: string; from: number }) {
  return text.split(' ').map((word, i) => (
    <span key={i}>
      {i > 0 && ' '}
      <span className="kw" style={{ '--i': from + i } as React.CSSProperties}>{word}</span>
    </span>
  ));
}

export function Hero() {
  const contact = useContactLink();
  return (
    <section className="hero" id="top">
      {/* First view: just the promise, two actions and the prism. */}
      <div className="hero-fold container">
        <div className="hero-copy">
          {/* The h1 names the company and what it does (the pill line) and
              carries the headline. Headline words are server-rendered spans
              animated by CSS, so the text is in the HTML and paints at once. */}
          <h1 className="hero-heading">
            <span className="pill hero-pill">
              <span className="pill-dot" />
              Sodium · Software a medida e IA
            </span>{' '}
            <span className="hero-title display">
              <Words text="IA aplicada." from={0} />
              <br />
              <span className="hero-title-accent"><Words text="Impacto real." from={2} /></span>
            </span>
          </h1>

          <p className="hero-sub">
            Somos una software factory argentina: desarrollamos software a medida e
            integramos inteligencia artificial en los flujos de trabajo clave de tu
            empresa para acelerar decisiones, ejecución y crecimiento.
          </p>

          <div className="hero-actions">
            <a {...contact} className="btn btn-primary">
              Iniciar proyecto
              <span className="btn-arrow" aria-hidden="true">→</span>
            </a>
            <a href="#casos" className="btn btn-ghost">
              Ver casos
              <span className="btn-arrow" aria-hidden="true">↘</span>
            </a>
          </div>
        </div>

        {/* Apex-up prism, rolled 5°: the beam rises from the lower left under
            the copy and meets the near face at ~50° (no total internal
            reflection at rest); the spectrum falls down-right towards the
            content below. At 5° the light keeps entering the same face and
            leaving by the same one across the whole pointer sweep. */}
        <SceneAnchor kind="prism" className="hero-prism-anchor" rotation={5} beamAngle={-10} />
        <SceneAnchor kind="prism" className="hero-prism-anchor--mobile" rotation={12} beamAngle={0} />

        <a href="#hero-detalle" className="hero-scroll">
          <span>Cómo trabajamos</span>
          <span className="hero-scroll-line" aria-hidden="true" />
        </a>
      </div>

      {/* Below the fold: positioning, principles and the workflow cards. */}
      <div className="hero-detail container" id="hero-detalle">
        <div className="hero-detail-copy">
          <p className="hero-lead">
            No desarrollamos otra IA: <span className="muted">integramos lo mejor del
            mercado donde el cambio genera impacto real.</span>
          </p>
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
          <p className="hero-card-title display">
            Menos fricción. <br /><strong>Más capacidad.</strong>
          </p>
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
