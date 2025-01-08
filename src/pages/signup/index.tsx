import React, { useState } from 'react'
import './SignUp.css'
import Link from 'next/link';

import { MdOutlineLogin } from "react-icons/md";
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

const SignUp = () => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userType, setUserType] = useState('consumer');

    const router = useRouter();

    let message = '';

    if (password !== confirmPassword) {
        message = "Passwords are not match"
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/user', { firstName, lastName, mobileNumber, confirmPassword, userType })

            if (response.status === 200) {
                router.push('/products')
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className='signup-container'>
            <div className="signup-content-container">
                <div className="signup-content">
                    <h1>Sign Up</h1>
                    <form onSubmit={handleSubmit} method='POST' className="signup-form">
                        <div className='name-container'>
                            <div className="first-name">
                                <label htmlFor="first-name">First Name</label>
                                <input onChange={(e) => setFirstName(e.target.value)} className='text-input name' type="text" name="first-name" id="" placeholder='Enter Your First Name' />
                            </div>

                            <div className="first-name">
                                <label htmlFor="last-name">Last Name</label>
                                <input onChange={(e) => setLastName(e.target.value)} className='text-input name' type="text" name="last-name" id="" placeholder='Enter Your Last Name' />
                            </div>
                        </div>
                        <label htmlFor="mobile-number">Mobile Number</label>
                        <input onChange={(e) => setMobileNumber(e.target.value)} className='text-input' type="number" name="mobile-number" placeholder='Enter Your Mobile Number' />

                        <label htmlFor="password">Password</label>
                        <input onChange={(e) => setPassword(e.target.value)} className='text-input' type="password" name="password" placeholder='Enter Your Password' />

                        <label htmlFor="password">Confirm Password</label>
                        <input onChange={(e) => setConfirmPassword(e.target.value)} className='text-input' type="password" name="password" placeholder='Re-enter Your Password' />
                        <p>{message}</p>
                        <div className='show-password'><input onChange={(e) => setFirstName(e.target.value)} type="checkbox" name="show-password" id="" /><p>Show Password</p></div>

                        <button className='signup-btn' type='submit'>Sign Up <MdOutlineLogin /></button>
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
            <Toggle link="/products" position={{left: '60px'}} icon={<HiMiniShoppingBag />} />
            <Toggle position={{left: '110px'}} icon={<RiMoonClearFill />} />
        </div>

    )
}

export default SignUp
