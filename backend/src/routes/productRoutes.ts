import express from 'express';
import Product from '../models/Product';

const router = express.Router();

// Get all products with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const category = req.query.category as string;
    const brand = req.query.brand as string;
    const minPrice = parseFloat(req.query.minPrice as string) || 0;
    const maxPrice = parseFloat(req.query.maxPrice as string) || Infinity;

    const filter: any = {
      price: { $gte: minPrice, $lte: maxPrice }
    };

    if (category && category !== 'all') {
      filter.category = new RegExp(category, 'i');
    }

    if (brand && brand !== 'all') {
      filter.brand = new RegExp(brand, 'i');
    }

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .select('-imageFeatures') // Exclude heavy feature vectors from listing
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
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});


export default router;