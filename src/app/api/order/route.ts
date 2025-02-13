import { NextRequest, NextResponse } from "next/server";
import Order from "../../../../lib/Models/Order";
import DBconnect from "../../../../lib/db";
import Cart from "../../../../lib/Models/Cart";

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();

        const {
            userId,
            products,
            deliveryAddressId,
            cardId,
            totalPrice,
            status,
            isCashOnDelivery
        } = body;

        let couponDiscount = 0;
        let promoCodeDiscount = 0;

        if (body.couponDiscount) {
            couponDiscount = body.couponDiscount;
        }

        if (body.promoCodeDiscount) {
            promoCodeDiscount = body.promoCodeDiscount;
        }

        if (!userId) return NextResponse.json({ message: "User id is required" }, { status: 400 });
        if (!products || !Array.isArray(products)) return NextResponse.json({ message: "At least one product is required" }, { status: 400 });
        if (!deliveryAddressId) return NextResponse.json({ message: "Delivery address is required" }, { status: 400 });
        if (!totalPrice) return NextResponse.json({ message: "Total price is required" }, { status: 400 });
        if (isCashOnDelivery === false && !cardId) return NextResponse.json({ message: "Select a card or click cash on delivery" }, { status: 400 });

        const transformedProducts = products.map(product => ({
            productId: product.productId,
            quantity: {
                value: product.finalQuantity,
                unit: product.unit
            },
            price: product.pricePerKg,
            isCanceled: false,
            isDeleyed: false
        }));

        await DBconnect();

        const newOrder = new Order({
            userId,
            products: transformedProducts,
            deliveryAddressId,
            cardId: isCashOnDelivery ? null : cardId,
            couponDiscount,
            promoCodeDiscount,
            totalPrice,
            status,
            isCashOnDelivery
        });

        await newOrder.save();

        const orderedCartIds = products.map(product => product.id);

        await Cart.deleteMany({ _id: { $in: orderedCartIds } });

        return NextResponse.json({ message: "Order placed successfully", newOrder }, { status: 200 });
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ message: "Failed to create order", error: error.message }, { status: 500 });
    }
};

export const PUT = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { orderId, status, productId, isCanceled, isDelayed, cancellingReason, delayingReason } = body;

        // Validate required fields
        if (!orderId) return NextResponse.json({ message: "Order ID is required" }, { status: 400 });
        if (productId && typeof productId !== "string") return NextResponse.json({ message: "Product ID must be a string" }, { status: 400 });

        await DBconnect();
        const order = await Order.findById(orderId);

        if (!order) return NextResponse.json({ message: "Order not found" }, { status: 404 });

        if (status) order.status = status;

        if (productId) {
            const product = order.products.find((p: any) => p.productId.toString() === productId.toString());

            console.log("Found product:", product);

            if (!product) return NextResponse.json({ message: "Product not found in the order" }, { status: 404 });
            if (isCanceled) product.isCanceled = isCanceled;
            if (isDelayed) product.isDelayed = isDelayed;
            console.log('Is Delayed',isDelayed)
            if (cancellingReason) product.cancellingReason = cancellingReason;
            if (delayingReason) product.delayingReason = delayingReason;
        }
        console.log('Updated Product:', order.products)
        await order.save();

        const messages: Record<string, string> = {
            "canceled": "Order canceled",
            "shipped": "Order shipped",
            "delivered": "Order delivered",
            "placed": "Order placed"
        };

        return NextResponse.json({ message: messages[status] || "Order updated", order }, { status: 200 });
    } catch (error: any) {
        console.log("Error updating order:", error);
        return NextResponse.json({ message: "Failed to update order", error: error.message }, { status: 500 });
    }
};