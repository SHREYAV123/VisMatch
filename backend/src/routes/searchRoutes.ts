import express from 'express';
import Product from '../models/Product';
import ImageService from '../services/imageService';
import upload from '../middleware/upload';

const router = express.Router();

// Visual similarity search endpoint
router.post('/similar', upload.single('image'), async (req, res) => {
  try {
    let queryFeatures: number[];

    // Extract features from uploaded image or URL
    if (req.file) {
      queryFeatures = await ImageService.extractFeaturesFromImage(req.file.buffer);
    } else if (req.body.imageUrl) {
      const imageBuffer = await ImageService.downloadImageFromUrl(req.body.imageUrl);
      queryFeatures = ImageService.extractFeaturesFromImage(imageBuffer);
    } else {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Parse filters
    const filters = {
      category: req.body.category || 'all',
      minSimilarity: parseFloat(req.body.minSimilarity) || 0.1,
      maxResults: parseInt(req.body.maxResults) || 20,
      minPrice: parseFloat(req.body.minPrice) || 0,
      maxPrice: parseFloat(req.body.maxPrice) || Infinity,
      brands: req.body.brands ? JSON.parse(req.body.brands) : []
    };

    // Build database query
    const dbFilter: any = {
      price: { $gte: filters.minPrice, $lte: filters.maxPrice }
    };

    if (filters.category !== 'all') {
      dbFilter.category = new RegExp(filters.category, 'i');
    }

    if (filters.brands.length > 0) {
      dbFilter.brand = { $in: filters.brands.map((b: string) => new RegExp(b, 'i')) };
    }

    // Get products from database
    const products = await Product.find(dbFilter);

    // Calculate similarities
    const similarities = products.map(product => {
      const similarity = ImageService.calculateCosineSimilarity(
        queryFeatures, 
        product.imageFeatures
      );
      
      return {
        product: product.toObject(),
        similarity: Math.max(0, Math.min(1, similarity)) // Clamp between 0 and 1
      };
    });

    // Filter by minimum similarity and sort
    const filteredResults = similarities
      .filter(item => item.similarity >= filters.minSimilarity)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, filters.maxResults);

    // Format results
    const results = filteredResults.map(item => ({
      ...item.product,
      similarityScore: Math.round(item.similarity * 1000) / 1000 // 3 decimal places
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

  } catch (error: any) {
    console.error('Search error:', error);
    return res.status(500).json({ 
      error: 'Search failed', 
      details: error.message 
    });
  }
});

export default router;