// יוצר "גיליון מגע": תמונות ממוזערות ממוספרות ברשת אחת, כדי לבחור תמונות מהר.
// שימוש: node scripts/contact-sheet.mjs <output.jpg> <file1> <file2> ...
//   או: node scripts/contact-sheet.mjs <output.jpg> --list <list.txt>  (נתיב בכל שורה)
import { readFileSync, writeFileSync } from 'node:fs'
import sharp from 'sharp'

const [out, ...rest] = process.argv.slice(2)
const files = rest[0] === '--list' ? readFileSync(rest[1], 'utf8').split(/\r?\n/).filter(Boolean) : rest
const cell = Number(process.env.CELL || 260)
const cols = Number(process.env.COLS || 6)
const bg = process.env.BG || '#ffffff'
const rows = Math.ceil(files.length / cols)
const pad = 8
const labelH = 22

const tiles = []
for (const [i, f] of files.entries()) {
  let input
  try {
    input = await sharp(f, { density: 150, failOn: 'none' })
      .rotate()
      .resize(cell - pad * 2, cell - pad * 2 - labelH, { fit: 'contain', background: bg })
      .flatten({ background: bg })
      .png()
      .toBuffer()
  } catch (e) {
    console.error(`#${i + 1} failed: ${f}: ${e.message}`)
    continue
  }
  const x = (i % cols) * cell
  const y = Math.floor(i / cols) * cell
  tiles.push({ input, left: x + pad, top: y + pad + labelH })
  const label = Buffer.from(
    `<svg width="${cell}" height="${labelH}"><rect width="100%" height="100%" fill="#141a17"/><text x="6" y="16" font-family="Arial" font-size="15" font-weight="bold" fill="#befa23">${i + 1}</text></svg>`,
  )
  tiles.push({ input: label, left: x, top: y })
  console.log(`${i + 1}\t${f}`)
}

const img = await sharp({ create: { width: cols * cell, height: rows * cell, channels: 3, background: '#cccccc' } })
  .composite(tiles)
  .jpeg({ quality: 80 })
  .toBuffer()
writeFileSync(out, img)
