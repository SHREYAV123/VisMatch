"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const searchRoutes_1 = __importDefault(require("./routes/searchRoutes"));
const Product_1 = __importDefault(require("./models/Product"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '30mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '30mb' }));
mongoose_1.default.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch(err => console.error('❌ MongoDB connection error:', err));
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});
app.use('/api/products', productRoutes_1.default);
app.use('/api/search', searchRoutes_1.default);
app.get('/api/categories', async (req, res) => {
    try {
        const categories = await Product_1.default.distinct('category');
        res.json({ categories });
    }
    catch (error) {
        console.error('Categories error:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});
app.get('/api/brands', async (req, res) => {
    try {
        const brands = await Product_1.default.distinct('brand');
        res.json({ brands });
    }
    catch (error) {
        console.error('Brands error:', error);
        res.status(500).json({ error: 'Failed to fetch brands' });
    }
});
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ error: "File too large" });
    }
    if (err.message && err.message.includes("Only image files")) {
        return res.status(400).json({ error: "Only image files are allowed" });
    }
    return res.status(500).json({ error: "Internal server error" });
});
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
});
exports.default = app;
//# sourceMappingURL=server.js.map