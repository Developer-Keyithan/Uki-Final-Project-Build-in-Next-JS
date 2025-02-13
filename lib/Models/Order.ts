import { Schema, model, models } from "mongoose";

const orderSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        products: [{
            productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: {
                value: { type: Number, required: true, min: 0 },
                unit: { type: String, required: true, enum: ["kg", "gram"] }
            },
            price: { type: Number, required: true, min: 0 },
            isCanceled: { type: Boolean, required: true },
            isCanceledByConsumer: { type: Boolean, required: false },
            isDelayed: { type: Boolean, required: true },
            cancellingReason: { type: String, required: false },
            delayingReason: { type: String, required: false }
        }],
        deliveryAddressId: { type: Schema.Types.ObjectId, ref: "Address", required: true },
        cardId: { type: String, required: false },
        couponDiscount: { type: Number, required: false, default: 0, min: 0 },
        promoCodeDiscount: { type: Number, required: false, default: 0, min: 0 },
        totalPrice: { type: Number, required: true, min: 0 },
        status: { type: String, required: true, enum: ["placed", "shipped", "delivered", "cancelled"] },
        isCashOnDelivery: { type: Boolean, required: true }
    },
    { timestamps: true }
);

const orderModel = models.Order || model("Order", orderSchema);

export default orderModel;
