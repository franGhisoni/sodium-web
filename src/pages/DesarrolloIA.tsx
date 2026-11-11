import { ServicePage } from '../components/ServicePage';
import { CASES } from '../content/casos';

export default function DesarrolloIA() {
  return (
    <ServicePage
      path="/desarrollo-ia"
      kicker="INTELIGENCIA ARTIFICIAL PARA EMPRESAS"
      title={<>Desarrollo de inteligencia artificial <em>para empresas.</em></>}
      sub="Integramos IA en la operación de tu empresa: agentes que atienden y resuelven, asistentes que preparan el trabajo y búsqueda sobre el conocimiento interno. Conectados a tus sistemas y con el equipo al mando."
      blocks={[
        {
          kicker: 'QUÉ HACEMOS CON IA',
          title: <>IA aplicada <em>donde cambia el resultado.</em></>,
          items: [
            ['Agentes conversacionales', 'Atienden por WhatsApp, Instagram o la web, califican consultas, toman reservas y cobran señas, como [Peitho](/casos-de-exito/peitho), [Eterna](/casos-de-exito/eterna) y [Zur Go](/casos-de-exito/zur-go).'],
            ['Flujos asistidos', 'La IA prepara, sintetiza y recomienda; el equipo conserva el contexto y la decisión.'],
            ['Conocimiento de la empresa', 'Conectamos documentos, conversaciones y sistemas (RAG) para que cada persona encuentre y use el conocimiento de la empresa, respetando permisos.'],
            ['IA generativa para contenido', 'Textos, titulares y placas para redes generados a partir de tus datos y revisados por el equipo antes de publicar, como en [Impacto Castex](/casos-de-exito/impacto-castex).'],
            ['Análisis y scoring', 'Calificación de leads e insights sobre datos de negocio, como en [Peitho · Real Estate](/casos-de-exito/peitho-estates) y [Flux Marketing](/casos-de-exito/flux-marketing).'],
            ['Agentes operativos', 'Reciben pedidos, coordinan acciones y resuelven tareas dentro de límites claros, observables y con trazabilidad.'],
          ],
        },
        {
          kicker: 'CÓMO LO HACEMOS',
          title: <>No automatizamos <em>por automatizar.</em></>,
          sub: <>El paso a paso, con los errores que conviene evitar, está en <a className="text-link" href="/recursos/como-implementar-ia-en-una-empresa">cómo implementar inteligencia artificial en una empresa</a>.</>,
          items: [
            ['Problema antes que herramienta', 'Empezamos por el punto del flujo donde la IA libera capacidad, mejora una decisión o acelera un resultado que importa.'],
            ['Los mejores modelos del mercado', 'Elegimos para cada caso entre modelos de OpenAI, Anthropic u open source. No desarrollamos modelos propios: nuestro valor está en la aplicación.'],
            ['Control humano', 'Definimos qué hace la IA, qué decide el equipo y qué acciones piden confirmación antes de ejecutarse.'],
            ['Integrada a tus sistemas', 'La IA trabaja con los datos reales de la operación: CRM, ERP, APIs y bases de datos, sin reemplazar todo el stack.'],
            ['Adopción y métricas', 'Acompañamos al equipo, medimos uso y resultados y ajustamos el sistema hasta que forme parte natural del trabajo.'],
          ],
        },
      ]}
      casesTitle={<>IA aplicada <em>en producción.</em></>}
      cases={CASES.filter((c) => c.services.includes('desarrollo-ia'))}
      articles={['como-implementar-ia-en-una-empresa', 'como-automatizar-procesos-empresariales', 'cuanto-tarda-desarrollar-un-software']}
    />
  );
}
