import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { BiCamera, BiUser } from 'react-icons/bi';
import { MdEdit } from 'react-icons/md';
import { IoClose } from 'react-icons/io5';
import './style.css';

const Profile: React.FC = () => {
  interface User {
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string[];
  }

  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [close, setClose] = useState(false);
  const [isVisibleConfirm, setIsVisibleConfirm] = useState(false);

  const router = useRouter();

  const handleLogin = () => router.push('/login');
  const handleSignup = () => router.push('/signup');
  const handleLogout = () => {
    setIsVisibleConfirm(true);
  };

  const handleYes = async () => {
    try {
      // Clear user session or cookie
      await axios.post('/api/logout');
      router.push('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleNo = () => {
    setIsVisibleConfirm(false);
  };

  const handleClose = () => setClose(true);

  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      try {
        const { data } = await axios.get('/api/cookie');
        if (isMounted) {
          const response = await axios.post('/api/user/get-user', { userId: data.user.id });
          setUser(response.data.user);
          setError(null);
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        if (isMounted) {
          setError(axiosError.message || 'Failed to fetch user data');
          setUser(null);
        }
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, []);

  if (close) return null;

  if (!user) {
    return (
      <div className="absolute top-12 right-0 bg-white p-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
        <h1 className="font-medium text-lg mb-4">Authentication failed! So</h1>
        <div className="w-max flex justify-between items-center gap-6">
          <button
            onClick={handleLogin}
            className="bg-primaryColor py-2 px-8 font-semibold rounded-sm text-white hover:bg-primaryButtonHoverColor transition ease-in-out duration-300"
          >
            Login
          </button>
          or
          <button
            onClick={handleSignup}
            className="bg-primaryColor py-2 px-8 font-semibold rounded-sm text-white hover:bg-primaryButtonHoverColor transition ease-in-out duration-300"
          >
            Sign Up
          </button>
        </div>
      </div>
    );
  }

  const name = `${user.firstName} ${user.lastName}`;
  const email = user.email;
  const phone = user.mobileNumber.join(', ');

  return (
    <div className="w-max absolute rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white top-12 right-0 flex flex-col gap-6 z-20 overflow-hidden">
      <div className="max-fit mx-auto bg-white rounded-m p-4 relative">
        <div className="flex flex-col items-center gap-5 mt-7">
          <div className="relative">
            <div className="text-[100px] text-center border-[1px] border-black rounded-full p-2 w-fit cursor-pointer">
              <BiUser />
            </div>
            <button className="absolute bottom-1 right-1 bg-green-800 text-white rounded-full p-2 text-[20px] hover:bg-green-600 transition ease-in-out duration-300 cursor-pointer">
              <BiCamera />
            </button>
          </div>
          <p className="font-semibold">{name}</p>
          <button
            className="absolute top-[8px] right-[8px] text-xl hover:bg-red-800 hover:text-white rounded-full transition ease-in-out duration-300 p-[1px]"
            onClick={handleClose}
          >
            <IoClose />
          </button>
        </div>

        <div className="flex flex-col gap-5 mt-5 relative">
          <div className="flex justify-between items-center gap-10g w-full border-[1px] py-[5px] px-[10px] rounded-sm">
            <div className="flex gap-1">
              <p className="font-semibold">E-mail:</p>
              <p>{email}</p>
            </div>
            <div className="hover:bg-green-800 p-1 text-lg cursor-pointer rounded-sm hover:text-white -mr-[5px] transition ease-in-out duration-300">
              <MdEdit />
            </div>
          </div>

          <div className="flex justify-between items-center gap-10g w-full border-[1px] py-[5px] px-[10px] rounded-sm">
            <div className="flex gap-1">
              <p className="font-semibold">Mobile Number:</p>
              <p>+94 {phone}</p>
            </div>
            <div className="hover:bg-green-800 p-1 text-lg cursor-pointer rounded-sm hover:text-white -mr-[5px] transition ease-in-out duration-300">
              <MdEdit />
            </div>
          </div>

          <button
            className="bg-red-800 text-white rounded-sm px-2 py-1 mt-2"
            onClick={handleLogout}
          >
            Logout
          </button>
          {isVisibleConfirm && (
            <div className='py-4 absolute bottom-0 right-0 bg-white w-full'>
              <p>Are you sure?</p>
              <div className='flex justify-between gap-4 mt-4'>
                <button className='py-1 w-full bg-red-700 text-white hover:bg-red-800 transition ease-in-out duration-500 rounded-sm' onClick={handleYes}>Yes</button>
                <button className='py-1 w-full bg-primaryButtonHoverColor text-white hover:bg-primaryColor transition ease-in-out duration-500 rounded-sm' onClick={handleNo}>No</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
