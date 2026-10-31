import { animate, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

// מספר שסופר מאפס כשהוא נכנס למסך.
// המספר האמיתי מוצג מההתחלה: אם האנימציה לא רצה (דפדפן ישן, אייפון, פחות תנועה), עדיין רואים אותו.
export function CountUp({ to, text }: { to?: number; text: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const reduce = useReducedMotion()
  const [shown, setShown] = useState(text)
  const started = useRef(false)
  const decimals = to !== undefined && !Number.isInteger(to) ? 1 : 0

  useEffect(() => {
    if (to === undefined || reduce || !inView || started.current) return
    started.current = true
    const controls = animate(0, to, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setShown(v.toFixed(decimals)),
      onComplete: () => setShown(text),
    })
    return () => {
      controls.stop()
      setShown(text)
    }
  }, [to, text, reduce, inView, decimals])

  return (
    <span ref={ref} className="ltr" aria-label={text}>
      <span aria-hidden>{shown}</span>
    </span>
  )
}
