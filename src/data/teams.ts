// חמשת הצוותים. "areas" הם התחומים, ו-"didOnCar" הוא מה הצוות עשה באורנע 2 (בקצרה).
// id משמש גם לקישור מרכיבים ומפרויקטים לצוות.

export type TeamId = 'mechanical' | 'electrical' | 'body' | 'software' | 'management'

export type Team = {
  id: TeamId
  name: string
  areas: string[]
  didOnCar: string
}

export const teams: Team[] = [
  {
    id: 'mechanical',
    name: 'מכנית',
    areas: ['שלדה וקשת התהפכות', 'מתלים', 'היגוי ובלימה', 'ג׳אנטים וצמיגים'],
    didOnCar:
      'בנו שלדה מצינורות פלדה 4130, מתלה קדמי Double wishbone, מתלה אחורי בזרוע אחת, מסרק הגה ומערכת בלימה של Wilwood.',
  },
  {
    id: 'electrical',
    name: 'חשמל',
    areas: ['סוללה ומארז', 'חלוקת מתח (PDU) ויחידת חירום (EMU)', 'פאנלים סולאריים ובקרי MPPT'],
    didOnCar:
      'תכננו סוללת ליתיום-יון 48V של 8,892 Wh, חלוקת מתח נמוך ל-12V ול-5V, ופאנלים סולאריים בשטח 1.72 מ״ר עם 2 בקרי MPPT.',
  },
  {
    id: 'body',
    name: 'מעטפת',
    areas: ['אווירודינמיקה', 'תכנון וחלוקת המעטפת', 'חופה'],
    didOnCar: 'עיצבו מעטפת בצורת Eppler, חילקו אותה ב-SolidWorks ל-9 חלקים ובנו חופה מפוליקרבונט.',
  },
  {
    id: 'software',
    name: 'תוכנה',
    areas: ['טלמטריה', 'לוח בקרה חי', 'סימולציות אנרגיה'],
    didOnCar:
      'בנו טלמטריה על Raspberry Pi שמשדרת ל-Firebase, לוח בקרה חי בפיטס וסימולציות אנרגיה לבחירת קצב הנסיעה.',
  },
  {
    id: 'management',
    name: 'ניהול',
    areas: ['לוגיסטיקה ושילוח', 'גיוס כספים', 'משלחת'],
    didOnCar: 'שילחו את הרכב לבלגיה עם קרנה ATA, גייסו כספים ותיאמו את המשלחת.',
  },
]

export const teamName = (id: TeamId) => teams.find((t) => t.id === id)?.name ?? id
