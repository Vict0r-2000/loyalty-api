import { Router, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { name, type, config } = req.body

  try {
    const program = await prisma.loyaltyProgram.create({
      data: {
        businessId: req.businessId!,
        name,
        type,
        config
      }
    })

    res.status(201).json({
      message: 'Programme créé avec succès',
      program
    })

  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const programs = await prisma.loyaltyProgram.findMany({
      where: { businessId: req.businessId! }
    })

    res.json({ programs })

  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router