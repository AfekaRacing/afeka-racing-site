// "פרקו את אורנע": כל רכיבי הצפייה התלת-ממדית.
// כאן עורכים טקסטים, עובדות, תמונות וקבצי מודל, בלי לגעת בקוד.
//
// model: נתיב לקובץ GLB בתיקייה public/models (למשל 'models/chassis.glb').
//        כל עוד השדה ריק, מוצג מודל זמני מצורות פשוטות (shapes).
//        הוראות ייצוא מ-SolidWorks: docs/models.md
// explode: לאן הרכיב זז כשמפרקים את הרכב (במטרים, x = קדימה, y = למעלה, z = שמאלה).
// image: תמונה מ-public/images (בלי סיומת).

import type { TeamId } from './teams'

type Vec3 = [number, number, number]

// צורות למודל הזמני. tube = צינור בין שתי נקודות.
export type Shape =
  | { type: 'tube'; from: Vec3; to: Vec3; r: number; explode?: Vec3 }
  | { type: 'box'; size: Vec3; at: Vec3; explode?: Vec3 }
  | { type: 'wheel'; r: number; width: number; at: Vec3; explode?: Vec3 } // גליל לאורך ציר z
  | { type: 'ring'; r: number; tube: number; at: Vec3; rot?: Vec3; explode?: Vec3 }
  | { type: 'shell'; scale: Vec3; at: Vec3; explode?: Vec3; glass?: boolean } // אליפסואיד

export type Part = {
  id: string
  name: string
  team: TeamId
  description: string
  facts: string[]
  image?: string
  imageAlt?: string
  model: string
  color: string
  explode: Vec3
  shapes: Shape[]
}

// התאמה של כל קבצי ה-GLB למערכת הצירים של האתר (אם הייצוא מ-Blender יצא מסובב או בקנה מידה אחר)
export const modelTransform = {
  scale: 1,
  rotation: [0, 0, 0] as Vec3, // ברדיאנים
  position: [0, 0, 0] as Vec3,
}

const steel = '#b8c4bd'

export const parts: Part[] = [
  {
    id: 'chassis',
    name: 'שלדה',
    team: 'mechanical',
    description: 'שלדת צינורות מפלדה SAE/AISI 4130, שנבנתה בתת-מכלולים בעזרת גיגים.',
    facts: [
      'נבדקה ב-FEA ב-5 תרחישי תאונה, כולם מתחת לגבול הכניעה (460 MPa)',
      'בהתהפכות לאחור המאמץ הגיע ל-459 MPa',
      'שני צינורות חיזוק הורידו אותו ל-373 MPa',
    ],
    image: 'projects/chassis-cad',
    imageAlt: 'מודל SolidWorks של השלדה',
    model: '',
    color: steel,
    explode: [0, 0, 0],
    shapes: [
      // מסגרת תחתונה ועליונה
      ...([0.28, 0.58] as const).flatMap((y) => [
        { type: 'tube' as const, from: [-0.9, y, 0.3] as Vec3, to: [1.15, y, 0.3] as Vec3, r: 0.02 },
        { type: 'tube' as const, from: [-0.9, y, -0.3] as Vec3, to: [1.15, y, -0.3] as Vec3, r: 0.02 },
      ]),
      // חיבורים רוחביים ואנכיים
      ...([-0.9, -0.35, 0.3, 0.75, 1.15] as const).flatMap((x) => [
        { type: 'tube' as const, from: [x, 0.28, 0.3] as Vec3, to: [x, 0.28, -0.3] as Vec3, r: 0.018 },
        { type: 'tube' as const, from: [x, 0.58, 0.3] as Vec3, to: [x, 0.58, -0.3] as Vec3, r: 0.018 },
        { type: 'tube' as const, from: [x, 0.28, 0.3] as Vec3, to: [x, 0.58, 0.3] as Vec3, r: 0.018 },
        { type: 'tube' as const, from: [x, 0.28, -0.3] as Vec3, to: [x, 0.58, -0.3] as Vec3, r: 0.018 },
      ]),
      // אלכסונים
      { type: 'tube', from: [0.3, 0.28, 0.3], to: [0.75, 0.58, 0.3], r: 0.016 },
      { type: 'tube', from: [0.3, 0.28, -0.3], to: [0.75, 0.58, -0.3], r: 0.016 },
      { type: 'tube', from: [-0.9, 0.28, 0.3], to: [-0.35, 0.58, 0.3], r: 0.016 },
      { type: 'tube', from: [-0.9, 0.28, -0.3], to: [-0.35, 0.58, -0.3], r: 0.016 },
    ],
  },
  {
    id: 'rollbar',
    name: 'קשת התהפכות',
    team: 'mechanical',
    description: 'הקשת שמגינה על הנהג בהתהפכות. היא חלק מהשלדה ונבדקה איתה ב-FEA.',
    facts: [
      'התקנון חייב זווית מושב של 27°, ולכן הקשת הוגבהה',
      'תרחיש ההתהפכות לאחור היה הקשה ביותר בבדיקות',
    ],
    model: '',
    color: '#d9e3dd',
    explode: [0, 0.9, 0],
    shapes: [
      { type: 'tube', from: [-0.45, 0.58, 0.3], to: [-0.45, 1.05, 0.18], r: 0.024 },
      { type: 'tube', from: [-0.45, 0.58, -0.3], to: [-0.45, 1.05, -0.18], r: 0.024 },
      { type: 'tube', from: [-0.45, 1.05, 0.18], to: [-0.45, 1.05, -0.18], r: 0.024 },
      { type: 'tube', from: [-0.45, 1.0, 0], to: [-0.85, 0.58, 0], r: 0.02 },
    ],
  },
  {
    id: 'front-suspension',
    name: 'מתלה קדמי',
    team: 'mechanical',
    description: 'מתלה Double wishbone עם Push-rod וקויל-אובר של Ridetech. נבנה כפרויקט גמר.',
    facts: [
      'הדבק בין הקרבון לאלומיניום נכשל',
      'המשולש התחתון הוחלף לפלדה 5 מ״מ בחיתוך לייזר',
    ],
    model: '',
    color: '#19be73',
    explode: [0.75, 0, 0],
    shapes: ([1, -1] as const).flatMap((s) => [
      { type: 'tube' as const, from: [0.95, 0.3, 0.3 * s] as Vec3, to: [1.12, 0.26, 0.5 * s] as Vec3, r: 0.014, explode: [0, 0, 0.35 * s] as Vec3 },
      { type: 'tube' as const, from: [1.3, 0.3, 0.3 * s] as Vec3, to: [1.12, 0.26, 0.5 * s] as Vec3, r: 0.014, explode: [0, 0, 0.35 * s] as Vec3 },
      { type: 'tube' as const, from: [0.98, 0.52, 0.3 * s] as Vec3, to: [1.12, 0.42, 0.48 * s] as Vec3, r: 0.012, explode: [0, 0, 0.35 * s] as Vec3 },
      { type: 'tube' as const, from: [1.26, 0.52, 0.3 * s] as Vec3, to: [1.12, 0.42, 0.48 * s] as Vec3, r: 0.012, explode: [0, 0, 0.35 * s] as Vec3 },
      { type: 'tube' as const, from: [1.12, 0.28, 0.46 * s] as Vec3, to: [1.05, 0.62, 0.3 * s] as Vec3, r: 0.03, explode: [0, 0, 0.35 * s] as Vec3 },
    ]),
  },
  {
    id: 'rear-suspension',
    name: 'מתלה אחורי',
    team: 'mechanical',
    description: 'זרוע אחת מפלדה שמחזיקה את הגלגל האחורי. המנוע יושב עליה ומניע את הגלגל ברצועה.',
    facts: [
      'פרופיל פלדה 1020 בגודל 60×30×2 מ״מ',
      'שני קליפרים: בלם שירות ובלם חניה',
      '16 חלקי מתלה בעיבוד שבבי',
    ],
    image: 'projects/rear-suspension-cad',
    imageAlt: 'מודל SolidWorks של המתלה האחורי',
    model: '',
    color: '#14967d',
    explode: [-0.8, 0, 0],
    shapes: [
      { type: 'tube', from: [-0.85, 0.34, 0.13], to: [-1.25, 0.28, 0.08], r: 0.025 },
      { type: 'tube', from: [-0.85, 0.34, -0.13], to: [-1.25, 0.28, -0.08], r: 0.025 },
      { type: 'tube', from: [-0.95, 0.36, 0], to: [-0.82, 0.6, 0], r: 0.03 },
      { type: 'wheel', r: 0.09, width: 0.1, at: [-0.92, 0.3, 0.17] }, // מנוע
      { type: 'box', size: [0.34, 0.03, 0.02], at: [-1.08, 0.29, 0.16] }, // רצועה
    ],
  },
  {
    id: 'steering',
    name: 'מסרק הגה',
    team: 'mechanical',
    description: 'מסרק ושן מבוסס קארטינג, שנבחר אחרי השוואה של כ-17 מסרקים.',
    facts: ['גלגל הגה של 180°', 'מבוסס על מסרק של קארטינג'],
    model: '',
    color: '#befa23',
    explode: [0.5, 0.6, 0],
    shapes: [
      { type: 'tube', from: [1.18, 0.4, 0.32], to: [1.18, 0.4, -0.32], r: 0.022 },
      { type: 'tube', from: [1.18, 0.4, 0], to: [0.6, 0.7, 0], r: 0.016 },
      { type: 'ring', r: 0.13, tube: 0.018, at: [0.56, 0.72, 0], rot: [0, Math.PI / 2, 0.45] },
    ],
  },
  {
    id: 'brakes',
    name: 'מערכת בלימה',
    team: 'mechanical',
    description: 'מערכת בלימה של Wilwood: דוושה עם balance bar ושתי משאבות מרכזיות.',
    facts: [
      'בניסוי באשדוד הגלגל האחורי ננעל ראשון',
      'ווסת לחץ במעגל האחורי פתר את הבעיה',
      'תאוטה מחושבת של 8.2 מ׳/ש², פי 2 מדרישת התקנון',
    ],
    model: '',
    color: '#e0663b',
    explode: [0.75, 0.05, 0],
    shapes: [
      { type: 'wheel', r: 0.12, width: 0.012, at: [1.12, 0.28, 0.44], explode: [0, 0, 0.5] },
      { type: 'wheel', r: 0.12, width: 0.012, at: [1.12, 0.28, -0.44], explode: [0, 0, -0.5] },
      { type: 'wheel', r: 0.12, width: 0.012, at: [-1.25, 0.28, -0.07], explode: [-0.5, 0, 0] },
      { type: 'box', size: [0.08, 0.06, 0.05], at: [1.12, 0.38, 0.44], explode: [0, 0, 0.5] },
      { type: 'box', size: [0.08, 0.06, 0.05], at: [1.12, 0.38, -0.44], explode: [0, 0, -0.5] },
      { type: 'box', size: [0.08, 0.06, 0.05], at: [-1.25, 0.38, -0.07], explode: [-0.5, 0, 0] },
      { type: 'box', size: [0.12, 0.12, 0.2], at: [0.95, 0.38, 0] }, // דוושות
    ],
  },
  {
    id: 'wheels',
    name: 'ג׳אנטים וצמיגים',
    team: 'mechanical',
    description: 'צמיגי המרוץ דורשים ג׳אנט 16 אינץ׳ ברוחב 3. מאחור ג׳אנט של הארלי-דייווידסון, ומקדימה ג׳אנט היברידי שבנינו.',
    facts: [
      'ג׳אנט חישורים מפלדה עם רכזת בחיתוך לייזר',
      'ריתוך בגיג ואיזון',
      'שני סטים: לכביש יבש ולגשם',
    ],
    model: '',
    color: '#1d2421',
    explode: [0, 0, 0],
    shapes: [
      { type: 'wheel', r: 0.28, width: 0.08, at: [1.12, 0.28, 0.54], explode: [0, 0, 0.9] },
      { type: 'wheel', r: 0.28, width: 0.08, at: [1.12, 0.28, -0.54], explode: [0, 0, -0.9] },
      { type: 'wheel', r: 0.28, width: 0.08, at: [-1.25, 0.28, 0], explode: [-1.0, 0, 0] },
    ],
  },
  {
    id: 'battery',
    name: 'סוללה ומארז',
    team: 'electrical',
    description: 'סוללת ליתיום-יון 48V מתאי Samsung 21700, במארז שעומד ב-20g.',
    facts: [
      '8,892 Wh מתוך מגבלה של 9,000',
      'שתי סוללות 13S19P במארז אחד',
      'BMS לכל סוללה ו-26 חיישני טמפרטורה',
    ],
    model: '',
    color: '#2f7cf6',
    explode: [-0.2, 0.15, -1.3],
    shapes: [{ type: 'box', size: [0.55, 0.26, 0.5], at: [-0.12, 0.42, 0] }],
  },
  {
    id: 'pdu-emu',
    name: 'PDU ו-EMU',
    team: 'electrical',
    description: 'חלוקת המתח הנמוך ברכב ויחידת החירום.',
    facts: ['ממירי DC-DC ל-12V ול-5V', 'תאורה, מתגים ויחידת חירום'],
    image: 'projects/electrical-schematic',
    imageAlt: 'השרטוט החשמלי של אורנע 2',
    model: '',
    color: '#f2c94c',
    explode: [0.3, 0.7, 0.8],
    shapes: [
      { type: 'box', size: [0.18, 0.08, 0.14], at: [0.35, 0.5, 0.17] },
      { type: 'box', size: [0.14, 0.08, 0.12], at: [0.35, 0.5, -0.17] },
    ],
  },
  {
    id: 'solar',
    name: 'פאנלים סולאריים',
    team: 'electrical',
    description: 'פאנלים מסוג Thin-film על הגג, בשני תת-מערכים, עם בקר MPPT לכל אחד.',
    facts: ['1.72 מ״ר של תאים', '2 בקרי MPPT', 'כ-211 W ביום בהיר בזולדר'],
    model: '',
    color: '#123a6b',
    explode: [0, 1.9, 0],
    shapes: [
      { type: 'box', size: [1.2, 0.015, 0.56], at: [-0.35, 1.08, 0.3] },
      { type: 'box', size: [1.2, 0.015, 0.56], at: [-0.35, 1.08, -0.3], explode: [0, 0.15, 0] },
    ],
  },
  {
    id: 'body',
    name: 'מעטפת וחופה',
    team: 'body',
    description: 'מעטפת בצורת Eppler, מחולקת ב-SolidWorks ל-9 חלקים, עם חופה מפוליקרבונט.',
    facts: [
      'ייצור בהזרקת שרף בוואקום (VARTM) לתבניות MDF',
      'שמשת פוליקרבונט 4 מ״מ, שמתעוותת ולא מתנפצת',
      '9 חלקים: גוף ראשי ומשני, 2 דלתות גלגלים, זנב, חופה ו-3 חלונות',
    ],
    image: 'projects/body-9-parts',
    imageAlt: 'המעטפת מפורקת ל-9 חלקים',
    model: '',
    color: '#19be73',
    explode: [0, 1.2, 1.7],
    shapes: [
      { type: 'shell', scale: [1.85, 0.5, 0.66], at: [0, 0.62, 0] },
      { type: 'shell', scale: [0.6, 0.32, 0.36], at: [0.25, 0.98, 0], glass: true, explode: [0.4, 0.5, 0] },
    ],
  },
]

export const ornaViewer = {
  eyebrow: 'צפייה תלת-ממדית',
  title: 'פרקו את אורנע',
  lead: 'סובבו, הגדילו ופרקו את הרכב. לחצו על רכיב כדי לשמוע עליו.',
  placeholderNote: 'זהו מודל זמני מצורות פשוטות. המודל האמיתי מ-SolidWorks יחליף אותו.',
}
