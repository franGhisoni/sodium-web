import './sections.css';

const CAPS = [
  {
    n: '01',
    kicker: 'AGENTES IA',
    title: 'Chatbots que califican y cierran.',
    body: 'Agentes en WhatsApp, Instagram y web. Califican leads, agendan, integran al CRM y nunca duermen.',
    tags: ['GPT-5', 'Claude', 'RAG', 'Webhooks'],
    icon: IconAgent,
  },
  {
    n: '02',
    kicker: 'WEBS',
    title: 'Sitios y landings que convierten.',
    body: 'Webs corporativas, e-commerce, landings de campaña. Sistema de diseño propio, performance medible.',
    tags: ['Next.js', 'Astro', 'Sanity', 'A/B test'],
    icon: IconWeb,
  },
  {
    n: '03',
    kicker: 'SCRAPING',
    title: 'Datos que tu competencia esconde.',
    body: 'Scrapers resilientes para precios, listados, noticias o catálogos. Pipeline limpio, deduplicado y enriquecido por LLM.',
    tags: ['Playwright', 'Python', 'Queue', 'LLM clean'],
    icon: IconScrape,
  },
  {
    n: '04',
    kicker: 'DASHBOARDS',
    title: 'Telemetría que se entiende.',
    body: 'Dashboards comerciales y operativos. Series temporales, drill-down, brush. Pensados para decidir.',
    tags: ['Recharts', 'D3', 'Postgres', 'Insight AI'],
    icon: IconDash,
  },
  {
    n: '05',
    kicker: 'INTEGRACIONES',
    title: 'Stack que se habla solo.',
    body: 'Conectamos lo que ya usás — Stripe, HubSpot, Shopify, Twilio, Notion — con el sistema que construimos.',
    tags: ['REST', 'Webhooks', 'tRPC', 'OAuth'],
    icon: IconIntegr,
  },
  {
    n: '06',
    kicker: 'OPERACIÓN',
    title: 'On-call cuando algo se rompe.',
    body: 'Monitoreo, alertas, SLA, retraining de modelos. Te entregamos el sistema funcionando — y lo mantenemos así.',
    tags: ['Uptime', 'Sentry', 'SLO', '24/7'],
    icon: IconOps,
  },
];

export function Capacidades() {
  return (
    <section className="section" id="capacidades">
      <div className="section-inner">
        <header className="section-head">
          <span className="pill">
            <span className="pill-dot" />
            CAPACIDADES
          </span>
          <h2 className="section-title">
            Seis disciplinas, <em>una sola fábrica.</em>
          </h2>
          <p className="section-sub">
            Construimos producto digital de punta a punta. Cada capacidad usa el mismo
            equipo, los mismos estándares y la misma infraestructura — por eso encajan.
          </p>
        </header>

        <div className="cap-grid">
          {CAPS.map(c => (
            <article key={c.n} className="glass cap-card">
              <header className="cap-head">
                <span><strong>{c.n}</strong> · {c.kicker}</span>
              </header>
              <div className="cap-icon-wrap">
                <c.icon />
              </div>
              <h3 className="cap-title">{c.title}</h3>
              <p className="cap-body">{c.body}</p>
              <div className="cap-tags">
                {c.tags.map(t => <span key={t} className="cap-tag">{t}</span>)}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Line icons (1.5px stroke, currentColor) ──────────────────── */

function IconAgent() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="6" width="16" height="12" rx="3" />
      <circle cx="9" cy="12" r="1" fill="currentColor" />
      <circle cx="15" cy="12" r="1" fill="currentColor" />
      <path d="M12 3v3M8 18v2M16 18v2" />
    </svg>
  );
}
function IconWeb() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M7 6.5h.01M10 6.5h.01" />
    </svg>
  );
}
function IconScrape() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7l4 4-4 4" />
      <path d="M11 7h10M11 11h6M11 15h8" />
    </svg>
  );
}
function IconDash() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17l5-6 4 3 6-8 3 4" />
      <path d="M3 21h18" />
    </svg>
  );
}
function IconIntegr() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="6" cy="18" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="M8.5 6h7M8.5 18h7M6 8.5v7M18 8.5v7" />
    </svg>
  );
}
function IconOps() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
