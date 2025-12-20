import mongoose, { Schema, model, models, Document, Model } from "mongoose";

export interface IStore extends Document {
    name: string;
    slug: string;
    ownerId: mongoose.Types.ObjectId;
    currency: string;
    logo?: string;
    coverImage?: string;
    location?: string;
    description?: string;
    address?: string;
    phone?: string;
    email?: string;
    acceptingOrders: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const StoreSchema = new Schema<IStore>(
    {
        name: {
            type: String,
            required: [true, "Store name is required"],
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        currency: {
            type: String,
            default: "AED",
        },
        logo: { type: String },
        coverImage: { type: String },
        location: { type: String },
        description: { type: String },

        address: { type: String },
        phone: { type: String },
        email: { type: String },

        acceptingOrders: { type: Boolean, default: true },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);
// for development
if (process.env.NODE_ENV !== "production") {
    delete models.Store;
}

const Store = (models.Store as Model<IStore>) || model<IStore>("Store", StoreSchema);

export default Store;