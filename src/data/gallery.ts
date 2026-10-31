// גלריה. התמונות עצמן מגיעות מהתיקייה public/images/gallery/<אירוע>/
// (נוצרות עם npm run images מתוך images-source/gallery/<אירוע>/).
//
// כדי להוסיף אירוע: יוצרים תיקייה חדשה ב-images-source/gallery, מריצים npm run images,
// ומוסיפים כאן שורה עם אותו שם תיקייה. הסדר כאן הוא הסדר בגלריה.

import images from './generated/images.json'
import type { TeamId } from './teams'

export type GalleryEvent = { folder: string; label: string; date: string }

export const galleryEvents: GalleryEvent[] = [
  { folder: '1-ashdod-test', label: 'ניסוי באשדוד', date: '20.7.2026' },
  { folder: '2-launch', label: 'השקת אורנע 2', date: '2026' },
  { folder: '3-registration', label: 'זולדר: התארגנות ורישום', date: '16.9.2026' },
  { folder: '4-static', label: 'זולדר: בדיקות סטטיות', date: '17.9.2026' },
  { folder: '5-race', label: 'זולדר: מרוץ 24 השעות', date: '19–20.9.2026' },
  { folder: '6-home', label: 'בדרך הביתה', date: '21.9.2026' },
]

// תיוג תמונות לפי צוות (לא חובה). המפתח הוא שם התמונה כפי שמופיע ב-manifest.json.
// סינון לפי צוות מופיע בגלריה רק כשיש תמונות מתויגות לפחות לשני צוותים.
export const teamTags: Record<string, TeamId[]> = {
  '5-race-26': ['software'],
}

// תיאורים לתמונות (alt). תמונה בלי תיאור מקבלת את שם האירוע.
export const captions: Record<string, string> = {
  '5-race-26': 'לוח הטלמטריה החי בפיטס',
}

export type GalleryImage = {
  name: string
  src: string
  width: number
  height: number
  event: GalleryEvent
  teams: TeamId[]
  alt: string
}

const index = images as Record<string, { name: string; src: string; width: number; height: number }[]>

export const galleryImages: GalleryImage[] = galleryEvents.flatMap((event) =>
  (index[`gallery/${event.folder}`] ?? []).map((img) => ({
    ...img,
    event,
    teams: teamTags[img.name] ?? [],
    alt: captions[img.name] ?? `${event.label}, אורנע 2`,
  })),
)
