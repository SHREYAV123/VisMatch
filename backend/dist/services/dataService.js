"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Product_1 = __importDefault(require("../models/Product"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class DataService {
    static async connect() {
        if (this.isConnected)
            return;
        try {
            const MONGODB_URI = process.env.MONGODB_URI;
            if (!MONGODB_URI) {
                throw new Error('MONGODB_URI environment variable is not set');
            }
            const dbURI = MONGODB_URI.includes('/vismatch') ? MONGODB_URI : MONGODB_URI.replace('mongodb.net/', 'mongodb.net/vismatch');
            await mongoose_1.default.connect(dbURI, {
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            });
            this.isConnected = true;
            console.log('✅ Connected to MongoDB Atlas successfully');
        }
        catch (error) {
            console.error('❌ MongoDB connection error:', error);
            throw error;
        }
    }
    static async find(filter = {}) {
        await this.connect();
        return await Product_1.default.find(filter);
    }
    static async countDocuments() {
        await this.connect();
        return await Product_1.default.countDocuments();
    }
    static async distinct(field) {
        await this.connect();
        return await Product_1.default.distinct(field);
    }
    static async findById(id) {
        await this.connect();
        return await Product_1.default.findById(id);
    }
    static async getAllProducts() {
        await this.connect();
        return await Product_1.default.find();
    }
}
exports.DataService = DataService;
DataService.isConnected = false;
exports.default = DataService;
//# sourceMappingURL=dataService.js.map