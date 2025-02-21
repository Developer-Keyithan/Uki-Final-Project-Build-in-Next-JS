import { NextRequest, NextResponse } from "next/server";
import Cart from "../../../lib/Models/Cart";
import Product from "../../../lib/Models/Product";
import connectDb from "../../../lib/db";

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { userId } = body;

        if (!userId) {
            return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }

        await connectDb();

        // Fetch cart items and populate product details
        const cart = await Cart.find({ userId }).lean();
        
        // Fetch product details for each cart item
        const productIds = cart.map(item => item.productId);
        // const products = await Product.find({ _id: { $in: productIds } }).lean();
        const products: { _id: string, productName: string, productImages: { imageUrl: string }[], productDescription: string, agricationMethod: string, price: number }[] = await Product.find({ _id: { $in: productIds } }).lean().select('_id productName productImages productDescription agricationMethod price');

        // Merge cart items with product details
        const mergedCart = cart.map(cartItem => {
            const product = products.find(p => p._id.toString() === cartItem.productId.toString());
            return {
                ...cartItem,
                productName: product?.productName || "Unknown Product",
                productImage: product?.productImages[0].imageUrl || "",
                productDescription: product?.productDescription || "No description available",
                agricationMethod: product?.agricationMethod,
                price: product?.price || 0
            };
        });

        return NextResponse.json(mergedCart, { status: 200 });
    } catch (error) {
        console.error((error as Error).message);
        return NextResponse.json({ message: "Failed to fetch cart", error: (error as Error).message }, { status: 500 });
    }
};
