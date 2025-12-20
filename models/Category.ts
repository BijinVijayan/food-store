import mongoose, { Schema, model, models, Document, Model } from "mongoose";

export interface ICategory extends Document {
    name: string;
    image?: string;
    isAvailable: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
    {
        name: { type: String, required: true, trim: true },
        image: { type: String },
        isAvailable: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const Category = (models.Category as Model<ICategory>) || model<ICategory>("Category", CategorySchema);

export default Category;