/**
 * Guides in /recursos: the list and metadata only (light, shared with the
 * route table). The article bodies live in recursos.ts and load only on the
 * article pages.
 */
export interface ArticleMeta {
  slug: string;
  title: string;
  description: string;
  /** One-line answer shown on the index card. */
  summary: string;
  published: string;
}

export const ARTICLES: ArticleMeta[] = [
  {
    slug: 'que-es-una-software-factory',
    title: '¿Qué es una software factory?',
    description:
      'Qué es una software factory, qué hace, en qué se diferencia de una agencia o de un equipo interno y cuándo conviene contratar una para desarrollar software a medida.',
    summary:
      'Un equipo externo que diseña, construye y mantiene software a medida para otras empresas. Qué incluye y cuándo conviene.',
    published: '2026-11-11',
  },
  {
    slug: 'cuanto-cuesta-un-software-a-medida',
    title: '¿Cuánto cuesta desarrollar un software a medida?',
    description:
      'De qué depende el costo de un software a medida: alcance, integraciones, usuarios, IA, infraestructura y mantenimiento. Cómo pedir un presupuesto comparable.',
    summary:
      'No hay un precio de lista: depende del alcance, las integraciones y lo que pasa después del lanzamiento. Qué mirar para estimarlo.',
    published: '2026-11-11',
  },
  {
    slug: 'cuanto-tarda-desarrollar-un-software',
    title: '¿Cuánto tarda desarrollar un software?',
    description:
      'Plazos reales de un desarrollo de software a medida, etapa por etapa: diagnóstico, priorización, diseño, implementación y adopción. Qué acelera y qué demora un proyecto.',
    summary:
      'Un diagnóstico en 48 horas, una intervención puntual en semanas y un sistema integrado en 4 a 10 semanas de implementación.',
    published: '2026-11-11',
  },
  {
    slug: 'software-a-medida-vs-software-estandar',
    title: 'Software a medida vs. software estándar: cuál conviene',
    description:
      'Diferencias entre software a medida y software estándar (enlatado o SaaS): costo, tiempo, ajuste al proceso, integraciones y propiedad. Cuándo conviene cada uno.',
    summary:
      'El estándar resuelve lo común rápido; el a medida resuelve lo que te diferencia. Cómo decidir sin dogmas.',
    published: '2026-11-11',
  },
  {
    slug: 'como-implementar-ia-en-una-empresa',
    title: 'Cómo implementar inteligencia artificial en una empresa',
    description:
      'Guía práctica para implementar IA en una empresa: elegir el proceso, definir qué hace la IA y qué decide el equipo, integrar con tus sistemas y medir resultados.',
    summary:
      'Empezar por un problema concreto, no por la herramienta. Los pasos para pasar de la prueba a un sistema que el equipo usa.',
    published: '2026-11-11',
  },
  {
    slug: 'como-automatizar-procesos-empresariales',
    title: 'Cómo automatizar procesos empresariales',
    description:
      'Cómo automatizar procesos en una empresa: detectar tareas repetitivas, conectar sistemas por API, sumar IA donde hay texto o criterio y mantener el control humano.',
    summary:
      'Qué procesos conviene automatizar primero, cómo conectar los sistemas y dónde suma la IA.',
    published: '2026-11-11',
  },
];

export const articleBySlug = (slug: string) => ARTICLES.find((a) => a.slug === slug);
