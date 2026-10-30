import { Link } from 'react-router-dom'
import { site } from '../data/site'

export function Brand() {
  return (
    <Link to="/" className="brand" aria-label={`${site.name} – לדף הבית`}>
      {site.logos.club ? (
        <img className="brand__logo" src={site.logos.club} alt="" />
      ) : (
        <>
          <span className="brand__mark" aria-hidden>
            ART
          </span>
          <span className="brand__text">
            <span className="brand__name">{site.name}</span>
            <span className="brand__car">{site.carEn}</span>
          </span>
        </>
      )}
    </Link>
  )
}
