import './style.css'

import AddressCart from '../../../Components/Address Cart/AddressCart'
import CardsCart from '../../../Components/Cards Cart/CardsCart'
import AddOne from '../../../Components/Add One/AddOne'
import OrderOverview from '../../../Components/OrderOverview/OrderOverview'
import Coupon from '../../../Components/Coupon/Coupon'
import ChosenProduct from '../../../Components/Chosen Product/ChosenProduct'

function OrderPage() {
    return (
        <div className='orderpage-container'>
            <div className='top-container'>
                <div className='left-content'>
                    <div className="add-cards">
                        <AddOne textContent='Add New Delivery Address' />
                        <AddOne textContent='Add New Card' />
                    </div>

                    <div className="payment-method">
                        <h2>Payment Method</h2>
                        <div className='payment-btns'>
                            <button className="payment-btn">Cash on Delivery</button>
                            <button className="payment-btn">Card Payment</button>
                        </div>
                    </div>

                    <div className="chosen-products">
                        <ChosenProduct />
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

        </div>
    )
}

export default OrderPage
