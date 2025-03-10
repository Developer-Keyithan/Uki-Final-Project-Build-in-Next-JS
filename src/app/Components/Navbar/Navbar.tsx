// Navbar.tsx
import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react';
import React, { MouseEvent } from "react";
import SearchBar from "./SearchBar";
import NavBarIcons from "./NavBarIcons";
import Link from "next/link";
import Menu from "./Menu";
import axios from 'axios';

const Navbar: React.FC = () => {
    const [user, setUser] = useState(null);
    const [cartCount, setCartCount] = useState<number>(0);

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

    const updateCartCount = async () => {
        try {
            const { data } = await axios.get('/api/cookie');

            const fetchCartCount = async () => {
                try {
                    const cartCountResponse = await axios.post('/api/cart/cart-size', { userId: data.user.id });
                    setCartCount(cartCountResponse.data.length);
                } catch (error) {
                    console.error('Error fetching cart count:', error);
                }
            };

            await fetchCartCount();
            setInterval(fetchCartCount, 1000);
        } catch (error) {
            console.error('Error updating cart count:', error);
        }
    };


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await axios.get('/api/cookie');
                const response = await axios.post('/api/user/get-user', { userId: data.user.id });
                setUser(response.data.user);
                await updateCartCount();
            } catch (error) {
                console.log(error)
                setUser(null);
            }
        };

        fetchUser();
    }, []);

    return (
        <div className='px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-60 py-3 flex justify-between items-center w-full sticky top-0 backdrop-blur-xl bg-white bg-opacity-40 border-primaryColor z-50'>
            <div className="relative w-full">
                {/* MOBILE */}
                <div className="h-full flex items-center justify-between xl:hidden">
                    <Link href='/'>
                        <p className='text-primaryColor text-4xl font-semibold'>Fermire</p>
                    </Link>
                    <Menu />
                </div>

                {/* BIGGER SCREENS */}
                <div className="hidden xl:flex items-center justify-between h-full w-full">
                    {/* LEFT */}
                    <div className="flex items-center gap-12">
                        <Link href='/'>
                            <p className='text-primaryColor text-4xl font-semibold'>Fermire</p>
                        </Link>
                        <div className="hidden xl:flex gap-4">
                            <Link className="hover:font-semibold transition ease-in-out duration-300" href='/'>Home</Link>
                            <Link className="hover:font-semibold transition ease-in-out duration-300" href='/products'>Shop Now</Link>
                            <Link className="hover:font-semibold transition ease-in-out duration-300" href='#about' onClick={handleAboutClick}>About Us</Link>
                            <Link className="hover:font-semibold transition ease-in-out duration-300" href='/contactus'>Contact Us</Link>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="">
                        <div className='flex flex-row gap-2'>
                            <SearchBar />
                            {user && <NavBarIcons userData={user} cartCount={cartCount} updateCartCount={updateCartCount} />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar;