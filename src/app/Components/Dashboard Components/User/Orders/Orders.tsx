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
    isReviewAndRatingHere: string;
}

interface Card {
    _id: string;
    bankName: string;
    cardNumber: number;
    cardType: string;
    expireDate: {
        month: number;
        year: number;
    };
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
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true)
            try {
                const cookieResponse = await axios.get('/api/cookie');

                if (cookieResponse.status === 200 && cookieResponse.data.user.id) {
                    const userId = cookieResponse.data.user.id;
                    setUserId(userId);

                    const ordersResponse = await axios.post('/api/order/get-by-userId', {
                        userId: cookieResponse.data.user.id,
                    });

                    const sortedOrders = ordersResponse.data.orders.sort(
                        (a: Orders, b: Orders) =>
                            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                    );

                    setOrders(sortedOrders);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setIsLoading(false)
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

    const handleSubmit = async (event: React.FormEvent, orderId: string) => {
        event.preventDefault();

        try {
            const order = orders.find(order => order.orderId === orderId);
            if (!order) return;

            const requests = order.products.map(product =>
                axios.post('/api/ratingReviews', {
                    userId,
                    productId: product.productId,
                    review,
                    rating
                })
            );

            await Promise.all(requests);
            console.log(requests)
            alert('Review and rating submitted successfully for all products in the order.');
        } catch (error) {
            console.error('Error submitting review and rating:', error);
            alert('Failed to submit review and rating.');
        }
    };

    if (isLoading) {
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
        <div>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <div className='my-8 flex flex-col gap-8'>
                    {orders.map(order => {
                        const formattedAddress = [
                            order.deliveryAddress.no ? order.deliveryAddress.no.toString() : '',
                            order.deliveryAddress.street,
                            order.deliveryAddress.town,
                            order.deliveryAddress.division,
                            order.deliveryAddress.district
                        ].filter(Boolean).join(', ');

                        return (
                            <div key={order.orderId} className="flex flex-col ring-1 ring-gray-300 rounded-lg p-4">
                                <h3 className='text-xl text-primaryColor'>
                                    <span className='font-semibold'>Order ID: </span>
                                    {order.orderId}
                                </h3>
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
                                            <div className='grid grid-cols-4 w-full mt-4'>
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
                                                <div>
                                                    <p className='text-gray-600 font-semibold text-sm'>Sub Total:</p>
                                                    <p>
                                                        LKR {product.quantity.unit === 'gram' ? (product.quantity.value / 1000) * product.price : product.quantity.value * product.price}
                                                    </p>
                                                </div>
                                            </div>
                                            {order.status === 'delivered' && !product.isReviewAndRatingHere ? (
                                                <div className='mt-3'>
                                                    <p className='text-sm text-gray-600'>If you would like to provide a review and rating, it will be applied to all products in this order.</p>
                                                    <form onSubmit={(e) => handleSubmit(e, order.orderId)} className="flex justify-between gap-4">
                                                        <textarea
                                                            placeholder="Write your review here..."
                                                            value={review}
                                                            onChange={handleInputChange}
                                                            className="border-[1px] rounded-sm outline-primaryColor px-3 py-2 w-full"
                                                        />
                                                        <div className="flex flex-col items-start justify-between">
                                                            <div className="flex">
                                                                {[1, 2, 3, 4, 5].map(value => (
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
                                                </div>
                                            ) : ('')}
                                        </div>
                                    </div>
                                ))}
                                <div className='grid grid-cols-3 mt-4'>
                                    <div>
                                        <p className='text-gray-600 font-semibold text-sm'>Status:</p>
                                        <p
                                            className={`${order.status === 'canceled' ? 'bg-red-100 text-red-700' : order.status === 'delayed' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'} w-max py-1 px-2 rounded-full`}
                                        >
                                            {order.status === 'canceled' ? 'Order Canceled' : order.status === 'delayed' ? 'Order Delayed' : order.status === 'shipped' ? 'Order Shipped' : order.status === 'delivered' ? 'Order Delivered' : 'Order Still Progress'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className='text-gray-600 font-semibold text-sm'>Payment Method:</p>
                                        <p>{order.isCashOnDelivery ? 'Cash on Delivery' : 'Card Payment'}</p>
                                    </div>
                                    <div>
                                        <p className='text-gray-600 font-semibold text-sm'>Delivery Address:</p>
                                        <p>{formattedAddress}</p>
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

export default ConsumerOrders;
