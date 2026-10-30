import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { joinCta, nav, site } from '../data/site'
import { Brand } from './Brand'
import { InstagramIcon, MenuIcon } from './Icons'

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  const links = nav.map((item) => (
    <li key={item.to}>
      <NavLink to={item.to} end={item.to === '/'} className="nav__link">
        {item.label}
      </NavLink>
    </li>
  ))

  return (
    <>
      <header className={`header ${scrolled || open || pathname !== '/' ? 'header--solid' : ''}`}>
        <div className="container header__inner">
          <Brand />
          <nav className="nav" aria-label="ניווט ראשי">
            <ul className="nav__list">{links}</ul>
          </nav>
          <div className="header__actions">
            <a className="icon-btn" href={site.contact.instagram} target="_blank" rel="noopener noreferrer">
              <InstagramIcon title="אינסטגרם" />
            </a>
            <Link to={joinCta.to} className="btn btn--primary header__join">
              {joinCta.label}
            </Link>
            <button
              type="button"
              className="icon-btn menu-toggle"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'סגירת תפריט' : 'פתיחת תפריט'}
              onClick={() => setOpen((o) => !o)}
            >
              <MenuIcon open={open} />
            </button>
          </div>
        </div>
      </header>
      {open && (
        <div id="mobile-menu" className="mobile-menu">
          <nav aria-label="ניווט ראשי (נייד)">
            <ul>{links}</ul>
          </nav>
          <Link to={joinCta.to} className="btn btn--primary">
            {joinCta.label}
          </Link>
        </div>
      )}
    </>
  )
}
