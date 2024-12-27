// src/utils/axiosClient.js

import axios from 'axios';

const token = localStorage.getItem("token");  // Or from cookies if you're storing it there
const axiosInstance = axios.create({
  baseURL: "https://med-tech.site", 
  headers: {
    Authorization: `Bearer ${token}`  // Set the Authorization header
  },
  withCredentials: true,  // Ensure this is enabled for cross-origin requests
});
// Axios request interceptor (optional)
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add token or any headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Axios response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally
    if (error.response) {
      // Server responded with a status code outside the 2xx range
      console.error('Error Response:', error.response.data);
      alert(`Error: ${error.response.data.message || 'An error occurred'}`);
    } else if (error.request) {
      // Request was made but no response was received
      console.error('Error Request:', error.request);
      alert('Error: No response from server');
    } else {
      // Something happened in setting up the request
      console.error('Error Message:', error.message);
      alert(`Error: ${error.message}`);
    }

    return Promise.reject(error); // Propagate the error to the calling code
  }
);

export default axiosInstance;
