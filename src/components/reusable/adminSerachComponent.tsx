import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import useFetchData from '../../hooks/useFetchData';

interface SearchComponentProps {
    onSearch: (searchTerm: string) => void;
}

const SearchComponent: React.FC<SearchComponentProps> = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    useEffect(() => {
      const { data, loading, error } = useFetchData("", searchTerm);
    },[searchTerm])

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(value); // Call the parent function with the new search term
    };

    return (
        <div className='relative flex items-center w-full max-w-lg mx-auto h-10'>
          {/* Search Icon */}
          <FaSearch className='absolute left-3 text-gray-400' />
          
          {/* Search Input */}
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search..."
            className='pl-10 pr-4 py-2 w-full h-full border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500'
          />
        </div>
    );
};

export default SearchComponent;
