import React, { useState, useMemo, useEffect } from "react";
import {
  Star,
  MapPin,
  MessageSquare,
  Calendar,
  Clock,
  Award,
  ThumbsUp,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import {
  format,
  addDays,
  isSameDay,
  startOfToday,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  addMonths,
  subMonths,
} from "date-fns";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../reduxStore/store";
import axios from "axios";
import AxiosInstance from "../../utils/axiosClient";
import { profileEnd } from "console";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosClient";

const BookingPage: React.FC = () => {
  const { id: docId } = useParams();
  const doctorId=useSelector((state:RootState)=>state.doctor.doctorInfo?.docId)
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user?._id);
  console.log("user id", user);
  console.log("doctor id in booking page", docId);
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  // const [selectedSlot, setSelectedSlot] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(startOfToday());

  //added states
  // const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedDate1, setSelectedDate1] = useState(new Date());
  const [visitType, setVisitType] = useState<string>("offline");
  const [docProfile, setDocProfile] = useState(null);

  const [personalInfo, setPersonalInfo] = useState({});
  const [financialInfo, setFinancialInfo] = useState({});
  const [professionalInfo, setProfessionalInfo] = useState({});
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [morningSlots, setMorningSlots] = useState<string[]>([]);
  const [afternoonSlots, setAfternoonSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [clinicDetails, setClinicDetails] = useState({});
  const [consultationMode,setConsultationMode]=useState('')

  //add remove



  //useeffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Optional delay (can be removed if unnecessary)
      

        console.log("Fetching profile for doctor ID:", docId);

        // Perform the API call
        const response = await axios.get(
          `http://localhost:4444/user/doctor-profile?id=${docId}`,
          { withCredentials: true }
        );

        // Check for success status
        if (response.status === 200) {
          const profile = response.data.fetchedProfile;
          console.log(
            "API Response - Professional Info:",
            profile.professionalInfo
          );

          // Update states
          setProfessionalInfo(profile.professionalInfo);
          setFinancialInfo(profile.financialInfo);
          setPersonalInfo(profile.personalInfo);
          setDocProfile(profile);
          setClinicDetails(profile.practiceInfo.clinics[0]);

          // Log after the state has updated in the next render
          console.log("State updated successfully!", personalInfo);
        }
      } catch (error) {
        console.error("Error fetching doctor profile:", error);
      }
    };

    fetchData();
  }, [docId]); // Re-run when docId changes

  // Log `professionalInfo` after it updates
  useEffect(() => {
    console.log("Updated professionalInfo state:", personalInfo);
  }, [professionalInfo]);

  //

  const fetchTimeSlot = async (date: Date) => {
    if (!date || !docId) return;
  
    console.log("Selected Consultation Mode:", consultationMode);
  
    try {
      const formattedDate = date.toLocaleDateString("en-CA");
      console.log("Formatted Date:", formattedDate);
  
      let response;
  
      // Fetch slots based on consultation mode
      if (consultationMode === "online") {
        response = await AxiosInstance.get(
          `/user/online-slots?id=${docId}&date=${formattedDate}`
        );
      } else if (consultationMode === "offline") {
        response = await AxiosInstance.get(
          `/user/offline-slots?id=${docId}&date=${formattedDate}`
        );
      }
  
      if (!response || !response.data.slots) {
        throw new Error("No slots available");
      }
  
      console.log("Fetched Time Slots:", response.data.slots);
  
      // Categorize slots into morning and afternoon
      const morning: string[] = [];
      const afternoon: string[] = [];
  
      response.data.slots.forEach((slot: { startTime: string; status: string }) => {
        const [hour] = slot.startTime.split(":").map(Number); // Split and convert to number
  
        if (slot.status === "available") {
          if (slot.startTime) {
            morning.push(slot.startTime); // Afternoon slots (12 PM onwards)
          } else {
            morning.push(slot.startTime); // Morning slots (before 12 PM)
          }
        }
        console.log('mornnig slots',morning)
        console.log('afternoon slots',afternoon)
      });
  
      // Update the states
      setTimeSlots(response.data.slots || []);
      setMorningSlots(morning);
      setAfternoonSlots(afternoon);
  
      console.log("Morning Slots:", morning);
      console.log("Afternoon Slots:", afternoon);
    } catch (error) {
      console.error("Error fetching time slots:", error);
  
      // Reset the states in case of error
      setTimeSlots([]);
      setMorningSlots([]);
      setAfternoonSlots([]);
    }
  };
  
  

  useEffect(() => {
    console.log("ssssssssssssss", selectedDate);
    const data = fetchTimeSlot(selectedDate);

    console.log("fetchTimeslot", data);
  }, [docId, selectedDate]);

  // Calendar Functions
  const daysInMonth = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Generate next 7 days from selected date
  const dateOptions = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(selectedDate, i);
      return {
        date,
        dayName: format(date, "EEE"),
        dayNumber: format(date, "d"),
        fullDate: format(date, "MMMM d, yyyy"),
      };
    });
  }, [selectedDate]);

  // const morningSlots = [
  //   "8:00 AM",
  //   "8:30 AM",
  //   "9:00 AM",
  //   "9:30 AM",
  //   "10:00 AM",
  //   "10:30 AM",
  //   "11:00 AM",
  //   "11:30 AM",
  // ];

  // const afternoonSlots = [
  //   "12:00 PM",
  //   "12:30 PM",
  //   "1:00 PM",
  //   "1:30 PM",
  //   "2:00 PM",
  //   "2:30 PM",
  //   "3:00 PM",
  //   "3:30 PM",
  //   "4:00 PM",
  //   "4:30 PM",
  // ];



  // Doctor Info object remains the same
  const doctorInfo = {
    name: "Dr. Mohammed Nifli",
    credentials: ["MBBS", "MD", "Cardiologist"],
    experience: "15+ years",
    rating: 4.8,
    totalReviews: 528,
    location: "Medicare Hospital, New York",
    availability: {
      offline: "Mon - Fri, 9:00 AM - 1:00 PM",
      online: "Mon - Sat, 2:00 PM - 6:00 PM",
    },
    consultationFee: {
      offline: "$100",
      online: "$80",
    },
    specializations: ["Cardiology", "Internal Medicine", "Critical Care"],
  };

  const handleClick = async () => {
    try {
      console.log("date", selectedDate);
      console.log("slected", selectedSlot);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = async () => {
    let money = 0;
    console.log("slooooooooot",selectedSlot)
    if (consultationMode === "online") {
      money = financialInfo?.consultationFees?.online;
    } else {
      money = financialInfo?.consultationFees?.offline;
    }
    console.log("money", money);

    const appointmentData = {
      userId: user,
      doctorId: docId,
      patientId: "",
      appointmentDate: selectedDate,
      timeSlot: selectedSlot,
      consultationMode: visitType,
      amount: money,
    };

    try {
      const response = await axios.post(
        "http://localhost:4444/appointment/add",
        { appointmentData },
        { withCredentials: true }
      );
      console.log("response from booking appointment", response);

      console.log("Booking time slot:", selectedTime);

      if (response.status === 201) {
        // Assuming a successful booking
    
   const appointmentDate=response.data.appointment?.appointmentDate;
   const time=response.data.appointment.timeSlot;
      console.log("date of the appointment",appointmentDate,time)
      const respo=await axiosInstance.post(`/user/slot-status`,{docId,appointmentDate,time})
      console.log('respo',respo)
        toast.success("Appointment booked successfully!");
        
        navigate("/patient", { state: { Id: response.data.appointment._id } });
      }
    } catch (error) {
      // Checking if the error is an AxiosError and the status code is 409
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          toast.error("Time slot is already booked");
        } else {
          toast.error("An error occurred while booking the appointment");
        }
      } else {
        // Handle non-Axios errors (e.g., network issues)
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  // Calendar Modal Component
  const CalendarModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Select Date</h3>
          <button
            onClick={() => setShowCalendar(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium">
              {format(currentMonth, "MMMM yyyy")}
            </h4>
            <div className="flex gap-2">
              <button
                onClick={prevMonth}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-gray-500 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({
              length: new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth(),
                1
              ).getDay(),
            }).map((_, i) => (
              <div key={`empty-${i}`} className="p-2" />
            ))}

            {daysInMonth.map((day) => (
              <button
                key={day.toString()}
                onClick={() => {
                  setSelectedDate(day);
                  setShowCalendar(false);
                }}
                className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                  isSameDay(selectedDate, day)
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {format(day, "d")}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => setShowCalendar(false)}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg mr-2"
          >
            Cancel
          </button>
          <button
            onClick={() => setShowCalendar(false)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-28 px-4 sm:px-6 lg:px-8">
      {showCalendar && <CalendarModal />}

      <div className="mx-auto flex   gap-8">
        {" "}
        {/* Added flex container */}
        {/* Main content column */}
        <div className="flex-1  bg-white rounded-2xl shadow-2xl p-6 md:p-8 space-y-8">
          {/* Doctor Profile Card */}
          <div
            id="hello"
            className=" bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 md:p-8 max-w-5xl"
          >
            <div className="flex flex-col md:flex-row gap-8">
              {/* Doctor Image */}
              <div className="w-48 h-48 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0 shadow-lg">
                <img
                  src={personalInfo.profilePicture}
                  alt="Dr. Mohammed Nifli"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Doctor Info */}
              <div className="flex-grow space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-3">
                    Dr. {personalInfo?.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2">
                    {/* {doctorInfo.credentials.map((credential, index) => ( */}
                      <span
                        // key={index}
                        className="px-3 py-1.5 bg-blue-500/20 rounded-full text-sm text-blue-200 font-medium"
                      >
                        {professionalInfo.specialization}
                      </span>
                    {/* ))} */}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-lg font-semibold">
                      {doctorInfo.rating}
                    </span>
                  </div>
                  <span className="text-gray-300">
                    ({doctorInfo.totalReviews} reviews)
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-300">
                  <MapPin className="w-5 h-5" />
                  <span className="text-lg">{clinicDetails.name}, {clinicDetails.address}</span>
                </div>

                <div className="flex flex-wrap gap-3 mt-4">
                  {/* {doctorInfo.specializations.map((spec, index) => ( */}
                  <span
                    // key={index}
                    className="px-4 py-2 bg-white/10 rounded-full text-sm text-white font-medium"
                  >
                    {professionalInfo.specialization}
                  </span>
                  {/* ))} */}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-4 min-w-[200px]">
                <button
                  onClick={handleSave}
                  className="px-6 py-3.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  Book Appointment
                </button>
                <button className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  View Reviews
                </button>
              </div>
            </div>
          </div>
          <div className="space-y-8">
            {/* Date Selection */}
            <div className="mb-6">
              {/* Date Section */}
              <div className="flex items-center justify-between mb-6">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {format(selectedDate, "EEEE, MMMM d, yyyy")}
                  </h2>
                  <button
                    onClick={() => setShowCalendar(true)}
                    className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center gap-1"
                  >
                    <Calendar className="w-4 h-4" />
                    Change date
                  </button>
                </div>
              </div>

              {/* Date Options */}
              <div className="flex gap-3 overflow-x-auto pb-2">
                {dateOptions.map((date) => (
                  <button
                    key={date.fullDate}
                    onClick={() => setSelectedDate(date.date)}
                    className={`px-4 py-3 rounded-xl flex flex-col items-center min-w-[80px] transition-all duration-200 ${
                      isSameDay(selectedDate, date.date)
                        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25 transform scale-105"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-md hover:scale-102"
                    }`}
                  >
                    <span className="text-sm font-medium">{date.dayName}</span>
                    <span className="text-lg font-semibold mt-1">
                      {date.dayNumber}
                    </span>
                  </button>
                ))}
              </div>

              {/* Online/Offline Selection */}
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={() => {setConsultationMode("online")
                    fetchTimeSlot(selectedDate)}
                  }
                  className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                    consultationMode === "online"
                      ? "bg-green-500 text-white shadow-lg shadow-green-500/25"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-md"
                  }`}
                >
                  Online
                </button>
                <button
                  onClick={() =>{ setConsultationMode("offline");
                    fetchTimeSlot(selectedDate)
                  }}
                  className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                    consultationMode === "offline"
                      ? "bg-green-500 text-white shadow-lg shadow-green-500/25"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-md"
                  }`}
                >
                  Offline
                </button>
              </div>
            </div>

            {/* Main Content Area with Slots and Clinical Details */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Time Slots Column */}
              <div className="flex-1 space-y-6">
                {/* Morning Slots */}
                <div className="bg-white rounded-xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)] transition-shadow duration-200">
                  <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-blue-500" />
                     Slots
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {morningSlots.length > 0 ? (
                      morningSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedSlot(slot)}
                          className={`px-4 py-3 rounded-xl text-center transition-all duration-200 ${
                            selectedSlot === slot
                              ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25 transform scale-105"
                              : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:shadow-md hover:scale-102 shadow-sm"
                          }`}
                        >
                          {slot} AM
                        </button>
                      ))
                    ) : (
                      <h1 className="col-span-4 text-center text-gray-500">
                        No slots available
                      </h1>
                    )}
                  </div>
                </div>

                {/* Afternoon Slots */}
                {/* <div className="bg-white rounded-xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)] transition-shadow duration-200">
                  <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-blue-500" />
                    Afternoon Slots
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {afternoonSlots.length > 0 ? (
                      afternoonSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedSlot(slot)}
                          className={`px-4 py-3 rounded-xl text-center transition-all duration-200 ${
                            selectedSlot === slot
                              ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25 transform scale-105"
                              : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:shadow-md hover:scale-102 shadow-sm"
                          }`}
                        >
                          {slot} PM
                        </button>
                      ))
                    ) : (
                      <h1 className="col-span-4 text-center text-gray-500">
                        No slots available
                      </h1>
                    )}
                  </div>
                </div> */}
              </div>
              {/* Clinical Details Section */}
              <div className="lg:w-[380px] flex-shrink-0">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-xl p-6 sticky top-6">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Clinical Details
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="text-blue-300 font-medium mb-2">
                        Consultation Fee
                      </h4>
                      <p className="text-white text-lg font-semibold">
                        {financialInfo.consultationFees?.offline}
                      </p>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="text-blue-300 font-medium mb-2">
                        Duration
                      </h4>
                      <p className="text-white">30 minutes</p>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="text-blue-300 font-medium mb-2">
                        clinic Address
                      </h4>
                      <ul className="text-gray-200 space-y-2">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          Name: {clinicDetails.name}
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          place: {clinicDetails.address}
                        </li>
                        {/* <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          Prescription Renewal
                        </li> */}
                      </ul>
                    </div>

                    {selectedSlot && (
                      <button className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-blue-500/25 mt-4">
                        Confirm Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
