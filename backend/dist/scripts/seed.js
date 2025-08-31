"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const imageService_1 = __importDefault(require("../services/imageService"));
const Product_1 = __importDefault(require("../models/Product"));
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
        name: "Google Pixel 7 Pro",
        category: "Electronics",
        price: 899,
        brand: "Google",
        description: "Pure Android experience with advanced AI photography",
        imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400",
        tags: ["smartphone", "android", "AI", "photography"]
    },
    {
        name: "OnePlus 11",
        category: "Electronics",
        price: 699,
        brand: "OnePlus",
        description: "Fast charging flagship with OxygenOS and premium build",
        imageUrl: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400",
        tags: ["smartphone", "android", "fast-charging", "flagship"]
    },
    {
        name: "iPhone 13 Mini",
        category: "Electronics",
        price: 629,
        brand: "Apple",
        description: "Compact iPhone with A15 Bionic chip and great battery life",
        imageUrl: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400",
        tags: ["smartphone", "iOS", "compact", "premium"]
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
        name: "MacBook Pro 16-inch",
        category: "Electronics",
        price: 2499,
        brand: "Apple",
        description: "Professional laptop with M2 Max chip for power users",
        imageUrl: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400",
        tags: ["laptop", "macOS", "professional", "high-performance"]
    },
    {
        name: "Dell XPS 13",
        category: "Electronics",
        price: 999,
        brand: "Dell",
        description: "Premium ultrabook with InfinityEdge display",
        imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400",
        tags: ["laptop", "windows", "ultrabook", "portable"]
    },
    {
        name: "HP Spectre x360",
        category: "Electronics",
        price: 1299,
        brand: "HP",
        description: "2-in-1 convertible laptop with OLED display",
        imageUrl: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400",
        tags: ["laptop", "windows", "2-in-1", "OLED"]
    },
    {
        name: "Lenovo ThinkPad X1 Carbon",
        category: "Electronics",
        price: 1399,
        brand: "Lenovo",
        description: "Business ultrabook with legendary keyboard and durability",
        imageUrl: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400",
        tags: ["laptop", "windows", "business", "durable"]
    },
    {
        name: "iPad Pro 12.9-inch",
        category: "Electronics",
        price: 1099,
        brand: "Apple",
        description: "Professional tablet with M2 chip and Liquid Retina XDR display",
        imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
        tags: ["tablet", "iOS", "professional", "creative"]
    },
    {
        name: "Samsung Galaxy Tab S8+",
        category: "Electronics",
        price: 749,
        brand: "Samsung",
        description: "Android tablet with S Pen included and large display",
        imageUrl: "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=400",
        tags: ["tablet", "android", "stylus", "entertainment"]
    },
    {
        name: "Sony WH-1000XM4",
        category: "Electronics",
        price: 279,
        brand: "Sony",
        description: "Industry-leading noise canceling wireless headphones",
        imageUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
        tags: ["headphones", "wireless", "noise-canceling", "premium"]
    },
    {
        name: "AirPods Pro 2nd Gen",
        category: "Electronics",
        price: 249,
        brand: "Apple",
        description: "Premium wireless earbuds with adaptive transparency",
        imageUrl: "https://images.unsplash.com/photo-1603351154351-5e2d2325ad10?w=400",
        tags: ["earbuds", "wireless", "noise-canceling", "iOS"]
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
    },
    {
        name: "Nike Air Zoom Pegasus 39",
        category: "Shoes",
        price: 130,
        brand: "Nike",
        description: "Reliable everyday running shoe with responsive cushioning",
        imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400",
        tags: ["running", "everyday", "responsive", "durable"]
    },
    {
        name: "Adidas NMD R1",
        category: "Shoes",
        price: 140,
        brand: "Adidas",
        description: "Street-inspired sneaker with Boost midsole",
        imageUrl: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400",
        tags: ["sneakers", "street", "boost", "casual"]
    },
    {
        name: "New Balance 990v5",
        category: "Shoes",
        price: 185,
        brand: "New Balance",
        description: "Made in USA premium running shoe with ENCAP technology",
        imageUrl: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=400",
        tags: ["running", "premium", "made-in-usa", "comfort"]
    },
    {
        name: "Converse Chuck Taylor All Star",
        category: "Shoes",
        price: 65,
        brand: "Converse",
        description: "Classic canvas sneaker with timeless design",
        imageUrl: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=400",
        tags: ["casual", "classic", "canvas", "lifestyle"]
    },
    {
        name: "Vans Old Skool",
        category: "Shoes",
        price: 75,
        brand: "Vans",
        description: "Skate shoe classic with iconic side stripe",
        imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400",
        tags: ["skate", "classic", "casual", "streetwear"]
    },
    {
        name: "Nike Air Force 1",
        category: "Shoes",
        price: 90,
        brand: "Nike",
        description: "Iconic basketball shoe turned lifestyle sneaker",
        imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
        tags: ["basketball", "lifestyle", "iconic", "leather"]
    },
    {
        name: "Adidas Stan Smith",
        category: "Shoes",
        price: 85,
        brand: "Adidas",
        description: "Minimalist tennis shoe with clean design",
        imageUrl: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400",
        tags: ["tennis", "minimalist", "clean", "white"]
    },
    {
        name: "Uniqlo Airism T-Shirt",
        category: "Clothing",
        price: 15,
        brand: "Uniqlo",
        description: "Moisture-wicking basic t-shirt for everyday wear",
        imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
        tags: ["t-shirt", "basic", "moisture-wicking", "casual"]
    },
    {
        name: "Nike Dri-FIT T-Shirt",
        category: "Clothing",
        price: 25,
        brand: "Nike",
        description: "Performance t-shirt with sweat-wicking technology",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
        tags: ["t-shirt", "performance", "athletic", "dri-fit"]
    },
    {
        name: "Champion Reverse Weave Hoodie",
        category: "Clothing",
        price: 80,
        brand: "Champion",
        description: "Classic heavyweight hoodie with reverse weave construction",
        imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400",
        tags: ["hoodie", "heavyweight", "classic", "streetwear"]
    },
    {
        name: "Adidas 3-Stripes Track Jacket",
        category: "Clothing",
        price: 70,
        brand: "Adidas",
        description: "Iconic track jacket with 3-stripes design",
        imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400",
        tags: ["jacket", "track", "3-stripes", "athletic"]
    },
    {
        name: "Levi's 501 Original Jeans",
        category: "Clothing",
        price: 90,
        brand: "Levi's",
        description: "Original straight-leg jeans with button fly",
        imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
        tags: ["jeans", "original", "straight-leg", "denim"]
    },
    {
        name: "North Face Nuptse Jacket",
        category: "Clothing",
        price: 249,
        brand: "The North Face",
        description: "Iconic down jacket with water-repellent finish",
        imageUrl: "https://images.unsplash.com/photo-1544966503-7cc5ac882d8e?w=400",
        tags: ["jacket", "down", "outdoor", "winter"]
    },
    {
        name: "Patagonia Better Sweater",
        category: "Clothing",
        price: 99,
        brand: "Patagonia",
        description: "Fleece pullover made from recycled polyester",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
        tags: ["fleece", "pullover", "sustainable", "outdoor"]
    },
    {
        name: "Canada Goose Expedition Parka",
        category: "Clothing",
        price: 1095,
        brand: "Canada Goose",
        description: "Extreme weather parka with coyote fur trim",
        imageUrl: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=400",
        tags: ["parka", "extreme-weather", "luxury", "winter"]
    },
    {
        name: "The Psychology of Money",
        category: "Books",
        price: 16,
        brand: "Harcourt",
        description: "Timeless lessons on wealth, greed, and happiness by Morgan Housel",
        imageUrl: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400",
        tags: ["finance", "psychology", "non-fiction", "bestseller"]
    },
    {
        name: "Atomic Habits",
        category: "Books",
        price: 18,
        brand: "Avery",
        description: "An Easy & Proven Way to Build Good Habits by James Clear",
        imageUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400",
        tags: ["self-help", "habits", "productivity", "bestseller"]
    },
    {
        name: "Dune",
        category: "Books",
        price: 17,
        brand: "Ace Books",
        description: "Epic science fiction novel by Frank Herbert",
        imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
        tags: ["science-fiction", "classic", "epic", "novel"]
    },
    {
        name: "The 7 Habits of Highly Effective People",
        category: "Books",
        price: 15,
        brand: "Free Press",
        description: "Personal development classic by Stephen Covey",
        imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
        tags: ["self-help", "leadership", "personal-development", "classic"]
    },
    {
        name: "Where the Crawdads Sing",
        category: "Books",
        price: 14,
        brand: "G.P. Putnam's Sons",
        description: "Coming-of-age mystery novel by Delia Owens",
        imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
        tags: ["fiction", "mystery", "coming-of-age", "bestseller"]
    },
    {
        name: "Instant Pot Duo 7-in-1",
        category: "Home",
        price: 99,
        brand: "Instant Pot",
        description: "Multi-functional pressure cooker for quick meals",
        imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
        tags: ["kitchen", "pressure-cooker", "appliance", "multi-function"]
    },
    {
        name: "Vitamix Professional Blender",
        category: "Home",
        price: 449,
        brand: "Vitamix",
        description: "Professional-grade blender for smoothies and more",
        imageUrl: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400",
        tags: ["kitchen", "blender", "professional", "smoothies"]
    },
    {
        name: "KitchenAid Stand Mixer",
        category: "Home",
        price: 349,
        brand: "KitchenAid",
        description: "Iconic stand mixer for baking and cooking",
        imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
        tags: ["kitchen", "mixer", "baking", "iconic"]
    },
    {
        name: "Dyson V15 Detect",
        category: "Home",
        price: 749,
        brand: "Dyson",
        description: "Cordless vacuum with laser dust detection",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
        tags: ["vacuum", "cordless", "cleaning", "technology"]
    },
    {
        name: "Nest Learning Thermostat",
        category: "Home",
        price: 249,
        brand: "Google",
        description: "Smart thermostat that learns your schedule",
        imageUrl: "https://images.unsplash.com/photo-1558618047-e7a8efc93bed?w=400",
        tags: ["smart-home", "thermostat", "energy-saving", "automation"]
    },
    {
        name: "Philips Hue Smart Bulbs",
        category: "Home",
        price: 199,
        brand: "Philips",
        description: "Color-changing smart LED light bulbs",
        imageUrl: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400",
        tags: ["smart-home", "lighting", "LED", "color-changing"]
    },
    {
        name: "Weber Genesis II Gas Grill",
        category: "Home",
        price: 899,
        brand: "Weber",
        description: "Premium gas grill for outdoor cooking",
        imageUrl: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400",
        tags: ["grill", "outdoor", "cooking", "gas"]
    },
    {
        name: "Casper Original Mattress",
        category: "Home",
        price: 595,
        brand: "Casper",
        description: "Memory foam mattress with zoned support",
        imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
        tags: ["mattress", "memory-foam", "sleep", "comfort"]
    },
    {
        name: "CeraVe Moisturizing Cream",
        category: "Beauty",
        price: 19,
        brand: "CeraVe",
        description: "Daily moisturizer with ceramides for all skin types",
        imageUrl: "https://images.unsplash.com/photo-1556760544-74068565f05c?w=400",
        tags: ["skincare", "moisturizer", "ceramides", "daily"]
    },
    {
        name: "Neutrogena Ultra Sheer Sunscreen",
        category: "Beauty",
        price: 8,
        brand: "Neutrogena",
        description: "Broad spectrum SPF 70 sunscreen",
        imageUrl: "https://images.unsplash.com/photo-1556760444-f9c7c024cd16?w=400",
        tags: ["sunscreen", "SPF", "protection", "daily"]
    },
    {
        name: "Fenty Beauty Foundation",
        category: "Beauty",
        price: 36,
        brand: "Fenty Beauty",
        description: "Full coverage foundation with 50 shades",
        imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
        tags: ["makeup", "foundation", "full-coverage", "inclusive"]
    },
    {
        name: "Dyson Airwrap Styler",
        category: "Beauty",
        price: 599,
        brand: "Dyson",
        description: "Multi-styler for drying and styling hair",
        imageUrl: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400",
        tags: ["hair-styling", "multi-styler", "technology", "premium"]
    },
    {
        name: "Peloton Bike+",
        category: "Sports",
        price: 2495,
        brand: "Peloton",
        description: "Premium exercise bike with live classes",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
        tags: ["fitness", "cycling", "premium", "connected"]
    },
    {
        name: "Bowflex SelectTech Dumbbells",
        category: "Sports",
        price: 349,
        brand: "Bowflex",
        description: "Adjustable dumbbells from 5 to 52.5 lbs",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
        tags: ["fitness", "dumbbells", "adjustable", "strength"]
    }
];
async function seedDatabase() {
    try {
        console.log('🚀 Starting product data seeding...');
        const MONGODB_URI = process.env.MONGODB_URI;
        if (!MONGODB_URI) {
            throw new Error('MONGODB_URI environment variable is not set');
        }
        console.log('🔗 Connecting to MongoDB Atlas...');
        const dbURI = MONGODB_URI.includes('/vismatch') ? MONGODB_URI : MONGODB_URI.replace('mongodb.net/', 'mongodb.net/vismatch');
        await mongoose_1.default.connect(dbURI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('✅ Connected to MongoDB Atlas successfully');
        console.log('🗑️ Clearing existing products...');
        await Product_1.default.deleteMany({});
        console.log('✅ Existing products cleared');
        const productsWithFeatures = [];
        for (const productData of sampleProducts) {
            try {
                const imageFeatures = imageService_1.default.extractFeaturesFromProduct(productData);
                const productWithFeatures = {
                    ...productData,
                    imageFeatures
                };
                productsWithFeatures.push(productWithFeatures);
                console.log(`✅ Processed ${productData.name}`);
            }
            catch (error) {
                console.error(`❌ Failed to process ${productData.name}:`, error);
            }
        }
        console.log('💾 Inserting products into MongoDB...');
        const insertedProducts = await Product_1.default.insertMany(productsWithFeatures);
        console.log(`🎉 Successfully seeded ${insertedProducts.length} products to MongoDB Atlas`);
        console.log(`📊 Categories: ${[...new Set(insertedProducts.map(p => p.category))].join(', ')}`);
        console.log(`🏷️ Brands: ${[...new Set(insertedProducts.map(p => p.brand))].join(', ')}`);
        await mongoose_1.default.connection.close();
        console.log('🔒 MongoDB connection closed');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Seeding error:', error);
        await mongoose_1.default.connection.close();
        process.exit(1);
    }
}
if (require.main === module) {
    seedDatabase();
}
//# sourceMappingURL=seed.js.map