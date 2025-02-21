import userModel from "@/app/lib/Models/User";
import transactionModel from "@/app/lib/Models/Transaction";
import connectDB from "@/app/lib/db";
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

export const GET = async () => {
    try {
        await connectDB();

        const transactions = await transactionModel.find();
        console.log(transactions);

        const mergedTransactions = (await Promise.all(
            transactions.map(async (transaction) => {
                const user = await userModel.findById(transaction.userId);
                
                return {
                    ...transaction.toObject(),
                    user: {
                        firstName: user?.firstName,
                        lastName: user?.lastName,
                        email: user?.email
                    }
                };
            })
        )).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return NextResponse.json({ transactions: mergedTransactions });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Failed to fetch transactions.' });
    }
};
