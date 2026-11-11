export interface DetailSection {
  title: string;
  lead: string;
  grid?: Array<[string, string]>;
  flow?: Array<[string, string]>;
  notes?: string[];
}

export function CasoDetalle({ sections }: { sections: DetailSection[] }) {
  return (
    <div className="caso-detail">
      {sections.map((s) => (
        <section key={s.title} className="caso-block">
          <h4 className="caso-title">{s.title}</h4>
          <p className="caso-lead">{s.lead}</p>
          {s.grid && (
            <ul className="caso-grid">
              {s.grid.map(([title, text]) => (
                <li key={title} className="caso-item">
                  <strong>{title}</strong>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          )}
          {s.flow && (
            <ol className="caso-flow">
              {s.flow.map(([title, text], i) => (
                <li key={title} className="caso-step">
                  <span className="caso-step-n">{String(i + 1).padStart(2, '0')}</span>
                  <strong>{title}</strong>
                  <span>{text}</span>
                </li>
              ))}
            </ol>
          )}
          {s.notes && (
            <ul className="caso-notes">
              {s.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}

export const DETALLE_HERMES: DetailSection[] = [
  {
    title: 'De la fuente a la nota publicada',
    lead: 'Hermes procesa noticias con criterio editorial: automatiza lo repetitivo y deja a la vista cada decisión para que el equipo pueda revisarla.',
    flow: [
      ['Capta', 'Toma noticias de distintos medios, con secciones y límites configurables para cada uno.'],
      ['Evalúa y reescribe', 'Puntúa el interés de cada noticia y la reescribe con IA.'],
      ['Elige la imagen', 'Busca candidatas, las califica y descarta logos, zócalos y marcas de agua. Si ninguna sirve, puede generar una.'],
      ['Distribuye', 'Publica de forma manual o automática, con flujos por fuente, categoría, puntaje y horario.'],
    ],
  },
  {
    title: 'Automático, pero no una caja negra',
    lead: 'El sistema explica lo que hizo y avisa cuando algo falla, para que el equipo confíe en la automatización.',
    grid: [
      ['Decisiones a la vista', 'Qué protagonista detectó, qué buscó, qué imágenes consideró y por qué aceptó o descartó cada una.'],
      ['Avisos operativos', 'Notifica cuando un scraping no trae resultados o falla una publicación o un flujo.'],
      ['Control del equipo', 'Cambiar la imagen, pegar una propia o regenerarla, y encontrar cualquier nota con el buscador global.'],
      ['Configurable sin código', 'Modelos, prompts, umbrales, fuentes y secciones se ajustan desde el panel.'],
    ],
  },
];

export const DETALLE_FLUX: DetailSection[] = [
  {
    title: 'Del dato suelto al informe',
    lead: 'Flux toma los resultados publicitarios desde Google Sheets y los convierte en un tablero por marca, con lectura automática de cada período.',
    flow: [
      ['Lee las planillas', 'Consulta los datos de cada marca directamente desde Google Sheets.'],
      ['Compara períodos', 'Enfrenta el período elegido con el anterior, canal por canal.'],
      ['Escribe el análisis', 'La IA redacta un resumen y lo que pasó en awareness, consideración y conversión.'],
      ['Sugiere el próximo paso', 'Cierra cada análisis con una sugerencia, según la industria, el objetivo y el tono de la marca.'],
    ],
  },
  {
    title: 'Pensado para sumar marcas',
    lead: 'Cada cliente tiene su propio espacio, y sumar uno nuevo es cuestión de configuración.',
    grid: [
      ['Vistas de análisis', 'Resumen general, detalle por canal, comparación y exploración libre de los datos.'],
      ['Una configuración por cliente', 'Una marca nueva se agrega desde un solo archivo, con su industria, objetivo y tono.'],
    ],
  },
];

export const DETALLE_METRON: DetailSection[] = [
  {
    title: 'Finanzas personales, a la argentina',
    lead: 'Metron está pensado para quien maneja pesos y dólares a la vez, y para las tarjetas de crédito con sus fechas de cierre y vencimiento.',
    grid: [
      ['Pesos y dólares', 'Cada movimiento se guarda en ARS y USD, con cotizaciones blue, oficial y MEP que se actualizan cada 15 minutos.'],
      ['Tarjetas de verdad', 'Resúmenes según los días de cierre y vencimiento de cada tarjeta, también en los meses cortos.'],
      ['Lo que viene', 'Proyección de ingresos y gastos recurrentes para anticipar el mes.'],
      ['Metas y grupos', 'Planificación de objetivos y grupos para compartir las finanzas con otras personas.'],
      ['Inversiones', 'Seguimiento de la cartera con cotizaciones de mercado e historial de patrimonio neto.'],
      ['Siempre a mano', 'Se instala en el celular como una app.'],
    ],
  },
];

export const DETALLE_ZELLGO: DetailSection[] = [
  {
    title: 'Toda la operación en un solo lugar',
    lead: 'Zellgo reúne la cara pública de la empresa y las herramientas internas de cada equipo.',
    grid: [
      ['Paneles por rol', 'Administración y vendedores tienen cada uno su tablero, con acceso según el perfil.'],
      ['Gestión comercial', 'Ventas, solicitudes y tickets, cada uno con su detalle y su seguimiento.'],
      ['Notificaciones', 'Avisos internos que cada persona configura desde su cuenta.'],
      ['Estadísticas', 'Una vista con los números de la operación.'],
      ['Procesos automáticos', 'Tareas programadas que mantienen los datos al día sin carga manual.'],
      ['Sitio institucional', 'Servicios, equipo, blog y contacto conectados con el mismo sistema.'],
    ],
  },
];

export const DETALLE_ZURGO: DetailSection[] = [
  {
    title: 'Un viaje, tres pantallas',
    lead: 'Demo interactiva con datos simulados: pasajero, despacho y chofer se ven lado a lado, y cada acción aparece al instante en las otras pantallas.',
    flow: [
      ['Pide', 'El pasajero marca origen y destino, ve el valor exacto y confirma.'],
      ['Se asigna', 'El panel sugiere el chofer más cercano. También puede asignar solo y probar con el siguiente si no responde.'],
      ['Viaja', 'El chofer acepta, y el pasajero ve auto, patente y recorrido en el mapa.'],
      ['Cierra', 'Al terminar, el pasajero califica y puede dejar propina.'],
    ],
  },
  {
    title: 'La gestión detrás de cada viaje',
    lead: 'La demo también recorre lo que necesita una remisería para operar todos los días.',
    grid: [
      ['Administración', 'Tarifas con simulador, pagos y caja, cuentas corrientes, liquidaciones, reportes y auditoría.'],
      ['Módulos a medida', 'Cada función adicional se prende o se apaga en vivo, incluido el asistente de WhatsApp con IA.'],
      ['Casos difíciles', 'Direcciones ambiguas, falta de altura, destinos fuera de zona y pedidos duplicados.'],
      ['Clientes frecuentes', 'Recuerda los datos de quien vuelve y reconoce los teléfonos autorizados de cuenta corriente.'],
    ],
  },
];

export const DETALLE_INSTITUTO: DetailSection[] = [
  {
    title: 'Hecho para la rutina del consultorio',
    lead: 'Secretaría y profesionales trabajan sobre la misma información, cada uno con los permisos que le corresponden.',
    grid: [
      ['Agenda sin solapamientos', 'La base de datos rechaza los choques de profesional o consultorio, incluso con cargas simultáneas. Un sobreturno exige marcar la excepción y dejar el motivo.'],
      ['Historia clínica', 'Fichas, consultas y antecedentes estructurados, con el registro de cada consulta reservado al rol profesional.'],
      ['Estudios privados', 'Los PDF de ecografías y estudios se guardan en forma privada.'],
      ['Auditoría', 'Quedan registrados los accesos a las fichas y los cambios.'],
    ],
  },
  {
    title: 'Un cambio de sistema sin traumas',
    lead: 'Cambiar de sistema después de años de uso es el verdadero desafío, así que la transición se pensó desde el principio.',
    grid: [
      ['Modo clásico', 'Quienes vienen del sistema anterior encuentran la misma disposición de pantallas, con letra ajustable y los mismos datos y permisos.'],
      ['Migración ensayada', 'Las copias del sistema anterior se leen sin modificarlas y se cargan en una base aislada, en modo de solo lectura, para validarlas antes del paso definitivo.'],
    ],
    notes: ['Las imágenes y la demo de este caso usan datos ficticios.'],
  },
];

export const DETALLE_LAKSHMI: DetailSection[] = [
  {
    title: 'Un regalo que se abre',
    lead: 'El turno deja de ser un mail de confirmación y se convierte en un objeto para tocar.',
    flow: [
      ['Llega', 'El golden ticket se entrega con una animación de entrada.'],
      ['Se explora', 'Se gira con el dedo o el mouse, y se ve el frente y el dorso.'],
      ['Se rasga', 'Se corta por la línea perforada para confirmar el turno.'],
      ['Queda el talón', 'Del otro lado queda el talón con su QR.'],
    ],
  },
  {
    title: 'La voz de la marca, de punta a punta',
    lead: 'Detrás del ticket hay un ecosistema completo, con un lenguaje propio cuidado en cada pantalla.',
    grid: [
      ['Lakshmi conversa', 'Un agente con el tono de la marca: voseo, frases cortas y sin inventar técnicas, aceites ni efectos.'],
      ['Un relato que se escribe', 'Las frases aparecen letra por letra y acompañan el scroll, respetando a quien prefiere menos movimiento.'],
      ['Panel de gestión', 'Agenda con turnos que se mueven entre horarios, salas y masajistas, siempre con una alternativa táctil.'],
      ['Vouchers de regalo', 'Regalar una experiencia también tiene su propio recorrido.'],
    ],
    notes: ['En esta demo la conversación con Lakshmi es real; el pago y la reserva desde el chat están simulados.'],
  },
];

export const DETALLE_ETERNA: DetailSection[] = [
  {
    title: 'Del primer mensaje a la seña',
    lead: 'La consulta por depilación láser o estética se convierte en un turno reservado, sin esperar a que alguien responda.',
    flow: [
      ['Conversa', 'El chat con IA responde consultas, y conoce precios por zona y promociones.'],
      ['Reserva', 'Ofrece disponibilidad y arma la reserva, cada una con su propia página.'],
      ['Cobra la seña', 'Por Mercado Pago o por transferencia con comprobante.'],
      ['Verifica', 'La IA revisa el comprobante de la transferencia para ayudar a confirmar el pago.'],
    ],
  },
  {
    title: 'El equipo sigue al mando',
    lead: 'Todo lo que hace el chat se puede ver y ajustar desde un panel interno.',
    grid: [
      ['Panel interno', 'Reservas, pacientes, calendario de disponibilidad y comprobantes en un solo lugar.'],
      ['Precios y promociones', 'Lista de precios por zona y promociones editables.'],
      ['Diálogo editable', 'El prompt del chat se cambia desde el panel, sin tocar código.'],
      ['Sitio de la marca', 'Una web pensada para mostrar los tratamientos y llevar a la consulta.'],
    ],
  },
];
