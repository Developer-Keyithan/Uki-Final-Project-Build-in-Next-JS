import { Schema, model, models } from "mongoose";

const productSchema = new Schema(
    {   
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true},
        productImages: [{
            imageUrl: { type: String, required: true },
        }],
        productName: { type: String, required: true },
        productDescription: { type: String, required: true },
        price: {
            newPrice: { type: Number, required: true, min: 1 },
            oldPrice: { type: Number, required: false, min: 1 }
        },
        categories: { type: [String], required: true},
        harvestingDate: { type: Date, required: true },
        agricationMethod: { type: String, required: true },
        freeDelivery: { type: Boolean, required: true }
    },
    { timestamps: true }
);

const productModel = models.Product || model("Product", productSchema);

export default productModel;
