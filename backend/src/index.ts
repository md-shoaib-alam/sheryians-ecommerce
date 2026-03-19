import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import userRoutes   from './routes/users'
import productRoutes from './routes/products'
import orderRoutes  from './routes/orders'
import adminRoutes  from './routes/admin'
import cartRoutes   from './routes/cart'

dotenv.config()

const app  = express()
const PORT = process.env.PORT || 5000

// ─── Middleware ────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// ─── Health Check ──────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ─── Routes ───────────────────────────────────────────────────────────────
app.use('/api/users',    userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders',   orderRoutes)
app.use('/api/admin',    adminRoutes)
app.use('/api/cart',     cartRoutes)

// ─── 404 Handler ──────────────────────────────────────────────────────────
app.use('*', (_req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// ─── Global Error Handler ─────────────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

// ─── Start Server ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Makhana API running at http://localhost:${PORT}`)
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🗄️  Database:    ${process.env.DATABASE_URL?.split('@')[1] || 'local'}`)
  console.log(`✅ Health:      http://localhost:${PORT}/health\n`)
})

export default app
