// ממיר את לוגואי הספונסרים והמותג מתיקיית "לוגו חברות" לקבצים קלים לאתר.
// לוגו אחד לכל חברה. מריצים שוב רק אם מחליפים לוגו:
//   node scripts/prepare-logos.mjs "C:\Users\...\גיוסים\לוגו חברות"
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'

const src = process.argv[2]
if (!src) {
  console.error('usage: node scripts/prepare-logos.mjs <logos folder>')
  process.exit(1)
}
const v = 'קבצים וקטורים לוגו'

// slug -> קובץ מקור (יחסית לתיקיית הלוגואים)
const sponsors = {
  'champion-motors': `${v}/- קיים לאפקה - צמפיון/צמפיון מוטורס.jpg`,
  eldan: `${v}/SVGלפי מידות/3.svg`,
  konnect: `${v}/VW/Konnect_Black-Vector_.svg`,
  'evr-motors': `${v}/SVGלפי מידות/4.svg`,
  'ray-q': `${v}/SVGלפי מידות/1.svg`,
  imcd: `${v}/IMCD/IMCD-Vector.svg`,
  realis: `${v}/REALIS/Vector-Realis.svg`,
  'shermans-playground': `${v}/ilan sherman - playground/ilan sherman black.svg`,
  'mf-piping': `${v}/מ.פ צנרת/מ.פ צנרת.jpeg`,
  carfix: `${v}/carfix/CarFix-Vector.svg`,
  hashimshony: `${v}/שמשמוני/Shimsoni-Vector.svg`,
  namiir: `${v}/Namiir/namir.jpg`,
  piitel: `${v}/piitel/Piitel-Vector.svg`,
}

// לוגואים של המותג: הרקע הלבן הופך לשקוף, כדי שאפשר יהיה להציג אותם גם על רקע כהה
const brand = {
  'afeka-racing': `${v}/סמל המועדון/Afeka Racing.jpg`,
  orna: `${v}/Orna/image003.jpg`,
}

const outSponsors = 'public/brand/sponsors'
mkdirSync(outSponsors, { recursive: true })

const load = (file) => sharp(join(src, file), { density: 300, limitInputPixels: false })

for (const [slug, file] of Object.entries(sponsors)) {
  await load(file)
    .flatten({ background: '#ffffff' })
    .trim({ threshold: 20 })
    .resize({ height: 160, width: 480, fit: 'inside' })
    .webp({ quality: 88 })
    .toFile(join(outSponsors, `${slug}.webp`))
  console.log('sponsor', slug)
}

for (const [slug, file] of Object.entries(brand)) {
  const base = load(file).flatten({ background: '#ffffff' }).trim({ threshold: 20 }).resize({ height: 120 })
  const { data, info } = await base.clone().raw().toBuffer({ resolveWithObject: true })
  const rgba = Buffer.alloc(info.width * info.height * 4)
  for (let i = 0, j = 0; i < data.length; i += info.channels, j += 4) {
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]]
    const alpha = 255 - Math.min(r, g, b) // כמה רחוק מלבן
    const k = alpha === 0 ? 0 : 255 / alpha
    // מחזירים את הצבע המקורי לפני ההלבנה, כדי שהקצוות לא ייצאו אפורים
    rgba[j] = Math.max(0, Math.min(255, 255 - (255 - r) * k))
    rgba[j + 1] = Math.max(0, Math.min(255, 255 - (255 - g) * k))
    rgba[j + 2] = Math.max(0, Math.min(255, 255 - (255 - b) * k))
    rgba[j + 3] = alpha
  }
  await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .webp({ quality: 90, alphaQuality: 100 })
    .toFile(join('public/brand', `${slug}.webp`))
  console.log('brand', slug)
}

await load('לוגואים של כולם/אפקה .jpg')
  .trim({ threshold: 20 })
  .resize({ height: 160 })
  .webp({ quality: 88 })
  .toFile('public/brand/afeka.webp')
console.log('brand afeka')
