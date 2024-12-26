import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  
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
  
  StethoscopeIcon,
  BanknoteIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axiosClient";
// import axios from "axios";



type Appointment = {
  status: string;
  image: string;
  userName: string;
  appointmentDate: string;
  timeSlot: string;
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const [selectedPeriod, setSelectedPeriod] = useState<"yearly" | "monthly" | "daily">("yearly"); // default to yearly
  const [, setFilterOptions] = useState<string[] | number[]>([]);

  const [, setSelectedFilter] = useState<string|number>("");
  const [revenueData, setRevenueData] = useState([]);
  const [data, setData] = useState([]);
  const [totalDoctors, setTotalDoctors] = useState("");
  const [totalAppointments, setTotalAppointments] = useState("");
  const [totalPatients, setTotalPatients] = useState("");

  const[totalRevenue,setTotalRevenue]=useState(0)
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [timeRange, setTimeRange] = useState("yearly");
  useEffect(() => {
    const dashboardData = async () => {
      const dashboardStats = await axiosInstance.get("/admin//dash-stats");
      console.log("dash dataas", dashboardStats);
    };
    dashboardData();
  });

 


  const COLORS1 = ["#10B981", "#3B82F6", "#FFCA35", "#EC4899"];
  

  const hadleClick = (tab: string, url: string) => {
    setActiveTab(tab);

    navigate(url);
  };

  useEffect(() => {
    const dashboardStats = async () => {
      const data = await axiosInstance.get("/admin/dash-stats");
      setTotalDoctors(data.data.dashboardStats?.doctorsCount);
      setTotalPatients(data.data.dashboardStats?.patientCount);
      setTotalAppointments(data.data.dashboardStats?.appointmentCount);
      
      console.log("data", data);
    };
    dashboardStats();
  }, []);


  useEffect(()=>{
    const fetchTotalRevenue=async()=>{ 
      const data=await axiosInstance.get('/admin/amounts');
    console.log("fetchTotalRevenue",data) 
    setTotalRevenue(data?.data?.amounts?.totalRevenue)
  }
  fetchTotalRevenue();

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
        const chartData = fetchedData.map((item:typeof fetchedData[number]) => ({
          name: item.specialization, // Name of the specialization
          value: item.percentage, // Percentage value
        }));

        setData(chartData); // Set the transformed data into the `data` array
      } catch (error) {
        console.error("Error fetching specialization data:", error);
      }
    };

    getAppointmentPercentageBySpecialization();
  }, []);

  const handlePeriodChange = (period: 'yearly' | 'monthly' | 'daily') => {
    setSelectedPeriod(period);
    setTimeRange(period);
  
    if (period === "yearly") {
      const years = Array.from(
        { length: 5 },
        (_, i) => new Date().getFullYear() - i
      );
      console.log("yearss", years);
      setFilterOptions(years);
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
  console.log(formatChartData)

  useEffect(() => {
    const fetchTotalRevenue = async () => {
      try {
        const response = await axiosInstance.get(
          `/admin/revenue?time=${timeRange}`
        );
        const formattedData = response.data.graphData.map((item: typeof response.data.graphData[0]) => ({
          name: item.date, // Label for X-axis
          totalRevenue: item.totalRevenue, // Data for Y-axis
        }));
        setRevenueData(formattedData);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    };
    fetchTotalRevenue();
  }, [timeRange]);

  // const CustomTooltip = ({ active, payload, label }: any) => {
  //   if (active && payload && payload.length) {
  //     return (
  //       <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-xl">
  //         <p className="font-bold text-gray-700 mb-2">{label}</p>
  //         {payload.map((entry: any, index: number) => (
  //           <p
  //             key={`item-${index}`}
  //             className="text-sm"
  //             style={{ color: entry.color }}
  //           >
  //             {entry.name}: ${entry.value.toLocaleString()}
  //           </p>
  //         ))}
  //       </div>
  //     );
  //   }
  //   return null;
  // };

  return (
    <div className="w-full h-auto bg-gradient-to-br from-slate-50 to-slate-100 border border-white shadow-2xl rounded-2xl overflow-hidden p-4">
      <div className="flex space-x-4 mb-6">
        <select
          className="p-2 border rounded-lg"
          value={selectedPeriod}
          onChange={(e) => handlePeriodChange(e.target.value as 'yearly' | 'monthly' | 'daily')}
        >
          <option value="yearly">Yearly</option>
          <option value="monthly">Monthly</option>
          <option value="daily">Daily</option>
        </select>
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
              url: "/admin/patient/dash",
            },
            {
              name: "health",
              icon: <BanknoteIcon />,
              label: "Amount Setting",
              url: "/admin/amount",
            },
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
          {
            title: "Total Patients",
            value: totalPatients,
            color: "bg-green-50",
          },
          {
            title: "Total Appointments",
            value: totalAppointments,
            color: "bg-purple-50",
          },
          { title: "Total Revenue", value: totalRevenue, color: "bg-orange-50" },
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
        <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-xl p-4">
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
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>

              {/* Axes */}
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#888" }} />
              <YAxis
                tick={{ fontSize: 12, fill: "#888" }}
                tickFormatter={(value) => `INR ${value / 1000}k`}
              />

              {/* Grid and Tooltip */}
              <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
              <Tooltip />

              {/* Single Line for Total Revenue */}
              <Area
                type="monotone"
                dataKey="totalRevenue"
                stroke="#3B82F6"
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Consultations Pie Chart */}
        {/* <div className="w-1/3 bg-white rounded-2xl border border-gray-200 shadow-xl p-4">
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
        </div> */}
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
                  {data.map((_entry, index) => (
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
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              Appointment List
            </h3>
            <ul className="space-y-4">
              {appointments.map((appointment, index) => (
                <li
                  key={index}
                  className="p-3 bg-white rounded-lg shadow-md flex items-center justify-between space-x-4 hover:shadow-lg transition-shadow duration-300"
                >
                  {/* User Image */}
                  <img
                    src={appointment.image || "/default-avatar.png"}
                    alt={appointment.userName}
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  {/* Appointment Details */}
                  <div className="flex flex-col text-sm text-gray-700 space-y-1">
                    <span className="font-medium text-gray-800">
                      {appointment.userName}
                    </span>
                    <span>
                      <strong>Date:</strong> {appointment.appointmentDate}
                    </span>
                    <span>
                      <strong>Time:</strong> {appointment.timeSlot}
                    </span>
                  </div>

                  {/* Appointment Status */}
                  <div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {appointment.status}
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
