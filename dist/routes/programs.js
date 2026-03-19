"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.post('/', auth_1.authMiddleware, async (req, res) => {
    const { name, type, config } = req.body;
    try {
        const program = await prisma.loyaltyProgram.create({
            data: {
                businessId: req.businessId,
                name,
                type,
                config
            }
        });
        res.status(201).json({
            message: 'Programme créé avec succès',
            program
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
router.get('/', auth_1.authMiddleware, async (req, res) => {
    try {
        const programs = await prisma.loyaltyProgram.findMany({
            where: { businessId: req.businessId }
        });
        res.json({ programs });
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
exports.default = router;
