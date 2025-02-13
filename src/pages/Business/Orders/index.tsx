'use client'

import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

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
    isDeleyed: boolean;
}

interface Order {
    orderId: string;
    products: Product[];
    isCashOnDelivery: boolean;
    isCanceled: boolean;
    updatedAt: Date;
    createdAt: Date;
}

// Cancel Form Component
const CancelForm = ({ productId, handleCancelProduct, isCanceling, setOpenCancelFormProductId }) => {
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                const reason = e.currentTarget.querySelector('input')?.value;
                if (reason) {
                    handleCancelProduct(productId, reason);
                }
            }}
            className="flex gap-4 justify-between"
        >
            <input
                type="text"
                placeholder="What is the reason for canceling this order?"
                className="ring-1 ring-red-600 outline-primaryColor rounded px-2 w-[33rem]"
            />
            <button
                type="submit"
                disabled={isCanceling}
                onClick={() => setOpenCancelFormProductId(null)}
                className="bg-red-600 py-1 px-6 text-white hover:bg-red-700 rounded transition ease-in-out duration-300 cursor-pointer"
            >
                {isCanceling ? 'Canceling...' : 'Send the reason'}
            </button>
        </form>
    );
};

// Delay Form Component
const DelayForm = ({ productId, handleDelayRequest, isDelaying, setOpenDelayFormProductId }) => {
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                const reason = e.currentTarget.querySelector('input')?.value;
                if (reason) {
                    handleDelayRequest(productId, reason);
                }
            }}
            className="flex gap-4 justify-between"
        >
            <input
                type="text"
                placeholder="What is the reason for delaying this order?"
                className="ring-1 ring-orange-600 outline-primaryColor rounded px-2 w-[33rem]"
            />
            <button
                type="submit"
                disabled={isDelaying}
                className="bg-orange-600 py-1 px-6 text-white hover:bg-orange-700 rounded transition ease-in-out duration-300 cursor-pointer"
            >
                {isDelaying ? 'Delaying...' : 'Send the reason'}
            </button>
        </form>
    );
};

// Product Card Component
const ProductCard = ({ product, order, handleCancelProduct, handleDelayRequest, isCanceling, isDelaying, openCancelFormProductId, openDelayFormProductId, setOpenCancelFormProductId, setOpenDelayFormProductId }) => {
    const quantityInKg = convertToKilograms(product.quantity);
    const subtotal = quantityInKg * product.price;

    return (
        <div className="flex gap-8 p-4 border-b-[1px] first:border-t-[1px] border-gray-300 w-full">
            <img
                src={product.imageUrl}
                alt={`Image of ${product.productName}`}
                className="w-40 h-40 object-cover rounded-md"
            />
            <div className="flex flex-col justify-between w-full">
                <h4 className="text-2xl font-semibold">{product.productName}</h4>
                <p className="text-gray-600">{product.productDescription}</p>
                <div className="grid grid-cols-3">
                    <div>
                        <p className="text-sm text-gray-500 font-semibold">Price:</p>
                        <p>{product.price}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-semibold">Quantity:</p>
                        <p>{product.quantity.value} {product.quantity.unit}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-semibold">Status:</p>
                        <p className={`${product.isCanceled ? 'text-red-700 bg-red-100' : 'text-green-700 bg-green-100'} w-max py-1 px-2 rounded-full`}>
                            {product.isCanceled ? "Order canceled" : "Order still active"}
                        </p>
                    </div>
                </div>
                <div className="flex justify-between items-center gap-8">
                    <div className="flex gap-4 w-5/6">
                        {openCancelFormProductId === product.productId ? (
                            <CancelForm
                                productId={product.productId}
                                handleCancelProduct={handleCancelProduct}
                                isCanceling={isCanceling}
                                setOpenCancelFormProductId={setOpenCancelFormProductId}
                            />
                        ) : (
                            <button
                                onClick={() => setOpenCancelFormProductId(product.productId)}
                                disabled={!order.isCashOnDelivery || product.isCanceled}
                                className="bg-red-600 max-w-max py-1 px-6 text-white hover:bg-red-700 rounded transition ease-in-out duration-300 cursor-pointer disabled:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel this product
                            </button>
                        )}
                        {openDelayFormProductId === product.productId ? (
                            <DelayForm
                                productId={product.productId}
                                handleDelayRequest={handleDelayRequest}
                                isDelaying={isDelaying}
                                setOpenDelayFormProductId={setOpenDelayFormProductId}
                            />
                        ) : (
                            <button
                                onClick={() => setOpenDelayFormProductId(product.productId)}
                                disabled={product.isCanceled || product.isDeleyed}
                                className="bg-orange-600 max-w-max py-1 px-6 text-white hover:bg-orange-700 rounded transition ease-in-out duration-300 cursor-pointer disabled:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Request to delay
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-2 font-semibold w-1/6">
                        <p className="text-lg text-primaryColor">Sub total:</p>
                        <p>LKR {subtotal.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main Orders Component
const Orders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openCancelFormProductId, setOpenCancelFormProductId] = useState<string | null>(null);
    const [openDelayFormProductId, setOpenDelayFormProductId] = useState<string | null>(null);
    const [isCanceling, setIsCanceling] = useState(false);
    const [isDelaying, setIsDelaying] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const cookieResponse = await axios.get('/api/cookie');

                if (cookieResponse.status === 200) {
                    const businessOrders = await axios.post('/api/order/get-by-userId', {
                        userId: cookieResponse.data.user.id
                    });

                    setOrders(businessOrders.data.orders);
                }
            } catch (err) {
                toast.error('Failed to fetch orders');
                setError('Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleCancelProduct = async (productId: string, reason: string) => {
        setIsCanceling(true);
        try {
            await axios.put('/api/order', { productId, cancellingReason: reason });
            setOrders((prevOrders) =>
                prevOrders.map((order) => ({
                    ...order,
                    products: order.products.map((product) =>
                        product.productId === productId
                            ? { ...product, isCanceled: true }
                            : product
                    ),
                }))
            );
            toast.success('Product canceled successfully');
            setOpenCancelFormProductId(null);
        } catch (err) {
            toast.error('Failed to cancel product');
            setError('Failed to cancel product');
        } finally {
            setIsCanceling(false);
        }
    };

    const handleDelayRequest = async (productId: string, reason: string) => {
        setIsDelaying(true);
        try {
            await axios.put('/api/order', { productId, delayingReason: reason });
            toast.success('Delay request submitted successfully');
            setOpenDelayFormProductId(null);
        } catch (err) {
            toast.error('Failed to submit delay request');
            setError('Failed to submit delay request');
        } finally {
            setIsDelaying(false);
        }
    };

    const convertToKilograms = (quantity: { unit: string; value: number }) => {
        return quantity.unit === 'g' ? quantity.value / 1000 : quantity.value;
    };

    if (loading) {
        return <div className="text-center py-8">Loading orders...</div>;
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-600">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 bg-primaryColor text-white px-4 py-2 rounded hover:bg-primaryButtonHoverColor transition ease-in-out duration-300"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div>
            {orders.length === 0 ? (
                <p>No orders found</p>
            ) : (
                <div className="flex flex-col gap-8">
                    {orders.map((order) => {
                        const totalAmount = order.products.reduce(
                            (total, product) => total + convertToKilograms(product.quantity) * product.price,
                            0
                        );

                        return (
                            <div key={order.orderId} className="flex flex-col gap-6 ring-1 ring-gray-300 p-4 rounded-lg last:mb-8">
                                <div className="text-xl font-semibold text-primaryColor">
                                    <span>Order ID: </span>
                                    <span className="uppercase">{order.orderId}</span>
                                </div>
                                <div>
                                    {order.products.map((product) => (
                                        <ProductCard
                                            key={product.productId}
                                            product={product}
                                            order={order}
                                            handleCancelProduct={handleCancelProduct}
                                            handleDelayRequest={handleDelayRequest}
                                            isCanceling={isCanceling}
                                            isDelaying={isDelaying}
                                            openCancelFormProductId={openCancelFormProductId}
                                            openDelayFormProductId={openDelayFormProductId}
                                            setOpenCancelFormProductId={setOpenCancelFormProductId}
                                            setOpenDelayFormProductId={setOpenDelayFormProductId}
                                        />
                                    ))}
                                </div>
                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-lg text-primaryColor font-semibold">Ordered At: </p>
                                        <p>{new Date(order.createdAt).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        })}</p>
                                    </div>
                                    <div>
                                        <p className="text-lg text-primaryColor font-semibold">Last updated: </p>
                                        <p>{new Date(order.updatedAt).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        })}</p>
                                    </div>
                                    <div>
                                        <p className="text-lg text-primaryColor font-semibold">Payment method:</p>
                                        <p>{order.isCashOnDelivery ? "Cash on Delivery" : "Card Payment"}</p>
                                    </div>
                                    <div>
                                        <p className="text-lg text-primaryColor font-semibold">Total Amount:</p>
                                        <p>LKR {totalAmount.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Orders;