import { useState, type FormEvent } from 'react'
import { InstagramIcon, WhatsappIcon } from '../components/Icons'
import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { baton, expectations, googleForm, joinIntro, whatAwaits } from '../data/join'
import { site, whatsappLink } from '../data/site'
import { teams } from '../data/teams'

type Status = 'idle' | 'sending' | 'sent' | 'error'

// שליחה ל-Google Form. Google לא מחזיר תשובה קריאה (no-cors), אז שליחה בלי שגיאת רשת נחשבת הצלחה.
async function submitToGoogleForm(form: HTMLFormElement) {
  const data = new FormData(form)
  const get = (k: string) => String(data.get(k) ?? '').trim()
  const e = googleForm.entries
  const chosenTeams = data.getAll('teams').map(String)

  const about = get('about')
  const email = get('email')
  const body = new URLSearchParams({
    [e.name]: get('name'),
    [e.degree]: get('degree'),
    [e.year]: get('year'),
    [e.phone]: get('phone'),
    [e.teams]: chosenTeams.join(', '),
    [e.about]: e.email ? about : `מייל: ${email}${about ? `\n${about}` : ''}`,
  })
  if (e.email) body.set(e.email, email)

  await fetch(googleForm.action, { method: 'POST', mode: 'no-cors', body })
}

function JoinForm() {
  const [status, setStatus] = useState<Status>('idle')

  const onSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    const form = ev.currentTarget
    if (!form.reportValidity()) return
    setStatus('sending')
    try {
      await submitToGoogleForm(form)
      setStatus('sent')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="join-form join-form--done" role="status">
        <h3>קיבלנו! 🏁</h3>
        <p>נחזור אליכם בקרוב עם פרטים על יום החשיפה והמטלה הראשונה. בינתיים, עקבו אחרינו באינסטגרם.</p>
        <a className="insta-big" href={site.contact.instagram} target="_blank" rel="noopener noreferrer">
          <InstagramIcon />
          <span className="ltr">{site.contact.instagramHandle}</span>
        </a>
      </div>
    )
  }

  return (
    <form className="join-form" onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor="f-name">שם מלא *</label>
        <input id="f-name" name="name" required autoComplete="name" />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="f-phone">טלפון *</label>
          <input
            id="f-phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            pattern="[0-9\-+ ]{9,15}"
            dir="ltr"
            title="מספר טלפון, למשל 050-1234567"
          />
        </div>
        <div className="field">
          <label htmlFor="f-email">מייל *</label>
          <input id="f-email" name="email" type="email" required autoComplete="email" dir="ltr" />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="f-degree">תחום לימוד *</label>
          <select id="f-degree" name="degree" required defaultValue="">
            <option value="" disabled>
              בחרו תואר
            </option>
            {googleForm.degrees.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="f-year">שנת לימוד *</label>
          <select id="f-year" name="year" required defaultValue="">
            <option value="" disabled>
              בחרו שנה
            </option>
            {googleForm.years.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      <fieldset className="field">
        <legend>באיזה צוות תרצו להיות? (אפשר לבחור כמה)</legend>
        <div className="team-checks">
          {teams.map((t) => (
            <label key={t.id} className="team-check">
              <input type="checkbox" name="teams" value={t.name} />
              <span>{t.name}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="field">
        <label htmlFor="f-about">כמה מילים על עצמכם</label>
        <textarea
          id="f-about"
          name="about"
          rows={4}
          placeholder="2–3 משפטים: ניסיון רלוונטי (אם יש), מאיפה אתם, מה מסקרן אתכם"
        />
      </div>

      {status === 'error' && (
        <p className="form-error" role="alert">
          השליחה לא הצליחה. אפשר לנסות שוב, או למלא{' '}
          <a href={googleForm.publicUrl} target="_blank" rel="noopener noreferrer">
            את הטופס ב-Google
          </a>
          .
        </p>
      )}

      <button type="submit" className="btn btn--primary join-form__submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'שולחים…' : 'שליחה'}
      </button>
      <p className="join-form__note">
        הפרטים נשמרים בטופס Google של המועדון ומשמשים רק ליצירת קשר לגבי ההצטרפות.
      </p>
    </form>
  )
}

export default function Join() {
  return (
    <>
      <PageHeader eyebrow={joinIntro.eyebrow} title={joinIntro.title}>
        {joinIntro.lead}
        <div className="join-social">
          <a className="insta-big" href={site.contact.instagram} target="_blank" rel="noopener noreferrer">
            <InstagramIcon />
            <span>
              עקבו אחרינו <span className="ltr">{site.contact.instagramHandle}</span>
            </span>
          </a>
          <a className="btn btn--ghost" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
            <WhatsappIcon />
            שאלות? וואטסאפ ל{site.contact.whatsappName}
          </a>
        </div>
      </PageHeader>

      <section className="section">
        <div className="container join-layout">
          <div>
            <h2 className="section-title">מה מחכה לכם</h2>
            <div className="await-grid">
              {whatAwaits.map((w, i) => (
                <Reveal key={w.title} delay={i * 0.06}>
                  <div className="await-card">
                    <h3>{w.title}</h3>
                    <p>{w.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <h2 className="section-title join-sub">מה מצופה מכם</h2>
            <ol className="expect-list">
              {expectations.map((x, i) => (
                <li key={x.title}>
                  <span className="steps__num ltr">{i + 1}</span>
                  <div>
                    <h3>{x.title}</h3>
                    <p>{x.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="join-form-wrap" id="form">
            <h2 className="section-title">הרשמה</h2>
            <JoinForm />
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container">
          <span className="eyebrow">מעבירים לכם את המקל</span>
          <h2 className="section-title">הדרך לבלגיה 2028</h2>
          <ol className="timeline timeline--dark">
            {baton.map((b, i) => (
              <Reveal key={b.year} delay={i * 0.1}>
                <li className="timeline__item">
                  <span className="timeline__year ltr">{b.year}</span>
                  <h3>{b.title}</h3>
                  <p>{b.text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
