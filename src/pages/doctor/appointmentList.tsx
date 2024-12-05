import React, { useState, useMemo, useEffect } from "react";
import TableComponent, { TableColumn } from "../../components/reusable/TableComponent";
import { Calendar, Users, Plus, Search, X } from "lucide-react";
import axiosInstance from "../../utils/axiosClient";
import { useSelector } from "react-redux";
import { RootState } from "../../reduxStore/store";
import { Video } from 'lucide-react';

interface Appointment {
  _id: string;
  userId: string;
  doctorId: string;
  appointmentDate: string;
  status: string;
  timeSlot: string;
  consultationMode: string;
  paymentStatus?: string;
  amount?: number;
  patientDetails?: {
    name: string;
    age: number;
    gender: string;
  };
}

interface PrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prescription: string) => void;
  appointment: Appointment | null;
}

const PrescriptionModal: React.FC<PrescriptionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  appointment,
}) => {
  const [prescription, setPrescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(prescription);
    setPrescription("");
  };

  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Prescription</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-600">
            Patient: <span className="font-medium">{appointment.patientDetails?.name || "Unknown"}</span>
          </p>
          <p className="text-gray-600">
            Date: <span className="font-medium">{appointment.appointmentDate}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prescription</label>
            <textarea
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter prescription..."
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Save Prescription
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AppointmentList: React.FC = () => {
    const doctorId = useSelector((state: RootState) => state.doctor.doctorInfo?.docId);
  
    const [searchTerm, setSearchTerm] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchAppointments = async () => {
        if (!doctorId) return;
  
        try {
          setIsLoading(true);
          const response = await axiosInstance.get(`/appointment/appointment-list?id=${doctorId}`);
          console.log('response', response);
          setAppointments(response.data.data);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching appointments:", error);
          setError("Failed to fetch appointments");
          setIsLoading(false);
        }
      };
  
      fetchAppointments();
    }, [doctorId]);
  
    const handleAddPrescription = async (prescription: string) => {
      if (selectedAppointment) {
        try {
          await axiosInstance.post(`/appointment/add-prescription`, {
            appointmentId: selectedAppointment._id,
            prescription,
          });
          setModalOpen(false);
          setSelectedAppointment(null);
        } catch (err) {
          console.error("Error adding prescription:", err);
        }
      }
    };
  
    const openPrescriptionModal = (appointment: Appointment) => {
      setSelectedAppointment(appointment);
      setModalOpen(true);
    };
  
    const filteredAppointments = useMemo(() => {
      return appointments.filter((apt) =>
        apt.patientDetails?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }, [appointments, searchTerm]);
  
    // Handle "Join" and "Mark as Completed" button actions
    const handleJoinAppointment = (appointmentId: string) => {
      console.log(`Joining appointment: ${appointmentId}`);
      // Add logic for joining the appointment (e.g., opening a video call)
    };
  
    const handleMarkAsCompleted = (appointmentId: string) => {
      console.log(`Marking appointment as completed: ${appointmentId}`);
      // Add logic to mark the appointment as completed
    };
  
    const columns = [
      {
        label: "Patient Name",
        render: (row: Appointment) => (
          <div className="flex items-center gap-2">
            <Users size={16} className="text-gray-500" />
            <span>{row.patientDetails?.name || "Unknown Patient"}</span>
          </div>
        ),
      },
      { label: "Gender", render: (row: Appointment) => row.patientDetails?.gender || "N/A" },
      { label: "Age", render: (row: Appointment) => row.patientDetails?.age || "N/A" },
      {
        label: "Date",
        render: (row: Appointment) => (
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-500" />
            <span>{new Date(row.appointmentDate).toLocaleDateString()}</span>
          </div>
        ),
      },
      { label: "Time", accessor: "timeSlot" },
      {
        label: "Mode",
        render: (row: Appointment) => (
          <span
            className={`px-2 py-1 rounded-full text-sm ${
              row.consultationMode === "online"
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {row.consultationMode}
          </span>
        ),
      },
      {
        label: "Status",
        render: (row: Appointment) => (
          <span
            className={`px-2 py-1 rounded-full text-sm ${
              row.status === "confirmed"
                ? "bg-green-100 text-green-800"
                : row.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {row.status}
          </span>
        ),
      },
      
      {
        label: "Prescription",
        render: (row: Appointment) => (
          <button
            className="px-3 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 flex items-center gap-1"
            onClick={() => openPrescriptionModal(row)}
          >
            <Plus size={16} /> Add
          </button>
        ),
      },
      {
        label: "Action",
        render: (row: Appointment) => {
            if (row.status === "confirmed" && row.consultationMode === "online") {
                return (
                  <button
                    onClick={() => handleJoinAppointment(row._id)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                  >
                    <Video size={20} className="text-white" />
                    <span>Join</span>
                  </button>
                );
              }
          if (row.consultationMode === "offline") {
            return (
              <button
                onClick={() => handleMarkAsCompleted(row._id)}
                className="px-3 py-1 text-sm text-white bg-green-500 rounded-md hover:bg-green-600"
              >
                Mark as Completed
              </button>
            );
          }
          return null;
        },
      },
    ];
  
    if (isLoading) return <div>Loading appointments...</div>;
    if (error) return <div>{error}</div>;
  
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Appointment Listing</h1>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
  
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <TableComponent caption="Appointments Overview" data={filteredAppointments} columns={columns} />
            </div>
          </div>
        </div>
  
        <PrescriptionModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleAddPrescription}
          appointment={selectedAppointment}
          data={appointments.slice(0, 2)}
        />
      </div>
    );
  };
  
  export default AppointmentList;
  
