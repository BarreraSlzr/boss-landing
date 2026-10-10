// ============================================================
// world.js — el distrito BOSS: bulevar con zanja de sección,
// red azul BOSS continua y 14 estaciones tipo micro-world.
// Devuelve las curvas de cámara para el scroll-story.
// ============================================================

import * as THREE from 'three'
import * as K from './kit.js'
import { STATIONS } from './stations.js'
import { buildAnnex, lampMat, tipMat } from './iso.js'
import { buildHeroMap } from './hero.js'

const { V, box, cyl, sph, tor, tube, edgeBox, blob, person, soilBlock, mat, M, PAL } = K

// ---------- layout ----------
export const STEP = 40
export const START_Z = -40
export const TRENCH_HALF = 4.5
export const TRENCH_Z0 = 28      // inicio de la zanja
export const TRENCH_Z1 = -606    // fin de la zanja
export const TRENCH_LEN = TRENCH_Z0 - TRENCH_Z1

export const stationSide = (i) => (i % 2 === 0 ? 1 : -1)
export const stationX = (i) => stationSide(i) * (26 + (i % 3) * 4 + Math.sin(i * 1.3) * 2)
export const stationZ = (i) => START_Z - i * STEP

// dimensiones de plinth por estación (la 06 es el tubo inspeccionable)
const PAD_SIZE = Array.from({ length: 14 }, (_, i) => (i === 5 ? [26, 34] : [28, 20]))

export function buildWorld(scene) {
  const updaters = []

  scene.fog = new THREE.Fog(PAL.fog, 100, 340)

  // ---------- luz de mesa de plano (uniforme, sin dramatismo) ----------
  const hemi = new THREE.HemisphereLight(0xbcd8f6, 0x163050, 2.7)
  scene.add(hemi)
  const key = new THREE.DirectionalLight(0xdceaff, 0.7)
  key.position.set(42, 64, 34)
  scene.add(key)
  const fill = new THREE.DirectionalLight(0x2a5f9e, 0.55)
  fill.position.set(-56, 40, -70)
  scene.add(fill)

  // ---------- losa del distrito con retícula de plano ----------
  const gw = 230, gl = 820, gz = (TRENCH_Z0 + TRENCH_Z1) / 2 - 20
  for (const s of [-1, 1]) {
    const half = (gw - TRENCH_HALF) / 2
    const gm = K.gridGroundMat({ rx: (half * 2 - TRENCH_HALF) / 16, rz: gl / 16 })
    const p = new THREE.Mesh(new THREE.PlaneGeometry(half * 2 - TRENCH_HALF, gl), gm)
    p.rotation.x = -Math.PI / 2
    p.position.set(s * (TRENCH_HALF + half), 0, gz)
    scene.add(p)
  }

  // ---------- la gran zanja de sección ----------
  const trench = new THREE.Group()
  scene.add(trench)
  const lens = TRENCH_LEN
  const zc = (TRENCH_Z0 + TRENCH_Z1) / 2
  // bordes de concreto
  for (const s of [-1, 1]) {
    box(trench, 1.1, 0.18, lens, M.concrete(), s * (TRENCH_HALF + 0.55), 0.09, zc)
  }
  // muros de estratos (planos, con líneas de sección vectoriales)
  const layers = [
    [0.95, PAL.soil[0]],
    [0.95, PAL.soil[1]],
    [0.95, PAL.soil[2]],
    [0.75, PAL.soil[3]],
  ]
  let yy = 0
  layers.forEach(([h, c], li) => {
    for (const s of [-1, 1]) {
      box(trench, 0.6, h, lens, mat(c, { r: 0.95 }), s * (TRENCH_HALF + 0.3), yy - h / 2, zc)
    }
    yy -= h
  })
  // piso de la zanja
  box(trench, TRENCH_HALF * 2 + 1.2, 0.3, lens, mat(0x0f2740, { r: 0.95 }), 0, yy - 0.15, zc)
  // líneas vectoriales en los muros
  for (const s of [-1, 1]) {
    edgeBox(trench, 0.6, 0.95, 400, PAL.soilLine, s * (TRENCH_HALF + 0.3), -0.475, zc - 110)
    edgeBox(trench, 0.6, 0.95, 400, PAL.soilLine, s * (TRENCH_HALF + 0.3), -1.425, zc - 110)
  }

  // ---------- red vital: línea troncal azul BOSS ----------
  cyl(trench, 0.8, 0.8, lens, M.red(), 0, -2.3, zc, { rx: Math.PI / 2, seg: 24 })
  const nCouple = Math.floor(lens / 9)
  for (let i = 0; i < nCouple; i++) {
    cyl(trench, 0.92, 0.92, 0.55, M.redDeep(), 0, -2.3, TRENCH_Z0 - 4.5 - i * 9, { rx: Math.PI / 2 })
  }
  // tees de conexión: ritmo azul visible desde arriba
  for (let z = TRENCH_Z0 - 22; z > TRENCH_Z1 + 30; z -= 40) {
    cyl(trench, 0.22, 0.22, 1.0, M.red(), 0, -1.3, z)
    sph(trench, 0.24, M.redDeep(), 0, -0.75, z, { sy: 0.8 })
  }
  // soportes tipo cuna
  for (let z = TRENCH_Z0 - 8; z > TRENCH_Z1; z -= 16) {
    box(trench, 2.2, 0.5, 0.7, M.concrete(), 0, -3.1, z)
  }

  // ramales hacia las estaciones + cajas de válvula
  const LATERAL_STATIONS = [0, 1, 2, 3, 4, 6, 7, 9, 10, 12]
  for (const i of LATERAL_STATIONS) {
    const s = stationSide(i)
    const len = Math.abs(stationX(i)) - TRENCH_HALF - 5
    cyl(trench, 0.26, 0.26, len, M.red(), s * (TRENCH_HALF + 0.3 + len / 2), -1.65, stationZ(i) + 4, { rx: Math.PI / 2 })
    tor(trench, 0.36, 0.07, M.redDeep(), s * (TRENCH_HALF + 0.6), -1.65, stationZ(i) + 4, { ry: Math.PI / 2 })
    // registro en superficie
    const bx = s * (TRENCH_HALF + 2.2)
    box(trench, 0.9, 0.55, 0.9, M.concrete(), bx, 0.28, stationZ(i) + 4)
    edgeBox(trench, 0.9, 0.55, 0.9, PAL.soilLine, bx, 0.28, stationZ(i) + 4)
    cyl(trench, 0.3, 0.3, 0.12, M.red(), bx, 0.6, stationZ(i) + 4)
  }

  // ---------- plaza de inicio con logotipo ----------
  const plaza = new THREE.Group()
  plaza.position.set(0, 0, 46)
  scene.add(plaza)
  cyl(plaza, 17, 17, 0.1, mat(0x16304f, { r: 0.92 }), 0, 0.05, 0, { seg: 48 })
  tor(plaza, 15.5, 0.18, M.red(), 0, 0.14, 0, { rx: Math.PI / 2 })
  tor(plaza, 15.5, 0.05, M.concreteDark(), 0, 0.14, 0, { rx: Math.PI / 2, rad: 3, tub: 64 })
  const logoTex = K.texLogo()
  if (logoTex) {
    const logo = new THREE.Mesh(
      new THREE.PlaneGeometry(15, 4.4),
      new THREE.MeshBasicMaterial({ map: logoTex, transparent: true, depthWrite: false })
    )
    logo.rotation.x = -Math.PI / 2
    logo.rotation.z = Math.PI
    logo.position.set(0, 0.12, 1)
    plaza.add(logo)
  }
  for (const s of [-1, 1]) {
    cyl(plaza, 0.09, 0.09, 7, M.white(), s * 13.5, 3.5, 11)
    tor(plaza, 0.12, 0.04, M.red(), s * 13.5, 7, 11, { rx: Math.PI / 2 })
  }
  // marcador de arranque
  for (let i = 0; i < 5; i++) {
    const chev = box(plaza, 1.6, 0.06, 0.4, M.red(), 0, 0.11, 9 - i * 1.1)
    chev.rotation.z = 0
  }

  // ---------- ciudad de fondo: siluetas azules de plano ----------
  const cityMats = [mat(0x1a3050, { r: 0.95 }), mat(0x18304e, { r: 0.95 }), mat(0x1c3556, { r: 0.95 })]
  for (let i = 0; i < 34; i++) {
    const s = i % 2 ? 1 : -1
    const x = s * (62 + Math.random() * 26)
    const z = 80 - Math.random() * 740
    const w = 5 + Math.random() * 9
    const h = 2.5 + Math.random() * 7
    box(scene, w, h, w * (0.7 + Math.random() * 0.6), cityMats[i % 3], x, h / 2, z, Math.random() * 0.4)
  }
  for (let i = 0; i < 26; i++) {
    const s = i % 2 ? 1 : -1
    const x = s * (52 + Math.random() * 18)
    const z = 60 - Math.random() * 700
    const h = 2.2 + Math.random() * 2.4
    cyl(scene, 0.14, 0.2, h * 0.45, mat(PAL.sageTrunk, { r: 0.9 }), x, h * 0.22, z)
    sph(scene, 0.8 + Math.random() * 0.7, mat(PAL.sage, { r: 0.9 }), x, h * 0.62, z, { sy: 1.15 })
  }

  // ---------- estaciones ----------
  const camPts = []
  const stationGroups = []
  const lookPts = []
  for (let i = 0; i < 14; i++) {
    const cx = stationX(i)
    const cz = stationZ(i)
    const side = stationSide(i)
    const g = new THREE.Group()
    g.name = `station-${i}`
    stationGroups.push({ g, cz: stationZ(i) })
    g.position.set(cx, 0, cz)
    scene.add(g)
    const [pw, pd] = PAD_SIZE[i]
    const y = K.padStation(g, pw, pd)
    const ctx = { g, y, side, i, up: updaters }
    STATIONS[i](ctx)
    buildAnnex(ctx)

    if (i === 5) {
      // 06 · video inspección: la cámara entra al tubo
      camPts.push(V(cx, 3.3, cz + 13))
      lookPts.push(V(cx + 2, 3.0, cz - 10.5))
    } else {
      // el sujeto queda en la mitad despejada (la tarjeta ocupa la otra)
      const sh = i % 2 === 0 ? 1 : -1
      camPts.push(V(cx - side * 16, 18.5, cz + 21))
      lookPts.push(V(cx - sh * 5.5, 1.2, cz - sh * side * 4))
    }
  }

  // pulso compartido de las luces del kit iso (lámparas y balizas)
  updaters.push((t) => {
    lampMat.emissiveIntensity = 0.72 + 0.26 * Math.sin(t * 2.1)
    tipMat.emissiveIntensity = 0.8 + 0.34 * Math.sin(t * 3.3)
  })

  // recorte por niebla: más allá del plano lejano (340) todo es color de fondo,
  // así que esas estaciones no se dibujan (el mundo es lineal en z).
  const FOG_FAR = 340
  const CULL_Z = FOG_FAR + 18
  let lastCovered = null          // null = aún sin aplicar
  updaters.push((t, dt, camera) => {
    if (!camera || !stageVisible) return
    // el color sólido del primer cuadro cubre el distrito: nada que dibujar
    const covered = hero.backdropCover ? hero.backdropCover() > 0.98 : false
    if (covered !== lastCovered) {
      lastCovered = covered
      for (const { g } of stationGroups) g.visible = !covered
      hw.visible = !covered
    }
    if (covered) return
    const camZ = camera.position.z
    for (const { g, cz } of stationGroups) {
      const vis = Math.abs(camZ - cz) < CULL_Z
      if (g.visible !== vis) g.visible = vis
    }
    const headVis = Math.abs(camZ - (TRENCH_Z1 - 4)) < CULL_Z + 40
    if (hw.visible !== headVis) hw.visible = headVis
  })

  // ---------- cabezal final: la red continúa ----------
  const hw = new THREE.Group()
  hw.position.set(0, 0, TRENCH_Z1 - 4)
  scene.add(hw)
  box(hw, 10, 5.2, 1.4, M.concrete(), 0, -0.1, 0)
  edgeBox(hw, 10, 5.2, 1.4, PAL.soilLine, 0, -0.1, 0)
  cyl(hw, 0.75, 0.75, 1.6, M.red(), 0, -2.1, -0.2, { rx: Math.PI / 2 })
  tor(hw, 0.85, 0.09, M.redDeep(), 0, -2.1, 0.62, { rx: Math.PI / 2 })
  // plaza circular final
  cyl(hw, 9, 9, 0.12, mat(0x16304f, { r: 0.92 }), 0, 0.06, 10, { seg: 40 })
  tor(hw, 8, 0.14, M.red(), 0, 0.14, 10, { rx: Math.PI / 2 })

  // teaser: la red sigue y el siguiente tramo es el tuyo
  const nextMat = new THREE.MeshStandardMaterial({ color: 0x63c6ff, emissive: 0x63c6ff, emissiveIntensity: 0.85, roughness: 0.35 })
  cyl(hw, 0.55, 0.35, 2.6, M.white(), 0, 1.4, 15.2)
  cyl(hw, 0.35, 0.55, 1.2, nextMat, 0, 3.2, 15.2)
  const nextTag = K.holoTag(hw, 'SIGUIENTE TRAMO · TU PROYECTO', { x: 0, y: 5.6, z: 15.2, w: 5.0, ry: 0, lead: 1.2 })
  updaters.push((t) => { nextTag.material.opacity = 0.72 + 0.2 * (0.5 + 0.5 * Math.sin(t * 1.5)) })

  // ---------- héroe: plano de México (ZMG + Guadalajara) ----------
  const hero = buildHeroMap(scene, updaters)
  // mientras la lámina cubre la pantalla, el distrito no aporta nada visible:
  // se oculta para que el primer cuadro cueste casi nada.
  const stage = hero.group ? scene.children.filter((o) => o !== hero.group) : null
  let stageVisible = true
  function setStageVisible(v) {
    if (!stage || v === stageVisible) return
    stageVisible = v
    for (const o of stage) o.visible = v
  }

  // ---------- curvas de cámara ----------
  const heroPos = V(0, 30, 64)
  const heroLook = V(0, 1.5, -80)
  const finalePos = V(0, 36, stationZ(13) - 40)
  const finaleLook = V(0, 2, stationZ(13) + 170)
  // el cierre mira hacia atrás (lo construido); COTIZACIÓN mira al cabezal:
  // "el siguiente tramo es tuyo". Cada CTA tiene su propio encuadre.
  const quotePos = V(0, 24, TRENCH_Z1 + 34)
  const quoteLook = V(0, 5, TRENCH_Z1 - 10)
  const posPoints = [V(0, 40, 96), heroPos, ...camPts, finalePos, V(0, 48, stationZ(13) - 64)]
  const lookPoints = [heroLook, heroLook, ...lookPts, finaleLook, finaleLook]
  const posCurve = new THREE.CatmullRomCurve3(posPoints, false, 'centripetal')
  const lookCurve = new THREE.CatmullRomCurve3(lookPoints, false, 'centripetal')

  // ---------- línea de ruta punteada sobre el suelo ----------
  const N = 18
  const splinePts = []
  for (let i = 0; i < N; i++) {
    const t = (i + 1) / (N + 1)
    const p = posCurve.getPoint(t)
    splinePts.push(V(p.x, 0.05, p.z))
  }
  const routeGeo = new THREE.BufferGeometry().setFromPoints(splinePts)
  const route = new THREE.Line(routeGeo, new THREE.LineDashedMaterial({ color: 0x3a6ea8, dashSize: 1.6, gapSize: 2.2, transparent: true, opacity: 0.85 }))
  route.computeLineDistances()
  scene.add(route)

  return { posCurve, lookCurve, updaters, stationCount: 14, hero, setStageVisible, quote: { pos: quotePos, look: quoteLook } }
}
