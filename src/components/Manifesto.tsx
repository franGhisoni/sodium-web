import { Logo } from './Logo';
import { Glass } from './Glass';
import { SceneAnchor } from './SceneAnchor';
import { useIsMobile } from '../contact';
import './sections.css';

export function Manifesto() {
  const mobile = useIsMobile();
  return (
    <section className="section manifesto" id="estudio">
      <div className="section-inner manifesto-inner">
        {/* Apex-up prism left of the card: its spectrum fans through it. */}
        <SceneAnchor kind="prism" className="manifesto-prism-anchor" rotation={0} beamAngle={-16} />
        {!mobile && (
          <SceneAnchor kind="prism" className="manifesto-prism-anchor--mobile" rotation={12} beamAngle={6} />
        )}
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
