import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosClient";
import TableComponent, { TableColumn } from "../../components/reusable/TableComponent";

interface Appointment {
  _id: string; 
  patientName: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: string;
  status: string;
  reason: string;
}

const AppointmentListing: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get("/admin/appointments");
        console.log('repspsp',response)
        setAppointments(response.data.fetchedAllAppointments);
      } catch (err) {
        setError("Failed to load appointments.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const columns: TableColumn<Appointment>[] = [
    {
      label: "Patient Name",
      accessor: "userDetails.name", // Access the first item in the userDetails array
    },
    {
      label: "Doctor Name",
      accessor: "doctorDetails.personalInfo.name", // Access the first item in doctorDetails and the name field
    },
    {
      label: "Appointment Date",
      accessor: "appointmentDate", // Directly access appointmentDate (already formatted as yyyy-mm-dd)
    },
    {
      label: "Appointment Time",
      accessor: "timeSlot", // Ensure this field exists in the data if applicable
    },
    {
      label: "Appointment Type",
      accessor: "consultationMode", // Directly access consultationMode field
    },
    {
      label: "Status",
      accessor: "status", // Access the status field directly
    },
    {
      label: "Actions",
      isAction: true,
      actionLabel: () => "View Details",
      actionColorScheme: () => "blue",
      action: (id: string) => {
        console.log("View details for appointment ID:", id);
        // Add navigation logic if needed
      },
    },
  ];
  

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Appointment Listings</h1>
      <TableComponent
        caption="Appointments"
        data={appointments}
        columns={columns}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};

export default AppointmentListing;