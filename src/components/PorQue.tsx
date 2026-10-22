import { Glass } from './Glass';
import './sections.css';

const PILARES = [
  {
    n: '01',
    t: 'Misión',
    d: 'Superar las expectativas en cada entrega, combinando ingeniería sólida, innovación y atención al detalle para crear soluciones tecnológicas que no solo cumplan su propósito, sino que lo hagan mejor de lo esperado.',
  },
  {
    n: '02',
    t: 'Visión',
    d: 'Ser reconocidos por elevar el estándar de la industria, construyendo soluciones tecnológicas que se distingan por su calidad, confiabilidad y capacidad de ir siempre un paso más allá de lo esperado.',
  },
];

export function PorQue() {
  return (
    <section className="section porque" id="por-que-sodium">
      <div className="section-inner">
        <header className="section-head">
          <span className="pill">
            <span className="pill-dot" />
            CUSTOM SOFTWARE &amp; AI INTEGRATIONS
          </span>
          <h2 className="section-title">
            ¿Por qué <em>Sodium?</em>
          </h2>
        </header>

        <div className="porque-pillars">
          {PILARES.map(p => (
            <Glass key={p.n} className="porque-card" padding="32px 36px">
              <div>
                <h3 className="porque-card-title">{p.t}</h3>
                <p className="porque-card-text">{p.d}</p>
              </div>
            </Glass>
          ))}
        </div>

        <div className="porque-body">
          <p className="porque-lead">
            Porque, tanto en la cocina como en la tecnología, el detalle que parece mínimo puede
            definir el resultado final.
          </p>
          <p className="porque-text">
            Así como la sal es el condimento esencial que realza los sabores y logra que un plato
            cierre a la perfección, Sodium busca ser ese componente que lleva cada proyecto al
            siguiente nivel. El equilibrio justo entre ingeniería, creatividad y atención al
            detalle que transforma algo que simplemente funciona en algo que realmente destaca.
          </p>
        </div>

        <p className="porque-tagline">
          Un negocio sin tecnología de calidad <span className="hl">es un plato sin sal.</span>
        </p>
      </div>
    </section>
  );
}
