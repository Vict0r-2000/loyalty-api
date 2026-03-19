import { Router, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const business = await prisma.business.findUnique({
      where: { id: req.businessId! },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        website: true,
        subscriptionStatus: true,
        createdAt: true,
        _count: {
          select: {
            customers: true,
            programs: true
          }
        }
      }
    })
    res.json({ business })
  } catch {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

router.put('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { name, phone, address, website } = req.body
  try {
    const business = await prisma.business.update({
      where: { id: req.businessId! },
      data: { name, phone, address, website },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        website: true
      }
    })
    res.json({ business })
  } catch {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

router.get('/stats', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const totalCards = await prisma.card.count({
      where: { program: { businessId: req.businessId! } }
    })

    const totalTransactions = await prisma.transaction.count({
      where: { card: { program: { businessId: req.businessId! } } }
    })

    const rewards = await prisma.transaction.count({
      where: {
        card: { program: { businessId: req.businessId! } },
        note: 'Récompense débloquée !'
      }
    })

    res.json({ totalCards, totalTransactions, rewards })
  } catch {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router