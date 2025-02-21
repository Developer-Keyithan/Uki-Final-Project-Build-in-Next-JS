// NavBarIcons.tsx
import { useState, useEffect } from "react";
import { BiUser } from "react-icons/bi";
import { IoCartOutline } from "react-icons/io5";
import Profile from "../Profile/Profile";
import Link from "next/link";



interface NavBarIconsProps {
    userData: {
        firstName: string;
        lastName: string;
        profileImage: string;
    };
    cartCount: number;
    updateCartCount: () => void;
}

const NavBarIcons: React.FC<NavBarIconsProps> = ({ userData, cartCount}) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    useEffect(() => {
        setIsLoggedIn(!!userData);
    }, [userData]);

    const handleProfile = () => setIsProfileOpen((prev) => !prev);
    const nameLogo = `${userData?.firstName?.[0]}${userData?.lastName?.[0]}`;

    return (
        <div className="flex gap-4 relative">
            {/* Profile */}
            <div className="text-2xl flex justify-center items-center cursor-pointer">
                {isLoggedIn ? (
                    userData?.profileImage ? (
                        <img
                            src={userData.profileImage}
                            alt="Profile"
                            className="w-8 h-8 rounded-full object-cover"
                            onClick={handleProfile}
                        />
                    ) : (
                        <h3 className="flex items-center justify-center font-semibold h-9 w-9 text-[16px] bg-primaryColor text-white rounded-full" onClick={handleProfile}>{nameLogo}</h3>
                    )
                ) : (
                    <BiUser onClick={handleProfile} />
                )}
            </div>
            {isProfileOpen && <Profile />}

            {/* Cart */}
            <div className="relative text-2xl flex justify-center items-center cursor-pointer">
                <Link href="/cart">
                    <IoCartOutline />
                    <div className="absolute -top-2 -right-2 py-[1px] px-2 bg-bgRed rounded-full text-white text-xs">
                        {cartCount}
                    </div>
                </Link>
            </div>
            {/* {isCartOpen && <CartModel />} */}

            {/* Wishlist */}
            {/* <div className="relative text-2xl flex justify-center items-center cursor-pointer">
                <LuFileHeart onClick={() => setIsWishListOpen((prev) => !prev)} />
                <div className="absolute -top-2 -right-2 py-[1px] px-2 bg-bgRed rounded-full text-white text-xs">
                    2
                </div>
            </div>
            {isWishListOpen && <WishListModel />} */}

            {/* Dark Mode */}
            {/* <div className="text-2xl flex justify-center items-center cursor-pointer" onClick={toggleDarkMode}>
                <RiMoonClearFill />
            </div> */}
        </div>
    );
};

export default NavBarIcons;