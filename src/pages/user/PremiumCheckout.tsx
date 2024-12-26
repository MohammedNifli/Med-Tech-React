import { RootState } from '@/reduxStore/store';
import axiosInstance from '@/utils/axiosClient';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';


const PremiumCheckout: React.FC = () => {
  const userId=useSelector((state:RootState)=>state.auth.user?._id)
  const [premiumAmount,setPremiumAmount]=useState(0)

  useEffect(()=>{
    const fetchPremiumRate=async()=>{
      const response=await axiosInstance.get('/admin/amounts')
      setPremiumAmount(response?.data?.amounts?.premiumAmount)
      console.log('amounts',response)
    }

    fetchPremiumRate()
  },[])
    
  const handlePayment = async () => {
    const amount = premiumAmount;
    
    try {
        const response = await axiosInstance.post(`/user/premium-payment`, { amount, userId });
        if (response?.data?.url) {
            // Redirect to the Stripe payment page
            window.location.href = response.data.url;
        } else {
            console.error("Payment URL not found");
        }
    } catch (error) {
        console.error("Error initiating payment:", error);
        alert("Something went wrong. Please try again.");
    }
};
  return (
    <div className="mt-10 *:w-screen h-screen flex items-center justify-center bg-white ">
      <div className="w-full max-w-4xl bg-white shadow-2xl border-2 border-blue-100 rounded-xl flex flex-col md:flex-row overflow-hidden">
        {/* Plan Details Section */}
        <div className="p-8 w-full md:w-1/2 bg-white">
          <div className="space-y-6">
            <h1 className="text-3xl font-extrabold text-blue-900 mb-4">Premium Membership</h1>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Elevate your healthcare experience with Med-Tech&apos;s premium membership. Unlock exclusive benefits and personalized care.
            </p>
            
            <ul className="space-y-3 mb-6 text-gray-700">
              <li className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Unlimited doctor consultations</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Priority premium services</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Exclusive appointment discounts</span>
              </li>
            </ul>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-blue-900">Annual Membership</span>
                <span className="text-2xl font-extrabold text-blue-700">₹{premiumAmount}</span>
              </div>
            </div>
            
            <button onClick={handlePayment} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              Proceed to Payment
            </button>
          </div>
        </div>

        {/* Payment Image Section */}
        <div className="hidden md:flex md:w-1/2 bg-blue-100 justify-center items-center p-8">
          <img
            src="/pictures/payment.png"
            alt="Payment Illustration"
            className="max-w-full h-auto rounded-xl shadow-xl"
          />
        </div>
      </div>
    </div>
  );
};

export default PremiumCheckout;