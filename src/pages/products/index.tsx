import React from 'react';
import './style.css';

import Product from '../../../Components/Product/Product';
import Sidebar from '../../../Components/Sidebar/Sidebar';
import Footer from '../../../Components/Footer/Footer';
import Pagination from '../../../Components/Pagination/Pagination';
import Toggle from '../../../Components/Toggle/Toggle';

import { RiMoonClearFill } from "react-icons/ri";
import { TiHome } from 'react-icons/ti';
import productData from '../../../Data/ProductData';

const ProductPage = () => {
  return (
    <div>
      <Sidebar />
      <div className='bg'></div>
      <div className="productPage-product-container">
        <Product data={productData} />
      </div>
      <div className="pageNumber">
        <Pagination />
      </div>
      <Footer />
      <Toggle link='/' position={{ right: '55px' }} icon={<TiHome />} />
      <Toggle position={{ right: '10px' }} icon={<RiMoonClearFill />} />
    </div>
  );
};

export default ProductPage;
