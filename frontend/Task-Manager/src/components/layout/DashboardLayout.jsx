import React, { useState } from "react";
import { UserContext } from "../../context/UserContext";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";

const DashboardLayout = ({ children, activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  // Close menu when clicking backdrop on mobile
  const handleBackdropClick = (e) => {
    if (e.target.id === "backdrop") {
      setOpenSideMenu(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar for desktop (always visible) */}
      <div className="hidden md:block sticky top-[61px] z-50 h-[calc(100vh-61px)]">
        <SideMenu activeMenu={activeMenu} />
      </div>

      {/* Mobile sidebar overlay */}
      {openSideMenu && (
        <div
          id="backdrop"
          onClick={handleBackdropClick}
          className="fixed inset-0 bg-white bg-opacity-50 z-50 flex"
        >
          <div className="bg-white w-64 h-full shadow-lg">
            <SideMenu activeMenu={activeMenu} onClose={() => setOpenSideMenu(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-auto">
        <Navbar
          activeMenu={activeMenu}
          openSideMenu={openSideMenu}
          setOpenSideMenu={setOpenSideMenu}
        />
        <main className="flex-1 p-1 lg:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
