import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



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
      toast.error(`Error: ${error.response.data.message || "An error occurred"}`);
    } else if (error.request) {
     ;
      toast.error("Error: No response from server");
    } else {
 
      toast.error(`Error: ${error.message}`);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
