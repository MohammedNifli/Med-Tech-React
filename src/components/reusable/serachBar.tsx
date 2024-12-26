import React, { useState, useEffect } from 'react';
// import Docdetails from '../../pages/user/Docdetails';

// Import the SearchBar component
// Inside serachBar.tsx, add this near the top of the file
interface SearchBarProps {
  specializations: string[];
  onSearch: (city: string, locality: string, specialization: string) => void;
}
const SearchBar: React.FC<SearchBarProps> = ({ specializations, onSearch }) => {
  const [city, setCity] = useState('');
  const [locality, setLocality] = useState('');
  const [specialization, setSpecialization] = useState(specializations[0]);

  const handleSearch = () => {
    onSearch(city, locality, specialization);
  };

  return (
    <div className="flex items-center space-x-2 p-2">
      <input
        type="text"
        placeholder="Enter city*"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2 w-52"
      />
      <input
        type="text"
        placeholder="Enter locality"
        value={locality}
        onChange={(e) => setLocality(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2 w-52"
      />
      <div className="relative">
        <select
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 w-full appearance-none"
        >
          {specializations.map((spec, index) => (
            <option key={index} value={spec}>
              {spec}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={handleSearch}
        className="bg-red-600 text-white px-4 py-2 rounded-md"
      >
        Search
      </button>
    </div>
  );
};

const Demo: React.FC = () => {
  const [ipAddress, setIpAddress] = useState('');
  const [geoInfo, setGeoInfo] = useState({
    city: '',
    country: '',
    region: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Define specializations for the SearchBar
  const specializations = ['Doctor', 'Lawyer', 'Engineer', 'Teacher', 'Accountant'];

  useEffect(() => {
    getVisitorIp();
  }, []);

  // Fetch visitor's IP address using ipify API
  const getVisitorIp = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      setIpAddress(data.ip);
      // Automatically fetch geolocation info after getting IP
      await fetchInfo(data.ip);
    } catch (error) {
      console.error('Error fetching IP address:', error);
      setError('Failed to fetch IP address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update the state with the manually entered IP address
  const handleIp = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIpAddress(e.target.value);
  };

  // Fetch geolocation info using ipapi.co (free service)
  const fetchInfo = async (ip: string = ipAddress) => {
    setLoading(true);
    setError('');
    try {
      // Check if the IP address is valid
      if (!isValidIpAddress(ip)) {
        throw new Error('Invalid IP address');
      }

      const response = await fetch(`https://ipapi.co/${ip}/json/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Geolocation API response:', data);

      if (data.error) {
        throw new Error(data.reason || 'Failed to fetch geolocation data');
      }

      setGeoInfo({
        city: data.city || 'N/A',
        country: data.country_name || 'N/A',
        region: data.region || 'N/A',
        // eslint-disable-next-line no-constant-binary-expression
        location: `${data.latitude}, ${data.longitude}` || 'N/A',
      });
    } catch (error:unknown) {
      let errorMessage = '';
    if (error instanceof Error) {
      errorMessage = error.message || 'Error fetching geolocation info. Please try again.';
    } else {
      errorMessage = 'An unexpected error occurred';
    }
    setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Function to validate IPv4 and IPv6 addresses
  const isValidIpAddress = (ip: string) => {
    const ipv4Pattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Pattern = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;

    return ipv4Pattern.test(ip) || ipv6Pattern.test(ip);
  };

  // Handle search from SearchBar
  const handleSearch = (city: string, locality: string, specialization: string) => {
    console.log('Search params:', { city, locality, specialization });
    // You can implement the search logic here
    // For now, we'll just update the geoInfo state with the search parameters
    setGeoInfo({
      ...geoInfo,
      city: city || geoInfo.city,
      region: locality || geoInfo.region,
    });
  };

  return (
    <div className='m-8'>
      <h1 className='text-2xl font-bold mb-4'>IP Location Finder</h1>
      
      {/* Include the SearchBar component */}
      <SearchBar specializations={specializations} onSearch={handleSearch} />
      
      <div className='mb-4 mt-4'>
        <input
          type='text'
          className='border border-gray-300 rounded px-2 py-1 mr-2'
          value={ipAddress}
          onChange={handleIp}
          placeholder='Enter IP Address'
        />
        <button 
          onClick={() => fetchInfo()} 
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded'
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Get Info'}
        </button>
        <button 
          onClick={getVisitorIp} 
          className='ml-2 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 rounded'
          disabled={loading}
        >
          Get My IP
        </button>
      </div>

      {error && <p className='text-red-500 mb-4'>{error}</p>}

      {/* Display the geolocation information */}
      <div className='mt-4'>
        <h3 className='text-xl font-semibold mb-2'>Geolocation Info:</h3>
        <p><strong>IP Address:</strong> {ipAddress}</p>
        <p><strong>City:</strong> {geoInfo.city}</p>
        <p><strong>Region:</strong> {geoInfo.region}</p>
        <p><strong>Country:</strong> {geoInfo.country}</p>
        <p><strong>Location:</strong> {geoInfo.location}</p>
      </div>
    </div>
  );
};

export default Demo;