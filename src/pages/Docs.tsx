import { ArrowIcon } from '../components/Icons'
import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { docs, docsPage, downloadMinPages } from '../data/docs'

const base = import.meta.env.BASE_URL
const img = (src: string, width?: number) => `${base}${src}${width ? `-${width}` : ''}.webp`

export default function Docs() {
  return (
    <>
      <PageHeader eyebrow={docsPage.eyebrow} title={docsPage.title}>
        {docsPage.lead}
      </PageHeader>

      <section className="section">
        <div className="container docs">
          {docs.map((doc) => {
            const download = doc.file && doc.file.pages > downloadMinPages ? doc.file : undefined
            return (
              <Reveal key={doc.id}>
                <details className="doc-card" id={doc.id}>
                  <summary className="doc-card__summary">
                    <span className="doc-card__title">
                      <h2>{doc.title}</h2>
                      {doc.file && (
                        <span className="doc-card__meta">
                          PDF · <span className="ltr">{doc.file.pages}</span> {docsPage.pages}
                        </span>
                      )}
                    </span>
                    <span className="doc-card__chevron" aria-hidden="true" />
                  </summary>

                  <div className="doc-card__body">
                    <p>{doc.text}</p>
                    {doc.steps && (
                      <ol className="doc-steps">
                        {doc.steps.map((step, i) => (
                          <li key={step.src}>
                            <span className="doc-steps__num ltr">{i + 1}</span>
                            <a href={img(step.src)} target="_blank" rel="noopener">
                              <img
                                src={img(step.src, 800)}
                                srcSet={`${img(step.src, 800)} 800w, ${img(step.src)} 1600w`}
                                sizes="(min-width: 1100px) 1000px, 100vw"
                                alt={step.alt}
                                loading="lazy"
                                width={1600}
                                height={900}
                              />
                            </a>
                          </li>
                        ))}
                      </ol>
                    )}
                    {(download || doc.link) && (
                      <div className="doc-card__actions">
                        {download && (
                          <a className="btn btn--primary" href={`${base}${download.src}`} download>
                            {docsPage.download} <DownloadIcon />
                          </a>
                        )}
                        {doc.link && (
                          <a className="btn btn--ghost" href={doc.link.href} target="_blank" rel="noopener noreferrer">
                            {doc.link.label} <ArrowIcon />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </details>
              </Reveal>
            )
          })}
        </div>
      </section>
    </>
  )
}

function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
    </svg>
  )
}
