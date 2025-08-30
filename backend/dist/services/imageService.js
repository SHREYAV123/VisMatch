"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageService = void 0;
class ImageService {
    static extractFeaturesFromImage(imageData) {
        const features = [];
        for (let i = 0; i < 1000; i++) {
            features.push(Math.random() * 2 - 1);
        }
        return features;
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