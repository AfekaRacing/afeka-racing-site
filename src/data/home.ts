// טקסטים של דף הבית.

export const hero = {
  eyebrow: 'iESC 2026 · מסלול זולדר, בלגיה',
  titleNumber: '788',
  titleUnit: 'ק״מ ב-24 שעות',
  subtitle: 'ברכב שסטודנטים בנו מאפס',
  // תמונת ה-Hero: נתיב מתוך public/images, בלי סיומת (נוצר ב-npm run images).
  image: 'hero/orna-zolder-pitlane',
  imageAlt: 'אורנע 2 בפיט ליין של מסלול זולדר בבלגיה',
  primaryCta: { to: '/orna', label: 'הכירו את אורנע' },
  secondaryCta: { to: '/join', label: 'הצטרפו אלינו' },
}

export const intro = {
  title: 'מועדון סטודנטים שבונה רכבים סולאריים',
  text: 'אנחנו סטודנטים מאפקה שמתכננים, בונים ומתחרים ברכבים סולאריים. אורנע 2 תוכננה ונבנתה מאפס במשך שנתיים, ונסעה לתחרות iESC בבלגיה.',
  link: { to: '/about', label: 'עוד עלינו' },
}

export const explore = [
  {
    to: '/orna',
    title: 'פרקו את אורנע',
    text: 'סובבו, הגדילו ופרקו את הרכב לחלקים. כל רכיב, והסיפור שמאחוריו.',
  },
  {
    to: '/projects',
    title: 'הפרויקטים',
    text: 'מה רצינו, מה בנינו, מה השתבש ואיך תיקנו.',
  },
  {
    to: '/belgium',
    title: 'הסיפור של בלגיה',
    text: 'מהאריזה בארץ ועד 24 שעות על המסלול.',
  },
]

export const next = {
  eyebrow: 'מה הלאה',
  title: 'אורנע 2.5',
  goalNumber: '300',
  goalUnit: 'הקפות',
  text: 'אנחנו כבר בונים את אורנע 2.5, השיפור של אורנע 2. המטרה: להגיע ל-300 הקפות. צריכים אתכם בצוות.',
  cta: { to: '/join', label: 'הצטרפו למשימה' },
}
