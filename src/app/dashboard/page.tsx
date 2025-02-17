'use client'

import { useState, useEffect, JSX } from "react";
import UserDashboard from "../../../Components/Dashboard Components/User/User Dashboard Controller/UserDashboardController";
import UserData from "../../../Data/User";
import AddressData from "../../../Data/AddressData";
import Delivered from "../../../Components/Dashboard Components/User/Delivered/Delivered"
import Cancelled from "../../../Components/Dashboard Components/User/Cancelled/Cancelled";
import SavedData from "../../../Components/Dashboard Components/User/Saved Data/SavedData";
import Loader from "../../../Components/Loader/Loader";
import axios from "axios";
import router, { useRouter } from "next/navigation";
import Navbar from "../../../Components/Navbar/Navbar";
import Footer from "../../../Components/Footer/Footer";
import Orders from "../../../Components/Dashboard Components/User/Orders/Orders";

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
  const [activePanel, setActivePanel] = useState<string>("Orders");
  const [loading, setLoading] = useState<boolean>(true);
  const [UserData, setUserData] = useState()

  const router = useRouter();

  useEffect(() => {
    const findUser = async () => {
      const response = await axios.get('/api/cookie');


      if (response.status === 200 && response.data.user.userType !== 'consumer') {
        router.push('/')
      }

      if (response.status === 200 && response.data.user.userType === 'consumer') {
        const id = response.data.user.id;
        const superAdmin = await axios.post('/api/user/get-user', {
          userId: id
        });

        setUserData(superAdmin.data.user);
      }
    }

    findUser()
  }, [])

  const panelComponents: { [key: string]: JSX.Element } = {
    "Saved Data" : <SavedData />,
    Orders: <Orders />
    // You can add more panels here as your app grows
  };

  const panels = ["Orders", "Reviews", "Messages", "Saved Data"];

  const handlePanelClick = (panel: string) => {
    setActivePanel(panel);
  }
  return (
    <div>
      <div className="sticky top-0 z-50">
        <Navbar />
        <hr />
      </div>
      <div className="mx-60">
        {UserData && <UserDashboard User={UserData} activePanel={activePanel} onPanelClick={handlePanelClick} panels={panels} />}
        {panelComponents[activePanel]}
      </div>
      <Footer />
    </div>
  );
};

export default DashboardPage;