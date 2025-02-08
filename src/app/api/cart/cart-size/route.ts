import { NextRequest, NextResponse } from "next/server";
import Cart from "../../../../../lib/Models/Cart";
import Product from "../../../../../lib/Models/Product";
import connectDb from "../../../../../lib/db";

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { userId } = body;

        if (!userId) {
            return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }

        await connectDb();

        const cart = await Cart.find({ userId })
    
        return NextResponse.json({length: cart.length}, { status: 200 });
    } catch (error: any) {
        console.error(error.message);
        return NextResponse.json({ message: "Failed to fetch cart", error: error.message }, { status: 500 });
    }
};
