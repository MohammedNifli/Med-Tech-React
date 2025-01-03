import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '@chakra-ui/react';
import TableComponent from '../../components/reusable/TableComponent';
import Pagination from '../../components/reusable/paginationComponent';
import { fetchingDoctorDetails, blockDoctor, unblockDoctor } from '../../services/adminServices';
import { useDispatch } from 'react-redux';
import { setDoctorBlockedState } from '../../slices/doctorSlice';

import axiosInstance from '@/utils/axiosClient';

interface PersonalInfo {
    name: string;
    email: string;
    phone: string;
    gender: string;
}

interface AccountStatus {
    isActive: boolean;
    verificationStatus: string;
}

interface Doctor {
    _id: string;
    personalInfo: PersonalInfo;
    accountStatus: AccountStatus;
    isBlocked: boolean;
}

const DoctorsDetails: React.FC = () => {
    const dispatch = useDispatch();
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [paginatedDoctors, setPaginatedDoctors] = useState<Doctor[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [filter, setFilter] = useState<'all' | 'blocked' | 'unblocked' |'pending'|'verified'>('all');
    const navigate = useNavigate();
    const pageLimit = 3;

    useEffect(() => {
        const fetchDoctorDetails = async () => {
            try {
                const response = await fetchingDoctorDetails();
                if (response?.data?.fetchingAllDoctors) {
                    setDoctors(response.data.fetchingAllDoctors);
                } else {
                    setError('No doctor data available');
                }
            } catch (err) {
                setError('Failed to fetch doctor details.');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctorDetails();
    }, []);


    const handleFilterChange = async (selectedFilter: 'all' | 'blocked' | 'unblocked'|'pending'|'verified') => {
        setFilter(selectedFilter);

      
      
        setLoading(true); // Show loading state while fetching data

        try {
            const response = await axiosInstance.get(`/admin/doc-filter/?filter=${selectedFilter}`); // Call the API
            console.log('respiratory',response?.data?.doctors)
            if (response?.data?.doctors) {
                setDoctors(response.data.doctors); // Set the paginated results
            } else {
                setError('No doctors found for the selected filter');
            }
        } catch (error) {
            setError('Failed to fetch filtered doctor details.');
            console.error('Error fetching filtered doctors:', error);
        } finally {
            setLoading(false); // Hide loading state
        }
    };

    const handleViewDoctor = (doctorId: string) => {
        navigate(`/admin/approval/${doctorId}`);
    };

    const handleBlockDoctor = async (doctorId: string) => {
        try {
            await blockDoctor(doctorId);

            // Update Redux state and localStorage
            dispatch(setDoctorBlockedState(true));
            localStorage.setItem('isBlocked', 'true');

            // Update UI doctor list
            setDoctors(prevDoctors => prevDoctors.map(doc =>
                doc._id === doctorId ? { ...doc, isBlocked: true } : doc
            ));
            toast.success('Doctor blocked successfully');
        } catch (error) {
            toast.error('Failed to block doctor');
            console.error('Error blocking doctor:', error);
        }
    };

    const handleUnblockDoctor = async (doctorId: string) => {
        try {
            await unblockDoctor(doctorId);

            // Update Redux state and localStorage
            dispatch(setDoctorBlockedState(false));
            localStorage.setItem('isBlocked', 'false'); // Set it to false for consistency

            // Update UI doctor list
            setDoctors(prevDoctors => prevDoctors.map(doc =>
                doc._id === doctorId ? { ...doc, isBlocked: false } : doc
            ));
            toast.success('Doctor unblocked successfully');
        } catch (error) {
            toast.error('Failed to unblock doctor');
            console.error('Error unblocking doctor:', error);
        }
    };

    const doctorColumns = [
        {
            label: 'Name',
            accessor: 'personalInfo.name'
        },
        {
            label: 'Email',
            accessor: 'personalInfo.email'
        },
        {
            label: 'Phone',
            accessor: 'personalInfo.phone'
        },
        {
            label: 'Gender',
            accessor: 'personalInfo.gender'
        },
        {
            label: 'Status',
            accessor: 'accountStatus.verificationStatus'
        },
        {
            label: 'View',
            isAction: true,
            action: handleViewDoctor,
            actionLabel: () => 'View',
            actionColorScheme: () => 'blue',
        },
        {
            label: 'Block/Unblock',
            render: (doctor: Doctor) => (
                <Button
                    colorScheme={doctor.isBlocked ? 'green' : 'red'}
                    onClick={() => doctor.isBlocked ? handleUnblockDoctor(doctor._id) : handleBlockDoctor(doctor._id)}
                    size="sm"
                >
                    {doctor.isBlocked ? 'Unblock' : 'Block'}
                </Button>
            )
        }
    ];

    return (
        <div className="border h-screen border-white shadow-lg p-4">
            <div className="mb-4">
                <label htmlFor="filter" className="mr-2">Filter by Status:</label>
                <select
                    id="filter"
                    value={filter}
                    onChange={(e) => handleFilterChange(e.target.value as 'all' | 'blocked' | 'unblocked' |'pending'| 'verified')}
                >
                    <option value="all">All Doctors</option>
                    <option value="blocked">Blocked Doctors</option>
                    <option value="unblocked">Unblocked Doctors</option>
                    <option value="pending">status Pending</option>
                    <option value="verfied">verified</option>
                </select>   
            </div>
            <TableComponent
                caption="Med-Tech Doctor Details"
                data={paginatedDoctors}
                columns={doctorColumns}
                error={error}
                isLoading={loading}
            />
            <Pagination
                items={doctors}
                pageLimit={pageLimit}
                setPageItems={setPaginatedDoctors}
            />
        </div>
    );
};

export default DoctorsDetails;
