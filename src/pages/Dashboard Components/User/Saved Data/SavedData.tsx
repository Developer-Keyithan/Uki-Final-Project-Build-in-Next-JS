'use client'

import { useState } from "react"
import Master from '../../../../Assets/master-card.png'
import Visa from '../../../../Assets/visa-card.png'
import { MdHome, MdWork, MdLocationOn } from "react-icons/md"

const SavedData = () => {
    const [savedData, setSavedData] = useState({
        Addresses: [
            {
                no: '91',
                street: '',
                town: 'Arasadikkulam',
                division: 'Cheddikulam',
                district: 'Vavuniya',
                mobileNumbers: [771234567, 761234567],
                location: 'home'
            }, {
                no: '',
                street: '',
                town: 'Nochchimottai',
                division: 'Omanthai',
                district: 'Vavuniya',
                mobileNumbers: [771234567, 761234567],
                location: 'work place'
            }, {
                no: '72',
                street: '',
                town: 'Arasadikkulam',
                division: 'Cheddikulam',
                district: 'Vavuniya',
                mobileNumbers: [771234567, 761234567],
                location: ''
            }
        ],
        Cards: [
            {
                bank: "People's",
                cardNumber: 1234567891234567,
                cvv: 123,
                expireDate: {
                    month: 8,
                    year: 27
                },
                type: 'visa'
            }, {
                bank: "BOC",
                cardNumber: 9876543219876543,
                cvv: 987,
                expireDate: {
                    month: 8,
                    year: 27
                },
                type: 'master'
            }
        ]
    })

    const getAddress = (address: { no: string, street: string, town: string, division: string }) => {
        const addressParts = [
            address.no,
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
            case 'home':
                return { icon: <MdHome className="inline-block mr-2 align-middle" />, name: 'Home' };
            case 'work place':
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
                    {savedData.Addresses.map((address, index) => {
                        const locationData = renderLocationIcon(address.location);
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
                                        {address.mobileNumbers.map((number, idx) => (
                                            <span key={idx}>
                                                +94 {formatMobileNumber(number)}
                                                {idx < address.mobileNumbers.length - 1 ? ', ' : ''}
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
                    {savedData.Cards.map((card, index) => (
                        <div key={index} className="flex justify-between items-center ring-1 ring-gray-200 rounded-lg p-4">
                            <div className="flex flex-col gap-2 pl-2">
                                <div className="flex items-center gap-1">
                                    <span className="font-semibold">Bank:</span>
                                    <p className="text-gray-700">{card.bank} Bank</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="font-semibold">Card Number:</span>
                                    <p className="text-gray-600">XXXX XXXX XXXX {card.cardNumber.toString().slice(-4)}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="font-semibold">Expire Date:</span>
                                    <p className="text-gray-600">{formatMonth(card.expireDate.month)}/{card.expireDate.year}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 w-24 h-24">
                                {card.type === 'visa' ? (
                                    <img src={Visa.src} alt="Visa" className="w-full h-full" />
                                ) : (
                                    <img src={Master.src} alt="Master" className="w-full" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SavedData;