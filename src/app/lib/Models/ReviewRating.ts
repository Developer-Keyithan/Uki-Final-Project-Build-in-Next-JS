import { Schema, model, models } from "mongoose";

const reviewAndRaingSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", require: true },
        productId: { type: Schema.Types.ObjectId, ref: "Product", require: true },
        review: { type: String, required: false },
        rating: { type: Number, required: false, min: 1, max: 5}
    },
    { timestamps: true }
);

const reviewAndRatingModel = models.ReviewAndRating || model("ReviewAndRating", reviewAndRaingSchema);

export default reviewAndRatingModel;