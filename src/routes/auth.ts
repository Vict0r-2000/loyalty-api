import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router = Router()
const prisma = new PrismaClient()

router.post('/register', async (req: Request, res: Response) => {
  const { name, email, password } = req.body

  try {
    const existingBusiness = await prisma.business.findUnique({
      where: { email }
    })

    if (existingBusiness) {
      return res.status(400).json({ error: 'Email déjà utilisé' })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const business = await prisma.business.create({
      data: { name, email, passwordHash }
    })

    const token = jwt.sign(
      { businessId: business.id },
      process.env.JWT_SECRET!,
      { expiresIn: '30d' }
    )

    res.status(201).json({
      message: 'Compte créé avec succès',
      token,
      business: { id: business.id, name: business.name, email: business.email }
    })

  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    const business = await prisma.business.findUnique({
      where: { email }
    })

    if (!business) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' })
    }

    const validPassword = await bcrypt.compare(password, business.passwordHash)

    if (!validPassword) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' })
    }

    const token = jwt.sign(
      { businessId: business.id },
      process.env.JWT_SECRET!,
      { expiresIn: '30d' }
    )

    res.json({
      message: 'Connexion réussie',
      token,
      business: { id: business.id, name: business.name, email: business.email }
    })

  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router