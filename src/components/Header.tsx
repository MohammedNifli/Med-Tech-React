import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, User, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../slices/authSlice';

import axiosInstance from '@/utils/axiosClient';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const checkLoginStatus = () => {
    const accessToken = localStorage.getItem('accessToken');
    setIsLoggedIn(!!accessToken);
  };

  useEffect(() => {
    checkLoginStatus();

    const handleStorageChange = () => {
      checkLoginStatus();
    };

  
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post('/user/logout', {}, {
        withCredentials: true,
      });
      console.log('Response of logout:', response);
      
      dispatch(logout());
      localStorage.removeItem('accessToken'); // Remove token on logout
      checkLoginStatus(); // Update local state
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  return (
    <div className="fixed w-full h-24 top-0 bg-white shadow-xl z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-0 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex items-center h-full">
            <a href="/">
              <img
                src="pictures/med-tech_logo.png"
                alt="Flower Medical Logo"
                className="w-1/4 object-contain"
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="mr-28 hidden md:flex items-center justify-end flex-1">
            <nav className="flex space-x-4 font-arial font-bold lg:space-x-8 mr-4">
              <a href="/find" className="text-gray-600 hover:text-gray-800">Find Doctors</a>
              <a href="/" className="text-purple-600 hover:text-purple-800">Home</a>
              <a href="/services" className="text-gray-600 hover:text-gray-800">Services</a>
              <a href="/about-us" className="text-gray-600 hover:text-gray-800">About Us</a>
              <a href="/signup" className="text-gray-600 hover:text-gray-800">Register</a>
            </nav>
          </div>

          {/* Conditional Login/Logout Button */}
          <div className='pr-16' ref={dropdownRef}>
            {isLoggedIn ? (
              <div className="flex items-center space-x-4 relative">
                <button
                  onClick={toggleProfileDropdown}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <User className="h-6 w-6 text-gray-600" />
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                </button>
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                    <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <a
                href="/login"
                className="px-4 py-2 rounded-full bg-purple-500 text-white font-medium hover:bg-purple-600"
              >
                Login
              </a>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="/" className="block px-3 py-2 rounded-md text-base font-medium text-purple-600 hover:text-purple-800">Home</a>
            <a href="/services" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-800">Services</a>
            <a href="/about-us" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-800">About Us</a>
            <a href="/register" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-800">Register</a>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 ">
            <div className="px-2">
              {isLoggedIn ? (
                <>
                  <a href="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-800">Profile</a>
                  <a href="/settings" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-800">Settings</a>
                  <button
                    onClick={handleLogout}
                    className="block w-full mt-2 px-4 py-2 text-center rounded-full bg-red-500 text-white font-medium hover:bg-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <a
                  href="/login"
                  className="block w-full px-4 py-2 text-center rounded-full bg-purple-500 text-white font-medium hover:bg-purple-600"
                >
                  Login
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
