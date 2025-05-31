import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LuLayoutDashboard,
  LuClipboardCheck,
  LuSquarePlus,
  LuLogOut,
} from "react-icons/lu"; // Add more icons if needed
import { adminNavData, userNavData } from "../../utils/data.js"; // Import the data
import { UserContext } from "../../context/userContext.jsx";

const SideMenu = ({ activeMenu }) => {
  const { User, clearUser } = useContext(UserContext);
  const [SideMenuData, setSideMenuData] = useState([]);
  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };
  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };
  useEffect(() => {
    if (User) {
      setSideMenuData(User?.role === "admin" ? adminNavData : userNavData);
    }
    return () => {};
  }, [User]);
  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 sticky top-[61px] z-20 ">
      <div className="flex flex-col items-center justify-center mb-7 pt-5">
        <div className="relative">
          <img
            className="w-20 h-20 bg-slate-400 rounded-full object-cover "
            src={User?.profileImageUrl}
            alt="Profile Image"
          />
        </div>

        {User?.role === "admin" && (
          <div className=" text-[10px] font-medium text-white bg-blue-500 px-3 py-0.5 rounded mt-1 ">
            Admin
          </div>
        )}
        <h5 className=" text-gray-950 font-medium leading-6 mt-3">
          {User?.name || ""}
        </h5>
        <p className=" text-[12px] text-gray-950"> {User?.email} </p>
      </div>
      {SideMenuData.map((item, index) => (
        <button
          key={`menu${index}`}
          onClick={() => handleClick(item.path)}
          className={`w-full flex items-center gap-3 px-5 py-3 rounded-lg transition-all duration-200 text-[15px] font-medium
      ${
        activeMenu === item.label
          ? "bg-blue-100 text-blue-700 shadow-inner border-r-3 border-blue-500"
          : "hover:bg-gray-100 text-gray-700"
      }`}
        >
          <item.icon className="text-xl" />
          {item.label}
        </button>
      ))}
    </div>
  );
};
export default SideMenu;
