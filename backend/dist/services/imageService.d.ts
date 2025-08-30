export declare class ImageService {
    static extractFeaturesFromImage(imageData: string | Buffer): number[];
    static calculateCosineSimilarity(vectorA: number[], vectorB: number[]): number;
    static downloadImageFromUrl(url: string): Promise<Buffer>;
}
export default ImageService;
//# sourceMappingURL=imageService.d.ts.map