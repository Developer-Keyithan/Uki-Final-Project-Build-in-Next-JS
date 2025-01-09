import React, { useState } from 'react';
import './Login.css';
import { MdOutlineLogin } from "react-icons/md";
import { FaGoogle, FaFacebook, FaApple, FaTiktok } from "react-icons/fa";
import { TiHome } from "react-icons/ti";
import { HiMiniShoppingBag } from "react-icons/hi2";
import { RiMoonClearFill } from "react-icons/ri";
import Toggle from '../../../Components/Toggle/Toggle';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login: React.FC = () => {
    const router = useRouter();

    const [emailOrMobileNumber, setEmailOrMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleShowPassword = () => setShowPassword(!showPassword);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post('/api/user/login', {
                emailOrMobileNumber,
                password,
            });

            if (response.status === 200) {
                console.log(response)
                toast.success(response.data.message, {
                    style: {
                        width: '600px',
                        height: '100px',
                        display: 'flex',
                        justifyContent: 'center',
                        background: 'darkgreen',
                        color: 'white'
                    },
                });
                router.push('/products');
            } else {
                toast.error(response.data.error, {
                    style: {
                        width: '600px',
                        height: '100px',
                        display: 'flex',
                        justifyContent: 'center',
                        background: 'darkred',
                        color: 'white',
                    },
                });
            }

        } catch (error: any) {
            toast.error(
                error.response?.data?.error || "Something went wrong. Please try again.",
                {
                    style: {
                        width: '600px',
                        height: '100px',
                        display: 'flex',
                        justifyContent: 'center',
                        background: 'darkred',
                        color: 'white',
                    },
                }
            );
        }
    };


    return (
        <div className="login-container">
            <div className="login-content-container">
                <div className="login-content">
                    <h1 className='font-semibold'>Login</h1>
                    <form onSubmit={handleSubmit} method="POST" className="login-form">
                        <div className="number">
                            <label htmlFor="email">E-mail or Mobile Number</label>
                            <input
                                onChange={(e) => setEmailOrMobileNumber(e.target.value)}
                                type="text"
                                name="mobile-number"
                                placeholder="Enter Your E-mail or Mobile Number"
                                required
                            />
                        </div>

                        <div className="password">
                            <label htmlFor="password">Password</label>
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Enter Your Password"
                                required
                            />
                            <div className="password-options">
                                <div className="show-password">
                                    <input
                                        type="checkbox"
                                        name="show-password"
                                        onChange={handleShowPassword}
                                    />
                                    <p>Show Password</p>
                                </div>
                                <Link href="/forgot-password">Forgot Password</Link>
                            </div>
                        </div>

                        <button className="login-btn" type="submit" disabled={isLoading}>
                            {isLoading ? 'Loading...' : 'Login'} <MdOutlineLogin />
                        </button>

                    </form>

                    <div className="api-btn">
                        <p>or login with</p>
                        <div className="login-api-btn">
                            <button className="login-api"><FaGoogle /></button>
                            <button className="login-api"><FaFacebook /></button>
                            <button className="login-api"><FaApple /></button>
                            <button className="login-api"><FaTiktok /></button>
                        </div>
                    </div>
                    <p>Don't have an account? <Link href="/signup">Sign Up</Link></p>
                </div>
            </div>

            <Toggle link="/" position={{ left: '10px' }} icon={<TiHome />} />
            <Toggle link="/products" position={{ left: '60px' }} icon={<HiMiniShoppingBag />} />
            <Toggle position={{ left: '110px' }} icon={<RiMoonClearFill />} />
        </div>
    );
};

export default Login;