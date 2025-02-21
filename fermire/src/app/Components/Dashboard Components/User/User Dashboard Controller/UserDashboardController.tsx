import { BiCamera, BiUser } from "react-icons/bi";
import "./style.css";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";

interface UserDataType {
  _id: string;
  mobileNumber: number[];
  firstName: string;
  lastName: string;
  email: string;
  updatedAt: string;
  address: string;
}

const UserDashboard: React.FC<{
  User: UserDataType,
  activePanel: string;
  onPanelClick: (panel: string) => void;
  panels: string[];
}> = ({ User, activePanel, onPanelClick, panels }) => {
  const userId = User?._id;
  const name = `${User.firstName} ${User.lastName}`;
  const email = User?.email || "N/A";
  const number = User?.mobileNumber.length > 0 ? User.mobileNumber.join(", ") : "N/A";
  const updatedAt = User?.updatedAt || "N/A";
  const address = User?.address || "<Address not provided>*";

  const handleLogout = async () => {
    try {
      const response = await axios.post('/api/user/logout');
      if (response.status === 200) {
        toast.success('Logout Successful');
      } else {
        toast.error('Oops! Logout Failed.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Oops! Logout Failed.');
    }
  }

  const handleDelete = async () => {
    try {
      const response = await axios.delete('/api/user', {
        data: { userId: userId }
      });

      if (response.status === 200) {
        toast.success('Logout Successful');
      } else {
        toast.error('Oops! Logout Failed.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Oops! Logout Failed.');
    }
  };

  return (
    <div className="w-full border-[1px] mt-10 pt-10 rounded-sm relative">
      <div className="flex w-full justify-around">
        <div className="relative">
          <div className="text-[200px] text-center border-[1px] border-black rounded-full p-2 w-fit cursor-pointer">
            <BiUser />
          </div>
          <button className="absolute bottom-1 right-1 bg-green-800 text-white rounded-full p-2 text-[20px] hover:bg-green-600 transition ease-in-out duration-300 cursor-pointer">
            <BiCamera />
          </button>
        </div>

        <div className="flex flex-col justify-center w-2/3">
          <div>
            <h1 className="font-semibold text-3xl">Welcome, {name}!</h1>
            <p className="text-gray-600">
              <strong className="font-semibold">Last Update: </strong>
              {new Date(updatedAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}
            </p>
          </div>
          <div className="relative flex flex-col mt-10 border-[1px] px-5 py-4 rounded-sm">
            <p>
              <strong className="font-semibold">E-mail: </strong>
              {email}
            </p>
            <p className="mt-1">
              <strong className="font-semibold">Phone: </strong>
              {number}
            </p>
            <p className="mt-1">
              <strong className="font-semibold">Address: </strong>
              {address}
            </p>
            <Link href='/form'>
              <p
                className="absolute right-0 bottom-0 py-1 px-4 m-1 rounded-sm font-semibold cursor-pointer bg-primaryColor text-white hover:bg-primaryButtonHoverColor transition ease-in-out duration-300"
              >
                I want to run a business
              </p>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-10">
        {panels.map((panel) => (
          <button
            key={panel}
            onClick={() => onPanelClick(panel)}
            className={`px-4 w-full py-2 border-r-[1px] last:border-r-[0px] border-t-[1px] ${activePanel === panel ? 'text-white bg-primaryButtonHoverColor border-primaryColor' : 'text-primaryColor'} transition ease-in-out duration-500`}
          >
            {panel}
          </button>
        ))}
      </div>

      <div className="absolute -top-8 right-0 flex gap-5">
        <p
          onClick={handleLogout}
          className="font-semibold cursor-pointer text-orange-600 hover:text-orange-800 transition ease-in-out duration-300"
        >
          Log out from this device
        </p>
        <p
          onClick={handleDelete}
          className="font-semibold cursor-pointer text-red-600 hover:text-red-800 transition ease-in-out duration-300"
        >
          Delete my account
        </p>
      </div>
    </div>
  );
};

export default UserDashboard;
