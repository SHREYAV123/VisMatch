"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, index: true },
    category: { type: String, required: true, index: true },
    price: { type: Number, required: true, index: true },
    brand: { type: String, required: true, index: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    imageFeatures: [{ type: Number }],
    tags: [{ type: String }],
}, {
    timestamps: true
});
productSchema.index({ category: 1, price: 1 });
productSchema.index({ brand: 1, category: 1 });
productSchema.index({ tags: 1 });
exports.Product = mongoose_1.default.model('Product', productSchema);
exports.default = exports.Product;
//# sourceMappingURL=Product.js.map