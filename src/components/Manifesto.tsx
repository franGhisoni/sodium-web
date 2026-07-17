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
            No desarrollamos una IA para competir con quienes lideran el mercado.
            <span className="hl"> Usamos lo mejor que existe</span> para resolver los problemas
            que realmente mueven tu negocio. Tecnología aplicada con criterio, integrada
            a la operación y puesta en manos de quienes hacen el trabajo. <strong>Ahí aparece el valor.</strong>
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
