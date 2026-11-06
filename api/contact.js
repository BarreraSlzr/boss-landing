/**
 * POST /api/contact — registra una cotización vía Discord webhook.
 * El secreto vive solo en DISCORD_WEBHOOK_URL (Vercel / .env.local).
 */

const MAX = {
  nombre: 120,
  empresa: 160,
  tel: 40,
  email: 160,
  tipo: 120,
  plazo: 80,
  notas: 2000,
}

function clip(value, n) {
  const s = String(value ?? '').trim()
  return s.length > n ? s.slice(0, n) : s
}

function validate(body) {
  const nombre = clip(body.nombre, MAX.nombre)
  const tel = clip(body.tel, MAX.tel)
  const email = clip(body.email, MAX.email)
  if (nombre.length < 3) return { error: 'Necesitamos tu nombre', field: 'nombre' }
  if (tel.replace(/\D/g, '').length < 8) {
    return { error: 'Necesitamos un teléfono o WhatsApp', field: 'tel' }
  }
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { error: 'Revisa el correo: parece incompleto', field: 'email' }
  }
  return {
    data: {
      nombre,
      empresa: clip(body.empresa, MAX.empresa),
      tel,
      email,
      tipo: clip(body.tipo, MAX.tipo) || 'No especificado',
      plazo: clip(body.plazo, MAX.plazo) || 'No especificado',
      notas: clip(body.notas, MAX.notas),
      origen: clip(body.origen, 80) || 'landing-cotizacion',
    },
  }
}

function field(name, value, inline = true) {
  const v = String(value || '').trim()
  return { name, value: v || '—', inline }
}

async function postDiscord(webhookUrl, data) {
  const payload = {
    username: 'BOSS · Cotizaciones',
    embeds: [
      {
        title: 'Nueva solicitud de cotización',
        color: 0x63c6ff,
        fields: [
          field('Nombre', data.nombre),
          field('Empresa', data.empresa),
          field('WhatsApp / tel', data.tel),
          field('Correo', data.email),
          field('Tipo de proyecto', data.tipo, false),
          field('Plazo', data.plazo),
          field('Requerimiento', data.notas || 'Sin detalle', false),
          field('Origen', data.origen),
        ],
        timestamp: new Date().toISOString(),
        footer: { text: 'bossingenieria.com' },
      },
    ],
  }

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    const err = new Error(`Discord webhook failed (${res.status})`)
    err.status = 502
    err.detail = detail.slice(0, 200)
    throw err
  }
}

function readBody(req) {
  if (req.body && typeof req.body === 'object') return Promise.resolve(req.body)
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (c) => chunks.push(c))
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8')
        resolve(raw ? JSON.parse(raw) : {})
      } catch (e) {
        reject(e)
      }
    })
    req.on('error', reject)
  })
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' })
    return
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL
  if (!webhookUrl) {
    res.status(503).json({ ok: false, error: 'Contacto temporalmente no disponible' })
    return
  }

  let body
  try {
    body = await readBody(req)
  } catch {
    res.status(400).json({ ok: false, error: 'JSON inválido' })
    return
  }

  const checked = validate(body)
  if (checked.error) {
    res.status(400).json({ ok: false, error: checked.error, field: checked.field })
    return
  }

  try {
    await postDiscord(webhookUrl, checked.data)
    res.status(200).json({ ok: true })
  } catch (e) {
    res.status(e.status || 502).json({ ok: false, error: 'No pudimos registrar tu solicitud' })
  }
}
