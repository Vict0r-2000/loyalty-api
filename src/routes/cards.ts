import { Router, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware, AuthRequest } from '../middleware/auth'
import { createLoyaltyClass, generateWalletLink } from '../services/googleWallet'
import { sendWelcomeEmail } from '../services/email'

const router = Router()
const prisma = new PrismaClient()

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { programId, customerEmail, customerName } = req.body

  try {
    const program = await prisma.loyaltyProgram.findFirst({
      where: { id: programId, businessId: req.businessId! },
      include: { business: true }
    })

    if (!program) {
      return res.status(404).json({ error: 'Programme introuvable' })
    }

    let customer = await prisma.customer.findFirst({
      where: { businessId: req.businessId!, email: customerEmail }
    })

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          businessId: req.businessId!,
          email: customerEmail
        }
      })
    }

    const card = await prisma.card.create({
      data: {
        customerId: customer.id,
        programId: program.id,
        balance: 0
      }
    })

    const config = program.config as any
    const total = config.total || 100

    await createLoyaltyClass(
      program.id,
      program.business.name,
      program.name,
      program.type
    )

    const walletLink = await generateWalletLink(
      card.id,
      program.id,
      customerName || customerEmail,
      0,
      total
    )

await prisma.card.update({
  where: { id: card.id },
  data: { passToken: walletLink }
})

await sendWelcomeEmail(
  customerEmail,
  customerName || customerEmail,
  program.business.name,
  program.name,
  card.id
)

res.status(201).json({
      message: 'Carte créée avec succès',
      card: {
        id: card.id,
        balance: card.balance,
        walletLink
      }
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

router.post('/scan', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { cardId, amount } = req.body

  try {
    const card = await prisma.card.findFirst({
      where: { id: cardId },
      include: {
        program: {
          include: { business: true }
        }
      }
    })

    if (!card) {
      return res.status(404).json({ error: 'Carte introuvable' })
    }

    if (card.program.businessId !== req.businessId!) {
      return res.status(403).json({ error: 'Non autorisé' })
    }

    const config = card.program.config as any
    const total = config.total || 100
    const delta = amount || 1
    const newBalance = card.balance + delta
    const rewardUnlocked = newBalance >= total

    await prisma.card.update({
      where: { id: cardId },
      data: { balance: rewardUnlocked ? 0 : newBalance }
    })

    await prisma.transaction.create({
      data: { cardId, delta, note: rewardUnlocked ? 'Récompense débloquée !' : null }
    })

    const walletLink = await generateWalletLink(
      cardId,
      card.program.id,
      card.program.business.name,
      rewardUnlocked ? 0 : newBalance,
      total
    )

    res.json({
      message: rewardUnlocked ? 'Récompense débloquée !' : 'Tampon ajouté !',
      balance: rewardUnlocked ? 0 : newBalance,
      total,
      rewardUnlocked,
      walletLink
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})
router.get('/:cardId', async (req, res) => {
  const { cardId } = req.params
  try {
    const card = await prisma.card.findUnique({
      where: { id: cardId },
      include: {
        program: {
          include: { business: true }
        },
        customer: true
      }
    })

    if (!card) {
      return res.status(404).json({ error: 'Carte introuvable' })
    }

    res.json({ card })
  } catch {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router