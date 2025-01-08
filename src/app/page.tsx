import React from 'react';
import './CSS/LandingPage.css';
import Product from '../../Components/Product/Product';
import About from '../../Components/About/About';
import Contact from '../../Components/Contact/Contact';
import Sidebar from '../../Components/Sidebar/Sidebar';
import Footer from '../../Components/Footer/Footer';
import FAQ from '../../Components/FAQ/FAQ';
import { FaArrowRightLong } from "react-icons/fa6";
import { RiMoonClearFill } from "react-icons/ri";
import Toggle from '../../Components/Toggle/Toggle';
import sampleData from '../../Data/ProductData'; 
import Hero from '../../Components/Hero/Hero';

const LandingPage = () => {
  return (

    <div>
      <Sidebar />
      <Hero />
      <div className='Products-container'>
        <Product data={sampleData} /> 
        <div className="show-more">
          <button>Show More <FaArrowRightLong /></button>
        </div>
      </div>
      <div className="About-container">
        <About />
      </div>
      <FAQ />
      <Contact />
      <Footer />
      <Toggle position={{ right: '10px' }} icon={<RiMoonClearFill />} />
    </div>
  );
};

export default LandingPage;
