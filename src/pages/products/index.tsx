import React from 'react'
import '../CSS/ProductPage.css'

import Product from '../../Components/Product/Product'
import Sidebar from '../../Components/Sidebar/Sidebar'
import Footer from '../../Components/Footer/Footer'
import Pagination from '../../Components/Pagination/Pagination'

import { RiMoonClearFill } from "react-icons/ri";
import Toggle from '../../Components/Toggle/Toggle'
import { TiHome } from 'react-icons/ti'

const ProductPage = () => {
    return (
        <div>
            <Sidebar />
            <div className='bg'></div>
            <Product />
            <div className="pageNumber">
                <Pagination />
            </div>
            <Footer />
            <Toggle link='/' position={{ right: '55px' }} icon={<TiHome />} />
            <Toggle position={{ right: '10px' }} icon={<RiMoonClearFill />} />
        </div>
    )
}

export default ProductPage
