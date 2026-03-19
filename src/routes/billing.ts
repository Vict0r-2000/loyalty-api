import { Router, Response } from 'express'
import Stripe from 'stripe'
import { PrismaClient } from '@prisma/client'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

router.post('/create-checkout', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const business = await prisma.business.findUnique({
      where: { id: req.businessId! }
    })

    if (!business) {
      return res.status(404).json({ error: 'Business introuvable' })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: business.email,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1
        }
      ],
      success_url: 'https://loyalty-dashboard-theta.vercel.app/dashboard?success=true',
      cancel_url: 'https://loyalty-dashboard-theta.vercel.app/dashboard?canceled=true',
      metadata: {
        businessId: req.businessId!
      }
    })

    res.json({ url: session.url })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature']!
  let event

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return res.status(400).json({ error: 'Webhook invalide' })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const businessId = session.metadata?.businessId

    if (businessId) {
      await prisma.business.update({
        where: { id: businessId },
        data: { stripeSubscriptionId: session.subscription as string }
      })
    }
  }

  res.json({ received: true })
})

export default router