# BOSS · Landing inmersiva con scroll-story 3D

Un solo vuelo de cámara continuo sobre un **blueprint digital** tipo infografía
isométrica: una mesa navy con retícula técnica, una gran **zanja de sección**
con rayado de plano que revela la red hidráulica azul BOSS, y 14
estaciones —una por servicio— que aparecen y se explican mientras te desplazas.
Sin cortes, sin scroll-jacking: el scroll nativo dirige el tiempo de la escena.

## Stack

- [three.js](https://threejs.org) (^0.180) — todo el mundo es geometría procedural; sin modelos externos.
- [Vite 7](https://vite.dev) — desarrollo y build.
- JavaScript vanilla. Sin frameworks de UI, sin GSAP: el motor de scroll es propio (~100 líneas).

## Cómo correrlo

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # bundle en dist/
pnpm preview    # sirve dist/
pnpm smoke      # valida el mundo en Node (sin navegador)
```

## El motor de scroll

- 16 secciones de 100vh (inicio + 14 servicios + contacto) conducen una única
  curva CatmullRom de cámara: el mundo es uno solo y la cámara nunca corta.
- La cámara **llega exactamente a cada estación cuando su texto está centrado**
  (anclas `k+0.5 / 15`), mora un instante con easing cúbico y retoma el vuelo.
- Amortiguación crítica del parámetro de avance, golpe sutil de FOV según
  velocidad, vaivén mínimo para "vida".
- Deep-links: `?p=0.5` posiciona el vuelo a la mitad (útil para QA/screenshots).

## Dirección de arte — blueprint digital

- **Mesa de digitalizado**: fondo navy con retícula técnica (CSS + textura
  canvas en el piso); la niebla disuelve el mundo en la propia página.
- **Relieve isométrico del héroe** (`hero.js`): el plano de México ya no es
  una lámina plana sino un **relieve 3D de tres niveles de altura** — losa
  extruida del país (nivel 01), **Jalisco extruido y elevado** sobre ella
  (nivel 02) y **Guadalajara/ZMG** como pin con anillo, baliza y micro-ciudad
  (nivel 03), sobre un tablero inclinado ~20° que da la lectura isométrica.
  Materiales `ShaderMaterial` con **disolución por ruido** (borde luminoso +
  humo) y **vida en reposo**: barrido de escaneo, latido de la baliza y
  ciudad que respira. La mueblería de plano (marco con esquinas, cajetín,
  escalímetro y llamada de Guadalajara) es DOM: nunca puede encimarse al texto.
- **Fondo sólido del primer cuadro** (`hero.js`): un plano pegado a la cámara
  (`depthTest: false`, sin test de profundidad, dibujado por delante de todo
  el distrito) pinta el navy de la niebla con retícula tenue. El mapa 3D se lee
  **sobre color plano** —no sobre el distrito— y es ese color el que se
  **disuelve** (mismo shader de ruido, heroP 0.40→0.95) para dar paso a los
  escenarios; mientras cubre, las estaciones ni siquiera se dibujan. La marca
  (loader) va por encima.
- **Corte de sección**: la zanja expone estratos azules con líneas de sección
  luminosas; los bloques de corte llevan rayado técnico (hatching) pintado.
- **Detalles pintados, no modelados**: ventanas y fachadas son texturas canvas
  (texWindows) — cero geometría diminuta.
- **El azul BOSS es la red vital**: tuberías, agua, válvulas y focos con
  emissive —la línea brilla sobre el navy. El cian queda para la información
  (planos, gráficas, hologramas).
- Lente plana (fov 38) y ángulo de cámara elevado: lectura isométrica tipo
  infografía. Figuras sin rostro, ciudad silueta al fondo.
- **Anexos isométricos** (`iso.js`): cada estación lleva un mini-diorama
  temático a sus flancos —casas chunky de techo plano con tinaco/AC/antena,
  torres con baliza, árboles, luminarias, figuras, tanques, racks de tubería,
  grúas pórtico, andamios, camioneta de servicio y autobús urbano detallados
  (cristales, puertas, luces, espejos, AC de techo)— estilo maqueta iso
  (referencias: iso-cities / iso-figures de April Zhu), siempre fuera del pad
  del sujeto y sin ocluir el corredor de cámara; las lámparas y balizas
  pulsan con un solo updater compartido.
- **Personas iso** (`kit.js`): los operarios ya no son geometría modelada;
  son siluetas vectoriales dibujadas en canvas (torso, casco, chaleco
  reflectante, zapato) en cinco poses (caminando, de pie, con tablet, con
  paleta de tránsito, rodilla en tierra con sensor) montadas como sprites
  que siempre miran a cámara — la misma idea de las figuras planas de
  iso-figures, con sombra blob debajo.

## Estructura

```
public/clients/  logos SVG de clientes (oficiales de Wikimedia donde existen;
                marcas geométricas propias para los que no)
src/
  data.js      contenido editorial (marca, 14 servicios, contacto)
  style.css    tema blueprint: navy, retícula, azul BOSS
  kit.js       paleta, materiales, componentes y texturas canvas
  iso.js       vocabulario de diorama iso + anexos temáticos por estación
  stations.js  las 14 estaciones (una función cada una)
  world.js     distrito: zanja, red, plaza, curvas de cámara
  main.js      DOM del story, renderer, motor de scroll, HUD/rail
test/smoke.mjs mundo validado en Node (sin DOM)
```

## Escenario 16 · COTIZACIÓN (formulario mínimo → CRM)

- **Cada CTA tiene su propio escenario**: el CTA principal «Cotiza tu proyecto»
  lleva a la sección 16, con **encuadre propio** (`world.quote`): mira al
  cabezal del recorrido, donde el mundo dice *«el siguiente tramo es tuyo»*.
  El cierre (CONTACTO) mira hacia atrás, a lo construido; cotización mira al
  frente. El mapeo de scroll mantiene los 15 tramos de cámara originales y
  añade este como tramo propio más allá de `p = 1` (cero regresión en el resto
  de la coreografía).
- **Formulario mínimo** (nombre*, empresa, WhatsApp/tel*, correo, tipo de
  proyecto, plazo, requerimiento) que compone el mensaje y lo entrega **por
  WhatsApp o correo**, sin backend. Si defines `CRM_ENDPOINT` en `main.js`,
  además se hace `POST` del JSON (`origen: landing-cotizacion`) para tu CRM,
  best-effort: nunca bloquea el envío. Valida en campo y avisa del estado.
- **Vuelo al escenario** (no hay cortina ni panel): los saltos largos (nav,
  CTA, raíl, tecla `Fin`) hacen que la cámara **vuele por el trazado** hasta el
  encuadre pedido en 0.9–3.4 s según la distancia (`easeInOut` global sobre el
  perfil de velocidad por tramos, así que acelera en el centro y frena al
  llegar). El scroll lo conduce el motor durante el vuelo y queda alineado con
  la sección al aterrizar; si el usuario hace scroll, el vuelo se corta y él
  manda. Con `prefers-reduced-motion` el viaje es instantáneo.

## Contacto & clientes (sección final)

- **Placa de contacto única** — una sola tarjeta `contact-plate` con cuatro
  filas: acción principal de **WhatsApp** (glifo oficial en verde `#25D366`,
  abre `wa.me` con mensaje precargado usando `BRAND.whatsapp`), **mailto
  enriquecido** (subject + plantilla de cotización), **mapa temático** (iframe
  de Google Maps `output=embed` sin API key, filtrado por CSS a la paleta
  blueprint) y **pie** con dirección + representante legal + enlace
  "Abrir en Google Maps".
- **Carrusel de clientes** — 12 logos SVG en marquee continuo (duplicado para
  loop perfecto); en reposo se lavan a blanco-hielo y al hover recuperan
  color. Excepción: **HSBC** y **Purina** (marcados `gray: true` en `data.js`)
  usan `filter: grayscale(1)` en reposo, porque el lavado a blanco convierte
  su cuadro/placa en un bloque blanco sólido. Solo anima mientras CONTACTO es
  la sección activa (`animation-play-state` ligado a `.section.active`) y
  `prefers-reduced-motion` lo detiene.

## Recorrido automático ("Recorrer servicios")

- El botón del héroe (`#tour-btn`) activa un piloto automático que avanza
  estación por estación (1 → CONTACTO) usando el mismo `gotoSection` del
  scroll manual.
- **El tiempo por estación es proporcional a su texto**:
  `min(8000, 2400 + caracteres × 14)` ms — más letras, más lectura.
- Al activarse: `body.touring` muestra el control persistente `#tour-stop`
  (abajo a la derecha) y el botón cambia a "Detener recorrido".
- **Cualquier gesto devuelve el control**: rueda, touch, teclado, rail,
  enlaces de navegación o el propio botón cancelan el recorrido.

## Primer contacto (empresa, local)

- **Una sola mención de ubicación en el copy**: el antetítulo
  `Guadalajara · Jalisco · México`. El resto del primer cuadro es propuesta:
  *"Diseñamos, ejecutamos y supervisamos obra hidráulica, sanitaria e
  industrial. Más de 30 años resolviendo proyectos críticos, con equipo
  propio y una sola empresa responsable de principio a fin."*
- Chips de valor (obra hidráulica e industrial · equipo e ingeniería propios ·
  sectores público y privado); el detalle técnico vive en cada servicio.
- **Activación comercial**: el CTA principal es **"Cotiza tu proyecto"** y
  lleva a CONTACTO; "Recorrer servicios" queda como experiencia secundaria.
- La ubicación se **muestra** en el mapa (rótulos geográficos y la llamada de
  la sede) en lugar de repetirse en el texto.

## Snap y teclado

- **Snap sutil** (`scroll-snap-type: y proximity` en `html`, `scroll-snap-align:
  start` en cada sección): la historia aterriza en cada estación sin pelear con
  el vuelo libre de la cámara; se desactiva con `prefers-reduced-motion`.
- **Navegación por teclado**: ↑/↓/←/→/AvPág/RePág avanzan una sección por
  toque (salto instantáneo a prueba de carreras), Inicio/Fin van a los
  extremos; cualquier tecla también cancela el recorrido automático.
- **Chip de ayuda** (`#kbd-hint`, esquina inferior izquierda): aparece solo en
  escritorio, se desvanece solo a los 12 s y no vuelve tras el primer uso.
  `body.touring` lo oculta mientras dura el piloto automático.

## Capa técnica: una sola vez, bien hecha

- **Un único lugar para el dato técnico**: cada servicio muestra en su tarjeta
  una línea `spec` (norma o especificación + su lectura en lenguaje llano),
  tomada de `TECH` en `data.js`. Se retiraron las capas que la repetían
  (tooltip al pasar el cursor y etiquetas holográficas del mundo 3D).
- **Rotulación de obra auténtica** (`kit.js` → `texBoard`/`sign`): tableros con
  doble marco, barra de marca BOSS, jerarquía tipográfica (Space Grotesk +
  IBM Plex Mono), esquinas técnicas y pie normalizado; tonos de seguridad
  (ámbar / terracota) que se auto-iluminan con su propia textura para leerse en
  penumbra. El texto es el de una obra real (*zona de obra, no pasar, casco
  obligatorio, carga suspendida…*), sin repetir normas.
- **Objetos técnicos por estación**: cisterna con válvulas de seccionamiento,
  cárcamo de bombeo con aireadores, correlador acústico y by-pass, jetter de
  alta presión, botellas de muestreo y potenciómetro, polipasto de carril y
  conexiones apernadas, boquillas de tanque y escalera caracol, junta de
  expansión con bridas, compresor y tolva de abrasivo, cámara termográfica en
  trípode, charola portacables con cableado al tablero.

## Interacción

- **Spline de velocidad**: el avance de cámara por tramo ya no es un
  ease-in-out cúbico sino un **perfil de velocidad spline 2D**
  (Catmull-Rom, muestreado a tabla de 129 pasos): frena al llegar a cada
  estación y acelera a mitad de vuelo, manteniendo φ(0)=0 y φ(1)=1 para que
  el encuadre de cada estación sea exacto.
- **Sin sonido**: el chip de ambiente procedural (`#audio-btn`) se retiró a
  petición del cliente — era un artefacto más que explicar en el primer
  contacto y no aportaba a la conversión.
- **Teaser final**: en el cabezal del tubo, una etiqueta
  “SIGUIENTE TRAMO · TU PROYECTO” cierra el recorrido empujando al contacto.

## Sobre la skill "scroll-world"

Se evaluó [oso95/scroll-world](https://github.com/oso95/scroll-world): es un
pipeline de **video IA** (APIs de pago, mp4 con scroll-scrub), no un motor de
three.js. Del concepto se tomó lo valioso — vuelo continuo sin cortes, dwells en
cada escena, avance dirigido por el scroll — pero la implementación aquí es
three.js puro, procedural e interactivo, como se pidió.
