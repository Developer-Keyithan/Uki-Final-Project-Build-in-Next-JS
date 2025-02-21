import { Schema, model, models } from "mongoose";

const transactionSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true, unique: true },
        transactionId: { type: String, required: true, unique: true },
        amount: { type: Number, required: true, min: 1 },
        status: { type: String, enum: ["Pending", "Paid", "Cancelled"] }
    },
    { timestamps: true }
);

const transactionModel = models.Transaction || model("Transaction", transactionSchema);

export default transactionModel;
