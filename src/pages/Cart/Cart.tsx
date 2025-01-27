'use client'

import { useRouter } from 'next/navigation';
import { StaticImageData } from "next/image";
// import './Cart.css';
import RatingCart from '../Rating Cart/RatingCart';
import Image from 'next/image';
import { BiCart } from 'react-icons/bi';
import { IoCartOutline } from 'react-icons/io5';
import { useState } from 'react';
import { GoHeart, GoHeartFill } from 'react-icons/go';

interface ProductData {
  id: string;
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
  const router = useRouter();
  const handleAddToCart = () => {
    // Code to add item to cart
  }

  const handleHover = () => {
    setIsHover(true);
  }

  const handleNotHover = () => {
    setIsHover(false);
  }

  const image = data.productImages[0]


  return (
    <div className="ring-1 ring-gray-500 rounded-md overflow-hidden relative w-[calc((100%-100px)/6)]">
      <div className="">
        <Image src={image} alt={data.productName || 'Product Image'} width={200} height={200} />
      </div>
      <div className="p-4">
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
        <div className="cart-actions">
          <button className='flex  items-center gap-2 bg-primaryColor text-white hover:bg-secondaryButtonColor rounded-full py-1 px-4 mt-4 transition ease-in-out duration-500' onClick={handleAddToCart}>Add to Cart <IoCartOutline /></button>
        </div>
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
