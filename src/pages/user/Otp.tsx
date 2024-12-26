import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import OTPComponent from '../../components/reusable/otpCompnent';
import { toast } from 'react-toastify';
import { otpResend, verifyOtp } from '../../services/userServices';

// User OTP Page
export const UserOTPPage:React.FC = () => {
  const location = useLocation();
  const email:string = location.state?.email || '';
  const navigate = useNavigate();

  const handleSubmit = async (otp: string) => {
    // Call the service function to verify OTP
    const response = await verifyOtp(otp, email);
  
    // If the response is successful, show success message and navigate
    if (response.status === 200) {
      toast.success('OTP verified successfully');
      navigate('/login');
    }
  };   

  const handleResend = async () => {
    
      console.log("this is handle resend func")
      const response=await otpResend(email)
      if(response.status>=200){
      toast.success('otp resended succefully')
      console.log("OTP resent successfully");
      }
  
      toast.error('otp is not resended,Try again')
      
      console.error('Error resending OTP:');
    
  };

  return (
    <OTPComponent
      onSubmit={handleSubmit}
      onResend={handleResend}
      imageSrc="/pictures/Enter OTP-pana.png"
      heading="User Verification"
    />
  );
};

export default UserOTPPage;