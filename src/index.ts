import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import authRoutes from './routes/auth'
import programRoutes from './routes/programs'
import cardRoutes from './routes/cards'
import billingRoutes from './routes/billing'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://loyalty-dashboard-theta.vercel.app'
  ],
  credentials: true
}))

app.use('/api/billing/webhook', express.raw({ type: 'application/json' }))
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'Loyalty API fonctionne !' })
})

app.use('/api/auth', authRoutes)
app.use('/api/programs', programRoutes)
app.use('/api/cards', cardRoutes)
app.use('/api/billing', billingRoutes)

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`)
})

export default app
