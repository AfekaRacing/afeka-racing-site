import { Link } from 'react-router-dom'
import { joinCta, nav, site, whatsappLink } from '../data/site'
import { sponsors } from '../data/sponsors'
import { InstagramIcon, MailIcon, WhatsappIcon } from './Icons'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <h2>{site.name}</h2>
            <p>
              מועדון הסטודנטים של {site.college} שבונה רכבים סולאריים.
            </p>
            <a className="insta-big" href={site.contact.instagram} target="_blank" rel="noopener noreferrer">
              <InstagramIcon />
              <span>
                עקבו אחרינו <span className="ltr">{site.contact.instagramHandle}</span>
              </span>
            </a>
          </div>

          <nav aria-label="ניווט בפוטר">
            <h2>באתר</h2>
            <ul>
              {[...nav, joinCta].map((item) => (
                <li key={item.to}>
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer__contact">
            <h2>יצירת קשר</h2>
            <ul>
              <li>
                <a href={`mailto:${site.contact.email}`}>
                  <MailIcon />
                  <span className="ltr">{site.contact.email}</span>
                </a>
              </li>
              <li>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                  <WhatsappIcon />
                  <span>
                    וואטסאפ: {site.contact.whatsappName} <span className="ltr">{site.contact.whatsappDisplay}</span>
                  </span>
                </a>
              </li>
            </ul>
            <div style={{ marginTop: 24 }}>
              {site.logos.afeka ? (
                <img src={site.logos.afeka} alt={site.college} style={{ height: 48, width: 'auto' }} />
              ) : (
                <span className="logo-slot">לוגו אפקה</span>
              )}
            </div>
          </div>
        </div>

        <div className="footer__sponsors">
          <h2>השותפים שלנו</h2>
          <div className="footer__sponsors-row">
            {sponsors.length === 0 ? (
              <span className="logo-slot">לוגואים של ספונסרים</span>
            ) : (
              sponsors.map((s) => (
                <img key={s.name} src={s.logo} alt={s.name} loading="lazy" style={{ height: 40, width: 'auto' }} />
              ))
            )}
          </div>
        </div>

        <div className="footer__bottom">
          <span>
            © {new Date().getFullYear()} {site.name}
          </span>
          <span>{site.college}</span>
        </div>
      </div>
    </footer>
  )
}
