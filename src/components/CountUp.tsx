import { animate, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

// מספר שסופר מאפס כשהוא נכנס למסך. בלי אנימציה למי שביקש פחות תנועה.
export function CountUp({ to, text }: { to?: number; text: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduce = useReducedMotion()
  const [shown, setShown] = useState(to === undefined || reduce ? text : '0')
  const decimals = to !== undefined && !Number.isInteger(to) ? 1 : 0

  useEffect(() => {
    if (to === undefined || reduce || !inView) return
    const controls = animate(0, to, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setShown(v.toFixed(decimals)),
      onComplete: () => setShown(text),
    })
    return () => controls.stop()
  }, [to, text, reduce, inView, decimals])

  return (
    <span ref={ref} className="ltr" aria-label={text}>
      <span aria-hidden>{shown}</span>
    </span>
  )
}
