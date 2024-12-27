import React, { useState } from "react";
import { RxDashboard } from "react-icons/rx";
import { FaUsers, FaUserMd, FaCalendarAlt, FaBed, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "@/utils/axiosClient";
// import useFetchData from "../../hooks/useFetchData";

// import AdminHeader from "../../components/adminSide/adminHeader";

// interface AdminHeaderProps {
//   onSearch: (value: string) => void;
//   current?: string;
// }

const Sider: React.FC = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [, setSelectedState] = useState(" "); // Default to "users" or any valid option
  
  // Fetch data using the selectedState
  // const { data, loading, error } = useFetchData(selectedState, "");


  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post("/admin/logout", {}, { withCredentials: true });

      if (response.status === 200) {
        toast.success("Logout successful");
        navigate("/admin/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to log out");
    }
  };

  const handleNavigation = (path: string, state: string, label: string) => {
    setActiveItem(label);
    setSelectedState(state);  // Update selected state for useFetchData
    navigate(path);
  };

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col h-full w-72 bg-slate-50 min-w-[288px] shadow-lg">
        <div className="p-4 bg-white flex items-center shadow-md border-b">
          <img
            src="/pictures/med-tech_logo.png"
            alt="Med-Tech Logo"
            className="h-12 w-12 object-contain mr-2"
          />
          <h1 className="text-2xl font-bold text-teal-500">Med-Tech</h1>
        </div>

        <div className="flex-1 overflow-y-auto mt-2 bg-white shadow-md border">
          <div className="p-4 mt-8">
            <MenuItem
              icon={<RxDashboard size={24} />}
              text="Dashboard"
              active={activeItem === "Dashboard"}
              onClick={() => handleNavigation("/admin/dashboard", "dashboard", "Dashboard")}
            />
            <MenuItem
              icon={<FaUsers size={24} />}
              text="Users"
              active={activeItem === "Users"}
              onClick={() => handleNavigation("/admin/users", "users", "Users")}
            />
            <MenuItem
              icon={<FaUserMd size={24} />}
              text="Doctors"
              active={activeItem === "Doctors"}
              onClick={() => handleNavigation("/admin/doctors", "doctors", "Doctors")}
            />
            <MenuItem
              icon={<FaCalendarAlt size={24} />}
              text="Appointments"
              active={activeItem === "Appointments"}
              onClick={() => handleNavigation("/admin/appointment", "appointments", "Appointments")}
            />
            <MenuItem
              icon={<FaBed size={24} />}
              text="Patients"
              active={activeItem === "Patients"}
              onClick={() => handleNavigation("/admin/patients", "patients", "Patients")}
            />
          </div>
        </div>

        <div className="p-4 bg-white shadow-sm border-t">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full bg-red-500 text-white py-2 px-4 rounded"
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </div>
      </div>
      
      {/* {loading && <p>Loading data...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {data && <p>Data fetched successfully</p>} */}
    </>
  );
};

const MenuItem: React.FC<{
  icon: React.ReactNode;
  text: string;
  active: boolean;
  onClick: () => void;
}> = ({ icon, text, active, onClick }) => (
  <div
    className={`flex items-center p-2 rounded cursor-pointer font-bold text-md ${
      active ? "bg-cyan-400 text-white" : "hover:bg-teal-100"
    }`}
    onClick={onClick}
  >
    <div className={`mr-3 ${active ? "text-white" : "text-black"}`}>
      {icon}
    </div>
    <span>{text}</span>
  </div>
);

export default Sider;
