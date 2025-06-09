import { HiOutlineX, HiOutlineMenu } from "react-icons/hi";
import React from "react";

const Navbar = ({ openSideMenu, setOpenSideMenu }) => {
  return (
    <div className="flex items-center gap-5 bg-white border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-5 sticky top-0 z-60">
      {/* Hamburger visible only on mobile */}
      <button
        className="block lg:hidden md:hidden text-black"
        onClick={() => setOpenSideMenu(!openSideMenu)}
        aria-label={openSideMenu ? "Close menu" : "Open menu"}
      >
        {openSideMenu ? (
          <HiOutlineX className="text-2xl" />
        ) : (
          <HiOutlineMenu className="text-2xl" />
        )}
      </button>
      <h2 className="text-lg font-medium text-black">Task Manager</h2>
    </div>
  );
};

export default Navbar;
