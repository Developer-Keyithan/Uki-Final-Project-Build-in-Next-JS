import { NextRequest, NextResponse } from "next/server";
import Order from "../../../lib/Models/Order";
import Product from "../../../lib/Models/Product";
import User from "../../../lib/Models/User";
import DBconnect from "../../../lib/db";
import DeliveryAddress from "../../../lib/Models/DeliveryAddress";

interface ProductInfo {
    productId: string;
    imageUrl: string;
    productName: string;
    productDescription: string;
    agricationMethod: string;
    categories: string[];
    harvestingDate: string;
    freeDelivery: boolean;
    quantity: number;
    price: number;
    isCanceled: boolean;
    isDelayed: boolean;
    cancellingReason: string;
    deleyingReasong: string;
    isReviewAndRatingHere: boolean;
}

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { userId } = body;

        if (!userId) {
            return NextResponse.json({ message: "User id is required" }, { status: 400 });
        }

        await DBconnect();

        // Find the user by userId
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // If the user is a consumer, fetch their orders directly
        if (user.userType === 'consumer') {
            const orders = await Order.find({ userId });

            if (!orders || orders.length === 0) {
                return NextResponse.json({ message: "No orders found for this user" }, { status: 404 });
            }

            const productIds = orders.flatMap(order => order.products.map((product: ProductInfo) => product.productId.toString()));
            const productDetails = await Product.find({ _id: { $in: productIds } });

            const productInfoMap = productDetails.reduce((acc, product) => {
                acc[product._id.toString()] = {
                    imageUrl: product.productImages?.[0]?.imageUrl || null,
                    productName: product.productName || "Unknown",
                    productDescription: product.productDescription || "No description available",
                    agricationMethod: product.agricationMethod || "Not specified",
                    categories: product.categories,
                    harvestingDate: product.harvestingDate,
                    freeDelivery: product.freeDelivery
                };
                return acc;
            }, {});

            const mergedOrderDetails = await Promise.all(orders.map(async (order) => {
                const address = await DeliveryAddress.findById(order.deliveryAddressId);
            
                return {
                    orderId: order._id,
                    createdAt: order.createdAt,
                    updatedAt: order.updatedAt,
                    deliveryAddress: address ? address : null,
                    products: order.products.map((product: ProductInfo) => ({
                        productId: product.productId,
                        quantity: product.quantity,
                        price: product.price,
                        isCanceled: product.isCanceled,
                        isDelayed: product.isDelayed,
                        cancellingReason: product.cancellingReason,
                        deleyingReasong: product.deleyingReasong,
                        isReviewAndRatingHere: product.isReviewAndRatingHere,
                        ...productInfoMap[product.productId.toString()],
                    })),
                    isCashOnDelivery: order.isCashOnDelivery,
                    isCanceled: order.isCanceled,
                    status: order.status
                };
            }));

            return NextResponse.json({ orders: mergedOrderDetails }, { status: 200 });
        }

        if (user.userType === 'seller') {
            const products = await Product.find({ userId: userId });

            if (!products || products.length === 0) {
                return NextResponse.json({ message: "No products found for this seller" }, { status: 404 });
            }

            const productIds = products.map(product => product._id.toString());

            const orders = await Order.find({ "products.productId": { $in: productIds } }).sort({ createdAt: -1 });

            if (!orders || orders.length === 0) {
                return NextResponse.json({ message: "No orders found for this seller's products" }, { status: 404 });
            }

            const filteredOrders = orders.map(order => {
                const filteredProducts = order.products.filter((product: ProductInfo) =>
                    productIds.includes(product.productId.toString())
                );

                return {
                    ...order.toObject(),
                    products: filteredProducts,
                };
            });

            const productDetails = await Product.find({ _id: { $in: productIds } });

            const productInfoMap = productDetails.reduce((acc, product) => {
                acc[product._id.toString()] = {
                    imageUrl: product.productImages?.[0]?.imageUrl || null,
                    productName: product.productName || "Unknown",
                    productDescription: product.productDescription || "No description available",
                    agricationMethod: product.agricationMethod || "Not specified",
                };
                return acc;
            }, {});

            const filteredOrderDetails = filteredOrders.map(order => ({
                orderId: order._id,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
                products: order.products.map((product: ProductInfo) => ({
                    productId: product.productId,
                    quantity: product.quantity,
                    price: product.price,
                    isCanceled: product.isCanceled,
                    isDelayed: product.isDelayed,
                    cancellingReason: product.cancellingReason,
                    deleyingReasong: product.deleyingReasong,
                    ...productInfoMap[product.productId.toString()],
                })),
                isCashOnDelivery: order.isCashOnDelivery,
                isCanceled: order.isCanceled,
            }));

            return NextResponse.json({ orders: filteredOrderDetails }, { status: 200 });
        }

        // If the user type is invalid
        return NextResponse.json({ message: "Invalid user type" }, { status: 400 });

    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch orders", error: (error as Error).message }, { status: 500 });
    }
};