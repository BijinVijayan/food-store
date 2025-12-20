import mongoose, { Schema, model, models, Document, Model } from "mongoose";

export interface IUser extends Document {
    name?: string;
    email: string;
    otp?: string;
    otpExpires?: Date;
    role: "admin" | "store_owner";
    storeId?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        otp: {
            type: String,
            select: false,
        },
        otpExpires: {
            type: Date,
            select: false,
        },
        role: {
            type: String,
            enum: ["admin", "store_owner"],
            default: "store_owner",
        },
        storeId: {
            type: Schema.Types.ObjectId,
            ref: "Store",
        },
    },
    { timestamps: true }
);

const User = (models.User as Model<IUser>) || model<IUser>("User", UserSchema);

export default User;