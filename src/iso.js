// ============================================================
// iso.js — anexos isométricos por estación
// Vocabulario de diorama (casas, torres, árboles, figuras,
// luminarias, tanques…) al estilo de las maquetas iso:
// cajas redondeadas chunky, techos planos con utilería,
// azulejos de base con ticks de esquina y sombras suaves.
// Cada estación recibe detalle temático en sus cuatro flancos
// sin tapar al sujeto (frente de cámara = solo props bajos).
// ============================================================

import * as THREE from 'three'
import * as K from './kit.js'

const { V, box, rbox, cyl, sph, tor, plate, edgeBox, person, cone, ladder, gauge, valve, blob, mat, M, PAL } = K

// materiales propios del kit iso (compartidos vía cache de kit)
export const lampMat = mat(PAL.blue, { r: 0.4, e: PAL.blue, ei: 0.9 })
export const tipMat = mat(PAL.red, { r: 0.4, e: PAL.red, ei: 1.0 })
const markMat = mat(PAL.blue, { r: 0.4, e: PAL.blue, ei: 0.8 })

// ---------- vocabulario de diorama ----------

// azulejo de base con ticks de esquina (estética de marca de registro)
export function tile(g, x, z, w, d) {
  rbox(g, w, 0.14, d, 0.05, M.slab(), x, 0.22 + 0.07, z)
  edgeBox(g, w, 0.14, d, PAL.padEdge, x, 0.22 + 0.07, z)
  return 0.22 + 0.14
}

// casa chunky de techo plano con utilería de azotea
// variant: 0 = AC + parapeto · 1 = tinaco · 2 = antena
export function house(g, x, z, o = {}) {
  const w = o.w ?? 3.4, h = o.h ?? 3.2, d = o.d ?? 3.0, y = o.y ?? 0.36
  const gr = new THREE.Group()
  gr.position.set(x, y, z)
  gr.rotation.y = o.ry ?? 0
  box(gr, w + 0.25, 0.12, d + 0.25, M.concrete(), 0, 0.06, 0)
  rbox(gr, w, h, d, 0.14, M.white(), 0, h / 2 + 0.12, 0)
  edgeBox(gr, w, h, d, PAL.metalDark, 0, h / 2 + 0.12, 0)
  const by = 0.12
  // ventanas en rejilla
  for (let c = 0; c < 3; c++) {
    plate(gr, w * 0.2, 0.38, M.glass(), (c - 1) * w * 0.28, by + h * 0.58, d / 2 + 0.02)
  }
  box(gr, w * 0.8 + 0.1, 0.05, 0.1, M.white2(), 0, by + h * 0.38, d / 2 + 0.05)
  box(gr, 0.75, 1.2, 0.06, M.dark(), -w * 0.26, by + 0.6, d / 2 + 0.02)
  box(gr, 0.04, 0.12, 0.03, M.white2(), -w * 0.26 + 0.28, by + 0.65, d / 2 + 0.06)
  box(gr, 0.95, 0.1, 0.55, M.concrete(), -w * 0.26, by + 0.05, d / 2 + 0.22)
  box(gr, w + 0.3, 0.18, d + 0.3, M.white2(), 0, by + h + 0.09, 0)
  box(gr, w * 0.99, 0.09, 0.09, M.red(), 0, by + h * 0.16, d / 2 + 0.03)
  plate(gr, 0.45, 0.35, M.glass(), w / 2 + 0.02, by + h * 0.55, 0, { ry: Math.PI / 2 })
  cyl(gr, 0.06, 0.06, 0.5, M.metal(), w * 0.34, by + h + 0.4, -d * 0.34)
  const v = o.variant ?? 0
  if (v === 0) {
    box(gr, 0.75, 0.42, 0.65, M.metal(), w * 0.24, by + h + 0.4, -d * 0.16)
    for (let i = 0; i < 4; i++) box(gr, 0.65, 0.02, 0.02, M.dark(), w * 0.24, by + h + 0.25 + i * 0.08, -d * 0.16 + 0.34)
  } else if (v === 1) {
    cyl(gr, 0.4, 0.4, 0.8, M.white2(), -w * 0.22, by + h + 0.6, d * 0.16)
    sph(gr, 0.4, M.white2(), -w * 0.22, by + h + 1.02, d * 0.16, { sy: 0.5 })
    tor(gr, 0.4, 0.03, M.red(), -w * 0.22, by + h + 0.35, d * 0.16, { rx: Math.PI / 2 })
  } else {
    cyl(gr, 0.03, 0.03, 1.4, M.metal(), w * 0.2, by + h + 0.9, -d * 0.2)
    sph(gr, 0.07, tipMat, w * 0.2, by + h + 1.66, -d * 0.2)
  }
  g.add(gr)
  blob(g, x, z, w + 1.6, d + 1.6, 0.23)
  return gr
}

// torre esbelta con baliza (fondo de skyline)
export function tower(g, x, z, o = {}) {
  const h = o.h ?? 9, w = o.w ?? 2.2, y = o.y ?? 0.36
  const gr = new THREE.Group()
  gr.position.set(x, y, z)
  box(gr, w + 0.3, 0.16, w + 0.3, M.concrete(), 0, 0.08, 0)
  rbox(gr, w, h, w, 0.1, M.white(), 0, h / 2 + 0.16, 0)
  for (let r = 0; r < 4; r++) {
    plate(gr, w * 0.55, h * 0.12, M.glass(), 0, 0.16 + h * (0.25 + r * 0.18), w / 2 + 0.02)
  }
  box(gr, w * 0.99, 0.08, 0.08, M.red(), 0, 0.16 + h * 0.14, w / 2 + 0.02)
  box(gr, w + 0.24, 0.14, w + 0.24, M.white2(), 0, 0.16 + h + 0.07, 0)
  cyl(gr, 0.03, 0.03, 1.6, M.metal(), 0, 0.16 + h + 0.94, 0)
  sph(gr, 0.08, tipMat, 0, 0.16 + h + 1.76, 0)
  g.add(gr)
  blob(g, x, z, w + 2, w + 2, 0.23)
  return gr
}

// árbol de maqueta (tronco + copas sage)
export function tree(g, x, z, s = 1) {
  cyl(g, 0.1 * s, 0.16 * s, 1.0 * s, mat(PAL.sageTrunk, { r: 0.9 }), x, 0.22 + 0.5 * s, z)
  sph(g, 0.7 * s, mat(PAL.sage, { r: 0.9 }), x, 0.22 + 1.15 * s, z, { sy: 1.1 })
  sph(g, 0.48 * s, mat(PAL.sage, { r: 0.9 }), x + 0.32 * s, 0.22 + 1.5 * s, z - 0.18 * s)
  sph(g, 0.4 * s, mat(PAL.sage, { r: 0.9 }), x - 0.28 * s, 0.22 + 1.4 * s, z + 0.22 * s)
  blob(g, x, z, 2.2 * s, 2.2 * s, 0.23)
}

// luminaria de calle con esfera encendida
export function lamp(g, x, z, ry = 0) {
  const gr = new THREE.Group()
  gr.position.set(x, 0.22, z)
  gr.rotation.y = ry
  box(gr, 0.28, 0.08, 0.28, M.concrete(), 0, 0.04, 0)
  cyl(gr, 0.05, 0.07, 2.7, M.metal(), 0, 1.4, 0)
  cyl(gr, 0.04, 0.04, 0.95, M.metal(), 0.45, 2.75, 0, { rz: Math.PI / 2 })
  box(gr, 0.22, 0.08, 0.22, M.dark(), 0.9, 2.65, 0)
  sph(gr, 0.15, lampMat, 0.9, 2.52, 0)
  g.add(gr)
  return gr
}

// pila de tarimas
export function crates(g, x, z, n = 2, ry = 0) {
  const gr = new THREE.Group()
  gr.position.set(x, 0.22, z)
  gr.rotation.y = ry
  for (let i = 0; i < n; i++) {
    rbox(gr, 1.1, 0.5, 1.1, 0.06, M.dark(), (i % 2) * 0.16, 0.25 + i * 0.52, 0)
    box(gr, 1.16, 0.06, 1.16, M.white2(), (i % 2) * 0.16, 0.52 + i * 0.52, 0)
  }
  g.add(gr)
  return gr
}

// cerca baja de obra
export function fence(g, x, z, len = 6, ry = 0) {
  const gr = new THREE.Group()
  gr.position.set(x, 0.22, z)
  gr.rotation.y = ry
  const n = Math.round(len / 1.5)
  for (let i = 0; i <= n; i++) {
    const px = -len / 2 + (i * len) / n
    box(gr, 0.1, 0.05, 0.1, M.dark(), px, 0.03, 0)
    cyl(gr, 0.04, 0.04, 1.0, M.metal(), px, 0.52, 0)
  }
  box(gr, len, 0.07, 0.07, M.white2(), 0, 0.78, 0)
  box(gr, len, 0.07, 0.07, M.white2(), 0, 0.4, 0)
  box(gr, len, 0.05, 0.05, M.red(), 0, 0.95, 0)
  g.add(gr)
  return gr
}

// hilera de conos
export function cones(g, x, z, ry = 0, n = 3) {
  const gr = new THREE.Group()
  gr.position.set(x, 0.22, z)
  gr.rotation.y = ry
  for (let i = 0; i < n; i++) cone(gr, -((n - 1) * 1.2) / 2 + i * 1.2, 0)
  g.add(gr)
}

// figuras caminando (estilo iso-figures)
export function figures(g, x, z, ry = 0, n = 2) {
  const gr = new THREE.Group()
  gr.position.set(x, 0.22, z)
  gr.rotation.y = ry
  for (let i = 0; i < n; i++) person(gr, i * 1.1 - (n - 1) * 0.55, 0, { ry: 0.4 + i * 0.5 })
  g.add(gr)
}

// tendedero de tubería con cunas y codo al cielo
export function pipeRun(g, x, z, o = {}) {
  const len = o.len ?? 4, ry = o.ry ?? 0, y = o.y ?? 0.36
  const gr = new THREE.Group()
  gr.position.set(x, y, z)
  gr.rotation.y = ry
  cyl(gr, 0.18, 0.18, len, M.red(), 0, 0.4, 0, { rx: Math.PI / 2 })
  K.flange(gr, 0, 0.4, len / 2 - 0.2, { r: 0.24, bolts: 6 })
  K.flange(gr, 0, 0.4, -len / 2 + 0.2, { r: 0.24, bolts: 6 })
  for (const s of [-1, 1]) box(gr, 0.5, 0.4, 0.4, M.concrete(), s * (len / 2 - 0.6), 0.2, 0)
  cyl(gr, 0.18, 0.18, 1.0, M.red(), len / 2, 1.1, 0)
  tor(gr, 0.24, 0.05, M.redDeep(), len / 2, 1.6, 0, { rx: Math.PI / 2 })
  g.add(gr)
  return gr
}

// escalera pegada al suelo del grupo (sin el offset del kit)
function ladderAt(gr, x, z, h, ry = 0) {
  const gg = new THREE.Group()
  gg.position.set(x, 0, z)
  gg.rotation.y = ry
  cyl(gg, 0.03, 0.03, h, M.metal(), -0.2, h / 2, 0)
  cyl(gg, 0.03, 0.03, h, M.metal(), 0.2, h / 2, 0)
  for (let y = 0.4; y < h; y += 0.4) cyl(gg, 0.025, 0.025, 0.4, M.metal(), 0, y, 0, { rz: Math.PI / 2 })
  gr.add(gg)
}

// tanque horizontal sobre sellos con escotilla y escalera
export function tankH(g, x, z, o = {}) {
  const len = o.len ?? 5.2, r = o.r ?? 1.15, ry = o.ry ?? 0, y = o.y ?? 0.36
  const gr = new THREE.Group()
  gr.position.set(x, y, z)
  gr.rotation.y = ry
  cyl(gr, r, r, len, M.white(), 0, r + 0.35, 0, { rx: Math.PI / 2, seg: 26 })
  for (const s of [-1, 1]) box(gr, 0.7, 0.7, 1.2, M.concrete(), s * (len / 2 - 1.1), 0.35, 0)
  cyl(gr, 0.24, 0.24, 0.5, M.metal(), 0, r * 2 + 0.5, 0)
  tor(gr, r + 0.04, 0.05, M.red(), 0, r + 0.35, -len / 2 + 0.4, { rx: Math.PI / 2 })
  tor(gr, r + 0.04, 0.05, M.red(), 0, r + 0.35, len / 2 - 0.4, { rx: Math.PI / 2 })
  box(gr, 0.55, 0.32, 0.03, M.white2(), 0, r * 1.2, -r - 0.05)           // placa
  valve(gr, len * 0.22, r * 2 + 0.55, 0)                                 // válvula superior
  ladderAt(gr, 0, len / 2 - 0.6, r * 2 + 0.35, Math.PI / 2)
  g.add(gr)
  blob(g, x, z, len + 2, r * 4, 0.23)
  return gr
}

// silo vertical con sombrero cónico
export function silo(g, x, z, o = {}) {
  const h = o.h ?? 4.6, r = o.r ?? 1.1, y = o.y ?? 0.36
  const gr = new THREE.Group()
  gr.position.set(x, y, z)
  cyl(gr, r, r, h, M.white(), 0, h / 2 + 0.2, 0, { seg: 22 })
  cyl(gr, 0.06, r, 1.1, M.white2(), 0, h + 0.75, 0, { seg: 22 })
  tor(gr, r + 0.04, 0.05, M.red(), 0, h * 0.28, 0, { rx: Math.PI / 2 })
  ladderAt(gr, r + 0.05, 0, h + 0.2, 0)
  box(gr, 0.8, 0.65, 0.6, mat(PAL.metalDark, { r: 0.5 }), r + 0.95, 0.55, 0)  // motor de base
  cyl(gr, 0.06, 0.06, 1.0, M.red(), r + 0.95, 1.15, 0)
  gauge(gr, r + 0.95, 0.95, 0.35)
  g.add(gr)
  blob(g, x, z, r * 3.4, r * 3.4, 0.23)
  return gr
}

// torre de agua (firma de los sistemas hidráulicos)
export function waterTower(g, x, z, o = {}) {
  const h = o.h ?? 5.4, r = o.r ?? 1.5, y = o.y ?? 0.36
  const gr = new THREE.Group()
  gr.position.set(x, y, z)
  for (const [lx, lz] of [[-0.9, -0.9], [0.9, -0.9], [-0.9, 0.9], [0.9, 0.9]]) {
    cyl(gr, 0.09, 0.11, h, M.metal(), lx, h / 2, lz)
  }
  for (const ly of [h * 0.35, h * 0.8]) box(gr, 2.1, 0.08, 0.08, M.metal(), 0, ly, -0.9), box(gr, 2.1, 0.08, 0.08, M.metal(), 0, ly, 0.9)
  cyl(gr, r, r * 0.92, 1.5, M.white(), 0, h + 0.75, 0, { seg: 24 })
  sph(gr, r * 1.02, M.white2(), 0, h + 1.5, 0, { sy: 0.55 })
  tor(gr, r + 0.05, 0.06, M.red(), 0, h + 0.4, 0, { rx: Math.PI / 2 })
  cyl(gr, 0.14, 0.14, 1.4, M.red(), 0, h - 0.7, r + 0.2, { rx: 1.2 })
  // riostras cruzadas entre patas + rebosadero
  const bl = Math.hypot(1.8, h * 0.5)
  for (const s of [-1, 1]) {
    cyl(gr, 0.035, 0.035, bl, M.metal(), 0, h * 0.55, s * 0.9, { rz: s * 0.59 })
    cyl(gr, 0.035, 0.035, bl, M.metal(), 0, h * 0.55, s * 0.9, { rz: -s * 0.59 })
  }
  cyl(gr, 0.05, 0.05, h + 1.1, M.red(), r + 0.12, (h + 1.1) / 2, 0)
  g.add(gr)
  blob(g, x, z, r * 4, r * 4, 0.23)
  return gr
}

// pórtico de montaje con viga y gancho
export function gantry(g, x, z, o = {}) {
  const w = o.w ?? 5, h = o.h ?? 4.4, ry = o.ry ?? 0, y = o.y ?? 0.36
  const gr = new THREE.Group()
  gr.position.set(x, y, z)
  gr.rotation.y = ry
  for (const s of [-1, 1]) {
    box(gr, 0.3, h, 0.3, M.white(), s * w / 2, h / 2, 0)
    edgeBox(gr, 0.3, h, 0.3, PAL.padEdge, s * w / 2, h / 2, 0)
  }
  box(gr, w + 0.8, 0.34, 0.5, M.white(), 0, h + 0.17, 0)
  cyl(gr, 0.02, 0.02, 1.6, M.dark(), w * 0.18, h - 0.6, 0)
  box(gr, 0.3, 0.3, 0.3, M.red(), w * 0.18, h - 1.5, 0)
  box(gr, 1.6, 0.2, 0.2, M.white2(), w * 0.18, h - 1.7, 0)
  g.add(gr)
  blob(g, x, z, w + 1.4, 2.4, 0.23)
  return gr
}

// kiosco pequeño con marquesina
export function booth(g, x, z, ry = 0) {
  const gr = new THREE.Group()
  gr.position.set(x, 0.22, z)
  gr.rotation.y = ry
  rbox(gr, 1.7, 1.7, 1.4, 0.08, M.white(), 0, 0.85, 0)
  plate(gr, 1.5, 0.4, M.glass(), 0, 1.05, 0.72)
  box(gr, 1.9, 0.08, 0.55, M.white2(), 0, 0.95, 0.78)                    // mostrador
  box(gr, 2.1, 0.1, 1.8, M.red(), 0, 1.82, 0)
  box(gr, 1.7, 0.4, 0.06, M.dark(), 0, 2.18, 0.72)                       // letrero
  box(gr, 1.5, 0.07, 0.08, M.blue(), 0, 2.16, 0.76)
  cyl(gr, 0.05, 0.05, 0.7, M.metal(), 0.7, 2.2, 0.6)
  g.add(gr)
  blob(g, x, z, 3.2, 3, 0.23)
  return gr
}

// camioneta de servicio (detallada: cristales, luces, espejos, escapes)
export function truck(g, x, z, ry = 0) {
  const gr = new THREE.Group()
  gr.position.set(x, 0.22, z)
  gr.rotation.y = ry
  box(gr, 3.4, 0.5, 1.6, M.dark(), 0, 0.55, 0)                   // chasis
  box(gr, 1.1, 0.85, 1.5, M.white(), 1.25, 1.2, 0)               // cabina
  box(gr, 2.0, 0.75, 1.5, M.white2(), -0.7, 1.15, 0)             // caja
  box(gr, 2.0, 0.09, 0.09, M.red(), -0.7, 0.95, 0.78)            // franja BOSS
  box(gr, 0.06, 0.45, 1.2, M.glass(), 1.82, 1.35, 0)             // parabrisas
  for (const s of [-1, 1]) {
    box(gr, 0.05, 0.12, 0.3, M.white(), 1.83, 0.7, s * 0.5)      // faros
    box(gr, 0.06, 0.12, 0.3, M.red(), -1.73, 0.7, s * 0.5)       // calaveras
    cyl(gr, 0.025, 0.025, 0.28, M.metal(), 1.68, 1.5, s * 0.82, { rz: Math.PI / 2.4 })
    box(gr, 0.18, 0.12, 0.04, M.white(), 1.78, 1.5, s * 0.84)    // espejos
  }
  box(gr, 0.03, 0.7, 0.02, mat(PAL.metalDark, { r: 0.5 }), 1.48, 1.3, 0.77) // junta de puerta
  box(gr, 0.1, 0.25, 1.7, M.metal(), 1.87, 0.5, 0)               // defensa frontal
  box(gr, 0.1, 0.25, 1.7, M.metal(), -1.87, 0.5, 0)              // defensa trasera
  box(gr, 0.42, 0.1, 0.22, M.red(), 1.25, 1.77, 0)               // torreta
  cyl(gr, 0.05, 0.05, 1.0, M.metal(), 1.35, 1.95, -0.55)         // escape
  for (const wx of [-1.2, 0.4, 1.3]) for (const wz of [-1, 1]) {
    cyl(gr, 0.3, 0.3, 0.22, M.dark(), wx, 0.3, wz * 0.82, { rx: Math.PI / 2 })
    cyl(gr, 0.13, 0.13, 0.24, M.metal(), wx, 0.3, wz * 0.84, { rx: Math.PI / 2 })
  }
  g.add(gr)
  blob(g, x, z, 4.6, 2.6, 0.23)
  return gr
}

// autobús urbano de maqueta (ventanas corridas, puertas, AC de techo)
export function bus(g, x, z, ry = 0, o = {}) {
  const L = o.len ?? 5.5, H = 1.75, W2 = 1.45
  const gr = new THREE.Group()
  gr.position.set(x, 0.22, z)
  gr.rotation.y = ry
  rbox(gr, L, H, W2, 0.16, M.white(), 0, H / 2 + 0.42, 0)        // carrocería
  box(gr, L + 0.22, 0.34, W2 + 0.2, M.dark(), 0, 0.6, 0)         // faldón
  for (const s of [-1, 1]) {
    box(gr, L - 1.5, 0.55, 0.05, M.glass(), 0, 1.62, s * (W2 / 2 + 0.02))   // banda de ventanas
    box(gr, L - 1.5, 0.1, 0.07, M.red(), 0, 1.16, s * (W2 / 2 + 0.04))      // franja BOSS
    box(gr, L - 0.5, 0.06, 0.06, M.metal(), 0, 2.33, s * (W2 / 2 - 0.08))   // riel de techo
  }
  for (const px of [L / 2 - 1.15, 0.1]) box(gr, 0.9, 1.05, 0.05, M.glass(), px, 1.28, W2 / 2 + 0.03) // puertas
  box(gr, 0.08, 0.42, 1.2, M.dark(), L / 2 + 0.05, 1.78, 0)      // letrero de ruta
  box(gr, 0.1, 0.07, 0.95, M.blue(), L / 2 + 0.06, 1.88, 0)
  for (const s of [-1, 1]) box(gr, 0.07, 0.1, 0.3, M.white(), L / 2 + 0.06, 0.95, s * 0.45)  // faros
  for (const s of [-1, 1]) box(gr, 0.07, 0.1, 0.3, M.red(), -L / 2 - 0.06, 0.95, s * 0.45)    // calaveras
  box(gr, 0.12, 0.3, W2 + 0.14, M.metal(), L / 2 + 0.08, 0.55, 0)              // defensa
  for (const s of [-1, 1]) box(gr, 0.8, 0.32, 1.1, M.white2(), s * (L / 2 - 1.5), 2.34, 0)     // AC de techo
  for (const s of [-1, 1]) cyl(gr, 0.2, 0.2, 0.08, M.dark(), s * (L / 2 - 1.5), 2.52, 0, { rx: Math.PI / 2 })
  for (const s of [-1, 1]) {
    cyl(gr, 0.025, 0.025, 0.32, M.metal(), L / 2 + 0.2, 1.62, s * (W2 / 2 + 0.05), { rz: Math.PI / 2.4 })
    box(gr, 0.2, 0.14, 0.04, M.white(), L / 2 + 0.3, 1.62, s * (W2 / 2 + 0.07)) // espejos
  }
  cyl(gr, 0.02, 0.02, 0.6, M.metal(), -L / 2 + 0.55, 2.62, 0)      // antena
  sph(gr, 0.05, tipMat, -L / 2 + 0.55, 2.95, 0)
  for (const wx of [L / 2 - 1.05, -L / 2 + 1.05]) for (const wz of [-1, 1]) {
    cyl(gr, 0.34, 0.34, 0.26, M.dark(), wx, 0.34, wz * (W2 / 2 - 0.1), { rx: Math.PI / 2 })
    cyl(gr, 0.15, 0.15, 0.28, M.metal(), wx, 0.34, wz * (W2 / 2 - 0.11), { rx: Math.PI / 2 })
  }
  g.add(gr)
  blob(g, x, z, L + 1.6, W2 + 2.6, 0.23)
  return gr
}

// andamio de obra (marco ligero)
export function scaffold(g, x, z, o = {}) {
  const w = o.w ?? 3.2, h = o.h ?? 4.4, ry = o.ry ?? 0, y = o.y ?? 0.36
  const gr = new THREE.Group()
  gr.position.set(x, y, z)
  gr.rotation.y = ry
  for (const [px, pz] of [[-w / 2, -0.6], [w / 2, -0.6], [-w / 2, 0.6], [w / 2, 0.6]]) cyl(gr, 0.05, 0.05, h, M.white(), px, h / 2, pz)
  for (const ly of [1.4, 2.8, 4.2]) {
    box(gr, w, 0.06, 0.06, M.white(), 0, ly, -0.6)
    box(gr, w, 0.06, 0.06, M.white(), 0, ly, 0.6)
    box(gr, 1.1, 0.05, 1.3, M.white2(), 0, ly + 0.05, 0)
  }
  g.add(gr)
  return gr
}

// rack de tuberías apiladas
export function pipeRack(g, x, z, o = {}) {
  const ry = o.ry ?? 0, y = o.y ?? 0.36
  const gr = new THREE.Group()
  gr.position.set(x, y, z)
  gr.rotation.y = ry
  for (const s of [-1, 1]) {
    box(gr, 0.4, 1.1, 1.6, M.concrete(), s * 1.8, 0.55, 0)
  }
  const rows = [[0, 1.25, 0], [-0.42, 1.15, -0.4], [0.42, 1.15, -0.4], [0, 1.15, -0.8]]
  for (const [px, py, pz] of rows) cyl(gr, 0.3, 0.3, 4.2, M.white(), px, py, pz, { rx: Math.PI / 2, seg: 16 })
  tor(gr, 0.38, 0.05, M.red(), 0, 1.25, 2.1, { rx: Math.PI / 2 })
  for (const s of [-1, 1]) tor(gr, 0.35, 0.04, M.red(), s * 2.06, 1.25, 0, { rx: Math.PI / 2 }) // tapas
  g.add(gr)
  blob(g, x, z, 6.4, 3, 0.23)
  return gr
}

// barreras de concreto
export function barriers(g, x, z, ry = 0, n = 3) {
  const gr = new THREE.Group()
  gr.position.set(x, 0.22, z)
  gr.rotation.y = ry
  for (let i = 0; i < n; i++) {
    box(gr, 1.8, 0.5, 0.5, M.concrete(), i * 2.1 - ((n - 1) * 2.1) / 2, 0.25, 0)
    box(gr, 1.86, 0.06, 0.56, M.concreteDark(), i * 2.1 - ((n - 1) * 2.1) / 2, 0.5, 0)
  }
  g.add(gr)
  return gr
}

// marca de fuga en el pavimento (parche azul luminoso)
export function leakMark(g, x, z) {
  cyl(g, 0.55, 0.7, 0.06, markMat, x, 0.26, z, { seg: 18 })
  tor(g, 0.8, 0.03, M.blue(), x, 0.26, z, { rx: Math.PI / 2 })
  cyl(g, 0.02, 0.02, 1.2, M.metal(), x, 0.8, z)
  sph(g, 0.06, tipMat, x, 1.44, z)
}

// carrete de cable
export function cableReel(g, x, z, ry = 0) {
  const gr = new THREE.Group()
  gr.position.set(x, 0.22, z)
  gr.rotation.y = ry
  tor(gr, 0.6, 0.24, M.white(), 0, 0.62, 0, { rx: Math.PI / 2, rad: 10, tub: 20 })
  cyl(gr, 0.09, 0.09, 1.2, M.metal(), 0, 0.62, 0, { rz: Math.PI / 2 })
  g.add(gr)
  return gr
}

// pila de placas / paneles
export function panelStack(g, x, z, ry = 0, n = 4) {
  const gr = new THREE.Group()
  gr.position.set(x, 0.22, z)
  gr.rotation.y = ry
  for (let i = 0; i < n; i++) box(gr, 1.8, 0.12, 1.2, M.white2(), i * 0.05, 0.08 + i * 0.15, i * 0.04, 0.06)
  box(gr, 1.9, 0.05, 1.3, M.red(), 0, 0.08 + n * 0.15, 0)
  g.add(gr)
  return gr
}

// skid de bomba + motor
export function pumpSkid(g, x, z, ry = 0) {
  const gr = new THREE.Group()
  gr.position.set(x, 0.22, z)
  gr.rotation.y = ry
  box(gr, 2.6, 0.3, 1.4, M.concrete(), 0, 0.15, 0)
  cyl(gr, 0.5, 0.5, 1.0, M.white(), -0.5, 0.85, 0, { rz: Math.PI / 2 })
  cyl(gr, 0.34, 0.34, 0.9, M.metal(), 0.6, 0.8, 0)
  const nd = gauge(gr, 1.35, 1.15, 0.2)
  cyl(gr, 0.14, 0.14, 1.1, M.red(), -1.15, 0.55, 0.35)
  valve(gr, -1.15, 0.62, 0.9)
  g.add(gr)
  return { gr, nd }
}

// ---------- recetas por estación ----------
// Coordenadas LOCALES al grupo de estación (y = 0.22 el plinth).
// back  = x*+side  (fondo del sujeto — props altos permitidos)
// front = x*-side (lado cámara — SOLO props bajos)
// near  = z+ (aproximación de cámara) · far = z- (detrás del sujeto)
export function buildAnnex(ctx) {
  const { side, i } = ctx
  const an = new THREE.Group()
  an.name = `annex-${i}`
  ctx.g.add(an)
  const g = an
  const B = side * 17.5   // flank del fondo
  const F = -side * 17.5  // flank de cámara
  const R = (arr, fn) => arr.forEach(([x, z]) => fn(x, z))
  const sideFlip = (x) => x * side

  switch (i) {
    case 0: // 01 · Supervisión: campamento de obra
      R([[B, -4], [B, 2.5]], (x, z) => house(g, x, z, { w: 3.8, h: 3.4, d: 3, ry: -side * 0.2, variant: 1 }))
      lamp(g, B - side * 2.2, 6.2, -side * 0.6)
      figures(g, F, -3, 0.2 * side, 2)
      cones(g, F, 3, 0, 3)
      crates(g, sideFlip(8), 13, 2, side * 0.3)
      tree(g, sideFlip(-6), -14, 1.15)
      tree(g, sideFlip(-2.5), -15.5, 0.85)
      lamp(g, sideFlip(1), -13.5, side * 0.9)
      break

    case 1: // 02 · Sistemas hidráulicos: la torre de agua manda
      waterTower(g, B, -2)
      lamp(g, B + side * 1.6, 5, side * 0.7)
      pipeRun(g, F, -2, { ry: Math.PI / 2 * side, len: 3.6 })
      valve(g, F + side * 1.4, 0.5, -2)
      figures(g, F, 4, 0, 1)
      crates(g, sideFlip(7), 12.5, 1, side * 0.5)
      tree(g, sideFlip(-5), -14, 1.2)
      break

    case 2: // 03 · Incendios: casa de bombas + hidrantía
      house(g, B, -3, { w: 3.6, h: 3.0, d: 3, ry: side * 0.15, variant: 0 })
      R([[B + side * 2.2, 1.6], [B + side * 3.4, 0.2]], (x, z) => cyl(g, 0.16, 0.16, 2.8, M.red(), x, 1.6, z))
      K.hydrant(g, F, -1)
      cones(g, F, 4.5, 0, 2)
      fence(g, sideFlip(6), 13, 5, Math.PI / 2)
      figures(g, sideFlip(-2), -13, 0.5, 2)
      tree(g, sideFlip(-7.5), -14, 0.9)
      break

    case 3: // 04 · Obras hidráulicas: frente de obra
      barriers(g, B, -2, side * 0.25, 3)
      house(g, B + side * 3, 4, { w: 3.2, h: 2.6, d: 2.6, ry: -side * 0.3, variant: 2 })
      crates(g, F, -2, 2, side * 0.4)
      cones(g, F, 3.5, 0, 4)
      figures(g, sideFlip(4), 12, side * 1.2, 2)
      tree(g, sideFlip(-6), -14, 1.1)
      lamp(g, sideFlip(0), -13, side * 0.8)
      break

    case 4: // 05 · Detección de fugas: la calle del geófono
      house(g, B, -2, { w: 3.6, h: 3.2, d: 3, ry: -side * 0.15, variant: 1 })
      leakMark(g, B + side * 0.8, 2)
      lamp(g, B - side * 2.2, -3, side * 0.4)
      booth(g, B + side * 2.8, 4.2, -side * 0.4)
      figures(g, B + side * 1, 2.6, side * 1.8, 2)
      cones(g, F, -4, 0, 2)
      figures(g, F, -0.5, 0.2 * side, 2)
      bus(g, F, 2.5, -side * 1.5)
      lamp(g, F + side * 2.2, 9, 0)
      tree(g, F - side * 0.5, 12, 0.9)
      tree(g, sideFlip(-5.5), -13.5, 1)
      break

    case 5: // 06 · Video inspección: flancos junto a la boca del tubo (encuadre de aproximación)
      booth(g, side * 15.5, 11, -side * 0.5)
      tower(g, -side * 15.5, 12.5, { h: 8, w: 2 })
      lamp(g, side * 15.5, -12, side * 0.6)
      crates(g, -side * 15.5, -13, 1, side * 0.2)
      break

    case 6: // 07 · Desazolve Vactor: patio de servicio
      house(g, B, -3, { w: 4.2, h: 3.6, d: 3, ry: side * 0.05, variant: 0 })
      tor(g, 0.8, 0.28, M.white(), B + side * 2.6, 1.0, 2.8, { rx: Math.PI / 2, rad: 10, tub: 22 })
      cones(g, F, -3, 0, 3)
      figures(g, F, 3.5, 0, 2)
      crates(g, sideFlip(6.5), 12.5, 2, side * 0.2)
      tree(g, sideFlip(-6), -14, 1.05)
      break

    case 7: // 08 · Calidad de agua: laboratorio de campo
      house(g, B, -2, { w: 4.4, h: 3.2, d: 3.2, ry: -side * 0.12, variant: 1 })
      silo(g, B + side * 4, 4, { h: 3.6, r: 0.8 })
      figures(g, F, 0, side * 0.3, 2)
      crates(g, sideFlip(5), 12.5, 1, side * 0.4)
      tree(g, sideFlip(-6.5), -13.5, 1.2)
      tree(g, sideFlip(-3.5), -15, 0.8)
      lamp(g, sideFlip(0.5), -13, side * 0.9)
      break

    case 8: // 09 · Estructuras metálicas: patio de acero
      gantry(g, B, -2, { w: 5, h: 4.2, ry: side * 0.3 })
      R([[B + side * 1.5, 3.2], [B + side * 2.2, 4.0]], (x, z) => box(g, 0.3, 2.6, 0.3, M.white(), x, 1.5, z, 0.5))
      cones(g, F, -2, 0, 2)
      figures(g, F, 4, 0, 2)
      lamp(g, F + side * 2, 8.5, 0)
      panelStack(g, sideFlip(5.5), 12.5, side * 0.2, 3)
      figures(g, sideFlip(3), 11, side * 1.4, 2)
      lamp(g, sideFlip(-1), -13, side * 0.7)
      break

    case 9: // 10 · Pailería y tanques: patio de fabricación
      tankH(g, B, -2, { ry: side * Math.PI * 0.5, len: 5 })
      crates(g, F, 0, 2, side * 0.5)
      figures(g, F + side * 1.2, -3.5, side * 2.4, 1)
      barriers(g, sideFlip(6), 12, side * 0.1, 2)
      tree(g, sideFlip(-6.5), -14, 1)
      break

    case 10: // 11 · Tuberías de presión: rack y maniobra
      pipeRack(g, B, -2, { ry: side * 0.05 })
      valve(g, F, 0.5, -1)
      gauge(g, F + side * 1.2, 0.9, 0.2)
      cones(g, F, 4, 0, 2)
      figures(g, sideFlip(3.5), 12, side * 1.6, 2)
      crates(g, sideFlip(-6), -13.5, 1, side * 0.3)
      tree(g, sideFlip(-2), -15, 0.85)
      break

    case 11: // 12 · Sand blast: cabina y patio de piezas
      house(g, B, -3, { w: 4.0, h: 3.8, d: 3.2, ry: side * 0.08, variant: 2 })
      panelStack(g, B + side * 3.2, 2.5, side * 0.5, 4)
      crates(g, F, -1, 2, side * 0.3)
      figures(g, F, 4, 0.2, 1)
      cones(g, sideFlip(5), 12.5, 0, 2)
      tree(g, sideFlip(-6), -13.5, 1.1)
      lamp(g, sideFlip(-0.5), -12.5, side * 0.8)
      break

    case 12: // 13 · Mantenimiento: skid en taller
      pumpSkid(g, B, -2, side * 0.4)
      crates(g, F, -2, 2, side * 0.35)
      figures(g, F, 0.5, 0, 2)
      truck(g, F, 3.8, -side * 1.5)
      tree(g, sideFlip(-6.5), -14, 1)
      break

    case 13: // 14 · Electromecánica: remodelación en curso
      house(g, B, -3, { w: 4.2, h: 3.8, d: 3, ry: -side * 0.08, variant: 0 })
      scaffold(g, B - side * 1.2, -1.5, { w: 3, h: 4.2, ry: side * 0.1 })
      cableReel(g, F, 0, side * 0.3)
      figures(g, F, 3.5, 0, 2)
      crates(g, sideFlip(6), 12.5, 2, side * 0.25)
      tree(g, sideFlip(-5.5), -14, 1.15)
      lamp(g, sideFlip(1), -13, side * 0.75)
      break
  }
}
