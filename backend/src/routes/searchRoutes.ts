import express from 'express';
import DataService from '../services/dataService';
import ImageService from '../services/imageService';
import upload from '../middleware/upload';
import { IProduct } from '../models/Product';

const router = express.Router();

interface SimilarityItem {
  product: IProduct;
  similarity: number;
}

// Helper function to infer category from query terms
function inferCategoryFromQuery(queryTerm: string): string {
  const categoryKeywords: { [key: string]: string[] } = {
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

// Visual similarity search endpoint
router.post('/similar', upload.single('image'), async (req, res) => {
  try {
    let queryFeatures: number[];

    // Extract features from uploaded image or URL
    if (req.file) {
      // For uploaded images, create a basic feature vector
      queryFeatures = ImageService.extractFeaturesFromImage(req.file.buffer);
      
      // If we have query terms, try to match based on category/tags
      if (req.body.queryTerm) {
        const queryTerm = req.body.queryTerm.toLowerCase();
        queryFeatures = ImageService.extractFeaturesFromProduct({
          category: inferCategoryFromQuery(queryTerm),
          tags: queryTerm.split(' '),
          name: queryTerm,
          description: queryTerm,
          brand: ''
        });
      }
    } else if (req.body.imageUrl) {
      // Use the URL directly for consistent feature extraction
      queryFeatures = ImageService.extractFeaturesFromImage(req.body.imageUrl);
    } else if (req.body.queryTerm) {
      // Text-based search using product metadata
      const queryTerm = req.body.queryTerm.toLowerCase();
      queryFeatures = ImageService.extractFeaturesFromProduct({
        category: inferCategoryFromQuery(queryTerm),
        tags: queryTerm.split(' '),
        name: queryTerm,
        description: queryTerm,
        brand: ''
      });
    } else {
      return res.status(400).json({ error: 'No image or query term provided' });
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

    // Get products from data service
    const products = await DataService.find(dbFilter);

    // Calculate similarities
    const similarities: SimilarityItem[] = products.map((product: IProduct) => {
      const similarity = ImageService.calculateCosineSimilarity(
        queryFeatures, 
        product.imageFeatures
      );
      
      return {
        product: product,
        similarity: Math.max(0, Math.min(1, similarity)) // Clamp between 0 and 1
      };
    });

    // Filter by minimum similarity and sort
    let filteredResults: SimilarityItem[] = similarities
      .filter(item => item.similarity >= filters.minSimilarity)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, filters.maxResults);

    // Ensure at least 1 result - if no results meet threshold, return the most similar product
    if (filteredResults.length === 0 && similarities.length > 0) {
      const sortedSimilarities = similarities.sort((a, b) => b.similarity - a.similarity);
      const bestMatch = sortedSimilarities[0];
      if (bestMatch) {
        filteredResults = [bestMatch];
      }
    }

    // Format results
    const results = filteredResults.map(item => ({
      _id: item.product._id.toString(),
      name: item.product.name,
      category: item.product.category,
      price: item.product.price,
      brand: item.product.brand,
      description: item.product.description,
      imageUrl: item.product.imageUrl,
      tags: item.product.tags || [],
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