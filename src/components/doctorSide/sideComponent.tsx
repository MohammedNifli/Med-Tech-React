import React, { useState } from "react";
import {
  FcApproval,
  FaUser,
  FaCalendarAlt,
  FaClipboardCheck,
  FaClock,
  FaComments,
  FaCheckCircle,
  FaMoneyBillWave,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutDoctor } from "../../slices/doctorSlice";
// import {toast,ToastContainer} from 'react-toastify'
import axios from "axios";
import { toast } from "react-toastify";
const SidebarComponent: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Use navigate for routing
  const [selectedItem, setSelectedItem] = useState<string>("Profile");

  const handleItemClick = (text: string, route: string) => {
    setSelectedItem(text);
    navigate(route); // Navigate to the route on item click
  };

  const handleLogout = async () => {
    try {
      console.log("hello this is  doctor logout handle function");
      const response = await axios.post(
        "http://localhost:4444/doctor/logout",
        {},
        {
          withCredentials: true,
        }
      );
      console.log(response);
      if (response.status == 200) {
        alert("logout succesfull");
        dispatch(logoutDoctor());
        navigate("/doctor/login");
      }

      // toast.success('Logged out successfully');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      id="main"
      className="bg-blue-950 w-64 fixed left-0 top-20 shadow-md border border-blue-950 bottom-0 flex flex-col justify-between overflow-y-auto"
    >
      <div className="pt-6">
        <ul className="text-white space-y-4">
          <SidebarItem
            icon={<FaUser />}
            text="Dashboard"
            isActive={selectedItem === "Profile"}
            route="/doctor/dashboard"
            onClick={handleItemClick}
          />
          <SidebarItem
            icon={<FaCalendarAlt />}
            text="Appointments"
            isActive={selectedItem === "Appointments"}
            route="/doctor/appointments"
            onClick={handleItemClick}
          />
          <SidebarItem
            icon={<FaClipboardCheck />}
            text="Apply for Approval"
            isActive={selectedItem === "Apply for Approval"}
            route="/doctor/apply"
            onClick={handleItemClick}
          />
          <SidebarItem
            icon={<FaClock />}
            text="Add slots"
            isActive={selectedItem === "Add slots"}
            route="/doctor/slot"
            onClick={handleItemClick}
          />
          <SidebarItem
            icon={<FaComments />}
            text="Chat"
            isActive={selectedItem === "Chat"}
            route="/doctor/chat"
            onClick={handleItemClick}
          />
          <SidebarItem
            icon={<FaCheckCircle />}
            text="Approval Status"
            isActive={selectedItem === "Approval Status"}
            route="/doctor/approval"
            onClick={handleItemClick}
          />
          <SidebarItem
            icon={<FaMoneyBillWave />}
            text="Wallet"
            isActive={selectedItem === "Payment"}
            route="/doctor/wallet"
            onClick={handleItemClick}
          />
        </ul>
      </div>
      <div className="py-6">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md flex items-center justify-center space-x-2 hover:bg-red-700 transition duration-300"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  isActive: boolean;
  route: string;
  onClick: (text: string, route: string) => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  text,
  isActive,
  route,
  onClick,
}) => {
  return (
    <li
      className={`flex items-center space-x-3 px-6 py-2 cursor-pointer hover:bg-blue-900 transition duration-300 ${
        isActive ? "bg-blue-900" : ""
      }`}
      onClick={() => onClick(text, route)}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-semibold">{text}</span>
    </li>
  );
};

export default SidebarComponent;
