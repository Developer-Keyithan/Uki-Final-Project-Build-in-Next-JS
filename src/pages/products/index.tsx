import React from 'react';
import './style.css';

import Product from '../../../Components/Product/Product';
import Navbar from '../../../Components/Navbar/Navbar';
import Footer from '../../../Components/Footer/Footer';
import Pagination from '../../../Components/Pagination/Pagination';
import Toggle from '../../../Components/Toggle/Toggle';

import { RiMoonClearFill } from "react-icons/ri";
import { TiHome } from 'react-icons/ti';
// import productData from '../../../Data/ProductData';
import { useState, useEffect } from 'react';
import axios from 'axios';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(40);

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
    setVisibleProducts(visibleProducts + 40);
  };

  return (
    <div>
      <Navbar />
      <hr className='sticky top-16' />
      <div className='mx-60'>
        <div className="productPage-product-container">
          <Product data={products} />
        </div>
        <Pagination />
      </div>
      <Footer />
    </div>
  );
};

export default ProductPage;
