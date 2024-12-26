import React, { useState } from 'react';
import {
  Calendar,
  CreditCard,
  
  Star,
  Video,
  ArrowLeft,
  Menu,
  X
} from 'lucide-react';

const Sidebar:React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [selected,setSelected]= useState('Appointments')

  const navigationItems = [
    { icon: Calendar, label: 'Appointments', href: '/appointments', active: true },
    { icon: Video, label: 'Online Consultations', href: '/online-consultations', badge: 1 },
    { icon: Star, label: 'Offline Consultations', href: '/offline-consultations' },
    { icon: CreditCard, label: 'Payments', href: '/payment-list' },
  ];

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-28 left-4 z-50 lg:hidden p-2 rounded-lg bg-white shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
      >
        {isOpen ? <X size={20} className="text-gray-600" /> : <Menu size={20} className="text-gray-600" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-20 h-screen bg-gradient-to-b from-blue-50 to-white border-r border-gray-200 
        transition-all duration-300 ease-in-out ${
          isOpen ? 'w-64' : 'w-20'
        } shadow-xl`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            
            {isOpen && (
              <span className="font-bold text-xl bg-gradient-to-r from-cyan-600 to-cyan-400 bg-clip-text text-transparent">
                Med-Tech
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex flex-col gap-3">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <a
                key={index}
                href={item.href}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                  item.active
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-white hover:shadow-md'
                }`}
              >
                <Icon 
                  size={20} 
                  className={`${!item.active && 'group-hover:text-blue-500'}`}
                />
                {isOpen && (
                  <span className={`font-medium ${!item.active && 'group-hover:text-blue-500'}`}>
                    {item.label}
                  </span>
                )}
                {item.badge && (
                  <div className={`ml-auto ${!isOpen && 'mr-2'}`}>
                    <span className="bg-red-500 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
                      {item.badge}
                    </span>
                  </div>
                )}
              </a>
            );
          })}
        </nav>

        {/* Back to Home Button */}
        <div className="absolute bottom-8 w-full px-4">
          <a
            href="/"
            className={`flex items-center gap-3 p-3 rounded-xl text-gray-600 hover:bg-white hover:shadow-md transition-all duration-200 group
              ${!isOpen && 'justify-center'}`}
          >
            <ArrowLeft size={20} className="group-hover:text-blue-500" />
            {isOpen && <span className="font-medium group-hover:text-blue-500">Back to Home</span>}
          </a>
        </div>
      </div>
    </>
  );
};

export default Sidebar;