import transactionModel from "../../lib/Models/Transaction";
import connectDB from "../../lib/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { userId, orderId, transactionId, amount, status } = body;

        if (!userId || !orderId || !amount || !status) {
            return NextResponse.json({ message: 'Invalid request' });
        }

        let paymentStatus = '';
        if (status === "succeeded") {
            paymentStatus = "Paid";
        } else {
            paymentStatus = "Pending";
        }

        await connectDB();

        const transaction = new transactionModel({
            userId,
            orderId,
            transactionId,
            amount,
            status: paymentStatus
        });

        await transaction.save();

        return NextResponse.json({ message: 'Transaction successfull' });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: 'Transaction failed' });
    }
};
