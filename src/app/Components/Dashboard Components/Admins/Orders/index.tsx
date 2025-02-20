import axios from 'axios'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify';


interface Product {
    _id: string;
    productId: {
        productImage: string
        productName: string
    }
    imageUrl: string;
    productDescription: string;
    price: number;
    quantity: {
        unit: string;
        value: number;
    };
    isCanceled: boolean;
    isDelayed: boolean;
    delayingReason: string;
    cancellingReason: string;
}

interface Order {
    _id: string;
    products: Product[];
    isCashOnDelivery: boolean;
    isCanceled: boolean;
    updatedAt: Date;
    createdAt: Date;
}
function Orders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAllOrders = async () => {
            try {
                const orders = await axios.get('/api/order')
                setOrders(orders.data.orders)
            } catch (error) {
                console.log(error)
                toast.error('Failed to fetch orders');
                setError('Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        }

        fetchAllOrders()
    }, [])

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

    const convertToKilograms = (quantity: { unit: string; value: number }) => {
        return quantity.unit === 'g' ? quantity.value / 1000 : quantity.value;
    };

    if (loading) {
        return (
            <div className='animate-pulse rounded-md ring-1 ring-gray-300 p-4 my-8'>
                <div className='w-96 h-8 bg-gray-200 rounded-md mb-4'></div>
                <div className='flex flex-col'>
                    <div className='flex gap-8 border-y-[1px] border-gray-300 py-4'>
                        <div className="w-52 h-44 bg-gray-200 rounded-md"></div>
                        <div className="w-full h-44 flex flex-col justify-between">
                            <div className="w-96 h-8 bg-gray-200 rounded-md"></div>
                            <div className="w-full bg-gray-200 h-6 rounded-md"></div>
                            <div className="grid grid-cols-4 gap-4">
                                <div className="flex flex-col gap-1">
                                    <div className="h-4 w-40 bg-gray-200 rounded-md"></div>
                                    <div className="h-6 w-full bg-gray-200 rounded-md"></div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="h-4 w-40 bg-gray-200 rounded-md"></div>
                                    <div className="h-6 w-full bg-gray-200 rounded-md"></div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="h-4 w-40 bg-gray-200 rounded-md"></div>
                                    <div className="h-6 w-full bg-gray-200 rounded-md"></div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="h-4 w-40 bg-gray-200 rounded-md"></div>
                                    <div className="h-6 w-full bg-gray-200 rounded-md"></div>
                                </div>
                            </div>
                            <div className='flex gap-4'>
                                <div className="h-9 w-full bg-gray-200 rounded-md"></div>
                                <div className="h-9 w-60 bg-gray-200 rounded-md"></div>
                            </div>
                        </div>
                    </div>
                    <div className='flex gap-8 border-b-[1px] border-gray-300 py-4'>
                        <div className="w-52 h-44 bg-gray-200 rounded-md"></div>
                        <div className="w-full h-44 flex flex-col justify-between">
                            <div className="w-96 h-8 bg-gray-200 rounded-md"></div>
                            <div className="w-full bg-gray-200 h-6 rounded-md"></div>
                            <div className="grid grid-cols-4 gap-4">
                                <div className="flex flex-col gap-1">
                                    <div className="h-4 w-40 bg-gray-200 rounded-md"></div>
                                    <div className="h-6 w-full bg-gray-200 rounded-md"></div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="h-4 w-40 bg-gray-200 rounded-md"></div>
                                    <div className="h-6 w-full bg-gray-200 rounded-md"></div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="h-4 w-40 bg-gray-200 rounded-md"></div>
                                    <div className="h-6 w-full bg-gray-200 rounded-md"></div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="h-4 w-40 bg-gray-200 rounded-md"></div>
                                    <div className="h-6 w-full bg-gray-200 rounded-md"></div>
                                </div>
                            </div>
                            <div className='flex gap-4'>
                                <div className="h-9 w-full bg-gray-200 rounded-md"></div>
                                <div className="h-9 w-60 bg-gray-200 rounded-md"></div>
                            </div>
                        </div>
                    </div>
                    <div className='flex gap-8 border-b-[1px] border-gray-300 py-4'>
                        <div className="w-52 h-44 bg-gray-200 rounded-md"></div>
                        <div className="w-full h-44 flex flex-col justify-between">
                            <div className="w-96 h-8 bg-gray-200 rounded-md"></div>
                            <div className="w-full bg-gray-200 h-6 rounded-md"></div>
                            <div className="grid grid-cols-4 gap-4">
                                <div className="flex flex-col gap-1">
                                    <div className="h-4 w-40 bg-gray-200 rounded-md"></div>
                                    <div className="h-6 w-full bg-gray-200 rounded-md"></div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="h-4 w-40 bg-gray-200 rounded-md"></div>
                                    <div className="h-6 w-full bg-gray-200 rounded-md"></div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="h-4 w-40 bg-gray-200 rounded-md"></div>
                                    <div className="h-6 w-full bg-gray-200 rounded-md"></div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="h-4 w-40 bg-gray-200 rounded-md"></div>
                                    <div className="h-6 w-full bg-gray-200 rounded-md"></div>
                                </div>
                            </div>
                            <div className='flex gap-4'>
                                <div className="h-9 w-full bg-gray-200 rounded-md"></div>
                                <div className="h-9 w-60 bg-gray-200 rounded-md"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='grid grid-cols-3 gap-4 mt-4'>
                    <div className="flex flex-col gap-1">
                        <div className="h-4 w-40 bg-gray-200 rounded-md"></div>
                        <div className="h-8 w-52 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="h-4 w-40 bg-gray-200 rounded-md"></div>
                        <div className="h-6 w-full bg-gray-200 rounded-md"></div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="h-4 w-40 bg-gray-200 rounded-md"></div>
                        <div className="h-6 w-full bg-gray-200 rounded-md"></div>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className='my-8'>
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
                            <div key={order._id} className="flex flex-col gap-6 ring-1 ring-gray-300 p-4 rounded-lg">
                                <div className="text-xl font-semibold text-primaryColor">
                                    <span>Order ID: </span>
                                    <span className="uppercase">{order._id}</span>
                                </div>
                                <div>
                                    {order.products.map((product) => {
                                        const quantityInKg = convertToKilograms(product.quantity);
                                        const subtotal = quantityInKg * product.price;

                                        return (
                                            <div key={product._id} className="flex gap-8 p-4 border-b-[1px] first:border-t-[1px] border-gray-300 w-full items-center">
                                                <img
                                                    src={product.productId.productImage}
                                                    alt={`Image of ${product.productId.productName}`}
                                                    className="w-40 h-40 object-cover rounded-md flex-none"
                                                />
                                                <div className="flex flex-col justify-between w-full">
                                                    <h4 className="text-2xl font-semibold">{product.productId.productName}</h4>
                                                    <p className="text-gray-600">{product.productDescription}</p>
                                                    <div className="grid grid-cols-3">
                                                        <div>
                                                            <p className="text-sm text-gray-500 font-semibold">Price (per kg):</p>
                                                            <p>{product.price}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500 font-semibold">Quantity:</p>
                                                            <p>{product.quantity.value} {product.quantity.unit}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500 font-semibold">Status:</p>
                                                            <p className={`${product.isCanceled ? 'text-red-700 bg-red-100' : product.isDelayed ? 'text-orange-700 bg-orange-100' : 'text-green-700 bg-green-100'} w-max py-1 px-2 rounded-full`}>
                                                                {product.isCanceled ? "Order canceled" : product.isDelayed ? "Order delayed" : "Order still active"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between items-center gap-8">
                                                        <div className="flex gap-4 w-5/6">
                                                            {product.isCanceled}
                                                        </div>
                                                        <div className="flex items-center gap-2 font-semibold w-1/6">
                                                            <p className="text-lg text-primaryColor">Sub total:</p>
                                                            <p>LKR {subtotal.toFixed(2)}</p>
                                                        </div>
                                                    </div>
                                                    <div className='grid grid-cols-3'>
                                                        <div>
                                                            <p className="text-sm text-orange-500 font-semibold overflow-x-auto no-scrollbar">Delaying Reason</p>
                                                            <p>
                                                                {product.isCanceled && product.isDelayed
                                                                    ? product.delayingReason
                                                                    : product.isDelayed
                                                                        ? product.delayingReason || '<No reason provided.>'
                                                                        : product.isCanceled && !product.isDelayed
                                                                            ? '<This product is directly canceled.>'
                                                                            : !product.isDelayed
                                                                                ? '<This product is not delayed.>*'
                                                                                : null
                                                                }
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-red-500 font-semibold overflow-x-auto no-scrollbar">Cancelling Reason</p>
                                                            <p>
                                                                {product.isCanceled
                                                                    ? product.cancellingReason || '<No reason provided.>'
                                                                    : '<This product is not cancelled.>*'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
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
    )
}

export default Orders
