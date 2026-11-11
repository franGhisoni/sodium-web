import type { ReactNode } from 'react';
import { Layout } from '../components/Layout';
import { CaseList, PageHero, SectionHead } from '../components/PageParts';
import { CTA } from '../components/CTA';
import { CASES, type ServiceSlug } from '../content/casos';

const GROUPS: Array<{ service: ServiceSlug; kicker: string; title: ReactNode; href: string; link: string }> = [
  { service: 'desarrollo-ia', kicker: 'INTELIGENCIA ARTIFICIAL', title: <>Agentes y <em>IA aplicada.</em></>, href: '/desarrollo-ia', link: 'desarrollo de IA para empresas' },
  { service: 'software-a-medida', kicker: 'SOFTWARE A MEDIDA', title: <>Sistemas de gestión <em>y plataformas.</em></>, href: '/software-a-medida', link: 'desarrollo de software a medida' },
];

export default function CasosIndex() {
  const ia = new Set(CASES.filter((c) => c.services.includes('desarrollo-ia')).map((c) => c.id));
  const lists = [
    CASES.filter((c) => ia.has(c.id)),
    CASES.filter((c) => !ia.has(c.id)),
  ];
  return (
    <Layout>
      <PageHero
        path="/casos-de-exito"
        kicker="CASOS DE ÉXITO"
        title={<>Casos de éxito: <em>software a medida e IA en producción.</em></>}
        sub="Proyectos reales de Sodium: agentes de IA, sistemas de gestión, plataformas clínicas, retail y medios. Qué problema resolvimos y cómo funciona cada uno."
        secondary={{ href: '/software-factory', label: 'Cómo trabajamos' }}
      />
      {GROUPS.map((g, i) => (
        <section className="section section--page" key={g.service}>
          <div className="section-inner">
            <SectionHead
              kicker={g.kicker}
              title={g.title}
              sub={<>Más sobre nuestro servicio de <a className="text-link" href={g.href}>{g.link}</a>.</>}
            />
            <CaseList cases={lists[i]} />
          </div>
        </section>
      ))}
      <CTA />
    </Layout>
  );
}
