import axiosInstance from "../utils/axiosClient";

export const loginUser = async (formData: unknown) => {
  const response = await axiosInstance.post("/user/login", formData);
  return response;
};

export const googleLogin = async (tokenData: { token: string }) => {
  const response = await axiosInstance.post("/user/auth/google", tokenData);
  return response.data;
};

export const verifyOtp = async (otp: string, email: string) => {
  return axiosInstance.post("/otp/verify", { otp, email });
};

export const otpResend = async (email: string) => {
  return axiosInstance.post("/otp/resend", email);
};

export const userSignUp = async (formData: unknown) => {
  return axiosInstance.post("/user/register", formData);
};

export const fetchingProfileDetaills = async (userId: string) => {
  return axiosInstance.get(`/user/profile/${userId}`);
};

export const updateUserProfile = async (userId: string, formData: unknown) => {
  return axiosInstance.put(`/user/profile/${userId}`, formData);
};




export const fetchingAllOnlineAppointments = async (userId:string) => {
  try {
    const response = await axiosInstance.get(`/appointment/online-appointments?id=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching online appointments:', error);
    throw error; // Re-throw to handle error in calling function
  }
};

export const addFeedBackAndRating = async (userId:string,
  patientId:string,
  doctorId:string,
  feedback:string,
  rating:number,) => {
  try {
    const response = await axiosInstance.post(`/feedback/add`, { userId,patientId,doctorId, feedback,rating });
    return response;
  } catch (error) {
    console.log(error);
    throw Error('error fetching addFeedBackAndRating ' + error);
  }
};


export const fetchedFeedbackAndRating = async (
  userId: string,
  patientId: string,
  doctorId: string
) => {
  try {
    const response = await axiosInstance.get(`/feedback/feed-rating`, {
      params: {
        userId,
        patientId,
        doctorId,
      },
    });
    console.log("response", response);
    return response;
  } catch (error) {
    console.log(error);
    throw new Error('Error fetching fetchedFeedbackAndRating: ' + error);
  }
};




//Offline-consultaions

export const fetchingAllOfflineAppointments=async(userId:string)=>{
  try{
    const response=await axiosInstance.get(`/appointment/offline-appointments?id=${userId}`);
    return response;

  }catch(error){
    console.log(error)
  }

}


export const checkFeedbackAvailable=async(userId:string, doctorId:string, patientId:string)=>{

  const response = await axiosInstance.get(`/feedback/feed-rating`, {
    params: {
      userId,
      patientId,
      doctorId,
    },
  });
  return response;

}
