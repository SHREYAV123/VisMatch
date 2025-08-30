"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const Product_1 = __importDefault(require("../models/Product"));
const imageService_1 = __importDefault(require("../services/imageService"));
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
const validateProduct = [
    (0, express_validator_1.body)('name')
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Product name must be between 1 and 200 characters'),
    (0, express_validator_1.body)('category')
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Category must be between 1 and 50 characters'),
    (0, express_validator_1.body)('price')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    (0, express_validator_1.body)('brand')
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Brand must be between 1 and 50 characters'),
    (0, express_validator_1.body)('description')
        .trim()
        .isLength({ min: 1, max: 1000 })
        .withMessage('Description must be between 1 and 1000 characters'),
    (0, express_validator_1.body)('tags')
        .optional()
        .isArray()
        .withMessage('Tags must be an array')
];
const validateProductId = [
    (0, express_validator_1.param)('id')
        .isMongoId()
        .withMessage('Invalid product ID')
];
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors.array()
        });
    }
    return next();
};
router.get('/', [
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    (0, express_validator_1.query)('category').optional().trim(),
    (0, express_validator_1.query)('brand').optional().trim(),
    (0, express_validator_1.query)('minPrice').optional().isFloat({ min: 0 }).withMessage('minPrice must be positive'),
    (0, express_validator_1.query)('maxPrice').optional().isFloat({ min: 0 }).withMessage('maxPrice must be positive'),
    (0, express_validator_1.query)('search').optional().trim(),
    (0, express_validator_1.query)('sortBy').optional().isIn(['name', 'price', 'createdAt', 'views', 'brand']).withMessage('Invalid sortBy field'),
    (0, express_validator_1.query)('sortOrder').optional().isIn(['asc', 'desc']).withMessage('sortOrder must be asc or desc')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Invalid query parameters',
                details: errors.array()
            });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 20, 100);
        const category = req.query.category;
        const brand = req.query.brand;
        const minPrice = parseFloat(req.query.minPrice) || 0;
        const maxPrice = parseFloat(req.query.maxPrice) || Number.MAX_SAFE_INTEGER;
        const search = req.query.search;
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder || 'desc';
        const filter = {
            isActive: true,
            price: { $gte: minPrice, $lte: maxPrice }
        };
        if (category && category !== 'all') {
            filter.category = new RegExp(category, 'i');
        }
        if (brand && brand !== 'all') {
            filter.brand = new RegExp(brand, 'i');
        }
        if (search) {
            filter.$text = { $search: search };
        }
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
        if (search) {
            sort.score = { $meta: 'textScore' };
        }
        const [products, totalCount] = await Promise.all([
            Product_1.default.find(filter)
                .sort(sort)
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            Product_1.default.countDocuments(filter)
        ]);
        if (products.length > 0) {
            const productIds = products.map(p => p._id);
            Product_1.default.updateMany({ _id: { $in: productIds } }, { $inc: { views: 1 }, lastViewed: new Date() }).exec();
        }
        return res.json({
            success: true,
            products,
            pagination: {
                current: page,
                total: Math.ceil(totalCount / limit),
                count: products.length,
                totalProducts: totalCount,
                hasNext: page * limit < totalCount,
                hasPrev: page > 1
            },
            filters: {
                category: category || 'all',
                brand: brand || 'all',
                minPrice,
                maxPrice,
                search: search || '',
                sortBy,
                sortOrder
            }
        });
    }
    catch (error) {
        console.error('Get products error:', error);
        return res.status(500).json({
            error: 'Failed to fetch products',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
router.get('/stats/overview', async (req, res) => {
    try {
        const [totalActive, totalInactive, totalCategories, totalBrands, priceStats, topCategories, topBrands, recentProducts] = await Promise.all([
            Product_1.default.countDocuments({ isActive: true }),
            Product_1.default.countDocuments({ isActive: false }),
            Product_1.default.distinct('category', { isActive: true }).then(cats => cats.length),
            Product_1.default.distinct('brand', { isActive: true }).then(brands => brands.length),
            Product_1.default.aggregate([
                { $match: { isActive: true } },
                {
                    $group: {
                        _id: null,
                        avgPrice: { $avg: '$price' },
                        minPrice: { $min: '$price' },
                        maxPrice: { $max: '$price' },
                        totalValue: { $sum: '$price' }
                    }
                }
            ]),
            Product_1.default.aggregate([
                { $match: { isActive: true } },
                { $group: { _id: '$category', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 5 }
            ]),
            Product_1.default.aggregate([
                { $match: { isActive: true } },
                { $group: { _id: '$brand', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 5 }
            ]),
            Product_1.default.find({ isActive: true })
                .sort({ createdAt: -1 })
                .limit(5)
                .select('name category brand price createdAt')
                .lean()
        ]);
        res.json({
            success: true,
            stats: {
                products: {
                    total: totalActive + totalInactive,
                    active: totalActive,
                    inactive: totalInactive
                },
                categories: {
                    total: totalCategories,
                    top: topCategories
                },
                brands: {
                    total: totalBrands,
                    top: topBrands
                },
                pricing: priceStats[0] ? {
                    average: Math.round(priceStats[0].avgPrice * 100) / 100,
                    min: priceStats[0].minPrice,
                    max: priceStats[0].maxPrice,
                    totalValue: Math.round(priceStats[0].totalValue * 100) / 100
                } : null,
                recent: recentProducts
            }
        });
    }
    catch (error) {
        console.error('Get product stats error:', error);
        res.status(500).json({
            error: 'Failed to fetch product statistics',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
router.post('/bulk/delete', [
    (0, express_validator_1.body)('productIds')
        .isArray({ min: 1 })
        .withMessage('productIds must be a non-empty array'),
    (0, express_validator_1.body)('productIds.*')
        .isMongoId()
        .withMessage('Each productId must be a valid MongoDB ObjectId'),
    handleValidationErrors
], async (req, res) => {
    try {
        const { productIds } = req.body;
        const result = await Product_1.default.updateMany({ _id: { $in: productIds } }, { isActive: false });
        res.json({
            success: true,
            message: `${result.modifiedCount} products deleted successfully`,
            modified: result.modifiedCount
        });
    }
    catch (error) {
        console.error('Bulk delete error:', error);
        res.status(500).json({
            error: 'Failed to bulk delete products',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
router.post('/bulk/restore', [
    (0, express_validator_1.body)('productIds')
        .isArray({ min: 1 })
        .withMessage('productIds must be a non-empty array'),
    (0, express_validator_1.body)('productIds.*')
        .isMongoId()
        .withMessage('Each productId must be a valid MongoDB ObjectId'),
    handleValidationErrors
], async (req, res) => {
    try {
        const { productIds } = req.body;
        const result = await Product_1.default.updateMany({ _id: { $in: productIds } }, { isActive: true });
        return res.json({
            success: true,
            message: `${result.modifiedCount} products restored successfully`,
            modified: result.modifiedCount
        });
    }
    catch (error) {
        console.error('Bulk restore error:', error);
        return res.status(500).json({
            error: 'Failed to bulk restore products',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
router.get('/:id', validateProductId, handleValidationErrors, async (req, res) => {
    try {
        const product = await Product_1.default.findById(req.params.id).lean();
        if (!product || !product.isActive) {
            return res.status(404).json({ error: 'Product not found' });
        }
        await Product_1.default.findByIdAndUpdate(req.params.id, {
            $inc: { views: 1 },
            lastViewed: new Date()
        });
        return res.json({
            success: true,
            product
        });
    }
    catch (error) {
        console.error('Get product error:', error);
        return res.status(500).json({
            error: 'Failed to fetch product',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
router.post('/', upload_1.cleanupOnError, ...(0, upload_1.uploadSingle)('image'), upload_1.validateImage, ...validateProduct, handleValidationErrors, async (req, res) => {
    try {
        const { name, category, price, brand, description, tags } = req.body;
        let imageUrl;
        let imageFeatures;
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
            const imageBuffer = require('fs').readFileSync(req.file.path);
            imageFeatures = await imageService_1.default.extractFeaturesFromImage(imageBuffer);
        }
        else if (req.body.imageUrl) {
            try {
                const imageBuffer = await imageService_1.default.downloadImageFromUrl(req.body.imageUrl);
                imageUrl = req.body.imageUrl;
                imageFeatures = await imageService_1.default.extractFeaturesFromImage(imageBuffer);
            }
            catch (error) {
                return res.status(400).json({
                    error: 'Failed to download image from URL',
                    details: error.message
                });
            }
        }
        else {
            return res.status(400).json({ error: 'Image file or URL is required' });
        }
        let parsedTags = [];
        if (tags) {
            if (Array.isArray(tags)) {
                parsedTags = tags;
            }
            else if (typeof tags === 'string') {
                try {
                    parsedTags = JSON.parse(tags);
                }
                catch {
                    parsedTags = [tags];
                }
            }
        }
        const product = new Product_1.default({
            name: name.trim(),
            category: category.trim(),
            price: parseFloat(price),
            brand: brand.trim(),
            description: description.trim(),
            imageUrl,
            imageFeatures,
            tags: parsedTags.map(tag => tag.trim()).filter(tag => tag.length > 0),
            isActive: true
        });
        const savedProduct = await product.save();
        const productResponse = savedProduct.toObject();
        delete productResponse.imageFeatures;
        return res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product: productResponse
        });
    }
    catch (error) {
        console.error('Create product error:', error);
        return res.status(500).json({
            error: 'Failed to create product',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
router.put('/:id', upload_1.cleanupOnError, ...validateProductId, ...(0, upload_1.uploadSingle)('image'), upload_1.validateImage, ...validateProduct, handleValidationErrors, async (req, res) => {
    try {
        const productId = req.params.id;
        const { name, category, price, brand, description, tags } = req.body;
        const existingProduct = await Product_1.default.findById(productId);
        if (!existingProduct || !existingProduct.isActive) {
            return res.status(404).json({ error: 'Product not found' });
        }
        const updateData = {
            name: name.trim(),
            category: category.trim(),
            price: parseFloat(price),
            brand: brand.trim(),
            description: description.trim()
        };
        if (tags) {
            if (Array.isArray(tags)) {
                updateData.tags = tags;
            }
            else if (typeof tags === 'string') {
                try {
                    updateData.tags = JSON.parse(tags);
                }
                catch {
                    updateData.tags = [tags];
                }
            }
            updateData.tags = updateData.tags.map((tag) => tag.trim()).filter((tag) => tag.length > 0);
        }
        if (req.file) {
            updateData.imageUrl = `/uploads/${req.file.filename}`;
            const imageBuffer = require('fs').readFileSync(req.file.path);
            updateData.imageFeatures = await imageService_1.default.extractFeaturesFromImage(imageBuffer);
            if (existingProduct.imageUrl.startsWith('/uploads/')) {
                const oldImagePath = require('path').join(__dirname, '../../uploads', require('path').basename(existingProduct.imageUrl));
                if (require('fs').existsSync(oldImagePath)) {
                    require('fs').unlink(oldImagePath, () => { });
                }
            }
        }
        else if (req.body.imageUrl && req.body.imageUrl !== existingProduct.imageUrl) {
            try {
                const imageBuffer = await imageService_1.default.downloadImageFromUrl(req.body.imageUrl);
                updateData.imageUrl = req.body.imageUrl;
                updateData.imageFeatures = await imageService_1.default.extractFeaturesFromImage(imageBuffer);
            }
            catch (error) {
                return res.status(400).json({
                    error: 'Failed to download image from URL',
                    details: error.message
                });
            }
        }
        const updatedProduct = await Product_1.default.findByIdAndUpdate(productId, updateData, { new: true, runValidators: true });
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        const productResponse = updatedProduct.toObject();
        delete productResponse.imageFeatures;
        return res.json({
            success: true,
            message: 'Product updated successfully',
            product: productResponse
        });
    }
    catch (error) {
        console.error('Update product error:', error);
        return res.status(500).json({
            error: 'Failed to update product',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
router.delete('/:id', validateProductId, handleValidationErrors, async (req, res) => {
    try {
        const product = await Product_1.default.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        return res.json({
            success: true,
            message: 'Product deleted successfully',
            product: { id: product._id, name: product.name }
        });
    }
    catch (error) {
        console.error('Delete product error:', error);
        return res.status(500).json({
            error: 'Failed to delete product',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
router.delete('/:id/permanent', validateProductId, handleValidationErrors, async (req, res) => {
    try {
        const product = await Product_1.default.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        if (product.imageUrl.startsWith('/uploads/')) {
            const imagePath = require('path').join(__dirname, '../../uploads', require('path').basename(product.imageUrl));
            if (require('fs').existsSync(imagePath)) {
                require('fs').unlink(imagePath, () => { });
            }
        }
        await Product_1.default.findByIdAndDelete(req.params.id);
        return res.json({
            success: true,
            message: 'Product permanently deleted',
            product: { id: product._id, name: product.name }
        });
    }
    catch (error) {
        console.error('Permanent delete product error:', error);
        return res.status(500).json({
            error: 'Failed to permanently delete product',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
router.patch('/:id/restore', validateProductId, handleValidationErrors, async (req, res) => {
    try {
        const product = await Product_1.default.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        const productResponse = product.toObject();
        delete productResponse.imageFeatures;
        return res.json({
            success: true,
            message: 'Product restored successfully',
            product: productResponse
        });
    }
    catch (error) {
        console.error('Restore product error:', error);
        return res.status(500).json({
            error: 'Failed to restore product',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
exports.default = router;
//# sourceMappingURL=products.js.map