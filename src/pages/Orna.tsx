import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { Photo } from '../components/Photo'
import { ornaViewer, parts, type Part } from '../data/parts'
import { teamName } from '../data/teams'
import { deviceProfile } from '../three/device'

// התלת-ממד (three.js) נטען רק כשבאמת מציגים אותו
const OrnaScene = lazy(() => import('../three/OrnaScene'))

function PartInfo({ part, onClose }: { part: Part; onClose?: () => void }) {
  return (
    <article className="part-info" aria-live="polite">
      {onClose && (
        <button type="button" className="part-info__close" onClick={onClose} aria-label="סגירת כרטיס הרכיב">
          ×
        </button>
      )}
      <span className="tag">צוות {teamName(part.team)}</span>
      <h2 className="part-info__title">{part.name}</h2>
      <p>{part.description}</p>
      <ul className="part-info__facts">
        {part.facts.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      {part.image && (
        <Photo className="part-info__img" src={part.image} alt={part.imageAlt ?? part.name} sizes="360px" />
      )}
    </article>
  )
}

function PartList({ selectedId, onSelect }: { selectedId: string | null; onSelect: (id: string) => void }) {
  return (
    <nav className="part-list" aria-label="רשימת רכיבים">
      <h2 className="part-list__title">רכיבים</h2>
      <ul>
        {parts.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              className="part-list__btn"
              aria-pressed={selectedId === p.id}
              onClick={() => onSelect(p.id)}
            >
              <span className="part-list__dot" style={{ background: p.color }} aria-hidden />
              {p.name}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default function Orna() {
  const device = useMemo(deviceProfile, [])
  const [mode, setMode] = useState<'3d' | 'list'>(device.weak ? 'list' : '3d')
  const [explode, setExplode] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [resetSignal, setResetSignal] = useState(0)
  const selected = parts.find((p) => p.id === selectedId) ?? null
  const usingPlaceholder = parts.some((p) => !p.model)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSelectedId(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const select = (id: string | null) => setSelectedId((cur) => (cur === id ? null : id))

  return (
    <>
      <PageHeader eyebrow={ornaViewer.eyebrow} title={ornaViewer.title}>
        {ornaViewer.lead}
      </PageHeader>

      <section className="section orna">
        <div className="container">
          <div className="orna__toolbar">
            {mode === '3d' && (
              <>
                <label className="explode">
                  <span className="explode__label">פירוק</span>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={explode}
                    onChange={(e) => setExplode(Number(e.target.value))}
                    aria-valuetext={`${Math.round(explode * 100)}%`}
                  />
                  <span className="explode__value ltr">{Math.round(explode * 100)}%</span>
                </label>
                <button
                  type="button"
                  className="btn btn--ghost orna__btn"
                  onClick={() => {
                    setSelectedId(null)
                    setResetSignal((n) => n + 1)
                  }}
                >
                  הרכב השלם
                </button>
              </>
            )}
            {device.webgl && (
              <button
                type="button"
                className="btn btn--ghost orna__btn orna__mode"
                onClick={() => setMode((m) => (m === '3d' ? 'list' : '3d'))}
              >
                {mode === '3d' ? 'תצוגת רשימה' : 'תצוגה תלת-ממדית'}
              </button>
            )}
          </div>

          {mode === '3d' ? (
            <div className="orna__layout">
              <PartList selectedId={selectedId} onSelect={select} />
              <div className="orna__stage">
                <div className="orna__canvas">
                  <Suspense fallback={<div className="orna__loading">טוען את המודל…</div>}>
                    <OrnaScene
                      parts={parts}
                      explode={explode}
                      selectedId={selectedId}
                      onSelect={select}
                      lite={device.lite}
                      resetSignal={resetSignal}
                    />
                  </Suspense>
                  <p className="orna__hint" aria-hidden>
                    {device.mobile ? 'גררו כדי לסובב · צבטו כדי להגדיל' : 'גררו כדי לסובב · גלגלת כדי להגדיל · לחצו על רכיב'}
                  </p>
                </div>
              </div>
              <div className="orna__side">
                {selected ? (
                  <PartInfo part={selected} onClose={() => setSelectedId(null)} />
                ) : (
                  <p className="orna__empty">בחרו רכיב מהרשימה או לחצו עליו במודל</p>
                )}
              </div>
            </div>
          ) : (
            <div className="part-cards">
              {!device.webgl && <p className="lead">הדפדפן הזה לא תומך בתלת-ממד, אז הנה כל הרכיבים ברשימה.</p>}
              {parts.map((p) => (
                <PartInfo key={p.id} part={p} />
              ))}
            </div>
          )}

          {usingPlaceholder && mode === '3d' && (
            <p className="orna__note">
              <span className="todo">{ornaViewer.placeholderNote}</span>
            </p>
          )}
        </div>
      </section>
    </>
  )
}
