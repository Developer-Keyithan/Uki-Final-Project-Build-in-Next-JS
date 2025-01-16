import './style.css'
import AddressCart from '../../../Components/Address Cart/AddressCart'
import CardsCart from '../../../Components/Cards Cart/CardsCart'
import AddOne from '../../../Components/Add One/AddOne'
import OrderOverview from '../../../Components/OrderOverview/OrderOverview'
import Coupon from '../../../Components/Coupon/Coupon'
import ChosenProduct from '../../../Components/Chosen Product/ChosenProduct'
import DeliveryAddressForm from '../../../Components/Delivery Address Form/DeliveryAddressForm';
import { useState } from 'react';

function OrderPage() {
    const [showDeliveryForm, setShowDeliveryForm] = useState(false);

const handleAddDeliveryAddressClick = () => {
    setShowDeliveryForm(true);
};

const handleCloseDeliveryForm = () => {
    setShowDeliveryForm(false); 
};

    return (
        <div className='orderpage-container'>
            <div className='top-container'>
                <div className='left-content'>
                    <div className="add-cards">
                        <AddOne textContent='Add New Delivery Address' onClick={handleAddDeliveryAddressClick} />
                        <AddOne textContent='Add New Card' onClick={handleAddDeliveryAddressClick} />
                    </div>

                    <div className="payment-method">
                        <h2>Payment Method</h2>
                        <div className='payment-btns'>
                            <button className="payment-btn">Cash on Delivery</button>
                            <button className="payment-btn">Card Payment</button>
                        </div>
                    </div>

                    <div className="chosen-products">
                        {/* <ChosenProduct /> */}
                    </div>
                </div>

                <div className='right-content'>
                    <AddressCart />
                    <CardsCart />
                    <Coupon />
                </div>
            </div>

            <div className='bottom-container'>
                <OrderOverview />
            </div>

            {showDeliveryForm && (
                <div className="w-full h-full fixed top-0 left-0 flex justify-center items-center px-[30vw] backdrop-blur-lg">
                    <DeliveryAddressForm handleClose={handleCloseDeliveryForm} />
                </div>
            )}
        </div>
    );
}

export default OrderPage;
