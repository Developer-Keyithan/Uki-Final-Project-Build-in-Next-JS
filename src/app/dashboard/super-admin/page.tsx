'use client'

import { useEffect, useState } from "react";
import UserDashboard from "../../../../Components/User Dashboard Controller/UserDashboardController";
import axios from "axios";
import { useRouter } from "next/navigation";

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

const adminDashboard = () => {
  const [UserData, setUserData] = useState<UserDataType | null>(null);
  const [activePanel, setActivePanel] = useState<string>("Delivered");

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

        setUserData(superAdmin.data.user);
      }
    }

    findUser()
  }, [])

  const panels = ["Delivered", "Tracking", "Reviews", "Messages", "Cancelled", "Saved Data"];

  const handlePanelClick = (panel: string) => {
    setActivePanel(panel);
  }

  return (
    <div className="mx-60">
      {UserData && <UserDashboard User={UserData} activePanel={activePanel} onPanelClick={handlePanelClick} panels={panels} />}
    </div>
  )
}

export default adminDashboard;
