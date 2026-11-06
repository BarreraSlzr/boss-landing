import { defineConfig, loadEnv } from 'vite'

/** Dev-only mirror of /api/contact so Vite serves Discord posts without `vercel dev`. */
function contactApiPlugin(webhookUrl) {
  return {
    name: 'boss-contact-api',
    configureServer(server) {
      server.middlewares.use('/api/contact', (req, res, next) => {
        if (req.method === 'OPTIONS') {
          res.statusCode = 204
          res.end()
          return
        }
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ ok: false, error: 'Method not allowed' }))
          return
        }
        if (!webhookUrl) {
          res.statusCode = 503
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ ok: false, error: 'Contacto temporalmente no disponible' }))
          return
        }

        const chunks = []
        req.on('data', (c) => chunks.push(c))
        req.on('end', async () => {
          try {
            const body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')
            const nombre = String(body.nombre || '').trim()
            const tel = String(body.tel || '').trim()
            const email = String(body.email || '').trim()
            if (nombre.length < 3) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ ok: false, error: 'Necesitamos tu nombre', field: 'nombre' }))
              return
            }
            if (tel.replace(/\D/g, '').length < 8) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ ok: false, error: 'Necesitamos un teléfono o WhatsApp', field: 'tel' }))
              return
            }

            const payload = {
              username: 'BOSS · Cotizaciones',
              embeds: [{
                title: 'Nueva solicitud de cotización',
                color: 0x63c6ff,
                fields: [
                  { name: 'Nombre', value: nombre || '—', inline: true },
                  { name: 'Empresa', value: String(body.empresa || '').trim() || '—', inline: true },
                  { name: 'WhatsApp / tel', value: tel || '—', inline: true },
                  { name: 'Correo', value: email || '—', inline: true },
                  { name: 'Tipo de proyecto', value: String(body.tipo || 'No especificado'), inline: false },
                  { name: 'Plazo', value: String(body.plazo || 'No especificado'), inline: true },
                  { name: 'Requerimiento', value: String(body.notas || '').trim() || 'Sin detalle', inline: false },
                  { name: 'Origen', value: String(body.origen || 'landing-cotizacion'), inline: true },
                ],
                timestamp: new Date().toISOString(),
                footer: { text: 'bossingenieria.com · local' },
              }],
            }

            const discord = await fetch(webhookUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            })
            if (!discord.ok) {
              res.statusCode = 502
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ ok: false, error: 'No pudimos registrar tu solicitud' }))
              return
            }
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true }))
          } catch {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: false, error: 'JSON inválido' }))
          }
        })
        req.on('error', () => next())
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    base: './',
    build: {
      assetsInlineLimit: 0,
      chunkSizeWarningLimit: 1600,
    },
    plugins: [contactApiPlugin(env.DISCORD_WEBHOOK_URL)],
  }
})
