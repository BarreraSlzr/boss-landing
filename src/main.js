// ============================================================
// main.js — arranque: DOM story, renderer y motor de scroll
// El scroll dirige el tiempo de un único vuelo continuo.
// ============================================================

import './style.css'
import * as THREE from 'three'
import { BRAND, TOPICS, HERO, FINALE, CLIENTS, TECH, ZONES } from './data.js'
import waIcon from './assets/whatsapp.svg?raw'
import { buildWorld } from './world.js'

const $ = (sel) => document.querySelector(sel)

// ---------- construcción del DOM narrativo ----------
function buildSections() {
  const root = $('#sections')

  // hero
  const hero = document.createElement('section')
  hero.className = 'section hero'
  hero.dataset.idx = '0'
  hero.innerHTML = `
    <div class="inner">
      <div class="hero-eyebrow">${HERO.eyebrow}</div>
      <h1 class="hero-title">${HERO.title}<span>.</span></h1>
      <p class="hero-sub">${HERO.sub}</p>
      <p class="hero-sub hero-sub-mobile">${HERO.subMobile}</p>
      <div class="hero-chips">${HERO.chips.map((c) => `<span>${c}</span>`).join('')}</div>
      <div class="hero-ctas">
        <a class="btn btn-primary" href="#" data-goto="${HERO.ctaGoto}">${HERO.cta[0]}</a>
        <button class="btn btn-ghost" type="button" id="tour-btn">${HERO.cta[1]}</button>
      </div>
    </div>
    <div class="scroll-hint">desliza para recorrer<i></i></div>
  `
  root.appendChild(hero)

  // estaciones 01–14
  TOPICS.forEach((tp, i) => {
    const sec = document.createElement('section')
    sec.className = `section ${i % 2 === 0 ? 'align-left' : 'align-right'}`
    sec.dataset.idx = String(i + 1)
    sec.style.setProperty('--accent', tp.accent)
    sec.innerHTML = `
      <div class="inner">
        <div class="ghost-num" aria-hidden="true">${tp.id}</div>
        <div class="station">
          <div class="station-card">
            <div class="kicker">${tp.kicker}</div>
            <div class="station-num">${tp.id}</div>
            <h2>${tp.title}</h2>
            <p>${tp.desc}</p>
            <div class="spec"><b>${TECH[i].tag}</b><span>${TECH[i].note}</span></div>
            <div class="tags">${tp.tags.map((t) => `<span>${t}</span>`).join('')}</div>
          </div>
        </div>
      </div>
    `
    root.appendChild(sec)
  })

  // final / contacto — extensiones: WhatsApp, mailto enriquecido, mapa temático y carrusel
  const mailtoHref = () => {
    const subject = 'Cotización de proyecto — BOSS'
    const body = [
      'Hola BOSS,',
      '',
      'Me interesa solicitar una cotización.',
      '',
      'Nombre:',
      'Empresa:',
      'Proyecto:',
      'Teléfono:',
      '',
      '— Enviado desde boss.internetfriends.xyz',
    ].join('\n')
    return `mailto:${BRAND.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }
  const navWa = document.getElementById('nav-wa')
  if (navWa) {
    navWa.href = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent('Hola BOSS — quiero cotizar un proyecto.')}`
    navWa.setAttribute('aria-label', 'WhatsApp')
    // sin <title> del SVG: evita “WhatsAppWhatsApp” en el texto accesible
    const chipIcon = waIcon.replace(/<title>[\s\S]*?<\/title>/i, '')
    navWa.innerHTML = `<span class="wa-chip-glyph" aria-hidden="true">${chipIcon}</span><span class="wa-chip-label">WhatsApp</span>`
  }
  const waHref = () => {
    const text = 'Hola BOSS — me interesa una cotización de proyecto. (vía boss.internetfriends.xyz)'
    return `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(text)}`
  }
  const mapEmbed = `https://www.google.com/maps?q=${encodeURIComponent(BRAND.mapsQuery)}&z=16&hl=es&output=embed`
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BRAND.mapsQuery)}`
  const belt = CLIENTS.map((c) => `<img class="logo${c.gray ? ' logo--gray' : ''}" src="${c.src}" alt="${c.name}" title="${c.name}" decoding="async">`).join('')

  const fin = document.createElement('section')
  fin.className = 'section finale'
  fin.dataset.idx = '15'
  fin.innerHTML = `
    <div class="inner">
      <div class="kicker">${FINALE.kicker}</div>
      <h2>${FINALE.title}</h2>
      <p>${FINALE.desc}</p>
      <div class="contact-card contact-plate">
        <a class="wa-main" href="${waHref()}">
          <span class="wa-glyph-wrap">${waIcon}</span>
          <span class="wa-body">
            <h3>WhatsApp directo</h3>
            <strong class="wa-num">${BRAND.phones[0]}</strong>
            <span class="wa-sub">Respuesta en horario hábil · otros: ${BRAND.phones.slice(1).join(' · ')}</span>
          </span>
          <span class="wa-go">Abrir chat ↗</span>
        </a>
        <a class="wa-mail" href="${mailtoHref()}"><span>o escríbenos por correo</span><strong>${BRAND.email}</strong></a>
        <div class="map-frame"><iframe src="${mapEmbed}" title="Mapa — ${BRAND.address}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
        <div class="map-foot">
          <span>${BRAND.address}<br>${BRAND.legal}</span>
          <a class="map-chip" href="${mapLink}" target="_blank" rel="noopener">Abrir en Google Maps ↗</a>
        </div>
      </div>
      <div class="sectors">${BRAND.sectors.map((s) => `<span>${s}</span>`).join('')}</div>
      <div class="clients-plate">
        <div class="plate-head">Confían en nosotros</div>
        <div class="logo-belt"><div class="logo-track">${belt}${belt}</div></div>
      </div>
      <div class="legal">© ${new Date().getFullYear()} ${BRAND.name} · <a href="#" data-goto="0">↑ inicio</a></div>
    </div>
  `
  root.appendChild(fin)

  // ---------- escenario 16 · COTIZACIÓN (formulario mínimo → CRM) ----------
  const quote = document.createElement('section')
  quote.className = 'section align-left quote-section'
  quote.dataset.idx = '16'
  quote.innerHTML = `
    <div class="inner">
      <div class="quote-card">
        <div class="kicker">COTIZACIÓN · 16 <small>/ 16</small></div>
        <h2 class="quote-title">Cuéntanos tu proyecto</h2>
        <p class="quote-lede">Con estos datos armamos una propuesta con alcance, tiempos y costo. Si prefieres, también puedes escribirnos directo por WhatsApp.</p>
        <form id="quote-form" novalidate>
          <div class="qf-grid">
            <label class="qf-field"><span>Nombre *</span>
              <input name="nombre" required autocomplete="name" placeholder="Tu nombre">
            </label>
            <label class="qf-field"><span>Empresa</span>
              <input name="empresa" autocomplete="organization" placeholder="Opcional">
            </label>
            <label class="qf-field"><span>WhatsApp / tel *</span>
              <input name="tel" required inputmode="tel" autocomplete="tel" placeholder="33 1234 5678">
            </label>
            <label class="qf-field"><span>Correo</span>
              <input name="email" type="email" autocomplete="email" placeholder="tu@correo.com">
            </label>
            <label class="qf-field"><span>Tipo de proyecto</span>
              <select name="tipo">
                ${Object.values(ZONES).map((z) => `<option>${z}</option>`).join('')}
                <option>Otro / no estoy seguro</option>
              </select>
            </label>
            <label class="qf-field"><span>Plazo</span>
              <select name="plazo">
                <option>Urgente (esta semana)</option>
                <option selected>Este mes</option>
                <option>En planeación</option>
                <option>Solo cotización informativa</option>
              </select>
            </label>
          </div>
          <label class="qf-field qf-wide"><span>Requerimiento</span>
            <textarea name="notas" rows="3" placeholder="Sitio, metros lineales, diámetros, si hay planos o visita pendiente…"></textarea>
          </label>
          <div class="qf-actions">
            <button class="btn btn-primary" type="submit">Enviar por WhatsApp</button>
            <button class="btn btn-ghost" type="button" id="quote-mail">Enviar por correo</button>
          </div>
          <p class="qf-note">Usamos tus datos solo para cotizar y dar seguimiento a tu proyecto.</p>
          <p class="qf-status" id="quote-status" role="status" aria-live="polite"></p>
        </form>
      </div>
    </div>
  `
  root.appendChild(quote)

  return Array.from(root.querySelectorAll('section'))
}

const sections = buildSections()

// ---------- formulario de cotización → CRM ----------
// Mínimo y directo: el envío compone el mensaje y lo entrega por WhatsApp o
// correo (sin backend). Si defines CRM_ENDPOINT, además se hace POST del JSON
// para que tu CRM lo registre.
const CRM_ENDPOINT = ''            // ej. 'https://tu-crm/api/leads'
{
  const form = document.getElementById('quote-form')
  if (form) {
    const status = document.getElementById('quote-status')
    const mail = document.getElementById('quote-mail')
    const read = () => Object.fromEntries([...new FormData(form).entries()].map(([k, v]) => [k, String(v).trim()]))
    const compose = (d) => [
      `Solicitud de cotización — ${BRAND.name}`,
      `Nombre: ${d.nombre}`,
      d.empresa ? `Empresa: ${d.empresa}` : null,
      `Contacto: ${d.tel}${d.email ? ` · ${d.email}` : ''}`,
      `Tipo de proyecto: ${d.tipo}`,
      `Plazo: ${d.plazo}`,
      d.notas ? `Requerimiento: ${d.notas}` : null,
      'Vía: boss.internetfriends.xyz · cotización',
    ].filter(Boolean).join('\n')
    const fail = (msg, field) => {
      status.className = 'qf-status err'
      status.textContent = msg
      const el = form.querySelector(`[name="${field}"]`)
      if (el) el.focus()
    }
    const send = (via) => {
      const d = read()
      if (!d.nombre || d.nombre.length < 3) return fail('Necesitamos tu nombre', 'nombre')
      if (!d.tel || d.tel.replace(/\D/g, '').length < 8) return fail('Necesitamos un teléfono o WhatsApp', 'tel')
      if (d.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email)) return fail('Revisa el correo: parece incompleto', 'email')
      const text = compose(d)
      if (via === 'mail') {
        location.href = `mailto:${BRAND.email}?subject=${encodeURIComponent(`Cotización — ${d.empresa || d.nombre}`)}&body=${encodeURIComponent(text)}`
      } else {
        window.open(`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
      }
      // el CRM es best-effort: nunca bloquea el envío
      if (CRM_ENDPOINT) {
        try {
          fetch(CRM_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...d, origen: 'landing-cotizacion', enviado: new Date().toISOString() }),
          }).catch(() => {})
        } catch (e) { /* silencio */ }
      }
      status.className = 'qf-status ok'
      status.textContent = via === 'mail' ? 'Abriendo tu correo…' : 'Abriendo WhatsApp…'
      setTimeout(() => { status.textContent = 'Listo. Te contactamos en horario hábil.' }, 1200)
    }
    form.addEventListener('submit', (e) => { e.preventDefault(); send('wa') })
    if (mail) mail.addEventListener('click', () => send('mail'))
  }
}
const rail = $('#rail')
const railButtons = []
const LABELS = ['INICIO', ...TOPICS.map((t) => t.id), 'CONTACTO', 'COTIZACIÓN']
sections.forEach((sec, idx) => {
  const b = document.createElement('button')
  b.dataset.label = LABELS[idx]
  b.setAttribute('aria-label', LABELS[idx])
  b.addEventListener('click', () => {
    cancelTour()
    if (Math.abs(idx - activeIdx) > 1) flyTo(idx)
    else gotoSection(idx)
  })
  rail.appendChild(b)
  railButtons.push(b)
})

// dock inferior: escenarios 01–14 + Detener (navegación móvil)
const sceneDock = document.createElement('div')
sceneDock.id = 'scene-dock'
const sceneNav = document.createElement('nav')
sceneNav.id = 'scene-nav'
sceneNav.setAttribute('aria-label', 'Escenarios')
const sceneButtons = []
TOPICS.forEach((tp, i) => {
  const idx = i + 1
  const b = document.createElement('button')
  b.type = 'button'
  b.textContent = tp.id
  b.title = tp.title
  b.setAttribute('aria-label', `Escenario ${tp.id}`)
  b.addEventListener('click', () => {
    cancelTour()
    if (Math.abs(idx - activeIdx) > 1) flyTo(idx)
    else gotoSection(idx)
  })
  sceneNav.appendChild(b)
  sceneButtons.push(b)
})
sceneDock.appendChild(sceneNav)
document.body.appendChild(sceneDock)

const progressBar = $('#progress')

// ---------- renderer ----------
const canvas = $('#scene')
const isMobile = matchMedia('(max-width: 768px)').matches
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, isMobile ? 1.75 : 2))
renderer.setSize(innerWidth, innerHeight)
renderer.setClearColor(0x000000, 0) // deja ver el blueprint del body CSS
renderer.toneMapping = THREE.NoToneMapping

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.5, 900)

const world = buildWorld(scene)
const { posCurve, lookCurve, updaters } = world

// sonda de rendimiento (solo lectura, para pruebas)
window.__BOSS_DEBUG__ = { renderer, scene, world, camera }

// ---------- motor de scroll ----------
// La cámara llega al punto k cuando la sección k está centrada
// (scrollY = k·h  →  p = k/15).
const WAYPOINTS = 16
const anchors = []
for (let k = 0; k <= WAYPOINTS - 1; k++) anchors.push(k / (WAYPOINTS - 1))

// Perfil de velocidad por tramo: spline 2D (Catmull-Rom) que frena al llegar
// a cada estación y acelera a mitad de vuelo. Se remuestrea a una tabla para
// evaluarlo en O(1) por frame; mantiene φ(0)=0 y φ(1)=1 → encuadre exacto.
const velCurve = new THREE.SplineCurve([
  new THREE.Vector2(0, 0),
  new THREE.Vector2(0.16, 0.09),
  new THREE.Vector2(0.5, 0.5),
  new THREE.Vector2(0.84, 0.91),
  new THREE.Vector2(1, 1),
])
const VEL_LUT = (() => {
  const N = 240
  const raw = []
  for (let i = 0; i <= N; i++) {
    const p = velCurve.getPoint(i / N)
    raw.push([p.x, p.y])
  }
  const out = new Float32Array(129)
  let j = 0
  for (let i = 0; i <= 128; i++) {
    const f = i / 128
    while (j < raw.length - 2 && raw[j + 1][0] < f) j++
    const [x0, y0] = raw[j]
    const [x1, y1] = raw[j + 1]
    const u = x1 > x0 ? Math.min(1, Math.max(0, (f - x0) / (x1 - x0))) : 0
    out[i] = y0 + (y1 - y0) * u
  }
  out[0] = 0
  out[128] = 1
  return out
})()
const easeSeg = (f) => {
  const x = Math.min(128, Math.max(0, f * 128))
  const i = Math.floor(x)
  const t = x - i
  const a = VEL_LUT[i]
  const b = VEL_LUT[Math.min(128, i + 1)]
  return a + (b - a) * t
}

function camT(pv) {
  let k = 0, f = 0
  if (pv <= anchors[0]) { k = 0; f = 0 }
  else if (pv >= anchors[15]) { k = 15; f = 0 }
  else {
    while (k < 14 && pv >= anchors[k + 1]) k++
    f = (pv - anchors[k]) / (anchors[k + 1] - anchors[k])
  }
  return (1 + k + easeSeg(f)) / (WAYPOINTS + 1)
}

// ---------- estado de scroll ----------
history.scrollRestoration = 'manual'
let targetP = 0
let p = 0
let activeIdx = -1
let fovNow = 38
let prevCT = null

function maxScroll() {
  return Math.max(1, document.documentElement.scrollHeight - innerHeight)
}
function readScroll() {
  // 15 tramos de cámara entre las 16 secciones originales; el escenario 16
  // (COTIZACIÓN) es un tramo propio más allá de p = 1
  targetP = Math.max(0, scrollY / sectionH() / 15)
  progressBar.style.width = `${Math.min(1, targetP) * 100}%`
  updateActive()
}
function sectionH() {
  return sections[0].offsetHeight || innerHeight
}
function syncSceneDock(idx) {
  sceneButtons.forEach((b, i) => {
    const on = i + 1 === idx
    b.classList.toggle('active', on)
    if (on) b.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  })
  // visible en escenarios 01–14 (antes de contacto); Detener sigue vía body.touring
  sceneDock.classList.toggle('is-visible', idx >= 1 && idx <= 14)
}

function updateActive() {
  const h = sectionH()
  const idx = Math.min(sections.length - 1, Math.max(0, Math.floor(scrollY / h + 0.5)))
  if (idx !== activeIdx) {
    activeIdx = idx
    sections.forEach((s, i) => s.classList.toggle('active', i === idx))
    railButtons.forEach((b, i) => b.classList.toggle('active', i === idx))
    syncSceneDock(idx)
  }
}

function gotoSection(idx, instant = false) {
  window.scrollTo({ top: idx * sectionH(), behavior: instant ? 'instant' : (reduced ? 'auto' : 'smooth') })
}

// ---------- viajes entre escenarios: vuelo al destino ----------
// En vez de tapar la escena, la cámara vuela por el trazado hasta el
// escenario pedido: recorre el mundo, frena en el encuadre exacto y deja el
// scroll alineado con la sección. La duración crece con la distancia.
const flight = { on: false, fromP: 0, toP: 0, t0: 0, dur: 0, target: 0, raf: 0 }
const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)

function flyTo(idx) {
  const dist = Math.abs(idx - activeIdx)
  if (dist <= 1 || reduced) { gotoSection(idx, true); return }
  cancelTour()
  const h = sectionH()
  flight.on = true
  flight.fromP = p
  flight.toP = idx / 15                       // misma escala que el scroll
  flight.t0 = performance.now()
  flight.dur = Math.min(3400, 900 + dist * 150)   // vuelo visible, no un salto
  flight.target = idx
  document.documentElement.style.scrollSnapType = 'none'
}

function endFlight() {
  flight.on = false
  document.documentElement.style.scrollSnapType = ''
}

document.querySelectorAll('[data-goto]').forEach((a) => {
  a.addEventListener('click', (e) => {
    e.preventDefault()
    cancelTour()
    const idx = Number(a.dataset.goto)
    if (Math.abs(idx - activeIdx) > 1) flyTo(idx)
    else gotoSection(idx)
  })
})

// ---------- recorrido automático ----------
// "Recorrer servicios" activa un piloto automático estación por estación.
// El tiempo de lectura por estación es proporcional a su texto:
// más letras → más espera (2400 ms base + 14 ms/carácter, techo 8 s).
const TOUR_STOP_LABEL = 'Detener recorrido'
const TOUR_START_LABEL = HERO.cta[1]
const tour = { on: false, timer: 0 }
const tourBtn = $('#tour-btn')

const stationText = (i) => {
  if (i === 15) return `${FINALE.title} ${FINALE.desc}`
  if (i === 16) return 'Cotización Cuéntanos tu proyecto datos de contacto requerimiento'
  const t = TOPICS[i - 1]
  return `${t.title} ${t.desc} ${t.tags.join(' ')}`
}
const tourDelay = (i) => Math.min(8000, 2400 + stationText(i).length * 14)

// control de parada persistente (junto al dock de escenarios)
const tourStop = document.createElement('button')
tourStop.id = 'tour-stop'
tourStop.type = 'button'
tourStop.title = 'Detener recorrido automático'
tourStop.textContent = '✕ DETENER'
sceneDock.appendChild(tourStop)

function startTour() {
  if (tour.on) return
  tour.on = true
  hideKbdHint()
  document.body.classList.add('touring')
  tourBtn.textContent = TOUR_STOP_LABEL
  const LAST = sections.length - 1
  const step = (i) => {
    if (!tour.on) return
    gotoSection(i)
    tour.timer = setTimeout(() => {
      if (!tour.on || i >= LAST) { stopTour(); return }
      step(i + 1)
    }, tourDelay(i))
  }
  step(Math.max(1, Math.min(LAST, activeIdx)))
}

function stopTour() {
  clearTimeout(tour.timer)
  tour.on = false
  document.body.classList.remove('touring')
  tourBtn.textContent = TOUR_START_LABEL
}

function cancelTour() {
  if (tour.on) stopTour()
}

tourBtn.addEventListener('click', (e) => {
  e.preventDefault()
  tour.on ? stopTour() : startTour()
})
tourStop.addEventListener('click', stopTour)

// cualquier gesto del usuario devuelve el control del scroll
addEventListener('wheel', cancelTour, { passive: true })
addEventListener('touchstart', cancelTour, { passive: true })
addEventListener('keydown', cancelTour)

// ---------- mueblería de plano sobre el relieve ----------
// El primer cuadro es una hoja de plano: marco con esquinas, cajetín,
// escalímetro y la llamada de Guadalajara. El fondo de color sólido y su
// disolución viven en el 3D (hero.js): el mapa se lee sobre color plano y el
// color se retira para dar paso a los escenarios.
const sheet = document.createElement('div')
sheet.id = 'sheet'
sheet.setAttribute('aria-hidden', 'true')
sheet.innerHTML = `
  <span class="tick tl"></span><span class="tick tr"></span>
  <span class="tick bl"></span><span class="tick br"></span>
  <div class="plan-title">
    <b>PLANO DE OPERACIÓN · LÁMINA 01 / 15</b>
    <span>20°40′38″N · 103°20′51″O</span>
    <i>14 FRENTES DE TRABAJO</i>
  </div>
  <div class="plan-scale"><b>ESC 1:8 000 000</b><i></i></div>
  <div class="plan-callout">
    <b>NIVEL 03 · SEDE Y TALLER</b>
    <span>RADIO DE ATENCIÓN · ZMG</span>
  </div>`
document.body.appendChild(sheet)
const smoothstep = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}
function updateSheet(heroP) {
  // la mueblería aparece con el plano y se retira antes de que llegue la
  // tarjeta del escenario 01 (así nunca se cruza con su texto)
  sheet.style.opacity = (1 - smoothstep(0.05, 0.34, heroP)).toFixed(3)
  sheet.style.visibility = heroP > 0.38 ? 'hidden' : 'visible'
}

const brandEl = document.querySelector('#nav .brand')
function updateBrand(heroP) {
  // oculto mientras el héroe muestra BOSS.; aparece al salir del primer cuadro
  if (!brandEl) return
  const o = reduced ? (heroP > 0.2 ? 1 : 0) : smoothstep(0.22, 0.62, heroP)
  brandEl.style.opacity = o.toFixed(3)
  brandEl.style.pointerEvents = o < 0.08 ? 'none' : 'auto'
  brandEl.setAttribute('aria-hidden', o < 0.08 ? 'true' : 'false')
}

// ---------- navegación por teclado (discreta, con chip de ayuda) ----------
// ↑/↓/AvPág/RePág/←/→ una sección a la vez · Inicio/Fin a los extremos
const KBD_HINT = document.createElement('div')
KBD_HINT.id = 'kbd-hint'
KBD_HINT.setAttribute('aria-hidden', 'true')
KBD_HINT.innerHTML = '<kbd>↑</kbd><kbd>↓</kbd> teclado'
document.body.appendChild(KBD_HINT)
let kbdUsed = false
const showKbdHint = () => { KBD_HINT.classList.add('show'); KBD_HINT.classList.remove('hide') }
const hideKbdHint = () => { KBD_HINT.classList.add('hide'); KBD_HINT.classList.remove('show') }
if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
  setTimeout(() => { if (!kbdUsed && !tour.on) showKbdHint() }, 1600)
  setTimeout(() => { if (!kbdUsed) hideKbdHint() }, 12000)
}
addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return
  const nav = {
    ArrowDown: 1, PageDown: 1, ArrowRight: 1,
    ArrowUp: -1, PageUp: -1, ArrowLeft: -1,
    Home: -999, End: 999,
  }[e.key]
  if (nav === undefined) return
  e.preventDefault()
  cancelTour()
  kbdUsed = true
  hideKbdHint()
  const last = sections.length - 1
  const tgt = nav === -999 ? 0 : nav === 999 ? last : Math.max(0, Math.min(last, activeIdx + nav))
  if (Math.abs(tgt - activeIdx) > 1) flyTo(tgt)
  else gotoSection(tgt, true)
})

// si el usuario hace scroll, el vuelo se corta y él manda (el teclado ya
// reconduce el vuelo por su cuenta, así que no cuenta como interrupción)
for (const ev of ['wheel', 'touchstart']) {
  addEventListener(ev, () => { if (flight.on) endFlight() }, { passive: true })
}
addEventListener('scroll', readScroll, { passive: true })
addEventListener('resize', () => {
  renderer.setSize(innerWidth, innerHeight)
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()
  world.hero.resize()
  readScroll()
})

// deep-link ?p=
{
  const q = new URLSearchParams(location.search).get('p')
  if (q) {
    const v = parseFloat(q)
    if (Number.isFinite(v) && v > 0 && v <= 1) requestAnimationFrame(() => scrollTo(0, v * maxScroll()))
  } else {
    scrollTo(0, 0)
  }
}

// ---------- bucle ----------
const camPos = new THREE.Vector3()
const camLook = new THREE.Vector3()
const tailPos = new THREE.Vector3()
const tailLook = new THREE.Vector3()
const clock = new THREE.Clock()
let firstFrame = true

function frame() {
  const dt = Math.min(clock.getDelta(), 0.05)
  const t = clock.elapsedTime

  // vuelo al escenario pedido: se conduce el progreso y el scroll a la vez
  if (flight.on) {
    const u = Math.min(1, (performance.now() - flight.t0) / flight.dur)
    p = flight.fromP + (flight.toP - flight.fromP) * easeInOut(u)
    targetP = p
    window.scrollTo(0, p * 15 * sectionH())
    if (u >= 1) endFlight()
  }
  // amortiguación del scroll (se salta durante el vuelo, ya va conducido)
  if (!flight.on) {
    const k = 1 - Math.exp(-dt * (reduced ? 1000 : 4.6))
    p += (targetP - p) * k
  }

  const ct = camT(Math.min(1, p))
  posCurve.getPoint(ct, camPos)
  lookCurve.getPoint(ct, camLook)
  // tramo propio de COTIZACIÓN (p > 1): del cierre al cabezal, "el siguiente
  // tramo es tuyo", con el mismo perfil de velocidad
  if (p > 1) {
    const u = Math.min(1, (p - 1) * 15)
    const e = easeSeg(u)
    tailPos.copy(camPos); tailLook.copy(camLook)
    posCurve.getPoint(1, tailPos)
    lookCurve.getPoint(1, tailLook)
    camPos.lerpVectors(tailPos, world.quote.pos, e)
    camLook.lerpVectors(tailLook, world.quote.look, e)
  }

  // disolución del plano de México conforme el vuelo llega a la estación 01
  const heroP = Math.min(1, p / (1 / 15))
  world.hero.setProgress(heroP, camera)
  updateSheet(heroP)
  updateBrand(heroP)

  // vaivén sutil (vida) + garde de altura
  if (!reduced) {
    camPos.x += Math.sin(t * 0.55) * 0.16
    camPos.y += Math.sin(t * 0.85 + 2) * 0.1
  }
  if (camPos.y < 1.2) camPos.y = 1.2

  camera.position.copy(camPos)
  camera.lookAt(camLook)

  // golpe de fov según velocidad de vuelo
  const speed = prevCT === null ? 0 : Math.abs(ct - prevCT) / Math.max(dt, 1e-4)
  prevCT = ct
  const fovTarget = 38 + Math.min(speed * 30, 6.5)
  fovNow += (fovTarget - fovNow) * (1 - Math.exp(-dt * 3))
  if (Math.abs(fovNow - camera.fov) > 0.01) {
    camera.fov = fovNow
    camera.updateProjectionMatrix()
  }

  // animaciones del mundo
  for (const u of updaters) u(t, dt, camera)

  renderer.render(scene, camera)

  if (firstFrame) {
    firstFrame = false
    document.body.classList.add('ready')
  }
  requestAnimationFrame(frame)
}

readScroll()
updateActive()
frame()
