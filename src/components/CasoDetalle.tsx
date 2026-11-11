import type { DetailSection } from '../content/casos';

/** Long-form case content. `level` sets the heading tag: h4 inside the home
 *  modal, h2 on the case's own page. */
export function CasoDetalle({ sections, level = 4 }: { sections: DetailSection[]; level?: 2 | 3 | 4 }) {
  const H = `h${level}` as 'h2' | 'h3' | 'h4';
  return (
    <div className="caso-detail">
      {sections.map((s) => (
        <section key={s.title} className="caso-block">
          <H className="caso-title">{s.title}</H>
          <p className="caso-lead">{s.lead}</p>
          {s.grid && (
            <ul className="caso-grid">
              {s.grid.map(([title, text]) => (
                <li key={title} className="caso-item">
                  <strong>{title}</strong>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          )}
          {s.flow && (
            <ol className="caso-flow">
              {s.flow.map(([title, text], i) => (
                <li key={title} className="caso-step">
                  <span className="caso-step-n">{String(i + 1).padStart(2, '0')}</span>
                  <strong>{title}</strong>
                  <span>{text}</span>
                </li>
              ))}
            </ol>
          )}
          {s.notes && (
            <ul className="caso-notes">
              {s.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}
