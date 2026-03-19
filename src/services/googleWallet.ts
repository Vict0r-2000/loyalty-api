export async function createLoyaltyClass(
  programId: string,
  businessName: string,
  programName: string,
  type: string
) {
  console.log(`[MOCK] Classe créée : ${programName} pour ${businessName}`)
  return true
}

export async function createLoyaltyObject(
  cardId: string,
  programId: string,
  customerName: string,
  balance: number,
  total: number
) {
  console.log(`[MOCK] Objet créé : ${cardId} - ${balance}/${total}`)
  return true
}

export async function generateWalletLink(
  cardId: string,
  programId: string,
  customerName: string,
  balance: number,
  total: number
) {
  console.log(`[MOCK] Lien généré pour ${customerName}`)
  return `https://wallet.google.com/mock/${cardId}?balance=${balance}&total=${total}`
}