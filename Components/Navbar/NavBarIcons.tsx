'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { BiUser } from "react-icons/bi"
import { IoCartOutline } from "react-icons/io5"
import { LuFileHeart } from "react-icons/lu"
import { RiMoonClearFill } from "react-icons/ri"
import CartModel from "../CartModel/CartModel"
import WishListModel from "../WishListModel/WishListModel"

const NavBarIcons = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isWishListOpen, setIsWishListOpen] = useState(false);

    const router = useRouter();

    // TEMPORARY
    const isLoggedIn = false

    const handleProfile = () => {
        if (!isLoggedIn) {
            router.push('/login');
        }
        setIsProfileOpen((prev) => !prev)
    }

    return (
        <div className="flex gap-4 relative">

            <div className='text-2xl bg-green flex justify-center items-center'>
                <BiUser
                    onClick={handleProfile}
                />
            </div>
            {isProfileOpen && <div className="absolute p-4 rounded-md top-12 left-0 text-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white z-50">
                <Link href='/'>Profile</Link>
                <div className="mt-2 cursor-pointer">LogOut</div>
            </div>}

            <div
                className=' relative text-2xl bg-green flex justify-center items-center cursor-pointer'
            >
                <IoCartOutline
                    onClick={() => setIsCartOpen((prev) => !prev)}
                />
                <div className="absolute -top-2 -right-2 py-[1px] px-2 bg-bgRed rounded-full text-white text-xs items-center justify-center">
                    2
                </div>
            </div>
            {isCartOpen && (<CartModel />)}

            <div
                className=' relative text-2xl bg-green flex justify-center items-center cursor-pointer'
            >
                <LuFileHeart
                    onClick={() => setIsWishListOpen((prev) => !prev)}
                />
                <div className="absolute -top-2 -right-2 py-[1px] px-2 bg-bgRed rounded-full text-white text-xs items-center justify-center">
                    2
                </div>
            </div>
            {isWishListOpen && (<WishListModel />)}

            <div className='text-2xl bg-green flex justify-center items-center cursor-pointer' >
                <RiMoonClearFill />
            </div>
        </div>
    )
}

export default NavBarIcons
