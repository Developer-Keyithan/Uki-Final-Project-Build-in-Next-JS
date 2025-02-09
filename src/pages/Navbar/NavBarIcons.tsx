'use client'

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { BiUser } from "react-icons/bi";
import { IoCartOutline } from "react-icons/io5";
import { LuFileHeart } from "react-icons/lu";
import { RiMoonClearFill } from "react-icons/ri";
import CartModel from "../CartModel/CartModel";
import WishListModel from "../WishListModel/WishListModel";
import Link from "next/link";
import Profile from "../Profile/Profile";

interface NavBarIconsProps {
    userData: any;
}

const NavBarIcons: React.FC<NavBarIconsProps> = ({ userData }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [user, setUser] = useState(userData);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isWishListOpen, setIsWishListOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(!!user);
    }, [user]);

    const handleProfile = () => setIsProfileOpen((prev) => !prev);
    const toggleDarkMode = () => document.body.classList.toggle('dark-mode');

    const nameLogo = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`;

    return (
        <div className="flex gap-4 relative">
            {/* Profile */}
            <div className="text-2xl flex justify-center items-center cursor-pointer">
                {isLoggedIn ? (
                    user?.profileImage ? (
                        <img
                            src={user.profileImage}
                            alt="Profile"
                            className="w-8 h-8 rounded-full object-cover"
                            onClick={handleProfile}
                        />
                    ) : (
                        <h3 className="font-semibold h-9 w-9 text-[16px] bg-primaryColor text-white rounded-full p-1" onClick={handleProfile}>{nameLogo}</h3>
                    )
                ) : (
                    <BiUser onClick={handleProfile} />
                )}
            </div>
            {isProfileOpen && <Profile />}

            {/* Cart */}
            <div className="relative text-2xl flex justify-center items-center cursor-pointer">
                <IoCartOutline onClick={() => setIsCartOpen((prev) => !prev)} />
                <div className="absolute -top-2 -right-2 py-[1px] px-2 bg-bgRed rounded-full text-white text-xs">
                    2
                </div>
            </div>
            {isCartOpen && <CartModel />}

            {/* Wishlist */}
            <div className="relative text-2xl flex justify-center items-center cursor-pointer">
                <LuFileHeart onClick={() => setIsWishListOpen((prev) => !prev)} />
                <div className="absolute -top-2 -right-2 py-[1px] px-2 bg-bgRed rounded-full text-white text-xs">
                    2
                </div>
            </div>
            {isWishListOpen && <WishListModel />}

            {/* Dark Mode */}
            <div className="text-2xl flex justify-center items-center cursor-pointer" onClick={toggleDarkMode}>
                <RiMoonClearFill />
            </div>
        </div>
    );
};


export default NavBarIcons;
