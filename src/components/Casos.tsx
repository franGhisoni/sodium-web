import { useEffect, useState } from 'react';
import { CASES, type Case } from '../content/casos';
import { CasoDetalle } from './CasoDetalle';
import { CasoImpacto } from './CasoImpacto';
import { CaseShot } from './CaseShots';
import { Glass } from './Glass';

export function Casos() {
  const [active, setActive] = useState<Case | null>(null);

  return (
    <section className="section" id="casos">
      <div className="section-inner">
        <header className="section-head">
          <span className="pill">
            <span className="pill-dot" />
            CASOS
          </span>
          <h2 className="section-title">
            Problemas reales. <em>Sistemas en operación.</em>
          </h2>
          <p className="section-sub">
            Distintas formas de aplicar tecnología para mover una operación: vender mejor,
            ordenar conocimiento, procesar información y acelerar decisiones.{' '}
            <a className="text-link" href="/casos-de-exito">Ver todos los casos de éxito</a>.
          </p>
        </header>

        {CASES.filter((c) => c.featured).map((c) => (
          <Glass key={c.id} className="case-feature" material="holo" padding="22px" onClick={() => setActive(c)}>
            <div className="case-feature-inner">
              <div className="case-shot case-feature-shot">
                <CaseShot c={c} />
              </div>
              <div className="case-feature-body">
                <span className="case-feature-badge">DESTACADO · EXPERIENCIA 3D</span>
                <span className="case-meta-tag">{c.tag}</span>
                <h3 className="case-feature-name">{c.name}</h3>
                <p className="case-desc">{c.desc}</p>
                <ul className="case-chips">
                  {c.chips?.map((chip) => (
                    <li key={chip}>{chip}</li>
                  ))}
                </ul>
                <div className="case-stat">
                  <span className="case-stat-dot" />
                  <span>{c.stat}</span>
                  {c.live && (
                    <a
                      href={c.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="case-link"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Probar el ticket 3D ↗
                    </a>
                  )}
                  <a
                    href={`/casos-de-exito/${c.slug}`}
                    className="case-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Caso completo →
                  </a>
                </div>
              </div>
            </div>
          </Glass>
        ))}

        <div className="case-grid">
          {CASES.filter((c) => !c.featured).map((c, i) => (
            <Glass key={c.id} className="case-card" padding="18px" onClick={() => setActive(c)}>
              <div className="case-shot">
                <CaseShot c={c} />
                <span className={`case-load-btn${hasDetail(c) ? ' is-visible' : ''}`} aria-hidden="true">
                  <span>+</span> {hasDetail(c) ? 'Ver caso completo' : 'Ver detalle'}
                </span>
              </div>
              <div className="case-meta">
                <span>{c.tag}</span>
                <span>/{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="case-name">{c.name}</h3>
              <p className="case-desc">{c.desc}</p>
              <div className="case-stat">
                <span className="case-stat-dot" />
                <span>{c.stat}</span>
                {c.live && (
                  <a
                    href={c.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="case-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Ver live ↗
                  </a>
                )}
                <a
                  href={`/casos-de-exito/${c.slug}`}
                  className="case-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  Caso completo →
                </a>
              </div>
            </Glass>
          ))}
        </div>
      </div>

      {active && <CaseModal c={active} onClose={() => setActive(null)} />}
    </section>
  );
}

const hasDetail = (c: Case) => Boolean(c.detail || c.sections);


function CaseModal({ c, onClose }: { c: Case; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div className="case-modal-backdrop" onClick={onClose} role="presentation">
      <div
        className={`case-modal${hasDetail(c) ? ' case-modal--wide' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={c.name}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="case-modal-close" onClick={onClose} aria-label="Cerrar">
          ✕
        </button>
        <div className="case-modal-shot">
          <CaseShot c={c} />
        </div>
        <div className="case-modal-body">
          <span className="case-modal-tag">{c.tag}</span>
          <h3 className="case-modal-name">{c.name}</h3>
          <p className="case-modal-desc">{c.desc}</p>
          <div className="case-modal-stat">
            <span className="case-stat-dot" />
            <span>{c.stat}</span>
          </div>
          <div className="case-modal-actions">
            {c.live && (
              <a href={c.live} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                {c.liveLabel ?? 'Abrir demo'}
                <span className="btn-arrow" aria-hidden="true">↗</span>
              </a>
            )}
            <a href={`/casos-de-exito/${c.slug}`} className="btn btn-ghost">
              Ver página del caso
              <span className="btn-arrow" aria-hidden="true">→</span>
            </a>
          </div>
          {c.detail === 'impacto' && <CasoImpacto />}
          {c.sections && <CasoDetalle sections={c.sections} />}
        </div>
      </div>
    </div>
  );
}
