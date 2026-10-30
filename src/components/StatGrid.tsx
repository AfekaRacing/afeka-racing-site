import type { Stat } from '../data/race'
import { CountUp } from './CountUp'
import { Reveal } from './Reveal'

export function StatGrid({ stats }: { stats: Stat[] }) {
  return (
    <dl className="stats">
      {stats.map((s, i) => (
        <Reveal key={s.label} delay={i * 0.08} className="stat">
          <dt className="stat__label">{s.label}</dt>
          <dd className="stat__value">
            <CountUp to={s.count} text={s.value} />
            {s.unit && <span className="stat__unit ltr">{s.unit}</span>}
          </dd>
        </Reveal>
      ))}
    </dl>
  )
}
