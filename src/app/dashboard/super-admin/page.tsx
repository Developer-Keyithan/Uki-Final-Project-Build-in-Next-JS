'use client'

import { useEffect, useState, JSX } from "react";
import UserDashboard from "../../../../Components/User Dashboard Controller/UserDashboardController";
import axios from "axios";
import { useRouter } from "next/navigation";
import Deliveries from "../../../../Components/Admins/Deliveries";
import Users from "../../../../Components/Admins/Users";
import Products from "../../../../Components/Admins/Products";
import Orders from "../../../../Components/Admins/Orders";
import Payments from "../../../../Components/Admins/Payments";
import Requests from "../../../../Components/Admins/Requests";
import Offers from "../../../../Components/Admins/Offers";
import Navbar from "../../../../Components/Navbar/Navbar";
import Footer from "../../../../Components/Footer/Footer";


const adminDashboard = () => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    userType: ''
  })
  const [activePanel, setActivePanel] = useState<string>("Users");


  const router = useRouter();

  useEffect(() => {
    const findUser = async () => {
      const response = await axios.get('/api/cookie');
      if (response.status === 200 && response.data.user.userType !== 'super-admin') {
        router.push('/')
      }

      if (response.status === 200 && response.data.user.userType === 'super-admin') {
        const id = response.data.user.id;
        const superAdmin = await axios.post('/api/user/get-user', {
          userId: id
        });

        setUser(superAdmin.data.user)
      }
    }

    findUser()
  }, [])

  const panels = ["Users", "Products", "Orders", "Payments", "Deliveries", "Requests", "Offers"];

  const panelComponents: { [key: string]: JSX.Element } = {
    Users: <Users />,
    Products: <Products />,
    Orders: <Orders />,
    Payments: <Payments />,
    Deliveries: <Deliveries />,
    Requests: <Requests />,
    Offers: <Offers />
  };

  const handlePanelClick = (panel: string) => {
    setActivePanel(panel);
  }

  return (
    <div className="min-h-[100vh] relative">
      <div className="sticky top-0 z-50">
        <Navbar />
        <hr />
      </div>
      <div className="mx-60">
        <div className="flex gap-1 flex-row-reverse text-end w-full text-gray-500 mt-5">
          <h3 className="font-semibold text-primaryColor">{user.firstName} {user.lastName}</h3>
          |
          <p className="capitalize">{user.userType}</p>
          |
          <p>{user.email}</p>
        </div>
        <div className="flex justify-between mt-5">
          {panels.map((panel) => (
            <button
              key={panel}
              onClick={() => handlePanelClick(panel)}
              className={`px-4 w-full py-2 rounded-sm border-[1px] ${activePanel === panel ? 'text-white bg-primaryColor hover:bg-primaryColor border-primaryColor' : 'text-primaryColor border-gray-200'} hover:bg-gray-200 transition ease-in-out duration-300`}
            >
              {panel}
            </button>
          ))}
        </div>
        {panelComponents[activePanel]}
      </div>
      <Footer />
    </div>
  )
}

export default adminDashboard;
