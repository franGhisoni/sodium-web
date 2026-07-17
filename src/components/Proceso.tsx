import './sections.css';

const STEPS = [
  { n: '01', t: 'Entender', d: 'Nos metemos en la operación y hablamos con quienes hacen el trabajo todos los días.', dur: '48 h' },
  { n: '02', t: 'Priorizar', d: 'Elegimos el problema donde una intervención puede generar impacto concreto y medible.', dur: '1 sem' },
  { n: '03', t: 'Rediseñar', d: 'Definimos el nuevo flujo, qué hace la IA, qué decide el equipo y cómo se controla.', dur: '1–2 sem' },
  { n: '04', t: 'Implementar', d: 'Integramos la mejor tecnología disponible con tus datos y herramientas actuales.', dur: '4–10 sem' },
  { n: '05', t: 'Adoptar', d: 'Acompañamos al equipo, medimos resultados y mejoramos el sistema en uso real.', dur: 'continuo' },
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
            Del flujo actual al <em>impacto real.</em>
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
