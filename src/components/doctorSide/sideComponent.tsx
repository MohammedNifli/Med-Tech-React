import React, { useState } from "react";
import { ChevronRight, User, CalendarDays, ClipboardCheck, Clock, MessageSquare, CheckCircle2, Wallet, LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedItem, setSelectedItem] = useState("Dashboard");
  const navigate = useNavigate();

  const handleItemClick = (text: string, route: string) => {
    setSelectedItem(text);
    navigate(route);
  };

  const sidebarItems = [
    { icon: User, text: "Dashboard", route: "/doctor/dashboard" },
    { icon: CalendarDays, text: "Appointments", route: "/doctor/appointments" },
    { icon: ClipboardCheck, text: "Apply for Approval", route: "/doctor/apply" },
    { icon: Clock, text: "Add slots", route: "/doctor/slot" },
    { icon: MessageSquare, text: "Chat", route: "/doctor/chat" },
    { icon: CheckCircle2, text: "Approval Status", route: "/doctor/approval" },
    { icon: Wallet, text: "Wallet", route: "/doctor/wallet" }
  ];

  return (
    <div className="flex min-h-screen">
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-blue-600 text-white"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar */}
      <div 
        className={`fixed left-0 top-20 h-[calc(100vh-5rem)] bg-[#0f1729] transition-all duration-300 ease-in-out flex flex-col
          ${isExpanded ? 'w-64' : 'w-16'} 
          ${isExpanded ? 'md:w-64' : 'md:w-16'}
        `}
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center justify-between px-4">
          {isExpanded && (
            <span className="text-white font-semibold">Doctor Panel</span>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white p-1 rounded-lg hover:bg-blue-800 transition-colors"
          >
            <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          {sidebarItems.map((item) => (
            <div
              key={item.text}
              onClick={() => handleItemClick(item.text, item.route)}
              className={`flex items-center cursor-pointer px-2 py-3 mb-1 rounded-lg transition-all duration-200
                ${selectedItem === item.text ? 'bg-blue-800 text-white' : 'text-gray-400 hover:bg-blue-800/50 hover:text-white'}
              `}
            >
              <item.icon className={`w-5 h-5 ${isExpanded ? 'mr-3' : 'mx-auto'}`} />
              {isExpanded && (
                <span className="text-sm font-medium whitespace-nowrap">
                  {item.text}
                </span>
              )}
            </div>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 mt-auto border-t border-blue-800">
          <button
            className={`flex items-center text-red-400 hover:text-red-300 transition-colors w-full
              ${isExpanded ? 'px-2 py-2' : 'justify-center py-2'}
              hover:bg-red-500/10 rounded-lg
            `}
          >
            <LogOut className={`w-5 h-5 ${isExpanded ? 'mr-3' : ''}`} />
            {isExpanded && (
              <span className="text-sm font-medium">Logout</span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${isExpanded ? 'ml-64' : 'ml-16'} mt-20`}>
        {/* Your main content goes here */}
      </div>
    </div>
  );
}