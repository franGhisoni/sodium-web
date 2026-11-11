import { DETALLE_ETERNA, DETALLE_FLUX, DETALLE_INSTITUTO, DETALLE_LAKSHMI, DETALLE_METRON, DETALLE_ZELLGO, DETALLE_ZURGO } from './casosDetalle';

/** Service pages a case is linked to (and links back from). */
export type ServiceSlug = 'software-a-medida' | 'desarrollo-ia' | 'automatizacion';

export interface DetailSection {
  title: string;
  lead: string;
  grid?: Array<[string, string]>;
  flow?: Array<[string, string]>;
  notes?: string[];
}

/**
 * Real projects shown on the home page and on /casos-de-exito. Every field
 * here is the project's own copy; the detail pages only re-arrange it.
 */
export interface Case {
  id: string;
  /** URL segment of the case page: /casos-de-exito/<slug>. */
  slug: string;
  services: ServiceSlug[];
  tag: string;
  name: string;
  desc: string;
  stat: string;
  live?: string;
  img?: string;
  featured?: boolean;
  chips?: string[];
  /** Long-form detail rendered by its own component. */
  detail?: 'impacto';
  sections?: DetailSection[];
  liveLabel?: string;
}

export const CASES: Case[] = [
  {
    id: 'peitho',
    slug: 'peitho',
    services: ['desarrollo-ia', 'automatizacion'],
    img: '/cases/peitho.webp',
    tag: 'AGENTE IA · COMERCIAL',
    name: 'Peitho',
    desc: 'Agente que atiende, califica y cierra leads por WhatsApp, Instagram y web. Integrado al CRM.',
    stat: '+187% leads calificados / mes',
    live: 'https://peitho.ghisoni.com.ar/',
  },
  {
    id: 'peitho-estates',
    slug: 'peitho-estates',
    services: ['desarrollo-ia', 'software-a-medida'],
    img: '/cases/peitho-estates.webp',
    tag: 'AGENTE IA · REAL ESTATE',
    name: 'Peitho · Real Estate',
    desc: 'CRM inmobiliario con agente conversacional: pipeline de leads con scoring IA, agenda de visitas, siguiente mejor acción y reactivación de contactos fríos.',
    stat: 'Score IA por lead · 5 etapas de pipeline',
    live: 'https://demo.peitho.ghisoni.com.ar/',
  },
  {
    id: 'sodium-retail',
    slug: 'sodium-retail',
    services: ['software-a-medida'],
    img: '/cases/retail.webp',
    tag: 'GESTIÓN · RETAIL',
    name: 'Sodium Retail',
    desc: 'Una plataforma para varios negocios: kiosco, supermercado, ferretería y alquiler de ski, cada uno con su caja, stock, usuarios y facturación electrónica, y un panel para verlos todos juntos.',
    stat: 'Factura A y B con ARCA · vende sin internet',
    live: 'https://sodium-retail-production.up.railway.app/',
  },
  {
    id: 'impacto-castex',
    slug: 'impacto-castex',
    services: ['software-a-medida', 'desarrollo-ia', 'automatizacion'],
    img: '/cases/impacto.webp',
    tag: 'MEDIO DIGITAL · NOTICIAS',
    name: 'Impacto Castex',
    desc: 'Diario digital de Eduardo Castex, La Pampa: sitio público con radio en vivo y panel de redacción accesible, que recibe notas por API desde un motor de noticias con IA y genera placas y copys para redes generados con IA.',
    stat: 'En producción · impactocastex.com.ar',
    live: 'https://impactocastex.com.ar/',
    liveLabel: 'Abrir el diario',
    detail: 'impacto',
  },
  {
    id: 'flux',
    slug: 'flux-marketing',
    services: ['desarrollo-ia', 'automatizacion', 'software-a-medida'],
    tag: 'DASHBOARD · ADS',
    name: 'Flux Marketing',
    desc: 'Análisis de inversión publicitaria multi-marca con insight IA. Series temporales con brush.',
    stat: '$29.4M USD analizados',
    live: 'https://flux-dashboard-production.up.railway.app/marca-test',
    sections: DETALLE_FLUX,
  },
  {
    id: 'rosaura',
    slug: 'rosaura',
    services: ['software-a-medida'],
    img: '/cases/rosaura.webp',
    tag: 'WEB · HOSPITALITY',
    name: 'Rosaura',
    desc: 'Sitio para experiencia gastronómica premium de Escorihuela Gascón. Diseño editorial, reservas integradas.',
    stat: '4.2× conversión vs. sitio anterior',
    live: 'https://escorihuela.com/rosaura/',
  },
  {
    id: 'eterna',
    slug: 'eterna',
    services: ['desarrollo-ia', 'software-a-medida'],
    tag: 'AGENTE IA · ESTÉTICA',
    name: 'Eterna',
    desc: 'Sitio y reservas para un centro de depilación láser y estética médica en Lomas de Zamora: chat con IA, seña por Mercado Pago o transferencia y panel interno.',
    stat: 'Chat de reservas · seña · panel de pacientes',
    sections: DETALLE_ETERNA,
  },
  {
    id: 'metron',
    slug: 'metron',
    services: ['software-a-medida'],
    tag: 'PRODUCTO · FINTECH',
    name: 'Metron',
    desc: 'Plataforma de finanzas personales: tracking de gastos, presupuestos, metas, clasificación automática.',
    stat: '99.98% uptime · 18 meses',
    live: 'https://metron.ghisoni.com.ar/',
    sections: DETALLE_METRON,
  },
  {
    id: 'zellgo',
    slug: 'zellgo',
    services: ['software-a-medida', 'automatizacion'],
    tag: 'ERP/CRM · INVERSIONES',
    name: 'Zellgo',
    desc: 'ERP/CRM para administradora financiera. Clientes, leads, pagos, membresías, reportería custom.',
    stat: '60.450 registros operativos',
    sections: DETALLE_ZELLGO,
  },
  {
    id: 'zurgo',
    slug: 'zur-go',
    services: ['desarrollo-ia', 'software-a-medida'],
    img: '/cases/zurgo.webp',
    live: 'https://demo-production-9fef.up.railway.app/',
    tag: 'AGENTE IA · MOVILIDAD',
    name: 'Zur Go',
    desc: 'Pedidos de remis por WhatsApp con IA: el asistente toma origen y destino, cotiza sobre la ruta real y cobra con Mercado Pago. El pedido llega al panel con el chofer más cercano sugerido, y el pasajero ve el auto moverse en el mapa.',
    stat: 'WhatsApp · despacho · app del chofer · seguimiento en vivo',
    sections: DETALLE_ZURGO,
  },
  {
    id: 'house24',
    slug: 'house24',
    services: ['software-a-medida'],
    img: '/cases/house24.webp',
    live: 'https://house24-demo-production.up.railway.app/',
    tag: 'GESTIÓN · SALUD DOMICILIARIA',
    name: 'House24',
    desc: 'Plataforma de asistencia domiciliaria: los médicos cargan y firman sus informes, la coordinación gestiona pacientes, cupos y visitas, y la jefatura ve toda la operación. Con ruteo de visitas, informes por obra social y app para el médico.',
    stat: 'Informes firmados · ruteo de visitas · PAMI y obras sociales',
  },
  {
    id: 'instituto-ghisoni',
    slug: 'instituto-ghisoni',
    services: ['software-a-medida'],
    img: '/cases/instituto.webp',
    tag: 'SISTEMA CLÍNICO · SALUD',
    name: 'Instituto Ghisoni',
    desc: 'Sistema clínico para consultorios de ginecología: agenda sin solapamientos, fichas de pacientes, consultas, estudios en PDF, roles con auditoría y migración del sistema anterior.',
    stat: 'Agenda · Historia clínica · Roles y auditoría',
    sections: DETALLE_INSTITUTO,
  },
  {
    id: 'lakshmi',
    slug: 'lakshmi-intencionate',
    services: ['software-a-medida', 'desarrollo-ia'],
    img: '/cases/lakshmi.webp',
    tag: 'ECOSISTEMA · EXPERIENCIA 3D · AGENTE IA',
    name: 'Lakshmi · Intencionate',
    desc: 'Una reserva que se siente como un objeto: el golden ticket 3D se entrega con una animación de entrada, se gira con el dedo o el mouse y se rasga por la línea perforada para confirmar el turno. Detrás, un ecosistema completo para Lakshmi Masajes: sitio React, agente conversacional con la voz de la marca, vouchers de regalo y panel de gestión por roles.',
    stat: 'Ticket 3D en tiempo real · reservas · vouchers · panel',
    live: 'https://lakshmi.sodium.ghisoni.com.ar/ticket',
    featured: true,
    chips: ['WebGL / Three.js', 'Material holográfico', 'Talón con QR', 'Chat con IA', 'Panel por roles'],
    sections: DETALLE_LAKSHMI,
  },
];

export const caseBySlug = (slug: string) => CASES.find((c) => c.slug === slug);
