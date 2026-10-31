import { classResults } from '../data/belgium'
import { Reveal } from './Reveal'

// הדגלים מ-src/assets/flags (מתוך flag-icons), לפי קוד מדינה
const flags = import.meta.glob<string>('../assets/flags/*.svg', { eager: true, query: '?url', import: 'default' })
const flagUrl = (code: string) => flags[`../assets/flags/${code}.svg`]

// טבלת התוצאות של הקטגוריה, מתוך src/data/belgium.ts
export function ClassResults() {
  const max = Math.max(...classResults.rows.map((r) => r.laps))
  return (
    <section className="section class-results" aria-labelledby="class-results-title">
      <div className="container">
        <Reveal>
          <h2 id="class-results-title" className="section-title">
            {classResults.title}
          </h2>
          <p className="lead">{classResults.lead}</p>
        </Reveal>
        <ol className="standings">
          {classResults.rows.map((r) => (
            <li key={r.pos} className={`standings__row${r.us ? ' standings__row--us' : ''}`}>
              <span className="standings__pos ltr">{r.pos}</span>
              <img className="standings__flag" src={flagUrl(r.country)} alt="" width={24} height={18} loading="lazy" />
              <span className="standings__team ltr">
                <b>{r.team}</b>
                {r.car && <small>{r.car}</small>}
              </span>
              <span className="standings__bar" aria-hidden>
                <span style={{ width: `${(r.laps / max) * 100}%` }} />
              </span>
              <span className="standings__laps">
                <b className="ltr">{r.laps}</b> הקפות
              </span>
            </li>
          ))}
        </ol>
        <p className="standings__source">{classResults.source}</p>
      </div>
    </section>
  )
}
