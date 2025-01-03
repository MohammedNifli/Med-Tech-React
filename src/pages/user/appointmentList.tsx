import React, { useEffect, useState } from "react";
import { Search, Calendar, MapPin, Star, Filter, Menu } from "lucide-react";
import Sidebar from "../../components/user/Sider";
import { useSelector } from "react-redux";
import { RootState } from "../../reduxStore/store";
import axiosInstance from "../../utils/axiosClient";
import { MdModeStandby } from "react-icons/md";


interface Doctor {
  personalInfo: {
    name: string;
    profilePicture:string;
  };
  professionalInfo: {
    profilePicture?: string;
  };
  practiceInfo: {
    clinics: Array<{
      name: string;
      address: string;
    }>;
  };
}

interface appointment {
  _id: string;
  doctorDetails: Doctor;
  appointmentDate: string;
  consultationMode:"online" | "offline";
  timeSlot: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  amount:number;
  rating: number;
  comments: number;
}

const AppointmentList: React.FC = () => {
  const userId = useSelector((state: RootState) => state.auth.user?._id);
  // const [appointments, setAppointments] = useState<appointment[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<
    appointment[]
  >([]);
  const [todaysAppointments, setTodaysAppointments] = useState<appointment[]>(
    []
  );
  const [pastAppointments, setPastAppointments] = useState<appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] =
    useState<appointment | null>(null);
  const [modal, setModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axiosInstance.get(
          `/appointment/appointmentlist/?id=${userId}`
        );
        const fetchedAppointments = response.data.fetchedAppointments;
      
        categorizeAppointments(fetchedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };
    if (userId) fetchAppointments();
  }, [userId]);

  const categorizeAppointments = (appointments: appointment[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const upcoming: appointment[] = [];
    const today_apps: appointment[] = [];
    const past: appointment[] = [];

    appointments.forEach((appointment) => {
      const appointmentDate = new Date(appointment.appointmentDate);
      if (appointmentDate.toDateString() === today.toDateString()) {
        today_apps.push(appointment);
      } else if (appointmentDate < today) {
        past.push(appointment);
      } else {
        upcoming.push(appointment);
      }
    });

    setUpcomingAppointments(upcoming);
    setTodaysAppointments(today_apps);
    setPastAppointments(past);
  };

  const toggleRescheduleModal = (appointment: appointment) => {
    setSelectedAppointment(appointment);
    setModal(true);
  };

  const cancelModal = () => {
    setModal(false);
    setSelectedAppointment(null);
  };

  const handleReschedule = async () => {
    try {
      cancelModal();
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
    }
  };

  const handleCancel=async(appointmentId:string,amount:number)=>{
    try{
      console.log('amount',amount)
      console.log('appointmentId',appointmentId)
      const response=await axiosInstance.post(`/appointment/cancel`,{amount,appointmentId,userId})
      console.log("cancel response",response)

    }catch(error){
      console.log(error)
    }
  }

  const renderStars = (rating: number) => (
    <div className="flex">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          className={`w-3 h-3 md:w-4 md:h-4 ${
            index < Math.floor(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );

  const AppointmentCard = ({
    appointment,
    isPast = false,
  }: {
    appointment: appointment;
    isPast?: boolean;
  }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <img
            src={
              appointment.doctorDetails?.personalInfo?.profilePicture ||
              "/pictures/user-avatar.jpg"
            }
            alt="Doctor Profile"
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h3 className="font-medium text-gray-900">
              Dr. {appointment?.doctorDetails?.personalInfo?.name}
            </h3>
            <div className="flex items-center gap-2 text-gray-600 mt-2">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">
                {new Date(appointment.appointmentDate).toLocaleDateString()} -{" "}
                {appointment.timeSlot}
              </span>
              <span className="text-sm">|</span>
              <MdModeStandby className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">
                {appointment?.consultationMode || "In-Person"}
              </span>
              <span className="text-sm">|</span>
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">
                {appointment?.doctorDetails?.practiceInfo?.clinics[0].name},{" "}
                {appointment?.doctorDetails?.practiceInfo?.clinics[0].address}
              </span>
            </div>
          </div>
        </div>

        <div className="lg:text-right">
  <div className="flex items-center lg:justify-end gap-2 mb-4">
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
        appointment.status === "confirmed"
          ? "bg-green-100 text-green-700"
          : appointment.status === "cancelled"
          ? "bg-red-100 text-red-700"
          : "bg-yellow-100 text-yellow-700"
      }`}
    >
      {appointment.status}
    </span>
  </div>
  <div className="flex items-center lg:justify-end gap-2">
    {renderStars(appointment.rating)}
    <span className="text-sm text-gray-500">
      {appointment.comments} comments
    </span>
  </div>
  <div className="flex flex-col sm:flex-row gap-2 mt-4">
    {isPast ? (
      <button className="w-full sm:w-auto px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
        View Details
      </button>
    ) : (
      <>
        {appointment.status === "cancelled" ? (
          <span className="w-full sm:w-auto px-4 py-2 text-gray-500 bg-gray-100 rounded-lg">
            Cancelled
          </span>
        ) : (
          <>
            <button
              onClick={() =>
                handleCancel(appointment?._id, appointment?.amount)
              }
              className="w-full sm:w-auto px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={() => toggleRescheduleModal(appointment)}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reschedule
            </button>
          </>
        )}
      </>
    )}
  </div>
</div>

      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {modal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            {/* Modal Overlay */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={cancelModal}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-lg max-w-lg w-full p-6 shadow-xl">
              <h2 className="text-xl font-semibold mb-4">
                Reschedule Appointment
              </h2>

              {/* Appointment Details */}
              <div className="mb-4">
                <p className="text-gray-600">
                  Current appointment with Dr.{" "}
                  {selectedAppointment?.doctorDetails.personalInfo.name}
                </p>
                <p className="text-gray-600">
                  Date:{" "}
                  {new Date(
                    selectedAppointment?.appointmentDate || ""
                  ).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  Time: {selectedAppointment?.timeSlot}
                </p>
              </div>

              {/* Add your rescheduling form elements here */}
              <div className="mb-6">
                {/* Add date picker, time selector, etc. */}
                <p className="text-gray-600">
                  Rescheduling options will go here
                </p>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={cancelModal}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReschedule}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Confirm Reschedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <button
        className="fixed top-4 left-4 lg:hidden z-50 p-2 bg-white rounded-lg shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="w-6 h-6" />
      </button>

      <div className={`${isMobileMenuOpen ? "block" : "hidden"} lg:block`}>
        <Sidebar />
      </div>

      <main className="lg:pl-64">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
          <div className="mt-16 lg:mt-24">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 lg:mb-8">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                My Appointments
              </h1>
              <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                New Appointment
              </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm mb-6 lg:mb-8 overflow-x-auto">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 min-w-max">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search appointments"
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <select className="w-full sm:w-40 py-2 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All Types</option>
                </select>

                <select className="w-full sm:w-40 py-2 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All Status</option>
                </select>

                <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Calendar className="w-4 h-4" />
                  <span>Select date</span>
                </button>

                <button className="w-full sm:w-auto sm:ml-auto flex items-center justify-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                  <Filter className="w-4 h-4" />
                  <span>More filters</span>
                </button>
              </div>
            </div>

            {/* Today's Appointments */}
            {todaysAppointments.length > 0 && (
              <section className="mb-8">
                <h2 className="text-lg font-semibold mb-4">
                  Today&apos;s Appointments
                </h2>
                <div className="space-y-4">
                  {todaysAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment._id}
                      appointment={appointment}
                      isPast={false}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Upcoming Appointments */}
            {upcomingAppointments.length > 0 && (
              <section className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Upcoming</h2>
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment?._id}
                      appointment={appointment}
                      isPast={false}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Past Appointments */}
            {pastAppointments.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-4">Past</h2>
                <div className="space-y-4">
                  {pastAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment._id}
                      appointment={appointment}
                      isPast={true}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppointmentList;
