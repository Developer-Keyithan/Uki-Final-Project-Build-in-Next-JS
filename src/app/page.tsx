'use client'
import { useState, useEffect } from 'react';
import './CSS/LandingPage.css';
import Product from './Components/Product/Product';
import About from './Components/About/About';
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import Hero from './Components/Hero/Hero';
import { FaArrowRightLong } from "react-icons/fa6";
import axios from 'axios';
import { useRouter } from 'next/navigation';

const LandingPage: React.FC = () => {
    const [products, setProducts] = useState([]);
    const [visibleProducts, setVisibleProducts] = useState(12);
    const [visibleShowMoreBtn, setVisibleShowMoreBtn] = useState(true);
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

    const loadMoreProducts = () => {
        setVisibleProducts(visibleProducts + 12);
        setVisibleShowMoreBtn(false);
    };

    const handleViewAll = () => {
        router.push('/products');
    };

    return (
        <div>
            <Navbar />
            <hr className='sticky top-16' />
            <div>
                <div className="Hero-container">
                    <Hero />
                </div>
                <div className='Products-container mx-60'>
                    <Product data={products.slice(0, visibleProducts)} />
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