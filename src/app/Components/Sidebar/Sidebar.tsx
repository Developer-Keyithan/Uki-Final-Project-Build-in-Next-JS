import React from 'react';
import Link from 'next/link';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar-container">
      <div className="logo">
        {/* <img src="" alt="" /> */}
        <h1>F<span>shop</span></h1>
      </div>
      <div className="navlinks">
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/products">Products</Link>
          </li>
          <li>
            <Link href="/about">About Us</Link>
          </li>
          <li>
            <Link href="/faqs">FAQs</Link>
          </li>
          <li>
            <Link href="/contact">Contact Us</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
