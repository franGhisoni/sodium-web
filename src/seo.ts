import { QUESTIONS } from './content/faq';
import { articleBySlug } from './content/recursosMeta';
import { ROUTES, type Route } from './routes';

/**
 * Schema.org structured data for each page, written into the HTML at build
 * time (scripts/prerender.mjs). Only facts the site itself states: name,
 * contact channels, city, LinkedIn, services, cases and guides. No ratings,
 * reviews, prices or street address.
 */
export const SITE_URL = 'https://sodium.ar';

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export const pageUrl = (path: string) => (path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`);

const SERVICE_ROUTES = ROUTES.filter((r) => r.kind === 'service');

function organization(): object {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: 'Sodium Software',
    alternateName: ['Sodium', 'Sodium Software Factory'],
    description:
      'Software factory argentina con base en Buenos Aires, especializada en desarrollo de software a medida, inteligencia artificial aplicada y automatización de procesos para empresas.',
    url: `${SITE_URL}/`,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/icon-512.png`,
      width: 512,
      height: 512,
    },
    image: OG_IMAGE,
    email: 'contacto@sodium.com.ar',
    telephone: '+54 11 2591 8111',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ciudad Autónoma de Buenos Aires',
      addressRegion: 'Buenos Aires',
      addressCountry: 'AR',
    },
    areaServed: { '@type': 'Country', name: 'Argentina' },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: 'contacto@sodium.com.ar',
      telephone: '+54 11 2591 8111',
      availableLanguage: ['es'],
      url: `${SITE_URL}/contacto`,
    },
    sameAs: ['https://www.linkedin.com/in/sodium-software-9500b43b2/'],
    knowsAbout: [
      'Software factory',
      'Desarrollo de software a medida',
      'Inteligencia artificial',
      'Automatización de procesos',
      'Agentes de IA',
      'Aplicaciones empresariales',
      'Integración de sistemas',
    ],
    makesOffer: SERVICE_ROUTES.map((r) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        '@id': `${pageUrl(r.path)}#service`,
        name: r.serviceName,
        url: pageUrl(r.path),
      },
    })),
  };
}

function website(): object {
  return {
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: `${SITE_URL}/`,
    name: 'Sodium Software',
    alternateName: 'Sodium',
    inLanguage: 'es-AR',
    publisher: { '@id': ORG_ID },
  };
}

function service(r: Route): object {
  return {
    '@type': 'Service',
    '@id': `${pageUrl(r.path)}#service`,
    name: r.serviceName,
    serviceType: r.serviceName,
    description: r.description,
    url: pageUrl(r.path),
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'Country', name: 'Argentina' },
  };
}

const PAGE_TYPE: Record<Route['kind'], string> = {
  home: 'WebPage',
  service: 'WebPage',
  cases: 'CollectionPage',
  case: 'WebPage',
  about: 'AboutPage',
  contact: 'ContactPage',
  resources: 'CollectionPage',
  article: 'WebPage',
};

export function structuredData(route: Route): object {
  const url = pageUrl(route.path);
  const pageId = `${url}#webpage`;
  const graph: object[] = [organization(), website()];

  graph.push({
    '@type': PAGE_TYPE[route.kind],
    '@id': pageId,
    url,
    name: route.title,
    description: route.description,
    inLanguage: 'es-AR',
    isPartOf: { '@id': SITE_ID },
    about: { '@id': route.kind === 'service' ? `${url}#service` : ORG_ID },
    primaryImageOfPage: OG_IMAGE,
    ...(route.crumbs ? { breadcrumb: { '@id': `${url}#breadcrumb` } } : {}),
  });

  if (route.crumbs) {
    const trail = [{ name: 'Inicio', path: '/' }, ...route.crumbs];
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: trail.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
        item: pageUrl(c.path),
      })),
    });
  }

  if (route.kind === 'home' || route.kind === 'service') {
    for (const r of route.kind === 'home' ? SERVICE_ROUTES : [route]) graph.push(service(r));
  }

  if (route.kind === 'article') {
    const a = articleBySlug(route.props?.slug ?? '');
    if (a) {
      graph.push({
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: a.title,
        description: a.description,
        datePublished: a.published,
        dateModified: a.published,
        inLanguage: 'es-AR',
        image: OG_IMAGE,
        author: { '@id': ORG_ID },
        publisher: { '@id': ORG_ID },
        mainEntityOfPage: { '@id': pageId },
      });
    }
  }

  if (route.kind === 'home') {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      isPartOf: { '@id': pageId },
      inLanguage: 'es-AR',
      mainEntity: QUESTIONS.map((q) => ({
        '@type': 'Question',
        name: q.question,
        acceptedAnswer: { '@type': 'Answer', text: q.answer },
      })),
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

/** JSON-LD script tag, with `<` escaped so the content can't close the tag. */
export function structuredDataTag(route: Route): string {
  const json = JSON.stringify(structuredData(route)).replace(/</g, '\\u003c');
  return `<script type="application/ld+json">${json}</script>`;
}
