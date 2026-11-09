import { useEffect } from 'react'
import { taskTeams, tasksPage as page } from '../data/tasks'
import '../styles/tasks.css'

const logo = (kind: 'light' | 'dark') => `${import.meta.env.BASE_URL}brand/tasks/orna-${kind}.png`

function RegisterLink({ arrow = true }: { arrow?: boolean }) {
  return (
    <a className="tasks-cta" href={page.formUrl} target="_blank" rel="noopener">
      {page.cta}
      {arrow && (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      )}
    </a>
  )
}

// עמוד המשימות למצטרפים. כל הטקסטים ב-src/data/tasks.ts
export default function Tasks() {
  useEffect(() => {
    const title = document.title
    const meta = document.querySelector('meta[name="description"]')
    const description = meta?.getAttribute('content') ?? ''
    document.title = page.meta.title
    meta?.setAttribute('content', page.meta.description)
    return () => {
      document.title = title
      meta?.setAttribute('content', description)
    }
  }, [])

  return (
    <div className="tasks-page">
      <div className="tasks-wrap">
        <header className="tasks-hero">
          <div className="tasks-brand">
            <img className="tasks-logo tasks-logo--light" alt="ORNA" src={logo('light')} />
            <img className="tasks-logo tasks-logo--dark" alt="ORNA" src={logo('dark')} />
            <span className="tasks-eyebrow">{page.eyebrow}</span>
          </div>
          <h1>
            בחרו את <em>המשימה</em> שלכם
          </h1>
          <p className="tasks-lead">{page.lead}</p>
          <div>
            <RegisterLink />
          </div>
        </header>

        <nav className="tasks-cubes" aria-label="התחומים">
          {taskTeams.map((team) => (
            <a key={team.id} className="tasks-cube" href={`#${team.id}`}>
              <span className="tasks-cube__count">{team.count}</span>
              <span className="tasks-cube__name">{team.name}</span>
              {team.sub && <span className="tasks-cube__sub">{team.sub}</span>}
              <ul className="tasks-cube__list">
                {team.tasks.map((task) => (
                  <li key={task.id}>{task.title}</li>
                ))}
              </ul>
              <span className="tasks-cube__go">{page.toDetails}</span>
            </a>
          ))}
        </nav>

        {taskTeams.map((team) => (
          <section key={team.id} className="tasks-team" id={team.id}>
            <header className="tasks-team__head">
              <h2>{team.name}</h2>
              {team.sub && <span className="tasks-team__sub">{team.sub}</span>}
              <span className="tasks-team__count">{team.count}</span>
            </header>
            <div className="tasks-grid">
              {team.tasks.map((task) => (
                <article key={task.id} className="tasks-card" id={task.id}>
                  <h3>{task.title}</h3>
                  <p className="tasks-card__hook">{task.hook}</p>
                  <details>
                    <summary>
                      <span className="tasks-sum-open">{page.openDetails}</span>
                      <span className="tasks-sum-close">{page.closeDetails}</span>
                    </summary>
                    <div className="tasks-parts">
                      {task.parts.map((part) => (
                        <div key={part.title} className={`tasks-part ${part.out ? 'tasks-part--out' : ''}`}>
                          <h4>{part.title}</h4>
                          <p>{part.text}</p>
                        </div>
                      ))}
                    </div>
                  </details>
                </article>
              ))}
            </div>
          </section>
        ))}

        <section className="tasks-register" id="register">
          <h2>{page.register.title}</h2>
          <p>{page.register.text}</p>
          <RegisterLink />
        </section>
      </div>

      <div className="tasks-float">
        <RegisterLink arrow={false} />
      </div>
    </div>
  )
}
