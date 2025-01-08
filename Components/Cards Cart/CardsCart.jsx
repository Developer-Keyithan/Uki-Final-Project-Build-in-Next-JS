import './CardsCart.css';
import sampleData from '../../Data/CardData';

import visa from '../../Assets/visa-card.png'
import master from '../../Assets/master-card.png'

import { useEffect, useState } from 'react';

import { TiHome } from "react-icons/ti";
import { MdWork } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import Image from 'next/image';

function CardsCardItem({ data, isSelected, onClick }) {
    let card = '';
    let alt = '';
    if (data.type === 'visa') {
        card = visa;
        alt = 'Visa Card';
    } else {
        card = master
        alt = 'Master Card';
    }

    const maskCardNumber = (cardNumber) => {
        const cardNumStr = cardNumber.toString().replace(/\D/g, '');
        if (cardNumStr.length === 16) {
            return `${cardNumStr.slice(0, 4)} ${cardNumStr.slice(4, 8).replace(/\d/g, 'X')} ${cardNumStr.slice(8, 12).replace(/\d/g, 'X')} ${cardNumStr.slice(12)}`;
        }
        return cardNumber;
    };

    const maskedCardNumber = maskCardNumber(data.cardNo);
    return (
        <div className={`cards-item select ${isSelected ? 'selected' : ''}`} onClick={onClick}>
            <div className='cards-content'>
                <h3 className='card-name'>{data.bank}</h3>
                <div className="card-data">
                    <p><strong>Card Number:</strong> {maskedCardNumber}</p>
                    <p><strong>Expire Date:</strong> {data.expireDate}</p>
                    <p><strong>Saved Date:</strong> {data.savedDate}</p>
                </div>
            </div>

            <div className='cards-type'>
                <Image src={card} alt={alt} />
            </div>
        </div>
    );
}

function CardsCard() {
    const [selectedIndex, setSelectedIndex] = useState(null);

    useEffect(() => {
        const defaultIndex = sampleData.findIndex((item) => item.default === true);
        if (defaultIndex !== -1) {
            setSelectedIndex(defaultIndex);
        }
    }, []);

    const handleClick = (index) => {
        setSelectedIndex(index);
    };

    return (
        <div className='card-card-container'>
            <h2>Saved Cards Details</h2>
            <div className='card-card'>
                {sampleData.map((item, index) => (
                    <CardsCardItem key={index} data={item} isSelected={index === selectedIndex} onClick={() => handleClick(index)} />
                ))}
            </div>
        </div>
    );
}

export default CardsCard;
