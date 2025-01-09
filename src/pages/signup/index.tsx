"use client";

import React, { useEffect, useState } from 'react';
import './SignUp.css';
import Link from 'next/link';
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { FaGoogle, FaFacebook, FaApple, FaTiktok } from "react-icons/fa";
import { TiHome } from "react-icons/ti";
import { HiMiniShoppingBag } from "react-icons/hi2";
import { RiMoonClearFill } from "react-icons/ri";
import Toggle from '../../../Components/Toggle/Toggle';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const SignUp = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userType, setUserType] = useState('consumer');
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();

    const handleShowPassword = () => setShowPassword(!showPassword);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (confirmPassword && password !== confirmPassword) {
                toast.error('Passwords do not match', {
                    style: {
                        width: '400px',
                        height: '60px',
                        display: 'flex',
                        justifyContent: 'center'
                    }
                });
            } else if (confirmPassword && password === confirmPassword) {
                toast.success('Passwords match', {
                    style: {
                        width: '400px',
                        height: '60px',
                        display: 'flex',
                        justifyContent: 'center'
                    }
                });
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, [password, confirmPassword]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const errors = [];

        if (!firstName) errors.push('first name');
        if (!lastName) errors.push('last name');
        if (!mobileNumber) errors.push('mobile number');
        if (!password) errors.push('password');
        if (!confirmPassword) errors.push('confirm password');

        if (errors.length > 0) {
            const errorMessage = errors
                .map((field, index) => {
                    if (index === 0) {
                        return field.charAt(0).toUpperCase() + field.slice(1);
                    } else {
                        return field;
                    }
                })
                .join(', ')
                .replace(/,([^,]*)$/, ' and$1');
            const plural = errors.length > 1 ? 'are' : 'is';
            const lastWord = errors.length > 1 ? 'them' : 'it'
    
            toast.error(`${errorMessage} ${plural} most important to create an account, please fill ${lastWord}.`, {
                style: {
                    width: '1000px',
                    height: '60px',
                    display: 'flex',
                    justifyContent: 'center'
                },
            });
            return;
        }

        try {
            const response = await axios.post('/api/user', {
                firstName, lastName, email, mobileNumber, confirmPassword, userType
            });

            if (response.status === 200) {
                toast.success(response.data.message, {
                    style: {
                        width: '400px',
                        height: '60px',
                        display: 'flex',
                        justifyContent: 'center'
                    }
                });
                router.push('/products');
            } else {
                toast.error(response.data.error, {
                    style: {
                        width: '400px',
                        height: '60px',
                        display: 'flex',
                        justifyContent: 'center'
                    }
                });
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Something went wrong.", {
                style: {
                    width: '400px',
                    height: '60px',
                    display: 'flex',
                    justifyContent: 'center'
                }
            });
        }
    };

    return (
        <div className='signup-container'>
            <div className="signup-content-container">
                <div className="signup-content">
                    <h1 className='font-semibold'>Create an Account</h1>
                    <form onSubmit={handleSubmit} className="signup-form">
                        <div className='name-container'>
                            <div className="first-name">
                                <label htmlFor="first-name">First Name</label>
                                <input id="first-name" onChange={(e) => setFirstName(e.target.value)}
                                    className='text-input name' type="text" placeholder='Enter Your First Name' />
                            </div>
                            <div className="first-name">
                                <label htmlFor="last-name">Last Name</label>
                                <input id="last-name" onChange={(e) => setLastName(e.target.value)}
                                    className='text-input name' type="text" placeholder='Enter Your Last Name' />
                            </div>
                        </div>

                        <label htmlFor="email">E-mail</label>
                        <input id="email" onChange={(e) => setEmail(e.target.value)}
                            className='text-input' type="email" placeholder='Enter Your E-mail' />

                        <label htmlFor="mobile-number">Mobile Number</label>
                        <input id="mobile-number" onChange={(e) => setMobileNumber(e.target.value)}
                            className='text-input' type="number" placeholder='Enter Your Mobile Number' />

                        <label htmlFor="password">Password</label>
                        <input id="password" onChange={(e) => setPassword(e.target.value)}
                            className='text-input' type={showPassword ? 'text' : 'password'} placeholder='Enter Your Password' />

                        <label htmlFor="confirm-password">Confirm Password</label>
                        <input id="confirm-password" onChange={(e) => setConfirmPassword(e.target.value)}
                            className='text-input' type={showPassword ? 'text' : 'password'} placeholder='Re-enter Your Password' />

                        <div onClick={handleShowPassword} className='show-passwords'>
                            <input checked={showPassword} type="checkbox" />
                            <p>Show Passwords</p>
                        </div>

                        <button className='signup-btn' type='submit'>Create Account <MdOutlineAccountBalanceWallet /></button>
                    </form>

                    <div className="api-btn">
                        <p>or signup with</p>
                        <div className='signup-api-btn'>
                            <button className='signup-api'><FaGoogle /></button>
                            <button className='signup-api'><FaFacebook /></button>
                            <button className='signup-api'><FaApple /></button>
                            <button className='signup-api'><FaTiktok /></button>
                        </div>
                    </div>
                    <p>Already have an account? <Link href="/login">Login</Link></p>
                </div>

                <Toggle link="/" position={{ left: '10px' }} icon={<TiHome />} />
                <Toggle link="/products" position={{ left: '60px' }} icon={<HiMiniShoppingBag />} />
                <Toggle position={{ left: '110px' }} icon={<RiMoonClearFill />} />
            </div>
        </div>
    );
};

export default SignUp;
