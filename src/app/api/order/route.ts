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
            price: product.pricePerKg
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
        const { orderId, status } = body;

        if (!orderId) return NextResponse.json({ message: "Order id is required" }, { status: 400 });

        await DBconnect();
        const order = await Order.findById(orderId);

        if (!order) return NextResponse.json({ message: "Order not found" }, { status: 404 });

        order.status = status;
        await order.save();

        if (status === "shipped") {
            return NextResponse.json({ message: "Order shipped", order }, { status: 200 });
        }

        if (status === "delivered") {
            return NextResponse.json({ message: "Order delivered", order }, { status: 200 });
        }

        if (status === "cancelled") {
            return NextResponse.json({ message: "Order cancelled", order }, { status: 200 });
        }

        if (status === "placed") {
            return NextResponse.json({ message: "Ordered again", order }, { status: 200 });
        }

    } catch (error: any) {
        return NextResponse.json({ message: "Failed to update order ", error: error.message }, { status: 500 });
    }
};