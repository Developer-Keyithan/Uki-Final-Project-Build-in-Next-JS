'use client'

import { useState, useEffect } from "react";
import Master from '../../../../Assets/master-card.png';
import Visa from '../../../../Assets/visa-card.png';
import { MdHome, MdWork, MdLocationOn } from "react-icons/md";
import axios from "axios";

interface Address {
    no: number;
    street: string;
    town: string;
    division: string;
    district: string;
    contactNumber: number[];
    place: string;
}

interface Card {
    bankName: string;
    cardNumber: number;
    cvv: number;
    expireDate: {
        month: number;
        year: number;
    };
    type: string;
}

const SavedData = () => {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [cards, setCards] = useState<Card[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAddressesAndCards = async () => {
            try {
                const cookieResponse = await axios.get('/api/cookie');
                console.log('Cookie Response:', cookieResponse.data);

                if (cookieResponse.status === 200 && cookieResponse.data?.user.id) {
                    const addressApiResponse = await axios.post('/api/delivery-address/get-by-userId', { userId: cookieResponse.data?.user.id });
                    console.log('Address API Response:', addressApiResponse.data);

                    const cardApiResponse = await axios.post('/api/card/get-by-userId', { userId: cookieResponse.data?.user.id });
                    console.log('Card API Response:', cardApiResponse.data);

                    setAddresses(addressApiResponse.data?.userDeliveryAddress || []);
                    setCards(cardApiResponse.data?.cards || []);
                }
            } catch (error) {
                console.error("Error fetching data: ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAddressesAndCards();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    const getAddress = (address: { no: number, street: string, town: string, division: string }) => {
        const addressParts = [
            String(address.no),
            address.street,
            address.town,
            address.division
        ];
        return addressParts.filter(part => part.trim() !== '').join(', ');
    };

    const formatMonth = (month: number) => {
        return month < 10 ? `0${month}` : month.toString();
    };

    const formatMobileNumber = (number: number) => {
        const numberString = number.toString(); // Convert number to string
        return `${numberString.slice(0, 2)} ${numberString.slice(2, 5)} ${numberString.slice(5)}`; // Format as "77 123 4567"
    };

    const renderLocationIcon = (location: string) => {
        switch (location) {
            case 'Home':
                return { icon: <MdHome className="inline-block mr-2 align-middle" />, name: 'Home' };
            case 'Work Place':
                return { icon: <MdWork className="inline-block mr-2 align-middle" />, name: 'Work Place' };
            default:
                return { icon: <MdLocationOn className="inline-block mr-2 align-middle" />, name: 'Undefined' };
        }
    };

    return (
        <div className="flex gap-8 my-8">
            <div className="w-1/2">
                <h2 className="text-2xl font-bold mb-5 text-gray-800">Saved Addresses</h2>
                <div className="space-y-3 w-full">
                    {Array.isArray(addresses) && addresses.map((address, index) => {
                        const locationData = renderLocationIcon(address.place);
                        return (
                            <div key={index} className="ring-1 ring-gray-200 rounded-lg py-3 px-4 hover:shadow-lg transition ease-in-out duration-300">
                                <div className="flex items-center mb-2">
                                    <span className="text-xl pb-1">{locationData.icon}</span>
                                    <p className="text-lg font-semibold">{locationData.name} Address</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="font-semibold">Address:</span>
                                    <p>{getAddress(address)}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="font-semibold">District:</span>
                                    <p>{address.district}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="font-semibold">Mobile Numbers:</span>
                                    <p>
                                        {address.contactNumber?.map((number, idx) => (
                                            <span key={idx}>
                                                +94 {formatMobileNumber(number)}
                                                {idx < address.contactNumber.length - 1 ? ', ' : ''}
                                            </span>
                                        ))}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="w-1/2">
                <h2 className="text-2xl font-bold mb-5 text-gray-800">Saved Cards</h2>
                <div className="space-y-3 w-full">
                    {Array.isArray(cards) && cards.map((card, index) => (
                        <div key={index} className="flex justify-between items-center ring-1 ring-gray-200 rounded-lg p-4 hover:shadow-lg transition ease-in-out duration-300">
                            <div className="flex flex-col gap-2 pl-2">
                                <div className="flex items-center gap-1">
                                    <span className="font-semibold">Bank:</span>
                                    <p>{card.bankName}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="font-semibold">Card Number:</span>
                                    <p>XXXX XXXX XXXX {card.cardNumber.toString().slice(-4)}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="font-semibold">Expire Date:</span>
                                    <p>{formatMonth(card.expireDate.month)}/{card.expireDate.year}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 w-24 h-24">
                                {card.type === 'visa' ? (
                                    <img src={Visa.src} alt="Visa" className="w-full h-full object-contain" />
                                ) : (
                                    <img src={Master.src} alt="Master" className="w-full h-full object-contain" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SavedData;