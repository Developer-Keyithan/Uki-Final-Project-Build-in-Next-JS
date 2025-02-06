import { useState, useEffect } from 'react';
import './OrderOverview.css';
import { TiHome } from 'react-icons/ti';
import { MdWork } from 'react-icons/md';
import { FaLocationDot } from 'react-icons/fa6';


function OrderOverview({ products, userId, address }) {
    console.log(products, userId, address);

    const [isAddressHere, setIsAddressHere] = useState(false);
    const [formattedAddress, setFormattedAddress] = useState('');
    const [icon, setIcon] = useState(null);
    const [name, setName] = useState('');

    useEffect(() => {
        if (address) {
            setIsAddressHere(true);
            const formattedAddress = [
                address.no ? address.no.toString() : '',  // Ensure it's converted to string
                address.street,
                address.town,
                address.division,
            ].filter(Boolean).join(', ');

            setFormattedAddress(formattedAddress);

            if (address.place === 'Home') {
                setIcon(<TiHome />);
                setName('Home');
            } else if (address.place === 'work-place') {
                setIcon(<MdWork />);
                setName('Work Place');
            } else {
                setIcon(<FaLocationDot />);
                setName('Undefined Delivery Address');
            }
        }
    }, [address]); // Runs when the address prop changes

    let totalPrice = 0;

    // Check if products is an array and then perform the iteration
    if (Array.isArray(products)) {
        products.forEach(product => {
            let quantityInKg = product.unit === "gram" ? product.finalQuantity / 1000 : product.finalQuantity;
            totalPrice += quantityInKg * product.pricePerKg;
        });
    } else {
        console.error('Expected products to be an array');
    }

    // Final price (modify if you have any additional logic, like applying a promo code)
    const finalPrice = totalPrice;

    return (
        <div className='order-overview-container bg-green-500 px-60 sticky bottom-0'>
            <div className="left-section">
                <div className="chosen-coupon">
                    <h2>{/* Coupon details here */}</h2>
                    <p>{/* Coupon info */}</p>
                </div>

                <input className='promo-code' type="text" placeholder='If you have a promo code? Enter the promo code.' />

                <div className="chosen-card">
                    <div className='cards-content'>
                        <h3 className='card-name'>{/* Card name here */}</h3>
                        <div className="card-data">
                            <p><strong>Card Number:</strong> {/* Card number */}</p>
                            <p><strong>Expire Date:</strong> {/* Expiry date */}</p>
                        </div>
                    </div>
                </div>

                <div className="chosen-address flex items-center justify-around">
                    {isAddressHere ? (
                        <>
                            <i className='text-[60px]'>{icon}</i>
                            <div className='delivery-address'>
                                <p><strong className='font-semibold'>Address:</strong> {formattedAddress}</p>
                                <p><strong className='font-semibold'>District:</strong> {address.district}</p>
                                <p>
                                    <span className='font-semibold'>Contact No: </span>
                                    {Array.isArray(address.contactNumber)
                                        ? address.contactNumber.map(num => `+94 ${num.toString().replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')}`).join(', ')
                                        : `+94 ${address.contactNumber.toString().replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')}`}
                                </p>
                            </div>
                        </>
                    ) : (
                        <p className='font-semibold text-xl'>Select a delivery address</p>
                    )}
                </div>
            </div>

            <div className="right-section">
                <p><strong>Total Price:</strong> Rs. {totalPrice}</p>
                <div className="final-price">
                    <h1>Final Price</h1>
                    <p>= Rs. {finalPrice}</p>
                </div>
                <button className='order-btn bg-primaryColor'>Place Order</button>
            </div>
        </div>
    );
}

export default OrderOverview;
