import React, { useContext, useState } from "react";
import { UserContext } from "../../context/userContext"; // User context
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";

const DashboardLayout = ({ children, activeMenu }) => {
  const { User } = useContext(UserContext);
  const [openSideMenu, setOpenSideMenu] = useState(true);

  const toggleSideMenu = () => {
    setOpenSideMenu(!openSideMenu);
  };

  return (
    <div className="flex h-screen overflow-auto">
      <SideMenu activeMenu={activeMenu} isAdmin={User?.role === "admin"} />
      <div className="flex-1 flex flex-col">
        <Navbar activeMenu={activeMenu} toggleSideMenu={toggleSideMenu} />
        <div className=" p-12">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
