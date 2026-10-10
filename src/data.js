// Contenido editorial de la landing — BOSS
// Fuente: BOSS_CV.pdf (extracto OCR) + lista de especialidades del cliente.

export const BRAND = {
  name: 'BOSS',
  tagline: 'Proyectos · Construcción · Supervisión · Hidráulicas y Sanitarias',
  claim:
    'Supervisión técnica y administración de proyectos, redes, obra hidráulica, detección, fabricación y mantenimiento.',
  years: 30,
  location: 'Guadalajara · Jalisco · México',
  email: 'pl_saraborbon@hotmail.com',
  phones: ['(33) 3810 1867', '(33) 1057 9457', '(33) 3344 3032'],
  whatsapp: '523338101867', // (33) 3810 1867 — línea confirmada para WhatsApp
  address: 'Calle Olmo #1367, Guadalajara, Jalisco',
  mapsQuery: 'Calle Olmo 1367, Guadalajara, Jalisco, México',
  legal: 'Sara Borbón Sánchez · Representante Legal',
  sectors: [
    'Industrial', 'Municipal', 'Comercial', 'Hospitalario',
    'Hotelero', 'Residencial', 'Alimenticio', 'Energético',
  ],
  values: ['Compromiso', 'Calidad', 'Seguridad', 'Honestidad', 'Responsabilidad', 'Innovación', 'Trabajo en equipo', 'Sustentabilidad', 'Mejora continua'],
}

// Carrusel de clientes — logos en /public/clients (SVG preferidos).
export const CLIENTS = [
  { name: 'CFE', src: '/clients/cfe.svg' },
  { name: 'CONAGUA', src: '/clients/conagua.svg' },
  { name: 'SIAPA', src: '/clients/siapa.svg' },
  { name: 'Coca-Cola', src: '/clients/coca-cola.svg' },
  { name: 'Sigma Alimentos', src: '/clients/sigma-alimentos.svg' },
  { name: 'José Cuervo', src: '/clients/jose-cuervo.svg' },
  { name: 'Grupo Carso', src: '/clients/grupo-carso.svg' },
  { name: 'Liconsa', src: '/clients/liconsa.svg' },
  // gray: true → en reposo se aplica grayscale en vez del lavado a blanco
  // (con brightness(0) invert(1) la placa de Purina y el cuadro de HSBC se
  // vuelven un bloque blanco sólido y parece un error).
  { name: 'HSBC', src: '/clients/hsbc.svg', gray: true },
  { name: 'Purina', src: '/clients/purina.svg', gray: true },
  { name: 'Grupo Collins', src: '/clients/grupo-collins.svg' },
  { name: 'Moly-Cop México', src: '/clients/moly-cop.svg' },
]

// 4 zonas temáticas del recorrido
export const ZONES = {
  A: 'INGENIERÍA & PROYECTOS',
  B: 'AGUA & SANEAMIENTO',
  C: 'FABRICACIÓN INDUSTRIAL',
  D: 'MANTENIMIENTO & OBRA',
}

export const TOPICS = [
  {
    id: '01', kicker: 'INGENIERÍA & PROYECTOS', zone: ZONES.A,
    title: 'Supervisión técnica y administración de proyectos',
    desc: 'Dirección de obra, control de calidad, estimaciones y programación: administramos tu proyecto de principio a fin, con reportes claros y verificación permanente en campo.',
    tags: ['Dirección de obra', 'Estimaciones', 'Control de calidad'],
    accent: '#3E8BFF',
  },
  {
    id: '02', kicker: 'SISTEMAS DE AGUA', zone: ZONES.B,
    title: 'Sistemas hidráulicos, sanitarios y pluviales',
    desc: 'Diseño, instalación y prueba de redes de agua potable, drenaje sanitario y conducción de aguas pluviales para plantas, edificios y desarrollos.',
    tags: ['Redes de agua', 'Drenaje sanitario', 'Aguas pluviales'],
    accent: '#3E8BFF',
  },
  {
    id: '03', kicker: 'PROTECCIÓN CONTRA INCENDIO', zone: ZONES.B,
    title: 'Redes contra incendios',
    desc: 'Sistemas fijos de combate: bombas principales y jockey, gabinetes, hidrantes y rociadores, instalados y probados para responder cuando más importa.',
    tags: ['Bombas contra incendio', 'Hidrantes', 'Rociadores'],
    accent: '#3E8BFF',
  },
  {
    id: '04', kicker: 'INFRAESTRUCTURA', zone: ZONES.B,
    title: 'Obras hidráulicas y de saneamiento',
    desc: 'Construcción de líneas de conducción, plantas y obras de saneamiento, ejecutadas con maquinaria propia e ingeniería de precisión.',
    tags: ['Líneas de conducción', 'Plantas', 'Saneamiento'],
    accent: '#3E8BFF',
  },
  {
    id: '05', kicker: 'DIAGNÓSTICO EN CAMPO', zone: ZONES.B,
    title: 'Detección de fugas y tomas clandestinas',
    desc: 'Localización exacta de fugas ocultas y conexiones no autorizadas con geófono digital, correlación acústica y tres décadas de oído entrenado.',
    tags: ['Geófono digital', 'Fugas ocultas', 'Tomas clandestinas'],
    accent: '#3E8BFF',
  },
  {
    id: '06', kicker: 'DIAGNÓSTICO EN CAMPO', zone: ZONES.B,
    title: 'Video inspección de tuberías',
    desc: 'Inspección interior con cámara robótica autónoma: diagnóstico certificado del estado real de colectores y líneas, sin excavar un solo metro.',
    tags: ['Cámara robótica', 'Certificados', 'Sin excavar'],
    accent: '#3E8BFF',
  },
  {
    id: '07', kicker: 'SERVICIO EN CAMPO', zone: ZONES.B,
    title: 'Desazolve con camión tipo Vactor',
    desc: 'Limpieza hidroneumática de atarjeas y colectores: succión, jetteo a alta presión y retiro completo de sedimentos en una sola pasada.',
    tags: ['Succión', 'Jetteo', 'Retiro de sedimentos'],
    accent: '#3E8BFF',
  },
  {
    id: '08', kicker: 'LABORATORIO', zone: ZONES.B,
    title: 'Estudios de calidad de agua y piezometría',
    desc: 'Muestreo y análisis de calidad de agua, y estudios piezométricos con sonda manual para conocer y proteger tus fuentes.',
    tags: ['Análisis de agua', 'Sonda manual', 'Monitoreo'],
    accent: '#3E8BFF',
  },
  {
    id: '09', kicker: 'FABRICACIÓN', zone: ZONES.C,
    title: 'Fabricación y montaje de estructuras metálicas',
    desc: 'Cálculo, fabricación y montaje de estructuras de acero: naves, entrepisos, plataformas y techos con soldadura calificada de principio a fin.',
    tags: ['Naves industriales', 'Entrepisos', 'Techos'],
    accent: '#3E8BFF',
  },
  {
    id: '10', kicker: 'PAILERÍA', zone: ZONES.C,
    title: 'Pailería, tanques y equipos industriales',
    desc: 'Fabricación de tanques de almacenamiento, pailería en general y equipos industriales a la medida, con trazabilidad total de materiales.',
    tags: ['Tanques', 'Pailería fina', 'A la medida'],
    accent: '#3E8BFF',
  },
  {
    id: '11', kicker: 'TUBERÍAS', zone: ZONES.C,
    title: 'Tuberías de alta y baja presión',
    desc: 'Ensamble, soldadura y pruebas hidrostáticas de líneas de proceso en alta y baja presión, entregadas listas para operar.',
    tags: ['Soldadura calificada', 'Pruebas hidrostáticas', 'Líneas de proceso'],
    accent: '#3E8BFF',
  },
  {
    id: '12', kicker: 'ACABADOS', zone: ZONES.C,
    title: 'Sand blast y recubrimientos industriales',
    desc: 'Preparación de superficie con sand blast y aplicación de recubrimientos anticorrosivos que extienden la vida útil de tus activos.',
    tags: ['Sand blast', 'Anticorrosivos', 'Vida útil'],
    accent: '#3E8BFF',
  },
  {
    id: '13', kicker: 'MANTENIMIENTO', zone: ZONES.D,
    title: 'Mantenimiento preventivo y correctivo',
    desc: 'Programas planificados y respuesta inmediata ante fallas, para los sectores industrial y comercial: tu equipamiento siempre operativo.',
    tags: ['Preventivo', 'Correctivo', 'Respuesta inmediata'],
    accent: '#3E8BFF',
  },
  {
    id: '14', kicker: 'OBRA ELECTROMECÁNICA', zone: ZONES.D,
    title: 'Remodelaciones y obra electromecánica',
    desc: 'Remodelación integral de instalaciones y obra electromecánica: alimentaciones, tableros, control y arranque de equipos.',
    tags: ['Tableros', 'Control', 'Remodelaciones'],
    accent: '#3E8BFF',
  },
]

// Datos técnicos por estación: alimentan las etiquetas flotantes del mundo
// 3D y el tooltip al pasar el cursor. Normas y dimensiones reales del oficio.
export const TECH = [
  { tag: 'DIRECCIÓN DE OBRA · BITÁCORA', note: 'Estimaciones y control de calidad' },
  { tag: 'AGUA POTABLE · Ø4" PVC RD-26', note: 'Prueba hidrostática 1.5× presión de trabajo' },
  { tag: 'NOM-002-STPS · ROCIADOR 68 °C', note: 'Bomba principal + jockey y gabinete' },
  { tag: 'CÁRCAMO · 1.8 m³/s', note: 'Línea de conducción y PTAR' },
  { tag: 'CORRELACIÓN ACÚSTICA · ±0.5 m', note: 'Geófono digital y trazado en campo' },
  { tag: 'Ø36" PVC · PUNTO 04 · 12.4 m', note: 'Video inspección con crawler y cable' },
  { tag: 'VACTOR · 80 GPM @ 2500 PSI', note: 'Succión y jetter de alta presión' },
  { tag: 'NOM-127-SSA1 · MUESTREO', note: 'Piezometría y cadena de custodia' },
  { tag: 'ASTM A992 · AWS D1.1', note: 'Montaje de estructura metálica' },
  { tag: 'API 650 · TANQUE ATMOSFÉRICO', note: 'Pailería y equipo industrial' },
  { tag: 'ANSI B16.5 · 150#', note: 'Tubería de alta y baja presión' },
  { tag: 'SSPC-SP10 · EPÓXICO 250 µm', note: 'Sand blast y recubrimiento' },
  { tag: 'ISO 10816 · VIBRACIÓN', note: 'Ronda preventiva y termografía' },
  { tag: 'NOM-001-SEDE · TABLERO 440 V', note: 'Obra electromecánica y control' },
]

export const HERO = {
  // única mención de ubicación en la portada: el resto del espacio es propuesta
  eyebrow: BRAND.location,
  title: 'BOSS',
  sub: `Diseñamos, ejecutamos y supervisamos obra hidráulica, sanitaria e industrial. Más de ${BRAND.years} años resolviendo proyectos críticos, con equipo propio y una sola empresa responsable de principio a fin.`,
  // móvil: una sola línea — el párrafo largo pelea con el mapa en pantallas altas
  subMobile: `Más de ${BRAND.years} años en obra hidráulica, sanitaria e industrial.`,
  // credenciales que el mensaje NO dice ya: cero repetición en el primer cuadro
  chips: ['Sectores público y privado', 'Cobertura en el occidente del país'],
  // el CTA principal es el comercial; el recorrido queda como experiencia
  cta: ['Cotiza tu proyecto', 'Recorrido guiado'],
  ctaGoto: 16,          // el CTA principal tiene su propio escenario (COTIZACIÓN)
}

export const FINALE = {
  kicker: 'TRABAJEMOS JUNTOS',
  title: '¿Listo para tu próximo proyecto?',
  desc: `Más de ${BRAND.years} años resolviendo proyectos industriales e hidrosanitarios para los sectores público y privado. Cuéntanos qué necesitas y nuestro equipo responde con ruta, equipo y experiencia.`,
}
