/**
 * Bodies of the guides in /recursos (metadata in recursosMeta.ts). Plain
 * blocks; inline links use the [text](/path) form and render as <a>.
 * Every fact about Sodium here comes from the rest of the site: process and
 * timings, ways of working, cases. No prices, no invented figures.
 */
export type Block = { h2: string } | { p: string } | { ul: string[] } | { ol: string[] };

export const BODIES: Record<string, Block[]> = {
  'que-es-una-software-factory': [
    {
      p: 'Una software factory es una empresa que diseña, desarrolla y mantiene software para otras empresas. En lugar de vender un producto cerrado, construye el sistema que cada cliente necesita: una plataforma de gestión, un CRM, una aplicación interna, una integración entre sistemas o, cada vez más, una capa de inteligencia artificial sobre la operación.',
    },
    { h2: 'Qué hace una software factory' },
    { p: 'El trabajo cubre el ciclo completo de un sistema, no solo la escritura del código:' },
    {
      ul: [
        'Entender el problema y definir el alcance: qué se construye primero y qué puede esperar.',
        'Diseñar el producto: flujos, pantallas, roles y reglas del negocio.',
        'Desarrollar el sistema y conectarlo con las herramientas que la empresa ya usa (CRM, ERP, APIs, bases de datos).',
        'Ponerlo en producción, monitorearlo y resolver lo que aparezca en uso real.',
        'Mantenerlo y hacerlo evolucionar a medida que cambia el negocio.',
      ],
    },
    { h2: 'Software factory, agencia o equipo interno' },
    {
      p: 'Una agencia digital suele enfocarse en marketing, comunicación y sitios institucionales. Una software factory se enfoca en sistemas: software que forma parte de la operación diaria y que tiene que funcionar todos los días, con datos reales y usuarios reales.',
    },
    {
      p: 'Un equipo interno tiene la ventaja de conocer el negocio desde adentro, pero armarlo lleva tiempo y no siempre hace falta tenerlo completo de forma permanente. Por eso muchas empresas combinan las dos cosas: una software factory que trabaja como equipo completo, o que se integra con las personas de producto, diseño y tecnología que ya tienen.',
    },
    { h2: 'Cuándo conviene contratar una' },
    {
      ul: [
        'Cuando un proceso clave depende de planillas, cargas manuales o sistemas que no se hablan entre sí.',
        'Cuando el software estándar resuelve una parte, pero no lo que hace distinta a tu operación. Lo explicamos en [software a medida vs. software estándar](/recursos/software-a-medida-vs-software-estandar).',
        'Cuando querés sumar inteligencia artificial a un flujo real y no solo probar una herramienta.',
        'Cuando necesitás un equipo con experiencia para un proyecto concreto, sin armar un área de desarrollo desde cero.',
      ],
    },
    { h2: 'Qué preguntar antes de elegir una' },
    {
      ul: [
        '¿De quién es el código y dónde queda? Lo razonable es que quede en repositorios de tu empresa.',
        '¿Cada cuánto vas a ver avances funcionando, y no solo informes?',
        '¿Cómo se documentan las decisiones técnicas y de producto?',
        '¿Qué pasa después del lanzamiento: quién monitorea, quién corrige y quién hace evolucionar el sistema?',
        '¿Pueden trabajar junto a tu equipo, o solo como un equipo aparte?',
        '¿Qué proyectos parecidos tienen en producción y se pueden ver?',
      ],
    },
    { h2: 'Cómo trabajamos en Sodium' },
    {
      p: 'Sodium es una [software factory argentina](/software-factory) con base en Buenos Aires. Desarrollamos [software a medida](/software-a-medida) e integramos [inteligencia artificial](/desarrollo-ia) y [automatización](/automatizacion) en empresas. Trabajamos como equipo completo o integrados al tuyo, hacemos demos semanales, documentamos las decisiones y dejamos el código en tus repositorios. Después del lanzamiento hacemos el acompañamiento inicial y podés seguir con nosotros para mejoras, soporte y evolución.',
    },
    { p: 'Podés ver proyectos en producción en [casos de éxito](/casos-de-exito).' },
  ],

  'cuanto-cuesta-un-software-a-medida': [
    {
      p: 'No existe un precio de lista para un software a medida, y desconfiá de quien te dé uno sin haber entendido tu proyecto. El costo sale del alcance: cuántas cosas tiene que hacer el sistema, con qué otros sistemas se conecta y qué tiene que pasar después del lanzamiento. Lo útil es saber qué mueve ese número para poder decidir con criterio.',
    },
    { h2: 'De qué depende el costo' },
    {
      ul: [
        'Alcance funcional: la cantidad de módulos, pantallas, reglas de negocio y casos especiales. Un sistema de turnos no es lo mismo que una plataforma que maneja agenda, historia clínica y auditoría.',
        'Usuarios y roles: cuántos perfiles distintos usan el sistema y qué puede ver o hacer cada uno.',
        'Integraciones: conectar con un CRM, un ERP, WhatsApp, un medio de pago o la facturación electrónica de ARCA suma trabajo, sobre todo si el otro sistema no tiene una API documentada.',
        'Migración de datos: pasar la información de un sistema anterior requiere limpiarla, validarla y probar que no se pierda nada.',
        'Inteligencia artificial: además del desarrollo, los modelos de IA suelen cobrarse por uso, así que conviene estimar el volumen de consultas.',
        'Infraestructura: dónde corre el sistema, cuánta disponibilidad necesita y cómo se monitorea.',
        'Mantenimiento y evolución: el software sigue cambiando después del lanzamiento, y eso también es parte del costo.',
      ],
    },
    { h2: 'Cómo pedir presupuestos que se puedan comparar' },
    {
      ol: [
        'Describí el problema, no solo la solución que imaginás: qué proceso querés cambiar y qué pasa hoy.',
        'Indicá qué sistemas tiene que usar o reemplazar el software nuevo.',
        'Separá lo indispensable para una primera versión de lo que puede venir después.',
        'Preguntá qué incluye cada propuesta: diseño, pruebas, puesta en producción, documentación y soporte posterior.',
        'Preguntá de quién es el código y en qué repositorios queda.',
      ],
    },
    { h2: 'Cómo bajar el riesgo de la inversión' },
    {
      p: 'La forma más segura de invertir en software a medida es empezar por el punto donde una intervención genera un impacto concreto, ponerlo en uso y crecer desde ahí. Una primera versión acotada, con demos frecuentes, muestra rápido si el proyecto va en la dirección correcta y evita pagar por funciones que nadie usa.',
    },
    {
      p: 'También ayuda comparar contra la alternativa real: a veces un [software estándar](/recursos/software-a-medida-vs-software-estandar) alcanza, y a veces lo más eficiente es integrarlo con un desarrollo propio en lugar de reemplazarlo.',
    },
    { h2: 'Cómo lo estimamos en Sodium' },
    {
      p: 'Empezamos con un brief de 30 minutos para entender la operación. Con eso armamos un primer diagnóstico y alcance en 48 horas, y recién ahí hablamos de costo, porque ya sabemos qué hay que construir. Si querés más detalle sobre plazos, leé [cuánto tarda desarrollar un software](/recursos/cuanto-tarda-desarrollar-un-software), o [contanos tu proyecto](/contacto).',
    },
  ],

  'cuanto-tarda-desarrollar-un-software': [
    {
      p: 'El plazo de un software a medida depende del alcance, igual que el costo. Lo que sí se puede decir es cómo se reparte el tiempo entre las etapas y qué cosas lo acortan o lo estiran. Estos son los plazos con los que trabajamos en Sodium.',
    },
    { h2: 'Plazos por etapa' },
    {
      ol: [
        'Entender (48 horas): nos metemos en la operación y hablamos con quienes hacen el trabajo todos los días. El resultado es un primer diagnóstico y alcance.',
        'Priorizar (1 semana): elegimos el problema donde una intervención puede generar un impacto concreto y medible.',
        'Rediseñar (1 a 2 semanas): definimos el nuevo flujo, qué hace el sistema o la IA, qué decide el equipo y cómo se controla.',
        'Implementar (4 a 10 semanas): construimos e integramos el sistema con tus datos y herramientas actuales.',
        'Adoptar (continuo): acompañamos al equipo, medimos resultados y mejoramos el sistema en uso real.',
      ],
    },
    {
      p: 'En la práctica, una intervención puntual puede salir en semanas, y un sistema integrado a varios flujos suele requerir entre 4 y 10 semanas de implementación.',
    },
    { h2: 'Qué acelera un proyecto' },
    {
      ul: [
        'Una persona del lado de la empresa que pueda tomar decisiones y responder dudas rápido.',
        'Acceso temprano a los datos y a los sistemas con los que hay que integrarse.',
        'Un alcance acotado para la primera versión: lo indispensable primero, lo demás después.',
        'Demos semanales: los ajustes aparecen temprano, cuando todavía son baratos.',
      ],
    },
    { h2: 'Qué lo demora' },
    {
      ul: [
        'Integraciones con sistemas que no tienen una API o que no están documentados.',
        'Migraciones de datos de un sistema anterior, que hay que limpiar y validar. En [Instituto Ghisoni](/casos-de-exito/instituto-ghisoni), por ejemplo, el cambio de sistema fue parte del proyecto.',
        'Cambios de alcance a mitad de camino sin repriorizar lo que ya estaba planificado.',
        'Esperas largas de aprobaciones o de información de terceros.',
      ],
    },
    { h2: 'El lanzamiento no es el final' },
    {
      p: 'Un sistema empieza a dar valor cuando el equipo lo usa. Por eso la última etapa no tiene fecha de cierre: después del lanzamiento monitoreamos, resolvemos lo que aparece en producción y ajustamos según el uso real. Si estás evaluando un proyecto, mirá también [de qué depende el costo](/recursos/cuanto-cuesta-un-software-a-medida) o conocé cómo trabajamos el [desarrollo de software a medida](/software-a-medida).',
    },
  ],

  'software-a-medida-vs-software-estandar': [
    {
      p: 'El software estándar (también llamado enlatado o SaaS) es un producto pensado para muchas empresas a la vez. El software a medida se construye para una empresa en particular, sobre su forma de trabajar. Ninguno es mejor en abstracto: cada uno conviene en situaciones distintas, y muchas veces la mejor respuesta es combinarlos.',
    },
    { h2: 'Las diferencias que importan' },
    {
      ul: [
        'Ajuste al proceso: el estándar te pide adaptar tu proceso al producto; el a medida se adapta a tu proceso.',
        'Tiempo para empezar: el estándar se puede usar casi de inmediato; el a medida requiere semanas de desarrollo.',
        'Costo: el estándar se paga como licencia o suscripción; el a medida es una inversión de desarrollo más su mantenimiento.',
        'Integraciones: el estándar se conecta con lo que su fabricante prevé; el a medida se conecta con lo que tu operación necesita.',
        'Propiedad y control: con el estándar dependés de la hoja de ruta del proveedor; con el a medida el código es tuyo y decidís cómo evoluciona.',
      ],
    },
    { h2: 'Cuándo conviene el software estándar' },
    {
      ul: [
        'Cuando el proceso es igual en casi todas las empresas: correo, contabilidad general, videollamadas.',
        'Cuando necesitás empezar ya y el producto cubre lo esencial.',
        'Cuando el proceso no es parte de lo que te diferencia de tu competencia.',
      ],
    },
    { h2: 'Cuándo conviene el software a medida' },
    {
      ul: [
        'Cuando tu operación tiene reglas propias que ningún producto resuelve bien, como un sistema clínico pensado para la rutina de un consultorio o un despacho de viajes con app para el chofer.',
        'Cuando necesitás que varios negocios o sucursales compartan una plataforma, cada uno con su caja, stock y facturación, como en [Sodium Retail](/casos-de-exito/sodium-retail).',
        'Cuando el equipo pierde tiempo pasando datos a mano entre sistemas que no se hablan.',
        'Cuando querés sumar inteligencia artificial sobre tus propios datos y flujos.',
      ],
    },
    { h2: 'La opción intermedia: integrar' },
    {
      p: 'No hace falta reemplazar todo. Muchas veces lo más eficiente es mantener el software estándar que funciona y construir a medida solo lo que falta: una integración por API, un panel propio o un asistente con IA conectado al sistema existente. Es lo que hicimos con Pellegrinet Seguros, donde un asistente de WhatsApp cotiza pólizas sincronizado con su sistema de gestión AdminSE.',
    },
    {
      p: 'Si estás en esa decisión, mirá [qué incluye un desarrollo de software a medida](/software-a-medida) y cómo encaramos la [automatización de procesos](/automatizacion).',
    },
  ],

  'como-implementar-ia-en-una-empresa': [
    {
      p: 'Implementar inteligencia artificial en una empresa no empieza por elegir una herramienta. Empieza por un problema concreto de la operación: un cuello de botella, una tarea repetitiva con mucho texto, una decisión que se toma con información dispersa. La IA es valiosa cuando cambia un resultado que importa.',
    },
    { h2: 'Paso a paso' },
    {
      ol: [
        'Elegí un proceso concreto. Ventas, atención, análisis, conocimiento interno o tareas repetitivas son buenos candidatos. Si la oportunidad todavía no está clara, el primer paso es mapear la operación y priorizar.',
        'Medí cómo funciona hoy: cuánto tarda, cuántas consultas entran, cuántas se pierden. Sin un punto de partida no hay forma de saber si la IA mejoró algo.',
        'Definí qué hace la IA y qué decide el equipo. La IA puede preparar, sintetizar y recomendar; las decisiones sensibles conviene que pasen por una persona.',
        'Elegí el modelo según el caso. No hace falta entrenar un modelo propio: los modelos de OpenAI, Anthropic u open source cubren la mayoría de las necesidades, y el trabajo está en conectarlos bien.',
        'Conectá la IA con tus datos y sistemas. Un asistente que no ve el CRM, el stock o los documentos de la empresa responde en el aire. Para el conocimiento interno se usa búsqueda sobre los propios documentos (RAG), respetando los permisos de cada persona.',
        'Probá con casos reales antes de abrirlo a todos, y definí qué pasa cuando la IA no sabe: escalar a una persona es una respuesta válida.',
        'Lanzá, medí y ajustá. La adopción del equipo es parte del proyecto: capacitación, métricas de uso y mejora continua.',
      ],
    },
    { h2: 'Errores comunes' },
    {
      ul: [
        'Empezar por la herramienta y buscar después dónde usarla.',
        'Automatizar decisiones que deberían seguir en manos del equipo.',
        'Dejar la IA aislada, sin acceso a los datos reales del negocio.',
        'Medir el éxito por la cantidad de funciones y no por el cambio en la operación.',
      ],
    },
    { h2: 'Ejemplos en producción' },
    {
      ul: [
        '[Peitho](/casos-de-exito/peitho): un agente que atiende, califica y cierra leads por WhatsApp, Instagram y web, integrado al CRM.',
        '[Eterna](/casos-de-exito/eterna): un chat con IA que toma reservas y cobra la seña por Mercado Pago o transferencia, con panel interno para el equipo.',
        '[Zur Go](/casos-de-exito/zur-go): pedidos de remis por WhatsApp, con cotización sobre la ruta real y despacho al chofer más cercano.',
      ],
    },
    {
      p: 'Si querés llevar esto a tu empresa, conocé nuestro servicio de [desarrollo de inteligencia artificial para empresas](/desarrollo-ia) o [hablá con Sodium](/contacto).',
    },
  ],

  'como-automatizar-procesos-empresariales': [
    {
      p: 'Automatizar un proceso es lograr que una tarea que hoy hace una persona, paso por paso, la haga un sistema de forma confiable. Bien hecho, libera tiempo del equipo y deja los datos al día. Mal hecho, mueve errores más rápido. La diferencia está en elegir bien qué automatizar y en cómo se controla.',
    },
    { h2: 'Qué procesos conviene automatizar primero' },
    {
      ul: [
        'Tareas repetitivas con reglas claras: copiar datos de un sistema a otro, generar un reporte, enviar un aviso.',
        'Procesos con mucho volumen, donde cada minuto ahorrado se multiplica.',
        'Pasos que conectan sistemas que no se hablan, y donde hoy alguien hace de puente.',
        'Tareas con texto o criterio repetible, como clasificar consultas o redactar un primer borrador: ahí suma la inteligencia artificial.',
      ],
    },
    { h2: 'Cómo encararlo' },
    {
      ol: [
        'Mapeá el proceso como es hoy, con quienes lo hacen todos los días: entradas, pasos, decisiones y excepciones.',
        'Separá lo que es regla fija de lo que requiere criterio. Lo primero se automatiza con integraciones; lo segundo puede llevar IA con revisión humana.',
        'Conectá los sistemas por API o webhooks en lugar de cargar datos a mano. Si un sistema no tiene API, hay que evaluar alternativas antes de empezar.',
        'Diseñá para los errores: qué pasa si un servicio externo falla, si un dato llega incompleto o si el mismo envío llega dos veces.',
        'Dejá trazabilidad: cada acción automática tiene que poder revisarse.',
        'Medí el antes y el después, y ajustá con el uso real.',
      ],
    },
    { h2: 'Automatizar sin perder el control' },
    {
      p: 'Una buena automatización es predecible. En el diario [Impacto Castex](/casos-de-exito/impacto-castex), por ejemplo, las notas llegan por API desde un motor de noticias con IA: si un envío se repite, no se duplica; si la imagen no tiene texto alternativo, la nota queda en borrador; y si una red social falla al compartir, la otra sale igual y se puede reintentar. El equipo puede revisar y editar antes de publicar.',
    },
    { h2: 'Más ejemplos' },
    {
      ul: [
        '[Zur Go](/casos-de-exito/zur-go): el pedido que entra por WhatsApp llega al panel de despacho con el chofer más cercano sugerido.',
        '[Flux Marketing](/casos-de-exito/flux-marketing): datos de inversión publicitaria de varias marcas, consolidados en un dashboard con insights de IA.',
        '[Zellgo](/casos-de-exito/zellgo): un ERP/CRM que reúne clientes, leads, pagos, membresías y reportes en un solo lugar.',
      ],
    },
    {
      p: 'Si querés saber qué se puede automatizar en tu operación, mirá nuestro servicio de [automatización de procesos empresariales](/automatizacion) o leé [cómo implementar IA en una empresa](/recursos/como-implementar-ia-en-una-empresa).',
    },
  ],
};
