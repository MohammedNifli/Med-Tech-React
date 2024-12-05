import React, { useEffect, useState } from 'react';
import { TableColumn } from '../../components/reusable/TableComponent'; // Make sure the path is correct
import TableComponent from '../../components/reusable/TableComponent'; // Make sure the path is correct
import axiosInstance from '@/utils/axiosClient';

// Define the patient data type based on your API response
interface Patient {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
}

const patientListing = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true);
      try {
        // Replace this URL with the actual API endpoint
        const response = await axiosInstance.get('/admin/patients');
        console.log('reppoewp',response)
       
        if (response.status==200) {
          setPatients(response.data.fetchAllPatients); // Assuming 'patients' is the key in the response
        } 
      } catch (err) {
        setError('An error occurred while fetching patients.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Define the columns for the patient table
  const columns: TableColumn<Patient>[] = [
    {
      label: 'Patient Name',
      accessor: 'name',
    },
    {
      label: 'Email',
      accessor: 'email',
    },
    {
        label: 'Gender',
        accessor: 'gender',
      },
    {
      label: 'Phone',
      accessor: 'phone',
    },
    
    {
      label: 'Actions',
      isAction: true,
      actionLabel: () => 'View Details',
      actionColorScheme: () => 'blue',
      action: (id: string) => {
        console.log('View details for patient ID:', id);
        // You can navigate to a detailed page or show a modal
      },
    },
  ];

  return (
    <div>
      
      <TableComponent
        caption="Patient List"
        data={patients}
        columns={columns}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};

export default patientListing;
