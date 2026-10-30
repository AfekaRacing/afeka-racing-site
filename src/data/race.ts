// מספרי התחרות ב-iESC 2026, מסלול זולדר.

// count: מספר להנפשת ספירה (ריק = מוצג כמו שהוא, למשל זמן הקפה)
export type Stat = { value: string; unit?: string; label: string; count?: number }

export const raceStats: Stat[] = [
  { value: '197', label: 'הקפות', count: 197 },
  { value: '788', unit: 'ק״מ', label: 'ב-24 שעות', count: 788 },
  { value: '22.3', unit: 'kWh', label: 'אנרגיה כוללת', count: 22.3 },
  { value: '28', unit: 'Wh/km', label: 'צריכה ממוצעת', count: 28 },
  { value: '4:06.8', label: 'ההקפה המהירה' },
]
