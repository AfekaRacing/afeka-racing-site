import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { photoUrl } from '../components/Photo'
import { galleryEvents, galleryImages } from '../data/gallery'
import { teamName, teams, type TeamId } from '../data/teams'

function Lightbox({
  index,
  list,
  onClose,
  onMove,
}: {
  index: number
  list: typeof galleryImages
  onClose: () => void
  onMove: (delta: number) => void
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const img = list[index]

  useEffect(() => {
    const d = dialog.current
    if (d && !d.open) d.showModal()
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // בעברית "קדימה" הוא שמאלה
      if (e.key === 'ArrowLeft') onMove(1)
      if (e.key === 'ArrowRight') onMove(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onMove])

  return (
    <dialog
      ref={dialog}
      className="lightbox"
      aria-label="תמונה מוגדלת"
      onClose={onClose}
      onClick={(e) => e.target === dialog.current && dialog.current?.close()}
    >
      <figure className="lightbox__figure">
        <img src={photoUrl(img.src, 1600)} alt={img.alt} width={img.width} height={img.height} />
        <figcaption>
          {img.event.label} · <span className="ltr">{img.event.date}</span>
          <span className="lightbox__count ltr">
            {index + 1} / {list.length}
          </span>
        </figcaption>
      </figure>
      <button type="button" className="lightbox__btn lightbox__close" onClick={() => dialog.current?.close()} aria-label="סגירה">
        ×
      </button>
      <button type="button" className="lightbox__btn lightbox__prev" onClick={() => onMove(-1)} aria-label="התמונה הקודמת">
        ›
      </button>
      <button type="button" className="lightbox__btn lightbox__next" onClick={() => onMove(1)} aria-label="התמונה הבאה">
        ‹
      </button>
    </dialog>
  )
}

export default function Gallery() {
  const [event, setEvent] = useState<string>('all')
  const [team, setTeam] = useState<TeamId | 'all'>('all')
  const [open, setOpen] = useState<number | null>(null)

  const taggedTeams = useMemo(() => teams.filter((t) => galleryImages.some((i) => i.teams.includes(t.id))), [])
  const list = useMemo(
    () =>
      galleryImages.filter(
        (i) => (event === 'all' || i.event.folder === event) && (team === 'all' || i.teams.includes(team)),
      ),
    [event, team],
  )

  const move = useCallback(
    (delta: number) => setOpen((cur) => (cur === null ? cur : (cur + delta + list.length) % list.length)),
    [list.length],
  )

  return (
    <>
      <PageHeader eyebrow="תמונות" title="גלריה">
        מהניסוי הראשון ועד קו הסיום בזולדר.
      </PageHeader>

      <section className="section">
        <div className="container">
          <div className="filter" role="group" aria-label="סינון לפי אירוע">
            {[{ folder: 'all', label: 'הכול' }, ...galleryEvents].map((e) => (
              <button
                key={e.folder}
                type="button"
                className="filter__btn"
                aria-pressed={event === e.folder}
                onClick={() => setEvent(e.folder)}
              >
                {e.label}
              </button>
            ))}
          </div>

          {taggedTeams.length >= 2 && (
            <div className="filter" role="group" aria-label="סינון לפי צוות">
              {[{ id: 'all' as const, name: 'כל הצוותים' }, ...taggedTeams].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className="filter__btn"
                  aria-pressed={team === t.id}
                  onClick={() => setTeam(t.id)}
                >
                  {t.id === 'all' ? t.name : `צוות ${teamName(t.id)}`}
                </button>
              ))}
            </div>
          )}

          <p className="sr-only" aria-live="polite">
            מוצגות {list.length} תמונות
          </p>

          <ul className="gallery-grid">
            {list.map((img, i) => (
              <li key={img.src}>
                <button type="button" className="gallery-item" onClick={() => setOpen(i)} aria-label={`הגדלה: ${img.alt}`}>
                  <img
                    src={photoUrl(img.src, 800)}
                    alt={img.alt}
                    width={img.width}
                    height={img.height}
                    loading="lazy"
                    decoding="async"
                  />
                </button>
              </li>
            ))}
          </ul>

          {list.length === 0 && <p className="lead">אין תמונות בסינון הזה.</p>}
        </div>
      </section>

      {open !== null && list[open] && (
        <Lightbox index={open} list={list} onClose={() => setOpen(null)} onMove={move} />
      )}
    </>
  )
}
