import { ServicePage } from '../components/ServicePage';
import { CASES } from '../content/casos';

export default function SoftwareAMedida() {
  return (
    <ServicePage
      path="/software-a-medida"
      kicker="DESARROLLO DE SOFTWARE A MEDIDA"
      title={<>Desarrollo de software a medida <em>para empresas.</em></>}
      sub="Construimos sistemas que se adaptan a cómo trabaja tu empresa, y no al revés: gestión, plataformas, aplicaciones e integraciones, con mantenimiento y evolución después del lanzamiento."
      blocks={[
        {
          kicker: 'QUÉ DESARROLLAMOS',
          title: <>Software pensado para <em>tu operación.</em></>,
          items: [
            ['Sistemas de gestión', 'ERP y CRM a medida: clientes, pagos, stock, facturación electrónica con ARCA y reportes propios, como [Zellgo](/casos-de-exito/zellgo) o [Sodium Retail](/casos-de-exito/sodium-retail).'],
            ['Plataformas sectoriales', 'Sistemas para la rutina de cada equipo: clínicos como [Instituto Ghisoni](/casos-de-exito/instituto-ghisoni), de salud domiciliaria como [House24](/casos-de-exito/house24) o de movilidad como [Zur Go](/casos-de-exito/zur-go).'],
            ['Sitios y experiencias web', 'Sitios con diseño editorial, reservas integradas y experiencias 3D con WebGL y Three.js, como [Rosaura](/casos-de-exito/rosaura) o [Lakshmi · Intencionate](/casos-de-exito/lakshmi-intencionate).'],
            ['Paneles y dashboards', 'Paneles internos por roles, métricas y reportes que se leen, como el dashboard de [Flux Marketing](/casos-de-exito/flux-marketing).'],
            ['Portales B2B', 'Plataformas de activos de marca, catálogo y especificaciones técnicas para distribuidores, como el tradesite de Rutini Wines.'],
            ['Integraciones y APIs', 'Conectamos el sistema con lo que ya usás: CRM, ERP, WhatsApp, Mercado Pago, ARCA y otras APIs. Más en [automatización de procesos](/automatizacion).'],
          ],
        },
        {
          kicker: 'POR QUÉ A MEDIDA',
          title: <>Lo estándar resuelve lo común. <em>Lo a medida, lo tuyo.</em></>,
          sub: <>Un software estándar resuelve lo que hacen todas las empresas; uno a medida resuelve lo que hace distinta a la tuya. Comparamos las dos opciones en <a className="text-link" href="/recursos/software-a-medida-vs-software-estandar">software a medida vs. software estándar</a>.</>,
          items: [
            ['Se adapta al proceso', 'Los flujos, roles y reglas del sistema son los de tu operación, no los de una plantilla.'],
            ['Crece con el negocio', 'Se pueden sumar módulos, negocios o sucursales sobre la misma base, como en Sodium Retail, donde cada negocio tiene su caja, stock, usuarios y facturación.'],
            ['Convive con lo que ya hay', 'Se integra con tus sistemas actuales y, cuando hace falta reemplazar uno, migramos los datos, como en el cambio de sistema de Instituto Ghisoni.'],
            ['Es tuyo', 'El código queda en tus repositorios, documentado, y decidís cómo evoluciona.'],
          ],
        },
      ]}
      showProcess
      casesTitle={<>Software a medida <em>en producción.</em></>}
      cases={CASES.filter((c) => c.services.includes('software-a-medida'))}
      articles={['cuanto-cuesta-un-software-a-medida', 'cuanto-tarda-desarrollar-un-software', 'software-a-medida-vs-software-estandar']}
    />
  );
}
