import { useGLTF } from '@react-three/drei'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { modelTransform, type Part, type Shape } from '../data/parts'

type Vec3 = [number, number, number]

const up = new THREE.Vector3(0, 1, 0)

// צינור בין שתי נקודות: גליל שמסובב לכיוון הקו
function tubeTransform(from: Vec3, to: Vec3) {
  const a = new THREE.Vector3(...from)
  const b = new THREE.Vector3(...to)
  const dir = b.clone().sub(a)
  const length = dir.length()
  const quat = new THREE.Quaternion().setFromUnitVectors(up, dir.normalize())
  const mid = a.add(b).multiplyScalar(0.5)
  return { position: mid, quaternion: quat, length }
}

function ShapeMesh({ shape, material, glass }: { shape: Shape; material: THREE.Material; glass: THREE.Material }) {
  switch (shape.type) {
    case 'tube': {
      const t = tubeTransform(shape.from, shape.to)
      return (
        <mesh position={t.position} quaternion={t.quaternion} material={material}>
          <cylinderGeometry args={[shape.r, shape.r, t.length, 10]} />
        </mesh>
      )
    }
    case 'box':
      return (
        <mesh position={shape.at} material={material}>
          <boxGeometry args={shape.size} />
        </mesh>
      )
    case 'wheel':
      return (
        <mesh position={shape.at} rotation={[Math.PI / 2, 0, 0]} material={material}>
          <cylinderGeometry args={[shape.r, shape.r, shape.width, 32]} />
        </mesh>
      )
    case 'ring':
      return (
        <mesh position={shape.at} rotation={shape.rot ?? [0, 0, 0]} material={material}>
          <torusGeometry args={[shape.r, shape.tube, 10, 40]} />
        </mesh>
      )
    case 'shell':
      return (
        <mesh position={shape.at} scale={shape.scale} material={shape.glass ? glass : material}>
          <sphereGeometry args={[1, 48, 24]} />
        </mesh>
      )
  }
}

// מודל אמיתי מקובץ GLB. החומרים משוכפלים כדי שאפשר יהיה להדגיש רכיב אחד בלי לשנות אחרים.
function GltfPart({ url, highlight, dim }: { url: string; highlight: boolean; dim: boolean }) {
  const { scene } = useGLTF(`${import.meta.env.BASE_URL}${url}`)
  const object = useMemo(() => {
    const clone = scene.clone(true)
    clone.traverse((o) => {
      const mesh = o as THREE.Mesh
      if (mesh.isMesh) mesh.material = (mesh.material as THREE.MeshStandardMaterial).clone()
    })
    return clone
  }, [scene])

  useEffect(() => {
    object.traverse((o) => {
      const mesh = o as THREE.Mesh
      if (!mesh.isMesh) return
      const m = mesh.material as THREE.MeshStandardMaterial
      m.emissive?.set(highlight ? '#befa23' : '#000000')
      m.emissiveIntensity = highlight ? 0.35 : 0
      m.transparent = dim
      m.opacity = dim ? 0.18 : 1
      m.depthWrite = !dim
    })
  }, [object, highlight, dim])

  return (
    <primitive
      object={object}
      scale={modelTransform.scale}
      rotation={modelTransform.rotation}
      position={modelTransform.position}
    />
  )
}

type PartProps = {
  part: Part
  explode: number
  selected: boolean
  dimmed: boolean
  onSelect: (id: string) => void
  register: (id: string, obj: THREE.Object3D | null) => void
}

function PartGroup({ part, explode, selected, dimmed, onSelect, register }: PartProps) {
  const group = useRef<THREE.Group>(null)
  const shapeRefs = useRef<(THREE.Group | null)[]>([])
  const target = useMemo(() => new THREE.Vector3(), [])

  // חומרים: רגיל, זכוכית (לחופה), ושניהם משתנים לפי בחירה
  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ color: part.color, metalness: 0.35, roughness: 0.45 }),
    [part.color],
  )
  const glass = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: '#cfe9f2', transparent: true, opacity: 0.35, roughness: 0.05, depthWrite: false }),
    [],
  )
  const isShell = part.shapes.some((s) => s.type === 'shell')

  useEffect(() => {
    material.emissive.set(selected ? '#befa23' : '#000000')
    material.emissiveIntensity = selected ? 0.35 : 0
    // המעטפת שקופה למחצה כברירת מחדל, כדי שרואים את מה שבתוכה
    const baseOpacity = isShell && !selected ? 0.32 : 1
    const opacity = dimmed ? Math.min(baseOpacity, 0.15) : baseOpacity
    material.transparent = opacity < 1
    material.opacity = opacity
    material.depthWrite = opacity === 1
    glass.opacity = dimmed ? 0.1 : 0.35
  }, [material, glass, selected, dimmed, isShell])

  useEffect(() => () => (material.dispose(), glass.dispose()), [material, glass])

  // תנועה רכה למצב הפירוק הנוכחי
  useFrame((_, delta) => {
    const k = 1 - Math.exp(-delta * 6)
    if (group.current) {
      target.set(...part.explode).multiplyScalar(explode)
      group.current.position.lerp(target, k)
    }
    part.shapes.forEach((s, i) => {
      const g = shapeRefs.current[i]
      if (!g || !s.explode) return
      target.set(...s.explode).multiplyScalar(explode)
      g.position.lerp(target, k)
    })
  })

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    onSelect(part.id)
  }

  return (
    <group
      ref={(g) => {
        group.current = g
        register(part.id, g)
      }}
      name={part.id}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation()
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => (document.body.style.cursor = '')}
    >
      {part.model ? (
        <GltfPart url={part.model} highlight={selected} dim={dimmed} />
      ) : (
        part.shapes.map((s, i) => (
          <group key={i} ref={(g) => void (shapeRefs.current[i] = g)}>
            <ShapeMesh shape={s} material={material} glass={glass} />
          </group>
        ))
      )}
    </group>
  )
}

type CarProps = {
  parts: Part[]
  explode: number
  selectedId: string | null
  onSelect: (id: string) => void
  register: (id: string, obj: THREE.Object3D | null) => void
}

export function CarModel({ parts, explode, selectedId, onSelect, register }: CarProps) {
  return (
    <group>
      {parts.map((p) => (
        <PartGroup
          key={p.id}
          part={p}
          explode={explode}
          selected={selectedId === p.id}
          dimmed={selectedId !== null && selectedId !== p.id}
          onSelect={onSelect}
          register={register}
        />
      ))}
    </group>
  )
}
