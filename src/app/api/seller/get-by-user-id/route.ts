import { NextRequest, NextResponse } from 'next/server';
import Seller from '../../../lib/Models/Seller';
import connectDB from '../../../lib/db';

export const POST = async (req: NextRequest) => {
    try {
        const { userId } = await req.json();
        await connectDB();

        const seller = await Seller.findOne({ userId });

        if (!seller) {
            return NextResponse.json({ message: "Seller not found" }, { status: 404 });
        }

        return NextResponse.json(seller, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "Error fetching seller", error: (error as Error).message }, { status: 500 });
    }
};