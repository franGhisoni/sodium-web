import { Layout } from '../components/Layout';
import { ArticleLinks, FeatureGrid, PageHero, Rich, SectionHead } from '../components/PageParts';
import { CTA } from '../components/CTA';
import { ARTICLES, articleBySlug } from '../content/recursosMeta';
import { BODIES } from '../content/recursos';
import { SERVICE_LINKS } from '../content/servicios';

const dateLabel = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export default function Articulo({ slug = '' }: { slug?: string }) {
  const a = articleBySlug(slug);
  const body = BODIES[slug];
  if (!a || !body) return null;
  const more = ARTICLES.filter((o) => o.slug !== slug).slice(0, 3).map((o) => o.slug);
  return (
    <Layout>
      <PageHero path={`/recursos/${slug}`} kicker="GUÍA" title={a.title} sub={a.summary}>
        <p className="page-meta">
          Sodium Software · <time dateTime={a.published}>{dateLabel(a.published)}</time>
        </p>
      </PageHero>
      <section className="section section--page">
        <div className="section-inner">
          <article className="prose">
            {body.map((b, i) => {
              if ('h2' in b) return <h2 key={i}>{b.h2}</h2>;
              if ('p' in b) return <p key={i}><Rich text={b.p} /></p>;
              const items = 'ul' in b ? b.ul : b.ol;
              const List = 'ul' in b ? 'ul' : 'ol';
              return (
                <List key={i}>
                  {items.map((t) => <li key={t}><Rich text={t} /></li>)}
                </List>
              );
            })}
          </article>
        </div>
      </section>
      <section className="section section--page">
        <div className="section-inner">
          <SectionHead kicker="SERVICIOS" title={<>Lo que hacemos <em>en Sodium.</em></>} />
          <FeatureGrid items={SERVICE_LINKS} />
        </div>
      </section>
      <section className="section section--page">
        <div className="section-inner">
          <SectionHead kicker="MÁS GUÍAS" title={<>Seguí <em>leyendo.</em></>} />
          <ArticleLinks slugs={more} />
        </div>
      </section>
      <CTA />
    </Layout>
  );
}
