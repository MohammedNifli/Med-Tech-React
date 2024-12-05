import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  CalendarIcon,
  HeartPulseIcon,
  StethoscopeIcon,
  UserIcon,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axiosInstance from "@/utils/axiosClient";

const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("patients");
  const [interval, setInterval] = useState("yearly"); // Default interval
  const [chartData, setChartData] = useState([]); // Data for chart
  const [loading, setLoading] = useState(false); // Loading state
  const [newPatient, setNewPatient] = useState<any[]>([]); // New patients data

  // Fetch data from the backend based on selected interval
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/admin/dash-patients?period=${interval}`);
  
        // Process the response data to match the chart data format
        const formattedData = response.data.data.map((item: any) => {
          let name = '';
          
          // Conditionally format the name based on the interval
          if (interval === 'yearly') {
            name = `${item._id}`;
          } else if (interval === 'monthly') {
            name = `${item._id.month}-${item._id.year}`;
          } else if (interval === 'daily') {
            name = `${item.day}-${item.month}-${item.year}`;
          }
  
          // Format the chart data
          return {
            name: name,
            male: item.male,
            female: item.female,
            other: item.other,
          };
        });
  
        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [interval]);

  useEffect(() => {
    const fetchNewPatients = async () => {
      const patientsData = await axiosInstance.get("/admin/new-patients");
      console.log("Patient Data", patientsData);
      setNewPatient(patientsData.data?.newPatients);
    };
    fetchNewPatients();
  }, []);
  
  const handleSelect = (tab: string, url: string) => {
    setActiveTab(tab);
    navigate(url);
  };

  const handleIntervalChange = (newInterval: string) => {
    setInterval(newInterval);
  };

  return (
    <div className="w-full h-auto bg-gradient-to-br from-slate-50 to-slate-100 border border-white shadow-2xl rounded-2xl overflow-hidden p-4">
      <div className="container mx-auto">
        {/* Tabs Section */}
        <div className="flex space-x-4">
          {[
            { name: "overview", icon: <CalendarIcon />, label: "Overview", url: "/admin/dashboard" },
            { name: "doctors", icon: <StethoscopeIcon />, label: "Doctors", url: "/admin/doctor/dash" },
            { name: "patients", icon: <UserIcon />, label: "Patients", url: "/admin/patient/dash" },
            { name: "health", icon: <HeartPulseIcon />, label: "Health Stats" },
          ].map((tab) => (
            <button
              key={tab.name}
              onClick={() => handleSelect(tab.name, tab?.url as string)}
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

        {/* Interval Selector */}
        <div className="flex justify-end mt-4">
          <select
            value={interval}
            onChange={(e) => handleIntervalChange(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        {/* Main Content Section */}
        <div className="flex space-x-4 mt-10">
          {/* Chart Section */}
          <div className="bg-white w-8/12 h-96 p-4 rounded-lg shadow-md">
            {loading ? (
              <p>Loading chart data...</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMale" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorFemale" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorOthers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f4a261" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#f4a261" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area type="monotone" dataKey="male" stroke="#8884d8" fillOpacity={1} fill="url(#colorMale)" />
                  <Area type="monotone" dataKey="female" stroke="#82ca9d" fillOpacity={1} fill="url(#colorFemale)" />
                  <Area type="monotone" dataKey="other" stroke="#f4a261" fillOpacity={1} fill="url(#colorOthers)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* New Patients Section */}
          <div className="bg-white w-4/12 h-96 p-4 rounded-lg shadow-md overflow-y-auto">
            <h2 className="text-xl font-semibold">New Patients</h2>
            <div className="mt-4 space-y-4">
              {newPatient.length === 0 ? (
                <p>No new patients available.</p>
              ) : (
                newPatient.map((patient, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <UserIcon className="text-gray-500 w-8 h-8" />
                    <div>
                      <p className="font-semibold">{patient.name}</p>
                      <p className="text-gray-600">{patient.gender}</p>
                      <p className="text-gray-600">{patient.age} years old</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
