import { Layout } from '../components/Layout';
import { PageHero } from '../components/PageParts';
import { Glass } from '../components/Glass';
import { CTA } from '../components/CTA';
import { ARTICLES } from '../content/recursosMeta';

export default function RecursosIndex() {
  return (
    <Layout>
      <PageHero
        path="/recursos"
        kicker="RECURSOS"
        title={<>Guías sobre software a medida, <em>IA y automatización.</em></>}
        sub="Respuestas claras para decidir y planificar un proyecto: qué es una software factory, de qué dependen el costo y los plazos, y cómo implementar IA o automatizar procesos."
        secondary={{ href: '/software-factory', label: 'Conocé Sodium' }}
      />
      <section className="section section--page">
        <div className="section-inner">
          <div className="cap-grid page-grid">
            {ARTICLES.map((a) => (
              <Glass key={a.slug} className="cap-card page-card" padding="26px 24px 22px">
                <h2 className="cap-title">
                  <a href={`/recursos/${a.slug}`}>{a.title}</a>
                </h2>
                <p className="cap-body">{a.summary}</p>
                <a className="case-link page-card-link" href={`/recursos/${a.slug}`} aria-hidden="true" tabIndex={-1}>
                  Leer guía →
                </a>
              </Glass>
            ))}
          </div>
        </div>
      </section>
      <CTA />
    </Layout>
  );
}
