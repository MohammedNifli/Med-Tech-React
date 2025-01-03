import React, { useState, useMemo, useEffect } from "react";
import TableComponent from "../../components/reusable/TableComponent";
import { Calendar, Users, Plus, Search, X, Trash2 } from "lucide-react";
import axiosInstance from "../../utils/axiosClient";
import { useSelector } from "react-redux";
import { RootState } from "../../reduxStore/store";
import { Video } from 'lucide-react';
import { Formik, Field, FieldArray, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";


interface PrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  
  appointment: {
    _id?: string;
    patientDetails?: { _id?: string };
    doctorId?: string;
    userId?: string;
  } | null;
  data:unknown
}

const PrescriptionModal: React.FC<PrescriptionModalProps> = ({
  isOpen,
  onClose,

  appointment,
}) => {
  const initialValues = {
    diagnosis: "",
    medicines: [{ name: "", dosage: "", timing: "" }],
    followUpDate: "",
    appointmentId: appointment?._id || "",
    patientId: appointment?.patientDetails?._id || "",
    doctorId: appointment?.doctorId || "",
    userId: appointment?.userId || "",
  };

  const validationSchema = Yup.object({
    diagnosis: Yup.string()
      .required("Diagnosis is required")
      .min(5, "Diagnosis must be at least 5 characters"),
    medicines: Yup.array()
      .of(
        Yup.object({
          name: Yup.string().required("Medicine name is required"),
          dosage: Yup.string().required("Dosage is required"),
          timing: Yup.string().required("Timing is required"),
        })
      )
      .min(1, "At least one medicine is required"),
    // followUpDate: Yup.date()
    //   .required("Follow-Up Date is required")
    //   .min(new Date(), "Follow-Up Date cannot be in the past"),
  });

  const cancel = () => {
    onClose();
  };

  const addPrescriptionApi = async (prescriptionData: unknown) => {
    try {
      const response = await axiosInstance.post(
        "/prescription/doctor",
        prescriptionData
      );
      
      return response.data;
      toast.success('prescription added successfully')
    } catch (error) {
      console.error("Error adding prescription:", error);
      throw error;
    }
  };

  if (!isOpen || !appointment) {
    return null;
  }



  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <ToastContainer/>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl mx-auto my-8 animate-fade-in-up">
        <div className="bg-blue-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center rounded-t-xl">
          <h2 className="text-2xl font-bold text-blue-800">Add Prescription</h2>
          <button
            onClick={cancel}
            className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const prescriptionData = {
                appointmentId: values.appointmentId,
                patientId: values.patientId,
                userId: values.userId,
                doctorId: values.doctorId,
                prescription: {
                  diagnosis: values.diagnosis,
                  medicines: values.medicines,
                  followUpDate: values.followUpDate,
                },
              };

              const response = await addPrescriptionApi(prescriptionData);
              console.log("Prescription added successfully:", response);
              cancel();
            } catch (error) {
              console.error("Error submitting prescription:", error);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values }) => (
            <Form className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diagnosis
                </label>
                <Field
                  as="textarea"
                  name="diagnosis"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter detailed diagnosis..."
                  rows={3}
                />
                <ErrorMessage
                  name="diagnosis"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medicines
                </label>
                <FieldArray name="medicines">
                  {({ remove, push }) => (
                    <div className="space-y-3">
                      {values.medicines.map((_medicine, index) => (
                        <div
                          key={index}
                          className="flex flex-col md:flex-row items-stretch md:items-center space-y-2 md:space-y-0 md:space-x-2 bg-gray-50 p-3 rounded-lg border border-gray-200"
                        >
                          <Field
                            name={`medicines[${index}].name`}
                            placeholder="Medicine Name"
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <Field
                            name={`medicines[${index}].dosage`}
                            placeholder="Dosage"
                            className="w-full md:w-24 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <Field
                            name={`medicines[${index}].timing`}
                            placeholder="Timing"
                            className="w-full md:w-24 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => push({ name: "", dosage: "", timing: "" })}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50"
                      >
                        <Plus className="w-5 h-5" /> Add Medicine
                      </button>
                    </div>
                  )}
                </FieldArray>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Follow-Up Date
                </label>
                <Field
                  type="date"
                  name="followUpDate"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="followUpDate"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={cancel}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Save Prescription
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export interface Appointment {
  _id: string;
  patientDetails: {
    _id: string;
    name: string;
    gender: string;
    age: number;
  };
  appointmentDate: Date;
  timeSlot: string;
  consultationMode: 'online' | 'offline';
  status: 'pending' | 'confirmed' | 'completed';
}
const AppointmentList: React.FC = () => {
  const navigate=useNavigate()
    const doctorId = useSelector((state: RootState) => state.doctor.doctorInfo?.docId);
    const uniqueId=uuidv4()
  
    const [searchTerm, setSearchTerm] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // const [prescription,setPrescription]=useState([])
  
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

    useEffect(()=>{

    })
  
    
  
    
    const openPrescriptionModal = (appointment: Appointment) => {
      setSelectedAppointment(appointment);
      console.log("appointmentdata",appointment)
      setModalOpen(true);
    };
  
    const filteredAppointments = useMemo(() => {
      return appointments.filter((apt) =>
        apt.patientDetails?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }, [appointments, searchTerm]);
  
    // Handle "Join" and "Mark as Completed" button actions
    // const videoCall = () => {
    //   console.log("unique iddd",uniqueId)
    //   navigate(`/room/${uniqueId}`);
    // };
    const handleJoinAppointment = (appointmentId: string) => {
      console.log(`Joining appointment: ${appointmentId}`);
      navigate(`/room/${uniqueId}`);
      // Add logic for joining the appointment (e.g., opening a video call)
    };
  
    const handleMarkAsCompleted =async (appointmentId: string) => {
      console.log(`Marking appointment as completed: ${appointmentId}`);
      const makrAsCompleted =await axiosInstance.post(`/appointment/mark?id=${appointmentId}`) as unknown;
      console.log(makrAsCompleted)
      toast.success('marked as completed')
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
        <ToastContainer/>
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
          appointment={selectedAppointment}
          data={appointments.slice(0, 2)}
        />
      </div>
    );
  };
  
  export default AppointmentList;
  
