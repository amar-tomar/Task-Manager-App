import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuLogOut } from "react-icons/lu";
import { adminNavData, userNavData } from "../../utils/data.js";
import { UserContext } from "../../context/UserContext";

const SideMenu = ({ activeMenu, onClose }) => {
  const { user, clearUser } = useContext(UserContext);
  const [sideMenuData, setSideMenuData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setSideMenuData(user.role === "admin" ? adminNavData : userNavData);
    }
  }, [user]);

  const handleClick = (route) => {
    navigate(route);
    if (onClose) onClose(); // Close menu after navigation on mobile
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.clear();
    clearUser();
    navigate("/login", { replace: true });
    if (onClose) onClose();
  };

  return (
    <div className='flex flex-col h-full bg-white border-r border-gray-200/50 w-64 md:w-64 lg:w-64'>
      {/* User Profile Section */}
      <div className='flex flex-col items-center justify-center mb-7 pt-5'>
        <div className='relative mt-20 md:mt-0 lg:mt-0'>
          <img
            className='w-20 h-20 bg-slate-400 rounded-full object-cover'
            src={user?.profileImageUrl || "/default-avatar.png"}
            alt='Profile'
          />
        </div>
        {user?.role === "admin" && (
          <div className='text-[10px] font-medium text-white bg-blue-500 px-3 py-0.5 rounded mt-1'>
            Admin
          </div>
        )}
        <h5 className='text-gray-950 font-medium leading-6 mt-3'>
          {user?.name || "Unknown"}
        </h5>
        <p className='text-[12px] text-gray-950'>{user?.email}</p>
      </div>

      {/* Navigation Menu */}
      <nav className='flex flex-col flex-grow overflow-auto'>
        {sideMenuData.map((item, index) => (
          <button
            key={`menu-${index}`}
            onClick={() => handleClick(item.path)}
            className={`w-full flex items-center gap-3 px-5 py-3 rounded-lg transition-all duration-200 text-[15px] font-medium
            ${
              activeMenu === item.label
                ? "bg-blue-100 text-blue-700 shadow-inner border-r-4 border-blue-500"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <item.icon className='text-xl' />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className='w-full flex items-center gap-3 px-5 py-3 mt-4 rounded-lg text-red-600 hover:bg-red-100 transition-all duration-200 text-[15px] font-medium'
      >
        <LuLogOut className='text-xl' />
        Logout
      </button>
    </div>
  );
};

export default SideMenu;
