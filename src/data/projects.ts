// הפרויקטים של אורנע 2: מה רצינו, מה בנינו, מה השתבש ואיך תיקנו.
// שדה שאין לו תוכן פשוט לא מוצג. image הוא נתיב מתוך public/images (בלי סיומת).

import type { TeamId } from './teams'

export type Project = {
  id: string
  title: string
  team: TeamId
  facts: { value: string; label: string }[]
  wanted?: string
  built: string
  problem?: string
  fix?: string
  image?: string
  imageAlt?: string
}

export const projects: Project[] = [
  {
    id: 'chassis',
    title: 'שלדה וקשת התהפכות',
    team: 'mechanical',
    facts: [
      { value: '4130', label: 'פלדת SAE/AISI' },
      { value: '5', label: 'תרחישי תאונה ב-FEA' },
      { value: '27°', label: 'זווית מושב לפי התקנון' },
    ],
    wanted: 'שלדה מצינורות פלדה SAE/AISI 4130 שעומדת בכל תרחישי התאונה של התקנון.',
    built:
      'השלדה נבנתה בתת-מכלולים בעזרת גיגים, ונבדקה ב-FEA ב-5 תרחישי תאונה. כולם יצאו מתחת לגבול הכניעה (460 MPa). התקנון חייב זווית מושב של 27°, ולכן הקשת הוגבהה.',
    problem: 'בתרחיש התהפכות לאחור המאמץ הגיע ל-459 MPa, כמעט בדיוק על הגבול.',
    fix: 'הוספנו שני צינורות חיזוק, והמאמץ ירד ל-373 MPa.',
  },
  {
    id: 'wheels',
    title: 'ג׳אנטים',
    team: 'mechanical',
    facts: [
      { value: '16″', label: 'קוטר ג׳אנט' },
      { value: '3″', label: 'רוחב ג׳אנט' },
      { value: '2', label: 'סטים: יבש וגשם' },
    ],
    wanted: 'צמיגי המרוץ דורשים ג׳אנט 16 אינץ׳ ברוחב 3.',
    built:
      'מאחור לקחנו ג׳אנט של הארלי-דייווידסון. מקדימה בנינו ג׳אנט היברידי: ג׳אנט חישורים מפלדה, רכזת בחיתוך לייזר, ריתוך בגיג ואיזון. הכנו שני סטים: לכביש יבש ולגשם.',
    problem: 'ג׳אנט במידות האלה כמעט לא קיים בשוק.',
    fix: 'פתרון שונה לכל ציר: ג׳אנט קיים מאחור, וג׳אנט שבנינו בעצמנו מקדימה.',
  },
  {
    id: 'front-suspension',
    title: 'מתלה קדמי',
    team: 'mechanical',
    facts: [
      { value: 'Double wishbone', label: 'עם Push-rod' },
      { value: 'Ridetech', label: 'קויל-אובר' },
      { value: '5 מ״מ', label: 'פלדה בחיתוך לייזר' },
    ],
    built: 'מתלה Double wishbone עם Push-rod וקויל-אובר של Ridetech. נבנה כפרויקט גמר.',
    problem: 'הדבק בין הקרבון לאלומיניום נכשל.',
    fix: 'המשולש התחתון הוחלף לפלדה בעובי 5 מ״מ בחיתוך לייזר.',
  },
  {
    id: 'steering',
    title: 'מסרק הגה',
    team: 'mechanical',
    facts: [
      { value: '~17', label: 'מסרקים שהושוו' },
      { value: '180°', label: 'גלגל הגה' },
    ],
    built: 'מסרק ושן מבוסס קארטינג, שנבחר אחרי השוואה של כ-17 מסרקים, עם גלגל הגה של 180°.',
  },
  {
    id: 'brakes',
    title: 'מערכת בלימה',
    team: 'mechanical',
    facts: [{ value: 'Wilwood', label: 'מערכת בלימה' }],
    built: 'מערכת בלימה של Wilwood.',
    problem: 'בניסוי באשדוד הגלגל האחורי ננעל ראשון.',
    fix: 'הוספנו ווסת לחץ.',
  },
  {
    id: 'rear-suspension',
    title: 'מתלה אחורי והנעה',
    team: 'mechanical',
    facts: [
      { value: '1', label: 'זרוע מפלדה' },
      { value: 'רצועה', label: 'הנעה' },
    ],
    built: 'זרוע אחת מפלדה. המנוע יושב עליה ומניע את הגלגל ברצועה.',
  },
  {
    id: 'battery',
    title: 'סוללה ומארז',
    team: 'electrical',
    facts: [
      { value: '48V', label: 'ליתיום-יון' },
      { value: '8,892 Wh', label: 'מתוך מגבלה של 9,000' },
      { value: '20g', label: 'עמידות המארז' },
    ],
    built: 'סוללת ליתיום-יון 48V מתאי Samsung 21700, בקיבולת 8,892 Wh מתוך מגבלה של 9,000. המארז עומד ב-20g.',
  },
  {
    id: 'pdu-emu',
    title: 'PDU ו-EMU',
    team: 'electrical',
    facts: [
      { value: '12V / 5V', label: 'ממירי DC-DC' },
      { value: 'EMU', label: 'יחידת חירום' },
    ],
    built: 'חלוקת מתח נמוך עם ממירי DC-DC ל-12V ול-5V, ויחידת חירום.',
  },
  {
    id: 'solar',
    title: 'פאנלים סולאריים',
    team: 'electrical',
    facts: [
      { value: '1.72 מ״ר', label: 'Thin-film' },
      { value: '2', label: 'בקרי MPPT' },
    ],
    built: 'פאנלים סולאריים מסוג Thin-film בשטח 1.72 מ״ר, עם 2 בקרי MPPT.',
  },
  {
    id: 'body',
    title: 'מעטפת וחופה',
    team: 'body',
    facts: [
      { value: 'Eppler', label: 'צורת המעטפת' },
      { value: '9', label: 'חלקים' },
      { value: 'פוליקרבונט', label: 'חופה' },
    ],
    built: 'מעטפת בצורת Eppler, שחולקה ב-SolidWorks ל-9 חלקים, וחופה מפוליקרבונט.',
  },
  {
    id: 'software',
    title: 'טלמטריה ואסטרטגיה',
    team: 'software',
    facts: [
      { value: 'Raspberry Pi', label: 'טלמטריה' },
      { value: 'Firebase', label: 'שידור נתונים' },
      { value: 'לייב', label: 'לוח בקרה בפיטס' },
    ],
    built:
      'טלמטריה על Raspberry Pi שמשדרת ל-Firebase, לוח בקרה חי בפיטס, וסימולציות אנרגיה לבחירת קצב הנסיעה.',
  },
  {
    id: 'management',
    title: 'לוגיסטיקה, גיוס ומשלחת',
    team: 'management',
    facts: [
      { value: 'ATA', label: 'קרנה לשילוח' },
      { value: '13', label: 'ספונסרים' },
    ],
    built: 'לוגיסטיקה ושילוח של הרכב לבלגיה עם קרנה ATA, גיוס כספים, וארגון המשלחת.',
  },
]
