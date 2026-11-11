import { ServicePage } from '../components/ServicePage';
import { CASES } from '../content/casos';

export default function Automatizacion() {
  return (
    <ServicePage
      path="/automatizacion"
      kicker="AUTOMATIZACIÓN DE PROCESOS"
      title={<>Automatización de procesos <em>empresariales.</em></>}
      sub="Conectamos tus sistemas y automatizamos las tareas repetitivas para que los datos estén al día sin cargas manuales. Donde hay texto o criterio, sumamos IA; las decisiones importantes siguen en manos del equipo."
      blocks={[
        {
          kicker: 'QUÉ AUTOMATIZAMOS',
          title: <>Menos tareas manuales. <em>Datos al día.</em></>,
          items: [
            ['Integraciones por API', 'Los sistemas se pasan la información solos: CRM, ERP, sistemas de gestión, medios de pago y herramientas propias. Como el asistente de Pellegrinet Seguros, sincronizado con su sistema AdminSE.'],
            ['Atención y pedidos', 'Consultas, reservas y pedidos que entran por WhatsApp o la web y llegan cargados al sistema, como en [Zur Go](/casos-de-exito/zur-go) o [Eterna](/casos-de-exito/eterna).'],
            ['Procesamiento de información', 'Ingesta, puntuación, clasificación y deduplicación de datos y contenido, como el motor de noticias que alimenta a [Impacto Castex](/casos-de-exito/impacto-castex).'],
            ['Reportes y tableros', 'Datos de varias fuentes consolidados en reportes que se actualizan solos, como el análisis de inversión publicitaria de [Flux Marketing](/casos-de-exito/flux-marketing).'],
            ['Publicación en canales', 'Contenido que sale a Facebook e Instagram con su placa y su copy, sin duplicar posteos.'],
            ['Gestión centralizada', 'Clientes, leads, pagos y membresías en un solo sistema con reportería propia, como en [Zellgo](/casos-de-exito/zellgo).'],
          ],
        },
        {
          kicker: 'AUTOMATIZAR CON CONTROL',
          title: <>Predecible, <em>trazable y reversible.</em></>,
          sub: <>Qué automatizar primero y cómo encararlo, en <a className="text-link" href="/recursos/como-automatizar-procesos-empresariales">cómo automatizar procesos empresariales</a>.</>,
          items: [
            ['Trazabilidad', 'Cada acción automática se puede revisar: qué pasó, cuándo y con qué datos.'],
            ['Sin duplicados', 'Si un envío se repite, el sistema lo reconoce y no lo procesa dos veces.'],
            ['Revisión humana donde importa', 'Las acciones sensibles piden confirmación y el equipo puede revisar antes de publicar o enviar.'],
            ['Fallas aisladas', 'Si un servicio externo falla, el resto del flujo sigue y la tarea se puede reintentar.'],
            ['Sobre lo que ya usás', 'Automatizamos sobre las herramientas de tu equipo, sin obligarte a reemplazar todo.'],
          ],
        },
      ]}
      casesTitle={<>Procesos automatizados <em>en producción.</em></>}
      cases={CASES.filter((c) => c.services.includes('automatizacion'))}
      articles={['como-automatizar-procesos-empresariales', 'como-implementar-ia-en-una-empresa', 'software-a-medida-vs-software-estandar']}
    />
  );
}
