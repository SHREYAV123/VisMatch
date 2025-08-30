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

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  category: { type: String, required: true, index: true },
  price: { type: Number, required: true, index: true },
  brand: { type: String, required: true, index: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  imageFeatures: [{ type: Number }], // Flattened feature vector
  tags: [{ type: String }],
}, {
  timestamps: true
});

// Compound indexes for better query performance
productSchema.index({ category: 1, price: 1 });
productSchema.index({ brand: 1, category: 1 });
productSchema.index({ tags: 1 });

export const Product = mongoose.model<IProduct>('Product', productSchema);
export default Product;