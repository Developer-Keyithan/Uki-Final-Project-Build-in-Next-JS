import { useState } from 'react';
import './style.css';
import { IoClose } from "react-icons/io5";

interface FormState {
    no: string;
    street: string;
    town: string;
    division: string;
    district: string;
    contactNumbers: string[];
}

interface DeliveryAddressFormProps {
    handleClose: () => void;
}

const DeliveryAddressForm: React.FC<DeliveryAddressFormProps> = ({ handleClose }) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [isAddNumberDisabled, setAddNumberDisabled] = useState(false);
    const [isAddContactClicked, setAddContactClicked] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    const handleDistrictSelect = (district: string) => {
        setSelectedDistrict(district);
        setDropdownOpen(false);
    };

    const [formState, setFormState] = useState<FormState>({
        no: '',
        street: '',
        town: '',
        division: '',
        district: '',
        contactNumbers: [''],
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleInputChange = (field: keyof FormState, value: string) => {
        setFormState({ ...formState, [field]: value });
        if (errors[field]) {
            setErrors({ ...errors, [field]: '' });
        }
    };

    const handleContactNumberChange = (index: number, value: string) => {
        const updatedNumbers = [...formState.contactNumbers];
        updatedNumbers[index] = value;
        setFormState({ ...formState, contactNumbers: updatedNumbers });
    };

    const handleAddNewMobileNumber = () => {
        if (formState.contactNumbers.length < 2) {
            setFormState({ ...formState, contactNumbers: [...formState.contactNumbers, ''] });
            setAddNumberDisabled(true);
            setAddContactClicked(true);
        }
    };

    const handleCancelContactNumber = () => {
        setFormState({
            ...formState,
            contactNumbers: formState.contactNumbers.slice(0, 1),
        });
        setAddNumberDisabled(false);
        setAddContactClicked(false);
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formState.town) newErrors.town = 'Town is required';
        if (!formState.division) newErrors.division = 'Division is required';
        if (!selectedDistrict) newErrors.district = 'District is required';
        formState.contactNumbers.forEach((number, index) => {
            if (!number) newErrors[`contactNumbers.${index}`] = 'Contact number is required';
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (validateForm()) {
            console.log('Form Submitted:', formState);
        } else {
            console.log('Validation Errors:', errors);
        }
    };

    return (
        <div className='relative'>
            <form className='w-full p-5 border-[1px] rounded-lg border-gray-400 bg-white' onSubmit={handleSubmit}>
                <p className='text-xl font-semibold pt-5 pb-10 text-center'>Add New Delivery Address</p>

                <fieldset className='border-[1px] border-black rounded-md p-5 flex flex-col gap-3 transition-all ease-in-out duration-300 overflow-hidden'>
                    <legend className='p-2'>Delivery Address Details</legend>

                    <div className='grid grid-cols-2 gap-3'>
                        <input
                            type="text"
                            placeholder="House/Building Number"
                            value={formState.no}
                            onChange={(e) => handleInputChange('no', e.target.value)}
                            className='border-[1px] border-gray-300 rounded-sm py-1 px-3 focus:outline-green-900'
                        />

                        <input
                            type="text"
                            placeholder="Street"
                            value={formState.street}
                            onChange={(e) => handleInputChange('street', e.target.value)}
                            className='border-[1px] border-gray-300 rounded-sm py-1 px-3 focus:outline-green-900'
                        />

                        <div>
                            <input
                                type="text"
                                placeholder="Town"
                                value={formState.town}
                                onChange={(e) => handleInputChange('town', e.target.value)}
                                className={`border-[1px] ${errors.town ? 'border-red-500' : 'border-gray-300'} rounded-sm py-1 px-3 focus:outline-green-900 w-full`}
                            />
                            {errors.town && <p style={{ color: 'red' }}>{errors.town}</p>}
                        </div>

                        <div>
                            <input
                                type="text"
                                placeholder="Division"
                                value={formState.division}
                                onChange={(e) => handleInputChange('division', e.target.value)}
                                className={`border-[1px] ${errors.division ? 'border-red-500' : 'border-gray-300'} rounded-sm py-1 px-3 focus:outline-green-900 w-full`}
                            />
                            {errors.division && <p style={{ color: 'red' }}>{errors.division}</p>}
                        </div>
                    </div>

                    <div className='border-[1px] border-green-900 rounded-sm overflow-hidden'>
                        <button
                            type="button"
                            onClick={toggleDropdown}
                            aria-expanded={isDropdownOpen}
                            className='w-full py-1 cursor-pointer bg-green-900 text-white hover:bg-green-800 transition ease-in-out duration-300'
                        >
                            {selectedDistrict || 'Select Your District'}
                        </button>
                        <div
                            className={`grid grid-cols-5 gap-2 transition-all ease-in-out duration-300 px-2 ${isDropdownOpen ? 'max-h-[300px] my-2' : 'max-h-0 overflow-hidden'}`}
                            role="listbox"
                        >
                            {['Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar', 'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'].map(
                                (district) => (
                                    <p
                                        key={district}
                                        onClick={() => handleDistrictSelect(district)}
                                        className='cursor-pointer text-center border-[1px] border-gray-300 py-1 rounded-sm hover:bg-green-800 hover:text-white transition ease-in-out duration-300 hover:border-green-800'
                                        role="option"
                                        aria-selected={selectedDistrict === district ? 'true' : 'false'}
                                    >
                                        {district}
                                    </p>
                                )
                            )}
                        </div>
                    </div>
                    <div>
                        <p>This Address is</p>
                        <div className='flex justify-between mt-2'>
                            <label className='flex items-center gap-2 cursor-pointer' htmlFor="home-address"><input type="radio" name='delivery-place' id='home-address' className='cursor-pointer' />Home Address</label>
                            <label className='flex items-center gap-2 cursor-pointer' htmlFor="work-place-address"><input type="radio" name='delivery-place' id='work-place-address' className='cursor-pointer' />Work Place Address</label>
                            <label className='flex items-center gap-2 cursor-pointer' htmlFor="institution-address"><input type="radio" name='delivery-place' id='institution-address' className='cursor-pointer' />Institution Address</label>
                            <label className='flex items-center gap-2 cursor-pointer' htmlFor="other-address"><input type="radio" name='delivery-place' id='other-address' className='cursor-pointer' />Other Address</label>
                        </div>
                    </div>
                </fieldset>

                <fieldset
                    className='border-[1px] border-black rounded-md p-5 grid gap-3 transition ease-in-out duration-1000 mt-5'
                    style={{
                        gridTemplateColumns: isAddContactClicked ? '1fr 1fr 0.5fr' : '1fr 1fr',
                    }}
                >
                    <legend className='p-2'>Contact Numbers</legend>
                    {formState.contactNumbers.map((number, index) => (
                        <div key={index}>
                            <input
                                type="number"
                                placeholder="Contact Number"
                                value={number}
                                onChange={(e) => handleContactNumberChange(index, e.target.value)}
                                className={`border-[1px] ${errors[`contactNumbers.${index}`] ? 'border-red-500' : 'border-gray-300'} rounded-sm py-1 px-3 focus:outline-green-900 w-full h-9 `}
                            />
                            {errors[`contactNumbers.${index}`] && (
                                <p style={{ color: 'red' }}>{errors[`contactNumbers.${index}`]}</p>
                            )}
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={handleAddNewMobileNumber}
                        disabled={isAddNumberDisabled}
                        style={{ display: isAddNumberDisabled ? 'none' : 'inline-block' }}
                        className='w-full rounded-sm py-1 cursor-pointer bg-green-900 text-white hover:bg-green-800 transition ease-in-out duration-300 h-9'
                    >
                        Add a Contact Number
                    </button>

                    {isAddContactClicked && (
                        <button
                            type="button"
                            onClick={handleCancelContactNumber}
                            className='w-full rounded-sm py-1 cursor-pointer bg-red-800 text-white hover:bg-red-700 transition ease-in-out duration-300 h-9'
                        >
                            Cancel
                        </button>
                    )}
                </fieldset>

                <button
                    className='w-full rounded-sm py-2 cursor-pointer bg-green-900 text-white hover:bg-green-800 transition ease-in-out duration-300 mt-5'
                    type="submit"
                >
                    Save Address
                </button>
            </form>
            <button className="absolute top-[8px] right-[8px] text-xl hover:bg-red-800 hover:text-white rounded-full transition ease-in-out duration-300 p-[1px]" onClick={handleClose}>
                <IoClose />
            </button>
        </div>
    );
};

export default DeliveryAddressForm;
