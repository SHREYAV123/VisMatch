"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Product_1 = __importDefault(require("../models/Product"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function checkDatabase() {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        const totalProducts = await Product_1.default.countDocuments();
        console.log(`📊 Total products: ${totalProducts}`);
        const categories = await Product_1.default.distinct('category');
        console.log(`📝 Categories: ${categories.join(', ')}`);
        const brands = await Product_1.default.distinct('brand');
        console.log(`🏷️ Brands: ${brands.join(', ')}`);
        const sampleProducts = await Product_1.default.find().limit(3).select('name category price brand');
        console.log('\n🎯 Sample products:');
        sampleProducts.forEach(product => {
            console.log(`  - ${product.name} (${product.category}, ${product.brand}) - $${product.price}`);
        });
        const productsWithFeatures = await Product_1.default.countDocuments({
            imageFeatures: { $exists: true, $ne: [] }
        });
        console.log(`\n🖼️ Products with image features: ${productsWithFeatures}`);
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Database check error:', error);
        process.exit(1);
    }
}
if (require.main === module) {
    checkDatabase();
}
//# sourceMappingURL=check.js.map