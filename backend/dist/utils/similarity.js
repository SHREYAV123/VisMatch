"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeSimilarity = exports.calculateEuclideanDistance = exports.calculateCosineSimilarity = void 0;
const calculateCosineSimilarity = (vectorA, vectorB) => {
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
};
exports.calculateCosineSimilarity = calculateCosineSimilarity;
const calculateEuclideanDistance = (vectorA, vectorB) => {
    if (vectorA.length !== vectorB.length)
        return Infinity;
    let sum = 0;
    for (let i = 0; i < vectorA.length; i++) {
        const diff = (vectorA[i] ?? 0) - (vectorB[i] ?? 0);
        sum += diff * diff;
    }
    return Math.sqrt(sum);
};
exports.calculateEuclideanDistance = calculateEuclideanDistance;
const normalizeSimilarity = (similarity) => {
    return Math.max(0, Math.min(1, similarity));
};
exports.normalizeSimilarity = normalizeSimilarity;
//# sourceMappingURL=similarity.js.map