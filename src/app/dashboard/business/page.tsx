"use client";

import { useState, useEffect, JSX } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { cn } from "../../lib/utils";
import Loader from '../../Components/Loader/Loader';
import Footer from "../../Components/Footer/Footer";
import Navbar from "../../Components/Navbar/Navbar";

import Products from "../../Components/Dashboard Components/Business/Products";
import Orders from "../../Components/Dashboard Components/Business/Orders";

type UserDataType = {
  id: string;
  name: string;
  email: string;
  userType: string;
  mobileNumber: number[];
  firstName: string;
  lastName: string;
  updatedAt: string;
};

interface ProductType {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

const DashboardPage = () => {
  const [user, setUser] = useState<UserDataType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const findUser = async () => {
      try {
        const response = await axios.get("/api/cookie");

        if (response.status === 200) {
          const { id } = response.data.user;
          setUserId(id);
          const superAdmin = await axios.post("/api/user/get-user", { userId: id });
          setUser(superAdmin.data.user);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    
    findUser();
  }, [router]);
  
  const [activePanel, setActivePanel] = useState<string>(`My Products`);
  const panels = [`My Products`, "Orders"];

  const panelComponents: { [key: string]: JSX.Element } = {
    [`My Products`]: <Products id={userId} />,
    Orders: <Orders />
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen relative">
      <div className="sticky top-0 z-50">
        <Navbar />
        <hr />
      </div>
      <div className="mx-60">
        {user && (
          <div className="flex items-center justify-end text-sm py-4 text-gray-500">
            <span className="font-semibold text-primary mr-2">
              {user.firstName} {user.lastName}
            </span>
            <span className="mr-2">|</span>
            <span className="capitalize mr-2">{user.userType}</span>
            <span className="mr-2">|</span>
            <span>{user.email}</span>
          </div>
        )}
      </div>
      <div className="mx-60 ">
        <div className="flex justify-between gap-[1px] mb-8">
          {panels.map((panel) => (
            <button
              key={panel}
              onClick={() => setActivePanel(panel)}
              className={cn(
                "px-6 py-3 w-full text-sm font-medium rounded-sm transition-colors",
                activePanel === panel
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white text-primary border border-gray-200 hover:bg-gray-50"
              )}
            >
              {panel}
            </button>
          ))}
        </div>

        {panelComponents[activePanel]}
      </div>

      <Footer />
    </div>
  );
};

export default DashboardPage;