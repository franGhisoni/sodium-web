import { Glass } from './Glass';
import './Hero.css';

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-inner container">
        <div className="hero-copy">
          <span className="pill hero-pill">
            <span className="pill-dot" />
            SODIUM / SOFTWARE · FACTORY · 2026
          </span>

          <h1 className="hero-title display">
            Tu empresa,
            <br />
            como <span className="hero-title-accent">interfaz.</span>
          </h1>

          <p className="hero-sub">
            Software factory enfocada en agentes de IA, sitios web, scraping
            y dashboards. <span className="muted">Diseñamos, construimos y operamos los sistemas
            que tu equipo no quiere mantener.</span>
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
              <dt>Stack</dt>
              <dd>TypeScript · Python · Postgres</dd>
            </div>
            <div>
              <dt>Modelos</dt>
              <dd>GPT-5 · Claude · Llama</dd>
            </div>
            <div>
              <dt>Equipo</dt>
              <dd>04 personas · sin agencia</dd>
            </div>
          </dl>
        </div>

        <div className="hero-stage">
          <HeroDashCard />
          <HeroNotifCard />
          <HeroEcosystemCard />
        </div>
      </div>
    </section>
  );
}

/* ─── Primary glass card: live strategy snapshot ─── */
function HeroDashCard() {
  return (
    <Glass variant="strong" className="hero-card hero-card-primary" padding="28px">
      <header className="hero-card-head">
        <div>
          <span className="hero-card-label">Now <span className="muted">04.26.26</span></span>
          <h3 className="hero-card-title display">
            Estrategia, <br /><strong>en directo.</strong>
          </h3>
        </div>
        <span className="hero-card-tag">
          <span className="pill-dot" />
          ACQUISITION_FUNNEL
        </span>
      </header>

      <AreaChart />

      <footer className="hero-card-stats">
        <div>
          <span className="hero-stat-label">MRR</span>
          <span className="hero-stat-value">$2.4M</span>
        </div>
        <div>
          <span className="hero-stat-label">30D</span>
          <span className="hero-stat-value hero-stat-up">+32%</span>
        </div>
        <div>
          <span className="hero-stat-label">Signals</span>
          <span className="hero-stat-value">1,204</span>
        </div>
      </footer>
    </Glass>
  );
}

/* ─── Secondary card: stacked top-right ─── */
function HeroNotifCard() {
  return (
    <Glass variant="default" className="hero-card hero-card-notif" padding="20px">
      <header className="hero-card-head-mini">
        <span className="hero-card-label">Notificación</span>
        <span className="hero-card-time">14:02</span>
      </header>
      <p className="hero-notif-body">
        Actualización de sistema <br />
        <span className="muted">programada · ag_4f2a91</span>
      </p>
      <footer className="hero-card-foot">
        <span className="pill-dot" />
        Internal Doc. 04
      </footer>
    </Glass>
  );
}

/* ─── Tertiary card: ecosystem sparkline ─── */
function HeroEcosystemCard() {
  return (
    <Glass variant="default" className="hero-card hero-card-eco" padding="22px">
      <header className="hero-card-head-mini">
        <span className="hero-card-label">Ecosistema</span>
        <span className="hero-eco-count"><strong>48</strong> nodos</span>
      </header>
      <Sparkline />
    </Glass>
  );
}

/* ─── Charts (pure SVG, deterministic) ─── */

function AreaChart() {
  // Deterministic walk so it always looks elegant, never random-noisy.
  const points = [
    [0, 78], [10, 72], [20, 74], [30, 64], [40, 60],
    [50, 52], [60, 56], [70, 44], [80, 38], [90, 28], [100, 22],
  ];

  const pathD = points
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`)
    .join(' ');
  const areaD = `${pathD} L 100 100 L 0 100 Z`;

  return (
    <div className="hero-chart-wrap">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="hero-chart"
        role="img"
        aria-label="Curva de adquisición"
      >
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="rgba(169, 200, 227, 0.55)" />
            <stop offset="60%"  stopColor="rgba(169, 200, 227, 0.10)" />
            <stop offset="100%" stopColor="rgba(169, 200, 227, 0)" />
          </linearGradient>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="rgba(255, 255, 255, 0.45)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.95)" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#areaGrad)" />
        <path
          d={pathD}
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth="0.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

function Sparkline() {
  const pts = [70, 64, 58, 62, 50, 54, 42, 46, 36, 30, 24];
  const pathD = pts
    .map((y, i) => `${i === 0 ? 'M' : 'L'} ${(i / (pts.length - 1)) * 100} ${y}`)
    .join(' ');

  return (
    <svg
      viewBox="0 0 100 80"
      preserveAspectRatio="none"
      className="hero-spark"
      role="img"
      aria-label="Crecimiento del ecosistema"
    >
      <path
        d={pathD}
        fill="none"
        stroke="rgba(244, 248, 252, 0.55)"
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {pts.map((y, i) => (
        <circle
          key={i}
          cx={(i / (pts.length - 1)) * 100}
          cy={y}
          r="0.9"
          fill={i === pts.length - 1 ? 'var(--ink)' : 'rgba(244, 248, 252, 0.45)'}
        />
      ))}
    </svg>
  );
}
