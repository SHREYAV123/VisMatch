"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dataService_1 = __importDefault(require("../services/dataService"));
const imageService_1 = __importDefault(require("../services/imageService"));
const upload_1 = __importDefault(require("../middleware/upload"));
const router = express_1.default.Router();
function inferCategoryFromQuery(queryTerm) {
    const categoryKeywords = {
        'Electronics': ['phone', 'iphone', 'samsung', 'laptop', 'computer', 'tablet', 'headphones', 'headset', 'earbuds', 'smartphone', 'android', 'macbook', 'dell', 'hp', 'lenovo', 'sony', 'apple'],
        'Shoes': ['shoes', 'sneakers', 'running', 'nike', 'adidas', 'converse', 'vans', 'boots', 'sandals', 'heels', 'flats'],
        'Clothing': ['shirt', 't-shirt', 'jeans', 'pants', 'dress', 'jacket', 'hoodie', 'sweater', 'shorts', 'skirt', 'blouse'],
        'Books': ['book', 'novel', 'fiction', 'non-fiction', 'biography', 'textbook', 'guide', 'manual', 'story'],
        'Home': ['kitchen', 'appliance', 'blender', 'mixer', 'vacuum', 'thermostat', 'grill', 'mattress', 'furniture'],
        'Beauty': ['makeup', 'skincare', 'foundation', 'moisturizer', 'cream', 'sunscreen', 'cosmetics', 'beauty', 'lotion'],
        'Sports': ['fitness', 'exercise', 'gym', 'workout', 'sports', 'athletic', 'bike', 'dumbbells', 'equipment']
    };
    const query = queryTerm.toLowerCase();
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
        if (keywords.some(keyword => query.includes(keyword))) {
            return category;
        }
    }
    return 'all';
}
router.post('/similar', upload_1.default.single('image'), async (req, res) => {
    try {
        let queryFeatures;
        if (req.file) {
            queryFeatures = imageService_1.default.extractFeaturesFromImage(req.file.buffer);
            if (req.body.queryTerm) {
                const queryTerm = req.body.queryTerm.toLowerCase();
                queryFeatures = imageService_1.default.extractFeaturesFromProduct({
                    category: inferCategoryFromQuery(queryTerm),
                    tags: queryTerm.split(' '),
                    name: queryTerm,
                    description: queryTerm,
                    brand: ''
                });
            }
        }
        else if (req.body.imageUrl) {
            queryFeatures = imageService_1.default.extractFeaturesFromImage(req.body.imageUrl);
        }
        else if (req.body.queryTerm) {
            const queryTerm = req.body.queryTerm.toLowerCase();
            queryFeatures = imageService_1.default.extractFeaturesFromProduct({
                category: inferCategoryFromQuery(queryTerm),
                tags: queryTerm.split(' '),
                name: queryTerm,
                description: queryTerm,
                brand: ''
            });
        }
        else {
            return res.status(400).json({ error: 'No image or query term provided' });
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
        const products = await dataService_1.default.find(dbFilter);
        const similarities = products.map((product) => {
            const similarity = imageService_1.default.calculateCosineSimilarity(queryFeatures, product.imageFeatures);
            return {
                product: product,
                similarity: Math.max(0, Math.min(1, similarity))
            };
        });
        let filteredResults = similarities
            .filter(item => item.similarity >= filters.minSimilarity)
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, filters.maxResults);
        if (filteredResults.length === 0 && similarities.length > 0) {
            const sortedSimilarities = similarities.sort((a, b) => b.similarity - a.similarity);
            const bestMatch = sortedSimilarities[0];
            if (bestMatch) {
                filteredResults = [bestMatch];
            }
        }
        const results = filteredResults.map(item => ({
            _id: item.product._id.toString(),
            name: item.product.name,
            category: item.product.category,
            price: item.product.price,
            brand: item.product.brand,
            description: item.product.description,
            imageUrl: item.product.imageUrl,
            tags: item.product.tags || [],
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