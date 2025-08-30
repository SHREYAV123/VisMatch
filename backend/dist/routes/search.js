"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const Product_1 = __importDefault(require("../models/Product"));
const imageService_1 = __importDefault(require("../services/imageService"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed'));
        }
    }
});
router.post('/similar', upload.single('image'), async (req, res) => {
    try {
        let imageFeatures;
        if (req.file) {
            imageFeatures = await imageService_1.default.extractFeaturesFromImage(req.file.buffer);
            console.log("📷 Uploaded image features length:", imageFeatures?.length);
        }
        else if (req.body.imageUrl) {
            const imageBuffer = await imageService_1.default.downloadImageFromUrl(req.body.imageUrl);
            imageFeatures = await imageService_1.default.extractFeaturesFromImage(imageBuffer);
        }
        else {
            return res.status(400).json({ error: 'No image provided' });
        }
        const products = await Product_1.default.find({});
        const similarities = products.map(product => {
            const similarity = imageService_1.default.calculateSimilarity(imageFeatures, product.imageFeatures);
            console.log("🔎 Similarity with", product.name, "=", similarity);
            return { product, similarity };
        });
        const minSimilarity = parseFloat(req.body.minSimilarity) || 0.0;
        const category = req.body.category;
        const limit = parseInt(req.body.limit) || 20;
        let filteredResults = similarities
            .sort((a, b) => b.similarity - a.similarity);
        if (category && category !== 'all') {
            filteredResults = filteredResults.filter(item => item.product.category.toLowerCase() === category.toLowerCase());
        }
        const results = filteredResults
            .slice(0, limit)
            .map(item => ({
            ...item.product.toObject(),
            similarityScore: Math.round(item.similarity * 100) / 100
        }));
        return res.json({
            success: true,
            results,
            totalFound: filteredResults.length
        });
    }
    catch (error) {
        console.error('Search error:', error);
        return res.status(500).json({
            error: 'Search failed',
            details: error.message
        });
    }
});
exports.default = router;
//# sourceMappingURL=search.js.map