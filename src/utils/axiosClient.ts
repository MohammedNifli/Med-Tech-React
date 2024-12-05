// src/utils/axiosClient.js

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4444', // Set your base URL here
  withCredentials: true,
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
