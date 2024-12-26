import axiosInstance from "@/utils/axiosClient";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

// Props interface for dynamic content
const PaymentSuccess: React.FC = () => {
    const navigate=useNavigate()
  const [searchParams] = useSearchParams();

  // Retrieve userId and amount from query parameters
  const userId = searchParams.get("userId");
  const amount = searchParams.get("amount");

  console.log("userId & amount", userId, amount);


  const handleUser=async()=>{
    const data=await axiosInstance.post(`/user/premium-status?id=${userId}`);
    console.log('wowoowowow',data)
  }
  const handleTransaction=async()=>{
    try{
        const data= await axiosInstance.post('/admin/amount',{amount,userId});
        console.log('success',data);
        
    }catch(error){
        console.log(error)
    }
  }

  const handleButtonClick = () => {
    handleUser();
    handleTransaction();
    navigate('/')
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center w-full sm:w-96">
        {/* Icon Section */}
        <div className="flex justify-center mb-4">
          <img
            src="/pictures/premium-pay.png"
            alt="Success Icon"
            className="w-16 h-16"
          />
        </div>

        {/* Title Section */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Payment Process Successfully Completed!
        </h1>

        {/* Subtitle Section */}
        <p className="text-gray-600 text-sm mb-6">
          You have successfully completed the premium buying process. Explore
          your opportunities!
        </p>

        {/* Amount and User ID Display */}
        {/* <p className="text-lg text-gray-700 mb-4">
          <strong>User ID:</strong> {userId || "Not provided"}
        </p>
        <p className="text-lg text-gray-700 mb-4">
          <strong>Amount Paid:</strong> ₹{amount || "Not provided"}
        </p> */}

        {/* Button Section */}
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            onClick={handleButtonClick}
            
          >
            Click Ok
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
