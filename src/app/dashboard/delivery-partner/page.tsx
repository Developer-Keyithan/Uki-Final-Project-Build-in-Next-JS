'use client'

import { useEffect, useState } from "react";
import axios from "axios";
import '../../globals.css'
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import { toast } from "react-toastify";

interface Product {
  _id: string;
  productId: {
    productName: string
  }
  price: number;
  quantity: {
    unit: string;
    value: number;
  };
  isCanceled: boolean;
  isDelayed: boolean;
}

interface Order {
  _id: string
  products: Product[];
  isCashOnDelivery: boolean;
  isCanceled: boolean;
  updatedAt: Date;
  createdAt: Date;
}

const adminDashboard = () => {
  const [user, setUser] = useState({
    _id: '',
    firstName: '',
    lastName: '',
    email: '',
    userType: ''
  })

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const findUser = async () => {
      const response = await axios.get('/api/cookie');

      if (response.status === 200 && response.data.user) {
        const id = response.data.user.id;
        const apiResponse = await axios.post('/api/user/get-user', {
          userId: id
        });

        setUser(apiResponse.data.user)
      }
    }

    findUser()
  }, [])


  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const orders = await axios.get('/api/order')
        setOrders(orders.data.orders)
      } catch (error) {
        console.log(error)
        toast.error('Failed to fetch orders');
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    }

    fetchAllOrders()
  }, [])

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-primaryColor text-white px-4 py-2 rounded hover:bg-primaryButtonHoverColor transition ease-in-out duration-300"
        >
          Retry
        </button>
      </div>
    );
  }

  const convertToKilograms = (quantity: { unit: string; value: number }) => {
    return quantity.unit === 'g' ? quantity.value / 1000 : quantity.value;
  };

  if (loading) {
    return <div className="text-center py-8">Loading orders...</div>;
  }

  return (
    <div className="min-h-[100vh] relative">
      <div className="sticky top-0 z-50">
        <Navbar />
        <hr />
      </div>
      <div className="mx-60">
        {user && (
          <div className="flex items-center justify-end text-sm py-4 text-gray-500">
            <span className="font-semibold text-primary mr-2">
              {user.firstName} {user.lastName}
            </span>
            <span className="mr-2">|</span>
            <span className="capitalize mr-2">{user.userType}</span>
            <span className="mr-2">|</span>
            <span>{user.email}</span>
          </div>
        )}
      </div>
      <div className="mx-60">
        <div className="flex justify-between">
          <div className='mb-8'>
            {orders.length === 0 ? (
              <p>No orders found</p>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {orders.map((order) => {
                  const totalAmount = order.products.reduce(
                    (total, product) => total + convertToKilograms(product.quantity) * product.price,
                    0
                  );

                  return (
                    <div key={order._id} className="flex flex-col gap-6 ring-1 ring-gray-300 p-4 rounded-lg">
                      <div className="text-xl font-semibold text-primaryColor">
                        <span>Order ID: </span>
                        <span className="uppercase">{order._id}</span>
                      </div>
                      <div>
                        {order.products.map((product) => {
                          const quantityInKg = convertToKilograms(product.quantity);
                          const subtotal = quantityInKg * product.price;

                          return (
                            <div key={product._id} className="flex gap-8 p-4 border-b-[1px] first:border-t-[1px] border-gray-300 w-full items-center">
                              <div className="flex flex-col justify-between w-full">
                                <h4 className="text-2xl font-semibold">{product.productId.productName}</h4>
                                <div className="grid grid-cols-3">
                                  <div>
                                    <p className="text-sm text-gray-500 font-semibold">Amount:</p>
                                    <p>LKR {subtotal.toFixed(2)}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500 font-semibold">Quantity:</p>
                                    <p>{product.quantity.value} {product.quantity.unit}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500 font-semibold">Status:</p>
                                    <p className={`${product.isCanceled ? 'text-red-700 bg-red-100' : product.isDelayed ? 'text-orange-700 bg-orange-100' : 'text-green-700 bg-green-100'} w-max py-1 px-2 rounded-full`}>
                                      {product.isCanceled ? "Order canceled" : product.isDelayed ? "Order delayed" : "Order still active"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <p className="text-lg text-primaryColor font-semibold">Ordered At: </p>
                          <p>{new Date(order.updatedAt).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}</p>
                        </div>
                        <div>
                          <p className="text-lg text-primaryColor font-semibold">Payment method:</p>
                          <p>{order.isCashOnDelivery ? "Cash on Delivery" : "Card Payment"}</p>
                        </div>
                        <div>
                          <p className="text-lg text-primaryColor font-semibold">Total Amount:</p>
                          <p>LKR {totalAmount.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default adminDashboard;
