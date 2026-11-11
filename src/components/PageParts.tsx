import { Fragment, type ReactNode } from 'react';
import type { Feature } from '../content/servicios';
import { Glass } from './Glass';
import { SceneAnchor } from './SceneAnchor';
import { CaseShot } from './CaseShots';
import { useContactLink } from '../contact';
import { findRoute } from '../routes';
import type { Case } from '../content/casos';
import { articleBySlug } from '../content/recursosMeta';

/** Text with [label](/path) links, as written in the content files. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/);
  return (
    <>
      {parts.map((part, i) => {
        const m = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
        if (!m) return <Fragment key={i}>{part}</Fragment>;
        const external = /^https?:/.test(m[2]);
        return (
          <a key={i} className="text-link" href={m[2]} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
            {m[1]}
          </a>
        );
      })}
    </>
  );
}

/** "Inicio / Section / Page" trail from the route table. */
export function Breadcrumbs({ path }: { path: string }) {
  const crumbs = findRoute(path)?.crumbs ?? [];
  if (!crumbs.length) return null;
  return (
    <nav className="crumbs" aria-label="Ruta de navegación">
      <ol>
        <li><a href="/">Inicio</a></li>
        {crumbs.map((c, i) => (
          <li key={c.path}>
            {i === crumbs.length - 1 ? <span aria-current="page">{c.name}</span> : <a href={c.path}>{c.name}</a>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

interface PageHeroProps {
  path: string;
  kicker: string;
  title: ReactNode;
  sub: ReactNode;
  /** Default actions: "Iniciar proyecto" + a secondary link. */
  secondary?: { href: string; label: string } | null;
  children?: ReactNode;
}

/** Top of every inner page: breadcrumbs, the page's single h1 and its CTAs. */
export function PageHero({ path, kicker, title, sub, secondary = { href: '/casos-de-exito', label: 'Ver casos' }, children }: PageHeroProps) {
  const contact = useContactLink();
  return (
    <section className="page-hero" id="top">
      <div className="section-inner page-hero-inner">
        <Breadcrumbs path={path} />
        <span className="pill">
          <span className="pill-dot" />
          {kicker}
        </span>
        <h1 className="page-title">{title}</h1>
        <p className="page-sub">{sub}</p>
        {children ?? (
          <div className="hero-actions">
            <a {...contact} className="btn btn-primary">
              Iniciar proyecto
              <span className="btn-arrow" aria-hidden="true">→</span>
            </a>
            {secondary && (
              <a href={secondary.href} className="btn btn-ghost">
                {secondary.label}
                <span className="btn-arrow" aria-hidden="true">→</span>
              </a>
            )}
          </div>
        )}
      </div>
      <SceneAnchor kind="prism" className="page-prism-anchor" rotation={5} beamAngle={-10} />
    </section>
  );
}

/** Section heading block, same look as the home sections. */
export function SectionHead({ kicker, title, sub }: { kicker: string; title: ReactNode; sub?: ReactNode }) {
  return (
    <header className="section-head">
      <span className="pill">
        <span className="pill-dot" />
        {kicker}
      </span>
      <h2 className="section-title">{title}</h2>
      {sub && <p className="section-sub">{sub}</p>}
    </header>
  );
}


/** Grid of glass cards: an h3 and a paragraph each, optionally linked. */
export function FeatureGrid({ items }: { items: Feature[] }) {
  return (
    <div className={`cap-grid page-grid${items.length === 4 ? ' page-grid--2' : ''}`}>
      {items.map(([title, text, href], i) => (
        <Glass key={title} className="cap-card page-card" padding="26px 24px 22px">
          <header className="cap-head">
            <span><strong>{String(i + 1).padStart(2, '0')}</strong></span>
          </header>
          <h3 className="cap-title">{href ? <a href={href}>{title}</a> : title}</h3>
          <p className="cap-body"><Rich text={text} /></p>
          {href && (
            <a className="case-link page-card-link" href={href} aria-hidden="true" tabIndex={-1}>
              Ver más →
            </a>
          )}
        </Glass>
      ))}
    </div>
  );
}

/** Case cards that link to each case page (no modal outside the home). */
export function CaseList({ cases, headingLevel = 3 }: { cases: Case[]; headingLevel?: 2 | 3 }) {
  const H = `h${headingLevel}` as 'h2' | 'h3';
  return (
    <div className="case-grid">
      {cases.map((c) => (
        <Glass key={c.id} className="case-card" padding="18px">
          <a className="case-shot" href={`/casos-de-exito/${c.slug}`} tabIndex={-1} aria-hidden="true">
            <CaseShot c={c} />
          </a>
          <div className="case-meta">
            <span>{c.tag}</span>
          </div>
          <H className="case-name">
            <a href={`/casos-de-exito/${c.slug}`}>{c.name}</a>
          </H>
          <p className="case-desc">{c.desc}</p>
          <div className="case-stat">
            <span className="case-stat-dot" />
            <span>{c.stat}</span>
            <a href={`/casos-de-exito/${c.slug}`} className="case-link">
              Ver caso →
            </a>
          </div>
        </Glass>
      ))}
    </div>
  );
}

/** Links to guides in /recursos. */
export function ArticleLinks({ slugs }: { slugs: string[] }) {
  return (
    <ul className="link-list">
      {slugs.map((slug) => {
        const a = articleBySlug(slug);
        if (!a) return null;
        return (
          <li key={slug}>
            <a href={`/recursos/${slug}`}>
              <strong>{a.title}</strong>
              <span>{a.summary}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
