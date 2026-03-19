"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLoyaltyClass = createLoyaltyClass;
exports.createLoyaltyObject = createLoyaltyObject;
exports.generateWalletLink = generateWalletLink;
async function createLoyaltyClass(programId, businessName, programName, type) {
    console.log(`[MOCK] Classe créée : ${programName} pour ${businessName}`);
    return true;
}
async function createLoyaltyObject(cardId, programId, customerName, balance, total) {
    console.log(`[MOCK] Objet créé : ${cardId} - ${balance}/${total}`);
    return true;
}
async function generateWalletLink(cardId, programId, customerName, balance, total) {
    console.log(`[MOCK] Lien généré pour ${customerName}`);
    return `https://wallet.google.com/mock/${cardId}?balance=${balance}&total=${total}`;
}
