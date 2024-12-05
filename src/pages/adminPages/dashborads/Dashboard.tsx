import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import AppointmentsAreaChart from "../dashborads/appointmentDashboard";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  UserIcon,
  HeartPulseIcon,
  StethoscopeIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axiosClient";
// import axios from "axios";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const [selectedPeriod, setSelectedPeriod] = useState("yearly"); // default to yearly
  const [filterOptions, setFilterOptions] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [revenueData, setRevenueData] = useState([]);
  const [data,setData]=useState([])
  const[totalDoctors,setTotalDoctors]=useState('')
  const[totalAppointments,setTotalAppointments]=useState('')
  const[totalPatients,setTotalPatients]=useState('')



  const [appointments, setAppointments] = useState([]);
  useEffect(() => {
    const dashboardData = async () => {
      const dashboardStats = await axiosInstance.get("/admin//dash-stats");
      console.log("dash dataas", dashboardStats);
    };
    dashboardData();
  });

  const consultationData = [
    { name: "Online Consultations", value: 65 },
    { name: "Offline Consultations", value: 35 },
    { name: "Chat Consultations", value: 15 },
  ];

  const COLORS = [
    "rgba(59, 130, 246, 0.8)", // Blue for Online
    "rgba(16, 185, 129, 0.8)", // Green for Offline
    "rgba(16, 185, 149, 0.8)", // Additional color
  ];

  // const data = [
  //   { name: "Group A", value: 400 },
  //   { name: "Group B", value: 300 },
  //   { name: "Group C", value: 300 },
  //   { name: "Group D", value: 200 },
  // ];
  const COLORS1 = ["#10B981", "#3B82F6", "#FFCA35", "#EC4899"];
  // const appointments = [
  //   { name: "John Doe", time: "10:00 AM" },
  //   { name: "Jane Smith", time: "11:30 AM" },
  //   { name: "Dr. Strange", time: "2:00 PM" },
  // ];

  const hadleClick = (tab: string, url: string) => {
    setActiveTab(tab);

    navigate(url);
  };


useEffect(()=>{
  const dashboardStats=async()=>{

    const data=await axiosInstance.get('/admin/dash-stats')
    setTotalDoctors(data.data.dashboardStats?.doctorsCount)
    setTotalPatients(data.data.dashboardStats?.patientCount)
    setTotalAppointments(data.data.dashboardStats?.appointmentCount)
   
    console.log('data',data)


  } 
  dashboardStats()
},[])


  useEffect(() => {
    const getAppointmentPercentageBySpecialization = async () => {
      try {
        const response = await axiosInstance.get("/admin/dash-specialization");

        const appointments = await axiosInstance.get(
          "/admin/dash-appointments"
        );
        console.log("appointments", appointments);
        const fetchedData = response.data?.specailizationPerfcentage || [];
        const appoinmentData = appointments.data?.appointments;
        setAppointments(appoinmentData);

        // Transform the fetched data into the required format for the chart
        const chartData = fetchedData.map((item) => ({
          name: item.specialization, // Name of the specialization
          value: item.percentage, // Percentage value
        }));

        setData(chartData); // Set the transformed data into the `data` array
      } catch (error) {
        console.error("Error fetching specialization data:", error.message);
      }
    };

    getAppointmentPercentageBySpecialization();
  }, []);

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);

    if (period === "yearly") {
      const years = Array.from(
        { length: 5 },
        (_, i) => new Date().getFullYear() - i
      );
      console.log("yearss", years);
      setFilterOptions(years);
      setSelectedFilter(years[0]);
    } else if (period === "monthly") {
      const months = Array.from({ length: 12 }, (_, i) =>
        new Date(0, i).toLocaleString("default", { month: "short" })
      );
      setFilterOptions(months);
      setSelectedFilter(months[new Date().getMonth()]);
    } else if (period === "daily") {
      const daysInMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0
      ).getDate();
      const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
      setFilterOptions(days);
      setSelectedFilter(days[0]);
    }
  };

  const formatChartData = () => {
    if (selectedPeriod === "yearly") {
      return Array.from({ length: 5 }, (_, i) => ({
        name: `${new Date().getFullYear() - i}`,
        onlineRevenue: Math.floor(Math.random() * 10000),
        offlineRevenue: Math.floor(Math.random() * 10000),
      })).reverse();
    } else if (selectedPeriod === "monthly") {
      const months = Array.from({ length: 12 }, (_, i) =>
        new Date(0, i).toLocaleString("default", { month: "short" })
      );
      return months.map((month) => ({
        name: month,

        onlineRevenue: Math.floor(Math.random() * 1000),
        offlineRevenue: Math.floor(Math.random() * 1000),
      }));
    } else if (selectedPeriod === "daily") {
      const daysInMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0
      ).getDate();
      return Array.from({ length: daysInMonth }, (_, i) => ({
        name: `${i + 1}`,
        onlineRevenue: Math.floor(Math.random() * 100),
        offlineRevenue: Math.floor(Math.random() * 100),
      }));
    }
  };

  useEffect(() => {
    setRevenueData(formatChartData());
  }, [selectedPeriod, selectedFilter]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-xl">
          <p className="font-bold text-gray-700 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p
              key={`item-${index}`}
              className="text-sm"
              style={{ color: entry.color }}
            >
              {entry.name}: ${entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-auto bg-gradient-to-br from-slate-50 to-slate-100 border border-white shadow-2xl rounded-2xl overflow-hidden p-4">
      <div className="flex space-x-4 mb-6">
        <select
          className="p-2 border rounded-lg"
          value={selectedPeriod}
          onChange={(e) => handlePeriodChange(e.target.value)}
        >
          <option value="yearly">Yearly</option>
          <option value="monthly">Monthly</option>
          <option value="daily">Daily</option>
        </select>
        {/* <select
          className="p-2 border rounded-lg"
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
        >
          {filterOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select> */}
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-between items-center mb-6">
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
              url: "/admin/patinet/dash",
            },
            { name: "health", icon: <HeartPulseIcon />, label: "Health Stats" },
          ].map((tab) => (
            <button
              key={tab.name}
              onClick={() => hadleClick(tab.name, tab.url as string)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg transition-all
                ${
                  activeTab === tab.name
                    ? "bg-blue-500 text-white shadow-md"
                    : "hover:bg-gray-100 text-gray-600"
                }
              `}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
        <Button variant="outline">Export Report</Button>
      </div>

      {/* Count Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { title: "Total Doctors", value: totalDoctors, color: "bg-blue-50" },
          { title: "Total Patients", value: totalPatients, color: "bg-green-50" },
          { title: "Total Appointments", value: totalAppointments, color: "bg-purple-50" },
          { title: "Total Revenue", value: 342, color: "bg-orange-50" },
        ].map((card, index) => (
          <div
            key={index}
            className={`${card.color} p-4 rounded-xl border border-gray-100 hover:shadow-lg transition-all`}
          >
            <h3 className="text-sm text-gray-600 mb-2">{card.title}</h3>
            <p className="text-2xl font-bold text-gray-800">{card.value}</p>
          </div>
        ))}
      </div>

      {/* First Row: Revenue Area Chart & Consultation Pie Chart */}
      <div className="flex space-x-4 mb-4">
        {/* Total Revenue Area Chart */}
        <div className="w-2/3 bg-white rounded-2xl border border-gray-200 shadow-xl p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Total Revenue
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={revenueData}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
              {/* Gradient Definitions */}
              <defs>
                <linearGradient
                  id="colorOnlineRevenue"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient
                  id="colorOfflineRevenue"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>

              {/* X and Y Axes */}
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#888" }} />
              <YAxis
                tick={{ fontSize: 12, fill: "#888" }}
                tickFormatter={(value) => `INR ${value / 1000}k`}
              />

              {/* Grid, Tooltip, and Legend */}
              <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />

              {/* Area Chart */}
              <Area
                type="monotone"
                dataKey="onlineRevenue"
                stroke="#3B82F6"
                fillOpacity={1}
                fill="url(#colorOnlineRevenue)" // Refers to the gradient ID
              />
              <Area
                type="monotone"
                dataKey="offlineRevenue"
                stroke="#10B981"
                fillOpacity={1}
                fill="url(#colorOfflineRevenue)" // Refers to the gradient ID
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Consultations Pie Chart */}
        <div className="w-1/3 bg-white rounded-2xl border border-gray-200 shadow-xl p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Consultation Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={consultationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {consultationData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value}%`, name]}
                contentStyle={{ borderRadius: "8px", padding: "8px" }}
              />
              <Legend
                layout="vertical"
                verticalAlign="middle"
                align="right"
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Appointments and Additional Sections */}
      <div className="flex space-x-4">
        <AppointmentsAreaChart selectedPeriod={selectedPeriod} />

        <div className="bg-white h-96 w-5/12 shadow-xl rounded-2xl relative p-4">
          {/* Pie Chart */}
          <div className="absolute top-4 left-4">
            <ResponsiveContainer width={150} height={150}>
              <PieChart>
                <Pie
                  data={data} // Use the `data` array directly
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS1[index % COLORS1.length]} // Dynamically assign colors
                    />
                  ))}
                </Pie>
                {/* Tooltip to show specialization and percentage */}
                <Tooltip formatter={(value, name) => [`${value}%`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Appointment List */}
          <div className="mt-20 ml-40">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Appointment List
            </h3>
            <ul className="space-y-3">
              {appointments.map((appointment, index) => (
                <li
                  key={index}
                  className="p-4 bg-white rounded-lg shadow-md flex items-center space-x-4"
                >
                  {/* User Image */}
                  <img
                    src={appointment.image || "/default-avatar.png"} // Replace with a default image if userImage is unavailable
                    alt={appointment.userName}
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  {/* Appointment Details */}
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800 text-lg">
                      {appointment?.userName}
                    </span>
                    <span className="text-sm text-gray-500">
                      Date: {appointment.appointmentDate}
                    </span>
                    <span className="text-sm text-gray-500">
                      Time: {appointment.timeSlot}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
