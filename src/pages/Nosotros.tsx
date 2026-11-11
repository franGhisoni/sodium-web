import { Layout } from '../components/Layout';
import { FeatureGrid, PageHero, SectionHead } from '../components/PageParts';
import { Manifesto } from '../components/Manifesto';
import { PorQue } from '../components/PorQue';
import { Proceso } from '../components/Proceso';
import { Stats } from '../components/Stats';
import { Clientes } from '../components/Clientes';
import { CTA } from '../components/CTA';
import { SERVICE_LINKS } from '../content/servicios';

export default function Nosotros() {
  return (
    <Layout>
      <PageHero
        path="/nosotros"
        kicker="NOSOTROS · BUENOS AIRES"
        title={<>Somos Sodium, <em>una software factory de Buenos Aires.</em></>}
        sub="Desarrollamos software a medida e integramos inteligencia artificial en empresas. No competimos con quienes crean los modelos: usamos lo mejor que existe y lo ponemos a trabajar en la operación, en manos de quienes hacen el trabajo."
      />
      <Manifesto />
      <PorQue />
      <section className="section section--page">
        <div className="section-inner">
          <SectionHead
            kicker="QUÉ HACEMOS"
            title={<>Software a medida, <em>IA y automatización.</em></>}
          />
          <FeatureGrid items={SERVICE_LINKS} />
        </div>
      </section>
      <Proceso />
      <Stats />
      <Clientes />
      <CTA />
    </Layout>
  );
}
