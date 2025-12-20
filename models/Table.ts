import mongoose, { Schema, model, models, Document, Model } from "mongoose";

export interface ITable extends Document {
    name: string;
    seats: number;
    isOccupied: boolean;
    qrCodeImage: string;
    hallId: mongoose.Types.ObjectId;
    isAvailable: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const TableSchema = new Schema<ITable>(
    {
        name: { type: String, required: true, trim: true },
        seats: { type: Number, required: true, min: 1 },
        isOccupied: { type: Boolean, default: false },
        isAvailable: { type: Boolean, default: true },
        qrCodeImage: { type: String, required: true },
        hallId: { type: Schema.Types.ObjectId, ref: "Hall", required: true },
    },
    { timestamps: true }
);

if (models.Table) {
    delete models.Table;
}

const Table = (models.Table as Model<ITable>) || model<ITable>("Table", TableSchema);

export default Table;