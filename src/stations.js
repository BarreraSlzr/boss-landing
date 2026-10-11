// ============================================================
// stations.js — las 14 estaciones del recorrido (micro-worlds)
// Cada estación recibe ctx { g, y, side, up } y el kit K.
//   g: grupo raíz (origen en el centro del plinth)
//   y: altura del plinth (0.22)
//   side: +1 si la estación está en x>0, -1 si está en x<0
//   frente (hacia el bulevar / zanja) = local x * -side
// ============================================================

import * as THREE from 'three'
import * as K from './kit.js'

const { V, box, rbox, cyl, sph, tor, tube, plate, edgeBox, person, cone, cabin, ladder, gauge, valve, hydrant, soilBlock, cloud, cyc, sparks, holo, sign, flaggingTape, extinguisher, hoseCabinet, sprinkler, manhole, pallet, toolbox, fieldPanel, drum, reel, surveyTripod, gasBottles, flange, pumpSkid, mat, M, PAL } = K

// varilla dinámica (cable del crawler)
function dynamicRod(parent, r, m) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 1, 8), m)
  parent.add(mesh)
  const _d = new THREE.Vector3()
  const _up = new THREE.Vector3(0, 1, 0)
  return (a, b) => {
    _d.subVectors(b, a)
    const len = _d.length()
    mesh.position.copy(a).addScaledVector(_d, 0.5)
    mesh.quaternion.setFromUnitVectors(_up, _d.normalize())
    mesh.scale.set(1, len, 1)
  }
}

export const STATIONS = [

  // ---------- 01 · Supervisión técnica ----------
  (ctx) => {
    const { g, y, side, up } = ctx
    const front = -side * 6

    // caseta de obra con ventanas cálidas
    cabin(g, { x: front - side * 2, y, z: -3, w: 4.6, h: 2.6, d: 2.8, winRows: 1 })
    K.blob(g, front - side * 2, -3, 6.5, 5, y + 0.01)

    // mesa de planos (patas, cajones, canto)
    const tx = front + side * 2
    for (const [lx, lz] of [[-1.1, -0.55], [1.1, -0.55], [-1.1, 0.55], [1.1, 0.55]]) {
      box(g, 0.12, 0.85, 0.12, M.metal(), tx + lx, y + 0.42, 1 + lz)
    }
    box(g, 2.6, 0.12, 1.4, M.white(), tx, y + 0.9, 1)
    edgeBox(g, 2.6, 0.12, 1.4, PAL.metalDark, tx, y + 0.9, 1)
    box(g, 0.7, 0.35, 1.2, M.white2(), tx - side * 0.7, y + 0.55, 1)
    box(g, 0.08, 0.08, 0.04, M.metal(), tx - side * 0.4, y + 0.55, 1.62)
    // tableros quietos (sin pulso): el movimiento queda para instrumentos vivos
    holo(g, 1.9, 1.9, { tex: K.texBlueprint(), x: front + side * 2, y: y + 2.1, z: 1, tilt: -0.28, ry: side * 0.3, op: 0.88 })
    holo(g, 2.6, 1.6, { tex: K.texGantt(), x: front + side * 5, y: y + 3.4, z: -2, ry: -side * 0.28, op: 0.86 })

    // grúa torre (base, mástil arriostrado, pluma, cabina, gancho)
    const cg = new THREE.Group()
    cg.position.set(side * 8, y, 5)
    g.add(cg)
    box(cg, 2.4, 0.35, 2.4, M.concrete(), 0, 0.18, 0)
    edgeBox(cg, 2.4, 0.35, 2.4, PAL.padEdge, 0, 0.18, 0)
    for (const [px, pz] of [[-0.85, -0.85], [0.85, -0.85], [-0.85, 0.85], [0.85, 0.85]]) {
      box(cg, 0.35, 0.5, 0.35, M.dark(), px, 0.45, pz)
    }
    const post = (px, pz) => cyl(cg, 0.08, 0.08, 14, M.white(), px, 7.2, pz)
    for (const [px, pz] of [[-0.55, -0.55], [0.55, -0.55], [-0.55, 0.55], [0.55, 0.55]]) post(px, pz)
    for (let hgt = 1.4; hgt < 13.6; hgt += 1.8) {
      box(cg, 1.15, 0.07, 0.07, M.white(), 0, hgt, -0.55)
      box(cg, 1.15, 0.07, 0.07, M.white(), 0, hgt, 0.55)
      box(cg, 0.07, 0.07, 1.15, M.white(), -0.55, hgt, 0)
      box(cg, 0.07, 0.07, 1.15, M.white(), 0.55, hgt, 0)
      // diagonales
      const d1 = box(cg, 1.35, 0.05, 0.05, M.white2(), 0, hgt + 0.55, 0)
      d1.rotation.z = 0.55; d1.rotation.y = Math.PI / 4
    }
    box(cg, 0.5, 0.5, 0.5, M.red(), 0, 14.2, 0)
    const jib = new THREE.Group()
    jib.position.set(0, 14.35, 0)
    cg.add(jib)
    // pluma + contraflecha
    box(jib, 14, 0.28, 0.42, M.white(), -5.8, 0, 0)
    box(jib, 14, 0.08, 0.08, M.white2(), -5.8, 0.55, -0.2)
    box(jib, 14, 0.08, 0.08, M.white2(), -5.8, 0.55, 0.2)
    for (let i = 0; i < 8; i++) {
      box(jib, 0.06, 0.55, 0.06, M.metal(), -12.2 + i * 1.6, 0.28, 0)
    }
    box(jib, 4.8, 0.7, 1.0, M.concrete(), 3.0, 0.15, 0)
    for (let i = 0; i < 3; i++) box(jib, 0.9, 0.55, 0.85, M.concreteDark(), 1.8 + i * 1.0, 0.55, 0)
    // cabina del operador
    rbox(jib, 1.3, 1.15, 1.4, 0.08, M.white(), 0.2, 0.95, 0)
    plate(jib, 1.0, 0.55, M.glass(), 0.2, 1.05, 0.72)
    plate(jib, 0.5, 0.45, M.glass(), -0.48, 1.05, 0, { ry: Math.PI / 2 })
    box(jib, 1.35, 0.08, 0.08, M.red(), 0.2, 0.42, 0.72)
    // carro + gancho + carga
    const trolley = box(jib, 0.55, 0.28, 0.55, M.dark(), -7.5, -0.2, 0)
    cyl(jib, 0.02, 0.02, 5.2, M.dark(), -7.5, -2.85, 0)
    const hook = box(jib, 0.35, 0.45, 0.25, M.red(), -7.5, -5.5, 0)
    box(jib, 0.15, 0.2, 0.08, M.metal(), -7.5, -5.2, 0)
    box(jib, 2.4, 0.55, 0.9, M.white2(), -7.5, -5.95, 0)
    edgeBox(jib, 2.4, 0.55, 0.9, PAL.metalDark, -7.5, -5.95, 0)
    up.push((t) => {
      jib.rotation.y = 0.5 + Math.sin(t * 0.1) * 0.55
      trolley.position.x = -7.5 + Math.sin(t * 0.18) * 2.4
      hook.position.x = trolley.position.x
    })
    K.blob(g, side * 8, 5, 5, 5, y + 0.01)

    person(g, front + side * 0.4, 2.4, { ry: side * 2.4 })
    person(g, front + side * 3.4, -0.6, { ry: -side * 1.2 })
    cone(g, front + side * 1.2, 3.4)
    cone(g, front - side * 1.4, 4.2)

    // --- señalización de obra: tablero, extintor y cinta ---
    sign(g, ['BOSS', 'SUPERVISIÓN DE OBRA'], { x: -side * 6.2, y, z: -5.6, ry: -side * 0.32, w: 3.6, h: 1.7, foot: 'ACCESO CONTROLADO' })
    extinguisher(g, side * 10.6, -1.6, -side * 0.5)
    flaggingTape(g, side * 8.8, 3.4, 4.6, side * 0.15)
    // utilería de campo: topografía, material y tablero
    surveyTripod(g, front + side * 4.8, 4.2, { y })
    pallet(g, -side * 9.2, y, 2.4, { ry: side * 0.4, pipes: 4, pr: 0.12, pm: M.steel() })
    toolbox(g, front + side * 1.2, y, -0.6, { ry: -side * 0.6 })
    fieldPanel(g, front - side * 4.4, y, 1.8, { ry: side * 0.9 })
  },

  // ---------- 02 · Sistemas hidráulicos ----------
  (ctx) => {
    const { g, y, side, up } = ctx
    const bx = -side * 3

    // edificio en corte: la fachada hacia el bulevar está retirada
    const W = 7, D = 4.6, H = 7.5
    box(g, W, H, 0.3, M.white(), bx, y + H / 2, -D / 2 + 0.15)
    box(g, W, H, 0.3, M.white(), bx, y + H / 2, D / 2 - 0.15)
    box(g, 0.3, H, D, M.white(), bx + side * (W / 2 - 0.15), y + H / 2, 0)
    box(g, W, 0.3, D, M.white2(), bx, y + H + 0.15, 0)
    edgeBox(g, W, H + 0.3, D, PAL.metalDark, bx, y + (H + 0.3) / 2, 0)
    for (let f = 1; f <= 2; f++) {
      box(g, W - 0.5, 0.18, D - 0.5, M.white2(), bx, y + f * 2.5, 0)
      box(g, W - 0.4, 0.12, 0.12, M.steel(), bx, y + f * 2.5 + 0.15, D / 2 - 0.4) // viga perimetral
    }
    // montante + bridas + ramales
    cyl(g, 0.28, 0.28, H - 0.3, M.red(), bx + side * 1.6, y + (H - 0.3) / 2, 0.6)
    for (let f = 1; f <= 2; f++) {
      flange(g, bx + side * 1.6, y + f * 2.5 + 0.3, 0.6, { r: 0.34, bolts: 6 })
      cyl(g, 0.16, 0.16, 4.2, M.red(), bx - side * 0.6, y + f * 2.5 + 0.3, 0.6, { rz: Math.PI / 2 })
      flange(g, bx - side * 2.5, y + f * 2.5 + 0.3, 0.6, { r: 0.22, ry: Math.PI / 2, bolts: 4 })
      sph(g, 0.2, M.redDeep(), bx - side * 2.5, y + f * 2.5 + 0.3, 0.6)
    }
    // ventanas mullioned
    for (const sz of [D / 2 + 0.01, -D / 2 - 0.01]) {
      for (let c = 0; c < 3; c++) plate(g, W * 0.2, 0.55, M.glass(), bx + (c - 1) * W * 0.26, y + H * 0.58, sz)
    }
    box(g, W, 0.12, 0.12, M.red(), bx, y + H + 0.28, D / 2 - 0.06)
    // tinaco de azotea (patas, tapa, respiradero)
    const tx2 = bx - side * 2.2, tz2 = -1.2
    for (const [ox, oz] of [[-0.55, -0.55], [0.55, -0.55], [-0.55, 0.55], [0.55, 0.55]]) {
      box(g, 0.16, 0.35, 0.16, M.concrete(), tx2 + ox, y + H + 0.18, tz2 + oz)
    }
    cyl(g, 0.95, 0.95, 1.45, M.white(), tx2, y + H + 1.1, tz2, { seg: 22 })
    tor(g, 0.96, 0.05, M.red(), tx2, y + H + 0.55, tz2, { rx: Math.PI / 2 })
    tor(g, 0.96, 0.05, M.metal(), tx2, y + H + 1.65, tz2, { rx: Math.PI / 2 })
    sph(g, 0.95, M.white2(), tx2, y + H + 1.85, tz2, { sy: 0.35 })
    cyl(g, 0.12, 0.12, 0.45, M.metal(), tx2, y + H + 2.2, tz2)
    cyl(g, 0.14, 0.14, 2.4, M.red(), tx2, y + H + 0.2, tz2)

    // goteo de bajada hacia rejilla
    const drip = cloud(g, 42, { size: 0.09, color: 0x63c6ff, opacity: 0.8 })
    const dx = bx - side * 2.8, dz = D / 2 + 0.12
    cyl(g, 0.13, 0.13, H + 0.3, M.red(), dx, y + (H + 0.3) / 2, dz)     // bajada pluvial
    up.push((t) => {
      const { pos } = drip
      for (let i = 0; i < 42; i++) {
        const p = cyc(t, 0.55 + (i % 5) * 0.07, i * 0.618)
        pos[i * 3] = dx + Math.sin(i * 2.4) * 0.06
        pos[i * 3 + 1] = y + 1.05 - p * 0.85
        pos[i * 3 + 2] = dz
        if (p > 0.92) pos[i * 3 + 1] = -999
      }
      drip.geo.attributes.position.needsUpdate = true
    })
    // rejilla de drenaje
    box(g, 1.1, 0.14, 1.1, M.dark(), dx, y + 0.07, dz)
    plate(g, 1.3, 1.3, mat(0x0c1a2e, { r: 0.9 }), dx, y + 0.055, dz, { rx: 0, d: 0.02 })

    K.blob(g, bx, 0, 8.6, 6.4, y + 0.01)
    person(g, bx - side * 4.6, -1.6, { ry: side * 1.9 })
    cone(g, bx - side * 5.2, 2.2)

    // --- cisterna, válvulas de seccionamiento y medidor ---
    const cx2 = side * 7.2, cz2 = -3.4
    box(g, 3.6, 1.5, 2.6, M.concrete(), cx2, y + 0.75, cz2)
    box(g, 3.9, 0.16, 2.9, M.concreteDark(), cx2, y + 1.58, cz2)
    edgeBox(g, 3.6, 1.5, 2.6, PAL.padEdge, cx2, y + 0.75, cz2)
    // escotilla + respiradero
    box(g, 0.9, 0.08, 0.7, M.metal(), cx2 - side * 0.8, y + 1.7, cz2 + 0.4)
    cyl(g, 0.1, 0.1, 0.45, M.metal(), cx2 + side * 1.1, y + 1.9, cz2 - 0.6)
    ladder(g, side * 5.3, -3.4, 1.6, side * Math.PI / 2)
    cyl(g, 0.22, 0.22, 1.7, M.red(), side * 9.9, y + 0.85, 1.2)
    flange(g, side * 9.9, y + 0.2, 1.2, { r: 0.3, bolts: 6 })
    valve(g, side * 9.9, y + 1.8, 1.2)
    const med = gauge(g, side * 9.5, y + 1.15, 0.6, { ry: -side * 0.4 })
    up.push((t) => { med.rotation.z = 0.5 + Math.sin(t * 0.9) * 0.24 })
    sign(g, 'AGUA POTABLE', { x: -side * 11.4, y, z: -2.2, ry: -side * 0.5, w: 2.1, h: 0.75, tex: { tone: 'tag' } })
    manhole(g, bx - side * 5.8, 3.6, { y, open: false })
    pallet(g, side * 5.4, y, 3.8, { ry: -side * 0.35, pipes: 3, pr: 0.16, pm: M.white() })
    toolbox(g, bx - side * 3.8, y, 2.8, { ry: side * 1.1 })
  },

  // ---------- 03 · Redes contra incendio ----------
  (ctx) => {
    const { g, y, side, up } = ctx
    const hx = -side * 6.5
    cabin(g, { x: hx, y, z: -2.6, w: 5, h: 3.2, d: 2.6, winRows: 1 })
    // faro pulsante
    const beaconMat = new THREE.MeshStandardMaterial({ color: PAL.red, emissive: PAL.red, emissiveIntensity: 0.8, roughness: 0.35 })
    sph(g, 0.22, beaconMat, hx, y + 3.5, -2.6)
    up.push((t) => { beaconMat.emissiveIntensity = 0.5 + 0.7 * (0.5 + 0.5 * Math.sin(t * 3.2)) })

    // bomba contra incendio sobre skid
    const sx = -side * 3.2
    pumpSkid(g, sx, y, 1.6, { side })
    valve(g, sx + side * 0.85, y + 3.0, 1.6)
    const n1 = gauge(g, sx + side * 0.35, y + 2.35, 2.6, { ry: side * 0.4 })
    const n2 = gauge(g, sx - side * 0.35, y + 2.05, 2.6, { ry: side * 0.6 })
    up.push((t) => { n1.rotation.z = 0.6 + Math.sin(t * 0.8) * 0.28; n2.rotation.z = 0.75 + Math.sin(t * 1.15 + 1) * 0.2 })

    // red aérea de rociadores + hidrante
    const lx = -side * 1.4
    cyl(g, 0.12, 0.12, 8.5, M.white(), lx, y + 4.4, -5, { rz: Math.PI / 2 })
    for (let i = 0; i < 6; i++) sprinkler(g, lx - 4.2 + i * 1.7, y + 4.05, -5)
    hydrant(g, lx + side * 0.2, 6.2)
    cyl(g, 0.14, 0.14, 7.8, M.red(), lx, y + 0.9, 6.2, { rz: Math.PI / 2 })
    cyl(g, 0.14, 0.14, 2.6, M.red(), lx + side * 3.9, y + 2.2, 6.2, { rz: Math.PI / 2 })
    cyl(g, 0.14, 0.14, 2.2, M.red(), lx + side * 3.9, y + 1.1, 6.2)

    K.blob(g, sx, 1.6, 5.4, 3.6, y + 0.01)
    person(g, -side * 1.2, 4.2, { ry: side * 2.6 })
    cone(g, -side * 0.6, 7.6)

    // --- gabinete, ramal de rociadores y aviso de riesgo ---
    hoseCabinet(g, side * 8.4, -4.2, -side * 0.5)
    for (let i = 0; i < 3; i++) sprinkler(g, side * (6.2 + i * 1.7), y + 3.5, -6.4)
    cyl(g, 0.09, 0.09, 4.2, M.red(), side * 8.2, y + 4.05, -6.4, { rz: Math.PI / 2 })
    extinguisher(g, side * 5.2, -5.4)
    flaggingTape(g, side * 9.2, 5.0, 4.2, side * 0.1)
    sign(g, ['CONTRA INCENDIO', 'ZONA RESTRINGIDA'], { x: -side * 11.6, y, z: 1.4, ry: side * 0.45, w: 2.7, h: 1.35, tex: { tone: 'danger', foot: 'NO BLOQUEAR EQUIPO' } })
    // bomba jockey + siamesa / carrete de manguera
    box(g, 1.4, 0.2, 0.9, M.concrete(), sx + side * 3.6, y + 0.1, 3.8)
    cyl(g, 0.28, 0.28, 0.7, M.white(), sx + side * 3.6, y + 0.55, 3.8, { rz: Math.PI / 2 })
    sph(g, 0.3, M.red(), sx + side * 4.1, y + 0.55, 3.8, { sy: 0.85 })
    fieldPanel(g, sx + side * 2.4, y, 3.8, { ry: -side * 0.8, h: 1.35, w: 0.9 })
    reel(g, side * 10.2, y, -1.2, { ry: side * 0.4, hose: M.red() })
    toolbox(g, -side * 4.8, y, 4.8, { ry: side * 0.5 })
  },

  // ---------- 04 · Obras hidráulicas ----------
  (ctx) => {
    const { g, y, side, up } = ctx
    // canal abierto de concreto con agua carmesí
    box(g, 26, 0.7, 0.5, M.concrete(), 0, y + 0.35, -1.7)
    box(g, 26, 0.7, 0.5, M.concrete(), 0, y + 0.35, 1.7)
    box(g, 26, 0.16, 3.4, M.concreteDark(), 0, y + 0.08, 0)
    plate(g, 25.5, 2.5, mat(PAL.red, { r: 0.12, m: 0.18 }), 0, y + 0.2, 0, { rx: 0, d: 0.08 })
    const dashes = []
    for (let i = 0; i < 7; i++) {
      const d = box(g, 1.5, 0.03, 0.16, mat(0x5fa8ff, { r: 0.1, m: 0.2, e: 0x5fa8ff, ei: 0.35 }), -12 + i * 4, y + 0.26, 0)
      dashes.push(d)
    }
    up.push((t, dt) => {
      for (const d of dashes) {
        d.position.x -= dt * 2.4
        if (d.position.x < -12.6) d.position.x = 12.6
      }
    })
    // corte de suelo en los extremos del canal
    soilBlock(g, 2.2, 2.4, 3.4, -14.4, y, 0)
    soilBlock(g, 2.2, 2.4, 3.4, 14.4, y, 0)
    cyl(g, 0.42, 0.42, 3, M.red(), -13.6, y - 0.9, 0, { rz: Math.PI / 2 })
    tor(g, 0.48, 0.08, M.redDeep(), -13.6, y - 0.9, 0, { ry: Math.PI / 2 })

    // excavadora blanca (orugas, cabina, pluma, cucharón)
    const eg = new THREE.Group()
    eg.position.set(side * 7, y, 4.6)
    eg.rotation.y = -side * 2.1
    g.add(eg)
    // orugas
    for (const s of [-1, 1]) {
      box(eg, 2.8, 0.35, 0.55, M.dark(), 0, 0.28, s * 0.95)
      for (const wx of [-1.0, 0, 1.0]) {
        cyl(eg, 0.28, 0.28, 0.22, M.dark(), wx, 0.32, s * 0.95, { rz: Math.PI / 2 })
        cyl(eg, 0.12, 0.12, 0.24, M.metal(), wx, 0.32, s * 0.95, { rz: Math.PI / 2 })
      }
      box(eg, 2.6, 0.08, 0.5, M.metal(), 0, 0.52, s * 0.95)
    }
    box(eg, 1.6, 0.2, 1.5, M.steel(), 0, 0.55, 0)
    // cuerpo + contrapeso
    rbox(eg, 2.5, 1.05, 1.7, 0.12, M.white(), 0, 1.15, -0.05)
    box(eg, 0.9, 0.85, 1.5, M.white2(), 1.35, 1.15, -0.05)
    box(eg, 2.55, 0.08, 0.08, M.red(), 0, 0.7, 0.82)
    // cabina
    rbox(eg, 1.05, 1.0, 1.05, 0.1, M.white(), 0.15, 1.85, 0.55)
    plate(eg, 0.85, 0.55, M.glass(), 0.15, 1.95, 1.1)
    plate(eg, 0.55, 0.5, M.glass(), -0.4, 1.95, 0.55, { ry: Math.PI / 2 })
    plate(eg, 0.55, 0.5, M.glass(), 0.7, 1.95, 0.55, { ry: Math.PI / 2 })
    box(eg, 0.35, 0.12, 0.35, M.dark(), 0.15, 2.4, 0.55)
    // pluma / stick / cucharón
    const boom = box(eg, 2.6, 0.32, 0.28, M.white(), -1.5, 2.55, 0.35)
    boom.rotation.z = -0.75
    const arm = box(eg, 1.7, 0.24, 0.22, M.white(), -2.85, 1.75, 0.35)
    arm.rotation.z = 0.85
    // cilindros hidráulicos
    cyl(eg, 0.06, 0.06, 1.1, M.metal(), -0.6, 2.0, 0.55, { rz: -0.55 })
    cyl(eg, 0.05, 0.05, 0.9, M.metal(), -2.2, 2.15, 0.55, { rz: 0.4 })
    const bucket = new THREE.Group()
    bucket.position.set(-3.45, 1.25, 0.35)
    eg.add(bucket)
    box(bucket, 0.7, 0.5, 0.85, M.dark(), 0, 0.1, 0)
    box(bucket, 0.08, 0.45, 0.85, M.steel(), -0.35, 0.1, 0)
    for (let i = 0; i < 4; i++) box(bucket, 0.12, 0.18, 0.08, M.metal(), -0.42, -0.2, -0.3 + i * 0.2)
    up.push((t) => { boom.rotation.z = -0.75 + Math.sin(t * 0.35) * 0.08 })
    K.blob(g, side * 7, 4.6, 5.4, 4.2, y + 0.01)

    // tuberías de concreto apiladas (campana / espiga)
    for (let i = 0; i < 3; i++) {
      const px = -side * 8 + (i % 2) * 0.4, py = y + 0.75 + Math.floor(i / 2) * 1.5, pz = -6 + i * 0.1
      cyl(g, 0.75, 0.75, 2.2, M.white(), px, py, pz, { rz: Math.PI / 2 })
      tor(g, 0.82, 0.08, M.concreteDark(), px - 1.0, py, pz, { ry: Math.PI / 2 })
      tor(g, 0.7, 0.05, M.redDeep(), px + 1.05, py, pz, { ry: Math.PI / 2 })
    }

    // barreras y equipo
    for (let i = 0; i < 3; i++) {
      const bar = box(g, 1.6, 0.16, 0.12, M.white(), -6 + i * 5.5, y + 0.55, 2.6)
      cyl(g, 0.05, 0.05, 0.55, M.white(), -6 + i * 5.5, y + 0.28, 2.6)
      plate(g, 0.8, 0.16, 0.02, M.red(), -6 + i * 5.5, y + 0.55, 2.68, { d: 0.03 })
    }
    person(g, -side * 4.4, 3.2, { ry: side * 1.4 })
    cone(g, -3, 2.8); cone(g, 3.5, 2.8)

    // --- cárcamo de bombeo + aireadores de PTAR ---
    const cx4 = side * 8.6, cz4 = -4.8
    box(g, 3.6, 1.0, 2.8, M.concrete(), cx4, y + 0.5, cz4)
    edgeBox(g, 3.6, 1.0, 2.8, PAL.padEdge, cx4, y + 0.5, cz4)
    // reja / grating
    for (let i = 0; i < 7; i++) box(g, 3.2, 0.04, 0.06, M.metal(), cx4, y + 1.02, cz4 - 1.1 + i * 0.35)
    cyl(g, 1.2, 1.2, 0.7, mat(PAL.red, { r: 0.2, m: 0.1 }), cx4, y + 0.45, cz4, { seg: 22 })
    // bomba sumergible + guías
    cyl(g, 0.32, 0.32, 1.4, M.white(), cx4 + side * 1.1, y + 1.3, cz4 + 0.6)
    box(g, 0.5, 0.2, 0.5, M.metal(), cx4 + side * 1.1, y + 2.05, cz4 + 0.6)
    for (const s of [-1, 1]) cyl(g, 0.04, 0.04, 2.2, M.metal(), cx4 + side * 1.1 + s * 0.28, y + 1.3, cz4 + 0.6)
    cyl(g, 0.12, 0.12, 1.6, M.red(), cx4 + side * 1.1, y + 2.4, cz4 + 0.6)
    flange(g, cx4 + side * 1.1, y + 3.25, cz4 + 0.6, { r: 0.2, bolts: 4 })
    for (const s of [-1, 1]) cyl(g, 0.05, 0.05, 0.8, M.metal(), cx4 + s * 1.7, y + 1.3, cz4 - 1.3)
    box(g, 3.4, 0.06, 0.06, M.metal(), cx4, y + 1.7, cz4 - 1.3)
    for (let i = 0; i < 3; i++) {
      const ax = side * (11.4 + i * 1.1), az = 1.6 - i * 0.9
      box(g, 0.2, 0.08, 0.2, M.concrete(), ax, y + 0.04, az)
      cyl(g, 0.05, 0.05, 0.85, M.metal(), ax, y + 0.5, az)
      sph(g, 0.18, mat(PAL.redSoft, { r: 0.25, m: 0.1 }), ax, y + 0.95, az)
      // disco aireador
      cyl(g, 0.35, 0.35, 0.04, M.metal(), ax, y + 0.12, az)
    }
    sign(g, ['ZONA DE OBRA', 'NO PASAR'], { x: -side * 12, y, z: 4.4, ry: -side * 0.5, w: 3.0, h: 1.5, tex: { tone: 'warn', foot: 'CASCO OBLIGATORIO' } })
    surveyTripod(g, -side * 2.2, -4.8, { y })
    pallet(g, -side * 10.4, y, -3.2, { ry: 0.4, pipes: 2, pr: 0.42, pm: M.concrete(), w: 2.6, d: 1.6 })
    toolbox(g, side * 4.2, y, 5.6, { ry: -side * 0.7 })
    drum(g, side * 3.2, y, 5.2)
  },

  // ---------- 05 · Detección de fugas ----------
  (ctx) => {
    const { g, y, side, up } = ctx
    const px = -side * 5.5

    // cepa de prueba en corte escalonado: la tubería queda sobre el banquito
    const CW = 5.4, CD = 4.2, CH = 2.8
    const rearL = [0.9, 0.8, 0.7, 0.4]
    let acc = 0
    rearL.forEach((lh, li) => {
      box(g, CW / 2, lh, CD, M.soil(li), px + CW / 4, y - acc - lh / 2, 0.4)
      acc += lh
    })
    edgeBox(g, CW / 2, CH, CD, PAL.soilLine, px + CW / 4, y - CH / 2, 0.4)
    box(g, CW / 2, 0.45, CD, M.soil(0), px - CW / 4, y - 0.225, 0.4)
    box(g, CW / 2, 0.35, CD, M.soil(1), px - CW / 4, y - 0.625, 0.4)
    edgeBox(g, CW / 2, 0.8, CD, PAL.soilLine, px - CW / 4, y - 0.4, 0.4)
    // tubería expuesta sobre cepos, entrando al frente de sección
    const jx = px - 1.35
    cyl(g, 0.35, 0.35, 4.6, M.red(), px - 0.6, y - 0.48, 0.4, { rz: Math.PI / 2 })
    tor(g, 0.46, 0.08, M.redDeep(), jx, y - 0.48, 0.4, { ry: Math.PI / 2 })
    box(g, 0.32, 0.3, 0.5, M.concrete(), px - 2.4, y - 0.72, 0.4)
    box(g, 0.32, 0.3, 0.5, M.concrete(), px - 0.2, y - 0.72, 0.4)

    // aspersión de la fuga
    const leak = cloud(g, 46, { size: 0.08, color: PAL.red, opacity: 0.9 })
    up.push((t) => {
      const { pos } = leak
      for (let i = 0; i < 46; i++) {
        const p = cyc(t, 0.6, i * 0.618)
        pos[i * 3] = jx + 0.02 + Math.sin(p * 9 + i) * 0.22 * p
        pos[i * 3 + 1] = y - 0.4 + p * 2.6
        pos[i * 3 + 2] = 0.4 + Math.cos(p * 7 + i * 2) * 0.2 * p
        if (p > 0.85) pos[i * 3 + 1] = -999
      }
      leak.geo.attributes.position.needsUpdate = true
    })

    // anillos de barrido sobre la fuga
    const rings = []
    for (let i = 0; i < 3; i++) {
      const rm = new THREE.MeshBasicMaterial({ color: PAL.red, transparent: true, opacity: 0 })
      const r = tor(g, 0.6, 0.05, rm, px, y + 0.06, 0.4, { rx: Math.PI / 2 })
      rings.push({ r, rm })
    }
    up.push((t) => {
      rings.forEach(({ r, rm }, i) => {
        const p = cyc(t, 0.22, i / 3)
        r.scale.setScalar(0.6 + p * 9)
        rm.opacity = (1 - p) * 0.5
      })
    })

    // técnico con geófono y monitor
    const tg = person(g, px - side * 1.4, -1.8, { ry: side * 2.9 })
    cyl(g, 0.03, 0.03, 1.5, M.metal(), px - side * 1.0, y + 0.9, -1.5, { rz: side * 0.3 })
    tor(g, 0.26, 0.04, M.metal(), px - side * 0.78, y + 0.35, -1.6, { rx: Math.PI / 2.4 })
    // carrito de monitor con ruedas
    const cxm = px - side * 2.6
    box(g, 1.15, 0.85, 0.75, M.white(), cxm, y + 0.7, 2.6)
    edgeBox(g, 1.15, 0.85, 0.75, PAL.metalDark, cxm, y + 0.7, 2.6)
    for (const [wx, wz] of [[-0.4, 0.28], [0.4, 0.28], [-0.4, -0.28], [0.4, -0.28]]) {
      cyl(g, 0.1, 0.1, 0.08, M.dark(), cxm + wx, y + 0.12, 2.6 + wz, { rz: Math.PI / 2 })
    }
    box(g, 0.3, 0.08, 0.5, M.metal(), cxm + side * 0.55, y + 0.95, 2.6)
    holo(g, 1.15, 0.62, { tex: K.texWave(), x: cxm, y: y + 1.55, z: 2.6, ry: -side * 0.5, tilt: -0.12 })
    person(g, px + side * 3, 3.4, { ry: -side * 2.2 })
    cone(g, px - side * 4, 2.4); cone(g, px + side * 1.5, -3.6)
    K.blob(g, px, 0.4, 8, 6, y + 0.01)

    // --- correlador acústico + toma clandestina detectada ---
    const cxc = side * 8.8
    box(g, 1.05, 0.45, 0.7, M.dark(), cxc, y + 0.28, -4.6)
    for (const s of [-1, 1]) cyl(g, 0.08, 0.08, 0.06, M.metal(), cxc + s * 0.35, y + 0.1, -4.3, { rz: Math.PI / 2 })
    box(g, 0.2, 0.12, 0.15, M.red(), cxc + 0.35, y + 0.55, -4.35)
    box(g, 0.2, 0.12, 0.15, M.white2(), cxc - 0.35, y + 0.55, -4.35)
    const feed = holo(g, 1.5, 0.95, { tex: K.texWave(), x: cxc, y: y + 1.35, z: -4.6, ry: -side * 0.4, tilt: -0.1 })
    up.push((t) => { feed.material.opacity = 0.78 + 0.14 * Math.sin(t * 1.2) })
    for (const s of [-1, 1]) {
      cyl(g, 0.04, 0.04, 0.7, M.metal(), cxc + s * 1.5, y + 0.35, -3.4)
      sph(g, 0.12, M.red(), cxc + s * 1.5, y + 0.75, -3.4)
      tube(g, [V(cxc + s * 0.4, y + 0.45, -4.5), V(cxc + s * 1.0, y + 0.3, -4.0), V(cxc + s * 1.5, y + 0.55, -3.4)], 0.025, M.dark())
    }
    // by-pass clandestino: derivación con válvula sobre la línea
    cyl(g, 0.16, 0.16, 2.8, M.red(), side * 11.2, y + 0.5, 1.4, { rz: Math.PI / 2 })
    cyl(g, 0.15, 0.15, 1.1, M.redDeep(), side * 11.2, y + 1.0, 1.4)
    valve(g, side * 11.2, y + 1.6, 1.4, { r: 0.3 })
    sign(g, ['FUGA DETECTADA', 'PASO CON PRECAUCIÓN'], { x: -cxc, y, z: -6.6, ry: -side * 0.35, w: 3.0, h: 1.4, tex: { tone: 'warn', foot: 'TRABAJOS DE LOCALIZACIÓN' } })
    manhole(g, px + side * 4.6, -3.8, { y, open: false })
    toolbox(g, px - side * 3.4, y, 1.4, { ry: side * 0.8 })
    surveyTripod(g, side * 6.4, 2.8, { y })
  },

  // ---------- 06 · Video inspección ----------
  (ctx) => {
    const { g, y, side, up } = ctx
    const AXIS_Y = y + 3.4
    const R = 3.2

    // tubería inspeccionable sobre durmientes (piel de soldaduras pintada)
    const pipeMat = new THREE.MeshStandardMaterial({ color: PAL.white2, roughness: 0.75, metalness: 0.05, side: THREE.DoubleSide })
    const tTube = K.texTube()
    if (tTube) { pipeMat.map = tTube; pipeMat.needsUpdate = true }
    const bigPipe = cyl(g, R, R, 30, pipeMat, 0, AXIS_Y, 0, { rx: Math.PI / 2, seg: 40, open: true })
    tor(g, R + 0.05, 0.16, M.red(), 0, AXIS_Y, 15)                    // brida de la boca
    tor(g, R + 0.05, 0.16, M.metal(), 0, AXIS_Y, -15)                 // brida lejana
    for (let z = -12; z <= 6; z += 6) tor(g, 2.9, 0.07, M.red(), 0, AXIS_Y, z)  // marcos de inspección
    box(g, 4.6, 0.12, 29, mat(0x0c1a2e, { r: 0.85 }), 0, AXIS_Y - R + 0.24, 0)  // cama de riel
    plate(g, 4.4, 29, mat(PAL.red, { r: 0.12, m: 0.2 }), 0, AXIS_Y - R + 0.34, 0, { rx: Math.PI / 2, d: 0.05 }) // pista carmesí
    for (let z = -14; z <= 14; z += 7) box(g, 7, 0.5, 1.6, M.concrete(), 0, y + 0.25, z)
    for (const s of [-1, 1]) box(g, 4.2, 0.36, 2.8, M.concrete(), 0, y + 0.18, s * 12.5) // cunas de boca

    // disco de luz al fondo del tubo (destino del vuelo)
    const glowMat = new THREE.MeshStandardMaterial({ color: 0x63c6ff, emissive: 0x63c6ff, emissiveIntensity: 0.8, roughness: 0.3 })
    cyl(g, 2.5, 2.5, 0.06, glowMat, 0, AXIS_Y, -14.6, { rx: Math.PI / 2 })
    up.push((t) => { glowMat.emissiveIntensity = 0.62 + 0.26 * Math.sin(t * 1.8) })

    // crawler con cámara (orugas, carrete, yugo)
    const cg = new THREE.Group()
    cg.position.set(0, AXIS_Y - R + 0.75, -2)
    g.add(cg)
    rbox(cg, 1.15, 0.5, 1.75, 0.08, M.white(), 0, 0.5, 0)
    edgeBox(cg, 1.15, 0.5, 1.75, PAL.metalDark, 0, 0.5, 0)
    // orugas
    for (const s of [-1, 1]) {
      box(cg, 0.22, 0.35, 1.7, M.dark(), s * 0.62, 0.22, 0)
      for (const wz0 of [-0.55, 0, 0.55]) {
        cyl(cg, 0.16, 0.16, 0.14, M.metal(), s * 0.62, 0.22, wz0, { rz: Math.PI / 2 })
      }
    }
    // carrete trasero
    for (const s of [-1, 1]) cyl(cg, 0.22, 0.22, 0.08, M.metal(), s * 0.28, 0.55, 0.95, { rx: Math.PI / 2 })
    cyl(cg, 0.08, 0.08, 0.55, M.dark(), 0, 0.55, 0.95, { rx: Math.PI / 2 })
    // yugo de cámara
    box(cg, 0.35, 0.2, 0.2, M.dark(), 0, 0.85, -0.85)
    box(cg, 0.42, 0.38, 0.38, M.red(), 0, 0.72, -1.05)
    cyl(cg, 0.12, 0.12, 0.14, M.dark(), 0, 0.72, -1.28, { rx: Math.PI / 2 })
    tor(cg, 0.14, 0.02, M.metal(), 0, 0.72, -1.2, { rx: Math.PI / 2 })
    const lampMat = new THREE.MeshStandardMaterial({ color: 0xdceaff, emissive: 0xbfd8ff, emissiveIntensity: 1.4, roughness: 0.3 })
    sph(cg, 0.07, lampMat, -0.18, 0.82, -1.1)
    sph(cg, 0.07, lampMat, 0.18, 0.82, -1.1)
    tor(cg, 0.09, 0.015, M.metal(), -0.18, 0.82, -1.1, { rx: Math.PI / 2 })
    tor(cg, 0.09, 0.015, M.metal(), 0.18, 0.82, -1.1, { rx: Math.PI / 2 })
    const spot = new THREE.SpotLight(0xbfd8ff, 260, 26, 0.46, 0.6, 1.3)
    spot.position.set(0, 0.62, -1.1)
    const tgt = new THREE.Object3D()
    tgt.position.set(0, -0.1, -8)
    cg.add(spot); cg.add(tgt)
    spot.target = tgt
    const setCable = dynamicRod(g, 0.045, M.red())
    up.push((t) => {
      cg.position.z = -2 + Math.sin(t * 0.22) * 5.5
      setCable(V(0, AXIS_Y - R + 1.15, cg.position.z + 0.95), V(0, AXIS_Y + R - 0.2, 14.2))
    })

    // ---- campamento de inspección junto a la boca ----
    // consola del operador con feed de video
    box(g, 1.9, 0.9, 1.0, M.white(), side * 7.4, y + 0.45, 14.4)
    holo(g, 1.6, 1.0, { tex: K.texCam(), x: side * 7.4, y: y + 1.75, z: 14.4, tilt: -0.12, ry: -side * 0.35 })
    person(g, side * 6.2, 13.4, { ry: side * 2.1 })
    // carrete de cable y manguera
    for (const s of [-1, 1]) cyl(g, 0.62, 0.62, 0.12, M.metal(), side * 9.6 + s * 0.55, y + 0.55, 11.8, { rx: Math.PI / 2 })
    cyl(g, 0.16, 0.16, 1.1, M.dark(), side * 9.6, y + 0.55, 11.8, { rx: Math.PI / 2 })
    tor(g, 0.55, 0.06, M.red(), side * 9.0, y + 0.28, 12.7)            // rollo de manguera
    // generador portátil
    box(g, 1.2, 0.85, 0.75, M.white2(), side * 10.6, y + 0.42, 10.2)
    for (const s of [-1, 1]) box(g, 0.03, 0.4, 0.78, M.dark(), side * 10.6 + s * 0.34, y + 0.46, 10.2)
    box(g, 1.22, 0.06, 0.06, M.red(), side * 10.6, y + 0.55, 10.6)
    // torreta de iluminación
    cyl(g, 0.055, 0.055, 3.4, M.metal(), side * 11.8, y + 1.7, 13.6)
    box(g, 0.55, 0.32, 0.3, M.white(), side * 11.45, y + 3.45, 13.7)
    box(g, 0.06, 0.2, 0.22, glowMat, side * 11.14, y + 3.45, 13.7)     // foco encendido
    // utilería de boca
    box(g, 0.8, 0.5, 0.5, M.dark(), side * 13.4, y + 0.25, 14.2)
    box(g, 0.86, 0.06, 0.56, M.white2(), side * 13.4, y + 0.53, 14.2)
    person(g, side * 12.2, 13.4, { ry: -side * 1.6 })
    cone(g, side * 11, 15)
    cone(g, side * 8.8, 15.4)
    K.blob(g, side * 7.4, 14.4, 3.2, 2.6, y + 0.01)
    K.blob(g, 0, 15.6, 9, 5, y + 0.01)

    // --- odómetro de inspección + rotulación del punto ---
    cyl(g, 0.42, 0.42, 0.12, M.white(), -side * 5.4, y + 0.64, 12.4, { rx: Math.PI / 2 })
    cyl(g, 0.06, 0.06, 1.2, M.metal(), -side * 5.4, y + 0.95, 12.4)
    box(g, 0.5, 0.34, 0.4, M.dark(), -side * 5.4, y + 1.62, 12.4)
    sign(g, ['PUNTO DE INSPECCIÓN', 'TUBERÍA EN SERVICIO'], { x: -side * 7.6, y, z: 13.2, ry: side * 0.35, w: 3.2, h: 1.5, foot: 'SOLO PERSONAL AUTORIZADO' })
    manhole(g, -side * 4.2, 16.2, { y, r: 0.65 })
    toolbox(g, side * 5.2, y, 15.6, { ry: -side * 0.4 })
    reel(g, -side * 8.8, y, 11.6, { ry: 0.6, hose: M.dark() })
  },

  // ---------- 07 · Desazolve Vactor ----------
  (ctx) => {
    const { g, y, side, up } = ctx
    // pavimento de servicio
    box(g, 22, 0.1, 9, mat(PAL.pad, { r: 0.92 }), 0, y + 0.05, 1)
    edgeBox(g, 22, 0.1, 9, PAL.padEdge, 0, y + 0.05, 1)

    // camión Vactor blanco (detallado: cristales, faros, espejos, chevrones)
    const tg = new THREE.Group()
    tg.position.set(side * 5.5, y, 0.6)
    tg.rotation.y = side * 1.5
    g.add(tg)
    box(tg, 9, 0.4, 1.9, M.dark(), 0, 0.75, 0)                     // chasis
    rbox(tg, 1.9, 1.75, 1.85, 0.16, M.white(), -3.4, 1.85, 0)     // cabina
    plate(tg, 1.55, 0.62, M.glass(), -4.41, 2.15, 0, { ry: Math.PI / 2 })  // parabrisas
    plate(tg, 0.95, 0.55, M.glass(), -3.4, 2.05, 0.96)             // ventanillas laterales
    plate(tg, 0.95, 0.55, M.glass(), -3.4, 2.05, -0.96)
    box(tg, 0.15, 0.3, 1.95, M.metal(), -4.5, 0.8, 0)              // defensa
    box(tg, 0.06, 0.14, 0.34, M.white(), -4.43, 0.95, 0.6)         // faros
    box(tg, 0.06, 0.14, 0.34, M.white(), -4.43, 0.95, -0.6)
    box(tg, 0.03, 1.15, 0.02, mat(PAL.metalDark, { r: 0.5 }), -3.0, 1.75, 0.94) // junta de puerta
    box(tg, 0.04, 0.1, 0.03, M.white2(), -3.05, 1.7, 0.96)         // manija
    for (const s of [-1, 1]) {
      cyl(tg, 0.02, 0.02, 0.3, M.metal(), -4.28, 2.3, s * 0.99, { rz: Math.PI / 2.4 })
      box(tg, 0.16, 0.11, 0.04, M.white(), -4.36, 2.3, s * 1.0)    // espejos
    }
    cyl(tg, 1.05, 1.05, 4.8, M.white(), 0.6, 2.15, 0, { rz: Math.PI / 2 })  // tanque
    tor(tg, 1.08, 0.05, M.red(), -1.8, 2.15, 0, { ry: Math.PI / 2 })       // tapas del tanque
    tor(tg, 1.08, 0.05, M.red(), 3.0, 2.15, 0, { ry: Math.PI / 2 })
    tor(tg, 1.08, 0.035, M.red(), 0.6, 2.15, 0, { ry: Math.PI / 2 })       // cincho
    box(tg, 2.4, 1.15, 1.9, M.white2(), 3.2, 1.65, 0)              // compartimento
    box(tg, 0.05, 0.12, 0.3, M.red(), 4.42, 1.05, 0.6)             // calaveras
    box(tg, 0.05, 0.12, 0.3, M.red(), 4.42, 1.05, -0.6)
    for (const s of [-1, 0, 1]) {
      const chv = box(tg, 0.04, 0.85, 0.1, M.red(), 4.44, 1.62, s * 0.52)
      chv.rotation.x = s * 0.55                                    // chevrones
    }
    for (const s of [-1, 1]) plate(tg, 1.7, 0.5, M.dark(), -2.55, 0.85, s * 1.0, { d: 0.03 }) // salpicaderas
    for (const [wx, wz] of [[-3.3, 1], [-0.8, 1], [1.9, 1], [3.8, 1], [-3.3, -1], [-0.8, -1], [1.9, -1], [3.8, -1]]) {
      cyl(tg, 0.52, 0.52, 0.4, M.dark(), wx, 0.52, wz, { rx: Math.PI / 2 })
      cyl(tg, 0.22, 0.22, 0.42, M.metal(), wx, 0.52, wz, { rx: Math.PI / 2 }) // rines
    }
    const bcMat = new THREE.MeshStandardMaterial({ color: PAL.red, emissive: PAL.red, emissiveIntensity: 0.8, roughness: 0.35 })
    cyl(tg, 0.09, 0.09, 0.14, bcMat, -3.4, 2.85, 0, { rx: Math.PI / 2 })
    up.push((t) => { bcMat.emissiveIntensity = 0.5 + 0.8 * (0.5 + 0.5 * Math.sin(t * 2.6)) })
    // brazo articulado + manguera al pozo + registro de tanque
    const boom1 = box(tg, 1.8, 0.2, 0.2, M.metal(), 0.6, 3.2, -0.7)
    boom1.rotation.z = -0.25
    const boom2 = box(tg, 1.6, 0.16, 0.16, M.metal(), 2.0, 3.55, -1.1)
    boom2.rotation.z = -0.55
    box(tg, 0.28, 0.28, 0.28, M.dark(), 1.4, 3.45, -0.9)
    cyl(tg, 0.35, 0.35, 0.12, M.metal(), 0.4, 3.35, 0.7) // manway
    ladder(tg, 3.6, 0.9, 2.2, Math.PI / 2)
    tube(tg, [V(2.6, 3.3, -1.3), V(1.0, 2.4, -1.8), V(-1.5, 1.2, -0.4)], 0.1, M.red())
    K.blob(g, side * 5.5, 0.6, 11.5, 5.5, y + 0.12)

    // pozo de visita con sedimento
    const mx = -side * 2.6, mz = 2.2
    manhole(g, mx, mz, { y, r: 0.85, lidX: -side * 1.5, lidZ: 1.2 })
    // red expuesta bajo el pozo (corte somero)
    soilBlock(g, 3.4, 1.3, 3, mx - side * 1.2, y, mz + 1.8)
    cyl(g, 0.34, 0.34, 3.6, M.red(), mx - side * 1.2, y - 0.75, mz + 1.8, { rz: Math.PI / 2 })
    flange(g, mx - side * 1.2 - 1.5, y - 0.75, mz + 1.8, { r: 0.4, ry: Math.PI / 2, bolts: 6 })
    cyl(g, 0.2, 0.2, 1.2, M.red(), mx - side * 1.2, y - 0.4, mz + 1.3)

    // remolino de succión hacia la manguera
    const suc = cloud(g, 60, { size: 0.1, color: 0x3e8bff, opacity: 0.9 })
    const stw = new THREE.Vector3().copy(tg.position).add(V(-side * 1.2, 4.4, 0))
    up.push((t) => {
      const { pos } = suc
      const ax = mx, az = mz, bx2 = stw.x, bz2 = stw.z
      for (let i = 0; i < 60; i++) {
        const p = cyc(t, 0.5, i * 0.618)
        const sway = Math.sin(p * Math.PI)
        pos[i * 3] = ax + (bx2 - ax) * p + Math.sin(i * 3.1) * 0.14 * sway
        pos[i * 3 + 1] = y + 0.15 + p * 4.1
        pos[i * 3 + 2] = az + (bz2 - az) * p + Math.cos(i * 2.7) * 0.14 * sway
        if (p > 0.9) pos[i * 3 + 1] = -999
      }
      suc.geo.attributes.position.needsUpdate = true
    })
    // vapor
    const steam = cloud(g, 30, { size: 0.24, color: 0x9fb6d8, opacity: 0.4 })
    up.push((t) => {
      const { pos } = steam
      for (let i = 0; i < 30; i++) {
        const p = cyc(t, 0.16, i * 0.37)
        pos[i * 3] = mx + Math.sin(i * 5.3) * (0.2 + p * 1.4)
        pos[i * 3 + 1] = y + 0.3 + p * 2.6
        pos[i * 3 + 2] = mz + Math.cos(i * 4.1) * (0.2 + p * 1.4)
        if (p > 0.8) pos[i * 3 + 1] = -999
      }
      steam.geo.attributes.position.needsUpdate = true
    })

    person(g, mx - side * 2.6, -1.4, { ry: side * 2.2 })
    cone(g, mx - side * 4.5, 4.6); cone(g, mx + side * 2.5, 6.2)

    // --- jetter de alta presión + lanza de succión rotulada ---
    const jx7 = side * 9.8, jz7 = -3.4
    for (const s of [-1, 1]) cyl(g, 0.75, 0.75, 0.14, M.metal(), jx7 + s * 0.62, y + 0.82, jz7, { rx: Math.PI / 2 })
    cyl(g, 0.2, 0.2, 1.26, M.dark(), jx7, y + 0.82, jz7, { rx: Math.PI / 2 })
    cyl(g, 0.1, 0.1, 3.4, M.red(), jx7 - side * 1.9, y + 0.32, jz7 + 1.8, { rz: Math.PI / 2 })
    cyl(g, 0.26, 0.26, 1.5, M.metal(), side * 5.6, y + 1.15, -2.6)
    tor(g, 0.32, 0.06, M.redDeep(), side * 5.6, y + 1.9, -2.6, { ry: Math.PI / 2 })
    valve(g, side * 5.6, y + 2.2, -2.6, { r: 0.28 })
    sign(g, ['DESAZOLVE', 'UNIDAD EN OPERACIÓN'], { x: -side * 11.8, y, z: 4.4, ry: -side * 0.5, w: 3.2, h: 1.5, tex: { tone: 'warn', foot: 'NO REBASAR EL ACORDONAMIENTO' } })
    // pila de lodo / spoils + utilería
    soilBlock(g, 2.2, 0.9, 1.8, -side * 8.4, y + 0.9, -3.6)
    drum(g, -side * 9.6, y, -2.4, { m: M.dark() })
    toolbox(g, mx + side * 3.2, y, mz - 2.8, { ry: -side * 0.5 })
    fieldPanel(g, side * 11.4, y, 1.8, { ry: -side * 1.2, h: 1.4 })
  },
  // ---------- 08 · Calidad de agua y piezometría ----------
  (ctx) => {
    const { g, y, side, up } = ctx

    // —— laboratorio de campo ——
    cabin(g, { x: -side * 7.2, y, z: -3.2, w: 5.4, h: 3.0, d: 2.8, winRows: 1 })
    // mesa de trabajo con instrumentos
    const bx = -side * 3.2
    for (const [lx, lz] of [[-1.3, -0.45], [1.3, -0.45], [-1.3, 0.45], [1.3, 0.45]]) {
      box(g, 0.1, 0.8, 0.1, M.metal(), bx + lx, y + 0.4, lz)
    }
    box(g, 3.4, 0.12, 1.3, M.white(), bx, y + 0.86, 0)
    edgeBox(g, 3.4, 0.12, 1.3, PAL.metalDark, bx, y + 0.86, 0)
    // vasos / matraces con muestras
    for (let i = 0; i < 4; i++) {
      const fx = bx - 1.2 + i * 0.7
      cyl(g, 0.16, 0.2, 0.42, M.glass(), fx, y + 1.2, -0.15)
      cyl(g, 0.12, 0.12, 0.22, mat(i % 2 ? PAL.redSoft : 0x5fa8ff, { r: 0.2, op: 0.8 }), fx, y + 1.1, -0.15)
    }
    // medidor multiparámetro + sonda
    box(g, 0.55, 0.35, 0.4, M.dark(), bx + 1.1, y + 1.1, 0.25)
    plate(g, 0.4, 0.22, M.glass(), bx + 1.1, y + 1.3, 0.4)
    cyl(g, 0.04, 0.04, 0.7, M.metal(), bx + 1.35, y + 1.15, 0.55, { rx: 0.6 })
    // agitador / rack de tubos
    box(g, 0.7, 0.25, 0.45, M.white2(), bx - 1.0, y + 1.05, 0.35)
    for (let i = 0; i < 6; i++) cyl(g, 0.04, 0.04, 0.35, M.glass(), bx - 1.2 + (i % 3) * 0.18, y + 1.3, 0.25 + Math.floor(i / 3) * 0.2)
    // estante de reactivos
    box(g, 1.6, 1.5, 0.35, M.white2(), -side * 5.4, y + 1.0, 1.4)
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
      cyl(g, 0.08, 0.08, 0.28, c % 2 ? M.red() : M.white(), -side * 5.4 - 0.5 + c * 0.32, y + 0.55 + r * 0.4, 1.5)
    }
    // refrigerador / hielera de cadena de custodia
    box(g, 1.3, 1.6, 0.9, M.white2(), -side * 1.0, y + 0.85, 2.6)
    edgeBox(g, 1.3, 1.6, 0.9, PAL.metalDark, -side * 1.0, y + 0.85, 2.6)
    box(g, 1.15, 0.08, 0.04, M.red(), -side * 1.0, y + 1.5, 3.08)
    box(g, 0.1, 0.2, 0.06, M.metal(), -side * 0.5, y + 0.9, 3.08)
    for (let i = 0; i < 3; i++) {
      cyl(g, 0.12, 0.12, 0.35, M.glass(), -side * 1.0 - 0.3 + i * 0.3, y + 0.35, 2.9)
      cyl(g, 0.08, 0.08, 0.08, M.white2(), -side * 1.0 - 0.3 + i * 0.3, y + 0.55, 2.9)
    }
    person(g, bx - side * 0.4, 1.4, { ry: side * 2.2 })
    K.blob(g, -side * 5, -1, 9, 6, y + 0.01)

    // —— red de piezómetros (2 pozos + corte) ——
    const qx = side * 4.5
    // pozo A: corte con nivel freático
    soilBlock(g, 2.8, 3.0, 2.8, qx, y, 3.2)
    plate(g, 0.16, 2.4, M.white(), qx - side * 1.42, y - 1.2, 3.2, { d: 0.03 })
    plate(g, 0.1, 1.0, mat(PAL.red, { r: 0.12, m: 0.15, op: 0.9 }), qx - side * 1.46, y - 1.1, 3.2, { d: 0.03 })
    cyl(g, 0.16, 0.16, 1.2, M.white(), qx, y + 0.15, 3.2)
    // cabezal + candado + sonda
    box(g, 0.45, 0.14, 0.45, M.metal(), qx, y + 0.85, 3.2)
    box(g, 0.12, 0.16, 0.1, M.dark(), qx + 0.15, y + 1.0, 3.2)
    for (let i = 0; i < 3; i++) {
      const leg = cyl(g, 0.035, 0.035, 2.0, M.metal(), qx + Math.cos(i * 2.09) * 0.48, y + 1.05, 3.2 + Math.sin(i * 2.09) * 0.48)
      leg.rotation.x = Math.sin(i * 2.09) * 0.3
      leg.rotation.z = -Math.cos(i * 2.09) * 0.3
    }
    cyl(g, 0.03, 0.03, 2.4, M.red(), qx, y + 0.5, 3.2)
    const nd = gauge(g, qx, y + 1.85, 3.2)
    up.push((t) => { nd.rotation.z = 0.5 + Math.sin(t * 0.5) * 0.28 })
    holo(g, 2.0, 1.25, { tex: K.texChart(), x: qx - side * 0.5, y: y + 3.2, z: 3.2, ry: -side * 0.4, op: 0.86 })

    // pozo B: cabezal de monitoreo en superficie
    const qx2 = side * 8.6, qz2 = 0.8
    box(g, 1.2, 0.2, 1.2, M.concrete(), qx2, y + 0.1, qz2)
    cyl(g, 0.28, 0.28, 0.7, M.white(), qx2, y + 0.55, qz2)
    tor(g, 0.3, 0.04, M.red(), qx2, y + 0.9, qz2, { rx: Math.PI / 2 })
    box(g, 0.5, 0.12, 0.5, M.metal(), qx2, y + 1.0, qz2)
    box(g, 0.1, 0.14, 0.08, M.dark(), qx2 + 0.18, y + 1.1, qz2)
    cyl(g, 0.04, 0.04, 1.4, M.metal(), qx2, y + 1.75, qz2)
    box(g, 0.35, 0.25, 0.3, M.dark(), qx2, y + 2.5, qz2)
    gauge(g, qx2 + side * 0.5, y + 2.0, qz2, { ry: -side * 0.5 })

    // kit de campo abierto
    box(g, 1.2, 0.35, 0.7, M.dark(), side * 7.2, y + 0.2, -3.4)
    box(g, 1.15, 0.06, 0.65, M.red(), side * 7.2, y + 0.4, -3.4)
    for (let i = 0; i < 3; i++) cyl(g, 0.1, 0.1, 0.3, M.glass(), side * 6.8 + i * 0.3, y + 0.55, -3.4)
    plate(g, 0.35, 0.22, M.glass(), side * 7.6, y + 0.55, -3.2)
    person(g, qx + side * 1.6, 2.0, { ry: -side * 1.5 })
    person(g, qx2 - side * 1.4, qz2 + 1.2, { ry: side * 0.8 })

    drum(g, side * 10.2, y, -2.8, { m: M.white2(), h: 0.85 })
    drum(g, side * 11.0, y, -2.5, { m: M.dark(), h: 0.75, r: 0.32 })
    toolbox(g, -side * 4.6, y, 2.2, { ry: side * 0.4 })
    cone(g, qx - side * 2.4, 5.2)
    cone(g, qx2 + side * 1.8, -1.2)
    sign(g, ['LABORATORIO', 'MUESTREO Y PIEZOMETRÍA'], { x: -side * 10.4, y, z: -5.4, ry: side * 0.4, w: 3.2, h: 1.5, foot: 'CADENA DE CUSTODIA' })
    K.blob(g, qx, 3.2, 5, 5, y + 0.01)
    K.blob(g, qx2, qz2, 3.5, 3.5, y + 0.01)
  },

  // ---------- 09 · Estructuras metálicas ----------
  (ctx) => {
    const { g, y, side, up } = ctx
    // nave a medio construir (placas base, rigidizadores, diagonales)
    const bx = -side * 4
    const colX = [-5, -1.6, 1.8, 5.2]
    for (const cx0 of colX) for (const cz0 of [-3, 3]) {
      box(g, 0.7, 0.12, 0.7, M.concrete(), bx + cx0, y + 0.06, cz0)
      box(g, 0.42, 5.6, 0.42, M.white(), bx + cx0, y + 2.8, cz0)
      // rigidizadores de base
      for (const s of [-1, 1]) box(g, 0.08, 0.45, 0.35, M.steel(), bx + cx0 + s * 0.28, y + 0.35, cz0)
    }
    for (const cz0 of [-3, 3]) {
      box(g, 5.4, 0.34, 0.3, M.white(), bx - 3.3, y + 5.75, cz0)
      box(g, 5.4, 0.34, 0.3, M.white(), bx + 3.5, y + 5.75, cz0)
      // placa de extremo con pernos
      for (const sx of [-5.8, -0.8, 0.8, 5.8]) {
        box(g, 0.5, 0.5, 0.08, M.steel(), bx + sx * 0.55, y + 5.75, cz0 + (cz0 > 0 ? 0.2 : -0.2))
      }
    }
    for (const cx0 of colX) box(g, 0.3, 0.22, 6, M.white(), bx + cx0, y + 5.95, 0)
    // diagonales de arriostramiento
    for (const cz0 of [-3, 3]) {
      const d = box(g, 4.8, 0.1, 0.1, M.white2(), bx, y + 3.2, cz0)
      d.rotation.z = 0.55
    }
    // vigas listas para montar
    for (let i = 0; i < 3; i++) box(g, 5.6, 0.4, 0.28, M.white2(), bx + 4.6 - i * 0.7, y + 0.35 + i * 0.4, 6.6)

    // pórtico grúa con trolley carmesí
    const gg = new THREE.Group()
    gg.position.set(0, 0, 0)
    g.add(gg)
    box(gg, 0.5, 6.4, 0.5, M.white(), -side * 10.5, y + 3.2, -2)
    box(gg, 0.5, 6.4, 0.5, M.white(), -side * 10.5, y + 3.2, 6)
    box(gg, 0.34, 0.34, 8.6, M.white(), -side * 10.5, y + 6.5, 2)
    const trolley = new THREE.Group()
    trolley.position.set(-side * 10.5, y + 6.2, 2)
    gg.add(trolley)
    box(trolley, 0.9, 0.45, 0.95, M.red(), 0, 0, 0)
    for (const s of [-1, 1]) cyl(trolley, 0.1, 0.1, 0.12, M.metal(), s * 0.35, 0.28, 0, { rz: Math.PI / 2 })
    cyl(trolley, 0.03, 0.03, 2.6, M.dark(), 0, -1.5, 0)
    // bloque de gancho
    box(trolley, 0.35, 0.4, 0.25, M.dark(), 0, -2.7, 0)
    box(trolley, 0.15, 0.25, 0.08, M.metal(), 0, -2.95, 0)
    box(trolley, 3.2, 0.4, 0.26, M.white(), 0, -3.2, 0)
    up.push((t) => {
      trolley.position.z = 2 + Math.sin(t * 0.16) * 2.6
    })
    // soldador con chispas en la junta
    person(g, bx + 1.8, 4.2, { ry: side * 3.4 })
    up.push(K.sparks(g, { x: bx + 1.8, y: y + 1.6, z: 3.4, count: 70, rate: 0.7, floor: y }))
    K.blob(g, bx, 0, 14, 9, y + 0.01)
    K.blob(g, -side * 10.5, 2, 4, 8, y + 0.01)
    person(g, bx - 3, -5.4, { ry: side * 1.1 })

    // --- conexiones apernadas + polipasto carril ---
    for (const cz0 of [-3, 3]) for (let i = 0; i < 5; i++) {
      cyl(g, 0.05, 0.05, 0.62, M.metal(), bx - 2.2 + i * 1.1, y + 5.42, cz0, { rz: Math.PI / 2 })
    }
    box(g, 12, 0.26, 0.26, M.white(), bx, y + 6.9, 0)
    const hoist = box(g, 0.8, 0.55, 0.8, M.red(), bx + 2.4, y + 6.6, 0)
    cyl(hoist, 0.03, 0.03, 1.8, M.dark(), 0, -1.2, 0)
    box(hoist, 2.6, 0.3, 0.24, M.white2(), 0, -2.2, 0)
    up.push((t) => { hoist.position.x = bx + 2.4 + Math.sin(t * 0.14) * 3.2 })
    sign(g, ['MONTAJE DE ESTRUCTURA', 'ZONA DE IZAJE'], { x: -side * 7.4, y, z: -5.2, ry: -side * 0.5, w: 3.2, h: 1.5, foot: 'CARGA SUSPENDIDA' })
    gasBottles(g, bx + side * 6.4, y, -4.8, { n: 3, ry: -side * 0.4 })
    toolbox(g, bx - 4.2, y, 5.6, { ry: side * 0.7 })
    reel(g, bx + 5.8, y, 5.2, { ry: 0.5, hose: M.dark() })
    fieldPanel(g, -side * 11.2, y, 0.4, { ry: side * 0.6, h: 1.5 })
  },

  // ---------- 10 · Pailería y tanques ----------
  (ctx) => {
    const { g, y, side, up } = ctx

    // —— héroe: tanque horizontal API en fabricación ——
    const tx = side * 2.4, tz = -1.2
    // cunas / saddles
    for (const ox of [-2.2, 2.2]) {
      box(g, 0.9, 0.35, 2.6, M.concrete(), tx + ox, y + 0.18, tz)
      // silla curva (bloques escalonados)
      box(g, 0.55, 0.7, 0.9, M.concreteDark(), tx + ox, y + 0.7, tz)
      box(g, 0.7, 0.18, 1.6, M.steel(), tx + ox, y + 1.15, tz)
      for (const s of [-1, 1]) box(g, 0.12, 0.55, 0.35, M.steel(), tx + ox + s * 0.35, y + 0.85, tz)
    }
    // cuerpo: 3 virolas + soldaduras circunferenciales
    for (let i = 0; i < 3; i++) {
      cyl(g, 1.45, 1.45, 2.05, M.white(), tx - 2.05 + i * 2.05, y + 2.35, tz, { rz: Math.PI / 2, seg: 28 })
      if (i < 2) tor(g, 1.48, 0.05, M.redDeep(), tx - 1.02 + i * 2.05, y + 2.35, tz, { ry: Math.PI / 2 })
    }
    // soldadura longitudinal (costura)
    box(g, 6.1, 0.04, 0.04, M.red(), tx, y + 3.78, tz)
    // cabezal abombado montado + cabezal suelto en piso (fit-up)
    const headOn = sph(g, 1.45, M.white2(), tx - 3.15, y + 2.35, tz)
    headOn.scale.x = 0.42
    flange(g, tx - 3.55, y + 2.35, tz, { r: 0.55, ry: Math.PI / 2, bolts: 8, t: 0.07 })
    // cabezal en espera
    const headWait = sph(g, 1.35, M.white2(), tx + 5.4, y + 1.2, tz + 2.8)
    headWait.scale.z = 0.4
    flange(g, tx + 5.4, y + 1.2, tz + 2.4, { r: 1.4, bolts: 10, t: 0.07 })
    box(g, 1.2, 0.2, 1.2, M.concrete(), tx + 5.4, y + 0.1, tz + 2.8)
    // boquillas: manhole, entrada, salida, venteo
    cyl(g, 0.38, 0.38, 0.45, M.metal(), tx, y + 3.85, tz)
    flange(g, tx, y + 4.15, tz, { r: 0.48, rx: Math.PI / 2, bolts: 8 })
    for (const [ox, oz] of [[-1.4, 1.5], [1.6, -1.5]]) {
      cyl(g, 0.2, 0.2, 0.55, M.red(), tx + ox, y + 2.35, tz + oz * 0.15, { rx: oz > 0 ? Math.PI / 2 : -Math.PI / 2 })
      flange(g, tx + ox, y + 2.35, tz + Math.sign(oz) * 1.55, { r: 0.28, bolts: 6 })
    }
    cyl(g, 0.1, 0.1, 0.9, M.metal(), tx + 1.8, y + 4.0, tz)
    cyl(g, 0.16, 0.08, 0.2, M.metal(), tx + 1.8, y + 4.5, tz)
    // placa de identificación
    box(g, 0.7, 0.35, 0.04, M.dark(), tx - 0.4, y + 1.55, tz + 1.48)
    box(g, 0.55, 0.08, 0.03, M.red(), tx - 0.4, y + 1.65, tz + 1.5)
    // pasarela + barandal sobre el tanque
    box(g, 4.2, 0.08, 0.7, M.steel(), tx, y + 4.35, tz + 0.1)
    for (const s of [-1, 1]) {
      box(g, 4.2, 0.05, 0.05, M.metal(), tx, y + 4.85, tz + s * 0.32)
      for (let i = 0; i < 5; i++) cyl(g, 0.03, 0.03, 0.5, M.metal(), tx - 1.8 + i * 0.9, y + 4.6, tz + s * 0.32)
    }
    ladder(g, tx - 3.4, tz + 1.7, 4.2, -side * 0.2)
    K.blob(g, tx, tz, 10, 5.5, y + 0.01)

    // —— vaso vertical (reactor / silo) con anillo de plataforma ——
    const vx = -side * 7.2, vz = -2.8
    box(g, 3.2, 0.25, 3.2, M.concrete(), vx, y + 0.12, vz)
    cyl(g, 1.55, 1.55, 5.4, M.white(), vx, y + 2.95, vz, { seg: 26 })
    for (const yy of [1.4, 2.7, 4.0]) tor(g, 1.58, 0.045, M.metal(), vx, y + yy, vz, { rx: Math.PI / 2 })
    sph(g, 1.55, M.white2(), vx, y + 5.7, vz, { sy: 0.42 })
    // plataforma anular
    tor(g, 2.15, 0.18, M.steel(), vx, y + 3.6, vz, { rx: Math.PI / 2, rad: 8, tub: 24 })
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2
      cyl(g, 0.04, 0.04, 0.55, M.metal(), vx + Math.cos(a) * 2.15, y + 3.9, vz + Math.sin(a) * 2.15)
    }
    tor(g, 2.15, 0.04, M.metal(), vx, y + 4.2, vz, { rx: Math.PI / 2 })
    // boquillas laterales + manway
    cyl(g, 0.32, 0.32, 0.35, M.metal(), vx + side * 1.7, y + 2.2, vz, { rz: Math.PI / 2 })
    flange(g, vx + side * 1.95, y + 2.2, vz, { r: 0.4, ry: Math.PI / 2, bolts: 6 })
    for (const yy of [1.6, 3.8]) {
      cyl(g, 0.16, 0.16, 0.4, M.red(), vx - side * 1.6, y + yy, vz, { rz: Math.PI / 2 })
      flange(g, vx - side * 1.85, y + yy, vz, { r: 0.24, ry: Math.PI / 2, bolts: 4 })
    }
    ladder(g, vx - side * 2.35, vz, 5.6, side > 0 ? Math.PI / 2 : -Math.PI / 2)
    K.blob(g, vx, vz, 5.5, 5.5, y + 0.01)

    // —— roladora de placa (máquina clara) ——
    const rg = new THREE.Group()
    rg.position.set(side * 7.2, y, 4.2)
    g.add(rg)
    box(rg, 4.2, 0.25, 2.2, M.concrete(), 0, 0.12, 0)
    box(rg, 3.8, 1.1, 1.7, M.dark(), 0, 0.75, 0)
    edgeBox(rg, 3.8, 1.1, 1.7, PAL.metalDark, 0, 0.75, 0)
    // rodillos
    for (const [rx0, ry0] of [[-0.85, 1.35], [0.85, 1.35], [0, 1.55]]) {
      cyl(rg, 0.28, 0.28, 1.9, M.metal(), rx0, ry0, 0, { rz: Math.PI / 2 })
      for (const s of [-1, 1]) box(rg, 0.35, 0.55, 0.35, M.steel(), s * 1.15, ry0 - 0.1, rx0 * 0.3)
    }
    const roll = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, 1.5, 24, 1, true, 0, 4.0), M.steel())
    roll.position.set(0, 2.45, 0)
    roll.rotation.z = Math.PI / 2
    rg.add(roll)
    up.push((t, dt) => { roll.rotation.y += dt * 0.75 })
    // panel de control de la máquina
    box(rg, 0.55, 1.1, 0.4, M.white2(), -2.2, 0.9, 0.9)
    for (let i = 0; i < 4; i++) box(rg, 0.1, 0.08, 0.05, i % 2 ? M.red() : M.dark(), -2.2, 0.7 + i * 0.18, 1.12)
    // lámina entrando
    box(rg, 2.4, 0.06, 1.3, M.white2(), 2.4, 1.4, 0)
    // pila de placas
    for (let i = 0; i < 5; i++) box(g, 3.0, 0.08, 1.5, M.white2(), side * 10.2, y + 0.2 + i * 0.1, 4.0)
    K.blob(g, side * 7.2, 4.2, 6, 4, y + 0.01)

    // —— estación de soldadura: virola en rotadores ——
    const wx = -side * 5.5, wz = 4.4
    for (const s of [-1.2, 1.2]) {
      box(g, 0.8, 0.45, 0.7, M.dark(), wx + s, y + 0.22, wz)
      cyl(g, 0.35, 0.35, 0.5, M.metal(), wx + s, y + 0.7, wz, { rz: Math.PI / 2 })
    }
    const shell = cyl(g, 1.1, 1.1, 2.4, M.white(), wx, y + 1.55, wz, { rz: Math.PI / 2, seg: 22 })
    tor(g, 1.12, 0.04, M.redDeep(), wx, y + 1.55, wz, { ry: Math.PI / 2 })
    up.push((t, dt) => { shell.rotation.x += dt * 0.35 })
    person(g, wx + side * 1.8, wz + 0.4, { ry: -side * 1.8 })
    up.push(K.sparks(g, { x: wx + side * 1.1, y: y + 1.7, z: wz, count: 55, rate: 0.55, floor: y }))
    gasBottles(g, wx - side * 2.2, y, wz + 1.6, { n: 3, ry: side * 0.4 })
    toolbox(g, wx + side * 2.4, y, wz - 1.4, { ry: -0.5 })

    // —— boquillas / bridas listas para montar ——
    pallet(g, -side * 10.4, y, 1.2, { ry: 0.35, pipes: 0, w: 2.4, d: 1.5 })
    for (let i = 0; i < 4; i++) {
      flange(g, -side * 10.4 + (i % 2) * 0.7 - 0.35, y + 0.35 + Math.floor(i / 2) * 0.35, 1.2 + (i % 2) * 0.15, { r: 0.32 + (i % 2) * 0.08, rx: Math.PI / 2, bolts: 6 })
    }
    for (let i = 0; i < 3; i++) {
      cyl(g, 0.18, 0.18, 0.55, M.red(), -side * 9.2, y + 0.4, 2.4 + i * 0.55)
      flange(g, -side * 9.2, y + 0.75, 2.4 + i * 0.55, { r: 0.26, rx: Math.PI / 2, bolts: 4 })
    }

    person(g, side * 5.0, 3.0, { ry: -side * 2.2 })
    person(g, tx - side * 1.2, tz + 2.8, { ry: side * 0.8 })
    cone(g, tx + 4.2, tz + 3.6)
    cone(g, vx + side * 3.2, vz + 2.4)
    sign(g, ['PAILERÍA', 'TANQUES EN FABRICACIÓN'], { x: -side * 11.6, y, z: -5.2, ry: -side * 0.45, w: 3.2, h: 1.5, foot: 'TRABAJO EN CALIENTE · API 650' })
    fieldPanel(g, side * 9.4, y, 1.6, { ry: -side * 0.8, h: 1.45 })
    reel(g, side * 4.0, y, 5.6, { ry: 0.4, hose: M.dark() })
  },

  // ---------- 11 · Tuberías de presión ----------
  (ctx) => {
    const { g, y, side, up } = ctx
    const fx = -side * 3.2

    // —— rack de tubería con zapatas y zapatillas ——
    for (const fz of [-4.8, -0.2, 4.4]) {
      for (const sx of [-3.4, 3.4]) {
        box(g, 0.75, 0.16, 0.75, M.concrete(), fx + sx, y + 0.08, fz)
        box(g, 0.38, 4.6, 0.38, M.white(), fx + sx, y + 2.35, fz)
        for (const s of [-1, 1]) box(g, 0.1, 0.45, 0.32, M.steel(), fx + sx + s * 0.28, y + 0.4, fz)
      }
      box(g, 7.2, 0.28, 0.28, M.white(), fx, y + 4.6, fz)
      box(g, 7.2, 0.28, 0.28, M.white(), fx, y + 3.2, fz)
    }
    const lay = (r, yy, hot) => {
      cyl(g, r, r, 14, hot ? M.red() : M.white(), fx, y + yy, 0, { rz: Math.PI / 2, seg: 20 })
      for (const fz of [-4.8, -0.2, 4.4]) {
        flange(g, fx, y + yy, fz, { r: r + 0.1, ry: Math.PI / 2, bolts: 6 })
        box(g, 0.4, 0.14, 0.45, M.steel(), fx - 3.1, y + yy - r - 0.06, fz)
        // U-bolt
        for (const s of [-1, 1]) cyl(g, 0.03, 0.03, 0.35, M.metal(), fx - 3.1 + s * 0.18, y + yy, fz)
      }
    }
    lay(0.42, 1.7, false)
    lay(0.42, 2.45, false)
    lay(0.3, 3.15, false)
    lay(0.5, 4.15, true)
    // aislamiento a medias en una línea
    for (let i = 0; i < 4; i++) {
      cyl(g, 0.55, 0.55, 0.9, M.white2(), fx - 2 + i * 1.1, y + 4.15, 4.4, { rz: Math.PI / 2, seg: 12, open: true })
    }
    K.blob(g, fx, 0, 14, 7, y + 0.01)

    // —— spool en stands (codo + tee + reductor) ——
    const spx = side * 6.5, spz = -3.6
    for (const ox of [-1.4, 1.4]) {
      box(g, 0.6, 0.7, 0.5, M.concrete(), spx + ox, y + 0.35, spz)
      cyl(g, 0.2, 0.2, 0.5, M.metal(), spx + ox, y + 0.9, spz, { rz: Math.PI / 2 })
    }
    cyl(g, 0.38, 0.38, 3.2, M.white(), spx, y + 1.25, spz, { rz: Math.PI / 2, seg: 18 })
    flange(g, spx - 1.7, y + 1.25, spz, { r: 0.48, ry: Math.PI / 2, bolts: 6 })
    flange(g, spx + 1.7, y + 1.25, spz, { r: 0.48, ry: Math.PI / 2, bolts: 6 })
    // tee hacia arriba
    cyl(g, 0.28, 0.28, 0.9, M.red(), spx, y + 1.85, spz)
    flange(g, spx, y + 2.4, spz, { r: 0.36, rx: Math.PI / 2, bolts: 6 })
    // codo 90 en el piso
    cyl(g, 0.32, 0.32, 0.9, M.white(), spx + 3.2, y + 0.5, spz + 1.4, { rz: Math.PI / 2 })
    cyl(g, 0.32, 0.32, 0.9, M.white(), spx + 3.65, y + 0.95, spz + 1.85)
    flange(g, spx + 2.7, y + 0.5, spz + 1.4, { r: 0.4, ry: Math.PI / 2, bolts: 6 })
    // rack de fittings
    box(g, 2.2, 0.15, 1.2, M.steel(), spx - 0.4, y + 0.1, spz + 2.8)
    for (let i = 0; i < 5; i++) {
      flange(g, spx - 1.2 + i * 0.45, y + 0.35, spz + 2.6, { r: 0.22 + (i % 2) * 0.06, rx: Math.PI / 2, bolts: 4 })
    }
    for (let i = 0; i < 3; i++) {
      cyl(g, 0.14 + i * 0.04, 0.2, 0.45, M.red(), spx - 0.8 + i * 0.5, y + 0.4, spz + 3.2)
    }
    person(g, spx - side * 1.8, spz + 1.2, { ry: side * 1.4 })
    K.blob(g, spx, spz, 7, 5, y + 0.01)

    // —— estación de soldadura en línea ——
    const wx = fx + side * 5.5, wz = 3.8
    cyl(g, 0.4, 0.4, 2.6, M.white(), wx, y + 1.1, wz, { rz: Math.PI / 2, seg: 18 })
    flange(g, wx - 1.4, y + 1.1, wz, { r: 0.5, ry: Math.PI / 2, bolts: 6 })
    for (const s of [-1, 1]) box(g, 0.5, 0.55, 0.45, M.concrete(), wx + s * 0.9, y + 0.28, wz)
    person(g, wx + side * 1.5, wz + 0.6, { ry: -side * 1.6 })
    up.push(K.sparks(g, { x: wx + side * 0.9, y: y + 1.2, z: wz, count: 50, rate: 0.5, floor: y }))
    gasBottles(g, wx - side * 2.0, y, wz + 1.5, { n: 2, ry: 0.3 })
    toolbox(g, wx + side * 2.2, y, wz - 1.2, { ry: -0.4 })

    // —— cabezal de hidroprueba ——
    const hx = side * 8.8, hz = 3.2
    box(g, 2.0, 0.2, 1.2, M.steel(), hx, y + 0.1, hz)
    box(g, 1.7, 0.85, 0.95, M.white2(), hx, y + 0.6, hz)
    for (let i = 0; i < 5; i++) box(g, 0.04, 0.55, 0.75, M.dark(), hx - 0.6 + i * 0.12, y + 0.6, hz)
    cyl(g, 0.2, 0.2, 0.9, M.red(), hx, y + 1.25, hz, { rz: Math.PI / 2 })
    flange(g, hx + 0.5, y + 1.25, hz, { r: 0.28, ry: Math.PI / 2, bolts: 4 })
    valve(g, hx - 0.55, y + 1.55, hz, { r: 0.26 })
    const nh = gauge(g, hx, y + 1.7, hz - 0.5, { ry: -side * 0.35 })
    up.push((t) => { nh.rotation.z = 0.55 + Math.sin(t * 1.3) * 0.25 })
    fieldPanel(g, hx - side * 1.6, y, hz, { ry: -side * 0.9, h: 1.4, w: 0.9 })
    // manifold de prueba hacia el rack
    cyl(g, 0.14, 0.14, 3.2, M.red(), hx - 1.8, y + 1.5, hz - 1.4, { rz: Math.PI / 2 })
    for (let i = 0; i < 3; i++) {
      valve(g, hx - 2.6 + i * 0.55, y + 1.85, hz - 1.4, { r: 0.2 })
      cyl(g, 0.08, 0.08, 0.5, M.red(), hx - 2.6 + i * 0.55, y + 1.6, hz - 1.4)
    }

    // junta de expansión
    const jx = side * 9.2, jz = -1.0
    cyl(g, 0.48, 0.48, 2.6, M.white(), jx, y + 1.55, jz, { rz: Math.PI / 2, seg: 18 })
    for (const s of [-1, 1]) flange(g, jx + s * 1.4, y + 1.55, jz, { r: 0.58, ry: Math.PI / 2, bolts: 8 })
    for (let i = 0; i < 5; i++) tor(g, 0.48, 0.04, M.metal(), jx + (i - 2) * 0.25, y + 1.55, jz, { ry: Math.PI / 2 })
    for (const s of [-1, 1]) box(g, 0.55, 0.95, 0.55, M.concrete(), jx + s * 2.0, y + 0.48, jz)
    const n11 = gauge(g, jx, y + 2.5, jz, { ry: -side * 0.4 })
    up.push((t) => { n11.rotation.z = 0.5 + Math.sin(t * 1.4) * 0.26 })

    pallet(g, -side * 9.6, y, 4.6, { ry: -0.3, pipes: 4, pr: 0.22, pm: M.white() })
    cone(g, hx + side * 2.0, hz + 2.0)
    cone(g, spx + 4.0, spz - 2.0)
    sign(g, ['TUBERÍA DE PRESIÓN', 'PRUEBA HIDROSTÁTICA'], { x: -side * 11.4, y, z: -5.0, ry: -side * 0.5, w: 3.3, h: 1.5, foot: 'ANSI B16.5 · 150#' })
  },

  // ---------- 12 · Sand blast y recubrimientos ----------
  (ctx) => {
    const { g, y, side, up } = ctx
    const bx = side * 3
    // cabina de voladura (marco, cortinas, mirilla, canaleta)
    box(g, 0.4, 4.6, 7, M.white(), bx + 5.4, y + 2.3, 0)
    box(g, 7, 0.4, 0.4, M.white(), bx + 2.4, y + 4.6, -3.4)
    box(g, 7, 0.4, 0.4, M.white(), bx + 2.4, y + 4.6, 3.4)
    box(g, 0.3, 4.4, 0.3, M.white(), bx - 3.2, y + 2.2, -3.4)
    box(g, 0.3, 4.4, 0.3, M.white(), bx - 3.2, y + 2.2, 3.4)
    box(g, 11.4, 0.28, 7, M.white2(), bx + 2.4, y + 4.95, 0)
    edgeBox(g, 11.4, 5, 7, PAL.metalDark, bx + 2.4, y + 2.5, 0)
    // cortinas de goma
    for (let i = 0; i < 8; i++) {
      box(g, 0.08, 2.8, 0.5, mat(PAL.dark, { r: 0.9, op: 0.85 }), bx - 3.0, y + 1.6, -2.8 + i * 0.8)
    }
    // mirilla
    box(g, 0.08, 1.1, 1.4, M.dark(), bx + 5.55, y + 2.8, 0)
    plate(g, 0.9, 1.1, M.glass(), bx + 5.6, y + 2.8, 0, { ry: Math.PI / 2, d: 0.04 })
    // canaleta de recuperación
    box(g, 8, 0.15, 1.2, M.steel(), bx + 1.2, y + 0.12, 0)

    // paneles: crudo vs. recubierto carmesí
    box(g, 1.2, 0.5, 0.16, M.white2(), bx - 1, y + 0.45, -2.2)
    plate(g, 1.2, 2.6, mat(PAL.steel, { r: 0.6, m: 0.5 }), bx - 1, y + 1.8, -2.2)
    box(g, 1.2, 0.5, 0.16, M.white2(), bx - 1, y + 0.45, 2.2)
    plate(g, 1.2, 2.6, mat(PAL.red, { r: 0.18, m: 0.1 }), bx - 1, y + 1.8, 2.2)

    // boquilla sobre mástil
    cyl(g, 0.1, 0.1, 2.8, M.metal(), bx + 3.4, y + 2.8, 0)
    const nozzle = cyl(g, 0.16, 0.1, 0.9, M.dark(), bx + 2.4, y + 3.1, 0, { rz: Math.PI / 2, ry: 0 })
    nozzle.rotation.y = 0
    // cono de abrasivo
    const dust = cloud(g, 90, { size: 0.09, color: PAL.dust, opacity: 0.55 })
    up.push((t) => {
      const { pos } = dust
      for (let i = 0; i < 90; i++) {
        const p = cyc(t, 0.85, i * 0.618)
        const spread = 0.15 + p * 1.1
        pos[i * 3] = bx + 2.0 - p * 2.6 + Math.sin(i * 7.1) * spread * 0.4
        pos[i * 3 + 1] = y + 3.1 - Math.sin(p * Math.PI) * 1.3 * Math.sin(i * 3.7) * 0.4 + Math.sin(i * 2.2) * spread * 0.3
        pos[i * 3 + 2] = Math.cos(i * 5.3) * spread * 0.5
        if (p > 0.9) pos[i * 3 + 1] = -999
      }
      dust.geo.attributes.position.needsUpdate = true
    })
    // operador con manga de aire
    person(g, bx - 3.4, 0.6, { ry: side * 1.35 })
    tube(g, [V(bx - 2.8, y + 1.1, 0.6), V(bx - 0.4, y + 1.4, 0.2), V(bx + 2.1, y + 2.4, 0)], 0.08, M.dark())
    cone(g, bx - 4.6, 3.6)
    K.blob(g, bx + 2.4, 0, 11, 6.5, y + 0.01)

    // --- compresor, tolva de abrasivo y pieza a medio recubrir ---
    const cpx = -side * 7.4, cpz = -3.8
    box(g, 1.8, 1.1, 1.1, M.white2(), cpx, y + 0.55, cpz)
    for (let i = 0; i < 5; i++) box(g, 0.04, 0.7, 0.9, M.dark(), cpx - 0.7 + i * 0.12, y + 0.55, cpz)
    for (const s of [-1, 1]) cyl(g, 0.27, 0.27, 0.18, M.dark(), cpx + s * 0.52, y + 0.27, cpz + 0.55, { rx: Math.PI / 2 })
    cyl(g, 0.08, 0.08, 1.3, M.metal(), cpx, y + 1.75, cpz)
    gauge(g, cpx + 0.5, y + 1.3, cpz + 0.4, { ry: -side * 0.4 })
    cyl(g, 0.95, 0.2, 1.15, M.metal(), -side * 10.6, y + 1.4, -1.6, { seg: 18 })
    cyl(g, 0.95, 0.95, 0.95, M.white2(), -side * 10.6, y + 2.45, -1.6, { seg: 18 })
    cyl(g, 0.9, 0.9, 0.08, M.metal(), -side * 10.6, y + 3.0, -1.6) // tapa
    valve(g, -side * 10.6, y + 0.7, -1.6, { r: 0.22 })
    box(g, 1.7, 2.4, 0.22, M.white2(), -side * 4.8, y + 1.2, 4.6)
    plate(g, 1.7, 1.2, mat(PAL.steel, { r: 0.55, m: 0.5 }), -side * 4.8, y + 0.62, 4.73)
    sign(g, ['SAND BLAST', 'PROTECCIÓN AUDITIVA Y VISUAL'], { x: -side * 9.8, y, z: 5.2, ry: side * 0.45, w: 3.2, h: 1.5, tex: { tone: 'danger', foot: 'EQUIPO OBLIGATORIO' } })
    drum(g, side * 8.6, y, 4.2, { m: M.red() })
    drum(g, side * 9.4, y, 4.0, { m: M.white2(), r: 0.34, h: 0.85 })
    toolbox(g, bx - 2.2, y, -3.6, { ry: side * 0.5 })
    reel(g, -side * 8.8, y, 2.4, { ry: -0.4, hose: M.dark() })
    fieldPanel(g, bx + 6.8, y, -2.8, { ry: -side * 0.7, h: 1.45 })
  },

  // ---------- 13 · Mantenimiento ----------
  (ctx) => {
    const { g, y, side, up } = ctx
    const sx = -side * 2.5

    // —— taller / galpón con puente grúa ——
    for (const [px, pz] of [[sx - 4, -3.2], [sx + 4, -3.2], [sx - 4, 3.2], [sx + 4, 3.2]]) {
      box(g, 0.4, 4.4, 0.4, M.white(), px, y + 2.2, pz)
      box(g, 0.7, 0.14, 0.7, M.concrete(), px, y + 0.07, pz)
    }
    box(g, 8.4, 0.28, 6.8, M.white2(), sx, y + 4.5, 0)
    edgeBox(g, 8.4, 0.28, 6.8, PAL.metalDark, sx, y + 4.5, 0)
    // riel + polipasto
    box(g, 0.2, 0.2, 6.4, M.steel(), sx - 3.5, y + 4.2, 0)
    box(g, 0.2, 0.2, 6.4, M.steel(), sx + 3.5, y + 4.2, 0)
    const hoist = new THREE.Group()
    hoist.position.set(sx, y + 4.0, 0)
    g.add(hoist)
    box(hoist, 0.9, 0.45, 0.7, M.red(), 0, 0, 0)
    cyl(hoist, 0.03, 0.03, 2.0, M.dark(), 0, -1.15, 0)
    box(hoist, 0.35, 0.3, 0.25, M.metal(), 0, -2.2, 0)
    up.push((t) => { hoist.position.z = Math.sin(t * 0.2) * 2.0 })

    // —— bomba en servicio (skid) ——
    pumpSkid(g, sx - side * 0.5, y, -1.2, { side })
    const coup = cyl(g, 0.18, 0.18, 0.3, M.dark(), sx - side * 0.55, y + 0.95, -1.2, { rz: Math.PI / 2 })
    valve(g, sx - side * 0.5 + side * 0.85, y + 2.9, -1.2, { r: 0.3 })
    const ng = gauge(g, sx - side * 0.35, y + 2.2, -0.5, { ry: side * 0.7 })
    up.push((t) => { ng.rotation.z = 0.5 + Math.sin(t * 1.1) * 0.3 })
    up.push((t, dt) => { coup.rotation.x += dt * 4 })
    // LOTO tags en válvula
    box(g, 0.2, 0.28, 0.04, M.red(), sx - side * 0.5 + side * 0.85, y + 3.2, -0.9)
    box(g, 0.15, 0.08, 0.03, M.dark(), sx - side * 0.5 + side * 0.85, y + 3.35, -0.9)

    // —— banco de desmontaje: motor + impulsor ——
    const ix = side * 5.5, iz = 2.4
    box(g, 3.2, 0.18, 1.5, M.steel(), ix, y + 0.7, iz)
    for (const s of [-1.3, 1.3]) box(g, 0.15, 0.7, 0.15, M.metal(), ix + s, y + 0.35, iz)
    // motor abierto
    cyl(g, 0.4, 0.4, 1.1, M.white(), ix - 0.7, y + 1.25, iz, { rz: Math.PI / 2 })
    for (let i = 0; i < 5; i++) box(g, 0.04, 0.55, 0.7, M.white2(), ix - 1.15, y + 1.25, iz - 0.3 + i * 0.15)
    box(g, 0.35, 0.3, 0.25, M.dark(), ix - 0.7, y + 1.7, iz + 0.4)
    // impulsor en eje
    const imp = new THREE.Group()
    imp.position.set(ix + 0.9, y + 1.35, iz)
    g.add(imp)
    cyl(imp, 0.08, 0.08, 0.9, M.metal(), -0.3, 0, 0, { rz: Math.PI / 2 })
    for (let i = 0; i < 6; i++) {
      const blade = box(imp, 0.45, 0.05, 0.22, M.red(), 0.25, 0, 0)
      blade.rotation.y = (i * Math.PI) / 3
    }
    cyl(imp, 0.14, 0.14, 0.18, M.white(), 0.25, 0.12, 0)
    up.push((t, dt) => { imp.rotation.x += dt * 1.8 })
    // charola de aceite
    box(g, 1.8, 0.08, 1.0, M.dark(), ix, y + 0.12, iz)
    person(g, ix - side * 1.6, iz + 1.2, { ry: side * 2.0 })
    toolbox(g, ix + 1.6, y, iz - 1.2, { ry: -0.5 })

    // —— estantería de refacciones ——
    const rx = -side * 8.2, rz = 2.0
    box(g, 2.4, 2.6, 0.55, M.white2(), rx, y + 1.4, rz)
    edgeBox(g, 2.4, 2.6, 0.55, PAL.metalDark, rx, y + 1.4, rz)
    for (let r = 0; r < 3; r++) {
      box(g, 2.2, 0.06, 0.5, M.steel(), rx, y + 0.55 + r * 0.75, rz)
      // impulsors / sellos / empaques
      for (let c = 0; c < 3; c++) {
        if (r === 0) cyl(g, 0.2, 0.2, 0.15, M.red(), rx - 0.7 + c * 0.7, y + 0.75, rz + 0.05, { rx: Math.PI / 2 })
        else if (r === 1) box(g, 0.35, 0.25, 0.3, M.dark(), rx - 0.7 + c * 0.7, y + 1.4, rz)
        else cyl(g, 0.12, 0.12, 0.4, M.metal(), rx - 0.7 + c * 0.7, y + 2.15, rz)
      }
    }

    // —— tablero LOTO ——
    box(g, 1.3, 1.7, 0.12, M.dark(), sx + side * 4.0, y + 1.3, -3.4)
    edgeBox(g, 1.3, 1.7, 0.12, PAL.metalDark, sx + side * 4.0, y + 1.3, -3.4)
    box(g, 1.0, 0.18, 0.04, M.red(), sx + side * 4.0, y + 2.0, -3.32)
    for (let i = 0; i < 6; i++) {
      box(g, 0.22, 0.28, 0.04, i < 3 ? M.red() : M.white2(), sx + side * 4.0 - 0.35 + (i % 3) * 0.35, y + 0.7 + Math.floor(i / 3) * 0.5, -3.32)
    }
    holo(g, 1.7, 1.25, { tex: K.texCheck(), x: sx + side * 4.0, y: y + 3.3, z: -2.6, ry: -side * 0.35, op: 0.86 })

    // —— termografía + vibración ——
    const tx13 = side * 7.2, tz13 = -2.8
    for (let i = 0; i < 3; i++) {
      const leg = cyl(g, 0.035, 0.035, 1.7, M.metal(), tx13 + Math.cos(i * 2.09) * 0.42, y + 0.85, tz13 + Math.sin(i * 2.09) * 0.42)
      leg.rotation.z = -Math.cos(i * 2.09) * 0.28
      leg.rotation.x = Math.sin(i * 2.09) * 0.28
    }
    box(g, 0.5, 0.4, 0.35, M.dark(), tx13, y + 1.85, tz13)
    cyl(g, 0.1, 0.12, 0.28, M.metal(), tx13 - side * 0.28, y + 1.85, tz13, { rz: Math.PI / 2 })
    holo(g, 1.3, 0.85, { tex: K.texChart(), x: tx13 + side * 0.2, y: y + 2.85, z: tz13, ry: -side * 0.35, tilt: -0.08, op: 0.86 })
    // sensor en bomba
    sph(g, 0.12, M.red(), sx - side * 0.5 + side * 1.1, y + 1.35, -1.2)
    cyl(g, 0.02, 0.02, 0.7, M.dark(), sx - side * 0.5 + side * 1.1, y + 1.75, -1.2, { rz: 0.4 })

    // —— tambores de aceite + manguera ——
    drum(g, -side * 7.5, y, -2.4, { m: M.dark(), h: 0.9 })
    drum(g, -side * 8.4, y, -2.0, { m: M.white2(), h: 0.8, r: 0.34 })
    reel(g, ix - 2.0, y, iz + 1.8, { ry: 0.6, hose: M.red() })
    fieldPanel(g, sx - side * 4.2, y, -3.0, { ry: side * 0.55, h: 1.55 })
    person(g, sx + side * 1.5, 3.4, { ry: -side * 1.2 })
    cone(g, sx - 5.2, 4.2)
    cone(g, ix + 2.4, iz - 2.0)
    sign(g, ['MANTENIMIENTO', 'EQUIPO EN SERVICIO'], { x: -side * 10.2, y, z: 4.0, ry: -side * 0.45, w: 3.3, h: 1.55, foot: 'LOTO OBLIGATORIO · NO OPERAR' })
    K.blob(g, sx, 0, 10, 8, y + 0.01)
    K.blob(g, ix, iz, 5, 4, y + 0.01)
  },

  // ---------- 14 · Remodelaciones y electromecánica ----------
  (ctx) => {
    const { g, y, side, up } = ctx
    const bx = -side * 2.4

    // —— edificio a medio remodelar: ala terminada + ala abierta ——
    box(g, 9.2, 0.22, 5.0, M.concrete(), bx, y + 0.11, -0.6)
    edgeBox(g, 9.2, 0.22, 5.0, PAL.padEdge, bx, y + 0.11, -0.6)
    // volumen principal (terminado)
    box(g, 5.6, 4.8, 4.2, M.white(), bx - side * 1.4, y + 2.55, -0.8)
    edgeBox(g, 5.6, 4.8, 4.2, PAL.metalDark, bx - side * 1.4, y + 2.55, -0.8)
    box(g, 5.8, 0.2, 4.4, M.white2(), bx - side * 1.4, y + 5.05, -0.8)
    box(g, 5.55, 0.12, 0.08, M.red(), bx - side * 1.4, y + 1.35, 1.32)
    // ventanas terminadas
    for (let i = 0; i < 2; i++) {
      plate(g, 1.3, 1.15, M.glass(), bx - side * 1.4 - 1.1 + i * 2.2, y + 3.4, 1.32)
      box(g, 1.35, 0.08, 0.1, M.dark(), bx - side * 1.4 - 1.1 + i * 2.2, y + 2.75, 1.36)
    }
    for (let c = 0; c < 2; c++) plate(g, 1.0, 0.85, M.glass(), bx - side * 1.4 - 1.0 + c * 2.0, y + 1.9, 1.32)
    // puerta de acceso
    box(g, 1.0, 2.1, 0.08, M.white2(), bx - side * 1.4 + side * 1.8, y + 1.2, 1.35)
    box(g, 0.08, 0.14, 0.06, M.metal(), bx - side * 1.4 + side * 2.15, y + 1.2, 1.4)

    // ala en obra: estructura + entrepiso a medio cerrar
    const ox = bx + side * 3.2
    for (const [px, pz] of [[ox - 1.4, -2.4], [ox + 1.4, -2.4], [ox - 1.4, 0.8], [ox + 1.4, 0.8]]) {
      box(g, 0.28, 4.6, 0.28, M.steel(), px, y + 2.4, pz)
      box(g, 0.55, 0.12, 0.55, M.concrete(), px, y + 0.06, pz)
    }
    box(g, 3.2, 0.2, 3.6, M.steel(), ox, y + 2.6, -0.8)
    box(g, 3.2, 0.2, 3.6, M.white2(), ox, y + 4.7, -0.8)
    // paneles de fachada a medias
    box(g, 0.12, 2.2, 3.4, M.white(), ox + side * 1.55, y + 1.3, -0.8)
    box(g, 0.12, 1.4, 1.6, M.white2(), ox + side * 1.55, y + 3.6, -1.6)
    // aislamiento / ducto expuesto en el corte
    box(g, 1.8, 0.35, 0.35, M.dark(), ox, y + 3.4, 0.6)
    cyl(g, 0.18, 0.18, 2.2, M.red(), ox - 0.4, y + 3.4, -0.4, { rz: Math.PI / 2 })

    // —— andamio de fachada (torre completa) ——
    const scx = bx + side * 5.6, scz = 2.4
    for (const sz2 of [-1.1, 1.1]) for (const sx of [-0.7, 0.7]) {
      cyl(g, 0.05, 0.05, 5.2, M.metal(), scx + sx, y + 2.6, scz + sz2)
    }
    for (let lvl = 0; lvl < 4; lvl++) {
      const ly = y + 0.7 + lvl * 1.25
      box(g, 1.6, 0.06, 2.4, M.white2(), scx, ly, scz)
      for (const s of [-1, 1]) box(g, 1.6, 0.05, 0.05, M.metal(), scx, ly + 0.55, scz + s * 1.15)
      // diagonales
      const d1 = box(g, 2.3, 0.04, 0.04, M.metal(), scx, ly + 0.6, scz)
      d1.rotation.z = 0.5
    }
    ladder(g, scx - 0.95, scz, 5.0, Math.PI)
    person(g, scx, scz, { y: y + 0.7 + 2.5, ry: side * 1.4, s: 0.9 })
    person(g, scx + side * 0.3, scz - 0.2, { y: y + 0.7 + 1.25, ry: -side * 0.6, s: 0.85 })

    // —— centro de control de motores (MCC) — 3 cubículos ——
    const mccX = bx - side * 5.8, mccZ = 2.8
    box(g, 4.2, 0.18, 1.4, M.concrete(), mccX, y + 0.09, mccZ)
    for (let i = 0; i < 3; i++) {
      const cx = mccX - 1.3 + i * 1.3
      box(g, 1.15, 2.2, 0.85, M.metal(), cx, y + 1.25, mccZ)
      edgeBox(g, 1.15, 2.2, 0.85, PAL.metalDark, cx, y + 1.25, mccZ)
      // puerta / panel frontal
      box(g, 0.95, 1.9, 0.06, M.dark(), cx, y + 1.25, mccZ + 0.46)
      for (let r = 0; r < 3; r++) {
        box(g, 0.7, 0.12, 0.05, r === 0 ? M.red() : M.white2(), cx, y + 1.7 - r * 0.35, mccZ + 0.5)
      }
      // louvers + LED
      for (let r = 0; r < 3; r++) box(g, 0.55, 0.04, 0.03, M.metal(), cx, y + 0.55 + r * 0.12, mccZ + 0.5)
      sph(g, 0.04, mat(PAL.red, { r: 0.3, e: PAL.red, ei: 0.9 }), cx + 0.35, y + 2.1, mccZ + 0.5)
    }
    // cubículo abierto con barras
    plate(g, 0.5, 1.8, M.white2(), mccX + 1.3 - side * 0.7, y + 1.25, mccZ, { ry: side * 0.9, d: 0.05 })
    for (let i = 0; i < 3; i++) box(g, 0.7, 0.05, 0.05, M.red(), mccX + 1.3, y + 1.6 + i * 0.2, mccZ + 0.2)
    const ledMat = new THREE.MeshStandardMaterial({ color: PAL.red, emissive: PAL.red, emissiveIntensity: 1.0, roughness: 0.3 })
    sph(g, 0.05, ledMat, mccX + 1.3, y + 2.15, mccZ + 0.48)
    up.push((t) => { ledMat.emissiveIntensity = 0.35 + (Math.sin(t * 2.4) > 0 ? 1.2 : 0.15) })

    // —— charola portacables con cables hacia el MCC y el edificio ——
    const trayZ = 4.6
    for (let i = 0; i < 6; i++) {
      const tz = trayZ - i * 0.55
      const ty = y + 4.4 - i * 0.35
      const tx0 = bx + side * (2.0 - i * 0.15)
      box(g, 2.8, 0.08, 0.55, M.steel(), tx0, ty, tz)
      for (const s of [-1, 1]) box(g, 0.06, 0.28, 0.55, M.metal(), tx0 + s * 1.35, ty + 0.1, tz)
      // cables
      for (let c = 0; c < 3; c++) cyl(g, 0.04, 0.04, 2.4, c === 1 ? M.red() : M.dark(), tx0, ty + 0.14, tz - 0.12 + c * 0.12, { rz: Math.PI / 2 })
    }
    // bajada a MCC
    tube(g, [
      V(bx + side * 1.2, y + 2.6, 2.0),
      V(mccX + 0.4, y + 3.2, 3.4),
      V(mccX + 0.4, y + 2.4, mccZ + 0.2),
    ], 0.08, M.dark())
    // conduit a fachada
    for (const oz of [-1.4, -0.4, 0.6]) {
      cyl(g, 0.07, 0.07, 1.8, M.metal(), bx - side * 1.4 + side * 2.85, y + 3.2, oz)
      box(g, 0.2, 0.2, 0.2, M.dark(), bx - side * 1.4 + side * 2.85, y + 4.15, oz)
    }

    // —— transformador pad-mount + acometida ——
    const tfx = side * 8.2, tfz = -3.6
    box(g, 2.8, 0.24, 2.0, M.concrete(), tfx, y + 0.12, tfz)
    edgeBox(g, 2.8, 0.24, 2.0, PAL.padEdge, tfx, y + 0.12, tfz)
    box(g, 2.0, 1.7, 1.4, M.dark(), tfx, y + 1.1, tfz)
    edgeBox(g, 2.0, 1.7, 1.4, PAL.metalDark, tfx, y + 1.1, tfz)
    for (let i = 0; i < 7; i++) box(g, 0.05, 1.35, 1.2, M.metal(), tfx + side * (1.05 + i * 0.07), y + 1.1, tfz)
    for (const s of [-0.45, 0, 0.45]) {
      cyl(g, 0.09, 0.11, 0.4, M.white2(), tfx + s, y + 2.1, tfz)
      sph(g, 0.11, M.metal(), tfx + s, y + 2.35, tfz)
    }
    box(g, 0.6, 0.9, 0.1, M.metal(), tfx - side * 1.05, y + 1.1, tfz)
    box(g, 0.5, 0.14, 0.05, M.red(), tfx, y + 1.7, tfz + 0.72)
    // ducto secundario al edificio
    tube(g, [
      V(tfx - side * 0.2, y + 0.55, tfz + 0.9),
      V(tfx - side * 1.6, y + 0.4, tfz + 2.2),
      V(bx + side * 2.0, y + 0.5, 1.0),
      V(mccX + 1.3, y + 0.9, mccZ - 0.5),
    ], 0.1, M.dark())
    // cerca de protección del transformador
    for (const s of [-1, 1]) {
      cyl(g, 0.04, 0.04, 1.3, M.metal(), tfx + s * 1.5, y + 0.65, tfz - 1.2)
      cyl(g, 0.04, 0.04, 1.3, M.metal(), tfx + s * 1.5, y + 0.65, tfz + 1.2)
    }
    box(g, 3.2, 0.06, 0.06, M.metal(), tfx, y + 1.25, tfz - 1.2)
    box(g, 3.2, 0.06, 0.06, M.metal(), tfx, y + 1.25, tfz + 1.2)

    // —— UMA / motoventilador en azotea ——
    const mx = bx - side * 1.8, mz = -0.8
    box(g, 2.2, 0.9, 1.5, M.white2(), mx, y + 5.65, mz)
    edgeBox(g, 2.2, 0.9, 1.5, PAL.metalDark, mx, y + 5.65, mz)
    for (let i = 0; i < 5; i++) box(g, 1.8, 0.04, 0.04, M.dark(), mx, y + 5.35 + i * 0.12, mz + 0.78)
    cyl(g, 0.45, 0.45, 0.2, M.metal(), mx + side * 0.3, y + 6.2, mz, { rx: Math.PI / 2 })
    const fan = cyl(g, 0.4, 0.4, 0.08, M.dark(), mx + side * 0.3, y + 6.2, mz + 0.05, { rx: Math.PI / 2 })
    up.push((t, dt) => { fan.rotation.z += dt * 4 })
    // ducto de descarga
    box(g, 0.7, 0.5, 1.8, M.metal(), mx - side * 0.6, y + 5.55, mz - 1.4)

    // —— arrancador / VFD de campo ——
    fieldPanel(g, bx + side * 0.2, y, 3.2, { ry: -side * 0.5, h: 1.7, w: 1.0 })
    box(g, 0.8, 0.5, 0.55, M.dark(), bx + side * 0.2, y + 0.3, 3.9)
    gauge(g, bx + side * 0.2, y + 1.9, 3.5, { ry: -side * 0.4 })

    person(g, mccX - side * 0.4, mccZ + 1.6, { ry: side * 2.6 })
    person(g, bx - side * 4.2, 0.4, { ry: side * 1.2 })
    cone(g, tfx - side * 2.4, tfz + 2.0)
    cone(g, scx - side * 1.8, scz + 2.2)
    toolbox(g, mccX + 2.2, y, mccZ + 1.4, { ry: -side * 0.5 })
    reel(g, bx - side * 7.2, y, 4.2, { ry: 0.5, hose: M.dark() })
    reel(g, bx - side * 8.0, y, 4.8, { ry: -0.3, r: 0.48, hose: M.red() })
    drum(g, scx - side * 2.0, y, scz - 2.2, { m: M.white2() })
    sign(g, ['OBRA ELECTROMECÁNICA', 'ALIMENTACIÓN 440 V'], { x: -side * 11.2, y, z: 5.6, ry: -side * 0.5, w: 3.3, h: 1.55, tex: { tone: 'warn', foot: 'NOM-001-SEDE · PERSONAL AUTORIZADO' } })
    K.blob(g, bx, -0.6, 12, 8, y + 0.01)
    K.blob(g, mccX, mccZ, 5.5, 3.5, y + 0.01)
    K.blob(g, tfx, tfz, 4.5, 3.5, y + 0.01)
  },
]
