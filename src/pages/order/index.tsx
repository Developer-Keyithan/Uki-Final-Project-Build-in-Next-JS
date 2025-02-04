import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { MdClose } from 'react-icons/md';
import AddressCart from '../../../Components/Address Cart/AddressCart';
import CardsCart from '../../../Components/Cards Cart/CardsCart';
import AddOne from '../../../Components/Add One/AddOne';
import OrderOverview from '../../../Components/OrderOverview/OrderOverview';
import Coupon from '../../../Components/Coupon/Coupon';
import DeliveryAddressForm from '../../../Components/Delivery Address Form/DeliveryAddressForm';
import CardForm from '../../../Components/cardForm';
import Image from 'next/image';
import Navbar from '../../../Components/Navbar/Navbar';
import Footer from '../../../Components/Footer/Footer';

interface Product {
    price: {
        newPrice: number;
    };
    agricationMethod: string;
    productName: string;
    productDescription: string;
    productImages?: { imageUrl: string }[];
}

function OrderPage() {
    const [showDeliveryForm, setShowDeliveryForm] = useState(false);
    const [showCardForm, setShowCardForm] = useState(false);
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(100);
    const [unit, setUnit] = useState<'kg' | 'gram'>('kg');

    const router = useRouter();
    const id = router.query;

    const imageUrl = 'https://cdn.pixabay.com/photo/2016/08/01/17/08/tomatoes-1561565_1280.jpg'

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                if (id?.id) {
                    const response = await axios.post('/api/product/get-product', { productId: id.id });
                    setProduct(response.data.product);
                }
            } catch (err) {
                setError('Failed to fetch product details.');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddDeliveryAddressClick = () => setShowDeliveryForm(true);
    const handleCloseDeliveryForm = () => setShowDeliveryForm(false);

    const handleAddCardClick = () => setShowCardForm(true);
    const handleCloseCardForm = () => setShowCardForm(false);

    const handleQuantityChange = (value: number) => {
        if (quantity + value >= 0) {
            setQuantity(quantity + value);
        }
    };

    const handleUnitChange = (selectedUnit: 'kg' | 'gram') => {
        setUnit(selectedUnit);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <div className='sticky top-0'>
                <Navbar />
                <hr />
            </div>
            <div className="mx-60 mb-5 rounded-b-[20px] overflow-hidden">
                {/* Top Container */}
                <div className="flex flex-col md:flex-row justify-between gap-5 mt-5 px-[1px]">
                    {/* Left Content */}
                    <div className="flex flex-col gap-5 w-full md:w-[56.9%]">
                        {/* Add Cards Section */}
                        <div className="flex gap-5">
                            <AddOne
                                textContent="Add New Delivery Address"
                                onClick={handleAddDeliveryAddressClick}
                            />
                            <AddOne
                                textContent="Add New Card"
                                onClick={handleAddCardClick}
                            />
                        </div>

                        {/* Payment Method Section */}
                        <div className="w-full mt-5">
                            <h2 className="text-xl font-semibold">Payment Method</h2>
                            <div className="flex justify-around gap-5 mt-5">
                                <button className="button-primary w-full h-10 text-base">
                                    Cash on Delivery
                                </button>
                                <button className="button-primary w-full h-10 text-base">
                                    Card Payment
                                </button>
                            </div>
                        </div>

                        {/* Chosen Products Section */}
                        <div className="ring-1 ring-gray-500 p-4 rounded-md">
                            {product && (
                                <div className="w-full h-max flex gap-4 overflow-hidden">
                                    <div className='h-full w-1/4 overflow-hidden'>
                                        {product.productImages && product.productImages.length > 0 && (
                                            <Image
                                                // src={product.productImages[0].imageUrl}
                                                src={imageUrl}
                                                alt={product.productName}
                                                width={200}
                                                height={200}
                                                // layout="fill"
                                                objectFit="cover"
                                                className="h-full w-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className='w-3/4'>
                                        <div>
                                            <h1 className='font-semibold text-2xl'>{product.productName}</h1>
                                            <p className='text-lg'>{product.productDescription}</p>
                                        </div>
                                        <div className="flex justify-between">
                                            <p><strong className='font-semibold'>Agrication Method:</strong> {product.agricationMethod}</p>
                                            <p><strong className='font-semibold'>Price Per kg:</strong> {product.price.newPrice}</p>
                                        </div>
                                        <div className='flex gap-4'>
                                            <div>
                                                <button onClick={() => handleQuantityChange(-1)}>-</button>
                                                <input
                                                    type="number"
                                                    value={quantity}
                                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                                    className='text-center'
                                                />
                                                <button onClick={() => handleQuantityChange(1)}>+</button>
                                            </div>
                                            <label htmlFor="kg" className='flex items-center gap-2'>
                                                <input
                                                    type="radio"
                                                    id='kg'
                                                    name='unit'
                                                    checked={unit === 'kg'}
                                                    onChange={() => handleUnitChange('kg')}
                                                /> kg
                                            </label>
                                            <label htmlFor="gram" className='flex items-center gap-2'>
                                                <input
                                                    type="radio"
                                                    id='gram'
                                                    name='unit'
                                                    checked={unit === 'gram'}
                                                    onChange={() => handleUnitChange('gram')}
                                                /> gram
                                            </label>
                                        </div>
                                        {/* <div className="flex justify-end">
                                        <button className='bg-red-700 px-4 py-1 text-white rounded-md'>Unpin</button>
                                    </div> */}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="flex flex-col gap-5">
                        <AddressCart />
                        <CardsCart />
                        <Coupon />
                    </div>
                </div>

                {/* Bottom Container */}
                <div className="bottom-container">
                    <OrderOverview />
                </div>

                {/* Delivery Address Form Modal */}
                {showDeliveryForm && (
                    <div className="fixed inset-0 flex justify-center items-center px-[30vw] backdrop-blur-lg">
                        <div className="relative bg-white rounded-lg">
                            <DeliveryAddressForm handleClose={handleCloseDeliveryForm} />
                        </div>
                    </div>
                )}

                {/* Card Form Modal */}
                {showCardForm && (
                    <div className="fixed inset-0 flex justify-center items-center px-[30vw] backdrop-blur-lg">
                        <div className="relative bg-white rounded-lg">
                            <CardForm handleClose={handleCloseCardForm} />
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default OrderPage;