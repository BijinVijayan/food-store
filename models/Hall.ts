import mongoose, { Schema, model, models, Document, Model } from "mongoose";

export interface IHall extends Document {
    name: string;
    image?: string;
    isActive: boolean;
    storeId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const HallSchema = new Schema<IHall>(
    {
        name: { type: String, required: true, trim: true },
        image: { type: String },
        isActive: { type: Boolean, default: true },
        storeId: { type: Schema.Types.ObjectId, ref: "Store", required: true },
    },
    { timestamps: true }
);

if (models.Hall) {
    delete models.Hall;
}

const Hall = (models.Hall as Model<IHall>) || model<IHall>("Hall", HallSchema);

export default Hall;