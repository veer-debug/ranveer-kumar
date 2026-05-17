/** Deterministic 0–1 value from index (stable across server and client). */
function seededUnit(index: number, salt: number): number {
  const x = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453
  return x - Math.floor(x)
}

export interface FloatingParticleConfig {
  initialX: number
  initialY: number
  animateX: number
  animateY: number
  duration: number
}

export function getFloatingParticles(count: number): FloatingParticleConfig[] {
  return Array.from({ length: count }, (_, i) => ({
    initialX: seededUnit(i, 1) * 100,
    initialY: seededUnit(i, 2) * 100,
    animateX: seededUnit(i, 3) * 100,
    animateY: seededUnit(i, 4) * 100,
    duration: seededUnit(i, 5) * 20 + 10,
  }))
}

export function getStaticParticles(count: number): { left: number; top: number; delay: number }[] {
  return Array.from({ length: count }, (_, i) => ({
    left: seededUnit(i, 6) * 100,
    top: seededUnit(i, 7) * 100,
    delay: seededUnit(i, 8) * 5,
  }))
}
