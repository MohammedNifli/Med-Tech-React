import React, { useEffect, useState, useCallback } from 'react';
import { Search, MapPin, Globe, Clock, UserCircle, Loader2 } from 'lucide-react';
import axiosInstance from '@/utils/axiosClient';
import debounce from 'lodash/debounce';
import { useNavigate } from 'react-router-dom';

interface Doctor {
  _id: string;
  personalInfo: {
    address: {
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
    };
    name: string;
    gender: string;
    email: string;
    password: string;
    phone: string;
    dateOfBirth: string; // ISO format date string
    profilePicture: string;
  };
  professionalInfo: {
    specialization: string;
    qualifications: {
      degree: string;
      institution: string;
      year: number;
      _id: string;
    }[];
    licenseNumber: string;
    licenseFile: {
      title: string;
      file: string;
      _id: string;
    }[];
    certificates: {
      title: string;
      file: string;
      _id: string;
    }[];
    languages: string[];
    experience: number;
  };
  practiceInfo: {
    consultationModes: {
      online: boolean;
      offline: boolean;
      chat:boolean;
    };
    clinics: {
      name: string;
      address: string;
      _id: string;
    }[];
  };
  accountStatus: {
    verificationStatus: string;
  };
  isBlocked: boolean;
  createdAt: string; // ISO format date string
  updatedAt: string; // ISO format date string
  financialInfo: {
    consultationFees: {
      online: number;
      offline: number;
    };
  };
  feedback: {
    _id: string;
    userId: string;
    doctorId: string;
    patientId: string;
    feedback: string;
    rating: number;
    hasAdded: boolean;
    __v: number;
  };
  averageRating: number;
}

interface FindDoctorProps {
  filteredDoctors: Doctor[];
  setAllDoctors: (doctors: Doctor[]) => void;
}

const DOCTORS_PER_PAGE = 9;

const FindDoctor: React.FC<FindDoctorProps> = ({
  filteredDoctors,
  setAllDoctors,
}) => {
  const navigate = useNavigate();
  const [specialization, setSpecialization] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [currentPage, ] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDoctors = useCallback(
    debounce(async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get<{ doctors: Doctor[] }>(
          `/user/search?specialization=${encodeURIComponent(
            specialization
          )}&location=${encodeURIComponent(
            location
          )}&page=${currentPage}&limit=${DOCTORS_PER_PAGE}`
        );
        setAllDoctors(response.data.doctors);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    }, 300),
    [specialization, location, currentPage, setAllDoctors]
  );

  useEffect(() => {
    fetchDoctors();
    return () => fetchDoctors.cancel();
  }, [fetchDoctors]);

  const displayDoctors = filteredDoctors.length > 0 ? filteredDoctors : [];

  const bookAppointment = (doctorId: string) => {
    try {
      navigate(`/book/${doctorId}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="container mx-auto px-4">
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by specialization"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
        </div>
      )}

      {!loading && displayDoctors.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <UserCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            No doctors found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search criteria
          </p>
        </div>
      )}

      {!loading && displayDoctors.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayDoctors.map((doctor) => (
            <DoctorCard
              key={doctor._id}
              doctor={doctor}
              bookAppointment={bookAppointment} // Pass function down
            />
          ))}
        </div>
      )}
    </section>
  );
};

const DoctorCard: React.FC<{ doctor: Doctor; bookAppointment: (doctorId: string) => void }> = ({
  doctor,
  bookAppointment,
}) => (
  <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
    <div className="relative">
      <img
        src={doctor.personalInfo?.profilePicture}
        alt={doctor.personalInfo.name}
        className="w-[200px] h-[200px] object-cover rounded-t-xl"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = '/api/placeholder/200/200';
        }}
      />
      <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-cyan-600">
        {doctor.professionalInfo.specialization}
      </div>
    </div>
    <div className="p-6">
      <h3 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-cyan-600 transition-colors duration-200">
        {doctor.personalInfo.name}
      </h3>
      <div className="space-y-3">
        <div className="flex items-center text-gray-600">
          <MapPin className="w-4 h-4 mr-2 text-cyan-500" />
          <span>{doctor.personalInfo?.address?.city || 'Unknown'}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Clock className="w-4 h-4 mr-2 text-cyan-500" />
          <span>{doctor.professionalInfo.experience} years experience</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Globe className="w-4 h-4 mr-2 text-cyan-500" />
          <span>{doctor.professionalInfo.languages?.join(', ') || 'Not specified'}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <UserCircle className="w-4 h-4 mr-2 text-cyan-500" />
          <span>{doctor.personalInfo?.gender || 'Not specified'}</span>
        </div>
      </div>
      <button
        onClick={() => bookAppointment(doctor._id)} // Call function when button is clicked
        className="w-full mt-6 py-3 px-4 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transform hover:-translate-y-0.5 transition-all duration-200"
      >
        Book Appointment
      </button>
    </div>
  </div>
);

export default FindDoctor;
