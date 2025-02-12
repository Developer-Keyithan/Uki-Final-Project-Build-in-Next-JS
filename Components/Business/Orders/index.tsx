'use client'

import axios from "axios";
import { useEffect, useState } from "react";

interface Product {
    productId: string;
    imageUrl: string;
    productName: string;
    productDescription: string;
    price: number;
    quantity: {
        unit: string;
        value: number;
    };
    isCanceled: boolean;
}

interface Order {
    orderId: string;
    products: Product[];
    isCashOnDelivery: boolean;
    updatedAt: Date;
}

const Orders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const cookieResponse = await axios.get('/api/cookie');
                console.log(cookieResponse);

                if (cookieResponse.status === 200) {
                    const businessOrders = await axios.post('/api/order/get-by-userId', {
                        userId: cookieResponse.data.user.id
                    });

                    setOrders(businessOrders.data.orders);
                }
            } catch (err) {
                setError('Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    console.log(orders);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            {orders.length === 0 ? (
                <p>No orders found</p>
            ) : (
                <ul>
                    {orders.map((order) => (
                        <div key={order.orderId}>
                            <h3>Order ID: {order.orderId}</h3>
                            <p>Last Updated: {new Date(order.updatedAt).toLocaleDateString()}</p>
                            <p>Payment Method: {order.isCashOnDelivery ? "Cash on Delivery" : "Card Payment"}</p>
                            <div>
                                {order.products.map((product) => (
                                    <div key={product.productId}>
                                        <img src={product.imageUrl} alt={product.productName} />
                                        <h4>{product.productName}</h4>
                                        <p>{product.productDescription}</p>
                                        <p>Price: {product.price}</p>
                                        <p>Quantity: {product.quantity.value} {product.quantity.unit}</p>
                                        <p>Status: {product.isCanceled ? "Canceled" : "Active"}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Orders;