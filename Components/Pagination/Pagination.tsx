import React from 'react'
import './Pagination.css'

import { FaArrowLeftLong } from "react-icons/fa6";
import { FaArrowRightLong } from "react-icons/fa6";

const Pagination: React.FC = () => {
    return (
        <div className='page-number-container'>
            <button><FaArrowLeftLong /> Previous</button>
            <button className='number active'>1</button>
            <button className='number'>2</button>
            <button className='number'>3</button>
            <div className='dots'>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <button className='number'>10</button>
            <button>Next <FaArrowRightLong /></button>
        </div>
    )
}

export default Pagination
