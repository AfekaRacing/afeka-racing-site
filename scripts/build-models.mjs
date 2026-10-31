// ממיר את קבצי ה-STL שיצאו מ-SolidWorks (scripts/cad/swmesh.exe export) לקבצי GLB קלים לאתר.
// זה החלק שבדרך הידנית עושים ב-Blender: איחוד, הקטנת משולשים, דחיסה וייצוא.
//
// שימוש: npm run models
// קלט:  models-source/stl/<מספר>__<שם רכיב>__<צבע>.stl
// פלט:  public/models/<id>.glb  (id = הרכיב ב-src/data/parts.ts)
import { readdirSync, readFileSync, mkdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { Document, NodeIO } from '@gltf-transform/core'
import { EXTMeshoptCompression, KHRMeshQuantization } from '@gltf-transform/extensions'
import { meshopt, quantize, simplify, weld } from '@gltf-transform/functions'
import { MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer'

const SRC = 'models-source/stl'
const OUT = 'public/models'

// איזה רכיב ראשי מהמכלול שייך לאיזה רכיב באתר, וכמה משולשים מותר לו בסוף
const PARTS = [
  { id: 'chassis', groups: ['07'], maxTris: 30000 },
  { id: 'front-suspension', groups: ['04'], maxTris: 40000 },
  { id: 'rear-suspension', groups: ['09', '11'], maxTris: 40000 },
  { id: 'steering', groups: ['01'], maxTris: 20000 },
  { id: 'brakes', groups: ['02'], maxTris: 15000 },
  // במכלול מוצג רק צמיג קדמי אחד; את השני משקפים לצד השני
  { id: 'wheels', groups: ['12'], maxTris: 6000, mirrorSide: true },
  { id: 'battery', groups: ['08'], maxTris: 12000 },
  { id: 'body', groups: ['05'], maxTris: 50000 },
]

// מערכת הצירים של SolidWorks במכלול: x = אורך (החזית לכיוון מינוס), y = רוחב, z = גובה.
// באתר: x = קדימה, y = למעלה, z = לצד. מרכז הרכב באמצע האורך, והקרקע ב-0.
const CENTER_X = 0.85
const GROUND_Z = -0.28
const toSite = (x, y, z) => [-(x - CENTER_X), z - GROUND_Z, y]

function readStl(file) {
  const b = readFileSync(file)
  const n = b.readUInt32LE(80)
  const pos = new Float32Array(n * 9)
  for (let t = 0; t < n; t++) {
    const o = 84 + t * 50 + 12
    for (let v = 0; v < 3; v++) {
      const [x, y, z] = toSite(b.readFloatLE(o + v * 12), b.readFloatLE(o + v * 12 + 4), b.readFloatLE(o + v * 12 + 8))
      pos.set([x, y, z], t * 9 + v * 3)
    }
  }
  return pos
}

function mirrorZ(pos) {
  const out = new Float32Array(pos.length)
  // היפוך צד אחד הופך את כיוון המשולשים, אז מחליפים שני קודקודים כדי לשמור על הכיוון
  for (let t = 0; t < pos.length; t += 9) {
    const a = [pos[t], pos[t + 1], -pos[t + 2]]
    const b = [pos[t + 3], pos[t + 4], -pos[t + 5]]
    const c = [pos[t + 6], pos[t + 7], -pos[t + 8]]
    out.set([...a, ...c, ...b], t)
  }
  return out
}

// נורמלים חלקים על רשת עם אינדקסים (normals() של gltf-transform מפרק את הרשת לפאות שטוחות)
function smoothNormals(doc) {
  for (const mesh of doc.getRoot().listMeshes()) {
    for (const prim of mesh.listPrimitives()) {
      const pos = prim.getAttribute('POSITION').getArray()
      const idx = prim.getIndices().getArray()
      const n = new Float32Array(pos.length)
      for (let i = 0; i < idx.length; i += 3) {
        const a = idx[i] * 3, b = idx[i + 1] * 3, c = idx[i + 2] * 3
        const ux = pos[b] - pos[a], uy = pos[b + 1] - pos[a + 1], uz = pos[b + 2] - pos[a + 2]
        const vx = pos[c] - pos[a], vy = pos[c + 1] - pos[a + 1], vz = pos[c + 2] - pos[a + 2]
        const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx
        for (const k of [a, b, c]) {
          n[k] += nx
          n[k + 1] += ny
          n[k + 2] += nz
        }
      }
      for (let i = 0; i < n.length; i += 3) {
        const l = Math.hypot(n[i], n[i + 1], n[i + 2]) || 1
        n[i] /= l
        n[i + 1] /= l
        n[i + 2] /= l
      }
      prim.setAttribute('NORMAL', doc.createAccessor().setType('VEC3').setArray(n).setBuffer(doc.getRoot().listBuffers()[0]))
    }
  }
}

await MeshoptEncoder.ready
await MeshoptSimplifier.ready
mkdirSync(OUT, { recursive: true })
const files = readdirSync(SRC).filter((f) => f.toLowerCase().endsWith('.stl'))
const io = new NodeIO().registerExtensions([EXTMeshoptCompression, KHRMeshQuantization]).registerDependencies({
  'meshopt.encoder': MeshoptEncoder,
})

for (const part of PARTS) {
  const chunks = files.filter((f) => part.groups.includes(f.split('__')[0])).map((f) => readStl(join(SRC, f)))
  if (part.mirrorSide) chunks.push(...chunks.map(mirrorZ))
  const total = chunks.reduce((n, c) => n + c.length, 0)
  if (total === 0) {
    console.log(`${part.id}: אין קבצים, דילוג`)
    continue
  }
  const positions = new Float32Array(total)
  let offset = 0
  for (const c of chunks) {
    positions.set(c, offset)
    offset += c.length
  }
  const trisIn = total / 9

  const doc = new Document()
  const buffer = doc.createBuffer()
  const material = doc.createMaterial(part.id).setBaseColorFactor([0.75, 0.78, 0.76, 1]).setMetallicFactor(0.3).setRoughnessFactor(0.5)
  const prim = doc
    .createPrimitive()
    .setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(positions).setBuffer(buffer))
    .setMaterial(material)
  const mesh = doc.createMesh(part.id).addPrimitive(prim)
  doc.createScene().addChild(doc.createNode(part.id).setMesh(mesh))

  const ratio = Math.min(1, part.maxTris / trisIn)
  await doc.transform(
    weld(),
    simplify({ simplifier: MeshoptSimplifier, ratio, error: 0.002, lockBorder: false }),
    smoothNormals,
    quantize(),
    meshopt({ encoder: MeshoptEncoder, level: 'high' }),
  )

  const indices = doc.getRoot().listMeshes()[0].listPrimitives()[0].getIndices()
  const trisOut = indices ? indices.getCount() / 3 : 0
  const file = join(OUT, `${part.id}.glb`)
  await io.write(file, doc)
  console.log(
    `${part.id.padEnd(17)} ${String(Math.round(trisIn)).padStart(8)} → ${String(Math.round(trisOut)).padStart(6)} משולשים, ${(statSync(file).size / 1024).toFixed(0)} KB`,
  )
}
