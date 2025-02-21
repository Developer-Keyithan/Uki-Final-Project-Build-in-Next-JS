import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Navbar from '../../app/Components/Navbar/Navbar';
import Footer from '../../app/Components/Footer/Footer';
import AddOne from '../../app/Components/Add One/AddOne';
import AddressCart from '../../app/Components/Address Cart/AddressCart';
import OrderOverview from '../../app/Components/OrderOverview/OrderOverview';
import DeliveryAddressForm from '../../app/Components/Delivery Address Form/DeliveryAddressForm';
import { RiUnpinFill } from 'react-icons/ri';

interface Product {
    unit: string;
    finalQuantity: number;
    price: { newPrice: number };
    name: string;
    pricePerKg: number;
    agricationMethod: string;
    productName: string;
    productDescription: string;
    imageUrl: string;
}

interface Address {
    id: string;
    userId: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    phoneNumber: string;
    isDefault: boolean;
}

function OrderPage() {
    const [showDeliveryForm, setShowDeliveryForm] = useState(false);
    // const [showCardForm, setShowCardForm] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string>('');
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<any>({});
    // interface Card {
    //     // Define the properties of a card here
    //     id: string;
    //     cardNumber: string;
    //     expiryDate: string;
    //     cardHolderName: string;
    // }
    
    // const [cards, setCards] = useState<Card[]>([]);
    // const [selectedCard, setSelectedCard] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');

    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                if (id) {
                    const response = await axios.post('/api/product/get-product', { productId: id });
                    const product = response.data.product
                    setProducts(product);
                } else {
                    const storedData = localStorage.getItem("checkoutItems");
                    if (storedData) {
                        setProducts(JSON.parse(storedData));
                    }
                }
            } catch (err) {
                console.error(err);
                setError('Failed to fetch product details.');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    useEffect(() => {
        const fetchAddressesAndCards = async () => {
            const user = await axios.get('/api/cookie');
            setUserId(user.data.user.id);

            const addresses = await axios.post('/api/delivery-address/get-by-userId', {
                userId: user.data.user.id,
            });

            setAddresses(addresses.data.userDeliveryAddress);
            // setCards(cards.data.cards);
        };

        fetchAddressesAndCards();
        setInterval(fetchAddressesAndCards, 3000);
    }, []);

    // Function to add a new address to the addresses state
    // const handleAddNewAddress = (newAddress: any) => {
    //     setAddresses((prevAddresses) => [...prevAddresses, newAddress]);
    // };

    const handleQuantityChange = (index: number, change: number) => {
        setProducts((prevProducts) =>
            prevProducts.map((product, i) =>
                i === index
                    ? {
                        ...product,
                        finalQuantity: Math.max(1, product.finalQuantity + (product.unit === "gram" ? change * 50 : change)),
                    }
                    : product
            )
        );
    };

    const handleRemoveProduct = (index: number) => {
        setProducts((prevProducts) => prevProducts.filter((_, i) => i !== index));
    };

    const handleUnitChange = (index: number, unit: string) => {
        setProducts((prevProducts) =>
            prevProducts.map((product, i) =>
                i === index ? { ...product, unit } : product
            )
        );
    };

    const calculateSubtotal = (product: Product) => {
        const price = product.price?.newPrice || product.pricePerKg;
        const quantity = product.finalQuantity;
        const unit = product.unit;

        return unit === "kg" ? price * quantity : (price / 1000) * quantity;
    };

    const handleAddressSelection = (address: Address) => {
        setSelectedAddress(address);
    };

    // const handleCartSelection = (card: any) => {
    //     setSelectedCard(card);
    // };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <div className='sticky top-0'>
                <Navbar />
                <hr />
            </div>

            <div className="mx-60 pb-5 rounded-b-[20px] overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between gap-5 mt-5 px-[1px]">
                    <div className="flex flex-col gap-5 w-3/5 md:w-[56.9%]">
                        <div className="flex gap-5">
                            <AddOne textContent="Add New Delivery Address" onClick={() => setShowDeliveryForm(true)} />
                        </div>

                        <div className="w-full mt-5">
                            <h2 className="text-xl font-semibold">Payment Method</h2>
                            <div className="flex justify-around gap-5 mt-5">
                                <button
                                    className={`button-primary w-full h-10 ring-1 ring-primaryColor rounded text-base hover:bg-primaryColor hover:text-white transition ease-in-out duration-500 ${paymentMethod === 'cash' ? 'bg-primaryColor text-white' : ''}`}
                                    onClick={() => setPaymentMethod('cash')}
                                >
                                    Cash on Delivery
                                </button>
                                <button
                                    className={`button-primary w-full h-10 ring-1 ring-primaryColor rounded text-base hover:bg-primaryColor hover:text-white transition ease-in-out duration-500 ${paymentMethod === 'card' ? 'bg-primaryColor text-white' : ''}`}
                                    onClick={() => setPaymentMethod('card')}
                                >
                                    Card Payment
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col ring-1 ring-gray-300 rounded-md">
                            {products.length > 0 ? (
                                products.map((product, index) => (
                                    <div key={index} className="border-b-[1px] p-4 rounded hover:bg-gray-100">
                                        <div className="w-full h-max flex gap-8 overflow-hidden">
                                            <div className='h-40 w-40 overflow-hidden bg-gray-200 rounded'>
                                                <img
                                                    src={product.imageUrl || '/default-image.jpg'}
                                                    alt={product.productName || product.name || 'Product'}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div className='w-3/4'>
                                                <h1 className='font-semibold text-2xl'>{product.productName || product.name}</h1>
                                                <div className="flex justify-between">
                                                    <p><strong className='font-semibold'>Agrication Method:</strong> {product.agricationMethod}</p>
                                                    <p><strong className='font-semibold'>Price Per kg:</strong> {product.price?.newPrice || product.pricePerKg}</p>
                                                </div>
                                                <div className="flex items-center gap-2 mt-3">
                                                    <button onClick={() => handleQuantityChange(index, -1)} className="h-8 w-8 border rounded hover:bg-primaryColor hover:border-primaryColor hover:text-white transition ease-in-out duration-300">-</button>
                                                    <p className='flex items-center justify-center w-20 h-8 rounded border'>{product.finalQuantity}</p>
                                                    <button onClick={() => handleQuantityChange(index, 1)} className="h-8 w-8 border rounded hover:bg-primaryColor hover:border-primaryColor hover:text-white transition ease-in-out duration-300">+</button>
                                                    <label className='flex gap-2 ml-4 cursor-pointer' htmlFor={`gram-${index}`}>
                                                        <input
                                                            type="radio"
                                                            id={`gram-${index}`}
                                                            name={`unit-${index}`}
                                                            checked={product.unit === "gram"}
                                                            onChange={() => handleUnitChange(index, "gram")}
                                                            className='cursor-pointer accent-primaryColor'
                                                        /> gram
                                                    </label>
                                                    <label className='flex gap-2 ml-4 cursor-pointer' htmlFor={`kg-${index}`}>
                                                        <input
                                                            type="radio"
                                                            id={`kg-${index}`}
                                                            name={`unit-${index}`}
                                                            checked={product.unit === "kg"}
                                                            onChange={() => handleUnitChange(index, "kg")}
                                                            className='cursor-pointer accent-primaryColor'
                                                        /> kg
                                                    </label>
                                                </div>
                                                <div className='flex justify-between items-center mt-5'>
                                                    <p><span className='font-semibold'>Sub Total: </span>{calculateSubtotal(product).toFixed(2)}</p>
                                                    <button
                                                        onClick={() => handleRemoveProduct(index)}
                                                        className='flex gap-3 items-center px-4 py-1 bg-red-600 text-white rounded hover:bg-red-800 transition ease-in-out duration-500'
                                                    >
                                                        <RiUnpinFill /> Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div>No products found</div>
                            )}
                        </div>
                    </div>

                    <div className="w-2/5 flex flex-col gap-5">
                        <AddressCart data={addresses} onSelectAddress={handleAddressSelection} />
                        {/* <Coupon /> */}
                    </div>
                </div>

                {showDeliveryForm && (
                    <div className="fixed inset-0 flex justify-center items-center px-[30vw] backdrop-blur-lg z-[1000]">
                        <div className="relative bg-white rounded-lg">
                            <DeliveryAddressForm
                                handleClose={() => setShowDeliveryForm(false)}
                                id={userId}
                            />
                        </div>
                    </div>
                )} 

                {/* {showCardForm && (
                    <div className="fixed inset-0 flex justify-center items-center px-[30vw] backdrop-blur-lg z-[100]">
                        <div className="relative bg-white rounded-lg">
                            <CardForm handleClose={() => setShowCardForm(false)} id={userId} onAddNewCard={(newCard) => setCards((prevCards) => [...prevCards, newCard])} />
                        </div>
                    </div>
                )} */}
            </div>
            <div className="bottom-container mt-5 sticky bottom-0 z-40">
                <OrderOverview products={products} userId={userId} address={selectedAddress} paymentMethod={paymentMethod} />
            </div>
            <Footer />
        </div>
    );
}

export default OrderPage;