import React, { useEffect, useState } from "react";
import {
  Users,
  Calendar,
  VideoIcon,
  HospitalIcon,
  BarChart2,
  PieChart as PieChartIcon,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import axiosInstance from "@/utils/axiosClient";

import { useSelector } from "react-redux";
import { RootState } from "@/reduxStore/store";
import { toast, ToastContainer } from "react-toastify";

interface TimeData {
  time: {
    year: number;
    month: number;
    day: number;
  };
  totalPatients: number;
  totalAppointments: number;
}

interface AppointmentData {
  patientDetails?: { name: string }[]; // The patient details array is optional.
  timeSlot?: string; // The timeSlot is optional.
}

type Address = {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
};

type Qualification = {
  degree: string;
  institution: string;
  year: number;
  _id: string;
};

type File = {
  title: string;
  file: string;
  _id: string;
};

type Clinic = {
  name: string;
  address: string;
  _id: string;
};

type ConsultationFees = {
  online: number;
  offline: number;
};

type AccountStatus = {
  isActive: boolean;
  verificationStatus: string;
};

type DoctorDetails = {
  personalInfo: {
    address: Address;
    name: string;
    gender: string;
    email: string;
    password: string;
    phone: string;
    dateOfBirth: string;
    profilePicture: string;
  };
  professionalInfo: {
    specialization: string;
    qualifications: Qualification[];
    licenseNumber: string;
    licenseFile: File[];
    certificates: File[];
    languages: string[];
    experience: number;
  };
  practiceInfo: {
    consultationModes: {
      online: boolean;
      offline: boolean;
    };
    clinics: Clinic[];
  };
  financialInfo: {
    consultationFees: ConsultationFees;
  };
  accountStatus: AccountStatus;
  _id: string;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
};

const Dashboard: React.FC = () => {
  const doctorId = useSelector(
    (state: RootState) => state.doctor.doctorInfo?.docId
  );
  console.log("doctorId", doctorId);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [doctorDetails, setDoctorDetails] = useState<DoctorDetails | null>(
    null
  );
  const [totalAppointments, setTotalAppointments] = useState<number>(0);
  const [todayAppointments, setTodayAppointments] = useState<number>(0);
  const [onlineCounsultation, setOnlineConsultation] = useState<number>(0);
  const [offlineConsultation, setOfflineConsultation] = useState<number>(0);
  const [totalPatients, setTotalPatients] = useState<number>(0);
  const [latestAppointments, setLatestAppointments] = useState<
    AppointmentData[]
  >([]);

  const [timeRange, setTimeRange] = useState("daily");
  const [malePatient, setMalePatient] = useState(0);
  const [femalePatient, setFemalePatient] = useState(0);

  const [chartData, setChartData] = useState([]);
  // Sample datasets for different time ranges

  // Helper function to generate the calendar
  const generateCalendar = () => {
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    const daysInMonth = endOfMonth.getDate();
    const startDay = startOfMonth.getDay();

    const calendar = [];
    let week = [];

    for (let i = 0; i < startDay; i++) {
      week.push(null); // Empty slots for days before the start of the month
    }

    for (let day = 1; day <= daysInMonth; day++) {
      week.push(day);
      if (week.length === 7 || day === daysInMonth) {
        calendar.push(week);
        week = [];
      }
    }
    return calendar;
  };

  const changeMonth = (direction: number) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1)
    );
  };

  const calendar = generateCalendar();
  const today = new Date();

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const response = await axiosInstance.get(
          `/doctor/profile?id=${doctorId}`
        );

        console.log("Doctor details:", response.data.doctorProfile);
        setDoctorDetails(response?.data?.doctorProfile);
      } catch (err) {
        console.log(err);
      }
    };

    fetchDoctorProfile();

    // Cleanup function
  }, []);

  useEffect(() => {
    const fetchTotalAppointmentsCount = async () => {
      const appointmentsCount = await axiosInstance.get(
        `/appointment/today/count?id=${doctorId}`
      );
      console.log("uyiuiuappppooo", appointmentsCount);
      if (appointmentsCount?.status == 404) {
        toast.error("Today you have not appointments");
      }
      setTodayAppointments(appointmentsCount?.data?.todayTotalAppointments);
    };
    fetchTotalAppointmentsCount();
  }, []);
  useEffect(() => {
    const appointmentDataForDash = async () => {
      const data = await axiosInstance.get(
        `/appointment/summary?id=${doctorId}`
      );
      console.log("dashboard data", data);
      setTotalAppointments(data?.data?.totalAppointmentsCount);
      setOfflineConsultation(data?.data?.totalOfflineConsultationCount);
      setOnlineConsultation(data?.data?.totalOnlineConsultationCount);
      setTotalPatients(data?.data?.totalPatientsCount);
    };

    appointmentDataForDash();
  }, []);

  useEffect(() => {
    const latestAppointments = async () => {
      try {
        const newAppointments = await axiosInstance.get(
          `/appointment/latest?id=${doctorId}`
        );
        console.log("newAppointments", newAppointments);
        setLatestAppointments(newAppointments?.data?.latestAppointments);
      } catch (error) {
        console.log(error);
      }
    };
    latestAppointments();
  }, []);

  useEffect(() => {
    const fetchPatientsForDash = async () => {
      try {
        const response = await axiosInstance.get(
          `/appointment/patients?id=${doctorId}`
        );
        const categorizedPatients = response?.data?.categorizedPatients || [];

        // Narrowing down the type of item in the array
        const maleData = categorizedPatients.find(
          (item: unknown) =>
            (item as { _id: string; count: number })._id === "Male"
        );
        const femaleData = categorizedPatients.find(
          (item: unknown) =>
            (item as { _id: string; count: number })._id === "Female"
        );

        setMalePatient(maleData?.count || 0);
        setFemalePatient(femaleData?.count || 0);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    if (doctorId) {
      fetchPatientsForDash();
    }
  }, [doctorId]);

  const timeBasedChart = async (time: string = "daily") => {
    try {
      const response = await axiosInstance.get(
        `/appointment/dash-counts?id=${doctorId}&time=${time}`
      );
      const transformedData = response.data?.data.map((item: TimeData) => {
        // Formatting the date based on the time period
        let date;
        if (time === "daily") {
          date = `${item.time.year}-${item.time.month}-${item.time.day}`;
        } else if (time === "monthly") {
          date = `${item.time.year}-${item.time.month}`;
        } else if (time === "yearly") {
          date = `${item.time.year}`;
        }
        return {
          name: date, // Date as x-axis
          patients: item.totalPatients, // Total patient count
          appointments: item.totalAppointments, // Total appointment count
        };
      });

      setChartData(transformedData);
    } catch (error) {
      console.error("Error fetching chart data", error);
    }
  };

  useEffect(() => {
    timeBasedChart();
  }, [doctorId]);

  // const total = consultationData.reduce((acc, item) => acc + item.value, 0);
  // const data =
  //   timeRange === "daily"
  //     ? dailyData
  //     : timeRange === "monthly"
  //     ? monthlyData
  //     : yearlyData;
  return (
    <div className="ml-8">
  <ToastContainer />
  <div className="bg-white border shadow-md rounded-lg overflow-hidden flex flex-col lg:flex-row">
    <div className="w-full h-auto bg-white rounded-lg p-2 md:p-4 lg:px-6 shadow-sm">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 w-full h-auto md:h-64 rounded p-4 md:p-10">
        <div className="flex flex-col md:flex-row justify-between items-center w-full">
          {/* Right Section - Text */}
          <div id="capture" className="text-white flex-grow pr-0 md:pr-6 text-center md:text-left mb-4 md:mb-0">
            <h1 className="font-semibold text-lg leading-tight">Welcome back,</h1>
            <h2 className="text-2xl font-bold mt-2 leading-tight">
              ${doctorDetails?.personalInfo?.name}
            </h2>
            <p className="text-sm mt-1 opacity-90">
              {doctorDetails?.professionalInfo?.qualifications[0]?.degree}
            </p>
            <h3 className="text-lg font-semibold mt-4 leading-tight">
              {todayAppointments > 0 ? (
                <>
                  You have a total of{" "}
                  <span className="text-yellow-300 font-bold">
                    {todayAppointments} appointments
                  </span>{" "}
                  today!
                </>
              ) : (
                <>
                  You have a total of{" "}
                  <span className="text-yellow-300 font-bold">
                    0 appointments
                  </span>{" "}
                  today!
                </>
              )}
            </h3>
          </div>

          {/* Left Section - Doctor Image */}
          <div className="w-32 h-32 md:w-52 md:h-52 bg-gray-200 rounded-lg overflow-hidden shadow-md">
            <img
              src={doctorDetails?.personalInfo?.profilePicture}
              alt="Doctor Jessica Linda"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-white w-full h-auto md:h-56 py-4 md:py-6">
        <div className="bg-white h-auto md:h-44 w-full rounded-sm border border-neutral-400">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 md:p-6">
            {/* Total Patients */}
            <div className="w-full h-32 bg-amber-100 shadow-md rounded-md p-4 flex flex-col justify-between hover:scale-105 transition-transform duration-300">
              <div className="flex justify-between items-center">
                <Users className="text-amber-600" size={24} />
                <h3 className="text-sm font-semibold text-gray-700">Total Patients</h3>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-amber-800">{totalPatients}</span>
              </div>
            </div>

            {/* Total Appointments */}
            <div className="w-full h-32 bg-lime-100 shadow-md rounded-md p-4 flex flex-col justify-between hover:scale-105 transition-transform duration-300">
              <div className="flex justify-between items-center">
                <Calendar className="text-lime-600" size={24} />
                <h3 className="text-sm font-semibold text-gray-700">Total Appointments</h3>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-lime-800">{totalAppointments}</span>
              </div>
            </div>

            {/* Online Consultations */}
            <div className="w-full h-32 bg-orange-100 shadow-md rounded-md p-4 flex flex-col justify-between hover:scale-105 transition-transform duration-300">
              <div className="flex justify-between items-center">
                <VideoIcon className="text-orange-600" size={24} />
                <h3 className="text-sm font-semibold text-gray-700">Online Consultations</h3>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-orange-800">{onlineCounsultation}</span>
              </div>
            </div>

            {/* Offline Consultations */}
            <div className="w-full h-32 bg-emerald-100 shadow-md rounded-md p-4 flex flex-col justify-between hover:scale-105 transition-transform duration-300">
              <div className="flex justify-between items-center">
                <HospitalIcon className="text-emerald-600" size={24} />
                <h3 className="text-sm font-semibold text-gray-700">Offline Consultations</h3>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-emerald-800">{offlineConsultation}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="bg-white w-full h-auto md:h-96 border border-gray-400 p-2 md:p-4 lg:py-6 flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 rounded">
        {/* Left Analytics Panel */}
        <div className="w-full lg:w-4/6 bg-white h-auto rounded-lg p-4 lg:p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
            {/* Title Section */}
            <div className="flex items-center space-x-2">
              <BarChart2 className="text-blue-600" size={24} />
              <h2 className="text-lg font-semibold text-gray-800">Patient Analytics</h2>
            </div>

            {/* Time Range Selection */}
            <div className="flex items-center space-x-2 text-gray-600 w-full sm:w-auto">
              <button
                className={`text-sm px-2 md:px-3 py-1 rounded ${
                  timeRange === "daily"
                    ? "bg-blue-100 text-blue-600 font-semibold"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => {
                  setTimeRange("daily");
                  timeBasedChart("daily");
                }}
              >
                Daily
              </button>
              <button
                className={`text-sm px-2 md:px-3 py-1 rounded ${
                  timeRange === "monthly"
                    ? "bg-blue-100 text-blue-600 font-semibold"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => {
                  setTimeRange("monthly");
                  timeBasedChart("monthly");
                }}
              >
                Monthly
              </button>
              <button
                className={`text-sm px-2 md:px-3 py-1 rounded ${
                  timeRange === "yearly"
                    ? "bg-blue-100 text-blue-600 font-semibold"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => {
                  setTimeRange("yearly");
                  timeBasedChart("yearly");
                }}
              >
                Yearly
              </button>
            </div>
          </div>
          <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
              >
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="name" stroke="#8884d8" />
                <YAxis stroke="#8884d8" />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "patients") {
                      return [`${value} Patients`, name];
                    } else if (name === "appointments") {
                      return [`${value} Appointments`, name];
                    }
                    return value;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="patients"
                  stroke="#8884d8"
                  strokeWidth={2}
                  name="Patients"
                />
                <Line
                  type="monotone"
                  dataKey="appointments"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  name="Appointments"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Analytics Panel */}
        <div className="w-full lg:w-2/6 bg-white h-auto rounded-lg px-4 py-3 shadow-lg">
          <div className="bg-white rounded-lg p-6 w-full h-auto flex flex-col justify-between">
            {/* Header Section */}
            <div className="flex items-center justify-between">
              <PieChartIcon className="text-green-600" size={24} />
              <h3 className="text-gray-700 font-semibold">Gender</h3>
            </div>

            {/* Pie Chart Section */}
            <div className="flex items-center justify-center relative mt-4">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Tooltip
                    formatter={(value, name) => [`${value}`, name]}
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #cccccc",
                      borderRadius: "5px",
                      padding: "10px",
                    }}
                  />
                  <Pie
                    data={[
                      { name: "Men", value: malePatient },
                      { name: "Women", value: femalePatient },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                    startAngle={90}
                    endAngle={450}
                  >
                    {[{ color: "#8884d8" }, { color: "#82ca9d" }].map(
                      (entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      )
                    )}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Center Text */}
              <div className="absolute text-center">
                <h2 className="text-lg font-bold">{malePatient + femalePatient}</h2>
                <p className="text-sm text-gray-500">Total</p>
              </div>
            </div>

            {/* Legend Section */}
            <div className="mt-4 flex justify-evenly items-center text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-600"></span>
                <span>Men ({malePatient})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span>Women ({femalePatient})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Calendar and Appointments Section */}
    <div className="bg-white w-full lg:w-3/4 h-auto px-2 md:px-4 py-4 space-y-6 md:space-y-10">
      <div className="bg-white h-auto md:h-96 w-full md:w-80 rounded-sm shadow-md p-4">
        <div className="flex justify-between items-center mb-4">
          <button className="text-gray-600" onClick={() => changeMonth(-1)}>
            &lt;
          </button>
          <h2 className="text-gray-800 font-semibold">
            {currentDate.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <button className="text-gray-600" onClick={() => changeMonth(1)}>
            &gt;
          </button>
        </div>
        <div className="grid grid-cols-7 text-center text-gray-700">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
            <div key={index} className="font-medium">
              {day}
            </div>
          ))}
          {calendar.map((week, index) => (
            <React.Fragment key={index}>
              {week.map((day, index) => (
                <div
                  key={index}
                  className={`h-8 md:h-10 w-8 md:w-10 flex items-center justify-center ${
                    day &&
                    today.getFullYear() === currentDate.getFullYear() &&
                    today.getMonth() === currentDate.getMonth() &&
                    day === today.getDate()
                      ? "bg-green-500 text-white rounded-full"
                      : ""
                  }`}
                >
                  {day || ""}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div id="appointment" className="bg-white h-auto w-full rounded-sm shadow-md p-4">
        <div className="mb-4">
          <h1 className="text-lg font-semibold text-gray-700">Your Appointments</h1>
        </div>
        <div className="space-y-4">
          {latestAppointments.map((val, ind) => (
            <div
              key={ind}
              className="flex items-center bg-blue-100 rounded-lg p-4 shadow-sm"
            >
              <img
                src="/pictures/patientimg.png"
                alt="Patient"
                className="w-12 h-12 rounded-full object-cover mr-4"
              />
              <div className="flex-grow">
                <h3 className="text-gray-700 font-medium">
                  {val.patientDetails && val.patientDetails[0]?.name
                    ? val.patientDetails[0]?.name
                    : "Unknown Patient"}
                </h3>
                <p className="text-sm text-gray-500">
                  {val?.timeSlot ||"No time slot available"}
                </p>
              </div>
              <div>
                <button className="text-gray-500 hover:text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Appointments */}
        <div className="mt-6 text-center">
          <a
            href="#"
            className="text-indigo-600 font-medium text-sm hover:underline flex items-center justify-center"
          >
            View All Appointments{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-4 h-4 ml-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</div>
  );
};

export default Dashboard;
