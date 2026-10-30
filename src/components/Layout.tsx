import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'

export function Layout() {
  const { pathname, hash } = useLocation()

  // מעבר עמוד: חוזרים לראש העמוד, או לעוגן (#) אם יש. העמודים נטענים בעצלות, אז מחכים שהעוגן יופיע.
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    let tries = 0
    const timer = setInterval(() => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el || ++tries > 20) {
        clearInterval(timer)
        el?.scrollIntoView({ behavior: 'instant' })
      }
    }, 50)
    return () => clearInterval(timer)
  }, [pathname, hash])

  return (
    <>
      <a href="#main" className="skip-link">
        דלגו לתוכן
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Suspense fallback={<div className="page-loading" aria-busy="true" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
