// ספונסרים, לפי רשימת המדבקות על הרכב (גיוסים/לוגו חברות/לוגו ספונסר לקבוצת מרוצים אפקה.docx).
// logo: קובץ בתיקייה public/brand/sponsors (נוצר עם scripts/prepare-logos.mjs).
// url: אפשר להוסיף קישור לאתר החברה.

export type Sponsor = { name: string; logo: string; url?: string }

const logo = (slug: string) => `${import.meta.env.BASE_URL}brand/sponsors/${slug}.webp`

export const sponsors: Sponsor[] = [
  { name: 'Champion Motors', logo: logo('champion-motors') },
  { name: 'אלדן', logo: logo('eldan') },
  { name: 'Konnect – Volkswagen Group Innovation Hub TLV', logo: logo('konnect') },
  { name: 'EVR Motors', logo: logo('evr-motors') },
  { name: 'Ray-Q Interconnect', logo: logo('ray-q') },
  { name: 'IMCD', logo: logo('imcd') },
  { name: 'REALIS', logo: logo('realis') },
  { name: 'Sherman’s Playground', logo: logo('shermans-playground') },
  { name: 'מ.פ צנרת', logo: logo('mf-piping') },
  { name: 'CarFix', logo: logo('carfix') },
  { name: 'Hashimshony Engineering', logo: logo('hashimshony') },
  { name: 'Namiir Design', logo: logo('namiir') },
  { name: 'פייטל (Piitel)', logo: logo('piitel') },
]
