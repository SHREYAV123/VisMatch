import mongoose from 'mongoose';
import Product from '../models/Product';
import dotenv from 'dotenv';

dotenv.config();

async function checkDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('✅ Connected to MongoDB');

    // Check total products
    const totalProducts = await Product.countDocuments();
    console.log(`📊 Total products: ${totalProducts}`);

    // Check categories
    const categories = await Product.distinct('category');
    console.log(`📝 Categories: ${categories.join(', ')}`);

    // Check brands
    const brands = await Product.distinct('brand');
    console.log(`🏷️ Brands: ${brands.join(', ')}`);

    // Sample products
    const sampleProducts = await Product.find().limit(3).select('name category price brand');
    console.log('\n🎯 Sample products:');
    sampleProducts.forEach(product => {
      console.log(`  - ${product.name} (${product.category}, ${product.brand}) - $${product.price}`);
    });

    // Check for products with features
    const productsWithFeatures = await Product.countDocuments({
      imageFeatures: { $exists: true, $ne: [] }
    });
    console.log(`\n🖼️ Products with image features: ${productsWithFeatures}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Database check error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  checkDatabase();
}