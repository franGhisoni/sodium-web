import { QUESTIONS } from '../content/faq';

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
