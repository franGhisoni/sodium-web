import './sections.css';

const QUESTIONS = [
  {
    question: '¿Con qué tipo de proyectos trabajan?',
    answer: 'Trabajamos con empresas y proyectos que quieren aplicar IA en una operación concreta: ventas, atención, análisis, conocimiento interno o tareas repetitivas. Si la oportunidad todavía no está clara, empezamos por mapear y priorizar.',
  },
  {
    question: '¿Desarrollan modelos de IA propios?',
    answer: 'No es nuestro objetivo. Elegimos los mejores modelos disponibles para cada caso y construimos el sistema que los conecta con tus datos, herramientas, reglas y equipo. Nuestro valor está en la aplicación, no en reinventar el modelo.',
  },
  {
    question: '¿Cuánto tarda un proyecto?',
    answer: 'Un primer diagnóstico y alcance llega en 48 horas. Una intervención puntual puede salir en semanas; un sistema integrado a varios flujos suele requerir entre 4 y 10 semanas de implementación.',
  },
  {
    question: '¿Trabajan con nuestro equipo interno?',
    answer: 'Sí. Podemos funcionar como equipo completo o integrarnos con diseño, producto y tecnología de tu empresa. Documentamos decisiones, hacemos demos semanales y dejamos el código en tus repositorios.',
  },
  {
    question: '¿Qué pasa después del lanzamiento?',
    answer: 'Hacemos el acompañamiento inicial, monitoreamos el sistema y resolvemos lo que aparezca en producción. Después podés quedarte con la operación o continuar con nosotros para mejoras, soporte y evolución.',
  },
];

export function Faq() {
  return (
    <section className="section faq" id="faq">
      <div className="section-inner faq-layout">
        <header className="section-head faq-head">
          <span className="pill">
            <span className="pill-dot" />
            FAQ
          </span>
          <h2 className="section-title">
            Lo importante, <em>sin letra chica.</em>
          </h2>
          <p className="section-sub">
            Si tu pregunta no aparece acá, la respondemos en el brief de 30 minutos.
          </p>
        </header>

        <div className="faq-list">
          {QUESTIONS.map(({ question, answer }) => (
            <details className="faq-item" key={question}>
              <summary>
                <span>{question}</span>
                <span className="faq-icon" aria-hidden="true" />
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
