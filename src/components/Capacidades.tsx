import { Glass } from './Glass';
import './sections.css';

const CAPS = [
  {
    n: '01',
    kicker: 'DIAGNÓSTICO',
    title: 'Encontramos dónde la IA cambia el resultado.',
    body: 'Mapeamos la operación, detectamos fricción y priorizamos el punto donde intervenir genera una mejora significativa.',
    tags: ['Procesos', 'Oportunidades', 'Impacto', 'Roadmap'],
    icon: IconDash,
  },
  {
    n: '02',
    kicker: 'FLUJOS ASISTIDOS',
    title: 'El trabajo cambia, no solo la herramienta.',
    body: 'Rediseñamos flujos para que la IA prepare, sintetice, recomiende y acelere; el equipo conserva contexto y decisión.',
    tags: ['Copilotos', 'Decisiones', 'Human-in-loop'],
    icon: IconAgent,
  },
  {
    n: '03',
    kicker: 'CONOCIMIENTO',
    title: 'La información aparece cuando hace falta.',
    body: 'Conectamos documentos, conversaciones y sistemas para que cada persona pueda encontrar y usar el conocimiento de la empresa.',
    tags: ['Búsqueda', 'RAG', 'Contexto', 'Permisos'],
    icon: IconScrape,
  },
  {
    n: '04',
    kicker: 'AGENTES OPERATIVOS',
    title: 'El trabajo avanza sin empujar cada paso.',
    body: 'Implementamos agentes que reciben pedidos, coordinan acciones y resuelven tareas dentro de límites claros y observables.',
    tags: ['Agentes', 'Guardrails', 'Trazabilidad', 'Escalamiento'],
    icon: IconWeb,
  },
  {
    n: '05',
    kicker: 'INTEGRACIONES',
    title: 'La IA trabaja con tu operación real.',
    body: 'La conectamos con las herramientas y datos que tu equipo ya usa, sin obligarte a reemplazar todo el stack.',
    tags: ['CRM', 'ERP', 'APIs', 'Datos'],
    icon: IconIntegr,
  },
  {
    n: '06',
    kicker: 'ADOPCIÓN',
    title: 'El cambio se sostiene después de lanzar.',
    body: 'Acompañamos al equipo, medimos uso y resultados, y ajustamos el sistema hasta que forme parte natural del trabajo.',
    tags: ['Capacitación', 'Métricas', 'Mejora continua'],
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
            CÓMO INTERVENIMOS
          </span>
          <h2 className="section-title">
            No automatizamos <em>por automatizar.</em>
          </h2>
          <p className="section-sub">
            Buscamos el punto del flujo donde la IA libera capacidad, mejora una decisión
            o acelera un resultado que realmente importa.
          </p>
        </header>

        <div className="cap-grid">
          {CAPS.map(c => (
            <Glass key={c.n} className="cap-card" padding="26px 24px 22px">
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
            </Glass>
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
