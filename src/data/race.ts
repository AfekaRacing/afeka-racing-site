// מספרי התחרות ב-iESC 2026, מסלול זולדר.

export type Stat = { value: string; unit?: string; label: string }

export const raceStats: Stat[] = [
  { value: '197', label: 'הקפות' },
  { value: '788', unit: 'ק״מ', label: 'ב-24 שעות' },
  { value: '22.3', unit: 'kWh', label: 'אנרגיה כוללת' },
  { value: '28', unit: 'Wh/km', label: 'צריכה ממוצעת' },
  { value: '4:06.8', label: 'ההקפה המהירה' },
]
