import { useLocation } from "react-router-dom";
import OTPComponent from "../../components/reusable/otpCompnent";
import React, { useEffect } from "react";
import { doctorOTPFunc, doctorResendOTP } from "../../services/doctorServices";
import axiosInstance from "@/utils/axiosClient";
import axios from "axios";


const DoctorOTPPage:React.FC = () => {
  const location = useLocation();
  const { email,doctorId } = location.state as { email: string,doctorId:string };

  useEffect(()=>{
    console.log("doctoriii",doctorId)
  })

  const handleSubmit = async (otp: string) => {
    try {
      const response = await doctorOTPFunc(otp, email);
      console.log('response',response)
      if (response.status === 200) {
        console.log("heolloo")
          const resp = await axios.post(`http://localhost:4444/doc-wallet/new-wallet?id=${doctorId}`,);
    console.log('resp', resp);
    window.location.href = `/doctor/login`;
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  const handleResend = async () => {
    try {
      await doctorResendOTP();
      console.log("OTP resent successfully");
    } catch (error) {
      console.error("Error resending OTP:", error);
    }
  };

  return (
    <OTPComponent
      onSubmit={handleSubmit}
      onResend={handleResend}
      imageSrc="/pictures/Enter OTP.png"
      heading="Doctor Verification"
      otpLength={4}
      timerDuration={60}
    />
  );
};
export default DoctorOTPPage;
