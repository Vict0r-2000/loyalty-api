import { Resend } from 'resend'

export async function sendWelcomeEmail(
  customerEmail: string,
  customerName: string,
  businessName: string,
  programName: string,
  cardId: string
) {
  if (!process.env.RESEND_API_KEY) {
    console.log('RESEND_API_KEY manquante — email non envoyé')
    return
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const cardUrl = `${process.env.DASHBOARD_URL}/card/${cardId}`

  try {
    await resend.emails.send({
      from: 'Loyalty Wallet <onboarding@resend.dev>',
      to: customerEmail,
      subject: `Votre carte ${programName} est prête !`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 2rem; color: #0f2d52;">
          <h1 style="font-size: 20px;">💳 Loyalty Wallet</h1>
          <div style="background: #f0f4f8; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem;">
            <h2 style="margin: 0 0 0.5rem; font-size: 16px;">Bonjour ${customerName} !</h2>
            <p style="margin: 0; color: #64748b; font-size: 14px;">
              Votre carte <strong>${programName}</strong> chez <strong>${businessName}</strong> est prête.
            </p>
          </div>
          <div style="text-align: center; margin-bottom: 1.5rem;">
            <a href="${cardUrl}" style="display: inline-block; padding: 14px 28px; background: #0f2d52; color: white; border-radius: 8px; text-decoration: none; font-size: 15px;">
              Voir ma carte
            </a>
          </div>
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">
            Vous recevez cet email car vous vous êtes inscrit chez ${businessName}.
          </p>
        </div>
      `
    })
    console.log('Email envoyé à', customerEmail)
  } catch (error) {
    console.error('Erreur envoi email:', error)
  }
}
