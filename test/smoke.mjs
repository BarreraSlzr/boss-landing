// Smoke test sin navegador: construye el mundo en Node,
// recorre la curva de cámara y hace tictac a los animadores.

import * as THREE from 'three'
import { buildWorld } from '../src/world.js'

const assert = (cond, msg) => {
  if (!cond) { console.error('✗', msg); process.exit(1) }
  console.log('✓', msg)
}

const scene = new THREE.Scene()
const world = buildWorld(scene)

assert(world.updaters.length >= 10, `animadores registrados: ${world.updaters.length}`)
assert(world.stationCount === 14, '14 estaciones')

// la curva de cámara nunca se mete bajo el suelo
let minY = Infinity, maxY = -Infinity
for (let i = 0; i <= 400; i++) {
  const pt = world.posCurve.getPoint(i / 400)
  minY = Math.min(minY, pt.y)
  maxY = Math.max(maxY, pt.y)
}
assert(minY >= 1.0, `altura mínima de cámara: ${minY.toFixed(2)}`)

// el punto de mira siempre por delante (z decreciente en general)
const look0 = world.lookCurve.getPoint(0)
const look1 = world.lookCurve.getPoint(0.999)
assert(look1.z < look0.z, `trayectoria de mirada coherente (${look0.z.toFixed(0)} → ${look1.z.toFixed(0)})`)

// 60 segundos de animación sin excepciones
for (let f = 0; f < 60 * 60; f++) {
  for (const u of world.updaters) u(f / 60, 1 / 60)
}
assert(true, '60 s de animación sin errores')

// inventario
let meshes = 0, lines = 0, points = 0, lights = 0
scene.traverse((o) => {
  if (o.isMesh) meshes++
  if (o.isLine || o.isLineSegments) lines++
  if (o.isPoints) points++
  if (o.isLight) lights++
})
console.log(`  escena: ${meshes} meshes · ${lines} líneas · ${points} sistemas de partículas · ${lights} luces`)
assert(meshes > 150, `mundo poblado (${meshes} meshes)`)

// geotrónica sana: ninguna esfera envolvente con NaN
const badGeo = []
scene.traverse((o) => {
  const geo = o.geometry
  if (!geo) return
  geo.computeBoundingSphere()
  const r = geo.boundingSphere?.radius
  if (!Number.isFinite(r)) {
    const p = geo.parameters ?? {}
    badGeo.push(
      `${o.parent?.name || '?'} @(${o.position?.x?.toFixed?.(1)},${o.position?.y?.toFixed?.(1)},${o.position?.z?.toFixed?.(1)}) ` +
      `w=${p.width} h=${p.height} d=${p.depth} r=${p.radius}`
    )
  }
})
assert(badGeo.length === 0, `geometrías sin NaN${badGeo.length ? ' — defectuosas:\n  ' + badGeo.join('\n  ') : ''}`)

console.log('\nSMOKE OK')
