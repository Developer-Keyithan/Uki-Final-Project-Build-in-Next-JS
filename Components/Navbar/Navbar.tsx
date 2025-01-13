import './style.css'
import { BiSearch, BiUser } from 'react-icons/bi'
import { IoCartOutline } from 'react-icons/io5'
import { RiMoonClearFill } from 'react-icons/ri'

const Navbar = () => {
    return (
        <div className='px-60 py-3 flex justify-between items-center sticky top-0 backdrop-blur-xl bg-white bg-opacity-40 border-green-800 z-50'>
            <div className='flex flex-row items-center gap-10'>
                <div className=''><p className='text-green-600 text-4xl font-semibold'>F<span className='text-green-500'>shop</span></p></div>
                <div className='flex flex-row gap-2'>
                    <a className='px-5 cursor-pointer font-semibold hover:text-green-500 transition ease-in-out duration-300' href="/">Home</a>
                    <a className='px-5 cursor-pointer font-semibold hover:text-green-500 transition ease-in-out duration-300' href="/products">Shop Now</a>
                    <a className='px-5 cursor-pointer font-semibold hover:text-green-500 transition ease-in-out duration-300' href="/about">About Us</a>
                    <a className='px-5 cursor-pointer font-semibold hover:text-green-500 transition ease-in-out duration-300' href="/faqs">FAQs</a>
                    <a className='px-5 cursor-pointer font-semibold hover:text-green-500 transition ease-in-out duration-300' href="/contact">Contact Us</a>
                </div>
            </div>

            <div className='flex flex-row gap-2'>
                <div className='flex flex-row gap-2 items-center bg-gray-200 py-2 px-4 rounded-full w-96'>
                    <BiSearch className='text-xl bg-green flex justify-center items-center' />
                    <input type="search" placeholder='Search...'
                        className='w-full h-full outline-none bg-gray-200'
                    />
                </div>
                <a href="/cart">
                    <div className='p-2 rounded-full cursor-pointer hover:bg-green-800 hover:text-white transition ease-in-out duration-300 relative'>
                        <IoCartOutline className='text-2xl bg-green flex justify-center items-center' />
                        <div className='flex items-center justify-center px-2 bg-red-600 rounded-full absolute top-0 right-0'>
                            <p className='text-xs text-white'>2</p>
                        </div>
                    </div>
                </a>
                <div className='p-2 rounded-full cursor-pointer hover:bg-green-800 hover:text-white transition ease-in-out duration-300'><BiUser className='text-2xl bg-green flex justify-center items-center' /></div>
                <div className='p-2 rounded-full cursor-pointer hover:bg-green-800 hover:text-white transition ease-in-out duration-300'><RiMoonClearFill className='text-2xl bg-green flex justify-center items-center' /></div>
            </div>
        </div>
    )
}

export default Navbar
