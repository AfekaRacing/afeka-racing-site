import { motion, useScroll, useSpring } from 'motion/react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ClassResults } from '../components/ClassResults'
import { Photo, PhotoPlaceholder } from '../components/Photo'
import { RaceDebrief } from '../components/RaceDebrief'
import { Results } from '../components/Results'
import { Reveal } from '../components/Reveal'
import { StatGrid } from '../components/StatGrid'
import { chapters, intro, type Chapter } from '../data/belgium'
import { raceStats } from '../data/race'

function ChapterBlock({ c, index }: { c: Chapter; index: number }) {
  return (
    <section className={`chapter ${c.tone === 'hard' ? 'chapter--hard' : ''}`} id={c.id} aria-labelledby={`${c.id}-title`}>
      <div className="chapter__media">
        {c.images.length === 0 ? (
          <PhotoPlaceholder className="chapter__img" label={`תמונה: ${c.title}`} />
        ) : (
          c.images.map((img, i) => (
            <Reveal key={img.src} delay={i * 0.1}>
              <Photo className="chapter__img" src={img.src} alt={img.alt} sizes="(min-width: 900px) 55vw, 100vw" />
            </Reveal>
          ))
        )}
      </div>
      <div className="chapter__text">
        <Reveal>
          <span className="chapter__index ltr">{String(index + 1).padStart(2, '0')}</span>
          <span className="chapter__date ltr">{c.date}</span>
          <h2 id={`${c.id}-title`}>{c.title}</h2>
          <p className="lead">{c.text}</p>
          {c.todo && (
            <p>
              <span className="todo">[להשלים: {c.todo}]</span>
            </p>
          )}
          {c.quote !== undefined && (
            <blockquote className="quote">
              {c.quote || <span className="todo">[להשלים: ציטוט מחבר צוות]</span>}
            </blockquote>
          )}
        </Reveal>
      </div>
    </section>
  )
}

export default function Belgium() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  const raceIndex = chapters.findIndex((c) => c.id === 'race')

  return (
    <>
      <section className="page-header belgium-header">
        <div className="container">
          <span className="eyebrow">{intro.eyebrow}</span>
          <h1 className="page-header__title">{intro.title}</h1>
          <p className="lead">{intro.lead}</p>
          <ol className="belgium-toc">
            {chapters.map((c) => (
              <li key={c.id}>
                <a href={`#${c.id}`}>
                  <span className="ltr">{c.date}</span> {c.title}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="story" ref={ref}>
        <motion.div className="story__progress" style={{ scaleY: progress }} aria-hidden />
        <div className="container">
          {chapters.slice(0, raceIndex + 1).map((c, i) => (
            <ChapterBlock key={c.id} c={c} index={i} />
          ))}
        </div>

        <section className="section section--dark race-numbers" aria-label="המספרים של המרוץ">
          <div className="container">
            <Reveal>
              <span className="eyebrow">24 שעות במספרים</span>
            </Reveal>
            <StatGrid stats={raceStats} />
            <Results />
          </div>
        </section>

        <ClassResults />
        <RaceDebrief />

        <div className="container">
          {chapters.slice(raceIndex + 1).map((c, i) => (
            <ChapterBlock key={c.id} c={c} index={raceIndex + 1 + i} />
          ))}
        </div>
      </div>

      <section className="section section--dark next-band">
        <div className="container">
          <Reveal>
            <span className="eyebrow">הפרק הבא</span>
            <h2 className="section-title">אורנע 2.5: יעד 320 הקפות</h2>
            <p className="lead">רוצים להיות בצוות שייסע לבלגיה בפעם הבאה?</p>
            <Link to="/join" className="btn btn--primary">
              הצטרפו אלינו
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
