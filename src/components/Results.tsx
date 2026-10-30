import { results } from '../data/belgium'
import { CountUp } from './CountUp'
import { Reveal } from './Reveal'

// התוצאות בתחרות, מתוך src/data/belgium.ts
export function Results() {
  return (
    <ul className="results" aria-label="התוצאות בתחרות">
      {results.map((r, i) => (
        <li key={r.label}>
          <Reveal delay={i * 0.1} className="results__item">
            <span className="results__value">
              <span className="results__prefix">{r.prefix}</span>
              <CountUp to={r.value} text={String(r.value)} />
            </span>
            <span className="results__label">{r.label}</span>
          </Reveal>
        </li>
      ))}
    </ul>
  )
}
