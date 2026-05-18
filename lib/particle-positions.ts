/** Deterministic 0–1 value from index (stable across server and client). */
function seededUnit(index: number, salt: number): number {
  const x = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453
  return x - Math.floor(x)
}

const PRECISION = 4

/** Round so SSR and client produce identical style strings (avoids hydration mismatch). */
export function roundPosition(value: number): number {
  const factor = 10 ** PRECISION
  return Math.round(value * factor) / factor
}

export function formatVw(value: number): string {
  return `${roundPosition(value).toFixed(PRECISION)}vw`
}

export function formatVh(value: number): string {
  return `${roundPosition(value).toFixed(PRECISION)}vh`
}

export function formatPercent(value: number): string {
  return `${roundPosition(value).toFixed(PRECISION)}%`
}

export function formatSeconds(value: number): string {
  return `${roundPosition(value).toFixed(PRECISION)}s`
}

export interface FloatingParticleConfig {
  initialX: number
  initialY: number
  animateX: number
  animateY: number
  duration: number
  initial: { x: string; y: string }
  animate: { x: string; y: string }
}

export function getFloatingParticles(count: number): FloatingParticleConfig[] {
  return Array.from({ length: count }, (_, i) => {
    const initialX = roundPosition(seededUnit(i, 1) * 100)
    const initialY = roundPosition(seededUnit(i, 2) * 100)
    const animateX = roundPosition(seededUnit(i, 3) * 100)
    const animateY = roundPosition(seededUnit(i, 4) * 100)
    const duration = roundPosition(seededUnit(i, 5) * 20 + 10)

    return {
      initialX,
      initialY,
      animateX,
      animateY,
      duration,
      initial: { x: formatVw(initialX), y: formatVh(initialY) },
      animate: { x: formatVw(animateX), y: formatVh(animateY) },
    }
  })
}

export interface StaticParticleConfig {
  left: number
  top: number
  delay: number
  style: {
    left: string
    top: string
    animationDelay: string
  }
}

export function getStaticParticles(count: number): StaticParticleConfig[] {
  return Array.from({ length: count }, (_, i) => {
    const left = roundPosition(seededUnit(i, 6) * 100)
    const top = roundPosition(seededUnit(i, 7) * 100)
    const delay = roundPosition(seededUnit(i, 8) * 5)

    return {
      left,
      top,
      delay,
      style: {
        left: formatPercent(left),
        top: formatPercent(top),
        animationDelay: formatSeconds(delay),
      },
    }
  })
}
