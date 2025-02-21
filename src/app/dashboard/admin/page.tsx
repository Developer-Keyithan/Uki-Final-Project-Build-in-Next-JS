'use client'

import { useEffect, useState, JSX } from "react";
import axios from "axios";
import Users from "../../Components/Dashboard Components/Admins/Users";
import Products from "../../Components/Dashboard Components/Admins/Products";
import Orders from "../../Components/Dashboard Components/Admins/Orders";
import Contacts from "../../Components/Dashboard Components/Admins/Contacts";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";


const AdminDashboard = () => {
  const [user, setUser] = useState({
    _id: '',
    firstName: '',
    lastName: '',
    email: '',
    userType: ''
  })
  const [activePanel, setActivePanel] = useState<string>("Users");

  useEffect(() => {
    const findUser = async () => {
      const response = await axios.get('/api/cookie');

      if (response.status === 200 && response.data.user.userType === 'admin') {
        const id = response.data.user.id;
        const superAdmin = await axios.post('/api/user/get-user', {
          userId: id
        });

        setUser(superAdmin.data.user)
      }
    }

    findUser()
  }, [])

  const panels = ["Users", "Products", "Orders", "Contacts"];

  const panelComponents: { [key: string]: JSX.Element } = {
    Users: <Users />,
    Products: <Products id={user._id}/>,
    Orders: <Orders />,
    Contacts: <Contacts />
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
      <div className="mx-60">
        <div className="flex justify-between">
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

export default AdminDashboard;
