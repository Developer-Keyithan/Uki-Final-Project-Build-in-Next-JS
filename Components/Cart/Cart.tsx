'use client'

import { useRouter } from 'next/navigation';
import { StaticImageData } from "next/image";
// import './Cart.css';
import RatingCart from '../Rating Cart/RatingCart';
import Image from 'next/image';
import { BiCart } from 'react-icons/bi';
import { IoCartOutline } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import { GoHeart, GoHeartFill } from 'react-icons/go';
import productImage from '../../Assets/Hero.jpg'
import axios from 'axios';
import { toast } from 'react-toastify';

interface ProductData {
  id: string;
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
  productImages: string[] | StaticImageData[];
}

interface CartProps {
  data: ProductData;
}

const Cart: React.FC<CartProps> = ({ data }) => {
  const [isHover, setIsHover] = useState(false);
  const [userId, setUserId] = useState<string>('')
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await axios.get('api/cookie')
      setUserId(user.data.user.id)
    }

    fetchUser();
  }, [])


  const handleAddToCart = async () => {
    const id = data._id
    try {
      const response = await axios.post('/api/cart', {
        userId, productId: id, value: 1, unit: 'kg'
      })

      if (response.status === 200) {
        toast.success("Item added to cart");
      }
    } catch (error) {
      toast.error("Unable to add cart item");
    }
  }

  const handleHover = () => {
    setIsHover(true);
  }

  const handleNotHover = () => {
    setIsHover(false);
  }

  const image = data.productImages?.[0]

  const handleProduct = () => {
    const id = data._id
    router.push(`/overview/${id}`)
  }

  return (
    <div className="ring-1 ring-gray-500 rounded-md overflow-hidden relative w-[calc((100%-100px)/6)] cursor-pointer">
      <div onClick={handleProduct}>
        <div className="">
          <Image src={image || productImage} alt={data.productName || 'Product Image'} width={200} height={200} />
        </div>
        <div className="px-4">
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
      <div className="cart-actions px-4 mb-4">
        <button onClick={handleAddToCart} className='flex  items-center gap-2 bg-primaryColor text-white hover:bg-secondaryButtonColor rounded-full py-1 px-4 mt-4 transition ease-in-out duration-500'>Add to Cart <IoCartOutline /></button>
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
