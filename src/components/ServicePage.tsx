import type { ReactNode } from 'react';
import { Layout } from './Layout';
import { ArticleLinks, CaseList, FeatureGrid, PageHero, SectionHead } from './PageParts';
import { Proceso } from './Proceso';
import { CTA } from './CTA';
import type { Feature } from '../content/servicios';
import type { Case } from '../content/casos';

export interface ServiceBlock {
  kicker: string;
  title: ReactNode;
  sub?: ReactNode;
  items: Feature[];
}

interface ServicePageProps {
  path: string;
  kicker: string;
  title: ReactNode;
  sub: ReactNode;
  blocks: ServiceBlock[];
  showProcess?: boolean;
  casesTitle: ReactNode;
  cases: Case[];
  articles: string[];
}

/** Template for the service pages: hero, content blocks, process, cases, guides, CTA. */
export function ServicePage({ path, kicker, title, sub, blocks, showProcess, casesTitle, cases, articles }: ServicePageProps) {
  return (
    <Layout>
      <PageHero path={path} kicker={kicker} title={title} sub={sub} />
      {blocks.map((b) => (
        <section className="section section--page" key={b.kicker}>
          <div className="section-inner">
            <SectionHead kicker={b.kicker} title={b.title} sub={b.sub} />
            <FeatureGrid items={b.items} />
          </div>
        </section>
      ))}
      {showProcess && <Proceso />}
      <section className="section section--page" id="casos">
        <div className="section-inner">
          <SectionHead
            kicker="CASOS DE ÉXITO"
            title={casesTitle}
            sub={<>Proyectos reales en producción. <a className="text-link" href="/casos-de-exito">Ver todos los casos de éxito</a>.</>}
          />
          <CaseList cases={cases} />
        </div>
      </section>
      <section className="section section--page">
        <div className="section-inner">
          <SectionHead kicker="RECURSOS" title={<>Guías para <em>decidir mejor.</em></>} />
          <ArticleLinks slugs={articles} />
        </div>
      </section>
      <CTA />
    </Layout>
  );
}
