import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { IoStar } from 'react-icons/io5';

interface Product {
    productId: string;
    productName: string;
    quantity: {
        value: number;
        unit: string;
    };
    price: number;
    isCanceled: boolean;
    cancelingReason: string;
    isCanceledByConsumer: boolean;
    isDelayed: boolean;
    delayReason: string;
    agricationMethod: string;
    freeDelivery: boolean;
    harvestingDate: Date;
    imageUrl: string;
    productDescription: string;
}

interface Card {
    _id: string;
    bankName: string;
    cardNumber: number;
    cardType: string;
    expireDate: {
        month: number,
        year: number
    }
}

interface DeliveryAddress {
    no: number;
    street: string;
    town: string;
    division: string;
    district: string;
    place: string;
    contsctNumbers: number[];
}

interface Orders {
    orderId: string;
    products: Product[];
    card: Card;
    deliveryAddress: DeliveryAddress;
    deliveryAddressId: string;
    cardId: string;
    status: string;
    isCashOnDelivery: boolean;
    isCanceledByConsumer: boolean;
    updatedAt: Date;
    createdAt: Date;
}

const ConsumerOrders = () => {
    const [userId, setUserId] = useState<string>('');
    const [orders, setOrders] = useState<Orders[]>([]);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const cookieResponse = await axios.get('/api/cookie');

                if (cookieResponse.status === 200 && cookieResponse.data.user.id) {
                    const userId = cookieResponse.data.user.id;
                    setUserId(userId);

                    const ordersResponse = await axios.post('/api/order/get-by-userId', { userId: cookieResponse.data.user.id });

                    const sortedOrders = ordersResponse.data.orders.sort(
                        (a: Orders, b: Orders) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                    );

                    setOrders(sortedOrders);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    const handleStarClick = (value: number) => {
        setRating(value);
    };

    const handleMouseEnter = (value: number) => {
        setHoverRating(value);
    };

    const handleMouseLeave = () => {
        setHoverRating(0);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setReview(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log('Rating:', rating);
        console.log('Review:', review);
    };

    return (
        <div>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <div className='my-8 flex flex-col gap-8'>
                    {orders.map(order => (
                        <div key={order.orderId} className="flex flex-col ring-1 ring-gray-300 rounded-lg p-4">
                            <h3 className='text-xl text-primaryColor'><span className='font-semibold'>Order ID: </span>{order.orderId}</h3>
                            {order.products.map(product => (
                                <div key={product.productId} className="flex gap-8 py-4 border-b-[1px] first:border-t-[1px] border-gray-300">
                                    <div className='w-44 min-w-44 h-44 rounded-md overflow-hidden'>
                                        <img
                                            src={product.imageUrl}
                                            alt={product.productName}
                                            className='w-full h-full object-cover'
                                        />
                                    </div>
                                    <div className='w-full'>
                                        <h3 className='text-2xl font-semibold'>{product.productName}</h3>
                                        <p>{product.productDescription}</p>
                                        <div className='grid grid-cols-3 w-full mt-4'>
                                            <div>
                                                <p className='text-gray-600 font-semibold text-sm'>Price (Per kg):</p>
                                                <p>{product.price} LKR</p>
                                            </div>

                                            <div>
                                                <p className='text-gray-600 font-semibold text-sm'>Ordered Quantity:</p>
                                                <p>{product.quantity.value} {product.quantity.unit}</p>
                                            </div>

                                            <div>
                                                <p className='text-gray-600 font-semibold text-sm'>Status:</p>
                                                <p
                                                    className={`${product.isCanceled ? 'bg-red-100 text-red-700' : product.isDelayed ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'} w-max py-1 px-2 rounded-full`}
                                                >
                                                    {product.isCanceled ? 'Order canceled' : product.isDelayed ? 'Order Delayed' : order.status === 'delivered' ? 'Order Delivered' : order.status === 'shipped' ? 'Order Shipped' : 'Order Still Progress'}
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            {order.status === 'delivered' && (
                                                <form onSubmit={handleSubmit} className="mt-3 flex justify-between gap-4 bg-black">
                                                    <textarea
                                                        placeholder="Write your review here..."
                                                        value={review}
                                                        onChange={handleInputChange}
                                                        className="delivered-textarea border-[1px] rounded-sm outline-primaryColor px-3 py-2 w-full"
                                                    />
                                                    <div className="flex flex-col items-start justify-between">
                                                        <div className="stars flex">
                                                            {[1, 2, 3, 4, 5].map((value) => (
                                                                <IoStar
                                                                    key={value}
                                                                    className={`cursor-pointer text-lg ${hoverRating >= value || rating >= value ? 'text-secondaryButtonColor' : 'text-orange-200'}`}
                                                                    onClick={() => handleStarClick(value)}
                                                                    onMouseEnter={() => handleMouseEnter(value)}
                                                                    onMouseLeave={handleMouseLeave}
                                                                />
                                                            ))}
                                                        </div>
                                                        <button
                                                            disabled={!review || !rating}
                                                            className="bg-primaryColor hover:bg-primaryButtonHoverColor text-white px-8 py-[6px] rounded-sm w-max transition ease-in-out duration-300 disabled:opacity-50 disabled:hover:bg-primaryColor disabled:cursor-not-allowed"
                                                            type="submit"
                                                        >
                                                            Save Review & Rating
                                                        </button>
                                                    </div>
                                                </form>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <p>Status: {order.status}</p>
                            <p>Payment Method: {order.isCashOnDelivery ? 'Cash on Delivery' : 'Card Payment'}</p>
                            <p>Delivery Address: {order.deliveryAddress.street}, {order.deliveryAddress.town}, {order.deliveryAddress.district}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ConsumerOrders