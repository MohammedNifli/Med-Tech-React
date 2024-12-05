
import axios from "axios"
import axiosInstance from "../utils/axiosClient"

export const  doctorApprovalStatus=async(doctorId:string)=>{
    return axiosInstance.get(`/doctor/status/${doctorId}`)
}

export const applyForApproval=async(doctorId:string,formData:unknown)=>{
    return axiosInstance.put(`/doctor/approval/${doctorId}`,formData)
}

export const doctorLogin = async(email: string, password: string) => {
    return axiosInstance.post('/doctor/login', { email, password });
}

export const doctorSignUp=async(name:string,email:string,phoneNumber:string,password:string)=>{
    return axiosInstance.post('/doctor/register',{name,email,phoneNumber,password})
}


export const doctorOTPFunc=async(otp:string,email:string)=>{
    return axiosInstance.post(`/otp/doctor/verify`,{otp,email})
}

export const doctorResendOTP=async()=>{
    return axiosInstance.post('/otp/doctor/send',{})
}