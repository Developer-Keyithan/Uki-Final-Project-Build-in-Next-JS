'use client'

import axios from "axios";
import { useEffect, useState } from "react"
import RatingCart from "../../../Rating Cart/RatingCart";
import { toast, ToastContainer } from "react-toastify";
import { IoStar } from "react-icons/io5";

interface Product {
    _id: string;
    productName: string;
    productImages: [{
        imageUrl: string;
    }]
    productDescription: string;
}

interface ReviewsAndRating {
    _id: string
    productId: Product;
    review: string;
    rating: number;
    createdAt: Date;
}


const Reviews = () => {
    const [reviews, setReviews] = useState<ReviewsAndRating[]>([])
    const [userId, setUserId] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    useEffect(() => {
        const fetchReviews = async () => {
            setIsLoading(true)
            try {
                const cookieResponse = await axios.get('/api/cookie');

                if (cookieResponse.status === 200 && cookieResponse.data?.user?.id) {
                    const userId = cookieResponse.data.user.id;

                    const apiResponse = await axios.post('/api/ratingReviews/get-by-userId', {
                        userId: userId
                    });

                    const data = apiResponse.data?.userRatingReviews.sort((a: { createdAt: Date; }, b: { createdAt: Date; }) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

                    setUserId(userId)
                    setReviews(data || []);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false)
            }
        };

        fetchReviews();
    }, []);

    const handleAddToCart = async (id: string) => {
        try {
            const response = await axios.post('/api/cart', {
                userId, productId: id, value: 1, unit: 'kg'
            });

            if (response.status === 200) {
                toast.success("Item added to cart");
            }
        } catch (error) {
            console.error(error);
            toast.error("Unable to add cart item");
        }
    };

    if (isLoading) {
        return (
            <div className="animate-pulse flex flex-col gap-6 my-8">
                <div className='flex gap-8 ring-1 ring-gray-300 rounded-md p-3'>
                    <div className="w-52 h-44 bg-gray-200 rounded-md"></div>
                    <div className="w-full h-44 flex flex-col justify-between">
                        <div className="w-96 h-8 bg-gray-200 rounded-md"></div>
                        <div className="w-full bg-gray-200 h-6 rounded-md"></div>
                        <div className="grid grid-cols-2">
                            <div className="flex flex-col gap-1">
                                <div className="h-4 w-40 bg-gray-200 rounded-md"></div>
                                <div className="h-6 w-[36rem] bg-gray-200 rounded-md"></div>
                            </div>
                            <div className="felx flex-col gap-1">
                                <div className="h-4 w-40 bg-gray-200 rounded-md"></div>
                                <div className="h-6 flex items-center text-gray-200">
                                    <IoStar />
                                    <IoStar />
                                    <IoStar />
                                    <IoStar />
                                    <IoStar />
                                </div>
                            </div>
                        </div>
                        <div className="h-9 w-full bg-gray-200 rounded-md"></div>
                    </div>
                </div>
                <div className='flex gap-8 ring-1 ring-gray-300 rounded-md p-3'>
                    <div className="w-52 h-44 bg-gray-200 rounded-md"></div>
                    <div className="w-full h-44 flex flex-col justify-between">
                        <div className="w-96 h-8 bg-gray-200 rounded-md"></div>
                        <div className="w-full bg-gray-200 h-6 rounded-md"></div>
                        <div className="grid grid-cols-2">
                            <div className="flex flex-col gap-1">
                                <div className="h-4 w-40 bg-gray-200 rounded-md"></div>
                                <div className="h-6 w-[36rem] bg-gray-200 rounded-md"></div>
                            </div>
                            <div className="felx flex-col gap-1">
                                <div className="h-4 w-40 bg-gray-200 rounded-md"></div>
                                <div className="h-6 flex items-center text-gray-200">
                                    <IoStar />
                                    <IoStar />
                                    <IoStar />
                                    <IoStar />
                                    <IoStar />
                                </div>
                            </div>
                        </div>
                        <div className="h-9 w-full bg-gray-200 rounded-md"></div>
                    </div>
                </div>
                <div className='flex gap-8 ring-1 ring-gray-300 rounded-md p-3'>
                    <div className="w-52 h-44 bg-gray-200 rounded-md"></div>
                    <div className="w-full h-44 flex flex-col justify-between">
                        <div className="w-96 h-8 bg-gray-200 rounded-md"></div>
                        <div className="w-full bg-gray-200 h-6 rounded-md"></div>
                        <div className="grid grid-cols-2">
                            <div className="flex flex-col gap-1">
                                <div className="h-4 w-40 bg-gray-200 rounded-md"></div>
                                <div className="h-6 w-[36rem] bg-gray-200 rounded-md"></div>
                            </div>
                            <div className="felx flex-col gap-1">
                                <div className="h-4 w-40 bg-gray-200 rounded-md"></div>
                                <div className="h-6 flex items-center text-gray-200">
                                    <IoStar />
                                    <IoStar />
                                    <IoStar />
                                    <IoStar />
                                    <IoStar />
                                </div>
                            </div>
                        </div>
                        <div className="h-9 w-full bg-gray-200 rounded-md"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6 my-8">
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            {reviews.length > 0 ? (
                reviews.map(review => (
                    <div key={review._id} className="flex gap-8 p-4 ring-1 ring-gray-300 rounded-sm">
                        <img
                            src={review.productId.productImages[0].imageUrl}
                            alt={review.productId.productName}
                            className="w-44 h-44 object-cover rounded-sm"
                        />
                        <div className="w-full flex flex-col justify-between">
                            <div>
                                <h3 className="text-2xl font-semibold">{review.productId.productName}</h3>
                                <p>{review.productId.productDescription}</p>
                            </div>
                            <div className="grid grid-cols-2">
                                <div>
                                    <p className="font-semibold text-sm text-gray-600">Your Review:</p>
                                    <p>{review.review}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-gray-600">Your Rating:</p>
                                    <RatingCart rating={review.rating} />
                                </div>
                            </div>
                            <button
                                type="button"
                                className="bg-secondaryButtonColor text-white hover:bg-orange-500 py-1 px-4 transition ease-in-out duration-300"
                                onClick={() => handleAddToCart(review.productId._id)}
                            >
                                Add to cart again
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p>No reviews available.</p>
            )}
        </div>
    );
}

export default Reviews;