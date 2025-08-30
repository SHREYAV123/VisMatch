"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Product_1 = __importDefault(require("../models/Product"));
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const category = req.query.category;
        const brand = req.query.brand;
        const minPrice = parseFloat(req.query.minPrice) || 0;
        const maxPrice = parseFloat(req.query.maxPrice) || Infinity;
        const filter = {
            price: { $gte: minPrice, $lte: maxPrice }
        };
        if (category && category !== 'all') {
            filter.category = new RegExp(category, 'i');
        }
        if (brand && brand !== 'all') {
            filter.brand = new RegExp(brand, 'i');
        }
        const total = await Product_1.default.countDocuments(filter);
        const products = await Product_1.default.find(filter)
            .select('-imageFeatures')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        res.json({
            products,
            pagination: {
                current: page,
                total: Math.ceil(total / limit),
                count: products.length,
                totalProducts: total
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});
exports.default = router;
//# sourceMappingURL=productRoutes.js.map