import React, { useEffect, useState } from "react";
import { CheckCircle, ThumbsUp, MapPin } from "lucide-react";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import { IoCalendar } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
import AxiosInstance from "../../utils/axiosClient";
import { useSelector } from "react-redux";
import { AttachmentIcon } from "@chakra-ui/icons";
import { RootState } from "../../reduxStore/store";
import { toast, ToastContainer } from "react-toastify";

// Dummy doctor data

interface TimeSlot {
  _id?: string;  
  date:string;
  startTime: string;
  endTime: string;
  status:string;
}

interface RouteParams {
  id: string;
}

const ClinicVisitBooking:React.FC = () => {
  const navigate=useNavigate()
  const { id: docId } = useParams();
  const user=useSelector((state:RootState)=>state.auth.user?._id)
  console.log("user",user)
  
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [visitType, setVisitType] = useState<string>("offline");
  const [docProfile,setDocProfile]=useState(null);
  
  
  const today = new Date().toLocaleDateString('en-CA');

  const fetchTimeSlot = async (date:Date) => {
    if (!date || !docId) return;

    try {
      const formattedDate = date.toLocaleDateString("en-CA");
      const response = await AxiosInstance.get(
        `/user/slots?id=${docId}&date=${formattedDate}`
      );
      setTimeSlots(Array.isArray(response.data.slots) ? response.data.slots : []);
    } catch (error) {
      console.error("Error fetching time slots:", error);
      setTimeSlots([]);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Delay the API call by 2 seconds
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Perform the API call
        const response = await axios.get(`http://localhost:4444/user/doctor-profile?id=${docId}`, {
          withCredentials: true
        });
        console.log("Hoo response", response.data.fetchedProfile);
        setDocProfile(response.data.fetchedProfile);
      } catch (error) {
        console.error("Error fetching doctor profile:", error);
      }
    };

    fetchData();
  }, [docId]);

  useEffect(() => {
    fetchTimeSlot(selectedDate);
  }, [docId, selectedDate]);

  const handleDateChange = (e) => {
    const date = new Date(e.target.value);
    if (date) {
      setSelectedDate(date);
      fetchTimeSlot(date);
    }
  };

  const handleTimeSelection = (startTime:string) => {
    setSelectedTime(startTime);
  };
  
  const handleVisitTypeChange = (type: string) => {
    
    setVisitType(type);
    console.log("type",visitType)
  };

  const handleSave = async () => {
    let money = 0;
    if (visitType === 'online') {
      money = docProfile?.financialInfo?.consultationFees?.online;
    } else {
      money = docProfile?.financialInfo?.consultationFees?.offline;
    }
    console.log("money", money);
    
    const appointmentData = {
      userId: user,
      doctorId: docId,
      patientId: '',
      appointmentDate: selectedDate,
      timeSlot: selectedTime,
      consultationMode: visitType,
      amount: money,
    };
  
    try {
      const response = await axios.post(
        'http://localhost:4444/appointment/add',
        { appointmentData },
        { withCredentials: true }
      );
      console.log("response from booking appointment", response);
  
      console.log("Booking time slot:", selectedTime);
  
      if (response.status === 201) {
        // Assuming a successful booking
        toast.success('Appointment booked successfully!');
        navigate('/patient',{state:{Id:response.data.appointment._id}})
      }
    } catch (error) {
      // Checking if the error is an AxiosError and the status code is 409
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          toast.error('Time slot is already booked');
        } else {
          toast.error('An error occurred while booking the appointment');
        }
      } else {
        // Handle non-Axios errors (e.g., network issues)
        console.error("Unexpected error:", error);
        toast.error('An unexpected error occurred');
      }
    }
  };  

  return (
   
    <div className="w-full max-w-3xl mx-auto p-4">
       <ToastContainer/>
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center mb-6">Clinic Visit</h2>
          
          <div className="space-y-6">
            {/* Date Selection */}
            <div className="flex flex-col items-center space-y-4">
              <input 
                type="date" 
                value={selectedDate.toLocaleDateString('en-CA')}
                onChange={handleDateChange}
                min={today}
                className="w-full max-w-md px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Visit Type Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Visit Type</h3>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleVisitTypeChange("online")}
                  className={`py-2 px-4 rounded-md text-white ${
                    visitType === "online" ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  Online
                </button>
                <button
                  onClick={() => handleVisitTypeChange("offline")}
                  className={`py-2 px-4 rounded-md text-white ${
                    visitType === "offline" ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  Offline
                </button>
              </div>
            </div>

            {/* Time Slot Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Select Time</h3>
              {timeSlots.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {timeSlots.map((slot) => (
                    <label 
                      key={slot._id} 
                      className={`flex items-center space-x-2 cursor-pointer 
                        ${selectedTime === slot.startTime ? 'bg-blue-100' : ''}`}
                    >
                      <input
                        type="radio"
                        name="timeSlot"
                        value={slot.startTime}
                        checked={selectedTime === slot.startTime}
                        onChange={() => handleTimeSelection(slot.startTime)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{slot.startTime}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No time slots available</p>
              )}
            </div>

            {/* Save Button */}
            <button 
              onClick={handleSave}
              className={`w-full py-2 px-4 rounded-md text-white ${
                selectedTime 
                  ? 'bg-blue-600 hover:bg-blue-700' // Enabled styling
                  : 'bg-gray-400 cursor-not-allowed' // Disabled styling
              }`}
              disabled={!selectedTime} // Disable if no time is selected
              aria-label={selectedTime ? "Save appointment" : "Select a time slot to enable saving"}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
const DoctorProfileWithBooking = () => {
  const { id: docId } = useParams();
  const [doctorData, setDoctorData] = useState('');
  const [clinicData, setClinicData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `http://localhost:4444/user/doctor-profile?id=${docId}`,
          { withCredentials: true }
        );
        if (response.data && response.data.fetchedProfile) {
          setDoctorData(response.data.fetchedProfile);
          setClinicData(
            response.data.fetchedProfile.practiceInfo.clinics || []
          );
        }
      } catch (error) {
        console.error("Error fetching doctor data:", error);
        setError("Failed to load doctor data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (docId) {
      fetchDoctorDetails();
    }
  }, [docId]);

  if (isLoading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="flex justify-center items-start space-x-8 mb-12 mx-auto mt-36 max-w-7xl px-4">
      <div className="w-1/2 bg-white shadow rounded-sm overflow-hidden">
        <div className="p-6">
          <div className="flex items-start mb-6">
            <img
              src={doctorData.personalInfo?.profilePicture}
              alt={doctorData.personalInfo?.name}
              className="w-24 h-24 rounded-full object-cover mr-6"
            />

            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {doctorData.personalInfo?.name}
              </h1>
              {doctorData.accountStatus?.verificationStatus && (
                <span className="text-sm text-green-600 font-semibold">
                  Profile is claimed
                </span>
              )}
              <p className="text-gray-600 mt-1">
                {doctorData.professionalInfo?.specialization}
              </p>
              <p className="text-gray-600 text-sm mt-1">
                {doctorData.professionalInfo?.experience} years of experience in{" "}
                {doctorData.professionalInfo?.specialization}
              </p>

              <div className="mt-3 inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm">
                Trusted Care. Lasting Smiles.
              </div>

              {doctorData.accountStatus?.verificationStatus && (
                <div className="mt-3 flex items-center">
                  <CheckCircle className="text-green-600 w-5 h-5 mr-2" />
                  <span className="text-green-600 text-sm">
                    Medical Registration Verified
                  </span>
                </div>
              )}

              <div className="mt-2 flex items-center">
                <ThumbsUp className="text-green-600 w-5 h-5 mr-2" />
                <span className="text-green-600 font-bold">
                  {doctorData.rating}%
                </span>
                <span className="text-gray-600 text-sm ml-1">
                  ({doctorData.reviews} patients)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 p-4">
          <div className="flex space-x-6 text-sm font-medium">
            <span className="text-blue-600 border-b-2 border-blue-600 pb-2">
              Info
            </span>
            <span className="text-gray-600">Stories</span>
            <span className="text-gray-600">Consult Q&A</span>
            <span className="text-gray-600">Healthfeed</span>
          </div>
        </div>

        <div className="p-6">
          {clinicData.map((clinic, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-2xl font-bold text-blue-600 mt-1">
                {clinic.name}
              </h3>
              <div className="flex items-center mt-2">
                <span className="text-green-600 font-bold mr-1">
                  {clinic.rating || "N/A"}
                </span>
                {/* <div className="flex text-green-600">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div> */}
              </div>
              <div className="mt-3 flex items-start">
                <MapPin className="w-5 h-5 text-gray-500 mr-2 mt-1 flex-shrink-0" />
                <p className="text-gray-600 text-sm">{clinic?.address}</p>
              </div>
              <div className="mt-2 flex items-center">
                {/* <Clock className="w-5 h-5 text-gray-500 mr-2" /> */}
                <p className="text-gray-600 text-sm">{}</p>
              </div>
              <p className="mt-2 text-gray-800 font-semibold">
                ₹ online : {doctorData.financialInfo.consultationFees?.online}
              </p>
              <p className="mt-2 text-gray-800 font-semibold">
                ₹ online : {doctorData.financialInfo.consultationFees?.offline}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="w-1/3">
        <ClinicVisitBooking />
      </div>
    </div>
  );
};
export default DoctorProfileWithBooking;
