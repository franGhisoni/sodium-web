const USABILIDAD: Array<[string, string]> = [
  ['Se usa con teclado y lector de pantalla', 'Todo el panel funciona sin mouse y con NVDA, JAWS o TalkBack: campos etiquetados, cambios de estado anunciados y errores que llevan directo al campo a corregir.'],
  ['Versión simple', 'Con un botón, el sitio y el panel pasan a texto grande, alto contraste y una sola columna. La elección queda guardada en cada dispositivo.'],
  ['Jarvis, asistente de voz', 'Crear, revisar y publicar notas hablando. Usa las mismas acciones que el panel y pide confirmación antes de las sensibles.'],
  ['Un editor para cada persona', 'Editor con formato o de texto simple, a elección de cada redactor. Reconoce Markdown al escribir y al pegar.'],
  ['Revisión por roles', 'Dirección, administración, editores, redactores y colaboradores. Cada grupo decide si sus notas pasan por revisión, y todo queda registrado.'],
  ['Métricas que se leen', 'Visitas por nota, redactor y sección, sin cookies. Cada gráfico tiene su resumen en texto y su tabla, y se exporta a CSV.'],
];

const HERMES: Array<[string, string, string]> = [
  ['01', 'Capta y redacta', 'Hermes toma noticias de distintas fuentes, las puntúa, las reescribe y elige o genera la imagen.'],
  ['02', 'Entrega por API', 'La nota entra por una API con clave propia y con los permisos de esa cuenta. Si se reenvía, no se duplica.'],
  ['03', 'Respeta el flujo', 'Llega como borrador, en revisión o publicada, según lo que se configure. Sin texto alternativo en la imagen, queda en borrador.'],
  ['04', 'Sale a redes', 'Las notas publicadas pueden compartirse en Facebook e Instagram, con su placa y su copy, sin duplicar posteos.'],
];

const PLACAS: Array<[string, string]> = [
  ['clasico', 'Clásico'],
  ['banda', 'Banda'],
  ['degradado', 'Degradado'],
  ['panel', 'Panel'],
];

const NOTA_URL = 'https://impactocastex.com.ar/la-pampa/17543/expo-vivero-2026-en-toay-fechas-horarios-y-como-llegar';

const COPY_FACEBOOK = `La Expo Vivero 2026 se realizará el sábado 31 de octubre y el domingo 1 de noviembre en el Jardín Botánico Provincial de Toay, con entrada libre y gratuita. La 14.ª edición reunirá a más de 70 expositores, los cinco Viveros Forestales Provinciales, un patio gastronómico y espectáculos musicales.

Habrá transporte público entre Santa Rosa y Toay. Para cuidar el predio, se solicita respetar los senderos y usar los cestos; no se permite ingresar con mascotas ni fumar. 👉 Leé la nota completa en nuestro sitio web. ¿Tenés pensado visitar la Expo Vivero?`;

const COPY_INSTAGRAM = `📌 EXPO VIVERO 2026: DOS DÍAS EN TOAY

La 14.ª edición se realizará el sábado 31 de octubre y el domingo 1 de noviembre en el Jardín Botánico Provincial, con entrada libre y gratuita. Participarán más de 70 referentes del sector y los cinco Viveros Forestales Provinciales.

Habrá patio gastronómico, espectáculos musicales y servicios de colectivo entre Santa Rosa y Toay. La organización pidió respetar los senderos y recordó que no se permite ingresar con mascotas ni fumar en el predio.

📲 Leé la nota completa ingresando al link de nuestra bio.
¿Qué opinás? Te leemos en los comentarios 👇

#ImpactoCastex #EduardoCastex #LaPampa #ExpoVivero2026 #Toay #JardínBotánico`;

export function CasoImpacto() {
  return (
    <div className="caso-detail">
      <section className="caso-block">
        <h4 className="caso-title">Una redacción que puede usar todo el equipo</h4>
        <p className="caso-lead">
          El diario se ve como un medio profesional para quien lo mira, y el panel también se
          trabaja de punta a punta para quien redacta con lector de pantalla o por voz.
        </p>
        <ul className="caso-grid">
          {USABILIDAD.map(([title, text]) => (
            <li key={title} className="caso-item">
              <strong>{title}</strong>
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="caso-block">
        <h4 className="caso-title">Integrado con Hermes</h4>
        <p className="caso-lead">
          Hermes es el motor de noticias de Sodium. El diario lo recibe como a un redactor más,
          con firma propia y dentro de las mismas reglas que el resto del equipo.
        </p>
        <ol className="caso-flow">
          {HERMES.map(([n, title, text]) => (
            <li key={n} className="caso-step">
              <span className="caso-step-n">{n}</span>
              <strong>{title}</strong>
              <span>{text}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="caso-block">
        <h4 className="caso-title">De la nota a la placa y el copy</h4>
        <p className="caso-lead">
          Muestra real, generada por el sistema a partir de{' '}
          <a href={NOTA_URL} target="_blank" rel="noopener noreferrer">esta nota del diario ↗</a>.
          La IA escribe el titular de la placa, elige qué resaltar y redacta un texto para cada red.
        </p>
        <ul className="caso-cards">
          {PLACAS.map(([id, label]) => (
            <li key={id}>
              <img
                src={`/cases/impacto-redes/${id}.jpg`}
                alt={`Placa diseño ${label}: La Expo Vivero llega a Toay con entrada gratuita`}
                width="720"
                height="900"
                loading="lazy"
                decoding="async"
              />
              <span>{label}</span>
            </li>
          ))}
        </ul>
        <div className="caso-copys">
          <figure className="caso-copy">
            <figcaption>Facebook</figcaption>
            <p>{COPY_FACEBOOK}</p>
          </figure>
          <figure className="caso-copy">
            <figcaption>Instagram</figcaption>
            <p>{COPY_INSTAGRAM}</p>
          </figure>
        </div>
        <ul className="caso-notes">
          <li>Antes de publicar, el equipo puede revisar y editar los textos, y ver la placa actualizada.</li>
          <li>Cada red tiene su diseño por defecto, que se puede cambiar por nota, y el prompt se edita desde el panel.</li>
          <li>La página se conecta desde el panel. Si una red falla, la otra sale igual y se puede reintentar.</li>
        </ul>
      </section>
    </div>
  );
}
