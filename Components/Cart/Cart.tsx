'use client'

import { useRouter } from 'next/navigation';
import { StaticImageData } from "next/image";
import './Cart.css';
import RatingCart from '../Rating Cart/RatingCart';
import { FaRegHeart } from "react-icons/fa";
import Image from 'next/image';

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
  rating: string;
  productImages: string[] | StaticImageData[];
}

interface CartProps {
  data: ProductData;
}

const Cart: React.FC<CartProps> = ({ data }) => {
  const router = useRouter();
  console.log(data);
  const handleAddToCart = () => {
    // Code to add item to cart
  }

  const image =  data.productImages[0]
  

  return (
    <div className="cart-container">
      <div className="cart-image">
        <Image src={image} alt={data.productName} width={200} height={200} />
      </div>
      <div className="cart-details">
        <h2>{data.productName}</h2>
        <div className="cart-rating">
          <RatingCart rating={data.rating} />
        </div>
        <div className="cart-price">
          <span className="new-price">Rs. {data.price.newPrice}</span>
          <span className="old-price">Rs. {data.price.oldPrice}</span>
        </div>
        <div className="cart-actions">
          <button onClick={handleAddToCart}>Add to Cart</button>
          <FaRegHeart className="heart-icon" />
        </div>
      </div>
    </div>
  );
};

export default Cart;
