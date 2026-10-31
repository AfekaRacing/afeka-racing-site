import { Link } from 'react-router-dom'
import { ArrowIcon, InstagramIcon } from '../components/Icons'
import { Photo } from '../components/Photo'
import { Results } from '../components/Results'
import { Reveal } from '../components/Reveal'
import { StatGrid } from '../components/StatGrid'
import { explore, hero, intro, next } from '../data/home'
import { raceStats } from '../data/race'
import { site } from '../data/site'

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero__media">
          {hero.image ? (
            <Photo src={hero.image} alt={hero.imageAlt} priority />
          ) : (
            <div className="hero__placeholder">
              <span>[להשלים: תמונת ה-Hero של אורנע בזולדר]</span>
            </div>
          )}
        </div>
        <div className="container hero__content">
          <Reveal>
            <span className="eyebrow">{hero.eyebrow}</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="hero__title">
              <span className="hero__number ltr">{hero.titleNumber}</span>
              <span className="hero__unit">{hero.titleUnit},</span>
              <span className="hero__sub">{hero.subtitle}</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="btn-row">
              <Link to={hero.primaryCta.to} className="btn btn--primary">
                {hero.primaryCta.label}
                <ArrowIcon />
              </Link>
              <Link to={hero.secondaryCta.to} className="btn btn--ghost">
                {hero.secondaryCta.label}
              </Link>
              <a
                className="icon-btn hero__insta"
                href={site.contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramIcon title="אינסטגרם" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--dark stats-band">
        <div className="container">
          <StatGrid stats={raceStats} />
          <Results />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="eyebrow">{intro.eyebrow}</span>
            <h2 className="section-title intro__title">{intro.title}</h2>
            {intro.paragraphs.map((p) => (
              <p key={p} className="lead intro__p">
                {p}
              </p>
            ))}
          </Reveal>
          <ol className="roadmap" aria-label="היעדים שלנו">
            {intro.roadmap.map((step, i) => (
              <li key={step.when}>
                <Reveal delay={i * 0.12} className={`roadmap__step roadmap__step--${step.status}`}>
                  <span className="roadmap__when">{step.when}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
          <Link to={intro.link.to} className="text-link">
            {intro.link.label} <ArrowIcon />
          </Link>
          <div className="card-grid">
            {explore.map((item, i) => (
              <Reveal key={item.to} delay={i * 0.1}>
                <Link to={item.to} className="explore-card">
                  <span className="explore-card__num ltr">0{i + 1}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <span className="explore-card__arrow">
                    <ArrowIcon />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--dark next-band">
        <div className="container next-band__inner">
          <Reveal>
            <span className="eyebrow">{next.eyebrow}</span>
            <h2 className="section-title">{next.title}</h2>
            <p className="lead">{next.text}</p>
            <Link to={next.cta.to} className="btn btn--primary">
              {next.cta.label}
            </Link>
          </Reveal>
          <Reveal delay={0.15} className="next-band__goal">
            <span className="next-band__number ltr">{next.goalNumber}</span>
            <span className="next-band__unit">{next.goalUnit}</span>
          </Reveal>
        </div>
      </section>
    </>
  )
}
