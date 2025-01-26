'use client'

import React, { useState, useEffect } from 'react';
import './CSS/LandingPage.css';
import Product from '../../Components/Product/Product';
import About from '../../Components/About/About';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import { FaArrowRightLong } from "react-icons/fa6";
import Toggle from '../../Components/Toggle/Toggle';
import Hero from '../../Components/Hero/Hero';
import axios from 'axios';

const LandingPage = () => {
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(20);  // Show 20 products initially
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Fetch real product data from API using Axios
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/product'); // Replace with your real API endpoint
        setProducts(response.data); // Assuming the response returns an array of products
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const loadMoreProducts = () => {
    setVisibleProducts(visibleProducts + 20);  // Load 20 more products when clicking "Show More"
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
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
          <Product data={products.slice(0, visibleProducts)} />
          <div className="show-more">
            <button onClick={loadMoreProducts}>
              Show More <FaArrowRightLong />
            </button>
          </div>
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
