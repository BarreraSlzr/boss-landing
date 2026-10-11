// ============================================================
// kit.js — paleta, materiales y componentes del "micro-world"
// Estética: diorama vectorial, suelo en corte, maquinaria blanca,
// carmesí reservado a la red hidráulica.
// ============================================================

import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'

export const HAS_DOM = typeof document !== 'undefined'

// ---------- paleta ----------
export const PAL = {
  fog: 0x0a1830,
  ground: 0x0a1830,       // mesa = --bg de la página
  groundLine: 0x1e3a5e,
  pad: 0x0d2140,          // plinth = --bg-top (misma mesa)
  padEdge: 0x3e8bff,      // arista = --accent
  slab: 0x0d2140,         // placa técnica = misma familia
  slabDark: 0x0a1830,
  concrete: 0x7f9cc0,     // concreto = gris azulado de plano
  concreteDark: 0x5d7ba0,
  soil: [0x1a3558, 0x142c4a, 0x0d2140, 0x0a1830], // estratos alineados al blueprint
  soilLine: 0x3e8bff,     // línea de sección = --accent
  white: 0xdce9fa,        // maquinaria: hielo azulado
  white2: 0xc3d8ef,
  metal: 0x8aa5c5,        // gris metálico azulado
  metalDark: 0x5e7ba0,
  steel: 0x6c86a8,
  dark: 0x131f33,         // detalles navy, llantas
  glass: 0x63c6ff,        // ventanal (se pinta con textura)
  glassDeep: 0x2a5f9e,
  red: 0x3e8bff,          // línea vital = azul BOSS (nombre histórico conservado)
  redDeep: 0x1e5fd8,
  redDark: 0x1a4fb0,
  redSoft: 0x5fa8ff,
  blue: 0x63c6ff,         // cian de información / hologramas
  skin: 0x9db4d6,         // figuras: tono frío de plano
  suit: 0x2c4a75,
  vest: 0x3e8bff,
  helmet: 0xe9f2fc,
  sage: 0x4a6c96,         // arbolado: silueta azul de fondo
  sageTrunk: 0x2c4a75,
  water: 0x3e8bff,         // agua contenida = azul BOSS
  dust: 0x9fb6d8,
}

// ---------- materiales ----------
const matCache = new Map()
export function mat(color, o = {}) {
  const key = `${color}|${o.r ?? 0.6}|${o.m ?? 0.05}|${o.op ?? 1}|${o.side ?? 0}|${o.flat ? 1 : 0}|${o.e ?? 0}|${o.ei ?? 0}`
  if (matCache.has(key)) return matCache.get(key)
  const m = new THREE.MeshStandardMaterial({
    color,
    roughness: o.r ?? 0.6,
    metalness: o.m ?? 0.05,
    transparent: (o.op ?? 1) < 1,
    opacity: o.op ?? 1,
    side: o.side ?? THREE.FrontSide,
    flatShading: !!o.flat,
    ...(o.e ? { emissive: o.e, emissiveIntensity: o.ei ?? 0.2 } : {}),
  })
  matCache.set(key, m)
  return m
}

export const M = {
  white: () => mat(PAL.white, { r: 0.42, m: 0.08 }),
  white2: () => mat(PAL.white2, { r: 0.5, m: 0.06 }),
  metal: () => mat(PAL.metal, { r: 0.4, m: 0.35 }),
  steel: () => mat(PAL.steel, { r: 0.5, m: 0.3 }),
  dark: () => mat(PAL.dark, { r: 0.65, m: 0.15 }),
  concrete: () => mat(PAL.concrete, { r: 0.85 }),
  concreteDark: () => mat(PAL.concreteDark, { r: 0.85 }),
  slab: () => mat(PAL.slab, { r: 0.9 }),
  red: () => mat(PAL.red, { r: 0.42, m: 0.08, e: PAL.red, ei: 0.3 }),
  redDeep: () => mat(PAL.redDeep, { r: 0.5, m: 0.08, e: PAL.redDeep, ei: 0.18 }),
  glass: () => {
    // ventanas PINTADAS (canvas), no modeladas
    const t = texWindows()
    const m = mat(t ? 0xffffff : PAL.glassDeep, { r: 0.35, m: 0.1, op: 0.96 })
    if (t) { m.map = t; m.needsUpdate = true }
    return m
  },
  blue: () => mat(PAL.blue, { r: 0.5 }),
  soil: (i) => {
    // caras de sección con rayado técnico (hatching) de plano
    const t = texHatch(PAL.soil[i])
    const m = mat(t ? 0xffffff : PAL.soil[i], { r: 0.95 })
    if (t) { m.map = t; m.needsUpdate = true }
    return m
  },
}

// material de piso con retícula de plano (la textura ya trae los colores)
export function gridGroundMat(o = {}) {
  const t = texGrid()
  // roughness alta: lee como mesa de blueprint, no como plástico iluminado
  const m = mat(t ? 0xffffff : PAL.ground, { r: 1, m: 0, op: o.op ?? 1 })
  if (t) {
    m.map = t.clone()
    m.map.colorSpace = THREE.SRGBColorSpace
    m.map.needsUpdate = true
    m.map.wrapS = m.map.wrapT = THREE.RepeatWrapping
    m.map.repeat.set(o.rx ?? 30, o.rz ?? 110)
    m.map.anisotropy = 8
    m.needsUpdate = true
  }
  return m
}

// ---------- primitivas ----------
export const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z)

export function box(parent, w, h, d, m, x = 0, y = 0, z = 0, ry = 0) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m)
  mesh.position.set(x, y, z)
  mesh.rotation.y = ry
  parent.add(mesh)
  return mesh
}

export function rbox(parent, w, h, d, r, m, x = 0, y = 0, z = 0, ry = 0) {
  const g = new RoundedBoxGeometry(w, h, d, 3, r)
  const mesh = new THREE.Mesh(g, m)
  mesh.position.set(x, y, z)
  mesh.rotation.y = ry
  parent.add(mesh)
  return mesh
}

export function cyl(parent, rt, rb, h, m, x = 0, y = 0, z = 0, o = {}) {
  const g = new THREE.CylinderGeometry(rt, rb, h, o.seg ?? 24, 1, !!o.open, o.t0 ?? 0, o.tl ?? Math.PI * 2)
  const mesh = new THREE.Mesh(g, m)
  mesh.position.set(x, y, z)
  if (o.rx) mesh.rotation.x = o.rx
  if (o.ry) mesh.rotation.y = o.ry
  if (o.rz) mesh.rotation.z = o.rz
  parent.add(mesh)
  return mesh
}

export function sph(parent, r, m, x = 0, y = 0, z = 0, o = {}) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, o.seg ?? 18, o.seg ?? 14), m)
  mesh.position.set(x, y, z)
  if (o.sy) mesh.scale.y = o.sy
  parent.add(mesh)
  return mesh
}

export function tor(parent, r, t, m, x = 0, y = 0, z = 0, o = {}) {
  const g = new THREE.TorusGeometry(r, t, o.rad ?? 12, o.tub ?? 32, o.arc ?? Math.PI * 2)
  const mesh = new THREE.Mesh(g, m)
  mesh.position.set(x, y, z)
  if (o.rx) mesh.rotation.x = o.rx
  if (o.ry) mesh.rotation.y = o.ry
  if (o.rz) mesh.rotation.z = o.rz
  parent.add(mesh)
  return mesh
}

export function tube(parent, pts, r, m, o = {}) {
  const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', o.tension ?? 0.5)
  const g = new THREE.TubeGeometry(curve, o.seg ?? 48, r, o.rad ?? 10, false)
  const mesh = new THREE.Mesh(g, m)
  parent.add(mesh)
  return mesh
}

// líneas de arista — precisión vectorial (suaves: planas, no jaula)
export function edgeBox(parent, w, h, d, color, x = 0, y = 0, z = 0, ry = 0) {
  const g = new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d), 20)
  const line = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.38 }))
  line.position.set(x, y, z)
  line.rotation.y = ry
  parent.add(line)
  return line
}

// placa plana (ventana, panel, agua)
export function plate(parent, w, h, m, x = 0, y = 0, z = 0, o = {}) {
  const g = new THREE.BoxGeometry(w, h, o.d ?? 0.04)
  const mesh = new THREE.Mesh(g, m)
  mesh.position.set(x, y, z)
  if (o.rx) mesh.rotation.x = o.rx
  if (o.ry) mesh.rotation.y = o.ry
  if (o.rz) mesh.rotation.z = o.rz
  parent.add(mesh)
  return mesh
}

// ---------- texturas canvas (solo navegador) ----------
function canvasTex(w, h, draw, o = {}) {
  if (!HAS_DOM) return null
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  draw(c.getContext('2d'), w, h)
  const t = new THREE.CanvasTexture(c)
  t.anisotropy = 4
  t.colorSpace = THREE.SRGBColorSpace
  return t
}
export { canvasTex }

const FONT = '"Space Grotesk", "Arial", sans-serif'
const MONO = '"IBM Plex Mono", monospace'

// ventanas de plano: PINTADAS, no modeladas
export const texWindows = () => canvasTex(512, 256, (c, w, h) => {
  c.fillStyle = '#0a1830'
  c.fillRect(0, 0, w, h)
  c.strokeStyle = 'rgba(62,139,255,0.45)'
  c.lineWidth = 2
  c.strokeRect(6, 6, w - 12, h - 12)
  c.strokeStyle = 'rgba(62,139,255,0.22)'
  c.lineWidth = 1
  for (let i = 1; i < 8; i++) {
    const p = (i / 8) * w + 0.5
    c.beginPath(); c.moveTo(p, 8); c.lineTo(p, h - 8); c.stroke()
  }
  for (let j = 1; j < 2; j++) {
    const p = (j / 2) * h + 0.5
    c.beginPath(); c.moveTo(8, p); c.lineTo(w - 8, p); c.stroke()
  }
  c.fillStyle = 'rgba(62,139,255,0.12)'
  for (const [x, y] of [[1, 0], [4, 1], [6, 0], [2, 1]]) c.fillRect((x * w) / 8 + 4, (y * h) / 2 + 4, w / 8 - 8, h / 2 - 8)
})

// rayado técnico de sección (misma tinta que la retícula del body)
export const texHatch = (bg = '#0d2140') => canvasTex(256, 256, (c, w, h) => {
  c.fillStyle = bg
  c.fillRect(0, 0, w, h)
  c.strokeStyle = 'rgba(62,139,255,0.14)'
  c.lineWidth = 1.25
  for (let i = -h; i < w; i += 24) {
    c.beginPath(); c.moveTo(i, 0); c.lineTo(i + h, h); c.stroke()
  }
})

// retícula de mesa = misma lengua que el body CSS (--bg + grid 48px)
export const texGrid = () => canvasTex(512, 512, (c, w, h) => {
  c.fillStyle = '#0a1830'
  c.fillRect(0, 0, w, h)
  // velo suave (sin romper el tile)
  const wash = c.createLinearGradient(0, 0, w, h)
  wash.addColorStop(0, 'rgba(13,33,64,0.55)')
  wash.addColorStop(0.45, 'rgba(10,24,48,0)')
  wash.addColorStop(1, 'rgba(6,16,31,0.45)')
  c.fillStyle = wash
  c.fillRect(0, 0, w, h)

  const cells = 8
  const step = w / cells
  // líneas finas — como repeating-linear-gradient del body
  c.strokeStyle = 'rgba(62,139,255,0.1)'
  c.lineWidth = 1
  for (let i = 0; i < cells; i++) {
    const p = i * step + 0.5
    c.beginPath(); c.moveTo(p, 0); c.lineTo(p, h); c.stroke()
    c.beginPath(); c.moveTo(0, p); c.lineTo(w, p); c.stroke()
  }
  // mayores cada 4 celdas (sin strokeRect en el borde: evita doble costura al tilear)
  c.strokeStyle = 'rgba(62,139,255,0.2)'
  c.lineWidth = 1.25
  for (let i = 0; i < 2; i++) {
    const p = i * (w / 2) + 0.5
    c.beginPath(); c.moveTo(p, 0); c.lineTo(p, h); c.stroke()
    c.beginPath(); c.moveTo(0, p); c.lineTo(w, p); c.stroke()
  }
})

export const texShadow = () => canvasTex(128, 128, (c, w, h) => {
  const r = h / 2
  const g = c.createRadialGradient(r, r, 0, r, r, r)
  g.addColorStop(0, 'rgba(3,8,18,0.55)')
  g.addColorStop(0.62, 'rgba(3,8,18,0.26)')
  g.addColorStop(1, 'rgba(3,8,18,0)')
  c.fillStyle = g
  c.fillRect(0, 0, w, h)
})

export const texLogo = (t = 'BOSS') => canvasTex(1024, 300, (c, w, h) => {
  c.clearRect(0, 0, w, h)
  c.fillStyle = '#e9f2fc'
  c.font = `700 190px ${FONT}`
  c.textAlign = 'center'
  c.textBaseline = 'middle'
  c.letterSpacing = '30px'
  c.fillText(t, w / 2 - 15, h / 2)
  c.fillStyle = '#3e8bff'
  c.beginPath()
  c.arc(w / 2 + 330, h / 2 + 52, 26, 0, Math.PI * 2)
  c.fill()
})

export const texSign = (t = 'BOSS') => canvasTex(1024, 280, (c, w, h) => {
  c.fillStyle = '#0c1c34'
  c.fillRect(0, 0, w, h)
  c.strokeStyle = '#63c6ff'
  c.lineWidth = 10
  c.strokeRect(14, 14, w - 28, h - 28)
  c.fillStyle = '#e9f2fc'
  c.font = `700 170px ${FONT}`
  c.textAlign = 'center'
  c.textBaseline = 'middle'
  c.letterSpacing = '26px'
  c.fillText(t, w / 2 - 13, h / 2 + 6)
  c.fillStyle = '#3e8bff'
  c.fillRect(64, h - 44, w - 128, 12)
})

export const texBlueprint = () => canvasTex(512, 512, (c, w, h) => {
  // holograma de plano: misma mesa + linework fino (sin neon grueso)
  c.fillStyle = '#0a1830'
  c.fillRect(0, 0, w, h)
  c.strokeStyle = 'rgba(62,139,255,0.1)'
  c.lineWidth = 1
  for (let i = 0; i <= 16; i++) {
    const p = (i / 16) * w + 0.5
    c.beginPath(); c.moveTo(p, 0); c.lineTo(p, h); c.stroke()
    c.beginPath(); c.moveTo(0, p); c.lineTo(w, p); c.stroke()
  }
  c.strokeStyle = 'rgba(62,139,255,0.55)'
  c.lineWidth = 1.5
  c.strokeRect(56, 56, w - 112, h - 112)
  c.strokeStyle = 'rgba(99,198,255,0.5)'
  c.lineWidth = 1.25
  c.beginPath(); c.arc(180, 180, 58, 0, Math.PI * 2); c.stroke()
  c.beginPath(); c.arc(340, 210, 36, 0, Math.PI * 2); c.stroke()
  c.beginPath(); c.moveTo(238, 180); c.lineTo(304, 210); c.stroke()
  c.strokeRect(120, 300, 140, 90)
  c.strokeRect(320, 320, 84, 110)
  c.beginPath(); c.moveTo(56, 400); c.bezierCurveTo(160, 380, 260, 440, 440, 400); c.stroke()
  c.fillStyle = '#3e8bff'
  for (const [x, y] of [[120, 300], [260, 300], [320, 320], [404, 320]]) {
    c.beginPath(); c.arc(x, y, 3, 0, Math.PI * 2); c.fill()
  }
  c.fillStyle = 'rgba(233,242,252,0.72)'
  c.font = `500 18px ${MONO}`
  c.fillText('PLANTA BAJA · RED HIDRÁULICA', 68, 88)
})

export const texGantt = () => canvasTex(512, 320, (c, w, h) => {
  c.fillStyle = '#0a1830'
  c.fillRect(0, 0, w, h)
  c.strokeStyle = 'rgba(62,139,255,0.1)'
  c.lineWidth = 1
  for (let i = 0; i <= 10; i++) {
    const p = (i / 10) * w + 0.5
    c.beginPath(); c.moveTo(p, 0); c.lineTo(p, h); c.stroke()
  }
  for (let i = 1; i < 6; i++) {
    const p = (i / 6) * h + 0.5
    c.beginPath(); c.moveTo(0, p); c.lineTo(w, p); c.stroke()
  }
  const bars = [[48, 140, 28], [78, 220, 56], [118, 160, 40], [158, 200, 72], [198, 120, 100], [238, 180, 48]]
  bars.forEach(([y, w2, x], k) => {
    c.fillStyle = k % 2 === 0 ? 'rgba(62,139,255,0.75)' : 'rgba(99,198,255,0.45)'
    c.fillRect(x, y, w2, 12)
  })
  c.fillStyle = 'rgba(233,242,252,0.78)'
  c.font = `500 16px ${MONO}`
  c.fillText('PROGRAMA DE OBRA', 22, 24)
})

export const texWave = () => canvasTex(512, 256, (c, w, h) => {
  c.fillStyle = '#0c1c34'
  c.fillRect(0, 0, w, h)
  c.strokeStyle = 'rgba(99,198,255,0.16)'
  for (let i = 0; i <= 12; i++) {
    const p = (i / 12) * w
    c.beginPath(); c.moveTo(p, 0); c.lineTo(p, h); c.stroke()
  }
  for (let i = 0; i <= 6; i++) {
    const p = (i / 6) * h
    c.beginPath(); c.moveTo(0, p); c.lineTo(w, p); c.stroke()
  }
  c.strokeStyle = '#63c6ff'
  c.lineWidth = 4
  c.beginPath()
  c.moveTo(0, h / 2)
  for (let x = 0; x <= w; x += 4) {
    const spike = (Math.floor(x / 90) % 2 === 0) ? 0 : -1
    const y = h / 2 + spike * 60 * Math.exp(-((x % 90 - 45) ** 2) / 300) + 14 * Math.sin(x / 30)
    c.lineTo(x, y)
  }
  c.stroke()
  c.fillStyle = '#e9f2fc'
  c.font = `500 20px ${MONO}`
  c.fillText('GEÓFONO · A-12', 20, 34)
})

// feed de video inspección (pantalla del operador)
export const texCam = () => canvasTex(512, 320, (c, w, h) => {
  c.fillStyle = '#0d1f38'
  c.fillRect(0, 0, w, h)
  c.strokeStyle = 'rgba(99,198,255,0.5)'
  c.lineWidth = 2
  c.beginPath(); c.arc(w / 2, h / 2, 110, 0, Math.PI * 2); c.stroke()
  c.beginPath(); c.arc(w / 2, h / 2, 58, 0, Math.PI * 2); c.stroke()
  c.beginPath(); c.moveTo(w / 2 - 132, h / 2); c.lineTo(w / 2 + 132, h / 2); c.stroke()
  c.beginPath(); c.moveTo(w / 2, h / 2 - 132); c.lineTo(w / 2, h / 2 + 132); c.stroke()
  c.fillStyle = 'rgba(62,139,255,0.32)'
  c.beginPath(); c.ellipse(w * 0.62, h * 0.42, 72, 40, 0.3, 0, Math.PI * 2); c.fill()
  c.strokeStyle = '#63c6ff'
  c.lineWidth = 4
  for (const [x, y, dx, dy] of [[40, 40, 1, 1], [w - 40, 40, -1, 1], [40, h - 40, 1, -1], [w - 40, h - 40, -1, -1]]) {
    c.beginPath(); c.moveTo(x + dx * 36, y); c.lineTo(x, y); c.lineTo(x, y + dy * 36); c.stroke()
  }
  c.strokeStyle = 'rgba(62,139,255,0.55)'
  c.lineWidth = 6
  for (let i = 0; i < 7; i++) {
    const yy = 96 + i * 24
    c.beginPath(); c.moveTo(20, yy); c.lineTo(20 + ((i * 19) % 58) + 18, yy); c.stroke()
  }
  c.fillStyle = '#e9f2fc'
  c.font = `600 20px ${MONO}`
  c.fillText('CAM 02 · Ø36" PVC', 40, 54)
  c.fillStyle = 'rgba(159,182,216,0.9)'
  c.font = `500 16px ${MONO}`
  c.fillText('PUNTO 04 · 12.4 m', w - 216, h - 30)
})

// piel interior/exterior de tubería: soldaduras, uniones y remaches pintados
export const texTube = () => canvasTex(1024, 256, (c, w, h) => {
  c.fillStyle = '#c3d8ef'
  c.fillRect(0, 0, w, h)
  c.fillStyle = 'rgba(13,31,56,0.07)'
  c.fillRect(0, 0, w, 42)
  c.fillRect(0, h - 42, w, 42)
  c.strokeStyle = 'rgba(42,95,158,0.32)'
  c.lineWidth = 3
  for (let x = 0; x <= w; x += 256) {
    c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke()
  }
  c.strokeStyle = 'rgba(42,95,158,0.45)'
  c.lineWidth = 6
  c.beginPath(); c.moveTo(0, h / 2); c.lineTo(w, h / 2); c.stroke()
  c.lineWidth = 3
  c.beginPath(); c.moveTo(0, h / 4); c.lineTo(w, h / 4); c.stroke()
  c.beginPath(); c.moveTo(0, h * 0.75); c.lineTo(w, h * 0.75); c.stroke()
  c.fillStyle = 'rgba(94,123,160,0.55)'
  for (let x = 32; x < w; x += 64) for (const yy of [h / 4, h / 2, h * 0.75]) {
    c.beginPath(); c.arc(x, yy, 3, 0, Math.PI * 2); c.fill()
  }
})

export const texChart = () => canvasTex(512, 320, (c, w, h) => {
  c.fillStyle = '#0c1c34'
  c.fillRect(0, 0, w, h)
  c.strokeStyle = 'rgba(99,198,255,0.16)'
  for (let i = 0; i <= 12; i++) {
    const p = (i / 12) * w
    c.beginPath(); c.moveTo(p, 0); c.lineTo(p, h); c.stroke()
  }
  c.beginPath(); c.moveTo(0, h * 0.72); c.lineTo(w, h * 0.72); c.stroke()
  c.strokeStyle = '#63c6ff'
  c.lineWidth = 4
  c.beginPath()
  const pts = []
  for (let x = 0; x <= w; x += 8) pts.push([x, h * 0.72 - (Math.sin(x / 70) * 34 + Math.sin(x / 23) * 14)])
  pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)))
  c.stroke()
  c.fillStyle = '#3e8bff'
  pts.filter((_, i) => i % 8 === 0).forEach(([x, y]) => { c.beginPath(); c.arc(x, y, 5, 0, Math.PI * 2); c.fill() })
  c.fillStyle = '#e9f2fc'
  c.font = `500 20px ${MONO}`
  c.fillText('NIVEL FREÁTICO · m', 20, 32)
})

export const texCheck = () => canvasTex(512, 384, (c, w, h) => {
  c.fillStyle = '#0c1c34'
  c.fillRect(0, 0, w, h)
  c.fillStyle = '#e9f2fc'
  c.font = `600 26px ${MONO}`
  c.fillText('LISTA DE MANTENIMIENTO', 28, 44)
  c.strokeStyle = 'rgba(99,198,255,0.3)'
  c.beginPath(); c.moveTo(24, 62); c.lineTo(w - 24, 62); c.stroke()
  const items = ['Bomba principal', 'Sello mecánico', 'Alineación', 'Válvula de pie', 'Tablero de control', 'Prueba de arranque']
  items.forEach((it, i) => {
    const y = 108 + i * 44
    c.strokeStyle = '#63c6ff'
    c.lineWidth = 5
    if (i < 4) {
      c.beginPath(); c.moveTo(34, y - 4); c.lineTo(48, y + 10); c.lineTo(74, y - 18); c.stroke()
    } else {
      c.strokeRect(34, y - 18, 40, 40)
    }
    c.fillStyle = '#9fb6d8'
    c.font = `500 24px ${MONO}`
    c.fillText(it, 96, y + 8)
  })
})

// ---------- componentes ----------

// sombra suave tipo "blob"
export function blob(parent, x, z, w, d, y = 0.02) {
  const t = texShadow()
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(w, d),
    new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false })
  )
  if (!t) m.material.color.set(0x20293a), (m.material.map = null), (m.material.opacity = 0.08), (m.material.transparent = true)
  m.rotation.x = -Math.PI / 2
  m.position.set(x, y, z)
  parent.add(m)
  return m
}

// persona iso: silueta vectorial dibujada (canvas), estilo iso-figures.
// Un sprite plano que siempre mira a cámara — cero geometría modelada.
const personTexCache = new Map()
function cssHex(c0, mult = 1) {
  const col = new THREE.Color(c0)
  if (mult !== 1) col.multiplyScalar(mult)
  return `#${col.getHexString()}`
}
function capsule2d(c, x1, y1, x2, y2, r) {
  c.beginPath()
  c.moveTo(x1 - r, y1); c.lineTo(x1 + r, y1); c.lineTo(x2 + r, y2); c.lineTo(x2 - r, y2)
  c.closePath(); c.fill()
  c.beginPath(); c.arc(x1, y1, r, 0, Math.PI * 2); c.fill()
  c.beginPath(); c.arc(x2, y2, r, 0, Math.PI * 2); c.fill()
}
function limb2d(c, x1, y1, len, ang, r) {
  capsule2d(c, x1, y1, x1 + Math.sin(ang) * len, y1 + Math.cos(ang) * len, r)
}
function rr2d(c, x, y, w, h, r) {
  c.beginPath()
  if (c.roundRect) c.roundRect(x, y, w, h, r)
  else c.rect(x, y, w, h)
  c.fill()
}
export function texPerson(suit, helmet, vest, pose) {
  const key = `${suit}|${helmet}|${vest}|${pose}`
  if (personTexCache.has(key)) return personTexCache.get(key)
  const t = canvasTex(96, 192, (c) => {
    const body = cssHex(suit)
    const bodyDark = cssHex(suit, 0.72)
    const face = cssHex(suit, 1.28)
    const hat = cssHex(helmet)
    const vestC = cssHex(vest)
    const ink = '#131f33'
    const cyan = '#63c6ff'
    c.lineJoin = 'round'
    const arm = (sx, sy, len, ang, w = 6.5) => {
      c.fillStyle = body
      limb2d(c, sx, sy, len, ang, w)
    }
    const leg = (hx, hy, len, ang, w = 7.5) => {
      c.fillStyle = bodyDark
      limb2d(c, hx, hy, len, ang, w)
      c.fillStyle = ink // zapato
      c.beginPath()
      c.arc(hx + Math.sin(ang) * len + 3, hy + Math.cos(ang) * len, 4, 0, Math.PI * 2)
      c.fill()
    }
    // ---------- torso (con inclinación por pose) ----------
    const tilt = pose === 4 ? 0.16 : 0
    c.save()
    c.translate(48, 118)
    c.rotate(tilt)
    c.fillStyle = body
    rr2d(c, -23, -32, 46, 46, 13) // pecho
    // chaleco reflectante
    if (vest !== false && vest != null) {
      c.fillStyle = vestC
      rr2d(c, -23, -20, 46, 13, 6)
      c.fillStyle = '#e9f2fc'
      rr2d(c, -23, -20, 46, 3.5, 2)
    }
    c.restore()

    // ---------- piernas ----------
    if (pose === 0) {          // caminando
      leg(40, 114, 60, -0.22); leg(56, 114, 60, 0.22)
    } else if (pose === 4) {   // rodilla en tierra
      c.fillStyle = bodyDark
      capsule2d(c, 44, 114, 44, 170, 7.5)                       // izquierda al suelo
      capsule2d(c, 54, 116, 76, 132, 7.5)                       // muslo derecho al frente
      capsule2d(c, 76, 132, 76, 174, 7.5)                       // espinilla derecha
      c.fillStyle = ink; c.beginPath(); c.arc(47, 170, 4, 0, Math.PI * 2); c.fill()
      c.beginPath(); c.arc(76, 174, 4, 0, Math.PI * 2); c.fill()
    } else {
      leg(41, 114, 62, 0.07); leg(55, 114, 62, -0.07)
    }

    // ---------- brazos + utilería ----------
    if (pose === 0) {          // braceo
      arm(26, 92, 44, 0.5); arm(70, 92, 44, -0.5)
    } else if (pose === 2) {   // tablet
      arm(26, 92, 44, 0.1)
      const fa = -Math.PI / 2 + 0.25
      arm(70, 92, 20, -1.35)
      const ex = 70 + Math.sin(-1.35) * 20, ey = 92 + Math.cos(-1.35) * 20
      arm(ex, ey, 24, fa)
      const hx = ex + Math.sin(fa) * 24, hy = ey + Math.cos(fa) * 24
      c.fillStyle = ink; rr2d(c, hx - 12, hy - 16, 24, 17, 3)
      c.fillStyle = cyan; rr2d(c, hx - 10, hy - 14, 20, 13, 2)
    } else if (pose === 3) {   // paleta de tránsito
      arm(26, 92, 40, 0.1)
      arm(70, 92, 30, -1.25)
      const hx = 70 + Math.sin(-1.25) * 30, hy = 92 + Math.cos(-1.25) * 30
      c.fillStyle = '#3e8bff'; rr2d(c, hx - 4, hy - 24, 9, 26, 3)
      c.fillStyle = '#e9f2fc'; rr2d(c, hx - 2.5, hy - 20, 6, 4, 1.5)
    } else if (pose === 4) {   // brazo al suelo con sensor
      arm(26, 92, 34, 0.95)
      c.fillStyle = body; limb2d(c, 70, 92, 30, 1.15, 6.5)
      c.fillStyle = ink; c.beginPath(); c.arc(58, 148, 5.5, 0, Math.PI * 2); c.fill()
      c.fillStyle = cyan; c.beginPath(); c.arc(58, 148, 3, 0, Math.PI * 2); c.fill()
    } else {                   // de pie
      arm(26, 92, 44, 0.18); arm(70, 92, 44, -0.18)
    }

    // ---------- cabeza + casco ----------
    c.fillStyle = face
    c.beginPath(); c.arc(48, 62, 14, 0, Math.PI * 2); c.fill()
    c.fillStyle = hat
    c.beginPath(); c.arc(48, 50, 17, Math.PI, 0); c.closePath(); c.fill()   // cúpula
    rr2d(c, 31, 48, 34, 5, 2.5)                                             // ala
    c.fillStyle = '#3e8bff'
    c.beginPath(); c.arc(48, 46, 3, 0, Math.PI * 2); c.fill()               // testigo azul
  })
  if (t) { t.minFilter = THREE.LinearFilter; t.magFilter = THREE.LinearFilter; t.generateMipmaps = false }
  personTexCache.set(key, t)
  return t
}

// persona estilizada: silueta plana tipo iso-figures (sin rostro, sin geometría)
export function person(parent, x, z, o = {}) {
  const y0 = o.y ?? 0.22
  const s = o.s ?? 1
  const H = 1.72 * s
  const W = 0.86 * s
  const suit = o.suit ?? PAL.skin
  const helmet = o.helmet ?? PAL.helmet
  const vest = o.vest === false ? null : (o.vest ?? PAL.vest)
  const pose = o.pose ?? Math.abs(Math.round((o.ry ?? 0) * 7)) % 5
  const t = texPerson(suit, helmet, vest, pose)
  const m = new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false, fog: true })
  if (!t) { m.map = null; m.color.set(suit); m.opacity = 0.92 } // fallback headless (smoke)
  const sp = new THREE.Sprite(m)
  sp.position.set(x, y0 + H / 2 + 0.02, z)
  sp.scale.set((o.ry ?? 0) < 0 ? -W : W, H, 1)
  sp.renderOrder = 2
  parent.add(sp)
  blob(parent, x, z, 0.95 * s, 0.95 * s, y0 + 0.01)
  return sp
}

// cono de señalización (base + cuerpo + bandas reflectantes)
export function cone(parent, x, z, s = 1) {
  const g = new THREE.Group()
  g.position.set(x, 0.22, z)
  // base cuadrada antideslizante
  box(g, 0.42 * s, 0.05 * s, 0.42 * s, M.dark(), 0, 0.025 * s, 0)
  box(g, 0.34 * s, 0.03 * s, 0.34 * s, M.white2(), 0, 0.055 * s, 0)
  // cuerpo cónico
  cyl(g, 0.035 * s, 0.18 * s, 0.58 * s, M.white(), 0, 0.36 * s, 0, { seg: 14 })
  // bandas BOSS
  tor(g, 0.14 * s, 0.028 * s, M.red(), 0, 0.22 * s, 0, { rx: Math.PI / 2 })
  tor(g, 0.095 * s, 0.022 * s, M.red(), 0, 0.42 * s, 0, { rx: Math.PI / 2 })
  // tope / ojillo
  cyl(g, 0.04 * s, 0.04 * s, 0.06 * s, M.dark(), 0, 0.68 * s, 0)
  parent.add(g)
  return g
}

// ---------- señalización técnica de obra ----------
// Tonos: info (tablero de obra), warn (aviso ámbar), danger (peligro rojo),
// tag (etiqueta de válvula/tubería en azul de plano).
export function texBoard(lines, o = {}) {
  const arr = Array.isArray(lines) ? lines : [lines]
  const W = o.w ?? 640
  const H = o.h ?? Math.max(210, 128 + arr.length * 58)
  return canvasTex(W, H, (c) => {
    const tone = o.tone ?? 'info'
    const bg = tone === 'warn' ? '#d8a634' : tone === 'danger' ? '#d4533a' : '#0c1f3c'
    const ink = tone === 'info' ? '#eef5ff' : '#15130c'
    const dim = tone === 'info' ? '#9fb6d8' : 'rgba(21,19,12,0.74)'
    const accent = tone === 'info' ? '#3e8bff' : 'rgba(21,19,12,0.82)'
    // cuerpo con degradado
    const g = c.createLinearGradient(0, 0, 0, H)
    g.addColorStop(0, bg)
    g.addColorStop(1, tone === 'info' ? '#08172e' : bg)
    c.fillStyle = g
    c.fillRect(0, 0, W, H)
    // marco doble
    c.strokeStyle = tone === 'info' ? 'rgba(233,242,252,0.9)' : 'rgba(246,239,226,0.9)'
    c.lineWidth = 5
    c.strokeRect(10, 10, W - 20, H - 20)
    c.strokeStyle = tone === 'info' ? 'rgba(233,242,252,0.28)' : 'rgba(246,239,226,0.35)'
    c.lineWidth = 1.5
    c.strokeRect(22, 22, W - 44, H - 44)
    // barra de marca
    c.fillStyle = accent
    c.fillRect(22, 22, W - 44, 36)
    c.textBaseline = 'middle'
    c.fillStyle = tone === 'info' ? '#e9f2fc' : '#f6efe2'
    c.font = `700 19px ${MONO}`
    c.fillText('B O S S', 40, 41)
    const sub = 'INGENIERÍA HIDROSANITARIA'
    c.font = `500 14px ${MONO}`
    c.fillStyle = tone === 'info' ? 'rgba(159,182,216,0.92)' : 'rgba(21,19,12,0.72)'
    c.fillText(sub, W - 40 - c.measureText(sub).width, 41)
    // título + líneas
    c.textBaseline = 'alphabetic'
    c.fillStyle = ink
    c.font = `700 ${arr.length > 2 ? 40 : 46}px ${FONT}`
    c.fillText(arr[0], 40, 124)
    c.fillStyle = dim
    c.font = `500 ${arr.length > 2 ? 24 : 27}px ${MONO}`
    arr.slice(1).forEach((l, i) => c.fillText(l, 40, 124 + (i + 1) * 48))
    // pie
    if (o.foot) {
      c.fillStyle = tone === 'info' ? 'rgba(62,139,255,0.18)' : 'rgba(21,19,12,0.16)'
      c.fillRect(22, H - 64, W - 44, 42)
      c.fillStyle = tone === 'info' ? '#8fd0ff' : '#15130c'
      c.font = `600 20px ${MONO}`
      c.fillText(o.foot.toUpperCase(), 40, H - 36)
    }
    // esquinas
    c.strokeStyle = tone === 'info' ? 'rgba(99,198,255,0.85)' : 'rgba(21,19,12,0.5)'
    c.lineWidth = 4
    const t = 32
    for (const [x, y, dx, dy] of [[18, 18, 1, 1], [W - 18, 18, -1, 1], [18, H - 18, 1, -1], [W - 18, H - 18, -1, -1]]) {
      c.beginPath(); c.moveTo(x + dx * t, y); c.lineTo(x, y); c.lineTo(x, y + dy * t); c.stroke()
    }
  })
}

// tablero con poste (o placa suelta si o.post === false)
export function sign(parent, lines, o = {}) {
  const w = o.w ?? 2.6, h = o.h ?? 1.3
  const g = new THREE.Group()
  g.name = 'sign'
  g.position.set(o.x ?? 0, o.y ?? 0.22, o.z ?? 0)
  g.rotation.y = o.ry ?? 0
  const texOpts = { ...(o.tex ?? {}), tone: o.tone ?? o.tex?.tone, foot: o.foot ?? o.tex?.foot }
  const t = texBoard(lines, texOpts)
  // el tablero se auto-ilumina con su propia textura: legible en penumbra
  const m = t
    ? new THREE.MeshStandardMaterial({
        map: t, emissiveMap: t, emissive: 0xffffff,
        emissiveIntensity: o.lit ?? ((o.tone ?? o.tex?.tone) ? 0.78 : 0.5),
        roughness: 0.55, metalness: 0.05, side: THREE.DoubleSide,
      })
    : M.white2()
  const back = new THREE.Mesh(new THREE.BoxGeometry(w + 0.1, h + 0.1, 0.05), M.metal())
  back.position.set(0, o.post === false ? (o.by ?? 0) : h / 2 + (o.h0 ?? 0.9), -0.08)
  g.add(back)
  const board = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.09), m)
  board.position.y = o.post === false ? (o.by ?? 0) : h / 2 + (o.h0 ?? 0.9)
  edgeBox(g, w, h, 0.14, PAL.padEdge, 0, board.position.y, 0)
  g.add(board)
  if (o.post !== false) {
    for (const s of (o.legs ?? [-1, 1])) {
      cyl(g, 0.055, 0.055, o.h0 ?? 0.9, M.metal(), s * (w / 2 - 0.25), (o.h0 ?? 0.9) / 2, 0)
      cyl(g, 0.16, 0.16, 0.05, M.dark(), s * (w / 2 - 0.25), 0.03, 0)
    }
  }
  parent.add(g)
  return g
}

// etiqueta holográfica con línea guía (anotación técnica flotante)
export function holoTag(parent, text, o = {}) {
  const t = canvasTex(512, 128, (c, w, h) => {
    c.clearRect(0, 0, w, h)
    c.fillStyle = 'rgba(13,31,56,0.86)'
    c.fillRect(2, 2, w - 4, h - 4)
    c.strokeStyle = '#63c6ff'
    c.lineWidth = 3
    c.strokeRect(8, 8, w - 16, h - 16)
    c.fillStyle = '#3e8bff'
    c.fillRect(8, 8, 14, h - 16)
    c.fillStyle = '#e9f2fc'
    c.font = `600 ${o.size ?? 40}px ${MONO}`
    c.fillText(text, 40, h / 2 + (o.size ?? 40) * 0.34)
  })
  const g = holo(parent, o.w ?? 2.4, o.h ?? 0.6, { tex: t, x: o.x, y: o.y, z: o.z, ry: o.ry, tilt: o.tilt, op: o.op ?? 0.95 })
  g.name = 'holotag'
  if (o.lead) {
    const len = o.lead, lx = o.leadX ?? 0, lz = o.leadZ ?? 0
    cyl(g, 0.012, 0.012, len, M.blue(), lx, -len / 2 - (o.h ?? 0.6) / 2, lz)
    tor(g, 0.11, 0.02, M.blue(), lx, -len - (o.h ?? 0.6) / 2, lz, { rx: Math.PI / 2 })
  }
  return g
}

// cinta de precaución entre dos postes (listón de obra)
export function flaggingTape(parent, x, z, len = 6, ry = 0) {
  const g = new THREE.Group()
  g.name = 'tape'
  g.position.set(x, 0.22, z)
  g.rotation.y = ry
  for (const s of [-1, 1]) {
    box(g, 0.12, 0.06, 0.12, M.dark(), s * len / 2, 0.03, 0)
    cyl(g, 0.04, 0.04, 1.2, M.metal(), s * len / 2, 0.62, 0)
    // tope del poste
    cyl(g, 0.06, 0.06, 0.06, M.red(), s * len / 2, 1.24, 0)
  }
  const t = canvasTex(256, 32, (c, w, h) => {
    c.fillStyle = '#d9a742'; c.fillRect(0, 0, w, h)
    c.fillStyle = '#1a1206'
    for (let i = -h; i < w; i += 34) { c.beginPath(); c.moveTo(i, h); c.lineTo(i + 16, 0); c.lineTo(i + 28, 0); c.lineTo(i + 12, h); c.closePath(); c.fill() }
  })
  const m = t ? new THREE.MeshStandardMaterial({ map: t, roughness: 0.85, side: THREE.DoubleSide }) : M.white2()
  for (let i = 0; i < 3; i++) {
    const seg = new THREE.Mesh(new THREE.PlaneGeometry(len / 3, 0.17), m)
    seg.position.set(-len / 2 + len / 6 + (i * len) / 3, 0.95 - (i % 2 === 0 ? 0.03 : 0.08), 0)
    seg.rotation.z = i % 2 === 0 ? 0.02 : -0.03
    g.add(seg)
  }
  parent.add(g)
  return g
}

// extintor con soporte, manguera y manómetro
export function extinguisher(parent, x, z, ry = 0) {
  const g = new THREE.Group()
  g.position.set(x, 0.22, z)
  g.rotation.y = ry
  // soporte mural
  box(g, 0.42, 0.08, 0.22, M.dark(), 0, 0.04, -0.02)
  box(g, 0.08, 0.9, 0.06, M.metal(), 0, 0.5, -0.14)
  cyl(g, 0.17, 0.17, 0.78, M.red(), 0, 0.42, 0)
  // banda de identificación
  box(g, 0.36, 0.12, 0.02, M.white2(), 0, 0.5, 0.175)
  // cuello + manija
  cyl(g, 0.1, 0.06, 0.14, M.metal(), 0, 0.88, 0)
  box(g, 0.22, 0.05, 0.08, M.dark(), 0.08, 0.98, 0)
  // manguera + boquilla
  tube(g, [V(0.12, 0.82, 0.05), V(0.28, 0.55, 0.12), V(0.22, 0.32, 0.08)], 0.035, M.dark())
  cyl(g, 0.05, 0.03, 0.12, M.metal(), 0.22, 0.28, 0.08, { rz: 0.5 })
  // manómetro stub
  cyl(g, 0.04, 0.04, 0.08, M.metal(), -0.14, 0.78, 0.08, { rz: Math.PI / 2 })
  sph(g, 0.055, M.white2(), -0.2, 0.78, 0.08, { sy: 0.55 })
  parent.add(g)
  return g
}

// gabinete contra incendio con manguera enrollada
export function hoseCabinet(parent, x, z, ry = 0) {
  const g = new THREE.Group()
  g.position.set(x, 0.22, z)
  g.rotation.y = ry
  box(g, 1.45, 1.65, 0.48, M.white2(), 0, 0.85, 0)
  edgeBox(g, 1.45, 1.65, 0.48, PAL.metalDark, 0, 0.85, 0)
  // marco interior + cristal
  box(g, 1.2, 1.25, 0.04, M.dark(), 0, 0.88, 0.2)
  plate(g, 1.05, 1.1, M.glass(), 0, 0.88, 0.24)
  box(g, 0.1, 0.28, 0.06, M.metal(), 0.52, 0.88, 0.26)
  // carrete + manguera
  cyl(g, 0.08, 0.08, 0.35, M.metal(), 0, 0.85, 0.02, { rx: Math.PI / 2 })
  tor(g, 0.36, 0.12, M.red(), 0, 0.85, 0.05, { ry: Math.PI / 2, rad: 10, tub: 18 })
  // lanza en cuna
  cyl(g, 0.05, 0.05, 0.55, M.metal(), 0.35, 0.45, 0.12, { rz: 0.9 })
  box(g, 1.55, 0.12, 0.55, M.red(), 0, 0.06, 0)
  box(g, 0.9, 0.22, 0.04, M.red(), 0, 1.72, 0.22)
  // rótulo "FIRE"
  box(g, 0.55, 0.12, 0.03, M.white(), 0, 1.48, 0.26)
  parent.add(g)
  return g
}

// rociador (ramal + cabeza + deflector)
export function sprinkler(parent, x, y, z, ry = 0) {
  const g = new THREE.Group()
  g.position.set(x, y, z)
  g.rotation.y = ry
  cyl(g, 0.05, 0.05, 1.15, M.red(), 0, -0.58, 0)
  cyl(g, 0.09, 0.09, 0.14, M.metal(), 0, -0.05, 0)
  // brazos del frame
  for (const s of [-1, 1]) {
    const arm = box(g, 0.04, 0.22, 0.04, M.metal(), s * 0.1, -0.2, 0)
    arm.rotation.z = s * 0.35
  }
  // deflector
  cyl(g, 0.16, 0.16, 0.03, M.metal(), 0, -0.32, 0)
  tor(g, 0.14, 0.02, M.blue(), 0, -0.28, 0, { rx: Math.PI / 2 })
  parent.add(g)
  return g
}

// base de estación (plinth con bordillo, juntas y drenaje)
export function padStation(parent, w = 28, d = 20) {
  const y0 = 0.22
  box(parent, w, y0, d, mat(PAL.pad, { r: 1, m: 0 }), 0, y0 / 2, 0)
  edgeBox(parent, w, y0, d, PAL.padEdge, 0, y0 / 2, 0)
  // bordillo perimetral
  const bw = 0.22, bh = 0.08
  box(parent, w, bh, bw, M.concreteDark(), 0, y0 + bh / 2, d / 2 - bw / 2)
  box(parent, w, bh, bw, M.concreteDark(), 0, y0 + bh / 2, -d / 2 + bw / 2)
  box(parent, bw, bh, d - bw * 2, M.concreteDark(), w / 2 - bw / 2, y0 + bh / 2, 0)
  box(parent, bw, bh, d - bw * 2, M.concreteDark(), -w / 2 + bw / 2, y0 + bh / 2, 0)
  // juntas de expansión
  for (let i = -1; i <= 1; i += 2) {
    box(parent, 0.04, 0.02, d * 0.7, mat(PAL.padEdge, { r: 1, op: 0.35 }), i * w * 0.22, y0 + 0.01, 0)
  }
  box(parent, w * 0.7, 0.02, 0.04, mat(PAL.padEdge, { r: 1, op: 0.35 }), 0, y0 + 0.01, 0)
  // ranura de drenaje
  box(parent, w * 0.35, 0.03, 0.28, M.dark(), w * 0.28, y0 + 0.02, d * 0.35)
  for (let i = 0; i < 5; i++) box(parent, 0.04, 0.02, 0.26, M.metal(), w * 0.28 - 0.12 + i * 0.06, y0 + 0.035, d * 0.35)
  return y0
}

/** brida con círculo de pernos — agujero local +Z; usar rx/ry/rz para alinear al tubo */
export function flange(parent, x, y, z, o = {}) {
  const r = o.r ?? 0.35
  const g = new THREE.Group()
  g.position.set(x, y, z)
  if (o.rx) g.rotation.x = o.rx
  if (o.ry) g.rotation.y = o.ry
  if (o.rz) g.rotation.z = o.rz
  // torus en XY (agujero +Z)
  tor(g, r, o.t ?? 0.055, o.m ?? M.redDeep(), 0, 0, 0)
  const n = o.bolts ?? 6
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    box(g, 0.055, 0.055, 0.1, M.metal(), Math.cos(a) * r * 0.72, Math.sin(a) * r * 0.72, 0)
  }
  parent.add(g)
  return g
}

/** skid de bomba (motor + acoplamiento + voluta + bridas) */
export function pumpSkid(parent, x, y, z, o = {}) {
  const g = new THREE.Group()
  g.position.set(x, y, z)
  g.rotation.y = o.ry ?? 0
  const s = o.side ?? 1
  box(g, 3.8, 0.14, 2.2, M.concrete(), 0, 0.07, 0)
  edgeBox(g, 3.8, 0.14, 2.2, PAL.padEdge, 0, 0.07, 0)
  box(g, 3.5, 0.18, 1.9, M.steel(), 0, 0.22, 0)
  for (const fz of [-0.7, 0.7]) box(g, 3.5, 0.12, 0.12, M.dark(), 0, 0.35, fz)
  // motor con aletas
  cyl(g, 0.48, 0.48, 1.55, M.white(), -s * 0.75, 0.95, 0, { rz: Math.PI / 2 })
  for (let i = 0; i < 6; i++) box(g, 0.04, 0.65, 0.9, M.white2(), -s * 1.4, 0.95, -0.4 + i * 0.16)
  box(g, 0.38, 0.32, 0.28, M.dark(), -s * 0.75, 1.4, 0.55)
  // acoplamiento + guard
  cyl(g, 0.2, 0.2, 0.38, M.dark(), -s * 0.05, 0.95, 0, { rz: Math.PI / 2 })
  plate(g, 0.5, 0.35, M.metal(), -s * 0.05, 1.2, 0.35, { d: 0.04 })
  // voluta + pies
  sph(g, 0.55, M.red(), s * 0.85, 0.95, 0, { sy: 0.88 })
  for (const fz of [-0.5, 0.5]) box(g, 0.4, 0.22, 0.28, M.metal(), s * 0.85, 0.4, fz)
  // descarga vertical + brida
  cyl(g, 0.2, 0.2, 1.5, M.red(), s * 0.85, 1.9, 0)
  flange(g, s * 0.85, 2.7, 0, { r: 0.28, rx: Math.PI / 2, bolts: 6 })
  // succión
  cyl(g, 0.22, 0.22, 1.1, M.red(), s * 0.85, 0.55, 0.85, { rx: Math.PI / 2 })
  flange(g, s * 0.85, 0.55, 1.4, { r: 0.3, bolts: 6 })
  parent.add(g)
  return g
}

// bloque de suelo en corte (con estratos)
export function soilBlock(parent, w, h, d, x, y, z, o = {}) {
  const layerH = h / PAL.soil.length
  for (let i = 0; i < PAL.soil.length; i++) {
    box(parent, w, layerH, d, M.soil(i), x, y - layerH * (i + 0.5), z)
  }
  edgeBox(parent, w, h, d, o.line ?? PAL.soilLine, x, y - h / 2, z)
}

// cabina / caseta de obra (cimiento, puerta, AC, escalón)
export function cabin(parent, spec = {}) {
  const { w = 4, h = 2.6, d = 2.6, x = 0, y = 0.22, z = 0, ry = 0, winRows = 2, red = true } = spec
  const g = new THREE.Group()
  g.position.set(x, y, z)
  g.rotation.y = ry
  // cimiento / zapata
  box(g, w + 0.35, 0.14, d + 0.35, M.concrete(), 0, 0.07, 0)
  edgeBox(g, w + 0.35, 0.14, d + 0.35, PAL.padEdge, 0, 0.07, 0)
  rbox(g, w, h, d, 0.12, M.white(), 0, h / 2 + 0.14, 0)
  edgeBox(g, w, h, d, PAL.metalDark, 0, h / 2 + 0.14, 0)
  const bodyY = 0.14
  // clerestorio + ventanas
  plate(g, w * 0.86, 0.06, M.dark(), 0, bodyY + h * 0.78, d / 2 + 0.01)
  for (let r = 0; r < winRows; r++) {
    plate(g, w * 0.72, 0.34, M.glass(), 0, bodyY + h * (0.42 + r * 0.16), d / 2 + 0.02)
  }
  // puerta con manija y umbral
  box(g, w * 0.28, h * 0.72, 0.05, M.white2(), -w * 0.28, bodyY + h * 0.36, d / 2 + 0.03)
  box(g, 0.04, 0.1, 0.06, M.metal(), -w * 0.16, bodyY + h * 0.36, d / 2 + 0.07)
  box(g, w * 0.32, 0.06, 0.22, M.concreteDark(), -w * 0.28, bodyY + 0.03, d / 2 + 0.18)
  // ventana lateral
  plate(g, 0.55, 0.45, M.glass(), w / 2 + 0.02, bodyY + h * 0.55, 0, { ry: Math.PI / 2 })
  // unidad AC + chimenea de ventilación
  box(g, w * 0.42, 0.28, 0.55, M.white2(), w * 0.18, bodyY + h + 0.2, -d * 0.1)
  for (let i = 0; i < 4; i++) box(g, w * 0.36, 0.02, 0.02, M.dark(), w * 0.18, bodyY + h + 0.12 + i * 0.06, -d * 0.1 + 0.28)
  cyl(g, 0.1, 0.1, 0.35, M.metal(), -w * 0.3, bodyY + h + 0.3, d * 0.15)
  if (red !== false) box(g, w * 0.99, 0.1, 0.1, M.red(), 0, bodyY + h * 0.12, d / 2 + 0.02)
  // placa BOSS
  box(g, 0.55, 0.18, 0.03, M.red(), w * 0.32, bodyY + h * 0.22, d / 2 + 0.04)
  parent.add(g)
  return g
}

// escalera industrial (pies, peldaños, jaula si es alta)
export function ladder(parent, x, z, h, ry = 0) {
  const g = new THREE.Group()
  g.position.set(x, 0.22, z)
  g.rotation.y = ry
  // pies / anclajes
  for (const s of [-1, 1]) {
    box(g, 0.14, 0.06, 0.22, M.dark(), s * 0.22, 0.03, 0)
    cyl(g, 0.035, 0.035, h, M.metal(), s * 0.22, h / 2, 0)
  }
  for (let yy = 0.4; yy < h; yy += 0.42) {
    cyl(g, 0.03, 0.03, 0.46, M.metal(), 0, yy, 0, { rz: Math.PI / 2 })
    box(g, 0.48, 0.04, 0.1, M.white2(), 0, yy, 0.02)
  }
  // jaula de seguridad en tramos altos
  if (h > 3.5) {
    for (let yy = 2.2; yy < h; yy += 0.9) {
      tor(g, 0.42, 0.03, M.metal(), 0, yy, 0.28, { rx: Math.PI / 2 })
    }
    for (const a of [-0.55, 0, 0.55]) {
      cyl(g, 0.025, 0.025, Math.max(0.5, h - 2), M.metal(), Math.sin(a) * 0.4, 2 + (h - 2) / 2, 0.28 + Math.cos(a) * 0.15)
    }
  }
  parent.add(g)
  return g
}

// manómetro (devuelve aguja para animar)
export function gauge(parent, x, y, z, o = {}) {
  const g = new THREE.Group()
  g.position.set(x, y, z)
  g.rotation.y = o.ry ?? 0
  // niple de conexión
  cyl(g, 0.05, 0.05, 0.22, M.metal(), 0, -0.18, 0)
  cyl(g, 0.08, 0.08, 0.06, M.dark(), 0, -0.06, 0)
  // cuerpo / bisel
  tor(g, 0.28, 0.045, M.metal(), 0, 0, 0.02, { rx: Math.PI / 2 })
  cyl(g, 0.26, 0.26, 0.08, M.white2(), 0, 0, 0.02, { seg: 20 })
  // carátula
  sph(g, 0.22, mat(0xf0f5fb, { r: 0.25 }), 0, 0, 0.06, { sy: 0.35 })
  // marcas de escala
  for (let i = 0; i < 7; i++) {
    const a = -0.9 + i * 0.3
    box(g, 0.02, 0.06, 0.01, M.dark(), Math.sin(a) * 0.16, Math.cos(a) * 0.16, 0.1)
  }
  const needle = box(g, 0.035, 0.2, 0.02, M.red(), 0, 0.06, 0.11)
  needle.rotation.z = o.n0 ?? 0.6
  sph(g, 0.04, M.dark(), 0, 0, 0.12)
  parent.add(g)
  return needle
}

// volante de válvula (cuerpo + vástago + volante)
export function valve(parent, x, y, z, o = {}) {
  const r = o.r ?? 0.34
  const g = new THREE.Group()
  g.position.set(x, y, z)
  // cuerpo / packing
  cyl(g, r * 0.35, r * 0.35, 0.22, M.metal(), 0, -0.18, 0)
  cyl(g, r * 0.18, r * 0.18, 0.28, M.steel(), 0, 0.02, 0)
  // volante
  tor(g, r, 0.045, M.red(), 0, 0.18, 0, { rx: Math.PI / 2 })
  for (let i = 0; i < 4; i++) {
    const sp = box(g, r * 2, 0.035, 0.04, M.red(), 0, 0.18, 0)
    sp.rotation.y = (i * Math.PI) / 4
  }
  // tuerca central
  cyl(g, r * 0.22, r * 0.22, 0.1, M.metal(), 0, 0.18, 0)
  parent.add(g)
  return g
}

// hidrante de columna (base, salidas, tuerca, tapones)
export function hydrant(parent, x, z) {
  const g = new THREE.Group()
  g.position.set(x, 0.22, z)
  // brida de piso
  cyl(g, 0.38, 0.38, 0.1, M.concrete(), 0, 0.05, 0, { seg: 16 })
  tor(g, 0.38, 0.04, M.metal(), 0, 0.1, 0, { rx: Math.PI / 2 })
  // cuerpo
  cyl(g, 0.24, 0.28, 0.22, M.red(), 0, 0.22, 0)
  cyl(g, 0.22, 0.24, 0.85, M.red(), 0, 0.75, 0)
  // cinchos
  for (const yy of [0.45, 0.85, 1.15]) tor(g, 0.245, 0.025, M.redDeep(), 0, yy, 0, { rx: Math.PI / 2 })
  // cúpula + tuerca de operación
  sph(g, 0.22, M.red(), 0, 1.2, 0, { sy: 0.65 })
  cyl(g, 0.08, 0.08, 0.14, M.metal(), 0, 1.38, 0)
  box(g, 0.16, 0.08, 0.08, M.dark(), 0, 1.48, 0)
  // salidas laterales con tapones
  for (const s of [-1, 1]) {
    cyl(g, 0.1, 0.1, 0.38, M.red(), s * 0.28, 0.72, 0, { rz: Math.PI / 2 })
    cyl(g, 0.12, 0.12, 0.08, M.metal(), s * 0.48, 0.72, 0, { rz: Math.PI / 2 })
    // cadena del tapón
    tube(g, [V(s * 0.48, 0.78, 0), V(s * 0.4, 0.95, 0.1), V(s * 0.22, 1.05, 0)], 0.012, M.dark())
  }
  // salida frontal (pumper)
  cyl(g, 0.12, 0.12, 0.32, M.red(), 0, 0.55, 0.28, { rx: Math.PI / 2 })
  cyl(g, 0.14, 0.14, 0.08, M.metal(), 0, 0.55, 0.46, { rx: Math.PI / 2 })
  parent.add(g)
  return g
}

// flotante de partículas determinista
export function cloud(parent, count, o = {}) {
  const pos = new Float32Array(count * 3).fill(-999)
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  const m = new THREE.PointsMaterial({
    size: o.size ?? 0.14,
    color: o.color ?? 0x3e8bff,
    transparent: true,
    opacity: o.opacity ?? 0.85,
    depthWrite: false,
  })
  const pts = new THREE.Points(geo, m)
  pts.frustumCulled = false
  parent.add(pts)
  return { pts, pos, geo, m }
}

export const cyc = (t, speed, phase) => ((t * speed + phase) % 1 + 1) % 1

// chispas de soldadura (parábolas deterministas)
export function sparks(parent, o) {
  const n = o.count ?? 60
  const cl = cloud(parent, n, { size: o.size ?? 0.12, color: o.color ?? 0x9fe8ff, opacity: 0.95 })
  const ph = [], vx = [], vy = [], vz = []
  for (let i = 0; i < n; i++) {
    ph.push(Math.random())
    vx.push((Math.random() - 0.5) * 2.4)
    vy.push(1.4 + Math.random() * 2.4)
    vz.push((Math.random() - 0.5) * 2.4)
  }
  const up = (t) => {
    const { pos } = cl
    for (let i = 0; i < n; i++) {
      const p = cyc(t, o.rate ?? 0.55, ph[i])
      const tt = p * 1.15
      pos[i * 3] = o.x + vx[i] * tt
      pos[i * 3 + 1] = o.y + vy[i] * tt - 4.4 * tt * tt
      pos[i * 3 + 2] = o.z + vz[i] * tt
      if (p > 0.86) pos[i * 3 + 1] = -999
      else if (o.floor !== undefined && pos[i * 3 + 1] < o.floor) pos[i * 3 + 1] = -999
    }
    cl.geo.attributes.position.needsUpdate = true
  }
  return up
}

// ---------- utilería de obra (props isométricos reutilizables) ----------

/** pozo de visita con tapa (abierta o cerrada) */
export function manhole(parent, x, z, o = {}) {
  const r = o.r ?? 0.72
  const g = new THREE.Group()
  g.position.set(x, o.y ?? 0.22, z)
  // collar de concreto + anillos
  cyl(g, r + 0.18, r + 0.22, 0.16, M.concrete(), 0, 0.02, 0, { seg: 20 })
  tor(g, r + 0.05, 0.08, M.concreteDark(), 0, 0.1, 0, { rx: Math.PI / 2 })
  cyl(g, r * 0.88, r * 0.88, 0.05, mat(PAL.dark, { r: 0.95 }), 0, 0.04, 0)
  const makeLid = (lx, ly, lz, tilt = 0) => {
    const lid = cyl(g, r, r, 0.08, M.metal(), lx, ly, lz, { seg: 20 })
    lid.rotation.z = tilt
    // chevrones + orificios de izaje
    for (const s of [-1, 1]) {
      const ch = box(g, 0.08, 0.02, r * 0.9, M.red(), lx + s * 0.12, ly + 0.05, lz)
      ch.rotation.y = s * 0.35
      if (tilt) ch.rotation.z = tilt
    }
    for (const a of [0.6, -0.6]) cyl(g, 0.04, 0.04, 0.06, M.dark(), lx + Math.cos(a) * r * 0.55, ly + 0.06, lz + Math.sin(a) * r * 0.55)
    return lid
  }
  if (o.open !== false) makeLid(o.lidX ?? 1.1, 0.08, o.lidZ ?? 0.9, o.tilt ?? 0.08)
  else makeLid(0, 0.1, 0, 0)
  parent.add(g)
  return g
}

/** tarima con tubería o material */
export function pallet(parent, x, y, z, o = {}) {
  const g = new THREE.Group()
  g.position.set(x, y, z)
  g.rotation.y = o.ry ?? 0
  const w = o.w ?? 2.2, d = o.d ?? 1.4
  // tablones
  for (let i = 0; i < 5; i++) box(g, w, 0.06, 0.18, M.concreteDark(), 0, 0.1, -d / 2 + 0.15 + i * ((d - 0.3) / 4))
  for (const s of [-0.5, 0, 0.5]) box(g, 0.14, 0.12, d, M.concrete(), s * (w / 2 - 0.2), 0.04, 0)
  // flejes
  for (const s of [-0.6, 0.6]) box(g, 0.04, 0.04, d * 0.9, M.metal(), s, 0.14, 0)
  const n = o.pipes ?? 3
  const pr = o.pr ?? 0.18
  for (let i = 0; i < n; i++) {
    const yy = 0.28 + i * (pr * 2.05)
    const zz = (i - (n - 1) / 2) * (pr * 2.1)
    cyl(g, pr, pr, w * 0.85, o.pm ?? M.white(), 0, yy, zz, { rz: Math.PI / 2 })
    // tapas / bridas de extremo
    for (const sx of [-1, 1]) {
      tor(g, pr + 0.02, 0.03, M.redDeep(), sx * w * 0.4, yy, zz, { ry: Math.PI / 2 })
    }
  }
  parent.add(g)
  return g
}

/** caja de herramientas abierta */
export function toolbox(parent, x, y, z, o = {}) {
  const g = new THREE.Group()
  g.position.set(x, y, z)
  g.rotation.y = o.ry ?? 0
  box(g, 0.9, 0.4, 0.52, M.red(), 0, 0.2, 0)
  edgeBox(g, 0.9, 0.4, 0.52, PAL.metalDark, 0, 0.2, 0)
  // asa + pestillo
  tor(g, 0.14, 0.025, M.metal(), 0, 0.42, 0, { rx: Math.PI / 2, arc: Math.PI })
  box(g, 0.12, 0.06, 0.04, M.dark(), 0.38, 0.32, 0.28)
  box(g, 0.86, 0.04, 0.48, M.redDeep(), 0, 0.42, -0.04)
  const lid = box(g, 0.9, 0.04, 0.52, M.red(), 0, 0.66, -0.3)
  lid.rotation.x = -1.05
  // bandeja + herramientas
  box(g, 0.78, 0.03, 0.4, M.dark(), 0, 0.24, 0.02)
  for (let i = 0; i < 3; i++) box(g, 0.1, 0.08, 0.32, M.metal(), -0.24 + i * 0.22, 0.3, 0.02)
  cyl(g, 0.03, 0.03, 0.28, M.steel(), 0.28, 0.32, 0.02, { rz: 0.3 })
  parent.add(g)
  return g
}

/** tablero / arrancador eléctrico de campo */
export function fieldPanel(parent, x, y, z, o = {}) {
  const w = o.w ?? 1.1, h = o.h ?? 1.6
  const g = new THREE.Group()
  g.position.set(x, y, z)
  g.rotation.y = o.ry ?? 0
  box(g, w, h, 0.48, M.metal(), 0, h / 2, 0)
  edgeBox(g, w, h, 0.48, PAL.metalDark, 0, h / 2, 0)
  // puerta con junta y cerradura
  box(g, w * 0.88, h * 0.82, 0.04, M.dark(), 0, h / 2, 0.26)
  box(g, 0.03, h * 0.7, 0.02, M.metal(), w * 0.38, h / 2, 0.29)
  box(g, 0.1, 0.14, 0.06, M.white2(), w * 0.32, h / 2, 0.3)
  // breakers + placa
  for (let i = 0; i < 6; i++) {
    box(g, 0.14, 0.1, 0.05, i % 2 ? M.red() : M.white2(), -0.22 + (i % 2) * 0.28, 0.45 + Math.floor(i / 2) * 0.32, 0.3)
  }
  box(g, w * 0.5, 0.12, 0.03, M.red(), 0, h - 0.2, 0.28)
  // conduit stub
  cyl(g, 0.06, 0.06, 0.35, M.dark(), 0, h + 0.1, -0.1)
  const led = sph(g, 0.04, mat(PAL.red, { r: 0.3, e: PAL.red, ei: 0.9 }), 0.3, h - 0.35, 0.3)
  parent.add(g)
  return { g, led }
}

/** tambor / bidón (químico, pintura, abrasivo) */
export function drum(parent, x, y, z, o = {}) {
  const r = o.r ?? 0.38, h = o.h ?? 0.95
  const g = new THREE.Group()
  g.position.set(x, y, z)
  cyl(g, r, r, h, o.m ?? M.white2(), 0, h / 2, 0, { seg: 16 })
  tor(g, r, 0.03, M.red(), 0, h * 0.72, 0, { rx: Math.PI / 2 })
  tor(g, r, 0.03, M.metal(), 0, h * 0.28, 0, { rx: Math.PI / 2 })
  // tapa + tapón
  cyl(g, r * 0.95, r * 0.95, 0.04, M.metal(), 0, h + 0.02, 0)
  cyl(g, 0.06, 0.06, 0.08, M.dark(), r * 0.35, h + 0.06, 0)
  // etiqueta
  box(g, r * 1.2, 0.22, 0.02, M.red(), 0, h * 0.55, r + 0.01)
  parent.add(g)
  return g
}

/** carrete de cable / manguera */
export function reel(parent, x, y, z, o = {}) {
  const r = o.r ?? 0.55
  const g = new THREE.Group()
  g.position.set(x, y, z)
  g.rotation.y = o.ry ?? 0
  // bastidor A
  for (const s of [-1, 1]) {
    box(g, 0.08, r * 1.6, 0.08, M.metal(), s * 0.55, r * 0.7, -0.35)
    box(g, 0.08, r * 1.6, 0.08, M.metal(), s * 0.55, r * 0.7, 0.35)
  }
  box(g, 1.2, 0.08, 0.8, M.dark(), 0, 0.04, 0)
  for (const s of [-1, 1]) cyl(g, r, r, 0.1, M.metal(), s * 0.42, r, 0, { rx: Math.PI / 2 })
  cyl(g, 0.12, 0.12, 0.9, M.dark(), 0, r, 0, { rx: Math.PI / 2 })
  tor(g, r * 0.75, 0.08, o.hose ?? M.red(), 0.15, r, 0.2, { ry: Math.PI / 2 })
  // manivela
  cyl(g, 0.04, 0.04, 0.35, M.metal(), 0.55, r, 0.5, { rz: Math.PI / 2 })
  box(g, 0.08, 0.2, 0.08, M.dark(), 0.75, r, 0.5)
  parent.add(g)
  return g
}

/** estación total / trípode de topografía */
export function surveyTripod(parent, x, z, o = {}) {
  const g = new THREE.Group()
  g.position.set(x, o.y ?? 0.22, z)
  for (let i = 0; i < 3; i++) {
    const a = i * 2.094
    const leg = cyl(g, 0.03, 0.03, 1.7, M.metal(), Math.cos(a) * 0.42, 0.85, Math.sin(a) * 0.42)
    leg.rotation.z = -Math.cos(a) * 0.28
    leg.rotation.x = Math.sin(a) * 0.28
    box(g, 0.1, 0.04, 0.14, M.dark(), Math.cos(a) * 0.55, 0.02, Math.sin(a) * 0.55)
  }
  box(g, 0.32, 0.24, 0.32, M.white(), 0, 1.75, 0)
  edgeBox(g, 0.32, 0.24, 0.32, PAL.metalDark, 0, 1.75, 0)
  cyl(g, 0.06, 0.08, 0.28, M.dark(), 0.2, 1.75, 0, { rz: Math.PI / 2 })
  // ocular
  cyl(g, 0.05, 0.05, 0.12, M.metal(), 0.36, 1.75, 0, { rz: Math.PI / 2 })
  parent.add(g)
  return g
}

/** botellas de gas (oxiacetileno / argon) */
export function gasBottles(parent, x, y, z, o = {}) {
  const g = new THREE.Group()
  g.position.set(x, y, z)
  g.rotation.y = o.ry ?? 0
  const n = o.n ?? 2
  const colors = [M.red(), M.white2(), M.dark()]
  // rack + cadena
  box(g, n * 0.42 + 0.3, 0.08, 0.5, M.dark(), (n - 1) * 0.19, 0.04, 0)
  box(g, n * 0.42 + 0.2, 0.06, 0.06, M.metal(), (n - 1) * 0.19, 0.85, -0.2)
  for (let i = 0; i < n; i++) {
    const xx = i * 0.38
    cyl(g, 0.16, 0.16, 1.15, colors[i % 3], xx, 0.58, 0)
    sph(g, 0.16, colors[i % 3], xx, 1.2, 0, { sy: 0.45 })
    cyl(g, 0.04, 0.04, 0.18, M.metal(), xx, 1.35, 0)
    // regulador
    box(g, 0.12, 0.14, 0.1, M.metal(), xx + 0.12, 1.28, 0.08)
    sph(g, 0.05, M.white2(), xx + 0.18, 1.32, 0.12, { sy: 0.5 })
    tube(g, [V(xx + 0.12, 0.9, -0.15), V(xx + 0.05, 0.85, -0.2), V(xx - 0.05, 0.85, -0.2)], 0.015, M.dark())
  }
  parent.add(g)
  return g
}

// panel informativo (azul plano)
export function holo(parent, w, h, o) {
  let m
  if (o.tex) {
    m = new THREE.MeshStandardMaterial({ map: o.tex, transparent: true, opacity: o.op ?? 0.92, roughness: 0.4, side: THREE.DoubleSide, depthWrite: false })
  } else {
    m = new THREE.MeshStandardMaterial({ color: PAL.blue, transparent: true, opacity: (o.op ?? 0.92) * 0.85, roughness: 0.4, side: THREE.DoubleSide, depthWrite: false })
  }
  const g = new THREE.Group()
  g.position.set(o.x ?? 0, o.y ?? 0, o.z ?? 0)
  g.rotation.y = o.ry ?? 0
  if (o.tilt) g.rotation.x = o.tilt
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.06), m)
  g.add(mesh)
  g.material = m // comodín: los animadores ajustan opacidad aquí
  // marco fino (accent suave, no neon)
  const fr = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, 0.07)),
    new THREE.LineBasicMaterial({ color: PAL.red, transparent: true, opacity: 0.45 }),
  )
  g.add(fr)
  parent.add(g)
  return g
}
