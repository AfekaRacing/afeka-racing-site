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
            {site.logos.afeka && (
              <img className="footer__afeka" src={site.logos.afeka} alt={site.college} loading="lazy" />
            )}
          </div>
        </div>

        <div className="footer__sponsors">
          <h2>השותפים שלנו</h2>
          <ul className="sponsor-wall">
            {sponsors.map((s) => (
              <li key={s.name} className="sponsor-wall__item">
                {s.url ? (
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    <img src={s.logo} alt={s.name} loading="lazy" />
                  </a>
                ) : (
                  <img src={s.logo} alt={s.name} loading="lazy" />
                )}
              </li>
            ))}
          </ul>
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
