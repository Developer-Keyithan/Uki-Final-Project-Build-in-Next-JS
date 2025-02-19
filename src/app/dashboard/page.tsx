'use client'

import { useState, useEffect, JSX } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "../../../Components/Navbar/Navbar";
import Footer from "../../../Components/Footer/Footer";
import UserDashboard from "../../../Components/Dashboard Components/User/User Dashboard Controller/UserDashboardController";
import Orders from "../../../Components/Dashboard Components/User/Orders/Orders";
import Reviews from "../../../Components/Dashboard Components/User/Reviews/Reviews";

const DashboardPage = () => {
  const [activePanel, setActivePanel] = useState<string>("Orders");
  const [UserData, setUserData] = useState()

  const router = useRouter();

  useEffect(() => {
    const findUser = async () => {
      const response = await axios.get('/api/cookie');

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
    Orders: <Orders />,
    "Reviews and Ratings": <Reviews />
  };

  const panels = ["Orders", "Reviews and Ratings"];

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