import { CameraControls, ContactShadows } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense, useCallback, useEffect, useRef } from 'react'
import * as THREE from 'three'
import type { Part } from '../data/parts'
import { CarModel } from './CarModel'

type Props = {
  parts: Part[]
  explode: number
  selectedId: string | null
  onSelect: (id: string | null) => void
  lite: boolean // מכשיר חלש או נייד: בלי צללים ורזולוציה נמוכה יותר
  resetSignal: number // משתנה בכל לחיצה על "הרכב השלם"
}

const HOME: [number, number, number, number, number, number] = [3.4, 2.1, 3.6, 0, 0.55, 0]

export default function OrnaScene({ parts, explode, selectedId, onSelect, lite, resetSignal }: Props) {
  const controls = useRef<CameraControls>(null)
  const objects = useRef(new Map<string, THREE.Object3D>())

  const register = useCallback((id: string, obj: THREE.Object3D | null) => {
    if (obj) objects.current.set(id, obj)
    else objects.current.delete(id)
  }, [])

  // מעבר מצלמה לרכיב שנבחר. מחכים קצת כדי שהרכיב יגיע למקומו במצב הפירוק.
  useEffect(() => {
    const c = controls.current
    if (!c) return
    const timer = setTimeout(() => {
      const obj = selectedId ? objects.current.get(selectedId) : null
      if (obj) {
        const box = new THREE.Box3().setFromObject(obj)
        if (!box.isEmpty()) c.fitToBox(box, true, { paddingTop: 0.5, paddingBottom: 0.5, paddingLeft: 0.7, paddingRight: 0.7 })
      } else {
        const zoomOut = 1 + explode * 0.6
        const [x, y, z, tx, ty, tz] = HOME
        c.setLookAt(x * zoomOut, y * zoomOut, z * zoomOut, tx, ty + explode * 0.4, tz, true)
      }
    }, 450)
    return () => clearTimeout(timer)
  }, [selectedId, explode, resetSignal])

  return (
    <Canvas
      dpr={lite ? [1, 1.25] : [1, 2]}
      gl={{ antialias: !lite, powerPreference: lite ? 'low-power' : 'high-performance' }}
      camera={{ position: [HOME[0], HOME[1], HOME[2]], fov: 40, near: 0.05, far: 100 }}
      onPointerMissed={() => onSelect(null)}
      aria-label="מודל תלת-ממדי של אורנע 2. השתמשו ברשימת הרכיבים כדי לבחור רכיב."
      role="img"
    >
      <color attach="background" args={['#e9f8f0']} />
      <hemisphereLight args={['#ffffff', '#9fb8ab', 1.1]} />
      <directionalLight position={[4, 6, 3]} intensity={1.6} />
      <directionalLight position={[-4, 3, -3]} intensity={0.5} />

      <Suspense fallback={null}>
        <CarModel parts={parts} explode={explode} selectedId={selectedId} onSelect={onSelect} register={register} />
      </Suspense>

      {!lite && <ContactShadows position={[0, -0.001, 0]} opacity={0.35} scale={8} blur={2.4} far={2} />}
      <gridHelper args={[12, 24, '#b5d6c5', '#d3eadf']} position={[0, -0.002, 0]} />

      <CameraControls ref={controls} minDistance={0.6} maxDistance={12} maxPolarAngle={Math.PI / 2 - 0.05} makeDefault />
    </Canvas>
  )
}
