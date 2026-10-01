import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

const aiChatDevMiddleware = {
  name: 'local-ai-chat-api',
  configureServer(server) {
    server.middlewares.use('/api/ai-chat', (req, res, next) => {
      if (req.method !== 'POST') return next()

      const chunks = []
      let totalBytes = 0
      let bodyTooLarge = false

      req.on('data', (chunk) => {
        totalBytes += chunk.length
        if (totalBytes > 65536) {
          bodyTooLarge = true
        } else {
          chunks.push(chunk)
        }
      })

      req.on('end', async () => {
        if (bodyTooLarge) {
          res.statusCode = 413
          res.end(JSON.stringify({ message: 'Chat request is too large.' }))
          return
        }

        try {
          req.body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')
          const { default: handler } = await import('./api/ai-chat.js')
          const response = {
            status(code) {
              res.statusCode = code
              return this
            },
            setHeader(name, value) {
              res.setHeader(name, value)
              return this
            },
            json(value) {
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(value))
              return this
            }
          }

          await handler(req, response)
        } catch {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ message: 'The request body must be valid JSON.' }))
        }
      })
    })
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  for (const [key, value] of Object.entries(env)) {
    if (!process.env[key]) process.env[key] = value
  }

  return {
    plugins: [react(), aiChatDevMiddleware]
  }
})
