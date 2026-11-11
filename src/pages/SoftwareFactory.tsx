import { ServicePage } from '../components/ServicePage';
import { CASES } from '../content/casos';

const SHOWN = ['lakshmi-intencionate', 'impacto-castex', 'sodium-retail', 'peitho', 'zur-go', 'instituto-ghisoni'];

export default function SoftwareFactory() {
  return (
    <ServicePage
      path="/software-factory"
      kicker="SOFTWARE FACTORY · BUENOS AIRES"
      title={<>Software factory en Argentina: <em>software a medida e IA.</em></>}
      sub="Sodium es una software factory argentina con base en Buenos Aires. Diseñamos, desarrollamos y mantenemos software a medida para empresas, e integramos inteligencia artificial y automatización en los procesos que mueven el negocio."
      blocks={[
        {
          kicker: 'QUÉ HACEMOS',
          title: <>Del problema al sistema <em>en producción.</em></>,
          sub: 'Nos ocupamos del ciclo completo: entender el problema, definir el alcance, construir, poner en producción y hacer evolucionar el sistema.',
          items: [
            ['Desarrollo de software a medida', 'Sistemas de gestión, CRM y ERP, plataformas web, aplicaciones y paneles internos construidos sobre la operación real de cada empresa.', '/software-a-medida'],
            ['Inteligencia artificial aplicada', 'Agentes y asistentes conversacionales, búsqueda sobre el conocimiento interno (RAG) y flujos donde la IA prepara y el equipo decide.', '/desarrollo-ia'],
            ['Automatización de procesos', 'Integraciones por API entre los sistemas que ya usás, tareas repetitivas que corren solas y datos que se actualizan sin cargas manuales.', '/automatizacion'],
            ['Integraciones', 'Conectamos el software y la IA con CRM, ERP, APIs, bases de datos, WhatsApp, Mercado Pago y la facturación electrónica de ARCA.'],
          ],
        },
        {
          kicker: 'CÓMO TRABAJAMOS',
          title: <>Tu equipo, <em>o parte de él.</em></>,
          items: [
            ['Equipo completo', 'Nos hacemos cargo del proyecto de punta a punta, del diagnóstico a la puesta en producción.'],
            ['Integrados a tu equipo', 'También trabajamos junto a las áreas de diseño, producto y tecnología de tu empresa.'],
            ['Demos semanales', 'Cada semana ves avances funcionando y podés ajustar el rumbo a tiempo.'],
            ['El código es tuyo', 'Documentamos las decisiones y dejamos el código en los repositorios de tu empresa.'],
            ['Después del lanzamiento', 'Acompañamiento inicial, monitoreo y resolución de lo que aparezca en producción. Después podés quedarte con la operación o seguir con nosotros para mejoras y evolución.'],
            ['Tecnología según el caso', 'Usamos los mejores modelos de IA del mercado (OpenAI, Anthropic u open source) según cada flujo. No desarrollamos modelos propios: nuestro valor está en la aplicación.'],
          ],
        },
      ]}
      showProcess
      casesTitle={<>Sistemas que hoy <em>están en operación.</em></>}
      cases={SHOWN.map((s) => CASES.find((c) => c.slug === s)!).filter(Boolean)}
      articles={['que-es-una-software-factory', 'cuanto-cuesta-un-software-a-medida', 'cuanto-tarda-desarrollar-un-software']}
    />
  );
}
