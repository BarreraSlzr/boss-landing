// ============================================================
// hero.js — relieve isométrico del héroe
// Tres niveles de altura en 3D: México (base), Jalisco (elevado)
// y Guadalajara/ZMG (pin + micro-ciudad). Se disuelve con ruido y
// humo conforme el vuelo llega al primer escenario.
// ============================================================

import * as THREE from 'three'
import * as K from './kit.js'
import { MX, JALISCO, STATES, BOUNDS, ZMG } from './geo/mx.js'

const { canvasTex } = K

function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// ---------- proyección al plano del tablero ----------
const LAT_MID = (BOUNDS.lat0 + BOUNDS.lat1) / 2
const LON_MID = (BOUNDS.lon0 + BOUNDS.lon1) / 2
const KX = Math.cos((LAT_MID * Math.PI) / 180)
const SPAN_X = (BOUNDS.lon1 - BOUNDS.lon0) * KX
const SPAN_Y = BOUNDS.lat1 - BOUNDS.lat0
const BOARD_W = 48
const SCALE = BOARD_W / SPAN_X
const BOARD_H = SPAN_Y * SCALE
const mx = (lon) => (lon - LON_MID) * KX * SCALE
const my = (lat) => (lat - LAT_MID) * SCALE

// niveles de altura (sobre la normal del tablero)
const H_MX = 0.9
const H_JAL = 1.5
const H_ZMG = 3.2

// ---------- texturas ----------
const texBase = () => canvasTex(1024, 1024, (c, w, h) => {
  const s = w / SPAN_X
  const cx = (lon) => (lon - LON_MID) * KX * s + w / 2
  const cy = (lat) => h / 2 - (lat - LAT_MID) * s
  const g = c.createLinearGradient(0, 0, w, h)
  g.addColorStop(0, '#12305a')
  g.addColorStop(0.55, '#0e2547')
  g.addColorStop(1, '#0b1e3a')
  c.fillStyle = g
  c.fillRect(0, 0, w, h)
  c.strokeStyle = 'rgba(99,198,255,0.10)'
  c.lineWidth = 1
  for (let x = 0; x <= w; x += 48) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke() }
  for (let y = 0; y <= h; y += 48) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke() }
  c.strokeStyle = 'rgba(99,198,255,0.2)'
  for (let x = 0; x <= w; x += 192) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke() }
  for (let y = 0; y <= h; y += 192) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke() }
  c.strokeStyle = 'rgba(99,198,255,0.28)'
  c.lineWidth = 1.6
  for (const rings of STATES) for (const ring of rings) {
    c.beginPath()
    ring.forEach(([lon, lat], i) => (i ? c.lineTo(cx(lon), cy(lat)) : c.moveTo(cx(lon), cy(lat))))
    c.closePath(); c.stroke()
  }
  const [zxp, zyp] = [cx(ZMG[0]), cy(ZMG[1])]
  const rg = c.createRadialGradient(zxp, zyp, 0, zxp, zyp, s * 1.9)
  rg.addColorStop(0, 'rgba(190,232,255,0.5)')
  rg.addColorStop(0.4, 'rgba(99,198,255,0.2)')
  rg.addColorStop(1, 'rgba(62,139,255,0)')
  c.fillStyle = rg
  c.beginPath(); c.arc(zxp, zyp, s * 1.9, 0, Math.PI * 2); c.fill()
  c.fillStyle = 'rgba(233,242,252,0.16)'
  c.font = '700 44px "IBM Plex Mono", monospace'
  c.fillText('MÉXICO', cx(-105.6) - 60, cy(29.6))
  // rótulo de Jalisco en el Pacífico (fuera de la banda central del texto),
  // unido al estado por una guía fina como en un plano
  const jx0 = cx(-116.2), jy0 = cy(21.6)
  c.strokeStyle = 'rgba(143,208,255,0.65)'
  c.lineWidth = 1.6
  c.beginPath(); c.moveTo(jx0 + 40, jy0); c.lineTo(cx(-104.2), cy(20.9)); c.stroke()
  c.fillStyle = 'rgba(143,208,255,0.95)'
  c.font = '600 26px "IBM Plex Mono", monospace'
  c.fillText('JALISCO', jx0 - 60, jy0 - 12)
})

const texJal = () => canvasTex(512, 512, (c, w, h) => {
  const g = c.createLinearGradient(0, 0, w, h)
  g.addColorStop(0, '#3a7ede')
  g.addColorStop(1, '#1e4fa4')
  c.fillStyle = g
  c.fillRect(0, 0, w, h)
  c.strokeStyle = 'rgba(255,255,255,0.18)'
  c.lineWidth = 1
  for (let x = 0; x <= w; x += 32) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke() }
  for (let y = 0; y <= h; y += 32) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke() }
})

const texBackdrop = () => canvasTex(256, 256, (c, w, h) => {
  c.fillStyle = '#0a1830'
  c.fillRect(0, 0, w, h)
  c.strokeStyle = 'rgba(99,198,255,0.055)'
  c.lineWidth = 1
  for (let x = 0; x <= w; x += 32) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke() }
  for (let y = 0; y <= h; y += 32) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke() }
  c.strokeStyle = 'rgba(99,198,255,0.1)'
  c.beginPath(); c.moveTo(0, 0); c.lineTo(w, 0); c.moveTo(0, 0); c.lineTo(0, h); c.stroke()
})

const texPuff = () => canvasTex(128, 128, (c, w, h) => {
  const g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2)
  g.addColorStop(0, 'rgba(214,232,255,0.95)')
  g.addColorStop(0.45, 'rgba(120,170,230,0.35)')
  g.addColorStop(1, 'rgba(120,170,230,0)')
  c.fillStyle = g
  c.fillRect(0, 0, w, h)
})

function texNoise() {
  const t = canvasTex(256, 256, (c, w, h) => {
    const rnd = mulberry32(21)
    c.fillStyle = '#161616'
    c.fillRect(0, 0, w, h)
    for (let i = 0; i < 420; i++) {
      const x = rnd() * w, y = rnd() * h, r = 8 + rnd() * 44
      const g = c.createRadialGradient(x, y, 0, x, y, r)
      g.addColorStop(0, `rgba(255,255,255,${0.25 + rnd() * 0.55})`)
      g.addColorStop(1, 'rgba(255,255,255,0)')
      c.fillStyle = g
      c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill()
    }
    for (let i = 0; i < 260; i++) {
      const x = rnd() * w, y = rnd() * h, r = 6 + rnd() * 26
      const g = c.createRadialGradient(x, y, 0, x, y, r)
      g.addColorStop(0, 'rgba(0,0,0,0.62)')
      g.addColorStop(1, 'rgba(0,0,0,0)')
      c.fillStyle = g
      c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill()
    }
  })
  if (t) { t.wrapS = t.wrapT = THREE.RepeatWrapping }
  return t
}

const VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const FRAG = `
  uniform sampler2D uMap;
  uniform sampler2D uNoise;
  uniform float uProgress, uTime, uUseMap, uLight;
  uniform vec3 uColor, uEdge;
  varying vec2 vUv;
  void main() {
    vec3 base = uColor;
    if (uUseMap > 0.5) base = texture2D(uMap, vUv).rgb;
    // luz simulada de plano: más claro arriba-izquierda
    float lam = 0.7 + 0.45 * clamp(0.55 - vUv.x * 0.2 + (1.0 - vUv.y) * 0.5, 0.0, 1.0);
    vec3 col = base * uLight * lam;
    // barrido de escaneo: el plano respira incluso en reposo
    float sweep = exp(-pow((vUv.x - fract(uTime * 0.055)) * 5.5, 2.0));
    col += uEdge * sweep * 0.2;
    float n = texture2D(uNoise, vUv * 3.0 + vec2(uTime * 0.012, uTime * 0.009)).r;
    // el umbral arranca por debajo del mínimo del ruido: en reposo el material
    // es macizo (sin perforaciones) y se disuelve por completo al final
    float thr = uProgress * 1.35 - 0.14;
    float m = smoothstep(thr - 0.07, thr + 0.07, n);
    float edge = 1.0 - smoothstep(0.0, 0.09, abs(n - thr));
    col += uEdge * edge * 1.5 * (1.0 - uProgress * 0.4);
    float fade = 1.0 - smoothstep(0.8, 1.0, uProgress);
    float a = m * fade;
    if (a < 0.02) discard;
    gl_FragColor = vec4(col, a);
    #include <colorspace_fragment>
  }
`

export function buildHeroMap(scene, updaters) {
  const noise = texNoise()
  const baseTex = texBase()
  const jalTex = texJal()
  const backTex = texBackdrop()
  if (backTex) { backTex.wrapS = backTex.wrapT = THREE.RepeatWrapping }
  if (!noise || !baseTex) return { setProgress() {}, resize() {}, group: null }

  const mats = []
  const matOf = (o) => {
    const m = new THREE.ShaderMaterial({
      uniforms: {
        uMap: { value: o.map ?? null },
        uNoise: { value: noise },
        uProgress: { value: 0 },
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(o.color ?? 0x123055) },
        uEdge: { value: new THREE.Color(o.edge ?? 0x63c6ff) },
        uUseMap: { value: o.map ? 1 : 0 },
        uLight: { value: o.light ?? 1 },
      },
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      side: THREE.DoubleSide,
    })
    mats.push(m)
    return m
  }

  // --- fondo sólido del primer cuadro -------------------------------------
  // Un plano pegado a la cámara, por delante del distrito y por detrás del
  // relieve: el mapa se lee sobre color plano y el color se disuelve para
  // dar paso a los escenarios.
  const BACK_DIST = 52
  const backdrop = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    matOf({ map: backTex, light: 1, edge: 0x63c6ff })
  )
  backdrop.material.uniforms.uUseMap.value = backTex ? 1 : 0
  if (!backTex) backdrop.material.uniforms.uColor.value = new THREE.Color(0x0a1830)
  const backMat = backdrop.material
  backMat.side = THREE.FrontSide
  backdrop.frustumCulled = false
  // El fondo es una capa de pantalla: ignora la profundidad y se dibuja por
  // delante de todo el distrito (que se extiende por delante del plano y por
  // eso no bastaba un plano a distancia fija). El relieve va después.
  backMat.depthTest = false
  backMat.depthWrite = false
  backdrop.renderOrder = 900
  scene.add(backdrop)
  let backProgress = 0

  const group = new THREE.Group()
  group.position.set(0, 19.5, 30)
  group.rotation.x = 0.34
  scene.add(group)
  const RELIEF_ORDER = 1000       // por delante de la capa de fondo

  const shapeOf = (ring) => new THREE.Shape(ring.map(([lon, lat]) => new THREE.Vector2(mx(lon), my(lat))))

  function slab(ring, depth, topOpts, sideColor) {
    const geo = new THREE.ExtrudeGeometry(shapeOf(ring), { depth, bevelEnabled: false, curveSegments: 1 })
    const uv = geo.attributes.uv
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      uv.setXY(i, (pos.getX(i) + BOARD_W / 2) / BOARD_W, (pos.getY(i) + BOARD_H / 2) / BOARD_H)
    }
    geo.rotateX(-Math.PI / 2)
    const mesh = new THREE.Mesh(geo, [matOf({ map: topOpts.map, light: topOpts.light ?? 1 }), matOf({ color: sideColor, light: 0.6 })])
    mesh.renderOrder = RELIEF_ORDER
    return mesh
  }

  // nivel 01 · México
  group.add(slab(MX, H_MX, { map: baseTex }, 0x0a1c36))
  const outline = (ring, y, color, opacity) => {
    const pts = ring.map(([lon, lat]) => new THREE.Vector3(mx(lon), y, -my(lat)))
    pts.push(pts[0].clone())
    return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color, transparent: true, opacity }))
  }
  const mxEdge = outline(MX, H_MX + 0.03, 0x63c6ff, 0.95)
  group.add(mxEdge)

  // nivel 02 · Jalisco elevado
  const jal = slab(JALISCO, H_JAL, { map: jalTex, light: 1.05 }, 0x18427f)
  jal.position.y = H_MX + 0.02
  group.add(jal)
  const jalEdge = outline(JALISCO, H_MX + H_JAL + 0.07, 0xc6ecff, 1)
  group.add(jalEdge)

  // nivel 03 · Guadalajara + ZMG
  const zx = mx(ZMG[0])
  const zz = -my(ZMG[1])
  const jalTop = H_MX + H_JAL + 0.08
  const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, H_ZMG, 10), matOf({ color: 0x9fd4ff, light: 1.3 }))
  pin.position.set(zx, jalTop + H_ZMG / 2, zz)
  group.add(pin)
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.55, 0.075, 8, 40), matOf({ color: 0xc6ecff, light: 1.35 }))
  ring.rotation.x = Math.PI / 2
  ring.position.set(zx, jalTop + 0.04, zz)
  group.add(ring)
  const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 12), matOf({ color: 0xeaf6ff, light: 1.4, edge: 0xffffff }))
  beacon.position.set(zx, jalTop + H_ZMG, zz)
  group.add(beacon)
  const rnd = mulberry32(5)
  const city = []
  for (let i = 0; i < 16; i++) {
    const a = rnd() * Math.PI * 2, r = 0.7 + rnd() * 3.4
    const bh = 0.35 + rnd() * 0.8
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.36, bh, 0.36), matOf({ color: i % 3 === 0 ? 0x3f86d8 : 0x1d4c88, light: 1.15 }))
    b.position.set(zx + Math.cos(a) * r, jalTop + bh / 2, zz + Math.sin(a) * r * 0.8)
    b.userData.baseY = b.position.y
    b.rotation.y = rnd() * Math.PI
    city.push(b)
    group.add(b)
  }

  // humo del viaje
  const COUNT = 130
  const pos2 = new Float32Array(COUNT * 3)
  const seed = new Float32Array(COUNT)
  const r2 = mulberry32(99)
  for (let i = 0; i < COUNT; i++) {
    pos2[i * 3] = (r2() - 0.5) * BOARD_W * 1.1
    pos2[i * 3 + 1] = 1 + r2() * 6
    pos2[i * 3 + 2] = (r2() - 0.5) * BOARD_H * 1.2
    seed[i] = r2()
  }
  const smokeGeo = new THREE.BufferGeometry()
  smokeGeo.setAttribute('position', new THREE.BufferAttribute(pos2, 3))
  const smokeMat = new THREE.PointsMaterial({
    size: 5.2, map: texPuff(), transparent: true, opacity: 0, depthWrite: false,
    blending: THREE.AdditiveBlending, color: 0x9fc6ee, sizeAttenuation: true,
  })
  group.add(new THREE.Points(smokeGeo, smokeMat))

  let progress = 0
  let smokeOn = 0
  function setProgress(v, camera) {
    progress = Math.min(1, Math.max(0, v))
    if (camera) placeBackdrop(camera)
    const sst = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t) }
    backProgress = sst(0.4, 0.95, progress)      // el color se retira al final
    backMat.uniforms.uProgress.value = backProgress
    backdrop.visible = backProgress < 0.995
    for (const m of mats) m.uniforms.uProgress.value = progress
    smokeOn = Math.sin(Math.min(1, progress * 1.05) * Math.PI)
    group.visible = progress <= 0.995
  }

  // Composición: el relieve es el fondo principal del primer pantallazo,
  // centrado y grande; el mensaje va encima y la rotulación del plano vive en
  // la banda inferior para no chocar con el texto.
  // coloca el fondo al frente de la cámara, cubriendo todo el cuadro
  const _fwd = new THREE.Vector3()
  const placeBackdrop = (camera) => {
    camera.getWorldDirection(_fwd)
    backdrop.position.copy(camera.position).addScaledVector(_fwd, BACK_DIST)
    backdrop.quaternion.copy(camera.quaternion)
    const hh = 2 * BACK_DIST * Math.tan((camera.fov * Math.PI) / 360)
    const ww = hh * (innerWidth / innerHeight)
    backdrop.scale.set(ww * 1.06, hh * 1.06, 1)
    if (backTex) backTex.repeat.set(Math.max(1, Math.round(ww / 5)), Math.max(1, Math.round(hh / 5)))
  }

  function resize() {
    const aspect = innerWidth / innerHeight
    if (aspect < 1.1) {
      // portrait / móvil: relieve sube y crece hasta meterse bajo el mensaje —
      // una sola composición, no dos islas con vacío en medio
      const short = Math.max(0, Math.min(1, (780 - innerHeight) / 220))
      // ritmo 3-6-9: relieve en 6–9, un poco más abajo para no pegar a los CTAs
      group.position.set(2.4, 23.2 - short * 0.3, 34)
      group.scale.setScalar(0.84)
    } else {
      // el país baja lo justo para que Jalisco y el pin queden bajo el mensaje
      group.position.set(0, 15, 30)
      group.scale.setScalar(0.6)
    }
  }
  resize()

  const beaconBase = beacon.position.y
  updaters.push((t, dt) => {
    if (!group.visible) return
    for (const m of mats) m.uniforms.uTime.value = t
    // latido del nivel 03: baliza, anillo y ciudad
    const pulse = 0.5 + 0.5 * Math.sin(t * 1.9)
    beacon.scale.setScalar(0.85 + pulse * 0.4)
    beacon.position.y = beaconBase + pulse * 0.12
    ring.scale.setScalar(1 + pulse * 0.09)
    for (let i = 0; i < city.length; i++) city[i].position.y = city[i].userData.baseY + Math.sin(t * 1.3 + i * 0.7) * 0.05
    smokeMat.opacity = smokeOn * 0.5
    if (smokeOn <= 0.001) return
    const arr = smokeGeo.attributes.position.array
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3] += dt * (0.9 + seed[i] * 2.2)
      arr[i * 3 + 1] += dt * (0.3 + seed[i] * 0.6)
      if (arr[i * 3] > BOARD_W * 0.62) {
        arr[i * 3] = -BOARD_W * 0.62
        arr[i * 3 + 1] = 1 + seed[i] * 6
        arr[i * 3 + 2] = (seed[i] - 0.5) * BOARD_H * 1.2
      }
    }
    smokeGeo.attributes.position.needsUpdate = true
  })

  group.traverse((o) => {
    if (o.isMesh || o.isLine) o.renderOrder = RELIEF_ORDER
    if (o.isPoints) o.renderOrder = RELIEF_ORDER + 1
  })
  setProgress(0)
  return {
    setProgress,
    resize,
    group,
    // 1 = el color cubre todo el cuadro (el distrito no se ve)
    backdropCover: () => 1 - backProgress,
  }
}
