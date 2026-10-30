import { PageHeader } from '../components/PageHeader'

// עמוד זמני לאזורים שייבנו בשלבים הבאים.
export function makePlaceholder(title: string, eyebrow: string, note: string) {
  return function PlaceholderPage() {
    return (
      <>
        <PageHeader eyebrow={eyebrow} title={title} />
        <section className="section">
          <div className="container">
            <p className="lead">
              <span className="todo">{note}</span>
            </p>
          </div>
        </section>
      </>
    )
  }
}
