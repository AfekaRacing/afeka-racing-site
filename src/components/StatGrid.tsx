import type { Stat } from '../data/race'
import { Reveal } from './Reveal'

export function StatGrid({ stats }: { stats: Stat[] }) {
  return (
    <dl className="stats">
      {stats.map((s, i) => (
        <Reveal key={s.label} delay={i * 0.08} className="stat">
          <dt className="stat__label">{s.label}</dt>
          <dd className="stat__value">
            <span className="ltr">{s.value}</span>
            {s.unit && <span className="stat__unit ltr">{s.unit}</span>}
          </dd>
        </Reveal>
      ))}
    </dl>
  )
}
