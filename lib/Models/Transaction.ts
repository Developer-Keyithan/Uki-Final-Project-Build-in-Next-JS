import { Schema, model, models } from "mongoose";

const transactionSchema = new Schema(
    {
        consumerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        orderId: { type: String, required: true, unique: true },
        products: [
            {
                productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
                sellerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
                price: { type: Number, required: true, min: 1 }
            }
        ],
        totalTransactionAmount: { type: Number, required: true, min: 1 },
        status: { type: String, default: "Pending", enum: ["Pending", "Completed", "Cancelled"] }
    },
    { timestamps: true }
);

const TransactionModel = models.Transaction || model("Transaction", transactionSchema);

export default TransactionModel;
