/** A card: title, text (may hold [label](/path) links) and optional link. */
export type Feature = [title: string, text: string, href?: string];

/** The four services, each linking to its page (home and inner pages). */
export const SERVICE_LINKS: Feature[] = [
  [
    'Software factory',
    'Un equipo que diseña, desarrolla y mantiene tu software de punta a punta, o que se integra con el tuyo.',
    '/software-factory',
  ],
  [
    'Software a medida',
    'Sistemas de gestión, plataformas, aplicaciones e integraciones construidos sobre cómo trabaja tu empresa.',
    '/software-a-medida',
  ],
  [
    'Inteligencia artificial',
    'Agentes, asistentes y búsqueda sobre el conocimiento interno, integrados con tus sistemas y con control humano.',
    '/desarrollo-ia',
  ],
  [
    'Automatización de procesos',
    'Integraciones por API y flujos automáticos para dejar atrás las cargas manuales, con trazabilidad.',
    '/automatizacion',
  ],
];

export const SERVICE_NAMES: Record<string, string> = {
  'software-a-medida': 'Software a medida',
  'desarrollo-ia': 'Desarrollo de IA',
  automatizacion: 'Automatización',
};
