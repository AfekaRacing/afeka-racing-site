// עמוד "הסיפור של בלגיה": פרקים לאורך ציר הזמן, מספרים, ציטוטים.
// images: נתיבים מתוך public/images (בלי סיומת). quote: ציטוט מחבר צוות (בלי שם, לפי ההחלטה לא להציג שמות).

export type Chapter = {
  id: string
  date: string
  title: string
  text: string
  todo?: string // מה עוד חסר בפרק, מוצג כ-[להשלים]
  images: { src: string; alt: string }[]
  quote?: string
  tone?: 'hard' // פרק על הקשיים: מוצג בעיצוב שונה
}

export const intro = {
  eyebrow: 'iESC 2026 · מסלול זולדר, בלגיה',
  title: 'הסיפור של בלגיה',
  lead: 'שנתיים של תכנון ובנייה, ו-24 שעות על המסלול.',
}

export const chapters: Chapter[] = [
  {
    id: 'packing',
    date: '2.9.2026',
    title: 'האריזה בארץ',
    text: 'אורנע 2 נארזה בארץ ויצאה לדרך לבלגיה, עם קרנה ATA.',
    todo: 'פרטים ותמונות מהאריזה והשילוח',
    images: [],
  },
  {
    id: 'registration',
    date: '16.9',
    title: 'הרישום',
    text: 'הגענו לזולדר, התארגנו ונרשמנו לתחרות.',
    images: [
      { src: 'story/registration-camp', alt: 'אורנע 2 במתחם הצוותים בזולדר' },
      { src: 'story/registration-night', alt: 'עבודה על אורנע 2 בלילה במתחם הצוותים' },
    ],
  },
  {
    id: 'static',
    date: '17.9',
    title: 'הבדיקות הסטטיות',
    text: 'השופטים בדקו את הרכב מול התקנון, לפני שהוא מורשה לעלות למסלול.',
    todo: 'מה נבדק ואיך עברנו',
    images: [
      { src: 'story/static-car', alt: 'אורנע 2 ממתינה לבדיקות הסטטיות' },
      { src: 'story/static-open', alt: 'אורנע 2 פתוחה במהלך הבדיקות הסטטיות' },
    ],
  },
  {
    id: 'dynamic',
    date: '18.9',
    title: 'הבדיקות הדינמיות',
    text: 'בדיקות על המסלול ואימון חופשי לנהגים.',
    todo: 'אילו מבחנים עברנו',
    images: [{ src: 'story/dynamic-pitlane', alt: 'אורנע 2 בפיט ליין של מסלול זולדר' }],
  },
  {
    id: 'race',
    date: '19–20.9',
    title: 'מרוץ 24 השעות',
    text: '24 שעות על מסלול זולדר, ביום ובלילה, ביובש ובגשם. בפיטס עקבנו בזמן אמת אחרי הטלמטריה ובחרנו את הקצב.',
    images: [
      { src: 'story/race-pitlane', alt: 'אורנע 2 בפיט ליין במהלך המרוץ' },
      { src: 'story/race-rain', alt: 'אורנע 2 על מסלול רטוב' },
      { src: 'story/race-telemetry', alt: 'לוח הטלמטריה החי בפיטס' },
    ],
    quote: '',
  },
  {
    id: 'hard',
    date: 'בלילה',
    title: 'מה היה קשה',
    text: 'לא הכול עבד כמו שתכננו. חלק מהתיקונים נעשו בלילה, בזמן שהשעון ממשיך לרוץ.',
    todo: 'אילו תקלות היו ואיך תיקנו אותן',
    images: [{ src: 'story/race-night-repair', alt: 'תיקון של אורנע 2 בלילה במהלך המרוץ' }],
    tone: 'hard',
    quote: '',
  },
  {
    id: 'home',
    date: '21.9',
    title: 'בדרך הביתה',
    text: 'ארזנו את אורנע 2 בחזרה לארגז. עכשיו אנחנו בונים את אורנע 2.5, והמטרה: 300 הקפות.',
    images: [{ src: 'story/packing-crate', alt: 'אורנע 2 ארוזה בארגז העץ' }],
  },
]
