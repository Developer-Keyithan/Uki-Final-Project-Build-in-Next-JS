'use client'

import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Calendar from '../Calendar/Calendar';
import { toast } from 'react-toastify';
import { IoClose } from 'react-icons/io5';

interface CardFormProps {
    handleClose: () => void;
}

interface Product {
    userId: string;
    ProductImage: string;
    productName: string;
    productDescription: string;
    price: number | undefined;
    categories: string[];
    harvestingDate: string;
    agricationMethod: string;
    stockValue: string;
    unit: string;
}

const UploadProduct: React.FC<CardFormProps> = ({ handleClose }) => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [productName, setProductName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [newPrice, setNewPrice] = useState<number | undefined>(undefined);
    const [district, setDistrict] = useState<string>('');
    const [agricationMethod, setAgricationMethod] = useState<string>('');
    const [stock, setStock] = useState<string>('');
    const [unit, setUnit] = useState<string>('');
    const [categories, setCategories] = useState<string[]>([]);
    const [harvestingDate, setHarvestingDate] = useState<string>('');
    const [product, setProduct] = useState<Product | null>(null);
    const [userId, setUserId] = useState<string>('')
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isCalenderOpen, setIsCalenderOpen] = useState<boolean>(false);

    const categoryOptions = ["Fruits", "Vegetables", "Cereals", "Legumes", "Tubers", "Oilseeds", "Cotton", "Tobacco", "Beverages", "Forage", "Herbs", "Flowers", "Grains", "Citrus", "Spice", "Dairy", "Meat"];

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await axios.get('/api/cookie');
                setUserId(data.user.id)
            } catch (error) {
                console.log(error)
            }
        };

        fetchUser();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);

            // Create preview
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setPreviewUrl(event.target.result as string);
                }
            };
            reader.readAsDataURL(selectedFile);
        }
    };


    const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCategories(prev =>
            prev.includes(value) ? prev.filter(cat => cat !== value) : [...prev, value]
        );
    };

    const handleUnitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUnit(e.target.value);  // Set the unit directly
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileType', 'product');
        formData.append('userId', userId);

        try {
            const response = await fetch('/api/s3-upload', {
                method: 'POST',
                body: formData
            });

            if (response.status === 200) {
                const data = await response.json();
                const url = data.imageUrl;

                setUploading(false);

                // Prepare product data here with the latest state values
                const newProduct = {
                    userId,
                    ProductImage: url,
                    productName,
                    productDescription: description,
                    price: newPrice,
                    categories,
                    harvestingDate,
                    agricationMethod,
                    stockValue: stock,
                    unit
                };

                // Update the product state with the latest values
                setProduct(newProduct);
                console.log(newProduct);

                const addProduct = await axios.post('/api/product', {
                    newProduct
                })

                if (addProduct.status === 201) {
                    toast.success('Product uploaded.')
                }

            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to upload product.');
            setUploading(false);
        }
    };

    // Function to format the "time ago" string
    const timeAgo = (dateString: string) => {
        const now = new Date();
        const date = new Date(dateString);
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) {
            return `${seconds} second${seconds === 1 ? '' : 's'} ago`;
        }
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) {
            return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
        }
        const hours = Math.floor(minutes / 60);
        if (hours < 24) {
            return `${hours} hour${hours === 1 ? '' : 's'} ago`;
        }
        const days = Math.floor(hours / 24);
        if (days < 7) {
            return `${days} day${days === 1 ? '' : 's'} ago`;
        }
        const weeks = Math.floor(days / 7);
        if (weeks < 4) {
            return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
        }
        const months = Math.floor(weeks / 4);
        if (months < 12) {
            return `${months} month${months === 1 ? '' : 's'} ago`;
        }
        const years = Math.floor(months / 12);
        return `${years} year${years === 1 ? '' : 's'} ago`;
    };

    return (
        <div className="relative mx-60 p-6 bg-white rounded-lg ring-1 ring-gray-300 shadow-sm">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Upload Your New Product</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* File Upload */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Product Image</label>
                    <div className="flex items-center gap-4">
                        <label className="flex flex-col items-center px-4 py-6 bg-white text-primaryColor rounded-lg border-2 border-dashed border-primaryColor cursor-pointer hover:bg-green-50">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                            </svg>
                            <span className="mt-2 text-sm">Upload your product image</span>
                            <input type="file" className="hidden" onChange={handleFileChange} required />
                        </label>
                        {previewUrl && (
                            <div className="w-28 h-28">
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="rounded h-full w-full object-cover"
                                />
                            </div>
                        )}
                        {/* {file && <span className="text-gray-600 text-sm mt-24">{file.name}</span>} */}
                    </div>
                </div>

                {/* Product Name */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Product Name</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-md outline-primaryColor"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                    />
                </div>

                <div className='grid grid-cols-4 items-center gap-6'>
                    {/* Price */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Price</label>
                        <div className="relative">
                            <input
                                type="number"
                                className="w-full px-4 py-2 border rounded-md outline-primaryColor no-spinner"
                                placeholder="0.00 LKR"
                                value={newPrice || ''}
                                onChange={(e) => setNewPrice(Number(e.target.value))}
                                required
                            />
                        </div>
                    </div>

                    {/* District */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">District</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-md outline-primaryColor"
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            required
                        />
                    </div>

                    {/* Stock */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Available Stock</label>
                        <input
                            type="number"
                            className="w-full px-4 py-2 border rounded-md outline-primaryColor no-spinner"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            required
                        />
                    </div>

                    {/* Unit Selection */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Available Stock Unit</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 py-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="unit"
                                    value="gram"
                                    checked={unit === "gram"}
                                    onChange={handleUnitChange}
                                    className="accent-primaryColor cursor-pointer"
                                />
                                Gram
                            </label>
                            <label className="flex items-center gap-2 py-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="unit"
                                    value="kg"
                                    checked={unit === "kg"}
                                    onChange={handleUnitChange}
                                    className="accent-primaryColor cursor-pointer"
                                />
                                Kilogram
                            </label>
                        </div>
                    </div>

                    {/* Agriculture Method */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Farming Method</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="agricationMethod"
                                    value="Organic"
                                    onChange={(e) => setAgricationMethod(e.target.value)}
                                    className="accent-primaryColor cursor-pointer"
                                />
                                Organic
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="agricationMethod"
                                    value="Conventional"
                                    onChange={(e) => setAgricationMethod(e.target.value)}
                                    className="accent-primaryColor cursor-pointer"
                                />
                                Conventional
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="agricationMethod"
                                    value="Hydroponic"
                                    onChange={(e) => setAgricationMethod(e.target.value)}
                                    className="accent-primaryColor cursor-pointer"
                                />
                                Hydroponic
                            </label>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Product Description</label>
                    <textarea
                        className="w-full px-4 py-2 border rounded-md outline-primaryColor"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>

                <div className='flex justify-between gap-8'>
                    {/* Categories */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Categories</label>
                        <div className="grid grid-cols-9 gap-6">
                            {categoryOptions.map(category => (
                                <label key={category} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        value={category}
                                        checked={categories.includes(category)}
                                        onChange={handleCategoryChange}
                                        className="accent-primaryColor cursor-pointer"
                                    />
                                    {category}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Harvest Date */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Harvest Date</label>
                        <div className="relative flex gap-6 justify-between">
                            <div
                                onClick={() => setIsCalenderOpen((prev) => !prev)}
                                className="cursor-pointer w-60 h-max px-4 py-2 border rounded-md bg-white hover:bg-gray-50"
                            >
                                {new Date(harvestingDate).toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                }) || 'Select harvested date'}
                            </div>
                            {isCalenderOpen && (
                                <div className="absolute z-10 bottom-12 right-0">
                                    <Calendar
                                        onDateSelect={(date) => setHarvestingDate(date.toISOString())}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={!file || !productName || !description || !newPrice || !district || !agricationMethod || !stock || !unit || !categories[0] || !harvestingDate || uploading}
                    className="w-full py-3 px-4 bg-primaryColor text-white font-medium rounded-md hover:bg-primaryButtonColor focus:outline-none focus:ring-2 focus:ring-primaryButtonColor focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {uploading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Uploading...
                        </span>
                    ) : (
                        'Upload Product'
                    )}
                </button>
            </form>

            {product && (
                <div className="mt-8 p-6 bg-white rounded-lg shadow">
                    <div className="flex gap-6">
                        <Image
                            src={product.ProductImage}
                            alt={product.productName}
                            width={200}
                            height={200}
                            className="rounded-lg object-cover"
                        />
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold">{product.productName}</h3>
                            <p className="text-gray-600">{product.productDescription}</p>
                            <p className="text-2xl font-bold text-primaryColor">LKR {product.price}</p>
                            <div className="flex gap-2 flex-wrap">
                                {product.categories.map((cat: string) => (
                                    <span key={cat} className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                                        {cat}
                                    </span>
                                ))}
                            </div>
                            <p className="text-sm text-gray-500">
                                Harvested {timeAgo(product.harvestingDate)} • Stocks for sale {product.stockValue} {product.unit}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <button className="absolute top-[8px] right-[8px] text-xl hover:bg-red-800 hover:text-white rounded-full transition ease-in-out duration-300 p-[1px]" onClick={handleClose}>
                <IoClose />
            </button>
        </div>
    );
}

export default UploadProduct;