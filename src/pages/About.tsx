import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { about, milestones } from '../data/about'
import { teams } from '../data/teams'

export default function About() {
  return (
    <>
      <PageHeader eyebrow="Afeka Racing Team" title={about.title}>
        {about.lead}
      </PageHeader>

      <section className="section">
        <div className="container">
          <h2 className="section-title">הדרך שלנו</h2>
          <ol className="timeline">
            {milestones.map((m, i) => (
              <Reveal key={m.title} delay={i * 0.1}>
                <li className="timeline__item">
                  <span className="timeline__year ltr">{m.year}</span>
                  <h3>{m.title}</h3>
                  <p>{m.text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--white">
        <div className="container">
          <h2 className="section-title">5 צוותים, רכב אחד</h2>
          <div className="team-grid">
            {teams.map((t, i) => (
              <Reveal key={t.id} delay={i * 0.06}>
                <article className="team-card">
                  <h3>{t.name}</h3>
                  <ul className="chips">
                    {t.areas.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                  <p>{t.didOnCar}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
