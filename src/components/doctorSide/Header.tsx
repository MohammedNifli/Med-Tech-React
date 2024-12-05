import React from 'react';
import { IoNotificationsOutline } from "react-icons/io5";
import { FaUserDoctor } from "react-icons/fa6";

const Header = () => {
  return (
    <header className="bg-white shadow-md w-full border-b rounded-sm border-gray-200 fixed z-50">
      <div className="container mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
        <div className="h-full max-w-[160px] relative">
          <img 
            className="h-full w-full object-contain" 
            src="/pictures/med-tech_logo.png" 
            alt="Med-Tech Logo" 
          />
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
            <IoNotificationsOutline className="h-6 w-6 text-gray-600" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
            <FaUserDoctor className="h-6 w-6 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;