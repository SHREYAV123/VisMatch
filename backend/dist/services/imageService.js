"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageService = void 0;
class ImageService {
    static extractFeaturesFromProduct(productData) {
        const features = new Array(512).fill(0);
        const category = productData.category?.toLowerCase() || '';
        const brand = productData.brand?.toLowerCase() || '';
        const name = productData.name?.toLowerCase() || '';
        const tags = Array.isArray(productData.tags) ? productData.tags : [];
        const description = productData.description?.toLowerCase() || '';
        const tagFeatures = this.getTagFeatures(tags);
        for (let i = 0; i < Math.min(300, tagFeatures.length); i++) {
            features[i] = tagFeatures[i];
        }
        const textFeatures = this.getTextFeatures(name + ' ' + description);
        for (let i = 0; i < Math.min(150, textFeatures.length); i++) {
            features[300 + i] = textFeatures[i];
        }
        const brandFeatures = this.getBrandFeatures(brand);
        for (let i = 0; i < Math.min(50, brandFeatures.length); i++) {
            features[450 + i] = brandFeatures[i];
        }
        const categoryFeatures = this.getCategoryFeatures(category);
        for (let i = 0; i < Math.min(12, categoryFeatures.length); i++) {
            features[500 + i] = (categoryFeatures[i] ?? 0) * 0.3;
        }
        return features;
    }
    static extractFeaturesFromImage(imageData) {
        if (Buffer.isBuffer(imageData)) {
            return new Array(512).fill(0);
        }
        const features = new Array(512).fill(0);
        if (typeof imageData === 'string') {
            let seed = imageData.split('').reduce((hash, char) => {
                hash = ((hash << 5) - hash) + char.charCodeAt(0);
                return hash & hash;
            }, 0);
            const seededRandom = (seed) => {
                const x = Math.sin(seed) * 10000;
                return x - Math.floor(x);
            };
            for (let i = 0; i < 512; i++) {
                const randomValue = seededRandom(seed + i);
                features[i] = (randomValue * 2) - 1;
            }
        }
        return features;
    }
    static getCategoryFeatures(category) {
        const categoryMap = {
            'electronics': [1.0, 0.8, 0.6, 0.9, 0.7].concat(new Array(95).fill(0.1)),
            'shoes': [0.2, 1.0, 0.8, 0.3, 0.9].concat(new Array(95).fill(0.2)),
            'clothing': [0.3, 0.7, 1.0, 0.5, 0.8].concat(new Array(95).fill(0.3)),
            'books': [0.9, 0.2, 0.4, 1.0, 0.3].concat(new Array(95).fill(0.4)),
            'home': [0.5, 0.4, 0.6, 0.7, 1.0].concat(new Array(95).fill(0.5)),
            'beauty': [0.8, 0.6, 0.9, 0.4, 0.5].concat(new Array(95).fill(0.6)),
            'sports': [0.7, 0.9, 0.5, 0.8, 0.6].concat(new Array(95).fill(0.7))
        };
        return categoryMap[category] || new Array(100).fill(0.1);
    }
    static getBrandFeatures(brand) {
        const brandMap = {
            'apple': [1.0, 0.9, 0.8].concat(new Array(97).fill(0.1)),
            'samsung': [0.9, 1.0, 0.7].concat(new Array(97).fill(0.2)),
            'nike': [0.8, 0.7, 1.0].concat(new Array(97).fill(0.3)),
            'adidas': [0.7, 0.8, 0.9].concat(new Array(97).fill(0.4)),
            'sony': [0.9, 0.6, 0.8].concat(new Array(97).fill(0.5))
        };
        return brandMap[brand] || new Array(100).fill(0.1);
    }
    static getTagFeatures(tags) {
        const features = new Array(300).fill(0);
        const tagWeights = {
            'headphones': [1.0, 0.95, 0.9, 0.85, 0.8].concat(new Array(295).fill(0.1)),
            'earbuds': [0.9, 1.0, 0.85, 0.8, 0.75].concat(new Array(295).fill(0.1)),
            'wireless': [0.85, 0.9, 1.0, 0.7, 0.6].concat(new Array(295).fill(0.1)),
            'noise-canceling': [0.8, 0.85, 0.9, 1.0, 0.75].concat(new Array(295).fill(0.1)),
            'smartphone': [0.1, 0.1, 0.1, 0.1, 1.0].concat(new Array(295).fill(0.15)),
            'laptop': [0.15, 0.1, 0.1, 0.1, 0.9].concat(new Array(295).fill(0.15)),
            'tablet': [0.1, 0.15, 0.1, 0.1, 0.85].concat(new Array(295).fill(0.15)),
            't-shirt': [0.1, 0.1, 0.1, 0.1, 0.1, 1.0, 0.9, 0.8].concat(new Array(292).fill(0.2)),
            'shirt': [0.1, 0.1, 0.1, 0.1, 0.1, 0.9, 1.0, 0.85].concat(new Array(292).fill(0.2)),
            'hoodie': [0.1, 0.1, 0.1, 0.1, 0.1, 0.8, 0.85, 1.0].concat(new Array(292).fill(0.2)),
            'shoes': [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 1.0, 0.9].concat(new Array(290).fill(0.25)),
            'sneakers': [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.9, 1.0].concat(new Array(290).fill(0.25)),
            'running': [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.85, 0.95].concat(new Array(290).fill(0.25)),
            'book': [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 1.0].concat(new Array(289).fill(0.3)),
            'fiction': [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.9].concat(new Array(289).fill(0.3)),
            'skincare': [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 1.0, 0.9].concat(new Array(287).fill(0.35)),
            'moisturizer': [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.9, 1.0].concat(new Array(287).fill(0.35)),
            'foundation': [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.85, 0.95].concat(new Array(287).fill(0.35)),
            'makeup': [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.8, 0.9].concat(new Array(287).fill(0.35))
        };
        for (const tag of tags) {
            const tagFeature = tagWeights[tag.toLowerCase()];
            if (tagFeature) {
                for (let i = 0; i < Math.min(features.length, tagFeature.length); i++) {
                    features[i] += tagFeature[i];
                }
            }
        }
        return features;
    }
    static getTextFeatures(text) {
        const features = new Array(150).fill(0);
        const words = text.toLowerCase().split(/\s+/);
        const keywordWeights = {
            'headphones': 1.0, 'headset': 1.0, 'sony': 0.8, 'wh-1000xm4': 1.0,
            'airpods': 1.0, 'earbuds': 1.0,
            'iphone': 0.9, 'samsung': 0.9, 'phone': 0.8, 'smartphone': 0.9,
            'laptop': 0.9, 'macbook': 1.0, 'dell': 0.8, 'hp': 0.8, 'lenovo': 0.8,
            'book': 1.0, 'novel': 0.9, 'psychology': 0.8, 'money': 0.7,
            'shirt': 1.0, 'clothing': 0.8, 'uniqlo': 0.8,
            'moisturizer': 1.0, 'foundation': 1.0, 'skincare': 0.9, 'cream': 0.8,
            'shoes': 1.0, 'sneakers': 1.0, 'nike': 0.8, 'adidas': 0.8, 'running': 0.9
        };
        for (const word of words) {
            const weight = keywordWeights[word] || 0;
            if (weight > 0) {
                const wordHash = this.simpleHash(word);
                const featureIndex = Math.abs(wordHash) % features.length;
                features[featureIndex] += weight;
            }
        }
        for (let i = 0; i < words.length && i < features.length; i++) {
            const word = words[i];
            if (word && !keywordWeights[word]) {
                const hash = this.simpleHash(word);
                features[i % features.length] += Math.sin(hash) * 0.1;
            }
        }
        return features;
    }
    static simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash = hash & hash;
        }
        return hash;
    }
    static calculateCosineSimilarity(vectorA, vectorB) {
        if (vectorA.length !== vectorB.length)
            return 0;
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        for (let i = 0; i < vectorA.length; i++) {
            const a = vectorA[i] ?? 0;
            const b = vectorB[i] ?? 0;
            dotProduct += a * b;
            normA += a * a;
            normB += b * b;
        }
        if (normA === 0 || normB === 0)
            return 0;
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }
    static async downloadImageFromUrl(url) {
        try {
            const response = await fetch(url);
            if (!response.ok)
                throw new Error(`HTTP ${response.status}`);
            const arrayBuffer = await response.arrayBuffer();
            return Buffer.from(arrayBuffer);
        }
        catch (error) {
            throw new Error(`Failed to download image: ${error.message}`);
        }
    }
}
exports.ImageService = ImageService;
exports.default = ImageService;
//# sourceMappingURL=imageService.js.map