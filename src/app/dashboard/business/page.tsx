"use client";

import { useState, useEffect, JSX } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { cn } from "../../../../lib/utils";
import Loader from '../../../../Components/Loader/Loader';
import Footer from "../../../../Components/Footer/Footer";
import Navbar from "../../../../Components/Navbar/Navbar";

import Analytics from "../../../../Components/Business/Analytics";
import Products from "../../../../Components/Business/Products";
import Orders from "../../../../Components/Business/Orders";
import Reviews from "../../../../Components/Business/Reviews";

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

const DashboardPage = () => {
  const [user, setUser] = useState<UserDataType | null>(null);
  const [activePanel, setActivePanel] = useState<string>("Analytics");
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string>("");
  const [products, setProducts] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const findUser = async () => {
      try {
        const response = await axios.get("/api/cookie");
        if (response.status === 200 && response.data.user.userType !== "super-admin") {
          router.push("/");
          return;
        }

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

  useEffect(() => {
    if (userId) {
      const getTotalProductsCount = async () => {
        try {
          const response = await axios.post("/api/product/get-by-userId", { userId });
          setProducts(response.data.products);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      };

      getTotalProductsCount();

      const interval = setInterval(getTotalProductsCount, 3000);

      return () => clearInterval(interval);
    }
  }, [userId]);

  const panels = ["Analytics", `My Products (${products.length})`, "Orders", "Reviews"];

  const panelComponents: { [key: string]: JSX.Element } = {
    Analytics: <Analytics />,
    [`My Products (${products.length})`]: <Products id={userId} />,
    Orders: <Orders />,
    Reviews: <Reviews />,
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