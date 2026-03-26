"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWelcomeEmail = sendWelcomeEmail;
const resend_1 = require("resend");
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
async function sendWelcomeEmail(customerEmail, customerName, businessName, programName, cardId) {
    const cardUrl = `${process.env.DASHBOARD_URL}/card/${cardId}`;
    try {
        await resend.emails.send({
            from: 'Loyalty Wallet <onboarding@resend.dev>',
            to: customerEmail,
            subject: `Votre carte ${programName} est prête !`,
            html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 2rem; color: #0f2d52;">
          <div style="text-align: center; margin-bottom: 2rem;">
            <h1 style="font-size: 24px; margin: 0;">💳 Loyalty Wallet</h1>
          </div>
          
          <div style="background: #f0f4f8; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem;">
            <h2 style="margin: 0 0 0.5rem; font-size: 18px;">Bonjour ${customerName} !</h2>
            <p style="margin: 0; color: #64748b; font-size: 14px;">
              Votre carte de fidélité <strong>${programName}</strong> chez <strong>${businessName}</strong> est prête.
            </p>
          </div>

          <div style="text-align: center; margin-bottom: 1.5rem;">
            <a href="${cardUrl}" style="display: inline-block; padding: 14px 28px; background: #0f2d52; color: white; border-radius: 8px; text-decoration: none; font-size: 15px; font-weight: 500;">
              Voir ma carte
            </a>
          </div>

          <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem;">
            <h3 style="margin: 0 0 1rem; font-size: 14px; color: #64748b;">Comment ça marche ?</h3>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <div style="font-size: 13px;">1️⃣ Ouvrez votre carte depuis ce lien</div>
              <div style="font-size: 13px;">2️⃣ Montrez le QR code en caisse</div>
              <div style="font-size: 13px;">3️⃣ Collectez vos tampons à chaque visite</div>
              <div style="font-size: 13px;">4️⃣ Débloquez votre récompense !</div>
            </div>
          </div>

          <p style="font-size: 12px; color: #94a3b8; text-align: center;">
            Vous recevez cet email car vous vous êtes inscrit chez ${businessName}.
          </p>
        </body>
        </html>
      `
        });
        console.log('Email envoyé à', customerEmail);
    }
    catch (error) {
        console.error('Erreur envoi email:', error);
    }
}
