import { FeatureGrid, SectionHead } from './PageParts';
import { SERVICE_LINKS } from '../content/servicios';

/** Home: what Sodium does, one card per service page. */
export function Servicios() {
  return (
    <section className="section" id="servicios">
      <div className="section-inner">
        <SectionHead
          kicker="QUÉ HACEMOS"
          title={<>Software factory: <em>software a medida, IA y automatización.</em></>}
          sub={
            <>
              Somos una software factory de Buenos Aires. Trabajamos con empresas que necesitan un
              sistema propio, sumar inteligencia artificial a su operación o dejar de hacer a mano lo
              que puede hacer un sistema.
            </>
          }
        />
        <FeatureGrid items={SERVICE_LINKS} />
      </div>
    </section>
  );
}
