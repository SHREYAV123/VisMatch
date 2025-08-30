export const calculateCosineSimilarity = (vectorA: number[], vectorB: number[]): number => {
  if (vectorA.length !== vectorB.length) return 0;

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

  if (normA === 0 || normB === 0) return 0;
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

export const calculateEuclideanDistance = (vectorA: number[], vectorB: number[]): number => {
  if (vectorA.length !== vectorB.length) return Infinity;

  let sum = 0;
  for (let i = 0; i < vectorA.length; i++) {
    const diff = (vectorA[i] ?? 0) - (vectorB[i] ?? 0);
    sum += diff * diff;
  }

  return Math.sqrt(sum);
};

export const normalizeSimilarity = (similarity: number): number => {
  return Math.max(0, Math.min(1, similarity));
};