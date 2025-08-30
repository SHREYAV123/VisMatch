import mongoose from 'mongoose';
export interface IProduct extends mongoose.Document {
    name: string;
    category: string;
    price: number;
    brand: string;
    description: string;
    imageUrl: string;
    imageFeatures: number[];
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}
export declare const Product: mongoose.Model<IProduct, {}, {}, {}, mongoose.Document<unknown, {}, IProduct, {}, {}> & IProduct & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Product;
//# sourceMappingURL=Product.d.ts.map