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

// התוצאות, מוצגות אחרי המספרים של המרוץ (מקור: מצגת החשיפה לסטודנטים)
export const results = [
  { prefix: 'מקום', value: 13, label: 'מתוך 19 בקטגוריית Challenger' },
  { prefix: 'מקום', value: 1, label: 'מבין 6 הקבוצות החדשות' },
  { prefix: 'בין', value: 11, label: 'הקבוצות הראשונות שעברו את מבחני הבטיחות' },
]

export const chapters: Chapter[] = [
  {
    id: 'packing',
    date: '2.9.2026',
    title: 'האריזה בארץ',
    text: 'אורנע 2 והציוד נארזו בארגזים ויצאו לדרך לבלגיה: הלוך באוויר, חזור בים, עם קרנה ATA שמאפשרת לרכב לצאת ולחזור בלי מכס.',
    images: [{ src: 'projects/shipping-truck', alt: 'ארגזי העץ של אורנע 2 נטענים למשאית' }],
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
    text: 'השופטים בדקו את הרכב מול התקנון, לפני שהוא מורשה לעלות למסלול. עברנו את בדיקות הבטיחות, כאחת מ-11 הקבוצות הראשונות שעברו את המבחנים.',
    todo: 'מה נבדק',
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
    text: 'ארזנו את אורנע 2 בחזרה לארגז. עכשיו אנחנו בונים את אורנע 2.5, והמטרה: 320 הקפות בבלגיה 2028.',
    images: [{ src: 'story/packing-crate', alt: 'אורנע 2 ארוזה בארגז העץ' }],
  },
]

// טבלת התוצאות הרשמית (זמנית) של קטגוריית Challenger, iESC 2026, 19–20.9.2026.
// מקור: גיליון התוצאות של המארגנים. country: קוד מדינה לדגל (src/assets/flags).
export type ClassResult = { pos: number; team: string; car: string; country: string; laps: number; bestLap: string; us?: boolean }

export const classResults = {
  title: 'מי עוד היה על המסלול',
  lead: '19 מכוניות מ-12 מדינות, 24 שעות בלי הפסקה. ככה נראית הטבלה בסוף.',
  source: 'מקור: תוצאות זמניות רשמיות של iESC 2026, קטגוריית Challenger.',
  rows: [
    { pos: 1, team: 'Solar Team Twente', car: 'RED E', country: 'nl', laps: 320, bestLap: '2:55.600' },
    { pos: 2, team: 'Innoptus Solar Team', car: 'BluePoint Atlas', country: 'be', laps: 310, bestLap: '3:34.394' },
    { pos: 3, team: 'Top Dutch Solar Racing', car: 'Green Falcon', country: 'nl', laps: 287, bestLap: '3:25.126' },
    { pos: 4, team: 'Top Dutch Solar Racing', car: 'Green Thunder', country: 'nl', laps: 278, bestLap: '3:29.391' },
    { pos: 5, team: 'Sonnenwagen Aachen', car: 'Covestro Æthon', country: 'de', laps: 271, bestLap: '3:23.224' },
    { pos: 6, team: 'Sonnenwagen Aachen', car: 'Covestro Adelie', country: 'de', laps: 257, bestLap: '3:14.356' },
    { pos: 7, team: 'ACE Solar Racing', car: 'Silvretta', country: 'ch', laps: 253, bestLap: '3:31.558' },
    { pos: 8, team: 'Solis UTCN', car: 'Hyperion Origin', country: 'ro', laps: 248, bestLap: '3:38.097' },
    { pos: 9, team: 'Durham University Solar Car', car: 'Ortus-T', country: 'gb', laps: 227, bestLap: '3:52.954' },
    { pos: 10, team: 'HUST', car: 'Henry', country: 'se', laps: 216, bestLap: '4:26.356' },
    { pos: 11, team: 'Chalmers Solar Team', car: 'Arvaker', country: 'se', laps: 215, bestLap: '4:01.280' },
    { pos: 12, team: 'Innoptus Solar Team', car: 'Infinite', country: 'be', laps: 209, bestLap: '3:23.226' },
    { pos: 13, team: 'Afeka Racing', car: 'Orna 2.0', country: 'il', laps: 197, bestLap: '4:07.004', us: true },
    { pos: 14, team: 'TUCN Racing Team', car: 'Sol Invictus 2', country: 'ro', laps: 161, bestLap: '4:04.594' },
    { pos: 15, team: 'DCU Solar Racing', car: 'Solas', country: 'ie', laps: 159, bestLap: '4:42.697' },
    { pos: 16, team: 'ITU Solar Car Team', car: 'Ariba XI', country: 'tr', laps: 144, bestLap: '4:19.847' },
    { pos: 17, team: 'Nordlys NTNU', car: 'Lumholtz', country: 'no', laps: 120, bestLap: '5:03.270' },
    { pos: 18, team: 'UPB Drive Solar', car: 'Lumi', country: 'ro', laps: 50, bestLap: '4:34.629' },
    { pos: 19, team: 'Lodz Solar Team', car: '', country: 'pl', laps: 20, bestLap: '3:50.063' },
  ] as ClassResult[],
}

// סיכום קליל של ניתוח 24 השעות (מקור: ניתוח זמני ההקפות הרשמיים ויומן החלפות הנהג של הקבוצה).
// breakdown: שעות מתוך 24, לפי סוג.
export const raceDebrief = {
  eyebrow: 'ניתוח המרוץ',
  title: 'המכונית מהירה. התקלות עלו לנו כ-69 הקפות.',
  lead: 'עברנו על כל 197 ההקפות מגיליון הזמנים הרשמי. ככה התחלקו 24 השעות:',
  breakdown: [
    { label: 'נסיעה', hours: 15.7, tone: 'drive' },
    { label: 'תקלות ועצירות לא מתוכננות', hours: 5.5, tone: 'fault' },
    { label: 'טעינה', hours: 1.7, tone: 'charge' },
    { label: 'החלפות נהג', hours: 1.0, tone: 'driver' },
  ],
  points: [
    { title: 'הקצב לא ירד בלילה', text: 'גם בחושך נסענו בערך באותו קצב כמו אחר הצהריים.' },
    { title: 'ההקפה המהירה: לפני הזריחה', text: '4:07.0 דקות, על הסוללה בלבד, בשעות הקטנות של הלילה.' },
    { title: 'ארבע עצירות ארוכות', text: 'כמעט חמש שעות של תיקונים. בלעדיהן היינו מוסיפים כ-60 הקפות.' },
  ],
  lessonsTitle: 'מה לוקחים לאורנע 2.5',
  lessons: ['אמינות לפני מהירות', 'החלפת נהג בחצי מהזמן', 'ניהול אנרגיה חכם בלילה'],
}
