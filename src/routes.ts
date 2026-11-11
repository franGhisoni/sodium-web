import type { ComponentType } from 'react';
import { CASES } from './content/casos';
import { ARTICLES } from './content/recursosMeta';

/**
 * Every public page of the site. The build prerenders one HTML file per
 * route (scripts/prerender.mjs) with its own title, description, canonical,
 * Open Graph and structured data, and the sitemap is generated from this
 * list. In the browser, main.tsx loads only the page for the current URL.
 */
export type PageKind = 'home' | 'service' | 'cases' | 'case' | 'about' | 'contact' | 'resources' | 'article';

export interface Crumb {
  name: string;
  path: string;
}

export interface Route {
  /** Canonical path, no trailing slash ("/" for the home page). */
  path: string;
  title: string;
  description: string;
  kind: PageKind;
  /** Breadcrumb trail after "Inicio", ending with this page. */
  crumbs?: Crumb[];
  /** For service pages: the Service name in structured data. */
  serviceName?: string;
  /** Props passed to the page component (e.g. a case or article slug). */
  props?: Record<string, string>;
  load: () => Promise<{ default: ComponentType<Record<string, string>> }>;
}

const SERVICES: Route[] = [
  {
    path: '/software-factory',
    title: 'Software Factory Argentina | Sodium',
    description:
      'Sodium es una software factory argentina con base en Buenos Aires: desarrollamos software a medida e integramos inteligencia artificial y automatización en empresas.',
    kind: 'service',
    serviceName: 'Software factory',
    crumbs: [{ name: 'Software factory', path: '/software-factory' }],
    load: () => import('./pages/SoftwareFactory'),
  },
  {
    path: '/software-a-medida',
    title: 'Desarrollo de Software a Medida | Sodium',
    description:
      'Desarrollo de software a medida para empresas: sistemas de gestión, plataformas, aplicaciones e integraciones construidas sobre tu operación, con mantenimiento y evolución.',
    kind: 'service',
    serviceName: 'Desarrollo de software a medida',
    crumbs: [{ name: 'Software a medida', path: '/software-a-medida' }],
    load: () => import('./pages/SoftwareAMedida'),
  },
  {
    path: '/desarrollo-ia',
    title: 'Desarrollo de Inteligencia Artificial para Empresas | Sodium',
    description:
      'IA aplicada a la operación de tu empresa: agentes, asistentes, IA generativa y procesamiento de información integrados con tus sistemas, con control humano.',
    kind: 'service',
    serviceName: 'Desarrollo de inteligencia artificial para empresas',
    crumbs: [{ name: 'Desarrollo de IA', path: '/desarrollo-ia' }],
    load: () => import('./pages/DesarrolloIA'),
  },
  {
    path: '/automatizacion',
    title: 'Automatización de Procesos Empresariales | Sodium',
    description:
      'Automatización de procesos con workflows, integraciones por API e inteligencia artificial: menos tareas manuales y datos al día, con trazabilidad y control del equipo.',
    kind: 'service',
    serviceName: 'Automatización de procesos empresariales',
    crumbs: [{ name: 'Automatización', path: '/automatizacion' }],
    load: () => import('./pages/Automatizacion'),
  },
];

const CASE_ROUTES: Route[] = CASES.map((c) => ({
  path: `/casos-de-exito/${c.slug}`,
  title: `${c.name}: caso de éxito | Sodium`,
  description: c.desc.length > 158 ? `${c.desc.slice(0, c.desc.lastIndexOf(' ', 155))}…` : c.desc,
  kind: 'case',
  crumbs: [
    { name: 'Casos de éxito', path: '/casos-de-exito' },
    { name: c.name, path: `/casos-de-exito/${c.slug}` },
  ],
  props: { slug: c.slug },
  load: () => import('./pages/CasoPage'),
}));

const ARTICLE_ROUTES: Route[] = ARTICLES.map((a) => ({
  path: `/recursos/${a.slug}`,
  title: `${a.title} | Sodium`,
  description: a.description,
  kind: 'article',
  crumbs: [
    { name: 'Recursos', path: '/recursos' },
    { name: a.title, path: `/recursos/${a.slug}` },
  ],
  props: { slug: a.slug },
  load: () => import('./pages/Articulo'),
}));

export const ROUTES: Route[] = [
  {
    path: '/',
    title: 'Sodium Software — Software factory: software a medida e IA',
    description:
      'Sodium Software es una software factory de Buenos Aires: desarrollamos software a medida para empresas e integramos IA y automatización en sus procesos.',
    kind: 'home',
    load: () => import('./pages/Home'),
  },
  ...SERVICES,
  {
    path: '/casos-de-exito',
    title: 'Casos de éxito: software a medida e IA en producción | Sodium',
    description:
      'Proyectos reales de Sodium: agentes de IA, sistemas de gestión, plataformas clínicas, retail y medios. Qué problema resolvimos y cómo funciona cada uno.',
    kind: 'cases',
    crumbs: [{ name: 'Casos de éxito', path: '/casos-de-exito' }],
    load: () => import('./pages/CasosIndex'),
  },
  ...CASE_ROUTES,
  {
    path: '/nosotros',
    title: 'Nosotros: quiénes somos | Sodium Software',
    description:
      'Quiénes somos: Sodium es una software factory de Buenos Aires especializada en software a medida e IA aplicada. Misión, visión, forma de trabajo y clientes.',
    kind: 'about',
    crumbs: [{ name: 'Nosotros', path: '/nosotros' }],
    load: () => import('./pages/Nosotros'),
  },
  {
    path: '/contacto',
    title: 'Contacto: consultá tu proyecto | Sodium',
    description:
      'Contactá a Sodium para desarrollar software a medida o integrar IA en tu empresa. Brief de 30 minutos por WhatsApp, email o LinkedIn. Buenos Aires, Argentina.',
    kind: 'contact',
    crumbs: [{ name: 'Contacto', path: '/contacto' }],
    load: () => import('./pages/Contacto'),
  },
  {
    path: '/recursos',
    title: 'Recursos: guías sobre software a medida, IA y automatización | Sodium',
    description:
      'Guías de Sodium para decidir y planificar: qué es una software factory, costos y plazos de un software a medida, cómo implementar IA y automatizar procesos.',
    kind: 'resources',
    crumbs: [{ name: 'Recursos', path: '/recursos' }],
    load: () => import('./pages/RecursosIndex'),
  },
  ...ARTICLE_ROUTES,
];

/** "/x/" and "/x" are the same page; unknown paths fall back to null. */
export function findRoute(pathname: string): Route | null {
  const path = pathname.replace(/\/+$/, '') || '/';
  return ROUTES.find((r) => r.path === path) ?? null;
}
