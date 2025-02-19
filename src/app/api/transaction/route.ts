import { NextApiRequest, NextApiResponse } from "next";
import transactionModel from "../../../../lib/Models/Transaction";
import connectDB from "../../../../lib/db";
import { NextResponse } from "next/server";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

// export const POST = async (req: NextApiRequest) => {
//     try {
//         const body = await req.body;
//         const { consumerId, orderId, productId, sellerId, price, totalTransactionAmount, status } = body;

//         await connectDB();

//         const transaction = new transactionModel({
//             consumerId,
//             orderId,
//             products: [{ productId, sellerId, price }],
//             totalTransactionAmount,
//             status
//         });

//         await transaction.save();


//         return NextResponse.json({ message: 'Transaction successfull' });
//     } catch (error) {
//         return NextResponse.json({ message: 'Transaction failed' });
//     }
// };

export const POST = async (req: NextResponse) => {
    try {
        const { amount } = await req.json();

        const payment = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            automatic_payment_methods: { enabled: true }
        });

        return NextResponse.json({ clientSecret: payment.client_secret })
    } catch (error) {
        console.error('Internal Error:', error)
        return NextResponse.json(
            { error: `Internal Server Error: ${error}` },
            { status: 500 }
        );
    }
}