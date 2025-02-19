import { useState, useEffect } from 'react';
import './OrderOverview.css';
import { TiHome } from 'react-icons/ti';
import { MdWork } from 'react-icons/md';
import { FaLocationDot } from 'react-icons/fa6';
import visa from '../../Assets/visa-card.png';
import master from '../../Assets/master-card.png';
import Image, { StaticImageData } from 'next/image';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from 'next/router';

interface Address {
    _id: string;
    data: any;
    no?: number;
    street: string;
    town: string;
    division: string;
    place: string;
    district: string;
    contactNumber: string | string[];
}

interface Card {
    _id: string;
    cardNumber: number;
    cardType: string;
    bankName: string;
    expireDate: {
        month: number;
        year: number;
    };
}

interface Product {
    unit: string;
    finalQuantity: number;
    pricePerKg: number;
}

interface OrderOverviewProps {
    products: Product[];
    userId: string;
    address: Address;
    card?: Card;
    paymentMethod: string;
}

function OrderOverview({ products, userId, address, card, paymentMethod }: OrderOverviewProps) {
    const [isAddressHere, setIsAddressHere] = useState(false);
    const [isCardHere, setIsCardHere] = useState(false);
    const [formattedAddress, setFormattedAddress] = useState('');
    const [maskedCardNumber, setMaskedCardNumber] = useState('');
    const [icon, setIcon] = useState<React.ReactElement | null>(null);
    const [cardType, setCardType] = useState<StaticImageData | undefined>(undefined);
    const [alt, setAlt] = useState('');
    const [isCashOnDelivery, setIsCashOnDelivery] = useState(false);
    const [process, setProcess] = useState<boolean>(false)

    const router = useRouter()

    useEffect(() => {
        if (address.district) {
            setIsAddressHere(true);
            const formattedAddress = [
                address.no ? address.no.toString() : '',
                address.street,
                address.town,
                address.division,
            ].filter(Boolean).join(', ');

            setFormattedAddress(formattedAddress);

            if (address.place === 'Home') {
                setIcon(<TiHome />);
            } else if (address.place === 'Work Place') {
                setIcon(<MdWork />);
            } else {
                setIcon(<FaLocationDot />);
            }
        }

        if (paymentMethod === 'card' && card && card.cardNumber) {
            setIsCardHere(true);
            setIsCashOnDelivery(false);

            const maskCardNumber = (cardNumber: number) => {
                const cardNumStr = cardNumber.toString().replace(/\D/g, '');
                if (cardNumStr.length === 16) {
                    return `${cardNumStr.slice(0, 4)} ${cardNumStr.slice(4, 8).replace(/\d/g, 'X')} ${cardNumStr.slice(8, 12).replace(/\d/g, 'X')} ${cardNumStr.slice(12)}`;
                }
                return cardNumStr;
            };

            setMaskedCardNumber(maskCardNumber(card.cardNumber));

            if (card.cardType === 'Visa Card') {
                setCardType(visa);
                setAlt('Visa Card');
            } else {
                setCardType(master);
                setAlt('Master Card');
            }
        } else if (paymentMethod === 'cash') {
            setIsCardHere(false);
            setIsCashOnDelivery(true);
            setMaskedCardNumber('');
        }
    }, [address, card, paymentMethod]);

    let totalPrice = 0;

    if (Array.isArray(products)) {
        products.forEach(product => {
            let quantityInKg = product.unit === "gram" ? product.finalQuantity / 1000 : product.finalQuantity;
            totalPrice += quantityInKg * product.pricePerKg;
        });
    } else {
        console.error('Expected products to be an array');
    }

    const finalPrice = totalPrice;

    const handlePlaceOrder = async () => {
        setProcess(true)
        try {
            const response = await axios.post('/api/order', {
                userId,
                deliveryAddressId: address._id,
                cardId: card?._id,
                totalPrice: finalPrice,
                status: 'placed',
                products,
                isCashOnDelivery
            });

            if (response.status === 200 && isCashOnDelivery) {
                localStorage.removeItem('checkoutItems');
                toast.success('Order placed successfully.');
                router.push('/cart');
            }

            if (response.status === 200 && !isCashOnDelivery) {
                localStorage.removeItem('checkoutItems');
                router.push(`/payment?a=${finalPrice}`);
            }
        } catch (error: any) {
            console.error('Error placing order:', error);
            toast.error(error.response?.data?.message || 'Failed to place order.');
        } finally {
            setProcess(false)
        }
    };

    return (
        <div className='order-overview-container bg-green-500 px-60 sticky bottom-0'>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className="left-section">
                <div className="chosen-card flex items-center justify-around">
                    {paymentMethod === 'card' ? (
                        isCardHere ? (
                            <>
                                <div className='cards-content w-full flex justify-around items-center'>
                                    {cardType && <Image width={100} height={100} src={cardType} alt={alt} />}

                                    <div className="card-data">
                                        {card && (
                                            <>
                                                <p><strong className="font-semibold">Bank: </strong>{card.bankName}</p>
                                                <p><strong className='font-semibold'>Card Number:</strong> {maskedCardNumber}</p>
                                                <p><strong className='font-semibold'>Expire Date:</strong> {`${card.expireDate.month}/${card.expireDate.year}`}</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <p className='font-semibold text-xl'>Select a card</p>
                            </>
                        )
                    ) : (
                        <>
                            <p className='font-semibold text-xl'>Cash on Delivery</p>
                        </>
                    )}
                </div>

                <div className="chosen-address flex items-center justify-around">
                    {isAddressHere ? (
                        <>
                            <i className='text-[60px]'>{icon}</i>
                            <div className='delivery-address flex flex-col gap-1'>
                                <p><strong className='font-semibold'>Address:</strong> {formattedAddress}</p>
                                <p><strong className='font-semibold'>District:</strong> {address.district}</p>
                                <p>
                                    <span className='font-semibold'>Contact No: </span>
                                    {address?.contactNumber
                                        ? Array.isArray(address.contactNumber)
                                            ? address.contactNumber.map(num => `+94 ${num.toString().replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')}`).join(', ')
                                            : `+94 ${address.contactNumber.toString().replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')}`
                                        : "N/A"}
                                </p>
                            </div>
                        </>
                    ) : (
                        <p className='font-semibold text-xl'>Select a delivery address</p>
                    )}
                </div>
            </div>

            <div className="right-section">
                <p className='text-xl flex flex-col'><strong className='font-semibold text-xl'>Total Price:</strong> Rs. {totalPrice}</p>
                <div className="final-price">
                    <h1 className='text-3xl font-semibold'>Final Price</h1>
                    <p className='text-2xl'>= Rs. {finalPrice}</p>
                </div>
                <button
                    disabled={process}
                    className='order-btn bg-primaryColor hover:bg-primaryButtonHoverColor disabled:opacity-50 disabled:hover:bg-primaryColor disabled:animate-pulse cursor-pointer transition ease-in-out duration-300'
                    onClick={handlePlaceOrder}
                >
                    {process ?
                        (isCashOnDelivery ?
                            (<div>
                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Placeing...
                            </div>)
                            :
                            (<div>
                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Checking...
                            </div>)
                        )
                        : 'Place Order'}
                </button>
            </div>
        </div>
    );
}

export default OrderOverview;