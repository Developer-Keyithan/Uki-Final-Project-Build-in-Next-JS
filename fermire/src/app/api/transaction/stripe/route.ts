import { NextResponse } from "next/server";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

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