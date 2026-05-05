import { Logo } from './Logo';
import { Glass } from './Glass';
import './sections.css';

export function Manifesto() {
  return (
    <section className="section manifesto" id="estudio">
      <div className="section-inner">
        <Glass variant="strong" className="manifesto-card" padding="56px">
          <span className="pill">
            <span className="pill-dot" />
            ESTUDIO
          </span>
          <p className="manifesto-text">
            No hacemos demos. Hacemos <span className="hl">sistemas que viven</span>:
            agentes que atienden a tus clientes mientras dormís, scrapers que llenan
            tu base, dashboards que te dicen qué cambió. Lo construimos, lo lanzamos
            y <strong>lo bancamos.</strong>
          </p>
          <div className="manifesto-sig">
            <Logo size={18} />
            <span>SODIUM/SOFTWARE · BUENOS AIRES · 2026</span>
          </div>
        </Glass>
      </div>
    </section>
  );
}
