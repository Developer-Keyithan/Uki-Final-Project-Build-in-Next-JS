import './ProductCart.css';
import { useState } from 'react';
import RatingCart from '../Rating Cart/RatingCart';
import Button from '../Button/Button';

import { IoIosArrowBack, IoIosArrowForward, IoIosRemove, IoIosAdd } from "react-icons/io";
import { IoShareSocialSharp } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import Link from 'next/link';
import { StaticImageData } from 'next/image';
import Image from 'next/image';

interface ProductCartProps {
  image: string | StaticImageData;
  relatedImages: (string | StaticImageData)[];
  name: string;
  description: string;
  rating: string;
  district: string;
  freshness: string;
  agricationMethod: string;
  newPrice: string;
  oldPrice: string;
}

const ProductCart = ({
  image,
  relatedImages,
  name,
  description,
  rating,
  district,
  freshness,
  agricationMethod,
  newPrice,
  oldPrice
}: ProductCartProps) => {

  const [quantity, setQuantity] = useState<number>(100);
  const [unit, setUnit] = useState<'grams' | 'kilograms'>('grams');

  const totalPrice = unit === 'grams' ? (quantity * parseFloat(newPrice) / 1000) : (quantity * parseFloat(newPrice));

  const discount = Math.round(((parseFloat(oldPrice) - parseFloat(newPrice)) / parseFloat(oldPrice)) * 100 * 2) / 2;

  const handleQuantityClick = (amount: number, unitType: 'grams' | 'kilograms') => {
    setQuantity(amount);
    setUnit(unitType);
  };

  const adjustQuantity = (adjustment: number) => {
    let newQuantity: number = 0;
    if (unit === 'grams') {
      newQuantity = quantity + (adjustment * 50);
    } else if (unit === 'kilograms') {
      newQuantity = quantity + (adjustment * 1);
    }

    if (newQuantity < 0) newQuantity = 0;
    setQuantity(newQuantity);
  };

  const handleSelectUnit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUnit(event.target.value as 'grams' | 'kilograms');
  };

  return (
    <div className='productcart-container'>
      <div className="product-images">
        <div className="main-image">
          <Image src={image} className='img' alt="Main product image" />
        </div>
        <div className="related-images">
          <button><IoIosArrowBack /></button>
          {relatedImages.map((img, index) => (
            <div className="related-image" key={index}>
              <Image className='related-img' src={img as string} alt={`Related image ${index + 1}`} />
            </div>
          ))}
          <button><IoIosArrowForward /></button>
        </div>

      </div>

      <div className="product-overview-content">
        <h1>{name}</h1>
        <p>{description}</p>

        <div className='product-content-icons'>
          <i><RatingCart /></i>
          <div className="extra-icons">
            <i><IoShareSocialSharp /></i>
            <i><FaRegHeart /></i>
          </div>
        </div>

        <div className="extra-product-info">
          <p>From: {district}</p>
          <p>Freshness: {freshness}</p>
          <p>Agriculture Method: {agricationMethod}</p>
        </div>

        <div className="price">
          <h1>Rs. {newPrice}</h1>
          <p><span>Rs. {oldPrice}</span><b> -{discount}%</b></p>
        </div>

        <div className="quantity">
          <h2>Quantity</h2>
          <div className="select-quantity">
            <button onClick={() => handleQuantityClick(200, 'grams')}>200 grams</button>
            <button onClick={() => handleQuantityClick(250, 'grams')}>250 grams</button>
            <button onClick={() => handleQuantityClick(500, 'grams')}>500 grams</button>
            <button onClick={() => handleQuantityClick(1, 'kilograms')}>1 kilogram</button>
            <button onClick={() => handleQuantityClick(2, 'kilograms')}>2 kilograms</button>
            <button onClick={() => handleQuantityClick(3, 'kilograms')}>3 kilograms</button>
            <button onClick={() => handleQuantityClick(5, 'kilograms')}>5 kilograms</button>
          </div>
          <div className="enter-quantity">
            <div className='quantity-display'>
              <button className='decrease' onClick={() => adjustQuantity(-1)}><IoIosRemove /></button>
              <p contentEditable suppressContentEditableWarning onBlur={(e) => {
                const newQuantity = parseInt(e.target.textContent as string, 10) || (unit === 'grams' ? 100 : 1);
                setQuantity(newQuantity);
              }}>
                {quantity}
              </p>
              <button className='increase' onClick={() => adjustQuantity(1)}><IoIosAdd /></button>
            </div>
            <label><input type="radio" name="quantityUnit" checked={unit === 'grams'} onChange={() => setUnit('grams')} />Grams</label>
            <label><input type="radio" name="quantityUnit" checked={unit === 'kilograms'} onChange={() => setUnit('kilograms')} />Kilograms</label>
          </div>
        </div>

        <div className="product-buying-options">
          <h2>Total Price: Rs. {totalPrice.toFixed(2)}</h2>
          <div className="buy-btns">
            <Link href="/order">
              <Button textContent="Buy Now" style={{ background: '#007546' }} />
            </Link>
            <Button textContent="Add to Cart" style={{ background: '#FF8000' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCart;
