"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingBusiness = await prisma.business.findUnique({
            where: { email }
        });
        if (existingBusiness) {
            return res.status(400).json({ error: 'Email déjà utilisé' });
        }
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        const business = await prisma.business.create({
            data: { name, email, passwordHash }
        });
        const token = jsonwebtoken_1.default.sign({ businessId: business.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.status(201).json({
            message: 'Compte créé avec succès',
            token,
            business: { id: business.id, name: business.name, email: business.email }
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const business = await prisma.business.findUnique({
            where: { email }
        });
        if (!business) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }
        const validPassword = await bcrypt_1.default.compare(password, business.passwordHash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }
        const token = jsonwebtoken_1.default.sign({ businessId: business.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.json({
            message: 'Connexion réussie',
            token,
            business: { id: business.id, name: business.name, email: business.email }
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
exports.default = router;
