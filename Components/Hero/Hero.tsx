import React from 'react';
import HeroImage from '../../Assets/Hero.jpg';
import './Hero.css';
import Image from 'next/image';
import Link from 'next/link';

const Hero: React.FC = () => {
  return (
    <div className="hero-container">
      <div className="hero-image">
        <div className="image-gradient"></div>
      </div>
      <div className="hero-content">
        <h1 className="hero-heading">Pure Agriculture <br /> Products</h1>
        <p className="hero-subheading">
          Welcome to <strong>Fshop</strong>. We believe in better agriculture for a better future.
        </p>
        <div className="hero-btn">
          <Link href="/signup">
              <button className="btn-primary">Sign Up</button>
          </Link>
          <Link href="/login">
              <button className="btn-secondary">Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
