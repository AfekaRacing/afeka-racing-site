import { useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { Photo } from '../components/Photo'
import { Reveal } from '../components/Reveal'
import { projects, type Project } from '../data/projects'
import { teamName, teams, type TeamId } from '../data/teams'

const steps: { key: keyof Project; label: string }[] = [
  { key: 'wanted', label: 'מה רצינו' },
  { key: 'built', label: 'מה בנינו' },
  { key: 'problem', label: 'מה השתבש' },
  { key: 'fix', label: 'איך תיקנו' },
]

export default function Projects() {
  const [team, setTeam] = useState<TeamId | 'all'>('all')
  const shown = team === 'all' ? projects : projects.filter((p) => p.team === team)

  return (
    <>
      <PageHeader eyebrow="אורנע 2" title="הפרויקטים">
        כל רכיב ברכב הוא פרויקט הנדסי בפני עצמו: מה רצינו, מה בנינו, מה השתבש ואיך תיקנו.
      </PageHeader>

      <section className="section">
        <div className="container">
          <div className="filter" role="group" aria-label="סינון לפי צוות">
            {[{ id: 'all' as const, name: 'הכול' }, ...teams].map((t) => (
              <button
                key={t.id}
                type="button"
                className="filter__btn"
                aria-pressed={team === t.id}
                onClick={() => setTeam(t.id)}
              >
                {t.name}
              </button>
            ))}
          </div>

          <p className="sr-only" aria-live="polite">
            מוצגים {shown.length} פרויקטים
          </p>

          <div className="project-grid">
            {shown.map((p) => (
              <Reveal key={p.id}>
                <article className="project-card" id={p.id}>
                  {p.image && <Photo className="project-card__img" src={p.image} alt={p.imageAlt ?? p.title} sizes="(min-width: 900px) 50vw, 100vw" />}
                  <div className="project-card__body">
                    <span className="tag">{teamName(p.team)}</span>
                    <h2>{p.title}</h2>
                    <dl className="facts">
                      {p.facts.map((f) => (
                        <div key={f.label}>
                          <dt>{f.label}</dt>
                          <dd>{f.value}</dd>
                        </div>
                      ))}
                    </dl>
                    <ol className="story-steps">
                      {steps
                        .filter((s) => p[s.key])
                        .map((s) => (
                          <li key={s.key} className={`story-steps__item story-steps__item--${s.key}`}>
                            <h3>{s.label}</h3>
                            <p>{p[s.key] as string}</p>
                          </li>
                        ))}
                    </ol>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
