"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const programs_1 = __importDefault(require("./routes/programs"));
const cards_1 = __importDefault(require("./routes/cards"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.json({ message: 'Loyalty API fonctionne !' });
});
app.use('/api/auth', auth_1.default);
app.use('/api/programs', programs_1.default);
app.use('/api/cards', cards_1.default);
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
exports.default = app;
