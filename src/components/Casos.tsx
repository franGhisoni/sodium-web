import { useEffect, useState } from 'react';
import {
  CasoDetalle,
  DETALLE_ETERNA,
  DETALLE_FLUX,
  DETALLE_HERMES,
  DETALLE_INSTITUTO,
  DETALLE_LAKSHMI,
  DETALLE_METRON,
  DETALLE_ZELLGO,
  DETALLE_ZURGO,
  type DetailSection,
} from './CasoDetalle';
import { CasoImpacto } from './CasoImpacto';
import { Glass } from './Glass';
import './sections.css';

interface Case {
  id: string;
  tag: string;
  name: string;
  desc: string;
  stat: string;
  live?: string;
  img?: string;
  featured?: boolean;
  chips?: string[];
  shot?: () => React.ReactElement;
  detail?: () => React.ReactElement;
  sections?: DetailSection[];
  liveLabel?: string;
}

const CASES: Case[] = [
  {
    id: 'peitho',
    img: '/cases/peitho.png',
    tag: 'AGENTE IA · COMERCIAL',
    name: 'Peitho',
    desc: 'Agente que atiende, califica y cierra leads por WhatsApp, Instagram y web. Integrado al CRM.',
    stat: '+187% leads calificados / mes',
    live: 'https://peitho.ghisoni.com.ar/',
    shot: ShotPeitho,
  },
  {
    id: 'peitho-estates',
    img: '/cases/peitho-estates.png',
    tag: 'AGENTE IA · REAL ESTATE',
    name: 'Peitho · Real Estate',
    desc: 'CRM inmobiliario con agente conversacional: pipeline de leads con scoring IA, agenda de visitas, siguiente mejor acción y reactivación de contactos fríos.',
    stat: 'Score IA por lead · 5 etapas de pipeline',
    live: 'https://demo.peitho.ghisoni.com.ar/',
    shot: ShotPeithoEstates,
  },
  {
    id: 'sodium-retail',
    img: '/cases/retail.jpg',
    tag: 'GESTIÓN · RETAIL',
    name: 'Sodium Retail',
    desc: 'Una plataforma para varios negocios: kiosco, supermercado, ferretería y alquiler de ski, cada uno con su caja, stock, usuarios y facturación electrónica, y un panel para verlos todos juntos.',
    stat: 'Factura A y B con ARCA · vende sin internet',
    live: 'https://sodium-retail-production.up.railway.app/',
  },
  {
    id: 'impacto-castex',
    img: '/cases/impacto.jpg',
    tag: 'MEDIO DIGITAL · NOTICIAS',
    name: 'Impacto Castex',
    desc: 'Diario digital de Eduardo Castex, La Pampa: sitio público con radio en vivo y panel de redacción accesible, integrado con Hermes y con placas y copys para redes generados con IA.',
    stat: 'En producción · impactocastex.com.ar',
    live: 'https://impactocastex.com.ar/',
    liveLabel: 'Abrir el diario',
    detail: CasoImpacto,
  },
  {
    id: 'hermes',
    tag: 'PLATAFORMA · NOTICIAS',
    name: 'Hermes',
    desc: 'Procesamiento automático de noticias con scoring, agrupación por tema y editor multi-medio.',
    stat: '540 artículos / día · 12 medios',
    shot: ShotHermes,
    sections: DETALLE_HERMES,
  },
  {
    id: 'flux',
    tag: 'DASHBOARD · ADS',
    name: 'Flux Marketing',
    desc: 'Análisis de inversión publicitaria multi-marca con insight IA. Series temporales con brush.',
    stat: '$29.4M USD analizados',
    live: 'https://flux-dashboard-production.up.railway.app/marca-test',
    shot: ShotFlux,
    sections: DETALLE_FLUX,
  },
  {
    id: 'rosaura',
    img: '/cases/rosaura.jpg',
    tag: 'WEB · HOSPITALITY',
    name: 'Rosaura',
    desc: 'Sitio para experiencia gastronómica premium de Escorihuela Gascón. Diseño editorial, reservas integradas.',
    stat: '4.2× conversión vs. sitio anterior',
    live: 'https://escorihuela.com/rosaura/',
    shot: ShotRosaura,
  },
  {
    id: 'eterna',
    tag: 'AGENTE IA · ESTÉTICA',
    name: 'Eterna',
    desc: 'Sitio y reservas para un centro de depilación láser y estética médica en Lomas de Zamora: chat con IA, seña por Mercado Pago o transferencia y panel interno.',
    stat: 'Chat de reservas · seña · panel de pacientes',
    shot: ShotEterna,
    sections: DETALLE_ETERNA,
  },
  {
    id: 'metron',
    tag: 'PRODUCTO · FINTECH',
    name: 'Metron',
    desc: 'Plataforma de finanzas personales: tracking de gastos, presupuestos, metas, clasificación automática.',
    stat: '99.98% uptime · 18 meses',
    live: 'https://metron.ghisoni.com.ar/',
    shot: ShotMetron,
    sections: DETALLE_METRON,
  },
  {
    id: 'zellgo',
    tag: 'ERP/CRM · INVERSIONES',
    name: 'Zellgo',
    desc: 'ERP/CRM para administradora financiera. Clientes, leads, pagos, membresías, reportería custom.',
    stat: '60.450 registros operativos',
    shot: ShotZellgo,
    sections: DETALLE_ZELLGO,
  },
  {
    id: 'zurgo',
    img: '/cases/zurgo.jpg',
    live: 'https://demo-production-9fef.up.railway.app/',
    tag: 'AGENTE IA · MOVILIDAD',
    name: 'Zur Go',
    desc: 'Pedidos de remis por WhatsApp con IA: el asistente toma origen y destino, cotiza sobre la ruta real y cobra con Mercado Pago. El pedido llega al panel con el chofer más cercano sugerido, y el pasajero ve el auto moverse en el mapa.',
    stat: 'WhatsApp · despacho · app del chofer · seguimiento en vivo',
    shot: ShotZurgo,
    sections: DETALLE_ZURGO,
  },
  {
    id: 'instituto-ghisoni',
    img: '/cases/instituto.png',
    tag: 'SISTEMA CLÍNICO · SALUD',
    name: 'Instituto Ghisoni',
    desc: 'Sistema clínico para consultorios de ginecología: agenda sin solapamientos, fichas de pacientes, consultas, estudios en PDF, roles con auditoría y migración del sistema anterior.',
    stat: 'Agenda · Historia clínica · Roles y auditoría',
    shot: ShotInstituto,
    sections: DETALLE_INSTITUTO,
  },
  {
    id: 'lakshmi',
    img: '/cases/lakshmi.jpg',
    tag: 'ECOSISTEMA · EXPERIENCIA 3D · AGENTE IA',
    name: 'Lakshmi · Intencionate',
    desc: 'Una reserva que se siente como un objeto: el golden ticket 3D se entrega con una animación de entrada, se gira con el dedo o el mouse y se rasga por la línea perforada para confirmar el turno. Detrás, un ecosistema completo para Lakshmi Masajes: sitio React, agente conversacional con la voz de la marca, vouchers de regalo y panel de gestión por roles.',
    stat: 'Ticket 3D en tiempo real · reservas · vouchers · panel',
    live: 'https://lakshmi.sodium.ghisoni.com.ar/ticket',
    featured: true,
    chips: ['WebGL / Three.js', 'Material holográfico', 'Talón con QR', 'Chat con IA', 'Panel por roles'],
    shot: ShotLakshmi,
    sections: DETALLE_LAKSHMI,
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

        {CASES.filter((c) => c.featured).map((c) => (
          <Glass key={c.id} className="case-feature" material="holo" padding="22px" onClick={() => setActive(c)}>
            <div className="case-feature-inner">
              <div className="case-shot case-feature-shot">
                <CaseShot c={c} />
              </div>
              <div className="case-feature-body">
                <span className="case-feature-badge">DESTACADO · EXPERIENCIA 3D</span>
                <span className="case-meta-tag">{c.tag}</span>
                <h3 className="case-feature-name">{c.name}</h3>
                <p className="case-desc">{c.desc}</p>
                <ul className="case-chips">
                  {c.chips?.map((chip) => (
                    <li key={chip}>{chip}</li>
                  ))}
                </ul>
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
                      Probar el ticket 3D ↗
                    </a>
                  )}
                </div>
              </div>
            </div>
          </Glass>
        ))}

        <div className="case-grid">
          {CASES.filter((c) => !c.featured).map((c, i) => (
            <Glass key={c.id} className="case-card" padding="18px" onClick={() => setActive(c)}>
              <div className="case-shot">
                <CaseShot c={c} />
                <span className={`case-load-btn${hasDetail(c) ? ' is-visible' : ''}`} aria-hidden="true">
                  <span>+</span> {hasDetail(c) ? 'Ver caso completo' : 'Ver detalle'}
                </span>
              </div>
              <div className="case-meta">
                <span>{c.tag}</span>
                <span>/{String(i + 1).padStart(2, '0')}</span>
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

const hasDetail = (c: Case) => Boolean(c.detail || c.sections);

function CaseShot({ c }: { c: Case }) {
  if (c.img) {
    return <img src={c.img} alt={`Captura de ${c.name}`} loading="lazy" decoding="async" />;
  }
  return c.shot ? <c.shot /> : null;
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
        className={`case-modal${hasDetail(c) ? ' case-modal--wide' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={c.name}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="case-modal-close" onClick={onClose} aria-label="Cerrar">
          ✕
        </button>
        <div className="case-modal-shot">
          <CaseShot c={c} />
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
                {c.liveLabel ?? 'Abrir demo'}
                <span className="btn-arrow" aria-hidden="true">↗</span>
              </a>
            )}
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cerrar
            </button>
          </div>
          {c.detail && <c.detail />}
          {c.sections && <CasoDetalle sections={c.sections} />}
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

function ShotInstituto() {
  const rows: Array<[string, string, string]> = [
    ['09:00', 'Paciente A.', 'Consultorio 1'],
    ['09:30', 'Paciente B.', 'Consultorio 2'],
    ['10:00', 'Paciente C.', 'Consultorio 1'],
    ['10:30', 'Paciente D.', 'Consultorio 2'],
  ];
  return (
    <svg viewBox="0 0 280 175" preserveAspectRatio="xMidYMid slice">
      <rect width="280" height="175" fill="#f6f9f9" />
      <rect x="0" y="0" width="58" height="175" fill="#0f3d3e" />
      <text x="10" y="20" fontSize="8" fill="#e6f2f1" fontFamily="ui-sans-serif" fontWeight="700">Instituto</text>
      {['Agenda', 'Pacientes', 'Estudios', 'Config.'].map((n, i) => (
        <text key={i} x="10" y={44 + i * 16} fontSize="7" fill={i === 0 ? '#ffffff' : '#8fb8b6'} fontFamily="ui-sans-serif">{n}</text>
      ))}
      <text x="72" y="22" fontSize="11" fill="#0f2a2b" fontFamily="ui-sans-serif" fontWeight="600">Agenda del día</text>
      <text x="72" y="34" fontSize="6.5" fill="#5b7a79" fontFamily="ui-monospace, monospace" letterSpacing="1">DATOS FICTICIOS · DEMO</text>
      {rows.map(([h, n, c], i) => (
        <g key={i}>
          <rect x="72" y={46 + i * 28} width="196" height="22" rx="4" fill="#ffffff" stroke="#d5e3e2" strokeWidth="0.8" />
          <rect x="72" y={46 + i * 28} width="3" height="22" rx="1.5" fill={i % 2 ? '#2f9e9a' : '#0f3d3e'} />
          <text x="82" y={60 + i * 28} fontSize="7" fill="#0f2a2b" fontFamily="ui-monospace, monospace" fontWeight="600">{h}</text>
          <text x="118" y={60 + i * 28} fontSize="7" fill="#0f2a2b" fontFamily="ui-sans-serif">{n}</text>
          <text x="262" y={60 + i * 28} fontSize="6" fill="#5b7a79" textAnchor="end" fontFamily="ui-sans-serif">{c}</text>
        </g>
      ))}
    </svg>
  );
}

function ShotLakshmi() {
  return (
    <svg viewBox="0 0 280 175" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="lakGlow" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0%" stopColor="#f2c96b" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#f2c96b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="lakGold" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#f7e2a3" />
          <stop offset="45%" stopColor="#d9a93f" />
          <stop offset="100%" stopColor="#8a5f17" />
        </linearGradient>
      </defs>
      <rect width="280" height="175" fill="#050505" />
      <rect width="280" height="175" fill="url(#lakGlow)" />
      {Array.from({ length: 28 }, (_, i) => (
        <circle key={i} cx={(i * 97) % 280} cy={(i * 53) % 175} r={0.6 + (i % 3) * 0.4} fill="#f2e8d5" fillOpacity={0.25 + (i % 4) * 0.12} />
      ))}
      <g transform="rotate(-8 140 88)">
        <rect x="50" y="52" width="180" height="76" rx="6" fill="url(#lakGold)" />
        <rect x="55" y="57" width="170" height="66" rx="4" fill="none" stroke="#fff3c9" strokeOpacity="0.6" strokeWidth="0.6" />
        <line x1="182" y1="54" x2="182" y2="126" stroke="#3b2a08" strokeOpacity="0.65" strokeWidth="1" strokeDasharray="2 3" />
        <text x="66" y="80" fontSize="8" fill="#3b2a08" fontFamily="ui-serif, Georgia" letterSpacing="3">LAKSHMI</text>
        <text x="66" y="104" fontSize="16" fill="#2a1d05" fontFamily="ui-serif, Georgia" fontStyle="italic">Volvé a vos</text>
        <rect x="192" y="76" width="26" height="26" rx="2" fill="#2a1d05" fillOpacity="0.85" />
        <rect x="196" y="80" width="6" height="6" fill="#f7e2a3" />
        <rect x="208" y="80" width="6" height="6" fill="#f7e2a3" />
        <rect x="196" y="92" width="6" height="6" fill="#f7e2a3" />
        <rect x="206" y="90" width="4" height="4" fill="#f7e2a3" />
      </g>
      <text x="140" y="158" fontSize="6.5" fill="#d9d2c4" fillOpacity="0.7" textAnchor="middle" fontFamily="ui-monospace, monospace" letterSpacing="2.5">GOLDEN TICKET · 3D EN TIEMPO REAL</text>
    </svg>
  );
}

function ShotZurgo() {
  return (
    <svg viewBox="0 0 280 175" preserveAspectRatio="xMidYMid slice">
      <rect width="280" height="175" fill="#0b1220" />
      <g stroke="#1c2a44" strokeWidth="6" fill="none" strokeLinecap="round">
        <path d="M-10 120 L90 100 L170 130 L290 90" />
        <path d="M60 -10 L80 90 L70 190" />
        <path d="M170 -10 L170 130 L200 190" />
      </g>
      <g stroke="#162238" strokeWidth="2" fill="none">
        <path d="M-10 60 L290 40" />
        <path d="M120 -10 L130 190" />
        <path d="M230 -10 L240 190" />
      </g>
      <path d="M80 90 L90 100 L170 130 L215 112" fill="none" stroke="#7aa2ff" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 5" />
      <circle cx="80" cy="90" r="5" fill="#7aa2ff" />
      <circle cx="80" cy="90" r="10" fill="#7aa2ff" fillOpacity="0.2" />
      <circle cx="215" cy="112" r="5" fill="#7fc89a" />
      {[[120, 118], [185, 70], [40, 140]].map(([x, y], i) => (
        <g key={i}>
          <rect x={x - 5} y={y - 3} width="10" height="6" rx="2" fill="#f4f8fc" fillOpacity="0.85" />
        </g>
      ))}
      <g transform="translate(150 118)">
        <rect x="-6" y="-4" width="12" height="8" rx="2.5" fill="#f5c451" />
      </g>
      <rect x="170" y="14" width="96" height="48" rx="6" fill="#0f1a2e" stroke="#7aa2ff" strokeOpacity="0.35" />
      <rect x="178" y="22" width="62" height="12" rx="4" fill="#1d2d4a" />
      <text x="184" y="31" fontSize="6.5" fill="#cfdce9" fontFamily="ui-sans-serif">Un remis a Hospital Evita</text>
      <rect x="196" y="38" width="62" height="16" rx="4" fill="#1f4d3a" />
      <text x="202" y="48" fontSize="6.5" fill="#bfe9cf" fontFamily="ui-sans-serif">Cotizado · MP ✓</text>
      <text x="14" y="22" fontSize="11" fill="#f4f8fc" fontFamily="ui-serif, Georgia" letterSpacing="3">ZUR GO</text>
      <text x="14" y="34" fontSize="6.5" fill="#94a8bd" fontFamily="ui-monospace, monospace" letterSpacing="1.5">3 AUTOS · 1 VIAJE EN CURSO</text>
    </svg>
  );
}

function ShotEterna() {
  return (
    <svg viewBox="0 0 280 175" preserveAspectRatio="xMidYMid slice">
      <rect width="280" height="175" fill="#f6efe9" />
      <text x="20" y="44" fontSize="26" fill="#3a2a26" fontFamily="ui-serif, Georgia" letterSpacing="1">Eterna</text>
      <text x="20" y="60" fontSize="6.5" fill="#8a6f66" fontFamily="ui-monospace, monospace" letterSpacing="1.5">ESTÉTICA MÉDICA · LOMAS DE ZAMORA</text>
      <rect x="20" y="78" width="136" height="24" rx="10" fill="#ffffff" stroke="#e6d8cf" />
      <text x="30" y="93" fontSize="7.5" fill="#3a2a26" fontFamily="ui-sans-serif">¿Tienen turno para el jueves?</text>
      <rect x="92" y="110" width="168" height="24" rx="10" fill="#3a2a26" />
      <text x="102" y="125" fontSize="7.5" fill="#f6efe9" fontFamily="ui-sans-serif">Sí, a las 16 h. ¿Te reservo el lugar?</text>
      <rect x="196" y="142" width="64" height="18" rx="9" fill="#c98f7b" />
      <text x="228" y="154" fontSize="7" fill="#ffffff" textAnchor="middle" fontFamily="ui-sans-serif" fontWeight="600">Pagar seña</text>
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
