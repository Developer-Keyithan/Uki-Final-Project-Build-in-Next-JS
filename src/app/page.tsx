import React from 'react';
import './CSS/LandingPage.css';
import Product from '../../Components/Product/Product';
import About from '../../Components/About/About';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import { FaArrowRightLong } from "react-icons/fa6";
import { RiMoonClearFill } from "react-icons/ri";
import Toggle from '../../Components/Toggle/Toggle';
import sampleData from '../../Data/ProductData';
import Hero from '../../Components/Hero/Hero';

const LandingPage = () => {
  return (

    <div>
      <Navbar />
      <hr className='sticky top-16' />
      <div className=''>
        <div className="Hero-container">
          <Hero />
        </div>
        <div className='Products-container mx-60'>
          <Product data={sampleData} />
          <div className="show-more">
            <button>Show More <FaArrowRightLong /></button>
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
  )
};

export default LandingPage;
