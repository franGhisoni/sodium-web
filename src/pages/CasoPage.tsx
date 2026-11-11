import { Layout } from '../components/Layout';
import { CaseList, PageHero, SectionHead } from '../components/PageParts';
import { CaseShot } from '../components/CaseShots';
import { CasoDetalle } from '../components/CasoDetalle';
import { CasoImpacto } from '../components/CasoImpacto';
import { CTA } from '../components/CTA';
import { Glass } from '../components/Glass';
import { CASES, caseBySlug } from '../content/casos';
import { SERVICE_NAMES } from '../content/servicios';
import { useContactLink } from '../contact';

export default function CasoPage({ slug = '' }: { slug?: string }) {
  const c = caseBySlug(slug);
  const contact = useContactLink();
  if (!c) return null;
  const others = CASES.filter((o) => o.id !== c.id && o.services.some((s) => c.services.includes(s))).slice(0, 3);
  return (
    <Layout>
      <PageHero
        path={`/casos-de-exito/${c.slug}`}
        kicker={c.tag}
        title={c.name}
        sub={c.desc}
      >
        <div className="hero-actions">
          {c.live && (
            <a href={c.live} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              {c.liveLabel ?? 'Ver en vivo'}
              <span className="btn-arrow" aria-hidden="true">↗</span>
            </a>
          )}
          <a {...contact} className={`btn ${c.live ? 'btn-ghost' : 'btn-primary'}`}>
            Hablar con Sodium
            <span className="btn-arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </PageHero>

      <section className="section section--page case-page">
        <div className="section-inner">
          <Glass className="case-page-shot" padding="14px">
            <div className="case-shot">
              <CaseShot c={c} eager />
            </div>
          </Glass>
          <dl className="case-facts">
            <div>
              <dt>Resultado</dt>
              <dd>{c.stat}</dd>
            </div>
            <div>
              <dt>Servicios</dt>
              <dd>
                {c.services.map((s, i) => (
                  <span key={s}>
                    {i > 0 && ' · '}
                    <a className="text-link" href={`/${s}`}>{SERVICE_NAMES[s]}</a>
                  </span>
                ))}
              </dd>
            </div>
            {c.chips && (
              <div>
                <dt>Tecnología</dt>
                <dd>{c.chips.join(' · ')}</dd>
              </div>
            )}
          </dl>
          {c.detail === 'impacto' && <CasoImpacto level={2} />}
          {c.sections && <CasoDetalle sections={c.sections} level={2} />}
        </div>
      </section>

      {others.length > 0 && (
        <section className="section section--page">
          <div className="section-inner">
            <SectionHead
              kicker="OTROS CASOS"
              title={<>Más proyectos <em>en producción.</em></>}
              sub={<><a className="text-link" href="/casos-de-exito">Ver todos los casos de éxito</a>.</>}
            />
            <CaseList cases={others} />
          </div>
        </section>
      )}
      <CTA />
    </Layout>
  );
}
