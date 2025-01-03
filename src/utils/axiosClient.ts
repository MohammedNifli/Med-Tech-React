

import axios from "axios";



const axiosInstance = axios.create({
  baseURL: "https://med-tech.site",

  withCredentials: true, 
});


axiosInstance.interceptors.request.use(
  (config) => {
 
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
   
    if (error.response) {
      
      alert(`Error: ${error.response.data.message || "An error occurred"}`);
    } else if (error.request) {
      // Request was made but no response was received
      console.error("Error Request:", error.request);
      alert("Error: No response from server");
    } else {
      // Something happened in setting up the request
      console.error("Error Message:", error.message);
      alert(`Error: ${error.message}`);
    }

    return Promise.reject(error); // Propagate the error to the calling code
  }
);

export default axiosInstance;
