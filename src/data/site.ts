// פרטים כלליים של האתר: שם, קישורים, פרטי קשר וניווט.
// כל הטקסטים כאן ניתנים לעריכה בלי לגעת בקוד.

export const site = {
  name: 'Afeka Racing Team',
  nameHe: 'קבוצת המרוצים של אפקה',
  car: 'אורנע 2',
  carEn: 'ORNA 2.0',
  college: 'המכללה האקדמית להנדסה אפקה',

  // לוגואים מהתיקייה public/brand. שדה ריק = מוצג לוגו טקסט.
  logos: {
    club: `${import.meta.env.BASE_URL}brand/afeka-racing.webp`,
    orna: `${import.meta.env.BASE_URL}brand/orna.webp`,
    afeka: `${import.meta.env.BASE_URL}brand/afeka.webp`,
  },

  contact: {
    email: 'aec@mail.afeka.ac.il',
    whatsappName: 'גיא חבלין',
    whatsappNumber: '972542922199', // בפורמט בינלאומי, בלי + ובלי 0 בהתחלה
    whatsappDisplay: '054-2922199',
    instagram: 'https://www.instagram.com/afeka_racing/',
    instagramHandle: '@afeka_racing',
  },

  joinFormUrl: 'https://forms.gle/ziqnofMJM5oP1Tp99',
}

export const whatsappLink = (text = 'היי, אשמח לשמוע על Afeka Racing Team') =>
  `https://wa.me/${site.contact.whatsappNumber}?text=${encodeURIComponent(text)}`

export const nav = [
  { to: '/', label: 'בית' },
  { to: '/about', label: 'מי אנחנו' },
  { to: '/orna', label: 'פרקו את אורנע' },
  { to: '/projects', label: 'הפרויקטים' },
  { to: '/belgium', label: 'בלגיה 2026' },
  { to: '/gallery', label: 'גלריה' },
]

export const joinCta = { to: '/join', label: 'הצטרפו אלינו' }
