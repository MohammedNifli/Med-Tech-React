import React from 'react';
import SearchComponent from '../reusable/adminSerachComponent';

const AdminHeader: React.FC<{ onSearch: (searchTerm: string) => void }> = ({ onSearch }) => {
  
  
  return (

    <div className='border border-white w-full h-20'>
      <div className='border ml-2 border-white shadow-lg h-20 mr-2 flex items-center justify-between'>
        {/* Search bar container */}
        <SearchComponent onSearch={onSearch} />
      </div>
    </div>
  );
};

export default AdminHeader;
