
// import axios from "axios";
import axiosInstance from "../utils/axiosClient";

export const adminLogin=async(email:string,password:string)=>{
    return axiosInstance.post('/admin/login',{email,password})
}

export const fetchingDoctorDetails=async()=>{
    return axiosInstance.get('/admin/doctors')
}



// export const fetchingUserDetails = async (): Promise<{ fetchingAllUsers: User[] }> => {
//     return axiosInstance.get('/admin/users');
//   };

export const blockUser=async(userId:string)=>{
    return axiosInstance.patch(`/admin/user-block/${userId}`);
}
  
export const unBlockUser=async(userId:string)=>{
    return axiosInstance.patch(`/admin/user-unblock/${userId}`)
}


export const approveApplication=async(Id:string)=>{
    return axiosInstance.post(`/admin/verify?id=${Id}`)
}

export const rejectApplication=async(Id:string)=>{
    return axiosInstance.post(`/admin/reject?id=${Id}`)
}



export const blockDoctor = async (doctorId: string) => {
    return await axiosInstance.post(`/admin/doctor-block/${doctorId}`);
};

// Unblock a doctor by their ID
export const unblockDoctor = async (doctorId: string) => {
    return await axiosInstance.post(`/admin/doctor-unblock/${doctorId}`);
};

