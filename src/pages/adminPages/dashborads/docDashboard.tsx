import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaMale, FaFemale } from "react-icons/fa";
import {
  CalendarIcon,
  HeartPulseIcon,
  Key,
  StethoscopeIcon,
  UserIcon,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axiosInstance from "@/utils/axiosClient";


interface Doctor {
  doctorName: string;
  specialization: string;
  Image?: string; // Optional property
}

const DocDashboard: React.FC<{ doctors: Doctor[] }> = () => {
  const [activeTab, setActiveTab] = useState("doctors");
  const navigate = useNavigate();
  const [maleDoctors, setMaleDoctors] = useState(0);
  const [femaleDoctors, setFemaleDoctors] = useState(0);
  const [otherDoctors, setOtherDoctors] = useState(0);

  //top-rated doctors array state
  const [topRatedDoctors, setTopRatedDoctors] = useState([]);

  //state for available doctors
  const [availableDoctors, setAvailableDoctors] = useState([]);

  // Doctor gender distribution data
  const doctorData = [
    { name: "Male", value: maleDoctors, color: "#3B82F6" },
    { name: "Female", value: femaleDoctors, color: "#EC4899" },
    { name: "Other", value: otherDoctors, color: "#FFA500" }, // Static value for "Other"
  ];

  const COLORS = ["#3B82F6", "#EC4899", "#FFA500"]; // Ensure we have enough colors for all categories

  const handleNavigation = (tabName: string, url: string) => {
    setActiveTab(tabName);
    if (url) {
      navigate(url);
    }
  };

  useEffect(() => {
    const fetchTotalDoctors = async () => {
      const totalDoctors = await axiosInstance.get("/admin/dash-doctor");
      console.log("totalDoctors", totalDoctors);
      setMaleDoctors(
        totalDoctors?.data?.countofDoctors?.maleDoctorsIntheMedTech
      );
      setFemaleDoctors(
        totalDoctors?.data?.countofDoctors?.femaleDoctorsIntheMedTech
      );
      setOtherDoctors(totalDoctors?.data?.countofDoctors?.otherGender);
    };
    fetchTotalDoctors();
  }, []);

  useEffect(() => {
    const topRatedAllDcotors = async () => {
      const doctors = await axiosInstance.get("/admin/top-rated");
      setTopRatedDoctors(doctors?.data?.topRatedDoctors);
      console.log("tope rated", topRatedDoctors);

      console.log("top-rated doctors");
    };

    topRatedAllDcotors();
  }, []);

  //fetch available doctors

  useEffect(() => {
    const fetchAvailableDoctors = async () => {
      const availableAllDoctors = await axiosInstance.get(
        "/admin/available-doctors"
      );
      setAvailableDoctors(availableAllDoctors?.data?.availableDoctors);
      console.log("available doctors", availableDoctors);
    };

    fetchAvailableDoctors();
  }, []);

  // Calculate the total count of doctors for percentage
  const totalDoctorsCount = maleDoctors + femaleDoctors + 5; // Add "Other" category count

  const renderCustomizedLabel = ({ name, value, percent }: any) => {
    return `${name}: ${value} (${Math.round(percent * 100)}%)`; // Show count and percentage
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto">
        <div className="flex space-x-4">
          {[
            {
              name: "overview",
              icon: <CalendarIcon />,
              label: "Overview",
              url: "/admin/dashboard",
            },
            {
              name: "doctors",
              icon: <StethoscopeIcon />,
              label: "Doctors",
              url: "/admin/doctor/dash",
            },
            {
              name: "patients",
              icon: <UserIcon />,
              label: "Patients",
              url: "/admin/patient/dash",
            },
            { name: "health", icon: <HeartPulseIcon />, label: "Health Stats" },
          ].map((tab) => (
            <button
              key={tab.name}
              onClick={() => handleNavigation(tab.name, tab?.url as string)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === tab.name
                  ? "bg-blue-500 text-white shadow-md"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Dashboard Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-20">
          {/* 1. Doctor Gender Distribution Chart */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Doctor Gender Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={doctorData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={renderCustomizedLabel}
                >
                  {doctorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center">
                <FaMale className="mr-2 text-blue-500" />
                <span>Male Doctors: {maleDoctors}</span>
              </div>
              <div className="flex items-center">
                <FaFemale className="mr-2 text-pink-500" />
                <span>Female Doctors: {femaleDoctors}</span>
              </div>
              <div className="flex items-center">
                <span style={{ color: "#FFA500" }}>
                  Other Doctors: {otherDoctors}
                </span>{" "}
                {/* Display static "Other" count */}
              </div>
            </div>
          </div>

          {/* 2. Top Rated Doctors Section */}
          <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
              Top Rated Doctors
            </h2>
            <div className="space-y-4">
              {topRatedDoctors.map((doctor, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 hover:shadow-xl transition-colors"
                >
                  <div className="w-16 h-16 rounded-full  overflow-hidden border-2 border-teal-500">
                    <img
                      src={doctor?.Image || "/api/placeholder/100/100"}
                      alt={`Dr. ${doctor?.doctorName}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 flex items-center">
                      <StethoscopeIcon
                        className="mr-2 text-teal-500"
                        size={20}
                      />
                      Dr. {doctor?.doctorName}
                    </div>
                    <p className="text-sm text-gray-600">
                      {doctor.specialisation}
                    </p>
                    <div className="text-amber-500 text-sm mt-1">
                      {"★".repeat(Math.floor(doctor.rating))}
                      <span className="text-gray-400">
                        {"★".repeat(5 - Math.floor(doctor.rating))}
                      </span>{" "}
                      {doctor.rating.toFixed(1)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Available Doctors Section */}
          <div className="bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">
              Available Doctors
            </h2>
            {availableDoctors.length > 0 ? (
              <div className="space-y-4">
                {availableDoctors.map((doctor, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-4">
                      {/* Doctor's Profile Picture */}
                      <div className="w- h-16 rounded-full overflow-hidden border-2 border-teal-500">
                        <img
                          src={doctor?.Image || "/api/placeholder/100/100"}
                          alt={`Dr. ${doctor?.doctorName}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Doctor's Info */}
                      <div>
                        <div className="font-semibold text-gray-800 text-lg">
                          Dr. {doctor?.doctorName}
                        </div>
                        <p className="text-sm text-gray-600">
                          {doctor?.specialization ||
                            "Specialization not specified"}
                        </p>
                      </div>
                    </div>
                    {/* Availability Tag */}
                    <div className="bg-green-100 text-green-700 text-xs font-semibold uppercase py-1 px-3 rounded-full">
                      Available
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 mt-6">
                No doctors available at the moment.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocDashboard;
