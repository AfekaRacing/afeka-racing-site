// בדיקה אם המכשיר יכול להריץ תלת-ממד, ואם כדאי גרסה קלה.

export function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

type NavigatorWithMemory = Navigator & { deviceMemory?: number }

export function deviceProfile() {
  const nav = navigator as NavigatorWithMemory
  const mobile = window.matchMedia('(max-width: 768px), (pointer: coarse)').matches
  const memory = nav.deviceMemory ?? 8
  const cores = nav.hardwareConcurrency ?? 8
  const webgl = hasWebGL()
  // מכשיר חלש: אין WebGL, מעט זיכרון, או נייד עם מעט ליבות
  const weak = !webgl || memory <= 2 || (mobile && cores <= 4)
  return { webgl, mobile, weak, lite: mobile || weak }
}
