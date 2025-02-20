import { useEffect, useState, useMemo } from 'react';
import AddProduct from '../../../AddProduct/AddProduct';
import { MdDelete, MdEdit, MdSave } from 'react-icons/md';
import Calendar from '../../../Calendar/Calendar';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

interface Stock {
    unit: string;
    value: number;
}

interface Product {
    _id: string;
    productImages: [{
        imageUrl: string;
    }];
    productName: string;
    productDescription: string;
    price: {
        newPrice: number;
        oldPrice: number;
    };
    createdAt: Date;
    updatedAt: Date;
    stock: Stock;
    harvestingDate: Date;
    categories: string[];
    agricationMethod: string;
    isItAllowedToBeRecommend: boolean;
    freeDelivery: boolean;
}

const Products = ({ id }: { id: string }) => {
    const [isAddProductOpen, setIsAddProductOpen] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [editingProductId, setEditingProductId] = useState<string | null>(null);
    const [calendarProductId, setCalendarProductId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
    const [tempImageUrl, setTempImageUrl] = useState<string | null>(null)
    const userId = id;

    const categoryOptions = [
        "Fruits", "Vegetables", "Cereals", "Legumes", "Tubers", "Oilseeds",
        "Cotton", "Tobacco", "Beverages", "Forage", "Herbs", "Flowers",
        "Grains", "Citrus", "Spice", "Dairy", "Meat"
    ];

    useEffect(() => {
        const fetchUserAndProducts = async () => {
            try {
                const { data } = await axios.post('/api/product/get-by-userId', {
                    userId
                })
                setProducts(data.products)
            } catch (error) {
                console.log(error);
                toast.error('Failed to load products')
            } finally {
                setTimeout(() => {
                    setLoading(false)
                }, 3000);
            }
        }
        fetchUserAndProducts()
    }, [userId])

    const handleEditProduct = (id: string) => {
        setEditingProductId(prev => prev === id ? null : id);
        setCalendarProductId(null);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedImageFile(file)
            setTempImageUrl(URL.createObjectURL(file))
        }
    }

    const handleSaveEditedProduct = async (productId: string) => {
        try {
            setIsSaving(true);
            const productToUpdate = products.find(p => p._id === productId);

            if (!productToUpdate) {
                toast.error('Product not found');
                return;
            }

            // Validate required fields
            if (!productToUpdate.productName?.trim() || !productToUpdate.productDescription?.trim()) {
                toast.error('Product name and description are required');
                return;
            }

            // Image upload handling
            let finalImageUrl = productToUpdate.productImages[0]?.imageUrl;
            if (selectedImageFile) {
                try {
                    const formData = new FormData();
                    formData.append('file', selectedImageFile);
                    formData.append('fileType', 'product');
                    formData.append('userId', userId);

                    const uploadResponse = await axios.post(
                        '/api/s3-upload',
                        formData,
                        { headers: { 'Content-Type': 'multipart/form-data' } }
                    );

                    finalImageUrl = uploadResponse.data.imageUrl;
                } catch (error) {
                    toast.error('Failed to upload image');
                    throw error;
                }
            }

            // Prepare updated product data
            const updatedProductData = {
                ...productToUpdate,
                productImages: [{ imageUrl: finalImageUrl }],
                price: productToUpdate.price.newPrice
            };

            // Update product endpoint
            const { data } = await axios.patch(
                '/api/product',
                {
                    ...updatedProductData,
                    userId,
                    productId
                }
            );

            if (!data?.product?._id) {
                throw new Error('Invalid product response from server');
            }

            // Update state with new product data
            setProducts(prev => prev.map(p =>
                p._id === productId ? data.product : p // Use data.product instead of data.updatedProduct
            ));

            // Reset editing states
            setEditingProductId(null);
            setSelectedImageFile(null);
            setTempImageUrl(null);
            toast.success('Product updated successfully!');

        } catch (error) {
            console.error('Save error:', error);
            toast.error('Failed to update product');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteProduct = async (productId: string) => {
        try {
            await axios.delete('/api/product', {
                data: { productId }
            });
            setProducts(prev => prev.filter(p => p._id !== productId));
            toast.success('Product deleted successfully!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete product');
        }
    };

    const toggleRecommendation = async (productId: string) => {
        try {
            const product = products.find(p => p._id === productId);
            if (!product) return;

            // Toggle the recommendation state
            const newRecommendationState = !product.isItAllowedToBeRecommend;

            // Send the update to the API
            await axios.patch('/api/product', {
                productId,
                isItAllowedToBeRecommend: newRecommendationState,
                userId
            });

            // Update the state with the new product data
            setProducts(prev => prev.map(p =>
                p._id === productId ? { ...p, isItAllowedToBeRecommend: newRecommendationState } : p
            ));

            toast.success(`Product recommendation ${newRecommendationState ? 'enabled' : 'disabled'}`);
        } catch (error) {
            console.error(error);
            toast.error('Failed to update recommendation');
        }
    };

    const handleChange = (id: string, field: string, value: string | number) => {
        setProducts(prev => prev.map(product =>
            product._id === id ? { ...product, [field]: value } : product
        ))
    }

    const handlePriceChange = (id: string, field: 'newPrice' | 'oldPrice', value: string) => {
        setProducts(prev => prev.map(product =>
            product._id === id ? {
                ...product,
                price: { ...product.price, [field]: Number(value) }
            } : product
        ))
    }

    const handleCategoryChange = (id: string, category: string, isChecked: boolean) => {
        setProducts(prev => prev.map(product =>
            product._id === id ? {
                ...product,
                categories: isChecked
                    ? [...product.categories, category]
                    : product.categories.filter(c => c !== category)
            } : product
        ))
    }

    const handleStockUnitChange = (id: string, unit: string) => {
        setProducts(prev => prev.map(product =>
            product._id === id ? {
                ...product,
                stock: { ...product.stock, unit }
            } : product
        ))
    }

    const handleStockValueChange = (id: string, value: number) => {
        setProducts(prev => prev.map(product =>
            product._id === id ? {
                ...product,
                stock: { ...product.stock, value }
            } : product
        ))
    }

    const handleDateSelect = (productId: string, date: Date) => {
        setProducts(prev => prev.map(product =>
            product._id === productId ? { ...product, harvestingDate: date } : product
        ))
        setCalendarProductId(null)
    }

    const safeFormatDate = (dateString: Date) => {
        try {
            const date = new Date(dateString);
            return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        } catch {
            return 'Invalid date';
        }
    };

    const memoizedProducts = useMemo(() => products, [products]);

    if (loading) return (
        <div className='flex flex-col justify-center gap-6 w-full mb-8'>
            <div className='flex gap-6 animate-pulse w-full ring-1 ring-gray-300 rounded-lg p-4'>
                <div className='w-48 h-44 bg-gray-200 rounded-lg'></div>
                <div className='flex flex-col gap-4 w-full'>
                    <h3 className='w-96 py-1 rounded-md h-8 bg-gray-200'></h3>
                    <p className='py-1 bg-gray-200 w-full rounded-md h-6'></p>
                    <div className='flex gap-2'>
                        <p className='py-1 w-20 bg-gray-200 rounded-md h-6'></p>
                        <p className='py-1 w-24 bg-gray-200 rounded-md h-6'></p>
                    </div>
                    <div className='grid grid-cols-5 gap-4'>
                        <div className='text-start w-full'>
                            <p className='w-1/2 py-1 bg-gray-200 rounded-md h-4'></p>
                            <p className='w-full py-1 bg-gray-200 rounded-md h-6 mt-2'></p>
                        </div>
                        <div className='text-start w-full'>
                            <p className='w-1/2 py-1 bg-gray-200 rounded-md h-4'></p>
                            <p className='w-full py-1 bg-gray-200 rounded-md h-6 mt-2'></p>
                        </div>
                        <div className='text-start w-full'>
                            <p className='w-1/2 py-1 bg-gray-200 rounded-md h-4'></p>
                            <p className='w-full py-1 bg-gray-200 rounded-md h-6 mt-2'></p>
                        </div>
                        <div className='text-start w-full'>
                            <p className='w-1/2 py-1 bg-gray-200 rounded-md h-4'></p>
                            <p className='w-full py-1 bg-gray-200 rounded-md h-6 mt-2'></p>
                        </div>
                        <div className='text-start w-full'>
                            <p className='w-1/2 py-1 bg-gray-200 rounded-md h-4'></p>
                            <p className='w-full py-1 bg-gray-200 rounded-md h-6 mt-2'></p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex gap-6 animate-pulse w-full ring-1 ring-gray-300 rounded-lg p-4'>
                <div className='w-48 h-44 bg-gray-200 rounded-lg'></div>
                <div className='flex flex-col gap-4 w-full'>
                    <h3 className='w-96 py-1 rounded-md h-8 bg-gray-200'></h3>
                    <p className='py-1 bg-gray-200 w-full rounded-md h-6'></p>
                    <div className='flex gap-2'>
                        <p className='py-1 w-20 bg-gray-200 rounded-md h-6'></p>
                        <p className='py-1 w-24 bg-gray-200 rounded-md h-6'></p>
                    </div>
                    <div className='grid grid-cols-5 gap-4'>
                        <div className='text-start w-full'>
                            <p className='w-1/2 py-1 bg-gray-200 rounded-md h-4'></p>
                            <p className='w-full py-1 bg-gray-200 rounded-md h-6 mt-2'></p>
                        </div>
                        <div className='text-start w-full'>
                            <p className='w-1/2 py-1 bg-gray-200 rounded-md h-4'></p>
                            <p className='w-full py-1 bg-gray-200 rounded-md h-6 mt-2'></p>
                        </div>
                        <div className='text-start w-full'>
                            <p className='w-1/2 py-1 bg-gray-200 rounded-md h-4'></p>
                            <p className='w-full py-1 bg-gray-200 rounded-md h-6 mt-2'></p>
                        </div>
                        <div className='text-start w-full'>
                            <p className='w-1/2 py-1 bg-gray-200 rounded-md h-4'></p>
                            <p className='w-full py-1 bg-gray-200 rounded-md h-6 mt-2'></p>
                        </div>
                        <div className='text-start w-full'>
                            <p className='w-1/2 py-1 bg-gray-200 rounded-md h-4'></p>
                            <p className='w-full py-1 bg-gray-200 rounded-md h-6 mt-2'></p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex gap-6 animate-pulse w-full ring-1 ring-gray-300 rounded-lg p-4'>
                <div className='w-48 h-44 bg-gray-200 rounded-lg'></div>
                <div className='flex flex-col gap-4 w-full'>
                    <h3 className='w-96 py-1 rounded-md h-8 bg-gray-200'></h3>
                    <p className='py-1 bg-gray-200 w-full rounded-md h-6'></p>
                    <div className='flex gap-2'>
                        <p className='py-1 w-20 bg-gray-200 rounded-md h-6'></p>
                        <p className='py-1 w-24 bg-gray-200 rounded-md h-6'></p>
                    </div>
                    <div className='grid grid-cols-5 gap-4'>
                        <div className='text-start w-full'>
                            <p className='w-1/2 py-1 bg-gray-200 rounded-md h-4'></p>
                            <p className='w-full py-1 bg-gray-200 rounded-md h-6 mt-2'></p>
                        </div>
                        <div className='text-start w-full'>
                            <p className='w-1/2 py-1 bg-gray-200 rounded-md h-4'></p>
                            <p className='w-full py-1 bg-gray-200 rounded-md h-6 mt-2'></p>
                        </div>
                        <div className='text-start w-full'>
                            <p className='w-1/2 py-1 bg-gray-200 rounded-md h-4'></p>
                            <p className='w-full py-1 bg-gray-200 rounded-md h-6 mt-2'></p>
                        </div>
                        <div className='text-start w-full'>
                            <p className='w-1/2 py-1 bg-gray-200 rounded-md h-4'></p>
                            <p className='w-full py-1 bg-gray-200 rounded-md h-6 mt-2'></p>
                        </div>
                        <div className='text-start w-full'>
                            <p className='w-1/2 py-1 bg-gray-200 rounded-md h-4'></p>
                            <p className='w-full py-1 bg-gray-200 rounded-md h-6 mt-2'></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className='my-8'>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <button
                onClick={() => setIsAddProductOpen(true)}
                className='bg-gray-100 py-2 px-8 rounded hover:bg-primaryColor hover:text-white transition-all duration-300'
                aria-label="Add new product"
            >
                + Add a New Product
            </button>

            {isAddProductOpen && (
                <div className='fixed h-[100vh] overflow-y-auto inset-0 py-12 bg-black/50 z-[1000] no-scrollbar backdrop-blur-lg'>
                    <AddProduct
                        handleClose={() => setIsAddProductOpen(false)}
                    />
                </div>
            )}

            <div className='flex flex-col gap-6 mt-8'>
                <h3 className='font-bold text-2xl text-gray-800'>Your Products</h3>

                {memoizedProducts.length === 0 ? (
                    <div className="text-center py-4">No products found. Start by adding a new product.</div>
                ) : (
                    memoizedProducts.map((product) => (
                        product?._id ? (
                            <div key={product._id} className='relative bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow'>
                                {editingProductId === product._id ? (
                                    <div className='space-y-6'>
                                        <div className="flex gap-4">
                                            <div className="md:w-40">
                                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                                    Product Image
                                                </label>
                                                <div className="w-40 h-40 bg-gray-100 rounded-lg overflow-hidden">
                                                    <img
                                                        src={tempImageUrl || product.productImages[0]?.imageUrl || '/default-product.png'}
                                                        alt="Product preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="mt-2 text-sm hidden"
                                                    id={`upload-input-${product._id}`}
                                                    onChange={(e) => handleImageChange(e)}
                                                />
                                                <label
                                                    htmlFor={`upload-input-${product._id}`}
                                                    className="mt-2 flex items-center justify-between cursor-pointer text-primaryColor border-[1px] border-dashed border-primaryColor hover:bg-green-50 rounded-md p-1 transition ease-in-out duration-300"
                                                >
                                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                                                    </svg>
                                                    Upload Image
                                                </label>
                                            </div>

                                            <div className='flex-1 min-w-[300px]'>
                                                <div className='space-y-4'>
                                                    <div>
                                                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                                                            Product Name *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="w-96 px-3 py-2 border rounded-md outline-primaryColor"
                                                            value={product.productName}
                                                            onChange={(e) => handleChange(product._id, 'productName', e.target.value)}
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                                                            Description *
                                                        </label>
                                                        <textarea
                                                            className="w-full px-3 py-2 border rounded-md outline-primaryColor"
                                                            value={product.productDescription}
                                                            rows={3}
                                                            onChange={(e) => handleChange(product._id, 'productDescription', e.target.value)}
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                                                            Categories
                                                        </label>
                                                        <div className="grid grid-cols-2 md:grid-cols-9 gap-2">
                                                            {categoryOptions.map((category) => (
                                                                <label key={category} className="flex items-center space-x-2">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={product.categories.includes(category)}
                                                                        onChange={(e) => handleCategoryChange(product._id, category, e.target.checked)}
                                                                        className='h-4 w-4 accent-primaryColor border-gray-300 rounded'
                                                                    />
                                                                    <span className='text-sm text-gray-700'>{category}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                                        <div>
                                                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                                                Current Price (LKR) *
                                                            </label>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                className="w-full px-3 py-2 border rounded-md outline-primaryColor [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                                value={product.price.newPrice}
                                                                onChange={(e) => handlePriceChange(product._id, 'newPrice', e.target.value)}
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                                                Stock Quantity *
                                                            </label>
                                                            <div className='flex gap-2'>
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    className="w-full px-3 py-2 border rounded-md outline-primaryColor [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                                    value={product.stock.value}
                                                                    onChange={(e) => handleStockValueChange(product._id, Number(e.target.value))}
                                                                />
                                                                <div className='flex gap-1 items-center'>
                                                                    <select
                                                                        value={product.stock.unit}
                                                                        onChange={(e) => handleStockUnitChange(product._id, e.target.value)}
                                                                        className='px-2 py-2 border rounded-md outline-primaryColor'
                                                                    >
                                                                        <option value="kg">kg</option>
                                                                        <option value="gram">gram</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                                                Harvest Date *
                                                            </label>
                                                            <div className='relative'>
                                                                <button
                                                                    type='button'
                                                                    className='w-full px-3 py-2 text-left bg-white border rounded-md shadow-sm focus:ring-2 focus:ring-primaryColor'
                                                                    onClick={() => setCalendarProductId(prev =>
                                                                        prev === product._id ? null : product._id
                                                                    )}
                                                                    aria-label="Select harvest date"
                                                                >
                                                                    {safeFormatDate(product.harvestingDate)}
                                                                </button>
                                                                {calendarProductId === product._id && (
                                                                    <div className="absolute bottom-full mb-2 right-0 z-10 bg-white shadow-lg rounded-md">
                                                                        <Calendar
                                                                            onDateSelect={(date) => handleDateSelect(product._id, date)}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='flex justify-end gap-3'>
                                            <button
                                                onClick={() => setEditingProductId(null)}
                                                disabled={isSaving}
                                                className={`px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''
                                                    }`}
                                                aria-label="Cancel editing"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => handleSaveEditedProduct(product._id)}
                                                disabled={isSaving}
                                                className={`px-4 py-2 bg-primaryColor text-white rounded-md hover:bg-primaryColor/90 flex items-center gap-2 transition-colors ${isSaving ? 'opacity-50 cursor-not-allowed' : ''
                                                    }`}
                                                aria-label="Save changes"
                                            >
                                                {isSaving ? (
                                                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                    </svg>
                                                ) : (
                                                    <MdSave className='w-5 h-5' />
                                                )}
                                                {isSaving ? 'Saving...' : 'Save Changes'}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className='relative'>
                                        <div className='flex gap-6 flex-wrap'>
                                            <div className='w-40 h-40 bg-gray-100 rounded-lg overflow-hidden shrink-0'>
                                                <img
                                                    src={product.productImages[0]?.imageUrl || '/default-product.png'}
                                                    alt={product.productName}
                                                    className='w-full h-full object-cover'
                                                />
                                            </div>

                                            <div className='flex-1 min-w-[300px]'>
                                                <div className='flex items-start justify-between'>
                                                    <h4 className='text-xl font-bold text-gray-900 mb-2'>
                                                        {product.productName}
                                                    </h4>
                                                </div>

                                                <p className='text-gray-600 mb-4'>{product.productDescription}</p>

                                                <div className='flex flex-wrap gap-2 mb-4'>
                                                    {product.categories.map((category) => (
                                                        <span
                                                            key={category}
                                                            className='px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full'
                                                        >
                                                            {category}
                                                        </span>
                                                    ))}
                                                </div>

                                                <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
                                                    <div>
                                                        <p className='text-sm text-gray-500'>Price</p>
                                                        <p className='font-medium'>LKR {product.price.newPrice.toFixed(2)}</p>
                                                    </div>
                                                    <div>
                                                        <p className='text-sm text-gray-500'>Stock</p>
                                                        <p className='font-medium'>
                                                            {product.stock.value} {product.stock.unit}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className='text-sm text-gray-500'>Harvested</p>
                                                        <p className='font-medium'>
                                                            {safeFormatDate(product.harvestingDate)}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className='text-sm text-gray-500'>Listed</p>
                                                        <p className='font-medium'>
                                                            {safeFormatDate(product.createdAt)}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className='text-sm text-gray-500'>Last Updated</p>
                                                        <p className='font-medium'>
                                                            {safeFormatDate(product.updatedAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='absolute top-0 right-0 flex items-center gap-2 flex-wrap justify-end'>
                                            <span className={`px-3 py-1 rounded-full ${product.isItAllowedToBeRecommend
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {product.isItAllowedToBeRecommend ? 'Product Recommended' : 'Product Not Recommended'}
                                            </span>
                                            <div className='flex gap-2'>
                                                <button
                                                    onClick={() => toggleRecommendation(product._id)}
                                                    className={`flex items-center gap-2 px-3 py-1 rounded-full transition-colors ${product.isItAllowedToBeRecommend
                                                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                        }`}
                                                    aria-label="Toggle product recommendation"
                                                >
                                                    {product.isItAllowedToBeRecommend ? 'Stop Recommending' : 'Start Recommending'}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product._id)}
                                                    className='btn-container flex items-center justify-center px-2 py-1 bg-red-700 text-white rounded-full cursor-pointer'
                                                    aria-label="Delete product"
                                                >
                                                    <MdDelete className='w-4 h-4' />
                                                    <span className='text-sm'>Delete</span>
                                                </button>
                                                <button
                                                    onClick={() => handleEditProduct(product._id)}
                                                    className='btn-container flex items-center justify-center px-2 py-1 bg-primaryColor text-white rounded-full cursor-pointer'
                                                    aria-label="Edit product"
                                                >
                                                    <MdEdit className='w-4 h-4' />
                                                    <span className='text-sm'>Edit</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : null
                    ))
                )}
            </div>
        </div>
    );
};

export default Products;