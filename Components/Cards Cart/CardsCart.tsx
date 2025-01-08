import './CardsCart.css';
import sampleData from '../../Data/CardData';
import visa from '../../Assets/visa-card.png';
import master from '../../Assets/master-card.png';

import { useEffect, useState } from 'react';
import Image, { StaticImageData } from 'next/image';

interface BankCard {
  bank: string;
  cardNo: string;
  expireDate: string;
  savedDate: string;
  type: 'master' | 'visa';
  default: boolean;
}

interface CardsCardItemProps {
  data: BankCard;
  isSelected: boolean;
  onClick: () => void;
}

function CardsCardItem({ data, isSelected, onClick }: CardsCardItemProps) {
  let card: StaticImageData | string = '';
  let alt = '';

  if (data.type === 'visa') {
    card = visa;
    alt = 'Visa Card';
  } else {
    card = master;
    alt = 'Master Card';
  }

  const maskCardNumber = (cardNumber: string) => {
    const cardNumStr = cardNumber.replace(/\D/g, '');
    if (cardNumStr.length === 16) {
      return `${cardNumStr.slice(0, 4)} ${cardNumStr.slice(4, 8).replace(/\d/g, 'X')} ${cardNumStr.slice(8, 12).replace(/\d/g, 'X')} ${cardNumStr.slice(12)}`;
    }
    return cardNumber;
  };

  const maskedCardNumber = maskCardNumber(data.cardNo);

  return (
    <div className={`cards-item select ${isSelected ? 'selected' : ''}`} onClick={onClick}>
      <div className='cards-content'>
        <h3 className='card-name font-semibold'>{data.bank}</h3>
        <div className="card-data">
          <p><span className='font-semibold'>Card Number:</span> {maskedCardNumber}</p>
          <p><span className='font-semibold'>Expire Date:</span> {data.expireDate}</p>
          <p><span className='font-semibold'>Saved Date:</span> {data.savedDate}</p>
        </div>
      </div>

      <div className='cards-type'>
        <Image src={card} alt={alt} />
      </div>
    </div>
  );
}

function CardsCard() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    const defaultIndex = sampleData.findIndex((item) => item.default === true);
    if (defaultIndex !== -1) {
      setSelectedIndex(defaultIndex);
    }
  }, []);

  const handleClick = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <div className='card-card-container'>
      <h2 className='font-semibold'>Saved Cards Details</h2>
      <div className='card-card'>
        {sampleData.map((item, index) => (
          <CardsCardItem
            key={index}
            data={item}
            isSelected={index === selectedIndex}
            onClick={() => handleClick(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default CardsCard;
