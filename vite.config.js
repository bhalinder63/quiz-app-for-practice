import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

const historyFile = path.resolve('quiz-history.json')

function historyApi() {
  return {
    name: 'history-api',
    configureServer(server) {
      server.middlewares.use('/api/history', (req, res) => {
        if (req.method === 'GET') {
          let data = []
          if (fs.existsSync(historyFile)) {
            data = JSON.parse(fs.readFileSync(historyFile, 'utf-8'))
          }
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(data))
        } else if (req.method === 'POST') {
          let body = ''
          req.on('data', (chunk) => { body += chunk })
          req.on('end', () => {
            let data = []
            if (fs.existsSync(historyFile)) {
              data = JSON.parse(fs.readFileSync(historyFile, 'utf-8'))
            }
            data.push(JSON.parse(body))
            fs.writeFileSync(historyFile, JSON.stringify(data, null, 2))
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true }))
          })
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), historyApi()],
})
