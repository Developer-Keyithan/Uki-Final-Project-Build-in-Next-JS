'use client';
import { BiCamera, BiUser } from 'react-icons/bi';
import { MdEdit } from 'react-icons/md';
import { IoClose } from 'react-icons/io5';
import './style.css';
import { useState } from 'react';
import { useRouter } from 'next/router'; // Corrected to use the correct router from Next.js
import UserData from '../../Data/User'; // Import the correct data file

// Updated UserData interface
interface UserData {
  id: string;
  name: string;
  email: string;
  number: string;
  country: string;
}

const ProfileCardItem = ({ data }: { data: UserData | undefined }) => {
  const userName = data?.name;
  const userEmail = data?.email;
  const userPhone = data?.number;
  const userCountry = data?.country;

  const [close, setClose] = useState(false);
  const [logout, setLogout] = useState(false);

  const router = useRouter();

  const handleDashboard = () => {
    router.push('/dashboard/');
  };

  const handleLogout = () => {
    setLogout(true);
    alert('Logged Out');
  };

  const handleClose = () => {
    setClose(true);
  };

  if (close) return null;

  if (!data) {
    return <p>User not found</p>;
  }

  return (
    <div className="max-w-[420px] w-full mx-auto bg-white rounded-md border-[1px] border-gray-300 p-4 relative">
      <div className="flex flex-col items-center gap-5 mt-7">
        <div className="relative">
          <div className="text-[100px] text-center border-[1px] border-black rounded-full p-2 w-fit cursor-pointer">
            <BiUser />
          </div>
          <button className="absolute bottom-1 right-1 bg-green-800 text-white rounded-full p-2 text-[20px] hover:bg-green-600 transition ease-in-out duration-300 cursor-pointer">
            <BiCamera />
          </button>
        </div>
        <p className="font-semibold">{userName}</p>
        <button
          className="absolute top-[8px] right-[8px] text-xl hover:bg-red-800 hover:text-white rounded-full transition ease-in-out duration-300 p-[1px]"
          onClick={handleClose}
        >
          <IoClose />
        </button>
      </div>

      <div className="flex flex-col gap-5 mt-5">
        <div className="flex justify-between items-center w-full border-[1px] py-[5px] px-[10px] rounded-sm">
          <div className="flex gap-1">
            <p className="font-semibold">E-mail:</p>
            <p>{userEmail}</p>
          </div>
          <div className="hover:bg-green-800 p-1 text-lg cursor-pointer rounded-sm hover:text-white -mr-[5px] transition ease-in-out duration-300">
            <MdEdit />
          </div>
        </div>

        <div className="flex justify-between items-center w-full border-[1px] py-[5px] px-[10px] rounded-sm">
          <div className="flex gap-1">
            <p className="font-semibold">Mobile Number:</p>
            <p>+94 {userPhone}</p>
          </div>
          <div className="hover:bg-green-800 p-1 text-lg cursor-pointer rounded-sm hover:text-white -mr-[5px] transition ease-in-out duration-300">
            <MdEdit />
          </div>
        </div>

        <div className="flex gap-1 w-full border-[1px] py-[5px] px-[10px] rounded-sm">
          <p className="font-semibold">Country:</p>
          <p>{userCountry}</p>
        </div>

        <button
          className="bg-red-800 text-white rounded-sm px-2 py-1 mt-2"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

function Profile() {
  const router = useRouter();
  const { id: userId } = router.query;

  console.log("User ID from URL:", userId);

  if (!userId) {
    return <p>Loading...</p>;
  }

  // Find user by ID in the UserData array
  const userData = UserData.find((item) => item.id === userId);

  return (
    <div className="grid grid-cols-1 gap-[15px]">
      <ProfileCardItem data={userData} />
    </div>
  );
}

export default Profile;
