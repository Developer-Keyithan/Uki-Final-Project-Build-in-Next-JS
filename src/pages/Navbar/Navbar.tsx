"use client";

import { useRouter } from "next/navigation";
import './style.css'
import { BiSearch, BiUser } from 'react-icons/bi'
import { IoCartOutline } from 'react-icons/io5'
import { RiMoonClearFill } from 'react-icons/ri'
import { LuFileHeart } from "react-icons/lu";
import React, { MouseEvent } from "react";
import SearchBar from "./SearchBar";
import NavBarIcons from "./NavBarIcons";
import Link from "next/link";
import Menu from "./Menu";

const Navbar: React.FC = () => {
    const router = useRouter();

    const handleAboutClick = (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        router.push("/");

        setTimeout(() => {
            const aboutSection = document.getElementById("about");
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: "smooth" });
            }
        }, 100);
    };

    return (
        <div className='px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-60 py-3 flex justify-between items-center w-full sticky top-0 backdrop-blur-xl bg-white bg-opacity-40 border-primaryColor z-50'>
            <div className="relative w-full">

                {/* MOBILE */}
                <div className="h-full flex items-center justify-between xl:hidden">
                    <Link href='/'>
                        <p className='text-green-600 text-4xl font-semibold'>
                            F
                            <span className='text-green-500'>
                                shop
                            </span>
                        </p>
                    </Link>
                    <Menu />
                </div>

                {/* BIGGER SCREENS */}
                <div className="hidden xl:flex items-center justify-between h-full w-full">
                    {/* LEFT */}
                    <div className="flex items-center gap-12">
                        <Link href='/'>
                            <p className='text-green-600 text-4xl font-semibold'>
                                F
                                <span className='text-green-500'>
                                    shop
                                </span>
                            </p>
                        </Link>
                        <div className="hidden xl:flex gap-4 font-semibold">
                            <Link href='/'>Home</Link>
                            <Link href='/products'>Shop Now</Link>
                            <Link href='#about' onClick={handleAboutClick}>About Us</Link>
                            <Link href='/contactus'>Contact Us</Link>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="">
                        <div className='flex flex-row gap-2'>
                            <SearchBar />
                            <NavBarIcons />
                        </div>
                    </div>
                </div>
            </div>

            {/* <div className='flex flex-row items-center gap-10'>
                <div className=''><p className='text-green-600 text-4xl font-semibold'>F<span className='text-green-500'>shop</span></p></div>
                <div className='flex flex-row gap-2'>
                    <a className='px-5 cursor-pointer font-semibold hover:text-green-500 transition ease-in-out duration-300' href="/">Home</a>
                    <a className='px-5 cursor-pointer font-semibold hover:text-green-500 transition ease-in-out duration-300' href="/products">Shop Now</a>
                    <a className='px-5 cursor-pointer font-semibold hover:text-green-500 transition ease-in-out duration-300' href="#about" onClick={handleAboutClick}>About Us</a>
                    <a className='px-5 cursor-pointer font-semibold hover:text-green-500 transition ease-in-out duration-300' href="/contactus">Contact Us</a>
                </div>
            </div> */}

        </div>
    )
}

export default Navbar
