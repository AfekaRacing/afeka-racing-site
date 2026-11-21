// עמוד "חומרי עזר" (/docs): מסמכים שכדאי להכיר כשמצטרפים.
// כל מסמך מוצג כשורה מקופלת שנפתחת בלחיצה.
//
// להוספת מסמך: מוסיפים אובייקט לרשימה docs למטה.
// - steps: צילומי מסך שמוצגים בתוך השורה (קבצים ב-public/docs, בגודל מלא וגם ב-800).
// - file: קובץ להורדה (שמים אותו ב-public/docs). אם יש בו יותר מ-4 עמודים
//   (pages) מופיע כפתור הורדה ישירה.
// - link: קישור חיצוני (למשל לאתר רשמי).
// תמונות המדריך של Teams עברו הסתרה של שמות ומיילים.

export type DocStep = { src: string; alt: string }
export type Doc = {
  id: string
  title: string
  text: string
  steps?: DocStep[]
  file?: { src: string; pages: number }
  link?: { href: string; label: string }
}

/** מעל מספר העמודים הזה מופיע כפתור הורדה ישירה */
export const downloadMinPages = 4

export const docsPage = {
  eyebrow: 'למצטרפים',
  title: 'חומרי עזר',
  lead: 'מסמכים שכדאי להכיר כשמתחילים לעבוד במועדון. לוחצים על מסמך כדי לפתוח אותו.',
  download: 'הורדת הקובץ',
  pages: 'עמודים',
}

export const docs: Doc[] = [
  {
    id: 'teams',
    title: 'איך מגיעים לתיקיות של המועדון ב-Teams',
    text: 'שלושה צעדים, מהחשבון של אפקה ועד התיקיות של ORNA 2.0.',
    steps: [
      { src: 'docs/teams-step-1', alt: 'מסך Teams: לוחצים על החשבון בראש החלון ומוודאים שזה החשבון של אפקה' },
      { src: 'docs/teams-step-2', alt: 'מסך Teams: לוחצים על Teams בסרגל הצד, ונפתחות כל הקבוצות שהוסיפו אתכם אליהן' },
      { src: 'docs/teams-step-3', alt: 'מסך Teams: בקבוצת ORNA 2.0, תחת קבצים, מסמכים ו-General נמצאות כל התיקיות של המועדון' },
    ],
  },
  {
    id: 'regulations',
    title: 'תקנון התחרות iESC 2026',
    text: 'התקנון הרשמי של iLumen European Solar Challenge: מה מותר ומה חובה ברכב, בסוללה ובבטיחות.',
    file: { src: 'docs/iesc-2026-regulations.pdf', pages: 72 },
    link: { href: 'https://www.europeansolarchallenge.eu/', label: 'לאתר התחרות' },
  },
]
