import mongoose, { Schema, model, models, Document, Model } from "mongoose";

export interface ISubCategory extends Document {
    name: string;
    image?: string;
    categoryId: mongoose.Types.ObjectId;
    isAvailable: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const SubCategorySchema = new Schema<ISubCategory>(
    {
        name: { type: String, required: true, trim: true },
        image: { type: String },
        categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
        isAvailable: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const SubCategory = (models.SubCategory as Model<ISubCategory>) || model<ISubCategory>("SubCategory", SubCategorySchema);

export default SubCategory;