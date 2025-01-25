'use client'

import { useState, useEffect, JSX } from "react";
import UserDashboard from "../../../Components/User Dashboard Controller/UserDashboardController";
import AddressData from "../../../Data/AddressData";
import Delivered from "../../../Components/Delivered/Delivered";
import Cancelled from "../../../Components/Cancelled/Cancelled";
import Loader from "../../../Components/Loader/Loader";
import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie
import { jwtDecode } from "jwt-decode"; // Import jwt-decode

const DashboardPage = () => {
  const [activePanel, setActivePanel] = useState<string>("Delivered"); 
  const [loading, setLoading] = useState<boolean>(true);
  const [UserData, setUserData] = useState<any>(null); // Change to `any` or a specific object type

  const panelComponents: { [key: string]: JSX.Element } = {
    Delivered: <Delivered />,
    Cancelled: <Cancelled />,
    // You can add more panels here as your app grows
  };

  const handlePanelClick = (panel: string) => {
    setActivePanel(panel);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get('jwt-token'); // Get JWT token from the cookie
        console.log(token)
        if (token) {
          const decoded: any = jwtDecode(token); // Decode the JWT token
          console.log(decoded)
          const userId = decoded.userId; // Extract the user ID from the decoded token
          console.log(userId)
          const response = await axios.post('/api/user/get-user', {
            userId
          });

          if (response.status === 200) {
            setUserData(response.data.user);
          }
          console.log(response)
        }
      } catch (error: any) {
        console.error(error);
      }
    };

    fetchUserData();
  }, []); // Empty dependency array to run once on mount

  return (
    <div className="mx-60">
      {loading ? (
        <Loader />
      ) : (
        <>
          {UserData && <UserDashboard User={UserData} Address={AddressData[0]} onPanelClick={handlePanelClick} />}
          {panelComponents[activePanel]}
        </>
      )}
    </div>
  );
};

export default DashboardPage;
