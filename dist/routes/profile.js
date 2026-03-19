"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.get('/', auth_1.authMiddleware, async (req, res) => {
    try {
        const business = await prisma.business.findUnique({
            where: { id: req.businessId },
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
        });
        res.json({ business });
    }
    catch {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
router.put('/', auth_1.authMiddleware, async (req, res) => {
    const { name, phone, address, website } = req.body;
    try {
        const business = await prisma.business.update({
            where: { id: req.businessId },
            data: { name, phone, address, website },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                address: true,
                website: true
            }
        });
        res.json({ business });
    }
    catch {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
router.get('/stats', auth_1.authMiddleware, async (req, res) => {
    try {
        const totalCards = await prisma.card.count({
            where: { program: { businessId: req.businessId } }
        });
        const totalTransactions = await prisma.transaction.count({
            where: { card: { program: { businessId: req.businessId } } }
        });
        const rewards = await prisma.transaction.count({
            where: {
                card: { program: { businessId: req.businessId } },
                note: 'Récompense débloquée !'
            }
        });
        res.json({ totalCards, totalTransactions, rewards });
    }
    catch {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
exports.default = router;
