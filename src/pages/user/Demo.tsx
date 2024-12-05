import React, { useState, useEffect } from 'react';

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
        location: `${data.latitude}, ${data.longitude}` || 'N/A',
      });
    } catch (error) {
      console.error('Error fetching geolocation info:', error);
      setError(error.message || 'Error fetching geolocation info. Please try again.');
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

  return (
    <div className='m-32'>
      <h1 className='text-2xl font-bold mb-4'>IP Location Finder</h1>
      <div className='mb-4'>
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