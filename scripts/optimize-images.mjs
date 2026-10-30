// מכווץ תמונות ל-WebP עבור האתר.
//
// איך משתמשים:
//   1. מעתיקים את התמונות שנבחרו לתיקייה images-source/<קבוצה>/<אירוע>/
//      (למשל images-source/gallery/race-day/). התיקייה הזו לא נכנסת ל-Git.
//   2. מריצים: npm run images
//   3. התוצאה ב-public/images/<קבוצה>/<אירוע>/:
//      שם-800.webp ו-שם-1600.webp, בלי נתוני EXIF/GPS,
//      וקובץ manifest.json עם רשימת התמונות ומידותיהן.
//
// תמונה שכבר עובדה ולא השתנתה מדולגת, כך שאפשר להריץ שוב בכל פעם שמוסיפים תמונות.
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { basename, extname, join, relative } from 'node:path'
import sharp from 'sharp'

const SRC = process.argv[2] || 'images-source'
const OUT = process.argv[3] || 'public/images'
const WIDTHS = [800, 1600]
const EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff'])

const slug = (name) =>
  name
    .normalize('NFKD')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(p)
    else yield p
  }
}

if (!existsSync(SRC)) {
  console.error(`לא נמצאה תיקיית מקור: ${SRC}`)
  process.exit(1)
}

const manifests = new Map() // תיקיית יעד -> רשימת תמונות
let done = 0
let skipped = 0
const unsupported = []

for (const file of walk(SRC)) {
  const ext = extname(file).toLowerCase()
  if (!EXT.has(ext)) {
    if (!/\.(json|txt|ini|db)$/i.test(file)) unsupported.push(file)
    continue
  }
  const relDir = relative(SRC, join(file, '..'))
  const outDir = join(OUT, relDir)
  mkdirSync(outDir, { recursive: true })
  const name = slug(basename(file, ext))

  const img = sharp(file, { failOn: 'none' }).rotate() // rotate() מיישר לפי EXIF ואז הוא נמחק
  const meta = await img.metadata()
  const portrait = (meta.orientation ?? 1) >= 5
  const w = portrait ? meta.height : meta.width
  const h = portrait ? meta.width : meta.height

  const srcTime = statSync(file).mtimeMs
  for (const width of WIDTHS) {
    const target = join(outDir, `${name}-${width}.webp`)
    if (existsSync(target) && statSync(target).mtimeMs > srcTime) {
      skipped++
      continue
    }
    await img
      .clone()
      .resize({ width: Math.min(width, w), withoutEnlargement: true })
      .webp({ quality: 78, effort: 5 })
      .toFile(target)
    done++
  }

  const list = manifests.get(outDir) ?? []
  list.push({
    name,
    src: `${relative(OUT, outDir).replaceAll('\\', '/')}/${name}`,
    width: w,
    height: h,
  })
  manifests.set(outDir, list)
}

for (const [dir, list] of manifests) {
  list.sort((a, b) => a.name.localeCompare(b.name))
  writeFileSync(join(dir, 'manifest.json'), JSON.stringify(list, null, 2))
}

console.log(`נוצרו ${done} קבצים, ${skipped} דולגו (כבר קיימים).`)
if (unsupported.length) {
  console.log('קבצים שלא עובדו (HEIC/RAW/וידאו – יש להמיר ל-JPG קודם):')
  for (const f of unsupported) console.log('  ' + f)
}
