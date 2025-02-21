// Cart.tsx
import { useRouter } from 'next/navigation';
import { StaticImageData } from "next/image";
import RatingCart from '../Rating Cart/RatingCart';
import { IoCartOutline } from 'react-icons/io5';
import { useState } from 'react';
import { GoHeart, GoHeartFill } from 'react-icons/go';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

interface ProductData {
    _id?: string;
    image: string | StaticImageData;
    name: string;
    productName: string;
    deliveryType: string;
    price: {
        newPrice: string;
        oldPrice: string;
    };
    rating: number;
    productImages: [{ imageUrl: string | StaticImageData }];
}

interface CartProps {
    data: ProductData;
    updateCartCount: () => void;
}

const Cart: React.FC<CartProps> = ({ data }) => {
    const [isHover, setIsHover] = useState(false);
    const router = useRouter();

    const handleAddToCart = async () => {
        const id = data._id;
        try {
            const user = await axios.get('/api/cookie');

            if (user.status !== 200 || !user.data?.user?.id) {
                return toast.error('If you want to add an item to your cart, you must login or register');
            }

            const response = await axios.post('/api/cart', {
                userId: user.data.user.id,
                productId: id,
                value: 1,
                unit: 'kg',
            });

            if (response.status === 200) {
                toast.success("Item added to cart");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401 || error.response?.status === 403) {
                    toast.error('If you want to add an item to your cart, you must login or register');
                } else {
                    toast.error("Unable to add cart item");
                }
            } else {
                toast.error("Unable to add cart item");
            }
        }
    };


    const handleHover = () => {
        setIsHover(true);
    };

    const handleNotHover = () => {
        setIsHover(false);
    };

    const image = typeof data.productImages[0].imageUrl === 'string' ? data.productImages[0].imageUrl : data.productImages[0].imageUrl.src;

    const handleProduct = () => {
        const id = data._id;
        router.push(`/overview/${id}`);
    };

    return (
        <div className="relative rounded-md overflow-hidden shadow-md w-[calc((100%-100px)/6)] cursor-pointer hover:scale-100">
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
            <div onClick={handleProduct}>
                <div className="w-full h-56 rounded overflow-hidden">
                    <img src={image} alt={data.productName} className='w-full h-full object-cover' />
                </div>
                <div className="mt-4 px-4">
                    <div className="flex justify-between">
                        <h2>{data.productName}</h2>
                        <div className="flex flex-col justify-start text-end h-12">
                            <span className="font-semibold text-lg">Rs. {data.price.newPrice}</span>
                            <span className="text-sm line-through">{data.price.oldPrice}</span>
                        </div>
                    </div>
                    <div className="">
                        <RatingCart rating={data.rating || 3.5} />
                    </div>
                </div>
            </div>
            <div className="cart-actions w-full rounded-full text-end px-4 mb-4">
                <button onClick={handleAddToCart} className='flex items-center gap-2 bg-primaryColor text-white hover:bg-secondaryButtonColor rounded py-1 px-4 mt-4 transition ease-in-out duration-500'>Add to Cart <IoCartOutline /></button>
            </div>
            <div>
                {isHover ? (
                    <div className='absolute top-3 right-3 bg-primaryColor p-2 w-fit h-fit rounded-full'>
                        <GoHeartFill
                            className="text-white text-[20px] transition-opacity ease-in-out duration-500 opacity-0 hover:opacity-100"
                            onMouseLeave={handleNotHover}
                        />
                    </div>
                ) : (
                    <div className='absolute top-3 right-3 bg-primaryColor p-2 w-fit h-fit rounded-full'>
                        <GoHeart
                            className="text-white text-[20px] transition-opacity ease-in-out duration-500 opacity-100 hover:opacity-0"
                            onMouseEnter={handleHover}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;