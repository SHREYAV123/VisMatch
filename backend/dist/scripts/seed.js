"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Product_1 = __importDefault(require("../models/Product"));
const imageService_1 = __importDefault(require("../services/imageService"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sampleProducts = [
    {
        name: "iPhone 14 Pro Max",
        category: "Electronics",
        price: 1099,
        brand: "Apple",
        description: "Latest iPhone with advanced camera system and A16 Bionic chip",
        imageUrl: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
        tags: ["smartphone", "iOS", "camera", "premium"]
    },
    {
        name: "Samsung Galaxy S23 Ultra",
        category: "Electronics",
        price: 1199,
        brand: "Samsung",
        description: "Premium Android smartphone with S Pen and advanced features",
        imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
        tags: ["smartphone", "android", "stylus", "camera"]
    },
    {
        name: "MacBook Air M2",
        category: "Electronics",
        price: 1199,
        brand: "Apple",
        description: "Lightweight laptop with M2 chip and all-day battery life",
        imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
        tags: ["laptop", "macOS", "portable", "performance"]
    },
    {
        name: "Nike Air Max 270",
        category: "Shoes",
        price: 150,
        brand: "Nike",
        description: "Comfortable running shoes with visible Air Max unit",
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
        tags: ["running", "athletic", "comfortable", "casual"]
    },
    {
        name: "Adidas Ultraboost 22",
        category: "Shoes",
        price: 180,
        brand: "Adidas",
        description: "Premium running shoes with Boost cushioning technology",
        imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400",
        tags: ["running", "boost", "performance", "comfortable"]
    }
];
async function seedDatabase() {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        await Product_1.default.deleteMany({});
        console.log('🗑️ Cleared existing products');
        const productsWithFeatures = [];
        for (const productData of sampleProducts) {
            try {
                const imageBuffer = await imageService_1.default.downloadImageFromUrl(productData.imageUrl);
                const imageFeatures = imageService_1.default.extractFeaturesFromImage(imageBuffer);
                productsWithFeatures.push({
                    ...productData,
                    imageFeatures
                });
                console.log(`✅ Processed ${productData.name}`);
            }
            catch (error) {
                console.error(`❌ Failed to process ${productData.name}:`, error);
                productsWithFeatures.push({
                    ...productData,
                    imageFeatures: imageService_1.default.extractFeaturesFromImage("dummy")
                });
            }
        }
        await Product_1.default.insertMany(productsWithFeatures);
        console.log(`🎉 Successfully seeded ${productsWithFeatures.length} products`);
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
}
if (require.main === module) {
    seedDatabase();
}
//# sourceMappingURL=seed.js.map