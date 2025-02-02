import AddressCart from '../../../Components/Address Cart/AddressCart';
import CardsCart from '../../../Components/Cards Cart/CardsCart';
import AddOne from '../../../Components/Add One/AddOne';
import OrderOverview from '../../../Components/OrderOverview/OrderOverview';
import Coupon from '../../../Components/Coupon/Coupon';
import DeliveryAddressForm from '../../../Components/Delivery Address Form/DeliveryAddressForm';
import CardForm from '../../../Components/cardForm';
import { useState } from 'react';

function OrderPage() {
    const [showDeliveryForm, setShowDeliveryForm] = useState(false);
    const [showCardForm, setShowCardForm] = useState(false);

    const handleAddDeliveryAddressClick = () => setShowDeliveryForm(true);
    const handleCloseDeliveryForm = () => setShowDeliveryForm(false);

    const handleAddCardClick = () => setShowCardForm(true);
    const handleCloseCardForm = () => setShowCardForm(false);

    return (
        <div className="mx-[15%] mb-5 border border-[#007546] rounded-b-[20px] overflow-hidden">
            {/* Top Container */}
            <div className="flex flex-col md:flex-row justify-between gap-5 p-5">
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
                            <button className="w-full h-10 text-base border border-[#007546] rounded-lg transition duration-300 ease-in-out hover:bg-[#007546] hover:text-white">
                                Cash on Delivery
                            </button>
                            <button className="w-full h-10 text-base border border-[#007546] rounded-lg transition duration-300 ease-in-out hover:bg-[#007546] hover:text-white">
                                Card Payment
                            </button>
                        </div>
                    </div>

                    {/* Chosen Products Section */}
                    <div className="chosen-products">
                        {/* <ChosenProduct /> */}
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
                    <DeliveryAddressForm handleClose={handleCloseDeliveryForm} />
                </div>
            )}

            {/* Card Form Modal */}
            {showCardForm && (
                <div className="fixed inset-0 flex justify-center items-center px-[30vw] backdrop-blur-lg">
                    <CardForm handleClose={handleCloseCardForm} />
                </div>
            )}
        </div>
    );
}

export default OrderPage;