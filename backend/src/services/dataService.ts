// MongoDB-based data service
import mongoose from 'mongoose';
import Product, { IProduct } from '../models/Product';
import dotenv from 'dotenv';

dotenv.config();

export class DataService {
  private static isConnected = false;

  private static async connect(): Promise<void> {
    if (this.isConnected) return;

    try {
      const MONGODB_URI = process.env.MONGODB_URI;
      if (!MONGODB_URI) {
        throw new Error('MONGODB_URI environment variable is not set');
      }

      // Add database name if not present in URI
      const dbURI = MONGODB_URI.includes('/vismatch') ? MONGODB_URI : MONGODB_URI.replace('mongodb.net/', 'mongodb.net/vismatch');
      
      await mongoose.connect(dbURI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      
      this.isConnected = true;
      console.log('✅ Connected to MongoDB Atlas successfully');
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      throw error;
    }
  }

  static async find(filter: any = {}): Promise<IProduct[]> {
    await this.connect();
    return await Product.find(filter);
  }

  static async countDocuments(): Promise<number> {
    await this.connect();
    return await Product.countDocuments();
  }

  static async distinct(field: string): Promise<string[]> {
    await this.connect();
    return await Product.distinct(field);
  }

  static async findById(id: string): Promise<IProduct | null> {
    await this.connect();
    return await Product.findById(id);
  }

  static async getAllProducts(): Promise<IProduct[]> {
    await this.connect();
    return await Product.find();
  }
}

export default DataService;