import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'
import { Resend } from 'resend'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function resendEmailPlugin() {
  let env = {}
  return {
    name: 'resend-email-api',
    configResolved(config) {
      env = loadEnv(config.mode, process.cwd(), '')
    },
    configureServer(server) {
      server.middlewares.use('/api/send-email', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ error: 'Method Not Allowed' }))
          return
        }

        let body = ''
        req.on('data', (chunk) => {
          body += chunk
        })

        req.on('end', async () => {
          try {
            const data = JSON.parse(body || '{}')
            const apiKey =
              env.RESEND_API_KEY ||
              env.VITE_RESEND_API_KEY ||
              process.env.RESEND_API_KEY ||
              process.env.VITE_RESEND_API_KEY
            const fromEmail = env.RESEND_FROM_EMAIL || 'FixMate <onboarding@resend.dev>'

            if (!apiKey || !apiKey.startsWith('re_')) {
              console.warn(
                '\x1b[33m[Resend API]\x1b[0m RESEND_API_KEY is not set or placeholder in .env. Email dispatch simulated.'
              )
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 200
              res.end(
                JSON.stringify({
                  success: true,
                  simulated: true,
                  message:
                    'RESEND_API_KEY not configured in .env. To send live emails, set RESEND_API_KEY in .env.',
                  to: data.to,
                  subject: data.subject,
                })
              )
              return
            }

            const resend = new Resend(apiKey)
            const result = await resend.emails.send({
              from: fromEmail,
              to: data.to,
              subject: data.subject,
              html: data.html,
              text: data.text,
            })

            if (result.error) {
              console.error('\x1b[31m[Resend API Error]\x1b[0m', result.error)
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 200
              res.end(
                JSON.stringify({
                  success: false,
                  error: result.error.message || result.error,
                  note: 'Resend free tier requires sending only to account email unless domain is verified at resend.com/domains.',
                })
              )
              return
            }

            console.log(
              '\x1b[32m[Resend Email Sent]\x1b[0m Email ID:',
              result.data?.id,
              'To:',
              data.to
            )
            res.setHeader('Content-Type', 'application/json')
            res.statusCode = 200
            res.end(JSON.stringify({ success: true, id: result.data?.id }))
          } catch (err) {
            console.error('\x1b[31m[Resend Handler Error]\x1b[0m', err)
            res.setHeader('Content-Type', 'application/json')
            res.statusCode = 500
            res.end(JSON.stringify({ success: false, error: err.message }))
          }
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), resendEmailPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
