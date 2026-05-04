import './sections.css';

const STATS = [
  { num: '14', unit: 'proyectos', cap: 'en producción para clientes activos' },
  { num: '99.98', unit: '%', cap: 'uptime promedio en sistemas con SLA' },
  { num: '2.4', unit: 's', cap: 'latencia media de respuesta de agentes IA' },
  { num: '04', unit: 'personas', cap: 'equipo fijo · sin tercerización' },
];

export function Stats() {
  return (
    <section className="section stats">
      <div className="section-inner">
        <div className="stats-grid">
          {STATS.map(s => (
            <div key={s.num} className="stat">
              <div className="stat-num">
                {s.num}
                <span>{s.unit}</span>
              </div>
              <div className="stat-cap">{s.cap}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
