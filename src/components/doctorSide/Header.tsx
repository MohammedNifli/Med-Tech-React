import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaBars, FaUserDoctor } from 'react-icons/fa6';
import { IoNotificationsOutline } from 'react-icons/io5';
import { RootState } from '@/reduxStore/store';
import { motion } from 'framer-motion';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const doctorInfo = useSelector((state: RootState) => state.doctor.doctorInfo);
  const [doctorName, setDoctorName] = useState<string | undefined>('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (doctorInfo) {
      setDoctorName(doctorInfo.name);
    }
  }, [doctorInfo]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`bg-white w-full fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'shadow-lg border-b border-gray-200' : 'border-b border-gray-200'
      }`}
    >
      <div className="w-full h-20 flex items-center justify-between">
        {/* Left section with no padding */}
        <div className="flex items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMenuClick}
            className="md:hidden p-2 ml-3 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            aria-label="Toggle Menu"
          >
            <FaBars className="h-6 w-6" />
          </motion.button>

          <motion.div 
            className="flex items-center ml-3 md:ml-8"
            whileHover={{ scale: 1.02 }}
          >
            <img
              className="h-24 w-auto object-contain"
              style={{ maxWidth: '160px' }}
              src="/pictures/med-tech_logo.png"
              alt="Med-Tech Logo"
            />
          </motion.div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4 px-6">
          {doctorInfo ? (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2.5 rounded-full hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                aria-label="Notifications"
              >
                <IoNotificationsOutline className="h-6 w-6 text-gray-600" />
                <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 rounded-full ring-2 ring-white" />
              </motion.button>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <FaUserDoctor className="h-6 w-6 text-gray-600" />
                </div>
                <span className="hidden md:inline text-base font-medium text-gray-700">
                  {doctorName || 'Doctor'}
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 text-base text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
              >
                Login
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 text-base bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Register
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;