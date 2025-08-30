"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Product_1 = __importDefault(require("../models/Product"));
const imageService_1 = __importDefault(require("../services/imageService"));
const upload_1 = __importDefault(require("../middleware/upload"));
const router = express_1.default.Router();
router.post('/similar', upload_1.default.single('image'), async (req, res) => {
    try {
        let queryFeatures;
        if (req.file) {
            queryFeatures = await imageService_1.default.extractFeaturesFromImage(req.file.buffer);
        }
        else if (req.body.imageUrl) {
            const imageBuffer = await imageService_1.default.downloadImageFromUrl(req.body.imageUrl);
            queryFeatures = imageService_1.default.extractFeaturesFromImage(imageBuffer);
        }
        else {
            return res.status(400).json({ error: 'No image provided' });
        }
        const filters = {
            category: req.body.category || 'all',
            minSimilarity: parseFloat(req.body.minSimilarity) || 0.1,
            maxResults: parseInt(req.body.maxResults) || 20,
            minPrice: parseFloat(req.body.minPrice) || 0,
            maxPrice: parseFloat(req.body.maxPrice) || Infinity,
            brands: req.body.brands ? JSON.parse(req.body.brands) : []
        };
        const dbFilter = {
            price: { $gte: filters.minPrice, $lte: filters.maxPrice }
        };
        if (filters.category !== 'all') {
            dbFilter.category = new RegExp(filters.category, 'i');
        }
        if (filters.brands.length > 0) {
            dbFilter.brand = { $in: filters.brands.map((b) => new RegExp(b, 'i')) };
        }
        const products = await Product_1.default.find(dbFilter);
        const similarities = products.map(product => {
            const similarity = imageService_1.default.calculateCosineSimilarity(queryFeatures, product.imageFeatures);
            return {
                product: product.toObject(),
                similarity: Math.max(0, Math.min(1, similarity))
            };
        });
        const filteredResults = similarities
            .filter(item => item.similarity >= filters.minSimilarity)
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, filters.maxResults);
        const results = filteredResults.map(item => ({
            ...item.product,
            similarityScore: Math.round(item.similarity * 1000) / 1000
        }));
        return res.json({
            success: true,
            results,
            metadata: {
                totalFound: filteredResults.length,
                queryTime: Date.now(),
                filters: filters
            }
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
//# sourceMappingURL=searchRoutes.js.map