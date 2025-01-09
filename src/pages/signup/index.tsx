import React, { useState } from 'react'
import './SignUp.css'
import Link from 'next/link';

import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { FaGoogle } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaApple } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";

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

    let message = '';

    if (password !== confirmPassword) {
        message = "Passwords are not match"
    }

    const handleShowPassword = () => setShowPassword(!showPassword);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/user', { firstName, lastName, email, mobileNumber, confirmPassword, userType })

            if (response.status === 200) {
                router.push('/products')
                toast.success('User account successfully created!', {
                    style: { width: '600px', height: '100px', display: 'flex', justifyContent: 'center', background: 'darkgreen' },
                });
            } else {
                toast('Failed to create account. Try again!'), {
                    style: { width: '600px', height: '100px', display: 'flex', justifyContent: 'center', background: 'darkred' },
                };
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
    }

    return (
        <div className='signup-container'>
            <div className="signup-content-container">
                <div className="signup-content">
                    <h1 className='font-semibold'>Create an Account</h1>
                    <form onSubmit={handleSubmit} method='POST' className="signup-form">
                        <div className='name-container'>
                            <div className="first-name">
                                <label htmlFor="first-name">First Name</label>
                                <input onChange={(e) => setFirstName(e.target.value)} className='text-input name' type="text" name="first-name" id="" placeholder='Enter Your First Name' required />
                            </div>

                            <div className="first-name">
                                <label htmlFor="last-name">Last Name</label>
                                <input onChange={(e) => setLastName(e.target.value)} className='text-input name' type="text" name="last-name" id="" placeholder='Enter Your Last Name' required />
                            </div>
                        </div>

                        <label htmlFor="mobile-number">E-mail</label>
                        <input onChange={(e) => setEmail(e.target.value)} className='text-input' type="email" name="mobile-number" placeholder='Enter Your E-mail' />

                        <label htmlFor="mobile-number">Mobile Number</label>
                        <input onChange={(e) => setMobileNumber(e.target.value)} className='text-input' type="number" name="mobile-number" placeholder='Enter Your Mobile Number' required />

                        <label htmlFor="password">Password</label>
                        <input onChange={(e) => setPassword(e.target.value)} className='text-input' type={showPassword ? 'text' : 'password'} name="password" placeholder='Enter Your Password' required />

                        <label htmlFor="password">Confirm Password</label>
                        <input onChange={(e) => setConfirmPassword(e.target.value)} className='text-input' type={showPassword ? 'text' : 'password'} name="password" placeholder='Re-enter Your Password' required />
                        <p className='text-red-700 mt-1'>{message}</p>
                        <div className=' show-passwords'><input onChange={handleShowPassword} type="checkbox" name="show-password" id="" /><p>Show Passwords</p></div>

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
                    <p>Already have an account. <Link href="/login">Login</Link> </p>
                </div>

                {/* <Link to="/signup">
                <button className="signup-btn">
                    <h1>Sign Up</h1>
                    <p>Don't have an account?</p>
                </button>
            </Link> */}
            </div>

            <Toggle link="/" position={{ left: '10px' }} icon={<TiHome />} />
            <Toggle link="/products" position={{ left: '60px' }} icon={<HiMiniShoppingBag />} />
            <Toggle position={{ left: '110px' }} icon={<RiMoonClearFill />} />
        </div>

    )
}

export default SignUp
