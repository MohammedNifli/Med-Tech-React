import React, { useState } from 'react';
import { 
  Calendar, 
  MessageSquare,
  CreditCard,
  Home,
  Settings,
  HelpCircle,
  LogOut,
  Star,
  Video,
  ArrowLeft,
  Menu,
  X
} from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const navigationItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: Calendar, label: 'Appointments', href: '/appointments', active: true },
    { icon: Video, label: 'Online Consultations', href: '/online-consultations', badge: 1 },
    { icon: Star, label: 'Offline Consultations', href: '/offline-consultations' },
    { icon: CreditCard, label: 'Payments', href: '/payment-list' },
  ];

  return (
    <>
      {/* Toggle Button - Fixed Position */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-28 left-4 z-50 lg:hidden p-2 rounded-lg bg-white shadow-lg border border-gray-200"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside 
        className={`
          fixed top-24 left-0 h-[calc(100vh-96px)]
          bg-white border-r border-gray-200 flex flex-col
          transition-all duration-300 ease-in-out
          ${isOpen ? 'w-64' : 'w-20'}
          lg:block
        `}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <span className={`text-xl font-semibold text-gray-800 whitespace-nowrap ${!isOpen && 'hidden'}`}>
            Medical Portal
          </span>
          {!isOpen && <Menu className="w-6 h-6 mx-auto" />}
        </div>

        {/* User Profile Section */}
        <div className={`px-4  py-6 border-b border-gray-200 ${!isOpen && 'items-center'}`}>
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-semibold text-white">JD</span>
            </div>
            {isOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">John Doe</p>
                <div className="flex items-center mt-1">
                  <div className="text-xs text-gray-500">Patient ID: #12345</div>
                </div>
              </div>
            )}
          </div>
          {/* Quick Stats */}
          {isOpen && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <div className="text-sm font-medium text-gray-900">5</div>
                <div className="text-xs text-gray-500">Appointments</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <div className="text-sm font-medium text-gray-900">3</div>
                <div className="text-xs text-gray-500">Consultations</div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1  px-4 py-4 overflow-y-auto">
          <div className="space-y-1">
            {navigationItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={`
                  flex items-center justify-between px-3 py-2.5 rounded-lg
                  text-sm font-medium transition-all duration-200 relative
                  ${item.active 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}
                `}
                title={!isOpen ? item.label : ''}
              >
                <div className="flex items-center">
                  <item.icon className={`w-5 h-5 ${isOpen ? 'mr-3' : 'mx-auto'} ${item.active ? 'text-blue-700' : 'text-gray-400'}`} />
                  {isOpen && <span>{item.label}</span>}
                </div>
                {isOpen && item.badge && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {item.badge}
                  </span>
                )}
                {!isOpen && item.badge && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-blue-600 rounded-full" />
                )}
              </a>
            ))}
          </div>
        </nav>

        {/* Back to Home Button */}
        <div className="p-4 border-t border-gray-200">
          <button className={`
            flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 
            hover:bg-gray-50 rounded-lg transition-colors duration-200
            ${!isOpen ? 'justify-center w-12 mx-auto' : 'w-full'}
          `}>
            <ArrowLeft className="w-5 h-5" />
            {isOpen && <span className="ml-3">Back to Home</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;