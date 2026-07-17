import { useEffect, useState } from 'react';
import { Glass } from './Glass';
import './sections.css';

interface Case {
  id: string;
  tag: string;
  name: string;
  desc: string;
  stat: string;
  live?: string;
  shot: () => React.ReactElement;
}

const CASES: Case[] = [
  {
    id: 'peitho',
    tag: 'AGENTE IA · COMERCIAL',
    name: 'Peitho',
    desc: 'Agente que atiende, califica y cierra leads por WhatsApp, Instagram y web. Integrado al CRM.',
    stat: '+187% leads calificados / mes',
    live: 'https://peitho.ghisoni.com.ar/',
    shot: ShotPeitho,
  },
  {
    id: 'peitho-estates',
    tag: 'AGENTE IA · REAL ESTATE',
    name: 'Peitho · Real Estate',
    desc: 'CRM inmobiliario con agente conversacional: pipeline de leads con scoring IA, agenda de visitas, siguiente mejor acción y reactivación de contactos fríos.',
    stat: 'Score IA por lead · 5 etapas de pipeline',
    live: 'https://demo.peitho.ghisoni.com.ar/',
    shot: ShotPeithoEstates,
  },
  {
    id: 'hermes',
    tag: 'PLATAFORMA · NOTICIAS',
    name: 'Hermes',
    desc: 'Procesamiento automático de noticias con scoring, agrupación por tema y editor multi-medio.',
    stat: '540 artículos / día · 12 medios',
    shot: ShotHermes,
  },
  {
    id: 'flux',
    tag: 'DASHBOARD · ADS',
    name: 'Flux Marketing',
    desc: 'Análisis de inversión publicitaria multi-marca con insight IA. Series temporales con brush.',
    stat: '$29.4M USD analizados',
    live: 'https://flux-dashboard-production.up.railway.app/marca-test',
    shot: ShotFlux,
  },
  {
    id: 'rosaura',
    tag: 'WEB · HOSPITALITY',
    name: 'Rosaura',
    desc: 'Sitio para experiencia gastronómica premium de Escorihuela Gascón. Diseño editorial, reservas integradas.',
    stat: '4.2× conversión vs. sitio anterior',
    live: 'https://escorihuela.com/rosaura/',
    shot: ShotRosaura,
  },
  {
    id: 'metron',
    tag: 'PRODUCTO · FINTECH',
    name: 'Metron',
    desc: 'Plataforma de finanzas personales: tracking de gastos, presupuestos, metas, clasificación automática.',
    stat: '99.98% uptime · 18 meses',
    live: 'https://metron.ghisoni.com.ar/',
    shot: ShotMetron,
  },
  {
    id: 'zellgo',
    tag: 'ERP/CRM · INVERSIONES',
    name: 'Zellgo',
    desc: 'ERP/CRM para administradora financiera. Clientes, leads, pagos, membresías, reportería custom.',
    stat: '60.450 registros operativos',
    shot: ShotZellgo,
  },
];

export function Casos() {
  const [active, setActive] = useState<Case | null>(null);

  return (
    <section className="section" id="casos">
      <div className="section-inner">
        <header className="section-head">
          <span className="pill">
            <span className="pill-dot" />
            CASOS
          </span>
          <h2 className="section-title">
            Problemas reales. <em>Sistemas en operación.</em>
          </h2>
          <p className="section-sub">
            Distintas formas de aplicar tecnología para mover una operación: vender mejor,
            ordenar conocimiento, procesar información y acelerar decisiones.
          </p>
        </header>

        <div className="case-grid">
          {CASES.map((c, i) => (
            <Glass key={c.id} className="case-card" padding="18px" onClick={() => setActive(c)}>
              <div className="case-shot">
                <c.shot />
                <span className="case-load-btn" aria-hidden="true">
                  <span>+</span> Ver detalle
                </span>
              </div>
              <div className="case-meta">
                <span>{c.tag}</span>
                <span>/0{i + 1}</span>
              </div>
              <h3 className="case-name">{c.name}</h3>
              <p className="case-desc">{c.desc}</p>
              <div className="case-stat">
                <span className="case-stat-dot" />
                <span>{c.stat}</span>
                {c.live && (
                  <a
                    href={c.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="case-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Ver live ↗
                  </a>
                )}
              </div>
            </Glass>
          ))}
        </div>
      </div>

      {active && <CaseModal c={active} onClose={() => setActive(null)} />}
    </section>
  );
}

function CaseModal({ c, onClose }: { c: Case; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div className="case-modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="case-modal"
        role="dialog"
        aria-modal="true"
        aria-label={c.name}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="case-modal-close" onClick={onClose} aria-label="Cerrar">
          ✕
        </button>
        <div className="case-modal-shot">
          <c.shot />
        </div>
        <div className="case-modal-body">
          <span className="case-modal-tag">{c.tag}</span>
          <h3 className="case-modal-name">{c.name}</h3>
          <p className="case-modal-desc">{c.desc}</p>
          <div className="case-modal-stat">
            <span className="case-stat-dot" />
            <span>{c.stat}</span>
          </div>
          <div className="case-modal-actions">
            {c.live && (
              <a href={c.live} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                Abrir demo
                <span className="btn-arrow" aria-hidden="true">↗</span>
              </a>
            )}
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Generative SVG shots (one per case) ──────────────────────── */

function ShotPeitho() {
  return (
    <svg viewBox="0 0 280 175" preserveAspectRatio="xMidYMid slice">
      <rect width="280" height="175" fill="#f4ecd8" />
      <text x="20" y="32" fontSize="9" fill="#5a3a1a" fontFamily="ui-monospace, monospace" letterSpacing="2">AGENTE COMERCIAL DE IA</text>
      <text x="20" y="78" fontSize="28" fill="#1a1410" fontFamily="ui-sans-serif" fontWeight="600" letterSpacing="-1.2">El vendedor</text>
      <text x="20" y="108" fontSize="28" fill="#1a1410" fontFamily="ui-sans-serif" fontWeight="600" letterSpacing="-1.2">que nunca duerme.</text>
      <rect x="20" y="128" width="110" height="28" rx="14" fill="#1a1410" />
      <text x="75" y="146" fontSize="10" fill="#f4ecd8" textAnchor="middle" fontFamily="ui-monospace, monospace" letterSpacing="1.5">AGENDAR DEMO →</text>
    </svg>
  );
}

function ShotPeithoEstates() {
  const cols: Array<[string, number, Array<[string, string, number]>]> = [
    ['NUEVO', 3, [['Sofia A.', 'Compra 3 amb · USD 180-220k', 94], ['Martin C.', 'Alquiler temp. · Palermo', 67]]],
    ['CALIFICADO', 3, [['Diego F.', 'Inversión en pozo · USD 120k', 76], ['Carolina R.', 'Venta + recompra', 82]]],
    ['VISITA', 1, [['Valentina P.', 'Primer hogar · Nuñez', 89]]],
    ['OFERTA', 1, [['Hernan S.', 'Oferta por PH · USD 165k', 96]]],
  ];
  return (
    <svg viewBox="0 0 280 175" preserveAspectRatio="xMidYMid slice">
      <rect width="280" height="175" fill="#f8fafd" />
      <text x="14" y="19" fontSize="9" fill="#0f1729" fontFamily="ui-sans-serif" fontWeight="700">Peitho <tspan fill="#2563eb">Real Estate</tspan></text>
      <text x="14" y="31" fontSize="6.5" fill="#64748b" fontFamily="ui-monospace, monospace" letterSpacing="1">CRM + AGENTE CONVERSACIONAL · PIPELINE</text>
      {cols.map(([title, count, cards], ci) => (
        <g key={ci}>
          <text x={14 + ci * 66} y="48" fontSize="6" fill="#64748b" fontFamily="ui-monospace, monospace" letterSpacing="1">{title}</text>
          <circle cx={14 + ci * 66 + 48} cy="45.5" r="5" fill="#e3ebfa" />
          <text x={14 + ci * 66 + 48} y="48" fontSize="6" fill="#2563eb" textAnchor="middle" fontFamily="ui-sans-serif" fontWeight="700">{count}</text>
          {cards.map(([name, det, score], i) => (
            <g key={i}>
              <rect x={14 + ci * 66} y={56 + i * 52} width="58" height="46" rx="5" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.8" />
              <text x={19 + ci * 66} y={68 + i * 52} fontSize="6.5" fill="#0f1729" fontFamily="ui-sans-serif" fontWeight="600">{name}</text>
              <rect x={14 + ci * 66 + 42} y={61 + i * 52} width="12" height="8" rx="4" fill="#2563eb" />
              <text x={14 + ci * 66 + 48} y={67.2 + i * 52} fontSize="5" fill="#ffffff" textAnchor="middle" fontFamily="ui-sans-serif" fontWeight="700">{score}</text>
              <text x={19 + ci * 66} y={78 + i * 52} fontSize="4.6" fill="#64748b" fontFamily="ui-sans-serif">{det}</text>
              <rect x={19 + ci * 66} y={86 + i * 52} width="16" height="7" rx="3.5" fill="#eff4fd" />
              <text x={27 + ci * 66} y={91.4 + i * 52} fontSize="4.2" fill="#2563eb" textAnchor="middle" fontFamily="ui-sans-serif" fontWeight="600">IA</text>
              <text x={40 + ci * 66} y={91.4 + i * 52} fontSize="4.2" fill="#94a3b8" fontFamily="ui-sans-serif">Avanzar →</text>
            </g>
          ))}
        </g>
      ))}
      <text x="14" y="168" fontSize="6" fill="#94a3b8" fontFamily="ui-monospace, monospace" letterSpacing="0.5">SIGUIENTE MEJOR ACCIÓN · REACTIVACIÓN AUTOMÁTICA</text>
    </svg>
  );
}

function ShotHermes() {
  return (
    <svg viewBox="0 0 280 175" preserveAspectRatio="xMidYMid slice">
      <rect width="280" height="175" fill="#f5ecd8" />
      <text x="14" y="20" fontSize="10" fill="#1a1410" fontFamily="ui-sans-serif" fontWeight="700">Hermes</text>
      <text x="60" y="20" fontSize="7" fill="#5a3a1a" fontFamily="ui-monospace, monospace" letterSpacing="1.5">PLATAFORMA AUTOMÁTICA DE NOTICIAS</text>
      <text x="14" y="42" fontSize="13" fill="#1a1410" fontFamily="ui-sans-serif" fontWeight="600" letterSpacing="-0.5">Noticias procesadas</text>
      {[0, 1, 2, 3].map(i => (
        <g key={i}>
          <rect x={14 + i * 65} y="52" width="58" height="48" fill="#1a2838" />
          <rect x={62 + i * 65} y="55" width="22" height="9" fill="#f5ecd8" />
          <text x={73 + i * 65} y="62" fontSize="5" fill="#1a1410" textAnchor="middle" fontFamily="ui-monospace, monospace">Score: 4</text>
          <rect x={14 + i * 65} y="106" width="58" height="2.5" fill="#1a1410" />
          <rect x={14 + i * 65} y="112" width="48" height="1.5" fill="#5a3a1a" />
          <rect x={14 + i * 65} y="116" width="52" height="1.5" fill="#5a3a1a" />
          <rect x={14 + i * 65} y="120" width="40" height="1.5" fill="#5a3a1a" />
        </g>
      ))}
      <text x="14" y="150" fontSize="8" fill="#5a3a1a" fontFamily="ui-monospace, monospace" letterSpacing="1">540 ARTÍCULOS · PÁG 1 DE 12</text>
    </svg>
  );
}

function ShotFlux() {
  return (
    <svg viewBox="0 0 280 175" preserveAspectRatio="xMidYMid slice">
      <rect width="280" height="175" fill="#0d1117" />
      <text x="14" y="18" fontSize="9" fill="#f0f6fc" fontFamily="ui-sans-serif" fontWeight="600" letterSpacing="-0.3">MetaAds <tspan fill="#7c8cff">Detalle</tspan></text>
      <text x="14" y="32" fontSize="7" fill="#8b949e" fontFamily="ui-monospace, monospace">Marca Test · Mensual · Tienda</text>
      <defs>
        <linearGradient id="fluxGr" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#7c8cff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#7c8cff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M20,148 L40,124 L60,134 L80,100 L100,116 L120,72 L140,90 L160,42 L180,68 L200,30 L220,52 L240,32 L260,22 L260,160 L20,160 Z" fill="url(#fluxGr)" />
      <path d="M20,148 L40,124 L60,134 L80,100 L100,116 L120,72 L140,90 L160,42 L180,68 L200,30 L220,52 L240,32 L260,22" fill="none" stroke="#7c8cff" strokeWidth="1.2" />
      {[[40, 124], [80, 100], [120, 72], [160, 42], [200, 30], [240, 32], [260, 22]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.8" fill="#f0f6fc" />
      ))}
      <rect x="156" y="44" width="78" height="38" rx="3" fill="#161b22" stroke="#7c8cff" strokeWidth="0.5" />
      <text x="162" y="56" fontSize="7" fill="#f0f6fc" fontFamily="ui-monospace, monospace" fontWeight="600">julio 2025</text>
      <text x="162" y="66" fontSize="6" fill="#c9d1d9" fontFamily="ui-monospace, monospace">Inversión $1.23M</text>
      <text x="162" y="74" fontSize="6" fill="#c9d1d9" fontFamily="ui-monospace, monospace">CTR 1.92% · CPC $169</text>
    </svg>
  );
}

function ShotRosaura() {
  return (
    <svg viewBox="0 0 280 175" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="rosaGr" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#3a1a14" />
          <stop offset="100%" stopColor="#7a3520" />
        </linearGradient>
      </defs>
      <rect width="280" height="175" fill="url(#rosaGr)" />
      <text x="140" y="86" fontSize="42" fill="#f4d49a" fontFamily="ui-serif, Georgia" fontStyle="italic" textAnchor="middle" letterSpacing="-2">Rosaura</text>
      <line x1="100" y1="100" x2="180" y2="100" stroke="#f4d49a" strokeOpacity="0.5" strokeWidth="0.5" />
      <text x="140" y="118" fontSize="7" fill="#f4d49a" fillOpacity="0.85" textAnchor="middle" fontFamily="ui-monospace, monospace" letterSpacing="3">ESCORIHUELA GASCÓN · MENDOZA</text>
      <rect x="100" y="134" width="80" height="22" rx="11" fill="none" stroke="#f4d49a" strokeOpacity="0.7" strokeWidth="0.5" />
      <text x="140" y="148" fontSize="8" fill="#f4d49a" textAnchor="middle" fontFamily="ui-monospace, monospace" letterSpacing="2">RESERVAR</text>
    </svg>
  );
}

function ShotMetron() {
  return (
    <svg viewBox="0 0 280 175" preserveAspectRatio="xMidYMid slice">
      <rect width="280" height="175" fill="#0a1322" />
      <text x="14" y="20" fontSize="9" fill="#f4f8fc" fontFamily="ui-sans-serif" fontWeight="600">Metron · Finanzas personales</text>
      <text x="14" y="34" fontSize="7" fill="#94a8bd" fontFamily="ui-monospace, monospace" letterSpacing="0.5">Saldo · noviembre</text>
      <text x="14" y="62" fontSize="24" fill="#f4f8fc" fontFamily="ui-sans-serif" fontWeight="500" letterSpacing="-1">$ 1.284.430</text>
      <text x="130" y="62" fontSize="10" fill="#7fc89a" fontFamily="ui-monospace, monospace">+12.4%</text>
      {[
        ['Vivienda', 78, '#7faacf'],
        ['Comida', 52, '#7fc89a'],
        ['Transporte', 34, '#cf9f7f'],
        ['Suscripciones', 20, '#cf7f9f'],
      ].map(([n, w, c], i) => (
        <g key={i}>
          <text x="14" y={92 + i * 18} fontSize="8" fill="#cfdce9" fontFamily="ui-monospace, monospace">{n}</text>
          <rect x="100" y={86 + i * 18} width="160" height="6" rx="3" fill="#1a3148" />
          <rect x="100" y={86 + i * 18} width={(w as number) * 1.6} height="6" rx="3" fill={c as string} />
          <text x="266" y={92 + i * 18} fontSize="6" fill="#94a8bd" fontFamily="ui-monospace, monospace" textAnchor="end">{w}%</text>
        </g>
      ))}
    </svg>
  );
}

function ShotZellgo() {
  return (
    <svg viewBox="0 0 280 175" preserveAspectRatio="xMidYMid slice">
      <rect width="280" height="175" fill="#0a0a14" />
      <rect x="0" y="0" width="60" height="175" fill="#12121a" />
      <text x="10" y="18" fontSize="8" fill="#f4f8fc" fontFamily="ui-sans-serif" fontWeight="600">Zellgo</text>
      {['Clientes', 'Leads', 'Pagos', 'Membresías', 'Negocio', 'Gestión'].map((n, i) => (
        <text key={i} x="10" y={38 + i * 16} fontSize="7" fill={i === 0 ? '#f4f8fc' : '#94a8bd'} fontFamily="ui-sans-serif">{n}</text>
      ))}
      <g fontFamily="ui-monospace, monospace" fontSize="7" fill="#cfdce9">
        <text x="72" y="22" fill="#f4f8fc" fontSize="11" fontWeight="600">Clientes</text>
        <text x="72" y="36" fill="#94a8bd" fontSize="7">60.450 registros</text>
        <text x="72" y="58" fill="#66798e" letterSpacing="0.5">ID · APELLIDO · NOMBRE · EMAIL</text>
        {[
          ['4791', 'VALDEZ', 'SAMUEL'],
          ['29', 'MARTIN', 'MARIA'],
          ['34', 'ROJAS', 'JAVIER'],
          ['19256', 'OVIEDO', 'GRACIELA'],
          ['50', 'CAU', 'ANALIA'],
        ].map((r, i) => (
          <g key={i}>
            <line x1="72" x2="270" y1={66 + i * 16} y2={66 + i * 16} stroke="#f4f8fc" strokeOpacity="0.06" />
            <text x="72" y={78 + i * 16}>{r[0]}</text>
            <text x="112" y={78 + i * 16}>{r[1]}</text>
            <text x="180" y={78 + i * 16}>{r[2]}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}
