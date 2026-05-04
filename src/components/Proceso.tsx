import './sections.css';

const STEPS = [
  { n: '01', t: 'Brief', d: 'Te escuchamos sin slides. Salimos con un alcance escrito y un número.', dur: '48 h' },
  { n: '02', t: 'Diseño', d: 'Sistema visual + flujos + prototipo navegable. Iteramos en Figma.', dur: '2–3 sem' },
  { n: '03', t: 'Build', d: 'Sprints de una semana. Code review, despliegues continuos, demos los viernes.', dur: '4–10 sem' },
  { n: '04', t: 'Lanzamiento', d: 'QA, migración, rampa de tráfico. On-call durante las primeras 72 h.', dur: '1 sem' },
  { n: '05', t: 'Operación', d: 'Monitoreo, retraining, mejoras. Te entregamos el código y nos quedamos si querés.', dur: 'continuo' },
];

export function Proceso() {
  return (
    <section className="section" id="proceso">
      <div className="section-inner">
        <header className="section-head">
          <span className="pill">
            <span className="pill-dot" />
            PROCESO
          </span>
          <h2 className="section-title">
            Cinco fases. <em>Sin teatro.</em>
          </h2>
        </header>

        <ol className="proc-list">
          {STEPS.map(s => (
            <li key={s.n} className="proc-row">
              <span className="proc-num">{s.n}</span>
              <span className="proc-title">{s.t}</span>
              <span className="proc-desc">{s.d}</span>
              <span className="proc-dur">{s.dur}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
