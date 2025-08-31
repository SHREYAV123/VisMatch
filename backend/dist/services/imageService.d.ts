export declare class ImageService {
    static extractFeaturesFromProduct(productData: any): number[];
    static extractFeaturesFromImage(imageData: string | Buffer): number[];
    private static getCategoryFeatures;
    private static getBrandFeatures;
    private static getTagFeatures;
    private static getTextFeatures;
    private static simpleHash;
    static calculateCosineSimilarity(vectorA: number[], vectorB: number[]): number;
    static downloadImageFromUrl(url: string): Promise<Buffer>;
}
export default ImageService;
//# sourceMappingURL=imageService.d.ts.map