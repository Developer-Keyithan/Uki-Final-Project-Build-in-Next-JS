// LandingPage.tsx
import { useState, useEffect } from 'react';
import './CSS/LandingPage.css';
import Product from '../../Components/Product/Product';
import About from '../../Components/About/About';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import Hero from '../../Components/Hero/Hero';
import { FaArrowRightLong } from "react-icons/fa6";
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

const LandingPage: React.FC = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState<string | null>(null);
    const [products, setProducts] = useState([]);
    const [visibleProducts, setVisibleProducts] = useState(12);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [visibleShowMoreBtn, setVisibleShowMoreBtn] = useState(true);
    const [cartCount, setCartCount] = useState<number>()

    const router = useRouter();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/product');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await axios.get('/api/cookie');
                const response = await axios.post('/api/user/get-user', { userId: data.user.id });
                setUser(response.data.user);
                setError(null);
            } catch (error) {
                const axiosError = error as AxiosError;
                setError(axiosError.message || 'Failed to fetch user data');
                setUser(null);
            }
        };

        fetchUser();
    }, []);

    const loadMoreProducts = () => {
        setVisibleProducts(visibleProducts + 12);
        setVisibleShowMoreBtn(false);
    };

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const handleViewAll = () => {
        router.push('/products');
    };

    const updateCartCount = async () => {
        try {
            const { data } = await axios.get('/api/cookie');
            const cartCountResponse = await axios.post('/api/cart/cart-size', { userId: data.user.id });
            setCartCount(cartCountResponse.data.length);
        } catch (error) {
            console.error('Error updating cart count:', error);
        }
    };

    return (
        <div className={isDarkMode ? "dark" : "light"}>
            <Navbar />
            <hr className='sticky top-16' />
            <div>
                <div className="Hero-container">
                    <Hero />
                </div>
                <div className='Products-container mx-60'>
                    <Product data={products.slice(0, visibleProducts)} updateCartCount={updateCartCount} />
                    {visibleShowMoreBtn ? (
                        <div className="show-more">
                            <button onClick={loadMoreProducts}>Show More <FaArrowRightLong /></button>
                        </div>
                    ) : (
                        <div className="show-more">
                            <button onClick={handleViewAll}>View All<FaArrowRightLong /></button>
                        </div>
                    )}
                </div>
                <div className="About-container">
                    <About />
                </div>
            </div>
            <div className='mt-5'>
                <Footer />
            </div>
        </div>
    );
};

export default LandingPage;