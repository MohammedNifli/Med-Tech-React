import React, { useState, useEffect } from 'react';
import FindDoctorSidebar from '../../components/user/findDoctorPageSider';
import FindDoctor from '../user/findDoctor';



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


interface FilterState {
  availability: string[];
  consultationFee: string[];
  gender: string[];
  experience: string[];
  rating: string[];
  mode: string[];
}

const SearchPage: React.FC = () => {
   
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);

  // Effect to sync filteredDoctors with allDoctors when no filters are active
  useEffect(() => {
    console.log('allDoctors',allDoctors)
    setFilteredDoctors(allDoctors);
  }, [allDoctors]);

  const handleFilterChange = (filters: FilterState) => {
    console.log('filters',filters)
    // Check if any filters are active
    const hasActiveFilters = Object.values(filters).some(filterArray => filterArray.length > 0);

    // If no filters are active, show all doctors
    if (!hasActiveFilters) {
      setFilteredDoctors(allDoctors);
      return;
    }

    let filtered = [...allDoctors];

    // Filter by gender
    if (filters.gender.length > 0) {
      filtered = filtered.filter((doctor) =>
        filters.gender.includes(doctor.personalInfo.gender.toLowerCase())
      );
    }

    // Filter by experience
    if (filters.experience.length > 0) {
      filtered = filtered.filter((doctor) => {
        const exp = doctor.professionalInfo.experience;
        return filters.experience.some((range) => {
          switch (range) {
            case '0-5 years':
              return exp >= 0 && exp <= 5;
            case '5-10 years':
              return exp > 5 && exp <= 10;
            case '10-15 years':
              return exp > 10 && exp <= 15;
            case '15+ years':
              return exp > 15;
            default:
              return false;
          }
        });
      });
    }

    // Filter by consultation fee
    if (filters.consultationFee.length > 0) {
      filtered = filtered.filter((doctor) => {
        const fee = doctor.financialInfo?.consultationFees?.online ||doctor.financialInfo?.consultationFees?.online;
        return filters.consultationFee.some((range) => {
          switch (range.toLowerCase()) {
            case 'below 500':
              return fee < 500;
            case '500 - 1000':
              return fee >= 500 && fee <= 1000;
            case '1000 - 2000':
              return fee > 1000 && fee <= 2000;
            case 'above 2000':
              return fee > 2000;
            default:
              return false;
          }
        });
      });
    }


    if (filters.mode.length > 0) {
        // Consolidate filtering logic
        filtered = filtered.filter((doctor) => {
          // Check all selected modes
          return filters.mode.some((val) => {
            switch (val) {
              case 'video':
                return doctor.practiceInfo?.consultationModes?.online === true;
              case 'offline':
                return doctor.practiceInfo?.consultationModes?.offline === true;
              case 'chat':
                return doctor.practiceInfo?.consultationModes?.chat === true;
              default:
                return false;
            }
          });
        });
      }


      if (filters.rating.length > 0) {
        filtered = filtered.filter((doctor) => {
          // Ensure feedback and rating exist before applying filters
          const rating = doctor.averageRating;
          if (rating === undefined) return false;
      
          return filters.rating.some((val) => {
            switch (val) {
              case '4':
                return rating >= 4;
              case '3':
                return rating >= 3 && rating < 4;
              case '2':
                return rating >= 2 && rating < 3;
              default:
                return false; // Explicitly return false for unexpected cases
            }
          });
        });
      }
      

    setFilteredDoctors(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/4">
            <div className="sticky top-24">
              <FindDoctorSidebar onFilterChange={handleFilterChange} />
            </div>
          </div>
          <div className="w-full md:w-3/4">
            <FindDoctor
              filteredDoctors={filteredDoctors}
              setAllDoctors={setAllDoctors}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;