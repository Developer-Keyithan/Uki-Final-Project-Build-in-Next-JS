import './style.css';
import Navbar from '../../../Components/Navbar/Navbar';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BsCartX } from 'react-icons/bs';
import Footer from '../../../Components/Footer/Footer';

interface CartItem {
    price: { newPrice: number };
    agricationMethod: string;
    productDescription: string;
    productName: string;
    productImages: { imageUrl: string }[];
    id: string;
    _id: string;
    productId: string;
    quantity: {
        value: number;
        unit: string;
    };
    unit: string;
}

function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [id, setId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const fetchUser = await axios.get('/api/cookie');
                const userId = fetchUser.data?.user?.id;
                if (!userId) return;

                setId(userId);

                const cartData = await axios.post('/api/cart/get-cart-by-userId', { userId });
                setCartItems(cartData.data);
                console.log(cartData.data)
            } catch (error) {
                console.error("Error fetching cart data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, []);

    const handleQuantityChange = (_id: string, newValue: number) => {
        setCartItems((prevCartItems) =>
            prevCartItems.map((item) =>
                item._id === _id
                    ? {
                        ...item,
                        quantity: {
                            ...item.quantity,
                            // Check for kg and make sure the value doesn't go below 1
                            value: item.quantity.unit === 'kg'
                                ? Math.max(newValue, 1)  // Ensure value doesn't go below 1 for kg
                                : item.quantity.unit === 'g'
                                    ? Math.max(newValue, 50)  // Ensure value doesn't go below 50 for g
                                    : newValue  // For other units, no restrictions
                        }
                    }
                    : item
            )
        );
    };


    const handleUnitChange = (_id: string, newUnit: string) => {
        setCartItems((prevCartItems) =>
            prevCartItems.map((item) =>
                item._id === _id
                    ? {
                        ...item,
                        quantity: {
                            ...item.quantity,
                            unit: newUnit,
                            value: newUnit === 'g' && item.quantity.value < 50
                                ? 50  // If changing to 'g' and value is less than 50, set it to 50
                                : item.quantity.value // Keep the current value if no adjustment is needed
                        }
                    }
                    : item
            )
        );
    };


    const handleCheckboxChange = (_id: string) => {
        setSelectedItems((prevSelectedItems) => {
            const newSelectedItems = new Set(prevSelectedItems);
            if (newSelectedItems.has(_id)) {
                newSelectedItems.delete(_id);
            } else {
                newSelectedItems.add(_id);
            }
            return newSelectedItems;
        });
    };

    const calculateProductSubtotal = (item: CartItem) => {
        const itemValue = item.quantity.unit === 'kg'
            ? item.quantity.value  // If the unit is kg, use the value directly
            : item.quantity.unit === 'g'
                ? item.quantity.value / 1000  // If the unit is grams, convert to kg
                : item.quantity.value;  // If there's another unit, use the value as it is

        return item.price.newPrice * itemValue; // Calculate the subtotal for this item
    };

    const calculateCartTotal = () => {
        return selectedItems.size === 0
            ? 0
            : cartItems
                .filter(item => selectedItems.has(item._id))
                .reduce((total, item) => {
                    const subtotal = calculateProductSubtotal(item); // Get the subtotal for the item
                    return total + subtotal;  // Add the subtotal to the total
                }, 0);
    };

    return (
        <div>
            <div className='sticky top-0'>
                <Navbar />
                <hr />
            </div>
            <div className='flex mx-60 my-10 gap-5'>
                <div className='flex flex-wrap gap-5 w-3/5 ring-1 ring-gray-300 p-4 rounded-md'>
                    {cartItems.length === 0 ? (
                        <p>Your cart is empty.</p>
                    ) : (
                        cartItems.map((cartItem) => (
                            <div key={cartItem._id} className='flex gap-5 w-full'>
                                <input
                                    type="checkbox"
                                    className='accent-primaryColor h-5 w-5'
                                    onChange={() => handleCheckboxChange(cartItem._id)}
                                    checked={selectedItems.has(cartItem._id)}
                                    aria-label={`Select ${cartItem.productName}`}
                                />
                                <div className="flex w-full ring-1 ring-gray-300 rounded-sm px-4 py-3">
                                    <div className='w-1/5'>
                                        {cartItem.productImages && cartItem.productImages.length > 0 && (
                                            <Image
                                                src={cartItem.productImages[0].imageUrl}
                                                alt={cartItem.productName}
                                                width={200}
                                                height={200}
                                                objectFit="cover"
                                                className="h-full w-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className='w-4/5'>
                                        <div>
                                            <h1 className='font-semibold text-2xl'>{cartItem.productName}</h1>
                                            <p className='text-lg'>{cartItem.productDescription}</p>
                                            <div className="flex justify-between">
                                                <p><strong className='font-semibold'>Agrication Method:</strong> {cartItem.agricationMethod}</p>
                                                <p><strong className='font-semibold'>Price Per kg:</strong> {cartItem.price.newPrice}</p>
                                            </div>
                                            <div className='flex gap-4 my-2'>
                                                <div className='gap-2'>
                                                    <button
                                                    className='ring-1 ring-gray-300 px-2 py-[2px] rounded hover:ring-primaryColor hover:bg-primaryColor hover:text-white transition ease-in-out duration-500 cursor-pointer'
                                                    onClick={() => handleQuantityChange(cartItem._id, cartItem.quantity.value - (cartItem.quantity.unit === 'kg' ? 1 : 50))}>-</button>
                                                    <input
                                                        type="number"
                                                        value={cartItem.quantity.value}
                                                        onChange={(e) =>
                                                            handleQuantityChange(cartItem._id, Number(e.target.value))
                                                        }
                                                        className='text-center mx-1 outline-none h-full focus:ring-1 ring-gray-300 transition ease-in-out duration-300 rounded w-20 no-spinner'
                                                        min={1}
                                                    />
                                                    <button
                                                    className='ring-1 ring-gray-300 px-2 py-[2px] rounded hover:ring-primaryColor hover:bg-primaryColor hover:text-white transition ease-in-out duration-500 cursor-pointer'
                                                    onClick={() => handleQuantityChange(cartItem._id, cartItem.quantity.value + (cartItem.quantity.unit === 'kg' ? 1 : 50))}>+</button>
                                                </div>
                                                <label htmlFor={`kg-${cartItem._id}`} className='flex items-center gap-2'>
                                                    <input
                                                        type="radio"
                                                        id={`kg-${cartItem._id}`}
                                                        name={`unit-${cartItem._id}`}
                                                        checked={cartItem.quantity.unit === 'kg'}
                                                        onChange={() => handleUnitChange(cartItem._id, 'kg')}
                                                        aria-label="Kilograms"
                                                        className='accent-primaryColor'
                                                    /> kg
                                                </label>
                                                <label htmlFor={`gram-${cartItem._id}`} className='flex items-center gap-2'>
                                                    <input
                                                        type="radio"
                                                        id={`gram-${cartItem._id}`}
                                                        name={`unit-${cartItem._id}`}
                                                        checked={cartItem.quantity.unit === 'g'}
                                                        onChange={() => handleUnitChange(cartItem._id, 'g')}
                                                        aria-label="Grams"
                                                        className='accent-primaryColor'
                                                    /> gram
                                                </label>
                                            </div>
                                        </div>
                                        <div className='flex justify-between items-center'>
                                            {/* Displaying the subtotal for each product */}
                                            <p className='text-base'>
                                                <strong className='font-semibold text-lg'>Subtotal:</strong> {calculateProductSubtotal(cartItem)} LKR
                                            </p>

                                            <button className='flex gap-2 items-center bg-red-700 hover:bg-red-800 text-white px-4 py-1 rounded transition ease-in-out duration-300'> Remove from cart <BsCartX /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="w-2/5">
                    <p>Total: {calculateCartTotal()} LKR</p>
                </div>
            </div>
            <Footer />
        </div>
    );

}

export default CartPage;