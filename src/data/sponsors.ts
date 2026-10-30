// ספונסרים. logo הוא נתיב לקובץ בתיקייה public/brand/sponsors.
// הרשימה תמולא בשלב 2 מתוך תיקיית הלוגואים.

export type Sponsor = { name: string; logo: string; url?: string }

export const sponsors: Sponsor[] = []
