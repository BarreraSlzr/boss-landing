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

const { V, box, rbox, cyl, sph, tor, tube, plate, edgeBox, person, cone, cabin, ladder, gauge, valve, hydrant, soilBlock, cloud, cyc, sparks, holo, sign, flaggingTape, extinguisher, hoseCabinet, sprinkler, mat, M, PAL } = K

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

    // mesa de planos + holograma de plano
    const tbl = box(g, 2.6, 0.95, 1.4, M.white(), front + side * 2, y + 0.48, 1)
    edgeBox(g, 2.6, 0.95, 1.4, PAL.metalDark, front + side * 2, y + 0.48, 1)
    const bp = holo(g, 1.9, 1.9, { tex: K.texBlueprint(), x: front + side * 2, y: y + 2.1, z: 1, tilt: -0.28, ry: side * 0.3 })
    const gt = holo(g, 2.6, 1.6, { tex: K.texGantt(), x: front + side * 5, y: y + 3.4, z: -2, ry: -side * 0.28 })
    up.push((t) => { bp.material.opacity = 0.78 + 0.14 * Math.sin(t * 1.1); gt.material.opacity = 0.8 + 0.12 * Math.sin(t * 0.9 + 2) })

    // grúa torre
    const cg = new (Object.getPrototypeOf(g).constructor)()
    cg.position.set(side * 8, y, 5)
    g.add(cg)
    const post = (px, pz) => cyl(cg, 0.09, 0.09, 14, M.white(), px, 7, pz)
    for (const [px, pz] of [[-0.6, -0.6], [0.6, -0.6], [-0.6, 0.6], [0.6, 0.6]]) post(px, pz)
    for (let hgt = 1.6; hgt < 13.4; hgt += 2.4) {
      box(cg, 1.2, 0.09, 0.09, M.white(), 0, hgt, -0.6)
      box(cg, 1.2, 0.09, 0.09, M.white(), 0, hgt, 0.6)
      box(cg, 0.09, 0.09, 1.2, M.white(), -0.6, hgt, 0)
      box(cg, 0.09, 0.09, 1.2, M.white(), 0.6, hgt, 0)
    }
    const jib = new (Object.getPrototypeOf(g).constructor)()
    jib.position.set(0, 14, 0)
    cg.add(jib)
    box(jib, 13, 0.34, 0.5, M.white(), -6.2, 0, 0)
    box(jib, 4.4, 0.6, 0.9, M.concrete(), 2.4, 0.1, 0)          // contrapeso
    box(jib, 1.1, 1.1, 1.3, M.white(), 0.4, 0.9, 0)             // cabina
    cyl(jib, 0.02, 0.02, 5.4, M.dark(), -7.5, -2.7, 0)          // cable
    const hook = box(jib, 0.4, 0.4, 0.4, M.red(), -7.5, -5.6, 0)
    box(jib, 2.6, 0.3, 0.3, M.white2(), -7.5, -5.25, 0)         // carga
    up.push((t) => { jib.rotation.y = 0.5 + Math.sin(t * 0.1) * 0.55 })
    K.blob(g, side * 8, 5, 5, 5, y + 0.01)

    person(g, front + side * 0.4, 2.4, { ry: side * 2.4 })
    person(g, front + side * 3.4, -0.6, { ry: -side * 1.2 })
    cone(g, front + side * 1.2, 3.4)
    cone(g, front - side * 1.4, 4.2)

    // --- señalización de obra: tablero, extintor y cinta ---
    sign(g, ['BOSS', 'SUPERVISIÓN DE OBRA'], { x: -side * 6.2, y, z: -5.6, ry: -side * 0.32, w: 3.6, h: 1.7, foot: 'ACCESO CONTROLADO' })
    extinguisher(g, side * 10.6, -1.6, -side * 0.5)
    flaggingTape(g, side * 8.8, 3.4, 4.6, side * 0.15)
  },

  // ---------- 02 · Sistemas hidráulicos ----------
  (ctx) => {
    const { g, y, side, up } = ctx
    const bx = -side * 3

    // edificio en corte: la fachada hacia el bulevar está retirada
    const W = 7, D = 4.6, H = 7.5
    box(g, W, H, 0.3, M.white(), bx, y + H / 2, -D / 2 + 0.15)          // muro lateral
    box(g, W, H, 0.3, M.white(), bx, y + H / 2, D / 2 - 0.15)          // muro lateral
    box(g, 0.3, H, D, M.white(), bx + side * (W / 2 - 0.15), y + H / 2, 0) // muro trasero
    box(g, W, 0.3, D, M.white2(), bx, y + H + 0.15, 0)                  // losa de techo
    edgeBox(g, W, H + 0.3, D, PAL.metalDark, bx, y + (H + 0.3) / 2, 0)
    for (let f = 1; f <= 2; f++) box(g, W - 0.5, 0.18, D - 0.5, M.white2(), bx, y + f * 2.5, 0) // entrepisos
    // montante carmesí + ramales por nivel, visibles por el corte
    cyl(g, 0.28, 0.28, H - 0.3, M.red(), bx + side * 1.6, y + (H - 0.3) / 2, 0.6)
    for (let f = 1; f <= 2; f++) {
      cyl(g, 0.16, 0.16, 4.2, M.red(), bx - side * 0.6, y + f * 2.5 + 0.3, 0.6, { rz: Math.PI / 2 })
      sph(g, 0.2, M.redDeep(), bx - side * 2.5, y + f * 2.5 + 0.3, 0.6)
    }
    // ventanas y bajada pluvial exterior
    plate(g, W * 0.7, 0.5, M.glass(), bx, y + H * 0.58, D / 2 + 0.01)
    plate(g, W * 0.7, 0.5, M.glass(), bx, y + H * 0.58, -D / 2 - 0.01)
    box(g, W, 0.12, 0.12, M.red(), bx, y + H + 0.28, D / 2 - 0.06)      // fascia carmesí
    // tinaco de azotea
    cyl(g, 0.9, 0.9, 1.5, M.white(), bx - side * 2.2, y + H + 1.05, -1.2)
    tor(g, 0.9, 0.06, M.red(), bx - side * 2.2, y + H + 0.6, -1.2, { rx: Math.PI / 2 })
    cyl(g, 0.14, 0.14, 2.2, M.red(), bx - side * 2.2, y + H + 1.85, -1.2)

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
    box(g, 3.6, 1.5, 2.6, M.concrete(), side * 7.2, y + 0.75, -3.4)
    box(g, 3.9, 0.16, 2.9, M.concreteDark(), side * 7.2, y + 1.58, -3.4)
    edgeBox(g, 3.6, 1.5, 2.6, PAL.padEdge, side * 7.2, y + 0.75, -3.4)
    ladder(g, side * 5.3, -3.4, 1.6, side * Math.PI / 2)
    cyl(g, 0.22, 0.22, 1.7, M.red(), side * 9.9, y + 0.85, 1.2)
    valve(g, side * 9.9, y + 1.8, 1.2)
    const med = gauge(g, side * 9.5, y + 1.15, 0.6, { ry: -side * 0.4 })
    up.push((t) => { med.rotation.z = 0.5 + Math.sin(t * 0.9) * 0.24 })
    sign(g, 'AGUA POTABLE', { x: -side * 11.4, y, z: -2.2, ry: -side * 0.5, w: 2.1, h: 0.75, tex: { tone: 'tag' } })
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
    box(g, 3.6, 0.28, 2.2, M.concrete(), sx, y + 0.14, 1.6)
    cyl(g, 0.5, 0.5, 1.7, M.white(), sx - side * 0.7, y + 0.95, 1.6, { rz: Math.PI / 2, ry: side * 1.57 })
    sph(g, 0.52, M.red(), sx + side * 0.9, y + 0.95, 1.6, { sy: 0.9 })
    cyl(g, 0.22, 0.22, 1.9, M.red(), sx + side * 0.9, y + 2.1, 1.6)
    tor(g, 0.3, 0.05, M.red(), sx + side * 0.9, y + 2.9, 1.6, { rx: Math.PI / 2 })
    valve(g, sx + side * 0.9, y + 3.4, 1.6)
    const n1 = gauge(g, sx + side * 0.35, y + 2.35, 2.6, { ry: side * 0.4 })
    const n2 = gauge(g, sx - side * 0.35, y + 2.05, 2.6, { ry: side * 0.6 })
    up.push((t) => { n1.rotation.z = 0.6 + Math.sin(t * 0.8) * 0.28; n2.rotation.z = 0.75 + Math.sin(t * 1.15 + 1) * 0.2 })

    // red aérea de rociadores + hidrante
    const lx = -side * 1.4
    cyl(g, 0.12, 0.12, 8.5, M.white(), lx, y + 4.4, -5, { rz: Math.PI / 2 })
    for (let i = 0; i < 6; i++) {
      const px = lx - 4.2 + i * 1.7
      cyl(g, 0.05, 0.05, 0.7, M.red(), px, y + 4.05, -5)
      sph(g, 0.11, M.white(), px, y + 3.68, -5, { sy: 0.7 })
    }
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

    // excavadora blanca
    const eg = new THREE.Group()
    eg.position.set(side * 7, y, 4.6)
    eg.rotation.y = -side * 2.1
    g.add(eg)
    box(eg, 2.6, 0.5, 1.8, M.dark(), 0, 0.3, 0)
    for (const [cxw, czw] of [[-1.05, 0.95], [1.05, 0.95], [-1.05, -0.95], [1.05, -0.95]]) {
      cyl(eg, 0.42, 0.42, 0.34, M.dark(), cxw, 0.42, czw, { rz: Math.PI / 2 })
    }
    rbox(eg, 2.4, 1.1, 1.6, 0.14, M.white(), 0, 1.2, -0.1)
    box(eg, 0.9, 0.8, 0.9, M.white(), 0.4, 1.35, 0.75)
    plate(eg, 0.7, 0.5, M.glass(), 0.4, 1.5, 1.22)
    const boom = box(eg, 2.4, 0.34, 0.3, M.white(), -1.4, 2.4, 0.4)
    boom.rotation.z = -0.85
    const arm = box(eg, 1.6, 0.26, 0.24, M.white(), -2.5, 1.65, 0.4)
    arm.rotation.z = 0.95
    box(eg, 0.62, 0.42, 0.7, M.dark(), -3.15, 1.35, 0.4)
    K.blob(g, side * 7, 4.6, 5.4, 4.2, y + 0.01)

    // tuberías de concreto apiladas
    for (let i = 0; i < 3; i++) cyl(g, 0.75, 0.75, 2.2, M.white(), -side * 8 + (i % 2) * 0.4, y + 0.75 + Math.floor(i / 2) * 1.5, -6 + i * 0.1, { rz: Math.PI / 2 })

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
    box(g, 3.4, 0.9, 2.6, M.concrete(), cx4, y + 0.45, cz4)
    cyl(g, 1.25, 1.25, 0.9, mat(PAL.red, { r: 0.2, m: 0.1 }), cx4, y + 0.5, cz4, { seg: 22 })
    cyl(g, 0.3, 0.3, 1.3, M.white(), cx4 + side * 1.2, y + 1.25, cz4 + 0.7)
    cyl(g, 0.12, 0.12, 1.6, M.red(), cx4 + side * 1.2, y + 2.2, cz4 + 0.7)
    for (const s of [-1, 1]) cyl(g, 0.05, 0.05, 0.8, M.metal(), cx4 + s * 1.7, y + 1.3, cz4 - 1.3)
    box(g, 3.4, 0.06, 0.06, M.metal(), cx4, y + 1.7, cz4 - 1.3)
    for (let i = 0; i < 3; i++) {
      cyl(g, 0.05, 0.05, 0.7, M.metal(), side * (11.4 + i * 1.1), y + 0.35, 1.6 - i * 0.9)
      sph(g, 0.16, mat(PAL.redSoft, { r: 0.25, m: 0.1 }), side * (11.4 + i * 1.1), y + 0.78, 1.6 - i * 0.9)
    }
    sign(g, ['ZONA DE OBRA', 'NO PASAR'], { x: -side * 12, y, z: 4.4, ry: -side * 0.5, w: 3.0, h: 1.5, tex: { tone: 'warn', foot: 'CASCO OBLIGATORIO' } })
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
    const cart = box(g, 1.1, 0.95, 0.7, M.white(), px - side * 2.6, y + 0.62, 2.6)
    holo(g, 1.15, 0.62, { tex: K.texWave(), x: px - side * 2.6, y: y + 1.55, z: 2.6, ry: -side * 0.5, tilt: -0.12 })
    person(g, px + side * 3, 3.4, { ry: -side * 2.2 })
    cone(g, px - side * 4, 2.4); cone(g, px + side * 1.5, -3.6)
    K.blob(g, px, 0.4, 8, 6, y + 0.01)

    // --- correlador acústico + toma clandestina detectada ---
    const cxc = side * 8.8
    box(g, 0.95, 0.5, 0.62, M.dark(), cxc, y + 0.25, -4.6)
    const feed = holo(g, 1.5, 0.95, { tex: K.texWave(), x: cxc, y: y + 1.35, z: -4.6, ry: -side * 0.4, tilt: -0.1 })
    up.push((t) => { feed.material.opacity = 0.78 + 0.14 * Math.sin(t * 1.2) })
    for (const s of [-1, 1]) {
      cyl(g, 0.04, 0.04, 0.7, M.metal(), cxc + s * 1.5, y + 0.35, -3.4)
      sph(g, 0.12, M.red(), cxc + s * 1.5, y + 0.75, -3.4)
    }
    // by-pass clandestino: derivación con válvula sobre la línea
    cyl(g, 0.16, 0.16, 2.8, M.red(), side * 11.2, y + 0.5, 1.4, { rz: Math.PI / 2 })
    cyl(g, 0.15, 0.15, 1.1, M.redDeep(), side * 11.2, y + 1.0, 1.4)
    valve(g, side * 11.2, y + 1.6, 1.4, { r: 0.3 })
    sign(g, ['FUGA DETECTADA', 'PASO CON PRECAUCIÓN'], { x: -cxc, y, z: -6.6, ry: -side * 0.35, w: 3.0, h: 1.4, tex: { tone: 'warn', foot: 'TRABAJOS DE LOCALIZACIÓN' } })
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

    // crawler con cámara
    const cg = new THREE.Group()
    cg.position.set(0, AXIS_Y - R + 0.75, -2)
    g.add(cg)
    rbox(cg, 1.1, 0.55, 1.7, 0.08, M.white(), 0, 0.45, 0)
    for (const [wx, wz0] of [[-0.62, 0.6], [0.62, 0.6], [-0.62, -0.6], [0.62, -0.6]]) {
      cyl(cg, 0.24, 0.24, 0.16, M.dark(), wx, 0.24, wz0, { rz: Math.PI / 2 })
    }
    const head = box(cg, 0.42, 0.42, 0.34, M.red(), 0, 0.62, -1.0)
    cyl(cg, 0.13, 0.13, 0.1, M.dark(), 0, 0.62, -1.2, { rx: Math.PI / 2 })
    const lampMat = new THREE.MeshStandardMaterial({ color: 0xdceaff, emissive: 0xbfd8ff, emissiveIntensity: 1.4, roughness: 0.3 })
    sph(cg, 0.07, lampMat, -0.16, 0.72, -1.05)
    sph(cg, 0.07, lampMat, 0.16, 0.72, -1.05)
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
  },

  // ---------- 07 · Desazolve Vactor ----------
  (ctx) => {
    const { g, y, side, up } = ctx
    // pavimento de servicio
    box(g, 22, 0.1, 9, mat(0x1c3a5e, { r: 0.92 }), 0, y + 0.05, 1)
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
    // brazo de succión + manguera carmesí hacia el pozo
    const armA = box(tg, 3.2, 0.18, 0.18, M.metal(), 1.2, 3.1, -0.9)
    armA.rotation.z = -0.38
    K.blob(g, side * 5.5, 0.6, 11.5, 5.5, y + 0.12)

    // pozo de visita con sedimento
    const mx = -side * 2.6, mz = 2.2
    tor(g, 0.85, 0.16, M.concrete(), mx, y + 0.12, mz, { rx: Math.PI / 2 })
    cyl(g, 0.72, 0.72, 0.06, mat(0x131f33, { r: 0.95 }), mx, y + 0.13, mz)
    const lid = cyl(g, 0.85, 0.85, 0.08, M.red(), mx - side * 1.5, y + 0.16, mz + 1.2)
    lid.rotation.z = 0.06
    // red expuesta bajo el pozo (corte somero)
    soilBlock(g, 3.4, 1.3, 3, mx - side * 1.2, y, mz + 1.8)
    cyl(g, 0.34, 0.34, 3.6, M.red(), mx - side * 1.2, y - 0.75, mz + 1.8, { rz: Math.PI / 2 })
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
  },

  // ---------- 08 · Calidad de agua y piezometría ----------
  (ctx) => {
    const { g, y, side, up } = ctx
    // caseta laboratorio
    cabin(g, { x: -side * 6, y, z: -3, w: 5, h: 2.9, d: 2.6, winRows: 1 })
    // mesa con muestras carmesí
    const bench = box(g, 3.2, 0.85, 1.2, M.white(), -side * 3.6, y + 0.55, -0.4)
    edgeBox(g, 3.2, 0.85, 1.2, PAL.metalDark, -side * 3.6, y + 0.55, -0.4)
    for (let i = 0; i < 3; i++) {
      const fx = -side * 4.4 + i * 0.9
      cyl(g, 0.24, 0.3, 0.5, M.glass(), fx, y + 1.25, -0.4)
      cyl(g, 0.18, 0.18, 0.3, mat(PAL.redSoft, { r: 0.15, m: 0.1, op: 0.85 }), fx, y + 1.13, -0.4)
    }
    // piezómetro: corte con nivel freático visible en la cara de sección
    const qx = side * 5
    soilBlock(g, 3, 3.2, 3, qx, y, 3.4)
    plate(g, 0.18, 2.6, M.white(), qx - side * 1.53, y - 1.3, 3.4, { d: 0.03 })               // pozo de sección
    plate(g, 0.12, 1.1, mat(PAL.red, { r: 0.12, m: 0.15, op: 0.9 }), qx - side * 1.57, y - 1.2, 3.4, { d: 0.03 }) // nivel freático
    cyl(g, 0.14, 0.14, 1.0, M.white(), qx, y + 0.1, 3.4)                                       // camisa del pozo
    // trípode y sonda
    for (let i = 0; i < 3; i++) {
      const leg = cyl(g, 0.04, 0.04, 2.2, M.metal(), qx + Math.cos(i * 2.09) * 0.5, y + 1.1, 3.4 + Math.sin(i * 2.09) * 0.5)
      leg.rotation.x = Math.sin(i * 2.09) * 0.32
      leg.rotation.z = -Math.cos(i * 2.09) * 0.32
    }
    cyl(g, 0.03, 0.03, 2.6, M.red(), qx, y + 0.4, 3.4)
    const nd = gauge(g, qx, y + 1.75, 3.4)
    const chart = holo(g, 2.1, 1.35, { tex: K.texChart(), x: qx - side * 0.4, y: y + 3.3, z: 3.4, ry: -side * 0.4 })
    up.push((t) => {
      nd.rotation.z = 0.5 + Math.sin(t * 0.5) * 0.3
      chart.material.opacity = 0.8 + 0.13 * Math.sin(t * 0.8 + 1)
    })
    person(g, -side * 4.2, 2.2, { ry: side * 2.5 })
    K.blob(g, qx, 3.4, 4.4, 4.4, y + 0.01)
    K.blob(g, -side * 6, -3, 6.6, 4.4, y + 0.01)

    // --- muestreo: botellas, potenciómetro y piezómetro ---
    for (let i = 0; i < 3; i++) {
      cyl(g, 0.16, 0.16, 0.45, M.glass(), -side * 2.4 + i * 0.55, y + 0.23, 1.5)
      cyl(g, 0.1, 0.1, 0.1, M.white2(), -side * 2.4 + i * 0.55, y + 0.5, 1.5)
    }
    box(g, 0.62, 0.42, 0.42, M.dark(), side * 8.8, y + 0.21, -3.6)
    plate(g, 0.36, 0.26, M.glass(), side * 8.8, y + 0.46, -3.4)
    cyl(g, 0.03, 0.03, 0.9, M.metal(), side * 8.8, y + 0.62, -3.9, { rx: 0.4 })
    cyl(g, 0.15, 0.15, 2.8, M.white(), side * 10.8, y + 1.4, -1.2)
    cyl(g, 0.21, 0.21, 0.22, M.red(), side * 10.8, y + 2.9, -1.2)
    sign(g, ['LABORATORIO', 'MUESTREO EN PROCESO'], { x: -side * 9.6, y, z: -5.6, ry: side * 0.4, w: 3.0, h: 1.45, foot: 'NO INTERFERIR' })
  },

  // ---------- 09 · Estructuras metálicas ----------
  (ctx) => {
    const { g, y, side, up } = ctx
    // nave a medio construir
    const bx = -side * 4
    const colX = [-5, -1.6, 1.8, 5.2]
    for (const cx0 of colX) for (const cz0 of [-3, 3]) {
      box(g, 0.42, 5.6, 0.42, M.white(), bx + cx0, y + 2.8, cz0)
    }
    for (const cz0 of [-3, 3]) {
      box(g, 5.4, 0.34, 0.3, M.white(), bx - 3.3, y + 5.75, cz0)
      box(g, 5.4, 0.34, 0.3, M.white(), bx + 3.5, y + 5.75, cz0)
    }
    for (const cx0 of colX) box(g, 0.3, 0.22, 6, M.white(), bx + cx0, y + 5.95, 0)
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
    box(trolley, 0.8, 0.5, 0.9, M.red(), 0, 0, 0)
    cyl(trolley, 0.03, 0.03, 2.6, M.dark(), 0, -1.5, 0)
    box(trolley, 3.2, 0.4, 0.26, M.white(), 0, -2.9, 0)
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
  },

  // ---------- 10 · Pailería y tanques ----------
  (ctx) => {
    const { g, y, side, up } = ctx
    // silos verticales con escalera
    for (const [sx, sz] of [[-side * 7, -3], [-side * 7, 3.4]]) {
      cyl(g, 1.9, 1.9, 6.2, M.white(), sx, y + 3.1, sz, { seg: 28 })
      sph(g, 1.9, M.white2(), sx, y + 6.2, sz, { sy: 0.5 })
      tor(g, 1.92, 0.07, M.red(), sx, y + 5.7, sz, { rx: Math.PI / 2 })
      tor(g, 1.92, 0.07, M.metal(), sx, y + 1.4, sz, { rx: Math.PI / 2 })
      ladder(g, sx - side * 1.95, sz, 6.2, side > 0 ? Math.PI / 2 : -Math.PI / 2)
      K.blob(g, sx, sz, 5.6, 5.6, y + 0.01)
    }
    // tanque horizontal sobre soportes
    const tx = side * 6, tz = -4
    box(g, 0.7, 1.3, 2.2, M.concrete(), tx - 1.8, y + 0.65, tz)
    box(g, 0.7, 1.3, 2.2, M.concrete(), tx + 1.8, y + 0.65, tz)
    cyl(g, 1.55, 1.55, 6, M.white(), tx, y + 2.6, tz, { rz: Math.PI / 2, seg: 28 })
    tor(g, 1.58, 0.07, M.red(), tx, y + 2.6, tz - 2.4, { rx: Math.PI / 2 })
    tor(g, 1.58, 0.07, M.red(), tx, y + 2.6, tz + 2.4, { rx: Math.PI / 2 })
    cyl(g, 0.12, 0.12, 1.6, M.metal(), tx, y + 4.4, tz)
    K.blob(g, tx, tz, 8.5, 4.4, y + 0.01)

    // roladora con lámina girando
    const rg = new THREE.Group()
    rg.position.set(side * 4.4, y, 4.6)
    g.add(rg)
    box(rg, 3.2, 1, 1.5, M.dark(), 0, 0.5, 0)
    for (const [rx0, rz0] of [[-0.9, 0], [0.9, 0], [0, -0.35]]) cyl(rg, 0.22, 0.22, 1.4, M.metal(), rx0, 1.15, rz0, { rz: Math.PI / 2 })
    const roll = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 1.3, 24, 1, true, 0, 4.1), M.steel())
    roll.position.set(0, 2.2, 0)
    roll.rotation.z = Math.PI / 2
    rg.add(roll)
    up.push((t, dt) => { roll.rotation.y += dt * 0.9 })
    // pila de láminas
    for (let i = 0; i < 4; i++) box(g, 2.8, 0.09, 1.4, M.white2(), side * 8.6, y + 0.28 + i * 0.1, 4.6)
    person(g, side * 2.4, 3.2, { ry: -side * 2.4 })

    // --- boquillas del tanque + escalera caracol + chumaceras ---
    for (const off of [-1.7, 0, 1.7]) {
      cyl(g, 0.17, 0.17, 0.55, M.metal(), tx + off, y + 4.2, tz)
      tor(g, 0.22, 0.045, M.red(), tx + off, y + 4.5, tz, { rx: Math.PI / 2 })
    }
    const sp10 = new THREE.Group()
    sp10.position.set(-side * 7, y, 3.4)
    g.add(sp10)
    for (let i = 0; i < 14; i++) {
      const a = i * 0.52
      const st = box(sp10, 0.18, 0.05, 0.78, M.white2(), Math.sin(a) * 2.25, 0.55 + i * 0.42, Math.cos(a) * 2.25)
      st.rotation.y = a
    }
    for (const s of [-0.9, 0.9]) {
      box(g, 0.7, 0.5, 0.6, M.concrete(), side * 4.4 + s, y + 0.25, 1.4)
      cyl(g, 0.26, 0.26, 0.5, M.metal(), side * 4.4 + s, y + 0.6, 1.4, { rz: Math.PI / 2 })
    }
    sign(g, ['PAILERÍA', 'TANQUES EN FABRICACIÓN'], { x: -side * 11.6, y, z: -1.4, ry: -side * 0.5, w: 3.0, h: 1.45, foot: 'TRABAJO EN CALIENTE' })
  },

  // ---------- 11 · Tuberías de presión ----------
  (ctx) => {
    const { g, y, side, up } = ctx
    const fx = -side * 4
    // rack en H con tubería
    for (const fz of [-4.5, 0, 4.5]) {
      box(g, 0.36, 4.4, 0.36, M.white(), fx - 3.2, y + 2.2, fz)
      box(g, 0.36, 4.4, 0.36, M.white(), fx + 3.2, y + 2.2, fz)
      box(g, 6.8, 0.3, 0.3, M.white(), fx, y + 4.4, fz)
      box(g, 6.8, 0.3, 0.3, M.white(), fx, y + 3.1, fz)
    }
    const lay = (r, yy, m, flangeM) => {
      cyl(g, r, r, 13, m, fx, y + yy, 0, { rz: Math.PI / 2, seg: 20 })
      for (const fz of [-4.5, 0, 4.5]) tor(g, r + 0.05, 0.07, flangeM, fx, y + yy, fz, { ry: Math.PI / 2 })
    }
    lay(0.4, 1.75, M.white(), M.red())
    lay(0.4, 2.5, M.white(), M.red())
    lay(0.32, 3.05, M.steel(), M.red())
    lay(0.46, 4.05, M.red(), M.redDeep())
    // bridas de prueba + manómetros
    const riser = cyl(g, 0.2, 0.2, 2.2, M.red(), fx + 4.8, y + 2.85, 2.2)
    valve(g, fx + 4.8, y + 3.9, 2.2)
    const n = gauge(g, fx + 4.4, y + 3.4, 1.4, { ry: -side * 0.5 })
    up.push((t) => { n.rotation.z = 0.55 + Math.sin(t * 1.3) * 0.24 })
    // cabezal de pruebas con válvulas
    box(g, 0.7, 0.7, 0.7, M.red(), fx - 5.6, y + 1.6, -2.4)
    valve(g, fx - 5.6, y + 2.1, -3.1, { r: 0.3 })
    person(g, fx - 6.6, 0.6, { ry: side * 1.8 })
    box(g, 0.8, 0.5, 0.5, M.red(), fx - 6.4, y + 0.45, 1.8)   // caja de herramienta
    K.blob(g, fx, 0, 13.5, 6.5, y + 0.01)

    // --- junta de expansión con bridas ANSI + manómetro de línea ---
    const jx11 = side * 8.6
    cyl(g, 0.5, 0.5, 2.8, M.white(), jx11, y + 1.65, -1.2, { rz: Math.PI / 2, seg: 20 })
    for (const s of [-1, 1]) tor(g, 0.56, 0.09, M.red(), jx11 + s * 1.35, y + 1.65, -1.2, { ry: Math.PI / 2 })
    for (let i = 0; i < 4; i++) tor(g, 0.5, 0.05, M.metal(), jx11 + (i - 1.5) * 0.3, y + 1.65, -1.2, { ry: Math.PI / 2 })
    for (const s of [-1, 1]) box(g, 0.5, 0.9, 0.5, M.concrete(), jx11 + s * 2.2, y + 0.45, -1.2)
    const n11 = gauge(g, jx11, y + 2.7, -1.2, { ry: -side * 0.4 })
    up.push((t) => { n11.rotation.z = 0.5 + Math.sin(t * 1.4) * 0.26 })
  },

  // ---------- 12 · Sand blast y recubrimientos ----------
  (ctx) => {
    const { g, y, side, up } = ctx
    const bx = side * 3
    // cabina de voladura (abierta al frente)
    box(g, 0.4, 4.6, 7, M.white(), bx + 5.4, y + 2.3, 0)
    box(g, 7, 0.4, 0.4, M.white(), bx + 2.4, y + 4.6, -3.4)
    box(g, 7, 0.4, 0.4, M.white(), bx + 2.4, y + 4.6, 3.4)
    box(g, 11.4, 0.28, 7, M.white2(), bx + 2.4, y + 4.95, 0)
    edgeBox(g, 11.4, 5, 7, PAL.metalDark, bx + 2.4, y + 2.5, 0)

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
    box(g, 1.7, 1.05, 1.05, M.white2(), -side * 7.4, y + 0.52, -3.8)
    for (const s of [-1, 1]) cyl(g, 0.27, 0.27, 0.18, M.dark(), -side * 7.4 + s * 0.52, y + 0.27, -3.2, { rx: Math.PI / 2 })
    cyl(g, 0.08, 0.08, 1.3, M.metal(), -side * 7.4, y + 1.7, -3.8)
    cyl(g, 0.95, 0.2, 1.15, M.metal(), -side * 10.6, y + 1.4, -1.6, { seg: 18 })
    cyl(g, 0.95, 0.95, 0.95, M.white2(), -side * 10.6, y + 2.45, -1.6, { seg: 18 })
    box(g, 1.7, 2.4, 0.22, M.white2(), -side * 4.8, y + 1.2, 4.6)
    plate(g, 1.7, 1.2, mat(PAL.steel, { r: 0.55, m: 0.5 }), -side * 4.8, y + 0.62, 4.73)
    sign(g, ['SAND BLAST', 'PROTECCIÓN AUDITIVA Y VISUAL'], { x: -side * 9.8, y, z: 5.2, ry: side * 0.45, w: 3.2, h: 1.5, tex: { tone: 'danger', foot: 'EQUIPO OBLIGATORIO' } })
  },

  // ---------- 13 · Mantenimiento ----------
  (ctx) => {
    const { g, y, side, up } = ctx
    const sx = -side * 3
    // galpón abierto
    for (const [px, pz] of [[sx - 3, -2.6], [sx + 3, -2.6], [sx - 3, 2.6], [sx + 3, 2.6]]) {
      box(g, 0.34, 3.9, 0.34, M.white(), px, y + 1.95, pz)
    }
    box(g, 6.6, 0.26, 6.2, M.white2(), sx, y + 4.05, 0)
    edgeBox(g, 6.6, 0.26, 6.2, PAL.metalDark, sx, y + 4.05, 0)

    // skid de bomba
    box(g, 3.6, 0.26, 1.9, M.concrete(), sx, y + 0.13, 0.6)
    cyl(g, 0.45, 0.45, 1.6, M.white(), sx - side * 0.6, y + 0.85, 0.6, { rz: Math.PI / 2, ry: side * 1.57 })
    const coup = cyl(g, 0.2, 0.2, 0.34, M.dark(), sx - side * 0.15, y + 0.85, 0.6, { rz: Math.PI / 2, ry: side * 1.57 })
    plate(coup, 0.12, 0.04, M.white(), 0, 0.12, 0.18, { d: 0.02 })
    sph(g, 0.48, M.red(), sx + side * 0.65, y + 0.85, 0.6, { sy: 0.92 })
    cyl(g, 0.16, 0.16, 1.4, M.red(), sx + side * 0.65, y + 1.7, 0.6)
    valve(g, sx + side * 0.65, y + 2.15, 0.6, { r: 0.3 })
    cyl(g, 0.14, 0.14, 1.6, M.red(), sx + side * 0.65, y + 0.6, 1.9, { rx: 0 })
    const ng = gauge(g, sx + side * 0.15, y + 2.2, 1.3, { ry: side * 0.7 })
    up.push((t) => { ng.rotation.z = 0.5 + Math.sin(t * 1.1) * 0.3 })
    up.push((t, dt) => { coup.rotation.y += dt * 4 })

    // banco con impeler desmontado
    const ix = side * 6
    box(g, 0.9, 0.9, 0.9, M.dark(), ix, y + 0.45, 2.8)
    cyl(g, 0.08, 0.08, 1.1, M.metal(), ix, y + 1.4, 2.8)
    const imp = new THREE.Group()
    imp.position.set(ix, y + 2.05, 2.8)
    g.add(imp)
    for (let i = 0; i < 6; i++) {
      const blade = box(imp, 0.5, 0.05, 0.24, M.red(), 0.34, 0, 0)
      blade.rotation.y = (i * Math.PI) / 3
    }
    cyl(imp, 0.14, 0.14, 0.2, M.white(), 0, 0.14, 0)
    up.push((t, dt) => { imp.rotation.y += dt * 2.2 })

    // holograma de lista + caja de herramienta
    const cl = holo(g, 1.9, 1.45, { tex: K.texCheck(), x: sx + side * 4.4, y: y + 2.6, z: -1.4, ry: -side * 0.5 })
    up.push((t) => { cl.material.opacity = 0.78 + 0.15 * Math.sin(t * 1.05) })
    box(g, 0.9, 0.4, 0.5, M.red(), sx + side * 1.8, y + 0.2, 3.6)
    person(g, sx - side * 1.8, 3, { ry: side * 2.3 })
    K.blob(g, sx, 0.6, 8, 5, y + 0.01)
    cone(g, sx - 4, 4.6)

    // --- cámara termográfica en trípode + sensor de vibración ---
    const tx13 = side * 4.8, tz13 = -3.4
    for (let i = 0; i < 3; i++) {
      const leg = cyl(g, 0.035, 0.035, 1.8, M.metal(), tx13 + Math.cos(i * 2.09) * 0.44, y + 0.9, tz13 + Math.sin(i * 2.09) * 0.44)
      leg.rotation.z = -Math.cos(i * 2.09) * 0.3
      leg.rotation.x = Math.sin(i * 2.09) * 0.3
    }
    box(g, 0.52, 0.42, 0.36, M.dark(), tx13, y + 1.92, tz13)
    cyl(g, 0.1, 0.12, 0.3, M.metal(), tx13 - side * 0.3, y + 1.92, tz13, { rz: Math.PI / 2 })
    const thm = holo(g, 1.35, 0.9, { tex: K.texChart(), x: tx13 + side * 0.15, y: y + 2.95, z: tz13, ry: -side * 0.35, tilt: -0.08 })
    up.push((t) => { thm.material.opacity = 0.72 + 0.16 * Math.sin(t * 0.9) })
    sph(g, 0.13, M.red(), sx + side * 1.25, y + 1.4, 0.6)
    cyl(g, 0.02, 0.02, 0.9, M.dark(), sx + side * 1.25, y + 1.85, 0.6, { rz: 0.45 })
    sign(g, ['MANTENIMIENTO', 'EQUIPO EN SERVICIO'], { x: -side * 9.4, y, z: 1.8, ry: -side * 0.45, w: 3.2, h: 1.5, foot: 'NO OPERAR SIN AUTORIZACIÓN' })
  },

  // ---------- 14 · Remodelaciones y electromecánica ----------
  (ctx) => {
    const { g, y, side, up } = ctx
    const bx = -side * 3
    // edificio remodelado con banda carmesí
    box(g, 8, 5, 4, M.white(), bx, y + 2.5, -1)
    edgeBox(g, 8, 5, 4, PAL.metalDark, bx, y + 2.5, -1)
    box(g, 8.04, 0.14, 0.06, M.red(), bx, y + 1.4, 1.02)
    for (let i = 0; i < 3; i++) plate(g, 1.2, 1.1, M.glass(), bx - 2.2 + i * 2.2, y + 3.4, 1.02)
    // andamio en el extremo
    const scx = bx + side * 4.6
    for (const sz2 of [-1, 1]) cyl(g, 0.05, 0.05, 4.4, M.metal(), scx, y + 2.2, sz2)
    for (let lvl = 0; lvl < 3; lvl++) {
      cyl(g, 0.04, 0.04, 2.2, M.metal(), scx, y + 0.8 + lvl * 1.4, 0, { rx: Math.PI / 2 })
      box(g, 0.7, 0.07, 2.4, M.white2(), scx, y + 0.9 + lvl * 1.4, 0)
    }
    person(g, scx, 0, { y: y + 0.9 + 1.4, ry: side * 1.6, s: 0.9 })

    // tablero eléctrico con LED carmesí
    const px2 = bx - side * 1
    box(g, 1.3, 1.9, 0.6, M.metal(), px2, y + 1.0, 1.6)
    const door = plate(g, 0.62, 1.7, M.white2(), px2 - side * 0.68, y + 1.0, 1.6, { ry: side * 0.7, d: 0.05 })
    for (let i = 0; i < 6; i++) box(g, 0.16, 0.12, 0.08, M.dark(), px2 - side * 0.1 + (i % 3) * 0.3 * -side, y + 0.55 + Math.floor(i / 3) * 0.35, 1.92)
    const ledMat = new THREE.MeshStandardMaterial({ color: PAL.red, emissive: PAL.red, emissiveIntensity: 1.2, roughness: 0.3 })
    const leds = []
    for (let i = 0; i < 3; i++) leds.push(sph(g, 0.045, ledMat, px2 - side * 0.35, y + 1.6, 1.93))
    up.push((t) => { ledMat.emissiveIntensity = 0.4 + (Math.sin(t * 2.2) > 0 ? 1.3 : 0.15) })

    // ducto bandeja carmesí por la fachada
    box(g, 5, 0.12, 0.12, M.red(), bx - side * 1.2, y + 4.6, 1.03)
    // motofanía en azotea: motor + polea girando
    const mx = bx - side * 2
    box(g, 1.1, 0.7, 0.9, M.dark(), mx, y + 5.35, -1)
    cyl(g, 0.06, 0.06, 0.9, M.metal(), mx + 0.8, y + 5.35, -1, { rz: Math.PI / 2 })
    const pulley = cyl(g, 0.34, 0.34, 0.14, M.white(), mx + 1.4, y + 5.35, -1, { rz: Math.PI / 2 })
    plate(pulley, 0.3, 0.04, M.red(), 0, 0, 0.09, { d: 0.03 })
    cyl(g, 0.34, 0.34, 0.14, M.white(), mx + 2.2, y + 5.35, -1, { rz: Math.PI / 2 })
    up.push((t, dt) => { pulley.rotation.y += dt * 5 })

    person(g, bx - side * 5.6, 1.8, { ry: side * 2.8 })
    cone(g, bx - side * 6.4, 3.4)
    K.blob(g, bx, -1, 9.5, 6.5, y + 0.01)

    // --- charola portacables, cableado al tablero y rotulación ---
    const trx = bx + side * 4.6
    for (let i = 0; i < 5; i++) {
      box(g, 2.6, 0.06, 0.06, M.metal(), trx, y + 0.7 + i * 1.05, 3.4 + i * 0.34)
      for (const s of [-1, 1]) box(g, 0.05, 0.3, 0.05, M.metal(), trx + s * 1.25, y + 0.7 + i * 1.05, 3.4 + i * 0.34)
    }
    tube(g, [V(trx, y + 5.2, 4.9), V(trx - side * 1.6, y + 3.6, 3.6), V(px2, y + 2.0, 1.75)], 0.075, M.dark())
    cyl(g, 0.09, 0.09, 0.5, M.metal(), px2, y + 2.1, 1.62)
    sign(g, ['OBRA ELECTROMECÁNICA', 'ALTA TENSIÓN'], { x: -side * 10.8, y, z: 5.4, ry: -side * 0.5, w: 3.2, h: 1.5, tex: { tone: 'warn', foot: 'SOLO PERSONAL AUTORIZADO' } })
  },
]
