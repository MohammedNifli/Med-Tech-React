import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import Popup from "../../components/PopUp";
import { TbPointFilled } from "react-icons/tb";
import { BiSolidChat } from "react-icons/bi";
import { MdBookOnline } from "react-icons/md";
import { MdOutlineEventNote } from "react-icons/md";
import { FaNotesMedical } from "react-icons/fa6";
import { MdOutlineReviews } from "react-icons/md";
// import Docdetails from "./Docdetails";
import { useNavigate } from "react-router-dom";

type FilterOption =
  | "Experience"
  | "Availability"
  | "Consultation Fee"
  | "Gender"
  | "Consultation Mode"
  | "More Filter";

interface DropdownContent {
  [key: string]: string[];
}

interface Doctor {
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  consultationFee: string;
  photoUrl: string;
  consultationMode: string;
  personalInfo: {
    name: string;
  };
  professionalInfo: {
    specialization: string;
    experience: string;
  };
}

const SearchComponent: React.FC = () => {
  const navigate=useNavigate()
  const [activeFilter, setActiveFilter] = useState<FilterOption | null>(null);
  const [selectedDoctors, setSelectedDoctors] = useState<Doctor[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<{
    [key in FilterOption]?: string;
  }>({});
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const filterOptions: FilterOption[] = [
    "Experience",
    "Availability",
    "Consultation Fee",
    "Gender",
    "Consultation Mode",
    "More Filter",
  ];

  const dropdownContent: DropdownContent = {
    Experience: ["below 5 years", "5-10 years", "above 10 years"],
    Availability: ["Today", "Tomorrow", "This Week", "Next Week"],
    "Consultation Fee": [
      "Free",
      "₹100-₹300",
      "₹301-₹500",
      "₹501-₹1000",
      "Above ₹1000",
    ],
    Gender: ["Male", "Female", "Other"],
    "Consultation Mode": ["online", "offline", "Both"],
    "More Filter": ["Rating", "Language", "Specialization"],
  };

  const toggleDropdown = (filter: FilterOption) => {
    setActiveFilter(filter);
    setIsPopupOpen(true);
  };

  const handleSelectOption = (filter: FilterOption, option: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [filter]: option,
    }));
    handleClosePopup();
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setActiveFilter(null);
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:4444/user/filter", {
          params: {
            experience: selectedOptions.Experience,
            availability: selectedOptions.Availability,
            consultationFee: selectedOptions["Consultation Fee"],
            gender: selectedOptions.Gender,
            consultationMode: selectedOptions["Consultation Mode"],
            moreFilter: selectedOptions["More Filter"],
          },
          withCredentials: true,
        });
        console.log("response", response.data.filteredDoctors);
        setSelectedDoctors(response.data.filteredDoctors);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    if (Object.keys(selectedOptions).length > 0) {
      fetchDoctors();
    }
  }, [selectedOptions]);

  const handleFilterSelect = (filter: FilterOption) => {
    setActiveFilter(filter);
  };

  const handleDoctorClick =(docId:string)=>{
    // navigate(`/pro-view/${docId}`);
    navigate(`/book/${docId}`)
    
  }

  return (
    <div className="container mx-auto px-4  mb-10 md:mt-20 md:mb-20">
      <div className="w-full mt-32 rounded-lg border border-white shadow-md bg-slate-300 flex flex-wrap justify-between items-center px-4 md:px-6">
        <ButtonWithIcon icon={<MdOutlineEventNote />} text="Book Appointment" />
        <ButtonWithIcon icon={<FaNotesMedical />} text="Treatment" />
        <ButtonWithIcon icon={<BiSolidChat />} text="Chat & Ask Questions" />
        <ButtonWithIcon icon={<MdBookOnline />} text="Online Slots" />
        <ButtonWithIcon icon={<MdOutlineReviews />} text="Rate & Review" />
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-4 md:p-6 mt-4">
        <div className="flex flex-wrap gap-2 md:gap-4 mb-4">
          {filterOptions.map((option) => (
            <button
              key={option}
              className={`px-3 py-2 rounded-full text-sm font-medium ${
                selectedOptions[option]
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => toggleDropdown(option)}
            >
              {selectedOptions[option] || option}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {selectedDoctors.length === 0 ? (
            <div className="flex  items-center justify-center h-96">
              <img
                src="/pictures/no-result.png" // Replace with your image path
                alt="No Doctors Available"
                className="max-w-xs w-1/2 h-72"
              />
            </div>
          ) : (
            selectedDoctors.map((doctor, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg overflow-hidden mb-4"
              >
                <div className="p-4 flex items-start space-x-4">
                  <img
                    src={doctor.personalInfo?.profilePicture}
                    alt={doctor.personalInfo.name}
                    className="w-24 h-24 rounded-full object-cover cursor-pointer"
                    onClick={()=>handleDoctorClick(doctor._id)}
                    

                  />
                  <div className="flex-grow">
                    <h2 className="text-lg md:text-xl font-semibold text-gray-800 cursor-pointer hover:text-gray-500" 
                    onClick={()=>handleDoctorClick(doctor._id)}
                    >
                      {doctor.personalInfo.name}
                    </h2>
                    <p className="text-gray-500 font-bold flex items-center space-x-1">
                      <span>{doctor.professionalInfo.specialization}</span>
                      <TbPointFilled className="w-2" />
                      <span>
                        {doctor.professionalInfo.experience} years experience
                      </span>
                    </p>

                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-500">
                        <span className="font-medium text-gray-700">
                          Experience:
                        </span>{" "}
                        {doctor.professionalInfo.experience}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium text-gray-700">Rating:</span>{" "}
                        {doctor.rating}/5
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium text-gray-700">
                          Consultation Fee:
                        </span>{" "}
                        {doctor.consultationFee}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium text-gray-700">
                          Consultation Mode:
                        </span>{" "}
                        {doctor.consultationMode}
                      </p>
                    </div>
                    <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">
                      Book Appointment
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Popup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        filterOptions={filterOptions}
        activeFilter={activeFilter}
        dropdownContent={dropdownContent} // Pass dropdown content
        onFilterSelect={handleFilterSelect} // Pass filter select handler
        onSelectOption={handleSelectOption} // Pass option select handler
      />
    </div>
  );
};

const ButtonWithIcon: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <button className="flex items-center space-x-2 px-2 md:px-4 py-2 rounded-md hover:bg-slate-400 transition-colors duration-200">
    <span className="text-lg md:text-xl">{icon}</span>
    <span className="text-sm font-medium whitespace-nowrap">{text}</span>
  </button>
);

export default SearchComponent;
