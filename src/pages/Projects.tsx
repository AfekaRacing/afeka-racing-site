import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { Photo } from '../components/Photo'
import { projectsIntro, suns, type Detail, type TeamSun } from '../data/projects'
import { teamName } from '../data/teams'

// מיקום כל תחום על אליפסה סביב המרכז, החל מלמעלה ובכיוון השעון
function rayPosition(i: number, n: number) {
  const angle = (i / n) * Math.PI * 2
  return { x: 50 + 38 * Math.sin(angle), y: 50 - 41 * Math.cos(angle) }
}

function Sun({ sun, selected, onSelect }: { sun: TeamSun; selected: string; onSelect: (name: string) => void }) {
  const n = sun.topics.length
  return (
    <div className="sun">
      <svg className="sun__rays" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        {sun.topics.map((t, i) => {
          const p = rayPosition(i, n)
          return (
            <line
              key={t.name}
              x1="50"
              y1="50"
              x2={p.x}
              y2={p.y}
              className={t.detail ? 'sun__ray sun__ray--on' : 'sun__ray'}
              vectorEffect="non-scaling-stroke"
            />
          )
        })}
      </svg>

      <div className="sun__center">
        <Photo src={sun.center.src} alt={sun.center.alt} sizes="320px" />
        <span className="sun__team">צוות {teamName(sun.team)}</span>
      </div>

      <ul className="sun__topics">
        {sun.topics.map((t, i) => {
          const p = rayPosition(i, n)
          const style = { '--x': `${p.x}%`, '--y': `${p.y}%` } as React.CSSProperties
          return (
            <li key={t.name} className="sun__topic" style={style}>
              {t.detail ? (
                <button
                  type="button"
                  className="pill pill--on"
                  aria-pressed={selected === t.name}
                  aria-controls="topic-detail"
                  onClick={() => onSelect(t.name)}
                >
                  {t.name}
                </button>
              ) : (
                <span className="pill">{t.name}</span>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function DetailPanel({ name, detail }: { name: string; detail: Detail }) {
  return (
    <motion.article
      key={name}
      className="topic-detail"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="topic-detail__main">
        <h3 className="topic-detail__title">{name}</h3>
        <p className="lead">{detail.summary}</p>

        {detail.facts && (
          <dl className="facts">
            {detail.facts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {detail.steps && (
          <ol className="steps">
            {detail.steps.map((s, i) => (
              <li key={s.title} className="steps__item">
                <span className="steps__num ltr">{i + 1}</span>
                <div>
                  {s.when && <span className="steps__when">{s.when}</span>}
                  <h4>{s.title}</h4>
                  <p>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        )}

        {(detail.problem || detail.fix) && (
          <div className="problem-fix">
            {detail.problem && (
              <div className="problem-fix__item problem-fix__item--problem">
                <h4>מה השתבש</h4>
                <p>{detail.problem}</p>
              </div>
            )}
            {detail.fix && (
              <div className="problem-fix__item problem-fix__item--fix">
                <h4>איך תיקנו</h4>
                <p>{detail.fix}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {detail.image && (
        <Photo
          className="topic-detail__img"
          src={detail.image}
          alt={detail.imageAlt ?? name}
          sizes="(min-width: 1000px) 40vw, 100vw"
        />
      )}
    </motion.article>
  )
}

const firstFeatured = (sun: TeamSun) => sun.topics.find((t) => t.detail)?.name ?? ''

export default function Projects() {
  const [teamIndex, setTeamIndex] = useState(0)
  const sun = suns[teamIndex]
  const [selected, setSelected] = useState(firstFeatured(sun))
  const topic = sun.topics.find((t) => t.name === selected)

  const chooseTeam = (i: number) => {
    setTeamIndex(i)
    setSelected(firstFeatured(suns[i]))
  }

  return (
    <>
      <PageHeader eyebrow={projectsIntro.eyebrow} title={projectsIntro.title}>
        {projectsIntro.lead}
      </PageHeader>

      <section className="section">
        <div className="container">
          <div className="filter" role="group" aria-label="בחירת צוות">
            {suns.map((s, i) => (
              <button
                key={s.team}
                type="button"
                className="filter__btn"
                aria-pressed={i === teamIndex}
                onClick={() => chooseTeam(i)}
              >
                {teamName(s.team)}
              </button>
            ))}
          </div>

          <header className="sun-header">
            <h2 className="section-title">צוות {teamName(sun.team)}</h2>
            <p className="lead">{sun.tagline}</p>
            <p className="sun-legend">
              <span className="pill pill--on pill--legend" aria-hidden>
                ירוק
              </span>
              יש סיפור. לחצו כדי לקרוא.
            </p>
          </header>

          <Sun sun={sun} selected={selected} onSelect={setSelected} />

          <div id="topic-detail" aria-live="polite">
            <AnimatePresence mode="wait">
              {topic?.detail && <DetailPanel key={topic.name} name={topic.name} detail={topic.detail} />}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  )
}
