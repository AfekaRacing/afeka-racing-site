// תמונה רספונסיבית מתוך public/images. src הוא הנתיב בלי סיומת, כפי שמופיע ב-manifest.json
// (למשל 'story/race-rain'). הסקריפט npm run images יוצר שתי גרסאות: 800 ו-1600 פיקסלים.

type Props = {
  src: string
  alt: string
  className?: string
  sizes?: string
  priority?: boolean
}

export const photoUrl = (src: string, width: 800 | 1600 = 1600) =>
  `${import.meta.env.BASE_URL}images/${src}-${width}.webp`

export function Photo({ src, alt, className, sizes = '100vw', priority }: Props) {
  return (
    <img
      className={className}
      src={photoUrl(src, 1600)}
      srcSet={`${photoUrl(src, 800)} 800w, ${photoUrl(src, 1600)} 1600w`}
      sizes={sizes}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      {...(priority ? { fetchPriority: 'high' as const } : {})}
    />
  )
}

// מקום שמור לתמונה שעוד לא נבחרה
export function PhotoPlaceholder({ label, className }: { label: string; className?: string }) {
  return (
    <div className={`photo-placeholder ${className ?? ''}`} role="img" aria-label={label}>
      <span>[להשלים: {label}]</span>
    </div>
  )
}
