import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { BiCategoryAlt, BiSearch } from 'react-icons/bi';
import { IoPricetagsOutline } from 'react-icons/io5';
import { LuFilter } from 'react-icons/lu';
import { MdClose, MdShortText } from 'react-icons/md';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { toast, ToastContainer } from 'react-toastify';

interface ProductImage {
    imageUrl: string;
}

interface Product {
    createdAt: Date;
    _id: string;
    productImages: ProductImage[];
    productName: string;
    productDescription: string;
    price: {
        newPrice: number;
        oldPrice: number;
    };
    categories: string[];
    harvestingDate: Date;
    agricationMethod: string;
    isItAllowedToBeRecommend: boolean;
    freeDelivery: boolean;
    updatedAt: Date;
}

interface Filters {
    categories: string[];
    methods: string[];
    priceRanges: string[];
}

const priceRangeOptions = [
    { label: "Under LKR 100", value: "0-100" },
    { label: "LKR 100 - LKR 200", value: "100-200" },
    { label: "LKR 200 - LKR 500", value: "200-500" },
    { label: "LKR 500 - LKR 1000", value: "500-1000" },
    { label: "Over LKR 1000", value: "1000+" },
];

function Products({ id }: { id: string }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedFilters, setSelectedFilters] = useState<Filters>({
        categories: [],
        methods: [],
        priceRanges: [],
    });
    const [isFilterOpen, setIsFilterOpen] = useState({
        categories: false,
        methods: false,
        price: false,
        sorting: false,
    });
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [recommendationStatus, setRecommendationStatus] = useState<{ [key: string]: boolean }>({});
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
    const productsPerPage = 10;
    const userId = id

    useEffect(() => {
        const abortController = new AbortController();
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/product/forAdmin', {
                    signal: abortController.signal,
                });
                const productData = response.data.map((product: Product) => ({
                    ...product,
                    createdAt: new Date(product.createdAt),
                    updatedAt: new Date(product.updatedAt),
                    harvestingDate: new Date(product.harvestingDate),
                }));
                setProducts(productData);
                setError(null);
            } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                    const errorMessage = error.response ? error.response.data.message : "Failed to fetch products. Please try again later.";
                    setError(errorMessage);
                } else {
                    console.error("Error fetching products:", error);
                    setError("An unexpected error occurred.");
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
        return () => abortController.abort();
    }, []);

    useEffect(() => {
        const initialState = products.reduce((acc, product) => ({
            ...acc,
            [product._id]: product.isItAllowedToBeRecommend
        }), {});
        setRecommendationStatus(initialState);
    }, [products]);

    const handleFilterToggle = (filterType: keyof typeof isFilterOpen) => {
        setIsFilterOpen(prev => ({
            ...prev,
            [filterType]: !prev[filterType]
        }));
    };

    const handleFilterSelection = (
        filterType: keyof Filters,
        value: string
    ) => {
        setSelectedFilters(prev => {
            const currentValues = prev[filterType];
            const newValues = currentValues.includes(value)
                ? currentValues.filter(v => v !== value)
                : [...currentValues, value];

            return {
                ...prev,
                [filterType]: newValues
            };
        });
    };

    const clearAllFilters = () => {
        setSelectedFilters({
            categories: [],
            methods: [],
            priceRanges: [],
        });
    };

    const debounce = (func: (...args: string[]) => void, delay: number) => {
        let timeoutId: NodeJS.Timeout;
        return (...args: string[]) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    };

    const handleSearch = useCallback(
        (query: string) => {
            debounce((q: string) => setSearchQuery(q), 300)(query);
        },
        []
    );

    const filteredProducts = useMemo(() => {
        const filtered = products.filter(product => {
            const categoryMatch = selectedFilters.categories.length > 0
                ? product.categories.some(cat => selectedFilters.categories.includes(cat))
                : true;

            const methodMatch = selectedFilters.methods.length > 0
                ? selectedFilters.methods.includes(product.agricationMethod)
                : true;

            const priceMatch = selectedFilters.priceRanges.length > 0
                ? selectedFilters.priceRanges.some(range => {
                    const [min, max] = range === "1000+"
                        ? [1000, Infinity]
                        : range.split("-").map(Number);
                    return product.price.newPrice >= min && product.price.newPrice <= max;
                })
                : true;

            const searchMatch = searchQuery
                ? product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.price.newPrice.toString().includes(searchQuery) ||
                product.categories.join(" ").toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.agricationMethod.toLowerCase().includes(searchQuery.toLowerCase())
                : true;

            return categoryMatch && methodMatch && priceMatch && searchMatch;
        });

        // Sorting based on updatedAt
        return filtered.sort((a, b) => {
            if (sortOrder === 'newest') {
                return b.updatedAt.getTime() - a.updatedAt.getTime();
            } else {
                return a.updatedAt.getTime() - b.updatedAt.getTime();
            }
        });
    }, [products, selectedFilters, searchQuery, sortOrder]);

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const currentProduct = useMemo(() => filteredProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
    ), [filteredProducts, currentPage, productsPerPage]);

    const handlePageClick = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };
    const handleStopRecommending = async (productId: string) => {
        try {
            const response = await axios.patch('/api/product', {
                userId,
                productId: productId,
                isItAllowedToBeRecommend: false
            });

            console.log("API Response:", response);

            if (response.status === 200) {
                toast.success('Recommedation Stoped.');
                setRecommendationStatus(prev => ({
                    ...prev,
                    [productId]: false,
                }));
            }
        } catch (error) {
            toast.error("Failed to start recommendation");
            console.error("Update error:", error);
        }
    };

    const handleStartRecommending = async (productId: string) => {
        try {
            const response = await axios.patch('/api/product/', {
                userId,
                productId: productId,
                isItAllowedToBeRecommend: true
            });

            console.log("API Response:", response);

            if (response.status === 200) {
                toast.success('Recommendation started.');
                setRecommendationStatus(prev => ({
                    ...prev,
                    [productId]: true,
                }));
            }
        } catch (error) {
            console.log(error)
            toast.error("Failed to start recommendation");
            console.error("Update error:", error);
        }
    };

    if (isLoading) return (
        <div className='flex flex-col justify-center gap-6 w-full my-8'>
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

    if (error) return <p className="text-red-500">{error}</p>;

    const productsCount = (currentPage: number, filteredProducts: number) => {
        let endCount = productsPerPage * currentPage
        if (endCount > filteredProducts) {
            endCount = filteredProducts
            return endCount
        } else {
            return endCount
        }
    }

    return (
        <div className="py-4 my-4 w-full">
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
            <div className="flex w-full justify-between gap-4 flex-wrap">
                {/* Filter Section */}
                <div className="flex gap-4 flex-wrap">
                    {/* Category Filter */}
                    <div className="relative">
                        <button
                            onClick={() => handleFilterToggle('categories')}
                            className="flex items-center gap-2 ring-1 ring-gray-500 px-4 py-2 rounded-lg hover:bg-primaryColor hover:text-white cursor-pointer"
                        >
                            <BiCategoryAlt /> Categories
                            <RiArrowDropDownLine className="text-xl" />
                        </button>
                        {isFilterOpen.categories && (
                            <div className="absolute top-full left-0 mt-2 bg-white ring-1 ring-gray-200 p-2 rounded-lg shadow-lg z-10 w-48">
                                {['Vegetables', 'Fruits', 'Grains', 'Citrus', 'Spice'].map(category => (
                                    <label key={category} className="flex items-center gap-2 p-1 hover:bg-primaryColor hover:text-white cursor-pointer rounded">
                                        <input
                                            type="checkbox"
                                            className='accent-primaryColor'
                                            checked={selectedFilters.categories.includes(category)}
                                            onChange={() => handleFilterSelection('categories', category)}
                                        />
                                        {category}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Method Filter */}
                    <div className="relative">
                        <button
                            onClick={() => handleFilterToggle('methods')}
                            className="flex items-center gap-2 ring-1 ring-gray-500 px-4 py-2 rounded-lg hover:bg-primaryColor hover:text-white cursor-pointer"
                        >
                            <LuFilter /> Methods
                            <RiArrowDropDownLine className="text-xl" />
                        </button>
                        {isFilterOpen.methods && (
                            <div className="absolute top-full left-0 mt-2 bg-white ring-1 ring-gray-200 p-2 rounded-lg shadow-lg z-10 w-48">
                                {['Organic', 'Conventional', 'Hydroponic'].map(method => (
                                    <label key={method} className="flex items-center gap-2 p-1 hover:bg-primaryColor hover:text-white cursor-pointer rounded">
                                        <input
                                            type="checkbox"
                                            className='accent-primaryColor'
                                            checked={selectedFilters.methods.includes(method)}
                                            onChange={() => handleFilterSelection('methods', method)}
                                        />
                                        {method}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Price Filter */}
                    <div className="relative w-max">
                        <button
                            onClick={() => handleFilterToggle('price')}
                            className="flex items-center gap-2 ring-1 ring-gray-500 px-4 py-2 rounded-lg hover:bg-primaryColor hover:text-white cursor-pointer"
                        >
                            <IoPricetagsOutline /> Price
                            <RiArrowDropDownLine className="text-xl" />
                        </button>
                        {isFilterOpen.price && (
                            <div className="absolute top-full left-0 mt-2 bg-white ring-1 ring-gray-200 p-2 rounded-lg shadow-lg z-10 w-52">
                                {priceRangeOptions.map(option => (
                                    <label key={option.value} className="flex items-center gap-2 p-1 hover:bg-primaryColor hover:text-white cursor-pointer rounded">
                                        <input
                                            type="checkbox"
                                            className='accent-primaryColor'
                                            checked={selectedFilters.priceRanges.includes(option.value)}
                                            onChange={() => handleFilterSelection('priceRanges', option.value)}
                                        />
                                        {option.label}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Clear All Filters */}
                    {(selectedFilters.categories.length > 0 ||
                        selectedFilters.methods.length > 0 ||
                        selectedFilters.priceRanges.length > 0) && (
                            <button
                                onClick={clearAllFilters}
                                className="flex items-center gap-2 px-4 rounded-lg text-white bg-red-500 hover:bg-red-700 transition ease-in-out duration-300"
                            >
                                <MdClose /> Clear All Filters
                            </button>
                        )}
                </div>

                {/* Search Bar */}
                <div className="flex w-max items-center ring-1 ring-gray-500 rounded-lg overflow-hidden">
                    <input
                        type="search"
                        placeholder="Search products..."
                        className="px-4 py-2 outline-none w-96"
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <button className="px-4 py-2">
                        <BiSearch />
                    </button>
                </div>

                {/* Sorting Filter */}
                <div className="relative">
                    <button
                        onClick={() => handleFilterToggle('sorting')}
                        className="flex items-center gap-2 ring-1 ring-gray-500 px-4 py-2 rounded-lg hover:bg-primaryColor hover:text-white cursor-pointer"
                    >
                        <MdShortText className='text-xl' /> Sort By
                        <RiArrowDropDownLine className="text-xl" />
                    </button>
                    {isFilterOpen.sorting && (
                        <div className="absolute top-full right-0 mt-2 bg-white ring-1 ring-gray-200 p-2 rounded-lg shadow-lg z-10 w-[140px]">
                            {[
                                { label: "Newest", value: "newest" },
                                { label: "Oldest", value: "oldest" }
                            ].map(sortOption => (
                                <label key={sortOption.value} className="flex items-center gap-2 p-1 hover:bg-primaryColor hover:text-white cursor-pointer rounded">
                                    <input
                                        type="checkbox"
                                        name="sortOrder"
                                        className='accent-primaryColor'
                                        checked={sortOrder === sortOption.value}
                                        onChange={() => setSortOrder(sortOption.value as 'newest' | 'oldest')}
                                    />
                                    {sortOption.label}
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Active Filters Display */}
            <div className="flex flex-wrap gap-2 my-4">
                {selectedFilters.categories.map(category => (
                    <span key={category} className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full flex items-center gap-1">
                        {category}
                        <MdClose
                            className="cursor-pointer hover:text-gray-500"
                            onClick={() => handleFilterSelection('categories', category)}
                        />
                    </span>
                ))}
                {selectedFilters.methods.map(method => (
                    <span key={method} className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full flex items-center gap-1">
                        {method}
                        <MdClose
                            className="cursor-pointer hover:text-gray-500"
                            onClick={() => handleFilterSelection('methods', method)}
                        />
                    </span>
                ))}
                {selectedFilters.priceRanges.map(range => {
                    const label = priceRangeOptions.find(opt => opt.value === range)?.label;
                    return (
                        <span key={range} className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full flex items-center gap-1">
                            {label}
                            <MdClose
                                className="cursor-pointer hover:text-gray-500"
                                onClick={() => handleFilterSelection('priceRanges', range)}
                            />
                        </span>
                    );
                })}

                {/* Active Sorting Display */}
                {sortOrder && (
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full flex items-center gap-1">
                        {sortOrder === 'newest' ? 'Newest to Oldest' : 'Oldest to Newest'}
                        <MdClose
                            className="cursor-pointer hover:text-gray-500"
                            onClick={() => setSortOrder('newest')} // Reset to default sorting
                        />
                    </span>
                )}
            </div>


            {/* Pagination */}
            <div className="relative flex items-center justify-center gap-2 mt-8">
                <button
                    onClick={() => handlePageClick(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => handlePageClick(i + 1)}
                        className={`px-4 py-2 rounded-lg ${currentPage === i + 1 ? 'bg-primaryColor text-white' : 'border hover:bg-gray-100'}`}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    onClick={() => handlePageClick(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
                <span className="absolute top-0 left-0 py-2 text-gray-500">
                    Page {currentPage} of {totalPages || '1'} || Products {productsPerPage * (currentPage - 1)} - {productsCount(currentPage, filteredProducts.length)} of {filteredProducts.length}
                </span>
            </div>

            {/* Product List */}
            <div className="grid gap-4 my-6">
                {currentProduct.map((product) => (
                    <div key={product._id} className="relative p-4 border rounded-lg hover:shadow-lg transition-shadow">
                        <p className='text-primaryColor'><span className='font-semibold'>ID: </span>{product._id}</p>
                        <div className="flex gap-6 mt-4">
                            <Image
                                src={product.productImages[0].imageUrl}
                                alt={product.productName}
                                width={144}
                                height={144}
                                className="w-36 h-36 object-cover rounded"
                            />
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold">{product.productName}</h3>
                                <p className="text-gray-600">{product.productDescription}</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {product.categories.map(category => (
                                        <span key={category} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                                            {category}
                                        </span>
                                    ))}
                                </div>
                                <div className="mt-2 grid grid-cols-4 gap-4">
                                    <div>
                                        <p className="font-semibold">Price (Per kg):</p>
                                        <div className='flex gap-4'>
                                            <p><span className='font-semibold'>Old:</span> {product.price.oldPrice || '0'} LKR</p>
                                            <p><span className='font-semibold'>New:</span> {product.price.newPrice} LKR</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Farming Method:</p>
                                        <p>{product.agricationMethod}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Harvest Date:</p>
                                        <p>{new Date(product.harvestingDate).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        })}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Is Delivery Free:</p>
                                        <p>{product.freeDelivery ? "Yes" : "No"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {recommendationStatus[product._id] ? (
                            <button
                                onClick={() => handleStopRecommending(product._id)}
                                className="absolute top-4 right-4 py-1 px-4 rounded-2xl bg-red-50 text-red-600 cursor-pointer hover:bg-red-200 transition ease-in-out duration-300"
                            >
                                Stop Recommending
                            </button>
                        ) : (
                            <button
                                onClick={() => handleStartRecommending(product._id)}
                                className="absolute top-4 right-4 py-1 px-4 rounded-2xl bg-green-50 text-green-600 cursor-pointer hover:bg-green-200 transition ease-in-out duration-300"
                            >
                                Start Recommending
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="relative flex items-center justify-center gap-2 mt-8">
                <button
                    onClick={() => handlePageClick(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => handlePageClick(i + 1)}
                        className={`px-4 py-2 rounded-lg ${currentPage === i + 1 ? 'bg-primaryColor text-white' : 'border hover:bg-gray-100'}`}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    onClick={() => handlePageClick(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
                <span className="absolute top-0 left-0 py-2 text-gray-500">
                    Page {currentPage} of {totalPages || '1'} || Products {productsPerPage * (currentPage - 1)} - {productsCount(currentPage, filteredProducts.length)} of {filteredProducts.length}
                </span>
            </div>
        </div>
    );
}

export default Products;