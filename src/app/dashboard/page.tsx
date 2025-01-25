'use client'

import { useState, useEffect, JSX } from "react";
import UserDashboard from "../../../Components/User Dashboard Controller/UserDashboardController";
import UserData from "../../../Data/User";
import AddressData from "../../../Data/AddressData";
import Delivered from "../../../Components/Delivered/Delivered";
import Cancelled from "../../../Components/Cancelled/Cancelled";
import Loader from "../../../Components/Loader/Loader";

const DashboardPage = () => {
  const [activePanel, setActivePanel] = useState<string>("Delivered"); 
  const [loading, setLoading] = useState<boolean>(true);

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

  return (
    <div className="mx-60">
      {loading ? (
        <Loader />
      ) : (
        <>
          <UserDashboard User={UserData[0]} Address={AddressData[0]} onPanelClick={handlePanelClick} />
          {panelComponents[activePanel]}
        </>
      )}
    </div>
  );
};

export default DashboardPage;
