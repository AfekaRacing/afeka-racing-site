import { raceDebrief } from '../data/belgium'
import { Reveal } from './Reveal'

// סיכום ניתוח 24 השעות, מתוך src/data/belgium.ts
export function RaceDebrief() {
  const total = raceDebrief.breakdown.reduce((n, b) => n + b.hours, 0)
  return (
    <section className="section debrief" aria-labelledby="debrief-title">
      <div className="container">
        <Reveal>
          <span className="eyebrow">{raceDebrief.eyebrow}</span>
          <h2 id="debrief-title" className="section-title">
            {raceDebrief.title}
          </h2>
          <p className="lead">{raceDebrief.lead}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="debrief__bar" role="img" aria-label={raceDebrief.breakdown.map((b) => `${b.label}: ${b.hours} שעות`).join(', ')}>
            {raceDebrief.breakdown.map((b) => (
              <span key={b.label} className={`debrief__seg debrief__seg--${b.tone}`} style={{ flexGrow: b.hours / total }} />
            ))}
          </div>
          <ul className="debrief__legend">
            {raceDebrief.breakdown.map((b) => (
              <li key={b.label}>
                <i className={`debrief__seg--${b.tone}`} />
                {b.label} <b className="ltr">{b.hours}</b> ש׳
              </li>
            ))}
          </ul>
        </Reveal>
        <div className="debrief__points">
          {raceDebrief.points.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.1} className="debrief__point">
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="debrief__lessons">
          <h3>{raceDebrief.lessonsTitle}</h3>
          <ol>
            {raceDebrief.lessons.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  )
}
