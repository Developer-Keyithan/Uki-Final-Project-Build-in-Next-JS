import './AddressCart.css';
import sampleData from '../../Data/AddressData';
import { useEffect, useState } from 'react';
import { TiHome } from "react-icons/ti";
import { MdWork } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";

interface AddressData {
  no?: string | number;
  street?: string;
  town: string;
  division?: string;
  district: string;
  contact: string;
  type: 'home' | 'work-place' | 'other-location';
}

interface AddressCardItemProps {
  data: AddressData;
  isSelected: boolean;
  onClick: () => void;
}

function AddressCardItem({ data, isSelected, onClick }: AddressCardItemProps) {
  let icon: React.ReactNode;
  let name = '';

  if (data.type === 'home') {
    icon = <TiHome />;
    name = 'Home';
  } else if (data.type === 'work-place') {
    icon = <MdWork />;
    name = 'Work Place';
  } else {
    icon = <FaLocationDot />;
    name = 'Undefined Delivery Address';
  }

  const formattedAddress = [
    data.no ? data.no.toString() : '',  // Ensure it's converted to string
    data.street,
    data.town,
    data.division,
  ].filter(Boolean).join(', ');

  return (
    <div
      className={`address-item select ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className='address-name'>
        <i>{icon}</i>
        <h3 className='font-semibold'>{name}</h3>
      </div>
      <div className="address-data">
        <p><span className='font-semibold'>Address:</span> {formattedAddress}</p>
        <p><span className='font-semibold'>District:</span> {data.district}</p>
        <p><span className='font-semibold'>Contact No:</span> +94 {data.contact}</p>
      </div>
    </div>
  );
}

function AddressCard() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    const defaultIndex = sampleData.findIndex((item) => item.type === 'home');
    if (defaultIndex !== -1) {
      setSelectedIndex(defaultIndex);
    }
  }, []);

  const handleClick = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <div className='address-card-container'>
      <h2 className='font-semibold'>Saved Delivery Addresses</h2>
      <div className='address-card'>
        {sampleData.map((item, index) => (
          <AddressCardItem
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

export default AddressCard;
