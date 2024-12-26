import React, { useState } from 'react';
import { Star, Video, MessageSquare, ChevronDown, ChevronUp, Users, Clock, Filter, DollarSign, MapPin } from 'lucide-react';

interface FilterState {
  availability: string[];
  consultationFee: string[];
  gender: string[];
  experience: string[];
  rating: string[];
  mode: string[];
}

interface FindDoctorSidebarProps {
  onFilterChange: (filters: FilterState) => void;
}

const FindDoctorSidebar: React.FC<FindDoctorSidebarProps> = ({ onFilterChange }) => {
  const [expanded, setExpanded] = useState({
    gender: true,
    experience: true,
    rating: true,
    availability: true,
    consultationFee: true,
    mode: true,
  });

  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    availability: [],
    consultationFee: [],
    gender: [],
    experience: [],
    rating: [],
    mode: [],
  });

  const toggleSection = (section: keyof typeof expanded) => {
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCheckboxChange = (section: keyof FilterState, value: string) => {
    setSelectedFilters((prev) => {
      const currentValues = prev[section];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      
      const newFilters = { ...prev, [section]: newValues };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const resetFilters = () => {
    const emptyFilters: FilterState = {
      availability: [],
      consultationFee: [],
      gender: [],
      experience: [],
      rating: [],
      mode: [],
    };
    setSelectedFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const FilterSection = ({ 
    title, 
    section, 
    children 
  }: { 
    title: string; 
    section: keyof typeof expanded; 
    children: React.ReactNode 
  }) => (
    <div className="mb-6">
      <button 
        onClick={() => toggleSection(section)} 
        className="w-full flex justify-between items-center group hover:bg-gray-50 p-2 rounded-lg"
      >
        <div className="flex items-center gap-2">
          {section === 'gender' && <Users className="w-5 h-5 text-cyan-500" />}
          {section === 'experience' && <Clock className="w-5 h-5 text-cyan-500" />}
          {section === 'rating' && <Star className="w-5 h-5 text-cyan-500" />}
          {section === 'mode' && <Video className="w-5 h-5 text-cyan-500" />}
          {section === 'consultationFee' && <DollarSign className="w-5 h-5 text-cyan-500" />}
          <h3 className="font-semibold text-gray-700 group-hover:text-cyan-600 transition-colors">{title}</h3>
        </div>
        {expanded[section] ? (
          <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-cyan-500 transition-colors" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-cyan-500 transition-colors" />
        )}
      </button>
      {expanded[section] && (
        <div className="mt-3 pl-7 space-y-3">
          {children}
        </div>
      )}
    </div>
  );

  const CheckboxLabel = ({ 
    section, 
    value, 
    children 
  }: { 
    section: keyof FilterState; 
    value: string; 
    children: React.ReactNode 
  }) => (
    <label className="flex items-center space-x-3 cursor-pointer group">
      <div className="relative">
        <input
          type="checkbox"
          className="peer hidden"
          checked={selectedFilters[section].includes(value)}
          onChange={() => handleCheckboxChange(section, value)}
        />
        <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:border-cyan-500 peer-checked:bg-cyan-500 transition-all group-hover:border-cyan-400" />
        <div className="absolute top-1 left-1 w-3 h-3 peer-checked:block hidden">
          <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <span className="text-gray-600 group-hover:text-gray-800 transition-colors">{children}</span>
    </label>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-6 h-6 text-cyan-500" />
          <h2 className="text-xl font-bold text-gray-800">Filters</h2>
        </div>
        <button 
          onClick={resetFilters}
          className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
        >
          Reset All
        </button>
      </div>

      <FilterSection title="Consultation Fee" section="consultationFee">
        {['Below 500', '500 - 1000', '1000 - 2000', 'Above 2000'].map((fee) => (
          <CheckboxLabel key={fee} section="consultationFee" value={fee.toLowerCase()}>
            ₹ {fee}
          </CheckboxLabel>
        ))}
      </FilterSection>

      <FilterSection title="Gender" section="gender">
        {['Male', 'Female'].map((gender) => (
          <CheckboxLabel key={gender} section="gender" value={gender.toLowerCase()}>
            {gender}
          </CheckboxLabel>
        ))}
      </FilterSection>

      <FilterSection title="Experience" section="experience">
        {['0-5 years', '5-10 years', '10-15 years', '15+ years'].map((range) => (
          <CheckboxLabel key={range} section="experience" value={range}>
            {range}
          </CheckboxLabel>
        ))}
      </FilterSection>

      <FilterSection title="Rating" section="rating">
        {[4, 3, 2].map((rating) => (
          <CheckboxLabel key={rating} section="rating" value={rating.toString()}>
            <div className="flex items-center gap-2">
              <span>{rating}+</span>
              <div className="flex">
                {[...Array(rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
          </CheckboxLabel>
        ))}
      </FilterSection>

      <FilterSection title="Consultation Mode" section="mode">
        <CheckboxLabel section="mode" value="video">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-cyan-500" />
            <span>Video Consultation</span>
          </div>
        </CheckboxLabel>
        <CheckboxLabel section="mode" value="chat">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-cyan-500" />
            <span>Chat Consultation</span>
          </div>
        </CheckboxLabel>
        <CheckboxLabel section="mode" value="offline">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-500" />
            <span>Offline Consultation</span>
          </div>
        </CheckboxLabel>
      </FilterSection>
    </div>
  );
};

export default FindDoctorSidebar;