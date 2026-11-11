import { QUESTIONS } from './content/faq';

/**
 * Schema.org structured data for the home page, written into the HTML at
 * build time (scripts/prerender.mjs). Only facts the site itself states:
 * name, contact channels, city, LinkedIn and the services it describes.
 */
export const SITE_URL = 'https://sodium.ar';

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;
const PAGE_ID = `${SITE_URL}/#webpage`;

const SERVICES = [
  {
    name: 'Desarrollo de software a medida',
    description:
      'Diseño y desarrollo de sistemas, aplicaciones empresariales y plataformas web a medida, integrados a la operación de cada empresa.',
  },
  {
    name: 'Desarrollo de software con inteligencia artificial',
    description:
      'Integración de los mejores modelos de IA del mercado en flujos de trabajo reales: copilotos, búsqueda sobre el conocimiento de la empresa (RAG) y asistentes con revisión humana.',
  },
  {
    name: 'Automatización de procesos y agentes de IA',
    description:
      'Agentes operativos que reciben pedidos, coordinan acciones y resuelven tareas dentro de límites claros, observables y con trazabilidad.',
  },
  {
    name: 'Integraciones de sistemas',
    description:
      'Conexión de la IA y el software con las herramientas y datos que el equipo ya usa: CRM, ERP, APIs y bases de datos.',
  },
  {
    name: 'Diagnóstico y adopción de IA',
    description:
      'Mapeo de la operación para priorizar dónde la IA genera impacto, y acompañamiento del equipo con métricas y mejora continua después del lanzamiento.',
  },
];

export function structuredData(): object {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': ORG_ID,
        name: 'Sodium Software',
        alternateName: ['Sodium', 'Sodium Software Factory'],
        description:
          'Software factory argentina con base en Buenos Aires, especializada en desarrollo de software a medida e inteligencia artificial aplicada para empresas.',
        url: `${SITE_URL}/`,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/icon-512.png`,
          width: 512,
          height: 512,
        },
        image: `${SITE_URL}/og-image.jpg`,
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
        makesOffer: SERVICES.map((s) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: s.name,
            description: s.description,
            serviceType: s.name,
            provider: { '@id': ORG_ID },
            areaServed: { '@type': 'Country', name: 'Argentina' },
          },
        })),
      },
      {
        '@type': 'WebSite',
        '@id': SITE_ID,
        url: `${SITE_URL}/`,
        name: 'Sodium Software',
        alternateName: 'Sodium',
        inLanguage: 'es-AR',
        publisher: { '@id': ORG_ID },
      },
      {
        '@type': 'WebPage',
        '@id': PAGE_ID,
        url: `${SITE_URL}/`,
        name: 'Sodium Software — Software factory: software a medida e IA',
        inLanguage: 'es-AR',
        isPartOf: { '@id': SITE_ID },
        about: { '@id': ORG_ID },
        primaryImageOfPage: `${SITE_URL}/og-image.jpg`,
      },
      {
        '@type': 'FAQPage',
        '@id': `${SITE_URL}/#faq`,
        isPartOf: { '@id': PAGE_ID },
        inLanguage: 'es-AR',
        mainEntity: QUESTIONS.map((q) => ({
          '@type': 'Question',
          name: q.question,
          acceptedAnswer: { '@type': 'Answer', text: q.answer },
        })),
      },
    ],
  };
}

/** JSON-LD script tag, with `<` escaped so the content can't close the tag. */
export function structuredDataTag(): string {
  const json = JSON.stringify(structuredData()).replace(/</g, '\\u003c');
  return `<script type="application/ld+json">${json}</script>`;
}
