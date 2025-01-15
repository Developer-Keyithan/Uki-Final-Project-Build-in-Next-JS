import { Schema, model, models } from 'mongoose';

const bankCardSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        bankName: { type: String, required: true },
        branch: { type: String, required: true },
        cardNumber: { type: Number, required: true },
        cvv: { type: Number, required: true },
        expireDate: {
            date: { type: Number, required: true },
            month: { type: Number, required: true },
        },
        cardType: { type: String, required: true, enum: ['visa', 'master'] },
    },
    { timestamps: true }
);

const bankCardModel = models.BankCard || model('BankCard', bankCardSchema);

export default bankCardModel;