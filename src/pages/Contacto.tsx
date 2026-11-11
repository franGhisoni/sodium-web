import { Layout } from '../components/Layout';
import { FeatureGrid, PageHero, SectionHead } from '../components/PageParts';
import { Faq } from '../components/Faq';
import { WHATSAPP_URL } from '../contact';

export default function Contacto() {
  return (
    <Layout>
      <PageHero
        path="/contacto"
        kicker="CONTACTO"
        title={<>Contanos tu proyecto: <em>empecemos por un brief de 30 minutos.</em></>}
        sub="Contanos qué parte de tu operación necesita cambiar: un sistema a medida, sumar IA o automatizar un proceso. Respondemos por WhatsApp, email o LinkedIn desde Buenos Aires, Argentina."
      >
        <div className="hero-actions">
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            Escribinos por WhatsApp
            <span className="btn-arrow" aria-hidden="true">→</span>
          </a>
          <a href="mailto:contacto@sodium.com.ar" className="btn btn-ghost">
            contacto@sodium.com.ar
            <span className="btn-arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </PageHero>
      <section className="section section--page" id="canales">
        <div className="section-inner">
          <SectionHead kicker="CANALES" title={<>Hablá con Sodium <em>por donde prefieras.</em></>} />
          <FeatureGrid
            items={[
              ['WhatsApp', 'Escribinos al [+54 11 2591 8111](https://wa.me/5491125918111) y coordinamos el brief.'],
              ['Email', 'Contanos tu proyecto en [contacto@sodium.com.ar](mailto:contacto@sodium.com.ar).'],
              ['LinkedIn', 'Seguinos o escribinos en [LinkedIn](https://www.linkedin.com/in/sodium-software-9500b43b2/).'],
            ]}
          />
        </div>
      </section>
      <section className="section section--page">
        <div className="section-inner">
          <SectionHead kicker="QUÉ SIGUE" title={<>Del brief <em>al primer alcance.</em></>} />
          <FeatureGrid
            items={[
              ['Brief de 30 minutos', 'Nos contás el problema, cómo funciona hoy la operación y qué sistemas usa tu equipo.'],
              ['Diagnóstico en 48 horas', 'Te enviamos un primer diagnóstico y alcance: dónde intervenir y qué construir primero.'],
              ['Implementación', 'Una intervención puntual puede salir en semanas; un sistema integrado suele llevar entre 4 y 10 semanas, con demos semanales.'],
            ]}
          />
        </div>
      </section>
      <Faq />
    </Layout>
  );
}
