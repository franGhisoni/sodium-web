import { Glass } from './Glass';
import './sections.css';

interface ClientItem {
  id: string;
  name: string;
  tag: string;
  sector: string;
  role: string;
  desc: string;
  highlight: string;
  logo: string;
  logoClass?: string;
  link?: string;
}

const CLIENTS: ClientItem[] = [
  {
    id: 'rutini',
    name: 'Rutini Wines',
    tag: 'BODEGA · TRADESITE B2B',
    sector: 'Vitivinicultura & Exportación',
    role: 'Portal B2B & Tradesite',
    desc: 'Diseño y desarrollo de plataforma centralizada de activos de marca, marketing y especificaciones técnicas para distribuidores, mayoristas y vinotecas a nivel global.',
    highlight: 'Acceso internacional · Catálogo digital unificado',
    logo: '/clients/rutini.png',
    logoClass: 'client-logo--invert',
    link: 'https://rutiniwines.com',
  },
  {
    id: 'escorihuela',
    name: 'Escorihuela Gascón',
    tag: 'HOSPITALITY · LUXURY WEB',
    sector: 'Bodega Centenaria',
    role: 'Experiencia Digital Rosaura',
    desc: 'Showcase web inmersivo para el vino icono Rosaura con scroll parallax, estética editorial de alta gama y conexión directa a la tienda oficial.',
    highlight: '4.2× conversión vs. sitio anterior · Parallax interactivo',
    logo: '/clients/escorihuela.webp',
    logoClass: 'client-logo--invert client-logo--eg',
    link: 'https://escorihuela.com/rosaura/',
  },
  {
    id: 'flux-one',
    name: 'Flux One',
    tag: 'AGENCIA GROWTH · INFRAESTRUCTURA IA',
    sector: 'Marketing & Consumer First',
    role: 'Dashboards Analíticos & Lead Scoring IA',
    desc: 'Infraestructura comercial y dashboards analíticos multi-marca con IA para seguimiento de inversión publicitaria y sistemas de respuesta inmediata en WhatsApp.',
    highlight: '$29.4M USD analizados · Calificación de leads 24/7',
    logo: '/clients/fluxone.png',
    logoClass: 'client-logo--flux',
  },
  {
    id: 'appterix',
    name: 'Appterix',
    tag: 'SOFTWARE FACTORY · IA INTEGRATIONS',
    sector: 'Tecnología & Automatización',
    role: 'Pipelines & Agentes de Datos',
    desc: 'Automatización integral de ingesta y procesamiento de información, pipelines de contenido impulsados por IA y conectores con herramientas de gestión empresarial.',
    highlight: 'Flujos continuos asíncronos · Human-in-the-loop',
    logo: '/clients/appterix.png',
    logoClass: 'client-logo--invert client-logo--appterix',
    link: 'https://appterix.info',
  },
  {
    id: 'concrete-charleston',
    name: 'Concrete Charleston',
    tag: 'CONSTRUCTION TECH · CHARLESTON, SC',
    sector: 'Contratista Arquitectónico (USA)',
    role: 'Plataforma Digital & Inbound Funnel',
    desc: 'Solución web y embudo comercial para la contratista de concreto líder del Lowcountry en Carolina del Sur, optimizada para cotizaciones residenciales y proyectos comerciales.',
    highlight: 'Operaciones en USA · Pipeline de cotizaciones',
    logo: '/clients/concrete-charleston.svg',
    logoClass: 'client-logo--cc',
    link: 'https://concretecharleston.com',
  },
  {
    id: 'politica-del-sur',
    name: 'Política del Sur',
    tag: 'MEDIO EDITORIAL · PIPELINE IA',
    sector: 'Prensa & Noticias Digitales',
    role: 'Motor de Procesamiento Hermes',
    desc: 'Implementación del pipeline Hermes: scraping multicanal automatizado, scoring temático, deduplicación semántica con pgvector y panel de redacción asistida.',
    highlight: '540 artículos / día procesados · 12 fuentes integradas',
    logo: '/clients/politica-del-sur.svg',
    logoClass: 'client-logo--pds',
    link: 'https://politicadelsur.com',
  },
  {
    id: 'pellegrinet',
    name: 'Pellegrinet Seguros',
    tag: 'INSURTECH · AGENTE IA CRM',
    sector: 'Productores Asesores de Seguros',
    role: 'Asistente IA WhatsApp & AdminSE',
    desc: 'Capa conversacional de inteligencia artificial para cotización inmediata de pólizas y atención omnicanal sincronizada de forma transparente con el sistema de gestión AdminSE.',
    highlight: 'Triage automatizado · Integración directa con CRM',
    logo: '/clients/pellegrinet.svg',
    logoClass: 'client-logo--pellegrinet',
  },
];

export function Clientes() {
  return (
    <section className="section section-clientes" id="clientes">
      <div className="section-inner">
        <header className="section-head">
          <span className="pill">
            <span className="pill-dot" />
            CLIENTES &amp; COLABORACIONES
          </span>
          <h2 className="section-title">
            Empresas con las que <em>trabajamos.</em>
          </h2>
          <p className="section-sub">
            Diseñamos e implementamos sistemas para bodegas de renombre internacional, agencias de escala, medios de comunicación y empresas de servicios.
          </p>
        </header>

        {/* Marquee strip of all logos */}
        <div className="client-strip-wrap">
          <div className="client-strip">
            {CLIENTS.concat(CLIENTS).map((c, i) => (
              <div key={`${c.id}-${i}`} className="client-strip-item">
                <img
                  src={c.logo}
                  alt={`${c.name} logo`}
                  className={`client-strip-logo ${c.logoClass || ''}`}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Grid of Clients */}
        <div className="client-grid">
          {CLIENTS.map((c, i) => (
            <Glass key={c.id} className="client-card" padding="26px 24px">
              <div className="client-card-top">
                <span className="client-card-tag">{c.tag}</span>
                <span className="client-card-num">/0{i + 1}</span>
              </div>

              <div className="client-card-logo-box">
                <img
                  src={c.logo}
                  alt={`${c.name} logo`}
                  className={`client-card-logo ${c.logoClass || ''}`}
                  loading="lazy"
                />
              </div>

              <div className="client-card-body">
                <h3 className="client-card-name">{c.name}</h3>
                <p className="client-card-sector">{c.sector}</p>
                <p className="client-card-desc">{c.desc}</p>
              </div>

              <div className="client-card-footer">
                <div className="client-card-highlight">
                  <span className="client-stat-dot" />
                  <span>{c.highlight}</span>
                </div>
                {c.link && (
                  <a
                    href={c.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="client-link"
                    title={`Visitar sitio de ${c.name}`}
                  >
                    Visitar ↗
                  </a>
                )}
              </div>
            </Glass>
          ))}
        </div>
      </div>
    </section>
  );
}
