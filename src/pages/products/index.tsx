import React from 'react';
import './style.css';

import Product from '../../../Components/Product/Product';
import Navbar from '../../../Components/Navbar/Navbar';
import Footer from '../../../Components/Footer/Footer';
import Pagination from '../../../Components/Pagination/Pagination';
import Toggle from '../../../Components/Toggle/Toggle';

import { RiMoonClearFill } from "react-icons/ri";
import { TiHome } from 'react-icons/ti';
import productData from '../../../Data/ProductData';

const ProductPage = () => {
  return (
    <div>
      <Navbar />
      <hr className='sticky top-16' />
      <div className='mx-60'>
        <div className="productPage-product-container">
          <Product data={productData} />
        </div>
        <Pagination />
      </div>
      <Footer />
    </div>
  );
};

export default ProductPage;
