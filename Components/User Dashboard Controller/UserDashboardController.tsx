import { useState } from "react";
import { BiCamera, BiUser } from "react-icons/bi";
import "./style.css";
import PannelSelector from "../../Components/Pannel Selector/PannelSelector";

interface UserDataType {
  number: number;
  email: string;
  name: string;
  updatedAt: string;
}

interface AddressDataType {
  no: string;
  street: string;
  town: string;
  division: string;
  district: string;
}

const UserDashboard: React.FC<{
  User: UserDataType;
  Address: AddressDataType;
  onPanelClick: (panel: string) => void;
}> = ({ User, Address, onPanelClick }) => {
  const name = User?.name || "Guest";
  const email = User?.email || "N/A";
  const number = User?.number || "N/A";
  const updatedAt = User?.updatedAt || "2014 Dec 21";
  const address = [
    Address?.no || "",
    Address?.street || "",
    Address?.town || "",
    Address?.division || "",
  ]
    .filter(Boolean)
    .join(", ");

  const panels = ["Delivered", "Tracking", "Reviews", "Messages", "Cancelled", "Saved Data"];

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
              <strong>Last Login: </strong>
              {updatedAt}
            </p>
          </div>
          <div className="flex flex-col mt-10 border-[1px] px-5 py-4 rounded-sm">
            <p>
              <strong>E-mail: </strong>
              {email}
            </p>
            <p className="mt-1">
              <strong>Phone: </strong>
              {number}
            </p>
            <p className="mt-1">
              <strong>Address: </strong>
              {address || "No Address Available"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-10">
        {panels.map((panel) => (
          <PannelSelector
            key={panel}
            textContent={panel}
            onClick={() => onPanelClick(panel)}
            isActive={false}
          />
        ))}
      </div>
      <div className="absolute -top-8 right-0 flex gap-5">
        <p className="font-semibold cursor-pointer text-orange-600 hover:text-orange-800 transition ease-in-out duration-300">Log out from this device</p>
        <p className="font-semibold cursor-pointer text-red-600 hover:text-red-800 transition ease-in-out duration-300">Delete my account</p>
      </div>
    </div>
  );
};

export default UserDashboard;
