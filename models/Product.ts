import mongoose, { Schema, model, models, Document, Model } from "mongoose";

export interface IProduct extends Document {
    name: string;
    description?: string;
    mrp: number;
    sellingPrice: number;
    images: string[];
    categoryId: mongoose.Types.ObjectId;
    subCategoryId?: mongoose.Types.ObjectId;
    isVeg: boolean;
    stockQuantity: number;
    inStock: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String },
        mrp: { type: Number, required: true },
        sellingPrice: { type: Number, required: true },
        images: [{ type: String }],

        categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
        subCategoryId: { type: Schema.Types.ObjectId, ref: "SubCategory" },

        isVeg: { type: Boolean, default: true },
        stockQuantity: { type: Number, default: 0 },
        inStock: { type: Boolean, default: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// This forces Mongoose to re-compile the model if it already exists,
// ensuring new fields are picked up during development.
if (models.Product) {
    delete models.Product;
}

const Product = model<IProduct>("Product", ProductSchema);

export default Product;